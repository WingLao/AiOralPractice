const dataset = require('../../utils/data.js');

const STORAGE_USERS = 'englishProject_users'; 
const STORAGE_CURRENT_USER = 'englishProject_currentUser';

Page({
  data: {
    isLoggedIn: false,
    currentUser: '',
    authView: 'login', // 'login' or 'signup'
    
    // Auth Inputs
    inputUser: '',
    inputPass: '',
    authError: '',

    // UI State
    showUserMenu: false,
    showLogoutOverlay: false,
    showSortMenu: false,
    showBackToTop: false,
    scrollTop: 0,
    currentSort: 'default',
    showChoiceModal: false,
    selectedSetId: null,

    // Data
    originalData: [],
    currentData: []
  },

  onLoad: function() {
    const savedSort = wx.getStorageSync('englishProject_currentSort') || 'default';
    // 1. Load static data immediately FIRST
    this.setData({
      originalData: [...dataset.sets],
      currentSort: savedSort
    });
    
    // 2. Then check auth and render the cards
    this.checkAuth();
  },

  onShow: function() {
    // Refresh data status every time we show the page, regardless of login state
    this.refreshData();
  },

  openChoiceModal: function(e) {
    const id = e.currentTarget.dataset.setid;
    this.setData({
        showChoiceModal: true,
        selectedSetId: id
    });
  },

  closeChoiceModal: function() {
    this.setData({ showChoiceModal: false });
  },

  preventProp: function() {},

  goToPractice: function() {
    this.setData({ showChoiceModal: false });
    wx.navigateTo({ url: `/pages/set/set?id=${this.data.selectedSetId}` });
  },

  goToResults: function() {
    this.setData({ showChoiceModal: false });
    wx.navigateTo({ 
        url: `/pages/analysis/analysis?id=${this.data.selectedSetId}&mode=history` 
    });
  },

  // --- Auth Logic ---
  checkAuth: function() {
    const user = wx.getStorageSync(STORAGE_CURRENT_USER);
    if (user) {
      this.setData({ isLoggedIn: true, currentUser: user });
    } else {
      this.setData({ isLoggedIn: false, currentUser: '' });
    }
    // ALWAYS refresh data so the cards render behind the login box!
    this.refreshData(); 
  },

  onInputUser: function(e) { this.setData({ inputUser: e.detail.value, authError: '' }); },
  onInputPass: function(e) { this.setData({ inputPass: e.detail.value, authError: '' }); },

  switchView: function(e) {
    this.setData({ authView: e.currentTarget.dataset.view, authError: '', inputUser: '', inputPass: '' });
  },

  attemptLogin: function() {
    const { inputUser, inputPass } = this.data;
    if (!inputUser || !inputPass) {
      this.setData({ authError: "Please fill in all fields." });
      return;
    }

    const allUsers = wx.getStorageSync(STORAGE_USERS) || {};
    if (allUsers[inputUser] && allUsers[inputUser].password === inputPass) {
      wx.setStorageSync(STORAGE_CURRENT_USER, inputUser);
      this.checkAuth();
    } else {
      this.setData({ authError: "Username or password not correct." });
    }
  },

  attemptSignup: function() {
    const { inputUser, inputPass } = this.data;
    if (!inputUser || !inputPass) {
      this.setData({ authError: "Please fill in all fields." });
      return;
    }

    const allUsers = wx.getStorageSync(STORAGE_USERS) || {};
    if (allUsers[inputUser]) {
      this.setData({ authError: "The username is already used." });
    } else {
      allUsers[inputUser] = { password: inputPass, history: [] };
      wx.setStorageSync(STORAGE_USERS, allUsers);
      wx.showToast({ title: 'Account created!', icon: 'success' });
      this.setData({ authView: 'login' });
    }
  },

  // --- Data & Sorting ---
  getUserHistory: function() {
    if (!this.data.currentUser) return [];
    const allUsers = wx.getStorageSync(STORAGE_USERS) || {};
    return (allUsers[this.data.currentUser] && allUsers[this.data.currentUser].history) ? allUsers[this.data.currentUser].history : [];
  },

  refreshData: function() {
    const history = this.getUserHistory();
    const currentUser = this.data.currentUser;

    const updatedData = this.data.originalData.map(item => {
      const isDone = history.includes(item.setNumber);
      let completionTime = null;

      if (isDone && currentUser) {
        // Retrieve the saved timestamp
        completionTime = wx.getStorageSync(`time_${currentUser}_${item.setNumber}`);
      }

      return {
        ...item,
        isClicked: isDone,
        completionTime: completionTime
      };
    });
    
    this.data.originalData = updatedData; 
    this.applySortLogic(this.data.currentSort);
  },

  toggleSortMenu: function() { this.setData({ showSortMenu: !this.data.showSortMenu }); },

  applySort: function(e) {
    const type = e.currentTarget.dataset.type;
    // Save the chosen sort type to local storage so it persists
    wx.setStorageSync('englishProject_currentSort', type);
    this.setData({ currentSort: type, showSortMenu: false });
    this.applySortLogic(type);
  },

  applySortLogic: function(type) {
    let data = [...this.data.originalData];
    
    if (type === 'themes') {
      data.sort((a, b) => (a.theme || "").localeCompare(b.theme || ""));
    } else if (type === 'not-done') {
      const done = data.filter(i => i.isClicked);
      const notDone = data.filter(i => !i.isClicked);
      data = [...notDone, ...done];
    }
    
    this.setData({ currentData: data });
  },

  // --- Interaction ---
  onCardTap: function(e) {
    const id = e.currentTarget.dataset.setid;
    // Using query param is cleaner in MP
    wx.navigateTo({ url: `/pages/set/set?id=${id}` });
  },

  toggleUserMenu: function() { this.setData({ showUserMenu: !this.data.showUserMenu }); },
  showLogoutPopup: function() { this.setData({ showLogoutOverlay: true, showUserMenu: false }); },
  closeLogoutPopup: function() { this.setData({ showLogoutOverlay: false }); },

  confirmLogout: function() {
    wx.removeStorageSync(STORAGE_CURRENT_USER);
    // Reset state
    this.setData({ 
      isLoggedIn: false, 
      showLogoutOverlay: false, 
      currentUser: '',
      inputUser: '', 
      inputPass: ''
    });

    // ADD THIS LINE: This forces the cards to re-render.
    // Since currentUser is now empty, it will make all cards default to blue!
    this.refreshData();
  },

  handleScroll: function(e) {
    // Show back to top if scrolled more than 500px
    this.setData({ showBackToTop: e.detail.scrollTop > 500 });
  },

  scrollToTop: function() {
    this.setData({ scrollTop: 0 });
  }
});