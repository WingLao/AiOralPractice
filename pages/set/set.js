const dataset = require('../../utils/data.js');

Page({
  data: {
    setId: '',
    cardData: {},
    hasStarted: false,
    timerText: '01:00',
    timerColor: '#3b66ff',
    timerInterval: null
  },

  onLoad: function(options) {
    const currentId = options.id || '1';
    // Save to storage to persist "current" set if user quits app
    wx.setStorageSync('currentSetId', currentId);

    const card = dataset.sets.find(i => String(i.setNumber) === String(currentId));
    
    this.setData({
      setId: currentId,
      cardData: card
    });
  },

  onUnload: function() {
    clearInterval(this.data.timerInterval);
  },

  startTask: function() {
    this.setData({ hasStarted: true });
    this.startTimer();
  },

  startTimer: function() {
    let timeLeft = 60;
    this.setData({ timerText: '01:00' });
    
    const interval = setInterval(() => {
      timeLeft--;
      let mins = Math.floor(timeLeft / 60);
      let secs = timeLeft % 60;
      let text = `${mins < 10 ? '0'+mins : mins}:${secs < 10 ? '0'+secs : secs}`;
      
      this.setData({ timerText: text });

      if (timeLeft <= 0) {
        clearInterval(this.data.timerInterval);
        this.setData({ timerText: '00:00', timerColor: '#ff4d4f' });
        // Navigate to Speak page
        wx.redirectTo({ url: '/pages/speak/speak' });
      }
    }, 1000);

    this.setData({ timerInterval: interval });
  },

  skipTimer: function() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
    // Navigate immediately
    wx.redirectTo({ url: '/pages/speak/speak' });
  },

  goBack: function() {
    wx.navigateBack();
  }
});