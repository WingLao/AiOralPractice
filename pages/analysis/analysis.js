const dataset = require('../../utils/data.js');
const N8N_DONE_WEBHOOK = 'https://n8n.srv1237100.hstgr.cloud/webhook/analyze-performance'; 

Page({
  data: {
    analysisResult: '',
    isLoading: true,
    isNoRecord: false
  },

  onLoad: function(options) {
    const currentUser = wx.getStorageSync('englishProject_currentUser');
    
    // --- MODE 1: HISTORY (Viewing old results) ---
    if (options.mode === 'history') {
        const setId = options.id;
        
        // --- FIX: Correctly define the key and get storage ---
        const key = `report_${currentUser}_${setId}`;
        let savedReport = wx.getStorageSync(key);
        // ---------------------------------------------------

        // --- THE SMART FIX ---
        // 1. If it is an Object (The source of "[object Object]"), try to format it!
        if (savedReport && typeof savedReport === 'object') {
            if (savedReport.feedback || savedReport.score) {
                // It's valid data, just unformatted. Let's format it now.
                savedReport = this.formatReport(savedReport);
                // Save the fixed version so it loads correctly next time
                wx.setStorageSync(key, savedReport);
            } else {
                // It's a weird empty object. Kill it.
                savedReport = null;
                wx.removeStorageSync(key);
            }
        }
        
        // 2. If it is the literal string "[object Object]" (Corrupted string)
        if (savedReport === '[object Object]') {
             savedReport = null;
             wx.removeStorageSync(key);
        }

        if (savedReport) {
            // Success: Show the report
            this.setData({
                analysisResult: savedReport,
                isLoading: false,
                isNoRecord: false
            });
        } else {
            // Nothing found
            this.setData({
                analysisResult: "No previous analysis found for this topic. Go practice first!",
                isLoading: false,
                isNoRecord: true
            });
        }
        return; // STOP here
    }

    // --- MODE 2: NEW ANALYSIS (Just finished speaking) ---
    const filePaths = wx.getStorageSync('sessionRecordings') || [];
    const history = wx.getStorageSync('sessionHistory') || []; 
    const currentSetId = wx.getStorageSync('currentSetId') || '1';
    
    this.setData({ analysisResult: '', isLoading: true });

    if (filePaths.length > 0) {
      this.performAnalysis(filePaths, history, currentSetId, currentUser); 
    } else {
      this.setData({ 
          isLoading: false, 
          isNoRecord: true,
          analysisResult: "No recording found. Please try again."
      });
    }
  },

  // Helper function to keep code clean
  formatReport: function(data) {
    if (typeof data === 'string') return data;
    
    // Style constants for bold blue headers and clear font sizing
    const titleStyle = "font-size: 19px; font-weight: 800; color: #3b66ff; display: block; margin-top: 15px; margin-bottom: 5px;";
    const contentStyle = "font-size: 16px; color: #1a1a1a; line-height: 1.6; display: block; margin-bottom: 15px;";

    // --- NEW: Handle the "No Speech / Empty Audio" scenario cleanly ---
    if (data.score === '0/3.0' && data.grammar === 'N/A') {
      return `
        <div style="margin-top: 15px; margin-bottom: 15px; display: flex; align-items: baseline;">
           <span style="font-size: 19px; font-weight: 800; color: #3b66ff; margin-right: 10px;">🌟 Score:</span>
           <span style="font-size: 18px; color: #1a1a1a; font-weight: bold;">${data.score || 'N/A'}</span>
        </div>
        <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #fff1f0; border-radius: 15px; border: 2px dashed #ffccc7;">
           <div style="font-size: 40px; margin-bottom: 10px;">🎙️</div>
           <div style="font-size: 16px; color: #ff4d4f; font-weight: bold; line-height: 1.5;">
              ${data.feedback || "We didn't catch any audio. Please make sure your microphone is working, speak clearly, and try again!"}
           </div>
        </div>
      `;
    }

    // --- LOGIC: Catch empty grammar and replace with a compliment ---
    let grammarFeedback = data.grammar;
    if (!grammarFeedback || grammarFeedback.trim() === '' || grammarFeedback.toLowerCase() === 'none') {
        grammarFeedback = "Great job! Your grammar was excellent, and no major mistakes were detected. Keep it up! ✨";
    }

    if (data.score || data.feedback) {
      return `
        <div style="margin-top: 15px; margin-bottom: 15px; display: flex; align-items: baseline;">
           <span style="font-size: 19px; font-weight: 800; color: #3b66ff; margin-right: 10px;">🌟 Score:</span>
           <span style="font-size: 18px; color: #1a1a1a; font-weight: bold;">${data.score || 'N/A'}</span>
        </div>

        <div style="${titleStyle}">✅ Overall Feedback:</div>
        <div style="${contentStyle}">${data.feedback || 'No feedback'}</div>

        <div style="${titleStyle}">🗣️ Pronunciation:</div>
        <div style="${contentStyle}">${data.pronunciation_feedback || "No specific comments."}</div>

        <div style="${titleStyle}">📖 Vocabulary:</div>
        <div style="${contentStyle}">${data.vocabulary || 'None'}</div>

        <div style="${titleStyle}">🔧 Grammar Analysis:</div>
        <div style="${contentStyle}">${grammarFeedback}</div>
      `;
    }
    return JSON.stringify(data);
  },

  performAnalysis: function(filePaths, history, setId, currentUser) {
    const lastFile = filePaths[filePaths.length - 1];
    const card = dataset.sets.find(s => String(s.setNumber) === String(setId));
    
    if (!card) {
        this.setData({ isLoading: false, analysisResult: "Error: Scenario data missing." });
        return;
    }

    const contextInfo = {
        role: card.candidateRole,
        examiner: card.examinerRole,
        topic: card.title,
        task: card.cue
    };

    wx.uploadFile({
      url: N8N_DONE_WEBHOOK,
      filePath: lastFile,
      name: 'file',
      formData: {
        'setId': setId,
        'step': 'final',
        'username': currentUser,
        'context': JSON.stringify(contextInfo),
        'history': JSON.stringify(history)
      },
      success: (res) => {
        try {
          let data = JSON.parse(res.data);
          let displayText = this.formatReport(data);

          if (currentUser) {
            const key = `report_${currentUser}_${setId}`;
            wx.removeStorageSync(key);
            wx.setStorageSync(key, displayText);

            // Generate and save timestamp
            const now = new Date();
            const yy = String(now.getFullYear()).slice(-2);
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const hr = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            const sec = String(now.getSeconds()).padStart(2, '0');

            const timeKey = `time_${currentUser}_${setId}`;
            wx.setStorageSync(timeKey, { 
              date: `${yy}/${mm}/${dd}`, 
              time: `${hr}:${min}:${sec}` 
            });
          }
          this.setData({ isLoading: false, analysisResult: displayText });
        } catch (e) {
          this.setData({ isLoading: false, analysisResult: res.data });
        }
      },
      fail: (err) => {
        this.setData({ isLoading: false, analysisResult: "Analysis failed. Check connection." });
      }
    });
  },
  
  goHome: function() {
    wx.reLaunch({ url: '/pages/index/index' });
  }
});