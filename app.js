// app.js
App({
  onLaunch: function () {
    // Check if user info exists in storage
    const user = wx.getStorageSync('englishProject_currentUser');
    if (user) {
      console.log('Welcome back:', user);
    }
  },
  globalData: {
    userInfo: null
  }
})
