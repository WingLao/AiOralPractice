const dataset = require('../../utils/data.js');
const N8N_NEXT_WEBHOOK = 'https://n8n.srv1237100.hstgr.cloud/webhook/next-question'; 

Page({
  data: {
    setId: '',
    cardData: {},
    phase: 'intro1', 
    countdownVal: 3,
    
    // UI State
    isSaved: false,
    isThinking: false, 
    aiQuestion: '',   
    hasShownExpandPrompt: false, 
    isFinalPromptReached: false,
    
    speakInterval: null,
    actionType: '', 
    recordingsList: [],
    conversationHistory: [], 
    
    elapsedSeconds: 0,
    elapsedText: '00:00',

    // Popup State Variables
    showReturnPopup: false,
    isTimeout: false,
    returnCountdown: 3
  },

  onLoad: function() {
    const currentId = wx.getStorageSync('currentSetId') || '1';
    const originalCard = dataset.sets.find(i => String(i.setNumber) === String(currentId));
    const cardCopy = JSON.parse(JSON.stringify(originalCard));
    const initialHistory = [{ role: 'examiner', text: cardCopy ? cardCopy.cue : '' }];

    this.setData({ 
        setId: currentId, 
        cardData: cardCopy,
        conversationHistory: initialHistory 
    });

    this.recorderManager = wx.getRecorderManager();

    this.recorderManager.onStop((res) => {
      console.log("🔴 Recorder stopped. Path:", res.tempFilePath);
      
      const { tempFilePath } = res;
      // Save the file to the list whenever the recorder stops
      this.setData({ recordingsList: [...this.data.recordingsList, tempFilePath] });

      if (this.data.actionType === 'next') {
        console.log("🚀 Attempting Upload to:", N8N_NEXT_WEBHOOK);
        this.processNextStep(tempFilePath);
      }
      // If actionType is 'done', we don't need to do anything here anymore 
      // because the new handleDone function manages the redirect smoothly.
    });

    this.runIntroSequence();
  },

  runIntroSequence: function() {
    setTimeout(() => {
      this.setData({ phase: 'intro2' });
      setTimeout(() => {
        this.setData({ phase: 'countdown' });
        let count = 3;
        const interval = setInterval(() => {
          count--;
          if (count > 0) {
            this.setData({ countdownVal: count });
          } else {
            clearInterval(interval);
            this.setData({ phase: 'speaking' });
            this.startSpeaking();
          }
        }, 1000);
      }, 2000);
    }, 3000);
  },

  startSpeaking: function() {
    console.log("🎙️ Attempting to start recording...");
    if (this.data.speakInterval) clearInterval(this.data.speakInterval);
    
    const interval = setInterval(() => {
      let s = this.data.elapsedSeconds + 1;
      
      // Stop exactly at 2 minutes
      if (s >= 120) {
          clearInterval(interval);
          this.setData({ elapsedSeconds: 120, elapsedText: '02:00' });
          this.handleDone(true); // Trigger the timeout logic
          return;
      }
      
      let mins = Math.floor(s / 60);
      let secs = s % 60;
      let text = `${mins < 10 ? '0'+mins : mins}:${secs < 10 ? '0'+secs : secs}`;
      this.setData({ elapsedSeconds: s, elapsedText: text });
    }, 1000);
    
    this.setData({ speakInterval: interval });
    
    try {
        this.recorderManager.start({ format: 'mp3', sampleRate: 16000, numberOfChannels: 1, encodeBitRate: 48000 });
    } catch (e) {
        console.error("❌ Failed to start recorder:", e);
    }
  },

  handleNext: function() {
    console.log("BUTTON CLICKED");
    
    if (this.data.isThinking || this.data.isSaved) return;

    console.log("✅ Button Accepted. Stopping Recorder...");
    this.setData({ 
        actionType: 'next', 
        isThinking: true 
    });
    
    clearInterval(this.data.speakInterval);

    try {
        this.recorderManager.stop();
    } catch (e) {
        console.error("❌ Error stopping recorder:", e);
        this.setData({ isThinking: false });
    }
  },

  handleDone: function(e) {
    // Check if triggered by the 2-minute timeout limit
    const isTimeoutEvent = (e === true);

    if (this.data.isSaved) return;

    // Mark as done when the "Done" button is pressed
    const user = wx.getStorageSync('englishProject_currentUser');
    if (user) {
      const allUsers = wx.getStorageSync('englishProject_users') || {};
      if (allUsers[user]) {
        let history = allUsers[user].history || [];
        const id = parseInt(this.data.setId);
        if (!history.includes(id)) {
          history.push(id);
          allUsers[user].history = history;
          wx.setStorageSync('englishProject_users', allUsers);
        }
      }
    }
    
    // 1. Immediately update UI to show the popup (No Freezing)
    this.setData({ 
        isSaved: true, 
        actionType: 'done',
        showReturnPopup: true,
        isTimeout: isTimeoutEvent,
        returnCountdown: 3,
        isThinking: false // Force cancel thinking state so user can exit safely
    });

    wx.setStorageSync('sessionHistory', this.data.conversationHistory);
    clearInterval(this.data.speakInterval);

    // 2. Start the 3-second countdown UI animation instantly
    let count = 3;
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            this.setData({ returnCountdown: count });
        } else {
            clearInterval(interval);
            // 3. When it reaches 0, save the final files and redirect
            wx.setStorageSync('sessionRecordings', this.data.recordingsList);
            wx.redirectTo({
                url: '/pages/analysis/analysis'
            });
        }
    }, 1000);

    // 4. Stop the recorder silently in the background
    try {
        this.recorderManager.stop();
    } catch (error) {
        console.error("Error stopping recorder", error);
    }
  },

  processNextStep: function(filePath) {
    const currentQuestions = this.data.cardData.backupQuestions || [];
    const isOutOfQuestions = currentQuestions.length === 0;

    console.log("📤 Calling wx.uploadFile now...");
    
    wx.uploadFile({
      url: N8N_NEXT_WEBHOOK,
      filePath: filePath,
      name: 'file',
      formData: {
        'setId': this.data.setId,
        'available_questions': isOutOfQuestions ? "OUT_OF_QUESTIONS" : JSON.stringify(currentQuestions)
      },
      success: (res) => {
        let data;
        try {
          data = JSON.parse(res.data);
        } catch (e) {
          data = { question: "Please continue speaking.", transcription: "", remaining_questions: currentQuestions };
        }

        // --- NEW LOGIC WITH THE LOCK ---
        
        // 1. If we ALREADY reached the end previously, force the same prompt.
        if (this.data.isFinalPromptReached) {
            data.question = "You have answered all the questions, press done to see your results";
        } 
        // 2. Handle normal "Out of Questions" sequence
        else if (isOutOfQuestions) {
          if (!this.data.hasShownExpandPrompt) {
            data.question = "Great, please continue speaking and expand on your points.";
            this.setData({ hasShownExpandPrompt: true });
          } else {
            data.question = "You have answered all the questions, press done to see your results";
            this.setData({ isFinalPromptReached: true }); // Lock it!
          }
        } 
        // 3. Handle the AI intelligently filtering questions
        else {
          let remaining = [];
          
          if (data.question === "You have answered all the questions, press done to see your results") {
             remaining = []; 
             this.setData({ isFinalPromptReached: true }); // Lock it if AI triggers it!
          } 
          else if (data.remaining_questions && Array.isArray(data.remaining_questions)) {
             remaining = data.remaining_questions.filter(q => q !== data.question);
          } else {
             remaining = currentQuestions.filter(q => q !== data.question);
          }
          
          this.setData({ 'cardData.backupQuestions': remaining });
        }
        // --- END OF NEW LOGIC ---

        const newEntry = [
          { role: 'user', text: data.transcription || "(Unclear)", pronunciation: data.pronunciation_note },
          { role: 'examiner', text: data.question }
        ];

        this.setData({ 
          isThinking: false, 
          aiQuestion: data.question,
          conversationHistory: [...this.data.conversationHistory, ...newEntry]
        });
        this.startSpeaking();
      },
      fail: (err) => {
        const fallbackMsg = currentQuestions.length > 0 ? currentQuestions[0] : "Continue speaking...";
        this.setData({ isThinking: false, aiQuestion: fallbackMsg });
        this.startSpeaking();
      }
    });
  },

  goBackNow: function() {
    wx.navigateBack(); 
  }
});