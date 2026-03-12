(function () {
  const dataset = (window.ENGLISH_DATA && window.ENGLISH_DATA.sets) || [];
  const app = document.getElementById('app');

  const STORAGE_USERS = 'englishProject_users';
  const STORAGE_CURRENT_USER = 'englishProject_currentUser';
  const STORAGE_SORT = 'englishProject_currentSort';
  const N8N_NEXT_WEBHOOK = 'https://n8n.srv1237100.hstgr.cloud/webhook/next-question';
  const N8N_DONE_WEBHOOK = 'https://n8n.srv1237100.hstgr.cloud/webhook/analyze-performance';

  const state = {
    screen: 'home',
    authView: 'login',
    authError: '',
    showUserMenu: false,
    showChoiceModal: false,
    selectedSetId: null,
    currentSort: localStorage.getItem(STORAGE_SORT) || 'default',
    currentUser: localStorage.getItem(STORAGE_CURRENT_USER) || '',
    inputUser: '',
    inputPass: '',
    prepSetId: null,
    prepStarted: false,
    prepTimerText: '01:00',
    speakSetId: null,
    speakPhase: 'intro1',
    countdownVal: 3,
    isThinking: false,
    isSaved: false,
    aiQuestion: '',
    hasShownExpandPrompt: false,
    isFinalPromptReached: false,
    elapsedSeconds: 0,
    elapsedText: '00:00',
    showReturnPopup: false,
    isTimeout: false,
    returnCountdown: 3,
    mediaRecorder: null,
    stream: null,
    currentChunks: [],
    recordingsList: [],
    remainingQuestions: [],
    conversationHistory: [],
    analysisLoading: false,
    analysisHtml: '',
    analysisError: '',
    analysisSetId: null,
    analysisTitle: ''
  };

  let prepInterval = null;
  let introTimeouts = [];
  let speakingTimer = null;
  let returnInterval = null;

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}');
    } catch (error) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }

  function getCurrentUserHistory() {
    const users = getUsers();
    return state.currentUser && users[state.currentUser] ? users[state.currentUser].history || [] : [];
  }

  function getTimestamp(setId) {
    if (!state.currentUser) return null;
    try {
      return JSON.parse(localStorage.getItem(`time_${state.currentUser}_${setId}`) || 'null');
    } catch (error) {
      return null;
    }
  }

  function saveTimestamp(setId) {
    if (!state.currentUser) return;
    const now = new Date();
    const value = {
      date: `${String(now.getFullYear()).slice(-2)}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`,
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    };
    localStorage.setItem(`time_${state.currentUser}_${setId}`, JSON.stringify(value));
  }

  function getSortedData() {
    const history = getCurrentUserHistory();
    let data = dataset.map((item) => {
      const done = history.includes(item.setNumber);
      return {
        ...item,
        isClicked: done,
        completionTime: done ? getTimestamp(item.setNumber) : null
      };
    });

    if (state.currentSort === 'themes') {
      data = data.sort((a, b) => (a.theme || '').localeCompare(b.theme || ''));
    } else if (state.currentSort === 'not-done') {
      data = [...data.filter((item) => !item.isClicked), ...data.filter((item) => item.isClicked)];
    }

    return data;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function escapeAttribute(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function sanitizeInlineStyle(styleText) {
    const allowed = new Set([
      'background-color',
      'border',
      'border-radius',
      'color',
      'display',
      'font-size',
      'font-weight',
      'gap',
      'line-height',
      'margin',
      'margin-bottom',
      'margin-right',
      'margin-top',
      'padding',
      'text-align'
    ]);

    return String(styleText || '')
      .split(';')
      .map(function (rule) { return rule.trim(); })
      .filter(Boolean)
      .map(function (rule) {
        const colonIndex = rule.indexOf(':');
        if (colonIndex === -1) return '';
        const property = rule.slice(0, colonIndex).trim().toLowerCase();
        const value = rule.slice(colonIndex + 1).trim();
        if (!allowed.has(property) || !value) return '';
        return `${property}:${value}`;
      })
      .filter(Boolean)
      .join(';');
  }

  function decodeHtmlEntities(value) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = String(value || '');
    return textarea.value;
  }

  function sanitizeReportHtml(value) {
    const original = String(value || '');
    const raw = /&lt;\/?(div|br|span|b|strong|p|ul|ol|li|em|i|u)\b/i.test(original)
      ? decodeHtmlEntities(original)
      : original;
    if (!raw.trim()) return '';

    const template = document.createElement('template');
    template.innerHTML = raw;

    const allowedTags = new Set(['B', 'BR', 'DIV', 'EM', 'I', 'LI', 'OL', 'P', 'SPAN', 'STRONG', 'U', 'UL']);

    function sanitizeNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return escapeHtml(node.textContent || '');
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }

      const tag = node.tagName.toUpperCase();
      if (tag === 'SCRIPT' || tag === 'STYLE') {
        return '';
      }
      const children = Array.from(node.childNodes).map(sanitizeNode).join('');

      if (!allowedTags.has(tag)) {
        return children;
      }

      if (tag === 'BR') {
        return '<br>';
      }

      const attrs = [];
      if (node.hasAttribute('style')) {
        const style = sanitizeInlineStyle(node.getAttribute('style'));
        if (style) {
          attrs.push(` style="${escapeAttribute(style)}"`);
        }
      }

      return `<${tag.toLowerCase()}${attrs.join('')}>${children}</${tag.toLowerCase()}>`;
    }

    return Array.from(template.content.childNodes).map(sanitizeNode).join('');
  }

  function formatReportSection(value, fallback) {
    const content = String(value || '').trim();
    if (!content) {
      return escapeHtml(fallback).replace(/\n/g, '<br>');
    }

    const hasMarkup = /<\/?[a-z][\s\S]*>/i.test(content);
    const hasEscapedMarkup = /&lt;\/?[a-z][\s\S]*&gt;/i.test(content);
    if (hasMarkup || hasEscapedMarkup) {
      return sanitizeReportHtml(content);
    }

    return escapeHtml(content).replace(/\n/g, '<br>');
  }

  function formatReport(data) {
    if (typeof data === 'string') {
      return formatReportSection(data, '');
    }

    if (data.score === '0/3.0' && data.grammar === 'N/A') {
      return `
        <div style="display:flex;gap:10px;align-items:baseline;margin-bottom:18px;">
          <span style="font-size:19px;font-weight:800;color:#3b66ff;">Score</span>
          <span style="font-size:18px;font-weight:700;">${escapeHtml(data.score || 'N/A')}</span>
        </div>
        <div style="padding:20px;border-radius:18px;background:#fff1f0;border:2px dashed #ffccc7;text-align:center;">
          <div style="font-size:36px;margin-bottom:10px;">🎙️</div>
          <div style="color:#ff4d4f;font-weight:700;line-height:1.6;">${escapeHtml(data.feedback || "We didn't catch any audio. Please try again.")}</div>
        </div>
      `;
    }

    const grammar = data.grammar && data.grammar.trim() && data.grammar.toLowerCase() !== 'none'
      ? data.grammar
      : 'Great job! Your grammar was excellent, and no major mistakes were detected.';

    return `
      <div style="display:flex;gap:10px;align-items:baseline;margin-bottom:18px;">
        <span style="font-size:19px;font-weight:800;color:#3b66ff;">Score</span>
        <span style="font-size:18px;font-weight:700;">${escapeHtml(data.score || 'N/A')}</span>
      </div>
      <div style="font-size:18px;font-weight:800;color:#3b66ff;margin:14px 0 6px;">Overall Feedback</div>
      <div>${formatReportSection(data.feedback, 'No feedback')}</div>
      <div style="font-size:18px;font-weight:800;color:#3b66ff;margin:14px 0 6px;">Pronunciation</div>
      <div>${formatReportSection(data.pronunciation_feedback, 'No specific comments.')}</div>
      <div style="font-size:18px;font-weight:800;color:#3b66ff;margin:14px 0 6px;">Vocabulary</div>
      <div>${formatReportSection(data.vocabulary, 'None')}</div>
      <div style="font-size:18px;font-weight:800;color:#3b66ff;margin:14px 0 6px;">Grammar Analysis</div>
      <div>${formatReportSection(grammar, 'Great job! Your grammar was excellent, and no major mistakes were detected.')}</div>
    `;
  }

  function cleanupTimers() {
    clearInterval(prepInterval);
    clearInterval(speakingTimer);
    clearInterval(returnInterval);
    introTimeouts.forEach(clearTimeout);
    introTimeouts = [];
  }

  function stopMedia() {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      state.mediaRecorder.stop();
    }
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
    }
    state.mediaRecorder = null;
    state.stream = null;
    state.currentChunks = [];
  }

  function render() {
    app.innerHTML = `
      <div class="app-shell">
        ${state.screen === 'home' ? renderHome() : ''}
        ${state.screen === 'prep' ? renderPrep() : ''}
        ${state.screen === 'speak' ? renderSpeak() : ''}
        ${state.screen === 'analysis' ? renderAnalysis() : ''}
      </div>
      ${state.showChoiceModal ? renderChoiceModal() : ''}
    `;
    bindEvents();
  }

  function renderUserArea() {
    if (!state.currentUser) return '<button class="icon-btn" data-action="show-auth">登入</button>';
    return `
      <div>
        <button class="user-chip" data-action="toggle-user-menu">
          <span class="user-name">${escapeHtml(state.currentUser)}</span>
          <span class="avatar">${escapeHtml(state.currentUser.slice(0, 1).toUpperCase() || 'U')}</span>
        </button>
        ${state.showUserMenu ? `
          <div class="menu-list card user-menu">
            <button data-action="logout">Log Out</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderHome() {
    const cards = getSortedData();
    return `
      <section class="screen">
        <div class="topbar">
          <div style="width:46px"></div>
          <div class="page-heading">
            <span class="eyebrow">Speaking Task 1</span>
            <h1 class="title">Role Play</h1>
          </div>
          ${renderUserArea()}
        </div>
        <div class="status-row">
          <div class="pill">Scenarios</div>
          <select class="sort-select" data-action="change-sort">
            <option value="default" ${state.currentSort === 'default' ? 'selected' : ''}>Default</option>
            <option value="themes" ${state.currentSort === 'themes' ? 'selected' : ''}>Themes</option>
            <option value="not-done" ${state.currentSort === 'not-done' ? 'selected' : ''}>Not Done</option>
          </select>
        </div>
        ${state.currentUser ? '' : renderAuthCardInline()}
        <div class="grid">
          ${cards.map((item) => `
            <button class="practice-card ${item.isClicked ? 'done' : ''}" data-action="open-choice" data-set-id="${item.setNumber}">
              <h3>${escapeHtml(item.title)}</h3>
              <div class="card-emoji">${escapeHtml(item.emoji || '📝')}</div>
              ${item.completionTime ? `<div class="card-time">${escapeHtml(item.completionTime.date)}<br>${escapeHtml(item.completionTime.time)}</div>` : ''}
            </button>
          `).join('')}
        </div>
        <div class="footer-space"></div>
      </section>
    `;
  }

  function renderAuthCardInline() {
    return `
      <div class="auth-wrap" style="margin-bottom:18px;">
        <div class="auth-card">
          <h2>${state.authView === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p class="subtitle">${state.authView === 'login' ? '先登入再開始練習與查看結果。' : '建立帳號後，練習紀錄會保存在這台裝置。'}</p>
          <label class="field">
            <input type="text" name="username" placeholder="${state.authView === 'login' ? 'Username' : 'Create Username'}" value="${escapeHtml(state.inputUser)}">
          </label>
          <label class="field">
            <input type="password" name="password" placeholder="${state.authView === 'login' ? 'Password' : 'Create Password'}" value="${escapeHtml(state.inputPass)}">
          </label>
          <div class="error-text">${escapeHtml(state.authError)}</div>
          <button class="primary-btn" data-action="${state.authView === 'login' ? 'login' : 'signup'}">${state.authView === 'login' ? 'Log In' : 'Sign Up'}</button>
          <div class="switch-text">
            ${state.authView === 'login' ? 'New here?' : 'Already have an account?'}
            <button data-action="switch-auth">${state.authView === 'login' ? 'Sign Up' : 'Log In'}</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderPrep() {
    const card = dataset.find((item) => String(item.setNumber) === String(state.prepSetId)) || {};
    return `
      <section class="screen prep-layout">
        <div class="topbar">
          <button class="back-btn" data-action="go-home">←</button>
          <div class="page-heading">
            <span class="eyebrow">Set ${escapeHtml(state.prepSetId || '')}</span>
            <h1 class="title">${escapeHtml(card.title || '')}</h1>
          </div>
          <div style="width:46px"></div>
        </div>
        <div class="center-grow">
          ${!state.prepStarted ? `
            <div class="hero-note">
              <div>There will be one minute for you to prepare.</div>
              <div>You can prepare a piece of paper to write down ideas.</div>
            </div>
            <button class="start-bubble" data-action="start-prep">Start</button>
          ` : `
            <div class="content-card">
              <div class="role-block"><strong>Your Role:</strong> ${escapeHtml(card.candidateRole || '')}</div>
              <div class="role-block"><strong>Examiner's Role:</strong> ${escapeHtml(card.examinerRole || '')}</div>
              <div class="role-block" style="margin-top:14px;"><span class="context-label">Context</span><br>${escapeHtml(card.cue || '')}</div>
              <div class="task-list" style="margin-top:14px;">${(card.candidateCueCard || []).map((line) => `• ${escapeHtml(line)}`).join('<br>')}</div>
            </div>
            <div class="count-card" style="text-align:center;">
              <div class="title" style="font-size:2.2rem;color:var(--primary);">${state.prepTimerText}</div>
            </div>
            <button class="primary-btn" data-action="skip-prep">Ready to speak</button>
          `}
        </div>
      </section>
    `;
  }

  function renderSpeak() {
    const card = dataset.find((item) => String(item.setNumber) === String(state.speakSetId)) || {};
    const isSpeaking = state.speakPhase === 'speaking';
    return `
      <section class="screen speak-layout">
        <div class="topbar">
          <button class="back-btn" data-action="go-prep">←</button>
          <div class="page-heading">
            <span class="eyebrow">Set ${escapeHtml(state.speakSetId || '')}</span>
            <h1 class="title">${escapeHtml(card.title || '')}</h1>
          </div>
          <div style="width:46px"></div>
        </div>
        ${!isSpeaking ? `
          <div class="center-grow">
            <div class="hero-note">${escapeHtml(state.speakPhase === 'intro1' ? 'You will have 2 minutes to speak.' : state.speakPhase === 'intro2' ? 'You can start in...' : '')}</div>
            ${state.speakPhase === 'countdown' ? `<div class="countdown">${state.countdownVal}</div>` : ''}
          </div>
        ` : `
          <div class="center-grow">
            <div class="inline-actions speaking-status">
              <span class="record-dot"></span>
              <span>Speaking</span>
              <span class="timer">${state.elapsedText}</span>
            </div>
            <div class="content-card">
              <div class="role-block"><strong>Your Role:</strong> ${escapeHtml(card.candidateRole || '')}</div>
              <div class="role-block"><strong>Examiner's Role:</strong> ${escapeHtml(card.examinerRole || '')}</div>
              <div class="role-block" style="margin-top:14px;"><span class="context-label">Context</span><br>${escapeHtml(card.cue || '')}</div>
              <div class="task-list" style="margin-top:14px;">${(card.candidateCueCard || []).map((line) => `• ${escapeHtml(line)}`).join('<br>')}</div>
            </div>
            <div class="message-card">
              ${state.isThinking ? `
                <p class="message-copy" style="color:var(--primary);font-weight:800;">AI is thinking...</p>
              ` : state.aiQuestion ? `
                <p class="message-label">Examiner (AI)</p>
                <p class="message-copy">${escapeHtml(state.aiQuestion)}</p>
              ` : `
                <p class="placeholder-copy">Press Next to get a follow-up question. Press Done to see your results.</p>
              `}
            </div>
            <div class="action-row">
              <button class="secondary-btn" data-action="next-question" ${state.isThinking || state.isSaved ? 'disabled' : ''}>Next</button>
              <button class="primary-btn" data-action="done-speaking">${state.isSaved ? 'Saved' : 'Done'}</button>
            </div>
          </div>
        `}
      </section>
      ${state.showReturnPopup ? `
        <div class="modal-overlay">
          <div class="modal">
            ${state.isTimeout ? '<p style="color:#ff4d4f;font-weight:800;">You have reached two minutes.</p>' : ''}
            <p style="margin:0;font-weight:800;color:#3b66ff;">Transferring to analysis in ${state.returnCountdown}...</p>
          </div>
        </div>
      ` : ''}
    `;
  }

  function renderAnalysis() {
    return `
      <section class="screen analysis-layout">
        <div class="topbar">
          <button class="back-btn" data-action="go-home">←</button>
          <div class="page-heading">
            <span class="eyebrow">Performance Report</span>
            <h1 class="title">${escapeHtml(state.analysisTitle || '')}</h1>
          </div>
          <div style="width:46px"></div>
        </div>
        ${state.analysisLoading ? `
          <div class="result-card loading-card">
            <div class="spinner"></div>
            <div class="section-title">Analyzing</div>
            <div class="subtitle">This may take a few seconds.</div>
          </div>
        ` : state.analysisError ? `
          <div class="result-card empty-card">
            <p>${escapeHtml(state.analysisError)}</p>
          </div>
        ` : `
          <div class="result-card">
            <div class="report-html">${state.analysisHtml}</div>
          </div>
        `}
        <div class="result-actions">
          <button class="primary-btn" data-action="go-home">Back to Home</button>
        </div>
      </section>
    `;
  }

  function renderChoiceModal() {
    return `
      <div class="modal-overlay">
        <div class="modal">
          <h2>Set ${escapeHtml(state.selectedSetId || '')}</h2>
          <p class="subtitle">選擇要開始練習，或直接查看這一題的歷史結果。</p>
          <div class="choice-row">
            <button class="choice-btn primary" data-action="practice">Practice</button>
            <button class="choice-btn secondary" data-action="history">Results</button>
          </div>
          <div class="choice-row">
            <button class="danger-btn" data-action="close-modal">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    app.querySelectorAll('[data-action]').forEach((element) => {
      element.addEventListener('click', handleAction);
    });

    const sortSelect = app.querySelector('[data-action="change-sort"]');
    if (sortSelect) {
      sortSelect.addEventListener('change', function (event) {
        state.currentSort = event.target.value;
        localStorage.setItem(STORAGE_SORT, state.currentSort);
        render();
      });
    }

    app.querySelectorAll('input[name="username"]').forEach((input) => {
      input.addEventListener('input', function (event) {
        state.inputUser = event.target.value;
        state.authError = '';
      });
    });

    app.querySelectorAll('input[name="password"]').forEach((input) => {
      input.addEventListener('input', function (event) {
        state.inputPass = event.target.value;
        state.authError = '';
      });
    });
  }

  function handleAction(event) {
    const action = event.currentTarget.dataset.action;
    const setId = event.currentTarget.dataset.setId;

    if (action === 'toggle-user-menu') {
      state.showUserMenu = !state.showUserMenu;
      render();
      return;
    }

    if (action === 'logout') {
      localStorage.removeItem(STORAGE_CURRENT_USER);
      state.currentUser = '';
      state.showUserMenu = false;
      render();
      return;
    }

    if (action === 'show-auth') {
      state.authView = 'login';
      render();
      return;
    }

    if (action === 'switch-auth') {
      state.authView = state.authView === 'login' ? 'signup' : 'login';
      state.authError = '';
      state.inputUser = '';
      state.inputPass = '';
      render();
      return;
    }

    if (action === 'login') {
      const users = getUsers();
      if (!state.inputUser || !state.inputPass) {
        state.authError = 'Please fill in all fields.';
      } else if (users[state.inputUser] && users[state.inputUser].password === state.inputPass) {
        state.currentUser = state.inputUser;
        localStorage.setItem(STORAGE_CURRENT_USER, state.currentUser);
        state.inputUser = '';
        state.inputPass = '';
        state.authError = '';
      } else {
        state.authError = 'Username or password not correct.';
      }
      render();
      return;
    }

    if (action === 'signup') {
      const users = getUsers();
      if (!state.inputUser || !state.inputPass) {
        state.authError = 'Please fill in all fields.';
      } else if (users[state.inputUser]) {
        state.authError = 'The username is already used.';
      } else {
        users[state.inputUser] = { password: state.inputPass, history: [] };
        saveUsers(users);
        state.authView = 'login';
        state.inputPass = '';
        state.authError = 'Account created. Please log in.';
      }
      render();
      return;
    }

    if (action === 'open-choice') {
      state.selectedSetId = setId;
      state.showChoiceModal = true;
      render();
      return;
    }

    if (action === 'close-modal') {
      state.showChoiceModal = false;
      render();
      return;
    }

    if (action === 'practice') {
      state.showChoiceModal = false;
      startPrep(setId || state.selectedSetId);
      return;
    }

    if (action === 'history') {
      state.showChoiceModal = false;
      openHistory(setId || state.selectedSetId);
      return;
    }

    if (action === 'go-home') {
      cleanupTimers();
      stopMedia();
      state.screen = 'home';
      state.showChoiceModal = false;
      render();
      return;
    }

    if (action === 'go-prep') {
      cleanupTimers();
      stopMedia();
      state.screen = 'prep';
      state.prepSetId = state.speakSetId;
      state.prepStarted = false;
      state.prepTimerText = '01:00';
      render();
      return;
    }

    if (action === 'start-prep') {
      beginPrepCountdown();
      return;
    }

    if (action === 'skip-prep') {
      startSpeakingScreen(state.prepSetId);
      return;
    }

    if (action === 'next-question') {
      handleNextQuestion();
      return;
    }

    if (action === 'done-speaking') {
      handleDoneSpeaking(false);
    }
  }

  function startPrep(setId) {
    cleanupTimers();
    state.screen = 'prep';
    state.prepSetId = setId;
    state.prepStarted = false;
    state.prepTimerText = '01:00';
    render();
  }

  function beginPrepCountdown() {
    state.prepStarted = true;
    state.prepTimerText = '01:00';
    let timeLeft = 60;
    render();

    clearInterval(prepInterval);
    prepInterval = setInterval(function () {
      timeLeft -= 1;
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      state.prepTimerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      render();

      if (timeLeft <= 0) {
        clearInterval(prepInterval);
        startSpeakingScreen(state.prepSetId);
      }
    }, 1000);
  }

  function startSpeakingScreen(setId) {
    cleanupTimers();
    stopMedia();

    const card = dataset.find((item) => String(item.setNumber) === String(setId)) || {};
    state.screen = 'speak';
    state.speakSetId = setId;
    state.speakPhase = 'intro1';
    state.countdownVal = 3;
    state.aiQuestion = '';
    state.elapsedSeconds = 0;
    state.elapsedText = '00:00';
    state.isThinking = false;
    state.isSaved = false;
    state.showReturnPopup = false;
    state.recordingsList = [];
    state.remainingQuestions = Array.isArray(card.backupQuestions) ? [...card.backupQuestions] : [];
    state.conversationHistory = [{ role: 'examiner', text: card.cue || '' }];
    state.hasShownExpandPrompt = false;
    state.isFinalPromptReached = false;
    render();

    introTimeouts.push(setTimeout(function () {
      state.speakPhase = 'intro2';
      render();

      introTimeouts.push(setTimeout(function () {
        state.speakPhase = 'countdown';
        render();
        let count = 3;
        const countdownInterval = setInterval(function () {
          count -= 1;
          if (count > 0) {
            state.countdownVal = count;
            render();
          } else {
            clearInterval(countdownInterval);
            state.speakPhase = 'speaking';
            render();
            startRecordingSegment();
          }
        }, 1000);
      }, 2000));
    }, 3000));
  }

  async function startRecordingSegment() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType: mimeType } : undefined);
      state.stream = stream;
      state.mediaRecorder = recorder;
      state.currentChunks = [];

      recorder.ondataavailable = function (event) {
        if (event.data && event.data.size > 0) {
          state.currentChunks.push(event.data);
        }
      };

      recorder.start();
      startSpeakingTimer();
    } catch (error) {
      state.analysisError = 'Microphone access failed. Please allow microphone permission in your browser and try again.';
      state.screen = 'analysis';
      state.analysisLoading = false;
      state.analysisHtml = '';
      state.analysisTitle = 'Microphone Required';
      render();
    }
  }

  function startSpeakingTimer() {
    clearInterval(speakingTimer);
    speakingTimer = setInterval(function () {
      state.elapsedSeconds += 1;
      state.elapsedText = `${String(Math.floor(state.elapsedSeconds / 60)).padStart(2, '0')}:${String(state.elapsedSeconds % 60).padStart(2, '0')}`;
      render();

      if (state.elapsedSeconds >= 120) {
        clearInterval(speakingTimer);
        handleDoneSpeaking(true);
      }
    }, 1000);
  }

  function stopRecorderAndGetBlob() {
    return new Promise(function (resolve, reject) {
      if (!state.mediaRecorder) {
        reject(new Error('Recorder not ready.'));
        return;
      }

      const recorder = state.mediaRecorder;
      recorder.onstop = function () {
        const blob = new Blob(state.currentChunks, { type: recorder.mimeType || 'audio/webm' });
        state.recordingsList = [...state.recordingsList, blob];
        if (state.stream) {
          state.stream.getTracks().forEach((track) => track.stop());
        }
        state.stream = null;
        state.mediaRecorder = null;
        state.currentChunks = [];
        resolve(blob);
      };

      recorder.stop();
    });
  }

  async function handleNextQuestion() {
    if (state.isThinking || state.isSaved) return;

    state.isThinking = true;
    render();
    clearInterval(speakingTimer);

    try {
      const blob = await stopRecorderAndGetBlob();
      await processNextStep(blob);
    } catch (error) {
      state.isThinking = false;
      state.aiQuestion = 'Please continue speaking.';
      render();
      startRecordingSegment();
    }
  }

  async function processNextStep(blob) {
    const currentQuestions = [...state.remainingQuestions];
    const isOutOfQuestions = currentQuestions.length === 0;
    const file = new File([blob], `set-${state.speakSetId}-segment.webm`, { type: blob.type || 'audio/webm' });
    const formData = new FormData();

    formData.append('file', file);
    formData.append('setId', String(state.speakSetId));
    formData.append('available_questions', isOutOfQuestions ? 'OUT_OF_QUESTIONS' : JSON.stringify(currentQuestions));

    try {
      const response = await fetch(N8N_NEXT_WEBHOOK, { method: 'POST', body: formData });
      const rawText = await response.text();
      let data;

      try {
        data = JSON.parse(rawText);
      } catch (error) {
        data = { question: 'Please continue speaking.', transcription: '', remaining_questions: currentQuestions };
      }

      if (state.isFinalPromptReached) {
        data.question = 'You have answered all the questions, press done to see your results';
      } else if (isOutOfQuestions) {
        if (!state.hasShownExpandPrompt) {
          data.question = 'Great, please continue speaking and expand on your points.';
          state.hasShownExpandPrompt = true;
        } else {
          data.question = 'You have answered all the questions, press done to see your results';
          state.isFinalPromptReached = true;
        }
        state.remainingQuestions = [];
      } else if (data.question === 'You have answered all the questions, press done to see your results') {
        state.isFinalPromptReached = true;
        state.remainingQuestions = [];
      } else if (Array.isArray(data.remaining_questions)) {
        state.remainingQuestions = data.remaining_questions.filter(function (question) {
          return question !== data.question;
        });
      } else {
        state.remainingQuestions = currentQuestions.filter(function (question) {
          return question !== data.question;
        });
      }

      state.conversationHistory = [
        ...state.conversationHistory,
        { role: 'user', text: data.transcription || '(Unclear)', pronunciation: data.pronunciation_note || '' },
        { role: 'examiner', text: data.question }
      ];
      state.aiQuestion = data.question;
      state.isThinking = false;
      render();
      startRecordingSegment();
    } catch (error) {
      state.isThinking = false;
      state.aiQuestion = currentQuestions[0] || 'Continue speaking...';
      state.remainingQuestions = currentQuestions.length > 1 ? currentQuestions.slice(1) : [];
      render();
      startRecordingSegment();
    }
  }

  async function handleDoneSpeaking(isTimeout) {
    if (state.isSaved) return;
    state.isSaved = true;
    state.showReturnPopup = true;
    state.isTimeout = isTimeout;
    state.returnCountdown = 3;
    render();

    clearInterval(speakingTimer);

    const users = getUsers();
    if (state.currentUser && users[state.currentUser]) {
      const history = users[state.currentUser].history || [];
      const setIdNum = Number(state.speakSetId);
      if (!history.includes(setIdNum)) {
        history.push(setIdNum);
        users[state.currentUser].history = history;
        saveUsers(users);
      }
    }

    let finalBlob = null;
    try {
      if (state.mediaRecorder) {
        finalBlob = await stopRecorderAndGetBlob();
      }
    } catch (error) {
      finalBlob = null;
    }

    returnInterval = setInterval(async function () {
      state.returnCountdown -= 1;
      render();
      if (state.returnCountdown <= 0) {
        clearInterval(returnInterval);
        await openAnalysis(state.speakSetId, finalBlob || state.recordingsList[state.recordingsList.length - 1], false);
      }
    }, 1000);
  }

  async function openAnalysis(setId, recordingBlob, isHistory) {
    cleanupTimers();
    stopMedia();

    const card = dataset.find((item) => String(item.setNumber) === String(setId)) || {};
    state.screen = 'analysis';
    state.analysisSetId = setId;
    state.analysisTitle = card.title || `Set ${setId}`;
    state.analysisHtml = '';
    state.analysisError = '';
    state.analysisLoading = !isHistory;
    render();

    if (isHistory) {
      const key = `report_${state.currentUser}_${setId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        state.analysisHtml = sanitizeReportHtml(saved);
        localStorage.setItem(key, state.analysisHtml);
      } else {
        state.analysisError = 'No previous analysis found for this topic. Go practice first!';
      }
      state.analysisLoading = false;
      render();
      return;
    }

    if (!recordingBlob) {
      state.analysisLoading = false;
      state.analysisError = 'No recording found. Please try again.';
      render();
      return;
    }

    const contextInfo = {
      role: card.candidateRole,
      examiner: card.examinerRole,
      topic: card.title,
      task: card.cue
    };

    const formData = new FormData();
    formData.append('file', new File([recordingBlob], `set-${setId}-final.webm`, { type: recordingBlob.type || 'audio/webm' }));
    formData.append('setId', String(setId));
    formData.append('step', 'final');
    formData.append('username', state.currentUser);
    formData.append('context', JSON.stringify(contextInfo));
    formData.append('history', JSON.stringify(state.conversationHistory));

    try {
      const response = await fetch(N8N_DONE_WEBHOOK, { method: 'POST', body: formData });
      const rawText = await response.text();
      let data;

      try {
        data = JSON.parse(rawText);
      } catch (error) {
        data = rawText;
      }

      state.analysisHtml = formatReport(data);
      if (state.currentUser) {
        localStorage.setItem(`report_${state.currentUser}_${setId}`, state.analysisHtml);
        saveTimestamp(setId);
      }
    } catch (error) {
      state.analysisError = 'Analysis failed. Please check your connection or CORS settings for the webhook.';
    }

    state.analysisLoading = false;
    render();
  }

  function openHistory(setId) {
    if (!state.currentUser) {
      state.authError = 'Please log in first.';
      render();
      return;
    }
    openAnalysis(setId, null, true);
  }

  render();
})();
