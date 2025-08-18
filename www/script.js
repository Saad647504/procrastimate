// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBxr4anU3K7Czr7oDlBUxxUBaqqGnaQZKE",
  authDomain: "procrastimate-44a7a.firebaseapp.com",
  projectId: "procrastimate-44a7a",
  storageBucket: "procrastimate-44a7a.firebasestorage.app",
  messagingSenderId: "622528461077",
  appId: "1:622528461077:web:783e8acfc52639ed8ad11c",
  measurementId: "G-ZMHYEMPDJE"
};


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// intro animation
window.addEventListener('load', () => {
  const introScreen = document.getElementById('intro-screen');
  const authScreen = document.getElementById('auth-screen');
  const mainApp = document.getElementById('main-app');

  introScreen.classList.add('transition-all', 'duration-[800ms]', 'ease-in-out');
  authScreen.classList.add('transition-opacity', 'duration-500', 'ease-in-out', 'opacity-0');
  mainApp.classList.add('transition-opacity', 'duration-500', 'ease-in-out', 'opacity-0');

  setTimeout(() => {
    introScreen.classList.add('translate-y-full');
    
    setTimeout(() => {
      introScreen.classList.add('hidden');
    }, 800);
  }, 2000);
});

// preload images
const onboardingImages = [
  'icons/roman-denisenko-OAx0oQ8I5a0-unsplash.jpg',
  'icons/eduardo-cano-photo-co-9xL_8KCEQqE-unsplash.jpg',
  'icons/full-shot-woman-jumping.jpg',
  'icons/nathan-dumlao-NXMZxygMw8o-unsplash.jpg'
];

onboardingImages.forEach(src => {
  const img = new Image();
  img.src = src;
});

const slide4Img = new Image();
slide4Img.src = 'icons/nathan-dumlao-NXMZxygMw8o-unsplash.jpg';
slide4Img.onload = () => {
  console.log('Slide 4 image preloaded');
};

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('touchstart', unlockMobileAudio, { once: true });
  document.addEventListener('touchend', unlockMobileAudio, { once: true });
  document.addEventListener('click', unlockMobileAudio, { once: true });
  
  // onboarding stuff
  let currentSlide = 0;
  const totalSlides = 4;
  let touchStartX = 0;
  let touchEndX = 0;

  const onboardingEl = document.getElementById('onboarding');
  const slidesContainer = document.getElementById('slides-container');
  const dots = document.querySelectorAll('.dot');
  const nextBtn = document.getElementById('next-btn');
  const skipBtn = document.getElementById('skip-onboarding');

  function shouldShowOnboarding() {
    return !localStorage.getItem('onboardingSeen');
  }

  window.showOnboarding = function() {
    if (onboardingEl) {
      onboardingEl.classList.remove('hidden');
      onboardingEl.setAttribute('aria-hidden', 'false');
      currentSlide = 0;
      updateSlide();
      nextBtn?.focus();
    }
  }

  function hideOnboarding() {
    localStorage.setItem('onboardingSeen', '1');
    const onboardingEl = document.getElementById('onboarding');
    const mainApp = document.getElementById('main-app');
    
    if (onboardingEl) {
      onboardingEl.classList.remove('opacity-100');
      onboardingEl.classList.add('opacity-0');
      
      setTimeout(() => {
        onboardingEl.classList.add('hidden');
        
        mainApp.classList.add('transition-opacity', 'duration-500');
        mainApp.classList.remove('hidden', 'opacity-0');
        setTimeout(() => mainApp.classList.add('opacity-100'), 10);
        
        setTimeout(() => {
          showResponse('Welcome to ProcrastiMate! Time to destroy procrastination.', 'welcome');
        }, 500);
      }, 500);
    }
  }

  function updateSlide() {
    if (!slidesContainer) return;
    
    requestAnimationFrame(() => {
      slidesContainer.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
    });
    
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('bg-red-500');
        dot.classList.remove('bg-white/30');
      } else {
        dot.classList.add('bg-white/30');
        dot.classList.remove('bg-red-500');
      }
    });
    
    if (nextBtn) {
      if (currentSlide === totalSlides - 1) {
        nextBtn.textContent = 'START JOURNEY';
        nextBtn.classList.add('pulse-ring');
      } else {
        nextBtn.textContent = 'NEXT';
        nextBtn.classList.remove('pulse-ring');
      }
    }
  }

  function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
      currentSlide = slideIndex;
      updateSlide();
    }
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlide();
    } else {
      hideOnboarding();
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlide();
    }
  }

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  if (onboardingEl) {
    nextBtn?.addEventListener('click', nextSlide);
    skipBtn?.addEventListener('click', hideOnboarding);
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });
    
    let isAnimating = false;
    onboardingEl.addEventListener('touchstart', (e) => {
      if (!isAnimating) handleTouchStart(e);
    }, { passive: true });
    onboardingEl.addEventListener('touchend', (e) => {
      if (!isAnimating) {
        isAnimating = true;
        handleTouchEnd(e);
        setTimeout(() => { isAnimating = false; }, 300);
      }
    }, { passive: true });
    
    document.addEventListener('keydown', (e) => {
      if (!onboardingEl.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
        } else if (e.key === 'Escape') {
          hideOnboarding();
        }
      }
    });
  }

  // date stuff
  console.log('Current date:', new Date().toString());
  console.log('Today string:', getTodayString());

  function updateClock() {
    const now = new Date();
  }
  setInterval(updateClock, 1000);

  function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const result = `${year}-${month}-${day}`;
    console.log('getTodayString returning:', result, 'for date:', now.toDateString());
    return result;
  }

  function getWeekMonday() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  }

  function isCurrentWeek(dateString) {
    const date = new Date(dateString);
    const monday = getWeekMonday();
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    
    return date >= monday && date <= sunday;
  }

  function updateDailyActivity(focusMinutes = 0, tasksCompleted = 0, sessionCompleted = false) {
    const today = getTodayString();
    console.log('Updating activity for:', today, 'Minutes:', focusMinutes);
    
    if (!stats.dailyActivity) {
      stats.dailyActivity = {};
    }
    
    if (!stats.dailyActivity[today]) {
      stats.dailyActivity[today] = { 
        focusMinutes: 0, 
        tasksCompleted: 0, 
        sessions: 0,
        date: today,
        timestamp: new Date().toISOString()
      };
    }
    
    stats.dailyActivity[today].focusMinutes += focusMinutes;
    stats.dailyActivity[today].tasksCompleted += tasksCompleted;
    if (sessionCompleted) {
      stats.dailyActivity[today].sessions += 1;
      stats.totalSessions = (stats.totalSessions || 0) + 1;
    }

    stats.totalFocusTime += focusMinutes;
    
    console.log('Daily activity after update:', stats.dailyActivity[today]);
    
    saveStats();
    updateWeeklyProgress();
    updateStatsUI();
    setTimeout(drawFocusChart, 100);
  }
function updateWeeklyProgress() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const today = new Date();
    
    const currentDayOfWeek = today.getDay();
    
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    progressBars.forEach((bar, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const dateString = date.toLocaleDateString('en-CA');
      
      const dayActivity = stats.dailyActivity[dateString];
      
      if (dayActivity && dayActivity.focusMinutes > 0) {
        const minutes = dayActivity.focusMinutes;
        
        if (minutes < 15) {
          bar.style.background = 'linear-gradient(to top, #ef4444 25%, #1f2937 25%)';
        } else if (minutes < 30) {
          bar.style.background = 'linear-gradient(to top, #ef4444 50%, #1f2937 50%)';
        } else if (minutes < 60) {
          bar.style.background = 'linear-gradient(to top, #ef4444 75%, #1f2937 75%)';
        } else {
          bar.style.background = '#ef4444';
        }
      }
      
      if (index === (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1)) {
        bar.style.border = '2px solid #ff4433';
      } else {
        bar.style.border = 'none';
      }
    });
  }
  
  // get dom elements
  const navItems = document.querySelectorAll('.nav-item');
  const tabSections = document.querySelectorAll('.tab-section');
  const timerDisplay = document.getElementById('timer-display');
  const startTimer = document.getElementById('start-timer');
  const resetTimer = document.getElementById('reset-timer');
  const lockInCard = document.getElementById('lock-in-card');
  const toughLoveCard = document.getElementById('tough-love-card');
  const timerSection = document.getElementById('timer-section');
  const responseMessage = document.getElementById('response-message');
  const responseText = document.getElementById('response-text');
  const focusTask = document.getElementById('focus-task');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalMessage = document.getElementById('modal-message');
  const modalClose = document.getElementById('modal-close');
  const speakerCards = document.querySelectorAll('.speaker-card, .speaker-card-premium');
  const quoteDisplay = document.getElementById('quote-display');
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const quoteControls = document.getElementById('quote-controls');
  const newQuoteBtn = document.getElementById('new-quote');
  const saveQuoteBtn = document.getElementById('save-quote');
  const timerOptions = document.querySelectorAll('.timer-option');
  const timerTaskDisplay = document.getElementById('timer-task-display');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const closeSettings = document.getElementById('close-settings');
  const achievementPopup = document.getElementById('achievement-popup');
  const achievementText = document.getElementById('achievement-text');
  const currentTimeDisplay = document.getElementById('current-time');
  const totalXpDisplay = document.getElementById('total-xp');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendChatBtn = document.getElementById('send-chat');
  const ELEVEN_LABS_KEY = "sk_1c3bb831dda4396890b0895e75ed539a365447c3745b9c09"; 
  const VOICE_ID = "kqVT88a5QfII1HNAEPTJ"; 
  
  // Mobile audio context fix
let mobileAudioUnlocked = false;

function unlockMobileAudio() {
  if (mobileAudioUnlocked) return;
  
  if (!window.audioContext) {
    window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  const oscillator = window.audioContext.createOscillator();
  const gainNode = window.audioContext.createGain();
  gainNode.gain.value = 0;
  oscillator.connect(gainNode);
  gainNode.connect(window.audioContext.destination);
  oscillator.start();
  oscillator.stop();
  
  mobileAudioUnlocked = true;
}
  // auth stuff
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
    console.log('Auth persistence set to LOCAL');
    
    firebase.auth().onAuthStateChanged((user) => {
      const authScreen = document.getElementById('auth-screen');
      const mainApp = document.getElementById('main-app');
      const onboarding = document.getElementById('onboarding');
      
      if (user) {
        currentUser = user;
        loadUserData();
        
        if (!localStorage.getItem('onboardingSeen')) {
          if (authScreen) {
            authScreen.classList.remove('opacity-100');
            authScreen.classList.add('opacity-0');
            setTimeout(() => authScreen.classList.add('hidden'), 500);
          }
          
          onboarding.classList.add('transition-opacity', 'duration-500');
          onboarding.classList.remove('hidden', 'opacity-0');
          setTimeout(() => onboarding.classList.add('opacity-100'), 10);
        } else {
          mainApp.classList.remove('hidden', 'opacity-0');
          setTimeout(() => mainApp.classList.add('opacity-100'), 10);
        }
      } else {
        authScreen.style.display = 'flex';
        setTimeout(() => {
          authScreen.classList.remove('opacity-0');
          authScreen.classList.add('opacity-100');
        }, 10);
      }
    });
  }).catch((error) => {
    console.error('Error setting persistence:', error);
  });

  // login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const loginBtn = document.getElementById('login-btn');
      
      loginBtn.textContent = 'LOADING...';
      loginBtn.disabled = true;
      
      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        currentUser = userCredential.user;
        await loadUserData();
        showMainApp();
      } catch (error) {
        alert(error.message);
        loginBtn.textContent = 'UNLOCK BEAST MODE';
        loginBtn.disabled = false;
      }
    });
  }

  // signup form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const signupBtn = document.getElementById('signup-btn');
      
      signupBtn.textContent = 'CREATING ACCOUNT...';
      signupBtn.disabled = true;
      
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        currentUser = userCredential.user;
        
        await currentUser.updateProfile({
          displayName: name
        });
        
        await db.collection('users').doc(currentUser.uid).set({
          name: name,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          stats: {
            focusStreak: 0,
            tasksCrushed: 0,
            totalFocusTime: 0,
            totalXp: 0
          }
        });
        localStorage.removeItem('returningUser');
        showMainApp();
      } catch (error) {
        alert(error.message);
        signupBtn.textContent = 'START MY JOURNEY';
        signupBtn.disabled = false;
      }
    });
  }

  // toggle between login and signup
  document.getElementById('show-signup')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('signup-container').classList.remove('hidden');
  });

  document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-container').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
  });

  // stats variables
  let stats = {
    focusStreak: 0,
    tasksCrushed: 0,
    quotesViewed: 0,
    savedQuotes: 0,
    totalFocusTime: 0,
    longestSession: 0,
    totalXp: 0,
    totalSessions: 0,
    frequentTask: '',
    topSpeaker: '',
    dailyActivity: {},
    achievements: {
      fireStarter: false,
      speedDemon: false,
      deepFocus: false,
      goalCrusher: false
    },
    currentWeeklyGoal: null
  };

  let apiProtection = {
    callsThisHour: 0,
    lastReset: Date.now()
  };

  let typingInterval;
  let lastSpeaker = null;
  let timerInterval;
  let timeLeft = 25 * 60;
  let typingTimeout;
  let currentSpeaker = null;
  let currentQuotes = [];
  let selectedMinutes = 25;
  let isTimerRunning = false;

  loadStats();
  
  if (totalXpDisplay) {
    totalXpDisplay.textContent = stats.totalXp || 0;
  }

  function saveStats() {
    localStorage.setItem('procrastimateStats', JSON.stringify(stats));
  }
  
  async function loadUserData() {
    if (!currentUser) return;
    
    try {
      const doc = await db.collection('users').doc(currentUser.uid).get();
      if (doc.exists) {
        const userData = doc.data();
        if (userData.stats) {
          Object.assign(stats, userData.stats);
          updateStatsUI();
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async function saveUserData() {
    if (!currentUser) return;
    
    try {
      await db.collection('users').doc(currentUser.uid).update({
        stats: stats,
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  const originalSaveStats = saveStats;
  saveStats = function() {
    originalSaveStats();
    saveUserData();
  };

  function showMainApp() {
    const authScreen = document.getElementById('auth-screen');
    const introScreen = document.getElementById('intro-screen');
    
    // Check if this is a new user
    const isNewUser = !localStorage.getItem('returningUser');
    
    if (introScreen && introScreen.style.display !== 'none') {
      introScreen.style.display = 'none';
    }
    
    if (authScreen && authScreen.style.display !== 'none') {
      authScreen.style.transition = 'opacity 0.5s, transform 0.5s';
      authScreen.style.opacity = '0';
      authScreen.style.transform = 'translateY(-50px)';
      
      setTimeout(() => {
        authScreen.style.display = 'none';
        
        if (shouldShowOnboarding()) {
          showOnboarding();
        } else {
          const mainApp = document.getElementById('main-app');
          if (mainApp) {
            mainApp.classList.remove('hidden');
            mainApp.classList.add('show');
          }
          const userName = currentUser?.displayName || 'Warrior';
          
          // Different message for new vs returning users
          if (isNewUser) {
            setTimeout(() => {
              showResponse(`Welcome ${userName}! Let's destroy procrastination together.`, 'welcome');
              localStorage.setItem('returningUser', 'true');
            }, 500);
          } else {
            setTimeout(() => {
              showResponse(`Welcome back, ${userName}. Time to destroy procrastination.`, 'welcome');
            }, 500);
          }
        }
      }, 500);
    } else {
      if (shouldShowOnboarding()) {
        showOnboarding();
      } else {
        const mainApp = document.getElementById('main-app');
        if (mainApp) {
          mainApp.classList.remove('hidden');
          mainApp.classList.add('show');
        }
        const userName = currentUser?.displayName || 'Warrior';
        
        // Different message for new vs returning users
        if (isNewUser) {
          setTimeout(() => {
            showResponse(`Welcome ${userName}! Let's destroy procrastination together.`, 'welcome');
            localStorage.setItem('returningUser', 'true');
          }, 500);
        } else {
          setTimeout(() => {
            showResponse(`Welcome back, ${userName}. Time to destroy procrastination.`, 'welcome');
          }, 500);
        }
      }
    }
  }
function cleanupOldData() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    Object.keys(stats.dailyActivity).forEach(dateStr => {
      if (new Date(dateStr) < thirtyDaysAgo) {
        delete stats.dailyActivity[dateStr];
      }
    });
    
    saveStats();
  }

  setInterval(cleanupOldData, 24 * 60 * 60 * 1000);

  function loadStats() {
    // Check if this is a fresh install FIRST
    const isFirstRun = !localStorage.getItem('appInstalled');
    
    if (isFirstRun) {
      // CLEAR EVERYTHING for new install
      localStorage.clear();
      localStorage.setItem('appInstalled', 'true');
      
      // Set completely fresh stats
      stats = {
        focusStreak: 0,
        tasksCrushed: 0,
        quotesViewed: 0,
        savedQuotes: 0,
        totalFocusTime: 0,
        longestSession: 0,
        totalXp: 0,
        totalSessions: 0,
        frequentTask: '',
        topSpeaker: '',
        dailyActivity: {},
        achievements: {
          fireStarter: false,
          speedDemon: false,
          deepFocus: false,
          goalCrusher: false
        },
        currentWeeklyGoal: null,
        weeklyGoals: [],
        savedQuotesList: [],
        completedGoals: 0,
        powerUps: {
          beastMode: { unlocked: false, active: false },
          timeWarp: { unlocked: false, uses: 0 },
          motivationalSurge: { unlocked: false, uses: 0 }
        },
        initialized: true
      };
      saveStats();
      return; // STOP HERE - don't load old data
    }
    
    // Only load existing data if NOT first run
    const data = localStorage.getItem('procrastimateStats');
    if (data) {
      stats = JSON.parse(data);
      
      // ENSURE CLEAN START FOR NEW USERS
      if (!stats.initialized) {
        stats = {
          focusStreak: 0,
          tasksCrushed: 0,
          quotesViewed: 0,
          savedQuotes: 0,
          totalFocusTime: 0,
          longestSession: 0,
          totalXp: 0,
          totalSessions: 0,
          frequentTask: '',
          topSpeaker: '',
          dailyActivity: {},
          achievements: {
            fireStarter: false,
            speedDemon: false,
            deepFocus: false,
            goalCrusher: false
          },
          currentWeeklyGoal: null,
          weeklyGoals: [],
          savedQuotesList: [],
          completedGoals: 0,
          powerUps: {
            beastMode: { unlocked: false, active: false },
            timeWarp: { unlocked: false, uses: 0 },
            motivationalSurge: { unlocked: false, uses: 0 }
          },
          initialized: true
        };
        saveStats();
      }
      
      if (!stats.dailyActivity) stats.dailyActivity = {};
      if (!stats.achievements) {
        stats.achievements = {
          fireStarter: false,
          speedDemon: false,
          deepFocus: false,
          goalCrusher: false
        };
      }
      if (!stats.currentWeeklyGoal) stats.currentWeeklyGoal = null;
      if (!stats.powerUps) {
        stats.powerUps = {
          beastMode: { unlocked: false, active: false },
          timeWarp: { unlocked: false, uses: 0 },
          motivationalSurge: { unlocked: false, uses: 0 }
        };
      }
      if (!stats.savedQuotesList) stats.savedQuotesList = [];
    } else {
      // BRAND NEW USER - EVERYTHING AT ZERO
      stats = {
        focusStreak: 0,
        tasksCrushed: 0,
        quotesViewed: 0,
        savedQuotes: 0,
        totalFocusTime: 0,
        longestSession: 0,
        totalXp: 0,
        totalSessions: 0,
        frequentTask: '',
        topSpeaker: '',
        dailyActivity: {},
        achievements: {
          fireStarter: false,
          speedDemon: false,
          deepFocus: false,
          goalCrusher: false
        },
        currentWeeklyGoal: null,
        weeklyGoals: [],
        savedQuotesList: [],
        completedGoals: 0,
        powerUps: {
          beastMode: { unlocked: false, active: false },
          timeWarp: { unlocked: false, uses: 0 },
          motivationalSurge: { unlocked: false, uses: 0 }
        },
        initialized: true
      };
      saveStats();
    }
  }

  function forceResetForNewInstall() {
    // Check if this is a fresh install
    const isFirstRun = !localStorage.getItem('appInstalled');
    
    if (isFirstRun) {
      // CLEAR EVERYTHING
      localStorage.clear();
      sessionStorage.clear();
      
      // Set fresh stats
      stats = {
        focusStreak: 0,
        tasksCrushed: 0,
        quotesViewed: 0,
        savedQuotes: 0,
        totalFocusTime: 0,
        longestSession: 0,
        totalXp: 0,
        totalSessions: 0,
        frequentTask: '',
        topSpeaker: '',
        dailyActivity: {},
        achievements: {
          fireStarter: false,
          speedDemon: false,
          deepFocus: false,
          goalCrusher: false
        },
        currentWeeklyGoal: null,
        weeklyGoals: [],
        savedQuotesList: [],
        completedGoals: 0,
        powerUps: {
          beastMode: { unlocked: false, active: false },
          timeWarp: { unlocked: false, uses: 0 },
          motivationalSurge: { unlocked: false, uses: 0 }
        }
      };
      
      // Save clean stats
      localStorage.setItem('procrastimateStats', JSON.stringify(stats));
      localStorage.setItem('appInstalled', 'true');
    }
  }

  // quotes data
  const quotes = {
    goggins: [
      "YOU ARE IN DANGER OF LIVING A LIFE SO COMFORTABLE THAT YOU NEVER REALIZE YOUR TRUE POTENTIAL",
      "THE ONLY PERSON WHO WAS GOING TO TURN MY LIFE AROUND WAS ME",
      "WHEN YOU THINK YOU'RE DONE, YOU'RE ONLY AT 40% OF YOUR BODY'S CAPABILITY",
      "STAY HARD! DON'T LET YOUR MIND BULLY YOUR BODY",
      "THE MOST IMPORTANT CONVERSATIONS YOU'LL HAVE ARE WITH YOURSELF",
      "YOU HAVE TO BUILD CALLUSES ON YOUR BRAIN JUST LIKE YOUR HANDS",
      "SUFFERING IS THE TRUE TEST OF LIFE",
      "WE LIVE IN AN EXTERNAL WORLD. TO FIND GREATNESS, YOU HAVE TO GO INSIDE"
    ],
    jocko: [
      "Discipline equals freedom.",
      "Get up early and go. Go after it.",
      "Extreme ownership. Take responsibility for everything.",
      "Don't expect to be motivated every day to get out there and make things happen.",
      "The moment the alarm goes off is the first test; it sets the tone for the rest of the day.",
      "Good. When things are going bad, there's going to be some good that will come from it.",
      "The pathway to improvement is a full recognition of lack thereof.",
      "Leadership is the most important thing on the battlefield."
    ],
    gary: [
      "Your legacy is being written by yourself. Make the right decisions.",
      "Skills are cheap. Passion is priceless.",
      "The biggest risk is not taking any risk.",
      "Patience is the secret sauce. Patience with urgency.",
      "Stop whining. Stop complaining. Stop making excuses.",
      "You have to understand your own personal DNA.",
      "I'm not afraid to fail. I'm afraid to not try.",
      "Hustle is the most important word ever."
    ],
    andrew_tate: [
      "You are exactly where you deserve to be. Change who you are and you will change how you live.",
      "Your mind must be stronger than your feelings.",
      "The temporary satisfaction of quitting is outweighed by the eternal suffering of being nobody.",
      "Discipline is the key to all success. Absolutely is.",
      "Close your eyes. Focus on making yourself feel excited, powerful. Imagine destroying every obstacle.",
      "The harder you work, the more important you become.",
      "Sadness is a warning. You feel it for a reason."
    ],
    kobe: [
      "Everything negative – pressure, challenges – is all an opportunity for me to rise.",
      "The moment you give up is the moment you let someone else win.",
      "Pain doesn't tell you when you ought to stop. Pain is the little voice in your head that tries to hold you back.",
      "I have nothing in common with lazy people who blame others for their lack of success.",
      "Great things come from hard work and perseverance. No excuses.",
      "The most important thing is to try and inspire people so that they can be great at whatever they want to do.",
      "If you're afraid to fail, then you're probably going to fail."
    ],
    mike_tyson: [
     "Discipline is doing what you hate to do, but nonetheless doing it like you love it.",
     "Everyone has a plan until they get punched in the mouth.",
     "In order to succeed greatly, you have to be prepared to fail greatly.",
     "The fighting is the reward. The fighting is the answer.",
     "I'm the best ever. There's never been anybody as ruthless.",
     "Fear is the greatest obstacle to learning. But fear is your best friend.",
     "Without discipline, no matter how good you are, you are nothing."
   ],
   ct_fletcher: [
     "IT'S STILL YOUR SET!",
     "ISYMFS - It's Still Your Mother F***ing Set!",
     "Obsession is what lazy people call dedication.",
     "Pain is necessary. Embrace the pain.",
     "I command you to grow!",
     "Your mind is the strongest muscle in your body.",
     "Comfort makes more prisoners than all the jails combined."
   ],
   les_brown: [
     "You don't have to be great to get started, but you have to get started to be great.",
     "If you do what is easy, your life will be hard. But if you do what is hard, your life will be easy.",
     "You must be willing to do what others won't do today, to have what others won't have tomorrow.",
     "The graveyard is the richest place on earth. Don't go there with your dreams.",
     "Most people fail in life not because they aim too high and miss, but because they aim too low and hit.",
     "You gotta be hungry!",
     "It's possible. It's necessary. It's hard. It's worth it."
   ],
   eric_thomas: [
     "When you want to succeed as bad as you want to breathe, then you'll be successful.",
     "Pain is temporary. It may last a minute, an hour, a day, or even a year, but eventually it will subside.",
     "You can't cheat the grind. It knows how much you've invested. It won't give you nothing you haven't worked for.",
     "Stop being average. You're not even good. You were born to be great.",
     "The only way to get out of mediocrity is to keep shooting for excellence.",
     "Champions don't become champions in the ring. They become champions in their daily training.",
     "Everybody wants to be a beast, until it's time to do what beasts do."
   ],
   tony_robbins: [
     "The only impossible journey is the one you never begin.",
     "Your past does not equal your future.",
     "The path to success is to take massive, determined action.",
     "Where focus goes, energy flows and results show.",
     "It's not what we do once in a while that shapes our lives. It's what we do consistently.",
     "The quality of your life is the quality of your relationships.",
     "Setting goals is the first step in turning the invisible into the visible."
   ],
   jordan_peterson: [
     "Compare yourself to who you were yesterday, not to who someone else is today.",
     "What you aim at determines what you see.",
     "You cannot be protected from the things that frighten you and hurt you, but if you identify with the part of your being that is responsible for transformation, then you are always equal to the moment.",
     "Pursue what is meaningful, not what is expedient.",
     "To stand up straight with your shoulders back is to accept the terrible responsibility of life.",
     "You're going to pay a price for every bloody thing you do and everything you don't do.",
     "The purpose of life is finding the largest burden that you can bear and bearing it."
   ],
   joe_rogan: [
     "Be the hero of your own story.",
     "Excellence in anything increases your potential in everything.",
     "The universe rewards calculated risk and passion.",
     "There's only one way to avoid criticism: do nothing, say nothing, and be nothing.",
     "The key to happiness doesn't lay in numbers in a bank account but in the way we make others feel.",
     "If you ever start taking things too seriously, just remember that we are talking monkeys on an organic spaceship flying through the universe.",
     "Write down things you want to improve. Write down things you want to learn. Write down ways to be better."
   ],
   andy_frisella: [
     "You are your only limit.",
     "Champions don't become champions in the ring. They become champions in their daily training.",
     "Success is never owned, it's rented. And the rent is due every day.",
     "Nobody is coming to save you. This life is 100% your responsibility.",
     "Winners win. Losers make excuses.",
     "Dreams don't work unless you do.",
     "The only thing standing between you and your goal is the story you keep telling yourself."
   ],
   cam_hanes: [
     "Nobody cares, work harder.",
     "Lift heavy, run hard, hunt harder.",
     "The only easy day was yesterday.",
     "Comfort is your enemy.",
     "Keep hammering.",
     "You can't hurt me.",
     "Pain is just weakness leaving the body."
   ],
   ross_edgley: [
     "Strength is not a physical capacity. It is an indomitable will.",
     "You're capable of so much more than you know.",
     "The body achieves what the mind believes.",
     "Comfort zone is where dreams go to die.",
     "Embrace the suck.",
     "You don't have to be great to start, but you have to start to be great.",
     "The ocean doesn't care how tough you think you are."
   ],
   wim_hof: [
     "The cold is my teacher.",
     "We can do more than we think.",
     "Feeling is understanding.",
     "If you can learn how to use your mind, anything is possible.",
     "The cold is merciless but righteous.",
     "Breathe motherf***er!",
     "We have become alienated from nature, but the cold is bringing us back."
   ],
   conor_mcgregor: [
     "There's no talent here, this is hard work. This is an obsession.",
     "Doubt is only removed by action. If you're not working then that's when doubt comes in.",
     "I am cocky in prediction. I am confident in preparation, but I am always humble in victory or defeat.",
     "Precision beats power, and timing beats speed.",
     "We're not here to take part, we're here to take over.",
     "I fear no man. If you breathe oxygen, I do not fear you.",
     "Excellence is not a skill, excellence is an attitude."
   ],
   dan_pena: [
     "You can't have a million dollar dream with a minimum wage work ethic.",
     "Show me your friends and I'll show you your future.",
     "Tough times don't last – tough people do.",
     "Fear is the thief of dreams.",
     "Just f***ing do it!",
     "You've been playing it small your whole life.",
     "Don't waste time on things you can't control."
   ],
   grant_cardone: [
     "Success is your duty, obligation and responsibility.",
     "Average is a failing formula.",
     "Go all in on your dreams, or don't go at all.",
     "Your greatness is limited only by the investments you make in yourself.",
     "Be obsessed or be average.",
     "Success loves speed.",
     "10X your goals and 10X your actions."
   ],
   alex_hormozi: [
     "You don't become confident by shouting affirmations in the mirror, but by having a stack of undeniable proof that you are who you say you are.",
     "The longer you delay the ask, the bigger the ask you can make.",
     "Skills pay the bills.",
     "Poor people stay poor because they think the money is the problem.",
     "The work works on you more than you work on it.",
     "Volume negates luck.",
     "You get rich by becoming valuable, not by trading time."
   ]
  };

  const toughLoveMessages = [
    "STOP MAKING EXCUSES. YOUR FUTURE SELF IS COUNTING ON YOU RIGHT NOW.",
    "WHILE YOU'RE SCROLLING, SOMEONE ELSE IS GRINDING. DON'T BE LEFT BEHIND.",
    "THAT TASK ISN'T GOING TO MAGICALLY COMPLETE ITSELF. GET MOVING.",
    "YOU'VE BEEN 'GOING TO START TOMORROW' FOR HOW LONG NOW? TODAY IS TOMORROW.",
    "COMFORT ZONE IS A BEAUTIFUL PLACE, BUT NOTHING GROWS THERE. MOVE.",
    "YOUR DREAMS DON'T HAVE AN EXPIRATION DATE, BUT YOUR MOTIVATION MIGHT.",
    "THE ONLY WAY TO EAT AN ELEPHANT IS ONE BITE AT A TIME. TAKE THE FIRST BITE.",
    "STOP WAITING FOR THE PERFECT MOMENT. THE PERFECT MOMENT IS NOW."
  ];
function formatFocusTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const min = minutes % 60;
    return `${hrs} hrs ${min} min`;
  }

  function updateStatsUI() {
    // calc average session time
    if (stats.totalSessions > 0) {
      const avgMinutes = Math.round(stats.totalFocusTime / stats.totalSessions);
      document.querySelectorAll('.stat-avg-time').forEach(el => {
        el.textContent = `${avgMinutes}m`;
      });
    } else {
      document.querySelectorAll('.stat-avg-time').forEach(el => {
        el.textContent = '0m';
      });
    }

    // format total time
    const totalHours = Math.floor(stats.totalFocusTime / 60);
    const totalMins = stats.totalFocusTime % 60;
    document.querySelectorAll('.stat-total-time').forEach(el => {
      el.textContent = totalHours > 0 ? `${totalHours}h ${totalMins}m` : `${totalMins}m`;
    });

    // calc week total
    let weekTotal = 0;
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i);
      const dateStr = date.toLocaleDateString('en-CA');
      if (stats.dailyActivity[dateStr]) {
        weekTotal += stats.dailyActivity[dateStr].focusMinutes;
      }
    }

    document.querySelectorAll('.stat-week-total').forEach(el => {
      el.textContent = `${weekTotal} min total`;
    });

    // update other stats
    document.querySelectorAll('.progress-streak').forEach(el => el.textContent = stats.focusStreak);
    document.querySelectorAll('.progress-tasks').forEach(el => el.textContent = stats.tasksCrushed);
    document.querySelectorAll('.stat-focus-time').forEach(el => el.textContent = formatFocusTime(stats.totalFocusTime));
    document.querySelectorAll('.stat-frequent-task').forEach(el => el.textContent = stats.frequentTask || 'None yet');
    document.querySelectorAll('.stat-quotes-viewed').forEach(el => el.textContent = stats.quotesViewed);
    document.querySelectorAll('.stat-top-speaker').forEach(el => el.textContent = stats.topSpeaker);
    document.querySelectorAll('.stat-longest-session').forEach(el => el.textContent = `${stats.longestSession} min`);
    document.querySelectorAll('.stat-saved-quotes').forEach(el => el.textContent = stats.savedQuotes);
    document.querySelectorAll('.stat-total-sessions').forEach(el => el.textContent = stats.totalSessions);
    document.querySelectorAll('.stat-current-streak').forEach(el => el.textContent = `${stats.focusStreak} days`);

    // calc best day
    let bestDay = '';
    let bestMinutes = 0;
    Object.entries(stats.dailyActivity).forEach(([date, data]) => {
      if (data.focusMinutes > bestMinutes) {
        bestMinutes = data.focusMinutes;
        bestDay = new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      }
    });
    document.querySelectorAll('.stat-best-day').forEach(el => el.textContent = bestDay || '-');

    // calc this month's total
    let monthTotal = 0;
    const currentMonth = new Date().getMonth();
    Object.entries(stats.dailyActivity).forEach(([date, data]) => {
      if (new Date(date).getMonth() === currentMonth) {
        monthTotal += data.focusMinutes;
      }
    });
    document.querySelectorAll('.stat-month-total').forEach(el => {
      el.textContent = `${Math.floor(monthTotal/60)}h ${monthTotal%60}m`;
    });
    
    const totalXpTimer = document.getElementById('total-xp-timer');
    if (totalXpTimer) totalXpTimer.textContent = stats.totalXp;

    const focusStreakTimer = document.getElementById('focus-streak');
    if (focusStreakTimer) focusStreakTimer.textContent = stats.focusStreak;
    
    renderAchievements();
    
    setTimeout(drawFocusChart, 100);
    updateSessionsToday();
    
    document.querySelectorAll('.progress-streak').forEach(el => {
      el.textContent = stats.focusStreak;
    });
    document.querySelectorAll('.progress-tasks').forEach(el => {
      el.textContent = stats.tasksCrushed;
    });
    renderSavedQuotes();
  }

  function updateSessionsToday() {
    const today = getTodayString();
    const todayData = stats.dailyActivity[today];
    const sessionsToday = todayData ? todayData.sessions : 0;
    
    const sessionsTodayEl = document.getElementById('sessions-today');
    if (sessionsTodayEl) {
      sessionsTodayEl.textContent = sessionsToday;
    }
  }

  function renderAchievements() {
    const list = document.getElementById('achievements-list');
    if (!list) return;
    
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    const achievements = [
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="w-6 h-6 text-red-400 align-middle"><rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor"/><path stroke-linecap="round" stroke-width="1.7" d="M16 2v4M8 2v4"/><path stroke-linecap="round" d="M3 10h18"/></svg>`,
        label: 'Week Warrior',
        desc: '5 days/week',
        unlocked: checkWeeklyActivity() >= 5,
        progress: `${checkWeeklyActivity()}/5`
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="w-6 h-6 text-yellow-400 align-middle"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8L21 10h-9l1-8z"/></svg>`,
        label: 'Power Hour',
        desc: '10 hrs/week',
        unlocked: getWeeklyTotal() >= 600,
        progress: `${Math.floor(getWeeklyTotal()/60)}/10h`
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 text-red-400 align-middle"><circle cx="12" cy="12" r="9" stroke="currentColor"/><circle cx="12" cy="12" r="5" stroke="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor" /></svg>`,
        label: 'Goal Getter',
        desc: '3 goals done',
        unlocked: (stats.completedGoals || 0) >= 3,
        progress: `${stats.completedGoals || 0}/3`
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="w-6 h-6 text-yellow-500 align-middle"><path stroke-linecap="round" stroke-linejoin="round" d="M8 21h8M12 17v4m-6-8a6 6 0 0012 0M5 11V7a2 2 0 012-2h10a2 2 0 012 2v4m-2 0a6 6 0 01-12 0"/></svg>`,
        label: 'Elite Focus',
        desc: '100+ sessions',
        unlocked: stats.totalSessions >= 100,
        progress: `${stats.totalSessions}/100`
      }
    ];

    achievements.forEach(a => {
      const div = document.createElement('div');
      div.className = `bg-[#1A1A1A] rounded-xl p-3 text-center border ${a.unlocked ? 'border-red-500/30' : 'border-gray-700 opacity-50'} relative`;
      
      const iconDiv = document.createElement('div');
      iconDiv.className = 'w-full flex justify-center mb-1';
      iconDiv.innerHTML = a.icon;
      
      const labelDiv = document.createElement('div');
      labelDiv.className = `text-xs font-semibold ${a.unlocked ? 'text-red-400' : 'text-gray-500'}`;
      labelDiv.textContent = a.label;
      
      const descDiv = document.createElement('div');
      descDiv.className = 'text-xs text-gray-500';
      descDiv.textContent = a.desc;
      
      const progressDiv = document.createElement('div');
      progressDiv.className = 'text-xs text-gray-600 mt-1';
      progressDiv.textContent = a.progress;
      
      div.appendChild(iconDiv);
      div.appendChild(labelDiv);
      div.appendChild(descDiv);
      if (!a.unlocked) div.appendChild(progressDiv);
      
      list.appendChild(div);
    });
  }

  function checkWeeklyActivity() {
    let daysActive = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('en-CA');
      if (stats.dailyActivity[dateStr] && stats.dailyActivity[dateStr].focusMinutes > 0) {
        daysActive++;
      }
    }
    return daysActive;
  }

  function getWeeklyTotal() {
    let total = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('en-CA');
      if (stats.dailyActivity[dateStr]) {
        total += stats.dailyActivity[dateStr].focusMinutes;
      }
    }
    return total;
  }

  function updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = `${hours}:${minutes}`;
    }
  }

  function showAchievement(icon, title, desc) {
    playSound('achievement');
    const popup = document.getElementById('achievement-popup');
    const iconEl = document.getElementById('achievement-icon');
    const titleEl = document.getElementById('achievement-title');
    const descEl = document.getElementById('achievement-desc');
    
    iconEl.innerHTML = icon || "🏆";
    titleEl.textContent = title || "Achievement Unlocked!";
    descEl.textContent = desc || "";

    popup.classList.remove('hidden');
    popup.querySelector('div').classList.remove('achievement-popup-hide');
    popup.querySelector('div').classList.add('achievement-popup-active');

    setTimeout(() => {
      popup.querySelector('div').classList.remove('achievement-popup-active');
      popup.querySelector('div').classList.add('achievement-popup-hide');
      setTimeout(() => {
        popup.classList.add('hidden');
        popup.querySelector('div').classList.remove('achievement-popup-hide');
      }, 250);
    }, 2500);
  }

  function addXP(amount, event) {
    stats.totalXp += amount;
    
    if (event) {
      showXPGain(amount, event.clientX, event.clientY);
    } else {
      const xpDisplay = document.getElementById('total-xp');
      if (xpDisplay) {
        const rect = xpDisplay.getBoundingClientRect();
        showXPGain(amount, rect.left, rect.top);
      }
    }
    
    updateStatsUI();
    saveStats();
  }

  function showXPGain(amount, x, y) {
    const particle = document.createElement('div');
    particle.className = 'xp-particle';
    particle.textContent = `+${amount} GRIT`;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 2000);
  }

  function showXPGain(amount, x, y) {
    const particle = document.createElement('div');
    particle.className = 'xp-particle';
    particle.textContent = `+${amount} XP`;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 2000);
  }

function playSound(type) {
  const timerSoundEnabled = document.getElementById('timer-sound')?.checked ?? true;
  
  // If sound effects are OFF, don't play ANY sounds
  if (!timerSoundEnabled) return;
  
  try {
    const audio = new Audio();
    audio.volume = 0.3;
    
    switch(type) {
      case 'click':
        audio.src = 'sounds/click.mp3';
        break;
      case 'complete':
        audio.src = 'sounds/complete.mp3';
        break;
      case 'tick':
        audio.src = 'sounds/click.mp3';
        break;
      case 'achievement':
        audio.src = 'sounds/complete.mp3';
        break;
      case 'warning':
        audio.src = 'sounds/click.mp3';
        break;
    }
    
    if (audio.src) {
      audio.play().catch(e => console.log('Audio blocked:', e));
    }
  } catch (error) {
    console.log('Sound error:', error);
  }
}
// ambient sound system
  let ambientAudio = null;
  let audioContext = null;
  let oscillator = null;
  let gainNode = null;

function playAmbient(type) {
  // Stop all current sounds
  if (window.ambientAudio1) {
    window.ambientAudio1.pause();
    window.ambientAudio1 = null;
  }
  if (window.ambientAudio2) {
    window.ambientAudio2.pause();
    window.ambientAudio2 = null;
  }
  
  if (type === 'none') {
    document.querySelectorAll('.ambient-btn').forEach(btn => {
      btn.classList.remove('bg-red-500', 'text-white');
    });
    return;
  }
  
  // Create TWO audio elements for crossfading
  const audio1 = new Audio();
  const audio2 = new Audio();
  
  if (type === 'rain') {
    audio1.src = 'sounds/rain.mp3';
    audio2.src = 'sounds/rain.mp3';
  } else if (type === 'focus') {
    audio1.src = 'sounds/focus.mp3';
    audio2.src = 'sounds/focus.mp3';
  }
  
  audio1.volume = 0.15;
  audio2.volume = 0;
  
  // Start first audio
  audio1.play().catch(e => console.log('Audio1 error:', e));
  
  // Set up crossfade loop
  let currentAudio = audio1;
  let nextAudio = audio2;
  
  const crossfadeTime = 2000; // 2 second crossfade
  
  function setupCrossfade(current, next) {
    // When current audio is near the end, start fading
    current.addEventListener('timeupdate', function handler() {
      const timeLeft = (current.duration - current.currentTime) * 1000;
      
      if (timeLeft <= crossfadeTime && next.paused) {
        // Start the next audio
        next.currentTime = 0;
        next.volume = 0;
        next.play().catch(e => console.log('Crossfade error:', e));
        
        // Fade out current, fade in next
        let fadeProgress = 0;
        const fadeInterval = setInterval(() => {
          fadeProgress += 50;
          const fadePercent = fadeProgress / crossfadeTime;
          
          current.volume = Math.max(0, 0.15 * (1 - fadePercent));
          next.volume = Math.min(0.15, 0.15 * fadePercent);
          
          if (fadeProgress >= crossfadeTime) {
            clearInterval(fadeInterval);
            current.pause();
            current.removeEventListener('timeupdate', handler);
            
            // Swap references
            const temp = currentAudio;
            currentAudio = nextAudio;
            nextAudio = temp;
            
            // Setup next crossfade
            setupCrossfade(currentAudio, nextAudio);
          }
        }, 50);
      }
    });
  }
  
  setupCrossfade(audio1, audio2);
  
  window.ambientAudio1 = audio1;
  window.ambientAudio2 = audio2;
  
  // Update button states
  document.querySelectorAll('.ambient-btn').forEach(btn => {
    btn.classList.remove('bg-red-500', 'text-white');
    if (btn.dataset.sound === type) {
      btn.classList.add('bg-red-500', 'text-white');
    }
  });
}

  document.querySelectorAll('.ambient-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playAmbient(btn.dataset.sound);
    });
  });

  // tab navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const timerPage = document.getElementById('timer-page');
      if (timerPage && !timerPage.classList.contains('hidden')) {
        hideTimerPage();
      }
      const tabName = item.dataset.tab;
      playSound('click');
      
      navItems.forEach(nav => {
        nav.classList.remove('text-red-500');
        nav.classList.add('text-gray-400', 'hover:text-white');
      });
      item.classList.remove('text-gray-400', 'hover:text-white');
      item.classList.add('text-red-500');
      
      tabSections.forEach(section => {
        section.classList.remove('active');
        setTimeout(() => {
          section.classList.add('hidden');
        }, 150);
      });

      const targetSection = document.getElementById(`tab-${tabName}`);
      if (targetSection) {
        targetSection.classList.remove('hidden');
        setTimeout(() => {
          targetSection.classList.add('active');
        }, 10);
      }
    });
  });

  // timer functions
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    if (timerDisplay) {
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  function startTimerCountdown() {
    if (timeLeft <= 0) {
      resetTimerCountdown();
      return;
    }
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      isTimerRunning = false;
      if (startTimer) startTimer.textContent = 'Start';
      if (timerDisplay) timerDisplay.classList.remove('timer-pulse');
      return;
    }
    
    isTimerRunning = true;
    if (timerDisplay) timerDisplay.classList.add('timer-pulse');
    
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 10 && timeLeft > 0) {
        playSound('tick');
      }
      updateTimerDisplay();
      
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        isTimerRunning = false;
        if (startTimer) startTimer.textContent = 'Start';
        if (timerDisplay) timerDisplay.classList.remove('timer-pulse');
        
        playSound('complete');
        addXP(selectedMinutes * 2);
        updateDailyActivity(selectedMinutes, 0, true);
        stats.totalFocusTime += selectedMinutes;
        if (selectedMinutes > stats.longestSession) {
          stats.longestSession = selectedMinutes;
        }
        saveStats();
        updateStatsUI();
        console.log('After timer completion, daily activity:', stats.dailyActivity);
        
        if (selectedMinutes >= 60 && stats.longestSession < selectedMinutes) {
          stats.longestSession = selectedMinutes;
          saveStats();
          showAchievement("Deep Focus Master", "Completed 1+ hour session!");
        }
        
        showResponse("🎉 Focus session complete! You're on fire!");
      }
    }, 1000);
    
    if (startTimer) startTimer.textContent = 'Pause';
  }

  function resetTimerCountdown() {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    timeLeft = selectedMinutes * 60;
    updateTimerDisplay();
    if (startTimer) startTimer.textContent = 'Start';
    if (timerDisplay) timerDisplay.classList.remove('timer-pulse');
  }

  // timer event listeners
  if (startTimer) {
    startTimer.addEventListener('click', startTimerCountdown);
  }

  if (resetTimer) {
    resetTimer.addEventListener('click', resetTimerCountdown);
  }

  // focus functionality
  if (lockInCard) {
    lockInCard.addEventListener('click', () => {
      playSound('click');
      const task = focusTask?.value.trim();
      if (!task) {
        showResponse("Please enter a task to begin", 'warning');
        if (focusTask) focusTask.focus();
        return;
      }

      showTimerPage(selectedMinutes, task);

      stats.frequentTask = task;
      saveStats();
      addXP(10);
    });
  }

  if (toughLoveCard) {
    toughLoveCard.addEventListener('click', () => {
      playSound('warning');
      const randomMessage = toughLoveMessages[Math.floor(Math.random() * toughLoveMessages.length)];
      if (modalMessage) modalMessage.textContent = randomMessage;
      if (modalOverlay) {
        modalOverlay.classList.remove('hidden');
        modalOverlay.classList.add('flex');
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (modalOverlay) {
        modalOverlay.classList.add('hidden');
        modalOverlay.classList.remove('flex');
      }
    });
  }

  // click outside modal to close
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
        modalOverlay.classList.remove('flex');
      }
    });
  }

  // response message function
  function showResponse(message, type = 'default') {
    if (responseText && responseMessage) {
      let icon = '';
      if (type === 'welcome') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block mr-2 text-red-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>`;
      } else if (type === 'warning') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block mr-2 text-yellow-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>`;
      } else if (type === 'success') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block mr-2 text-green-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`;
      } else if (type === 'error') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block mr-2 text-red-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>`;
      }
      
      responseText.innerHTML = icon + message;
      responseMessage.classList.remove('hidden');
      
      responseMessage.style.opacity = '0';
      responseMessage.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        responseMessage.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        responseMessage.style.opacity = '1';
        responseMessage.style.transform = 'translateY(0)';
      }, 10);
      
      setTimeout(() => {
        responseMessage.style.opacity = '0';
        responseMessage.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          responseMessage.classList.add('hidden');
        }, 300);
      }, 4000);
    }
  }
// speaker cards
  const speakerContainer = document.getElementById('speaker-cards-container');
  const scrollLeftBtn = document.getElementById('speaker-scroll-left');
  const scrollRightBtn = document.getElementById('speaker-scroll-right');

  function centerCardInView(card) {
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function updateArrowState() {
    if (!speakerContainer || !scrollLeftBtn || !scrollRightBtn) return;

    const maxScrollLeft = speakerContainer.scrollWidth - speakerContainer.clientWidth;
    const atStart = speakerContainer.scrollLeft <= 0;
    const atEnd = speakerContainer.scrollLeft >= maxScrollLeft - 1;

    scrollLeftBtn.disabled = atStart;
    scrollRightBtn.disabled = atEnd;

    scrollLeftBtn.style.opacity = atStart ? '0.3' : '1';
    scrollRightBtn.style.opacity = atEnd ? '0.3' : '1';
  }

  function pageWidth() {
    return speakerContainer ? Math.max(speakerContainer.clientWidth * 0.9, 1) : 320;
  }

  if (scrollLeftBtn && scrollRightBtn && speakerContainer) {
    scrollLeftBtn.addEventListener('click', () => {
      speakerContainer.scrollBy({ left: -pageWidth(), behavior: 'smooth' });
    });
    scrollRightBtn.addEventListener('click', () => {
      speakerContainer.scrollBy({ left: pageWidth(), behavior: 'smooth' });
    });

    speakerContainer.addEventListener('scroll', updateArrowState, { passive: true });

    updateArrowState();
  }

  // vertical speaker list
  const verticalContainer = document.getElementById('speaker-cards-vertical');
  const scrollUpBtn = document.getElementById('speaker-scroll-up');
  const scrollDownBtn = document.getElementById('speaker-scroll-down');
  const verticalWrapper = document.getElementById('speaker-wrapper')?.querySelector('div');

  function updateVerticalArrows() {
    if (!verticalWrapper || !scrollUpBtn || !scrollDownBtn) return;
    
    const isAtTop = verticalWrapper.scrollTop <= 10;
    const isAtBottom = verticalWrapper.scrollTop >= (verticalWrapper.scrollHeight - verticalWrapper.clientHeight - 10);
    
    scrollUpBtn.disabled = isAtTop;
    scrollDownBtn.disabled = isAtBottom;
    
    scrollUpBtn.style.opacity = isAtTop ? '0.3' : '1';
    scrollDownBtn.style.opacity = isAtBottom ? '0.3' : '1';
  }

  if (scrollUpBtn && scrollDownBtn && verticalWrapper) {
    scrollUpBtn.addEventListener('click', () => {
      verticalWrapper.scrollBy({ top: -120, behavior: 'smooth' });
    });
    
    scrollDownBtn.addEventListener('click', () => {
      verticalWrapper.scrollBy({ top: 120, behavior: 'smooth' });
    });

    verticalWrapper.addEventListener('scroll', updateVerticalArrows, { passive: true });
    
    updateVerticalArrows();
  }

  // click to select speaker and show quote
  speakerCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const speaker = card.dataset.speaker;
      if (!speaker) return;
      playSound('click');

      if (lastSpeaker && lastSpeaker !== speaker) revertQuoteIndicator(lastSpeaker);

      currentSpeaker = speaker;
      lastSpeaker = speaker;
      currentQuotes = quotes[speaker] || [];

      if (typingTimeout) clearTimeout(typingTimeout);

      const theme = getSpeakerTheme(currentSpeaker);
      function getCardSurface(el) { return el.querySelector('.relative'); }
      
      speakerCards.forEach(c => {
        const s = getCardSurface(c);
        if (s) s.style.boxShadow = '';
        c.classList.remove('active-speaker');
      });
      const surface = getCardSurface(card);
      if (surface) {
        surface.style.boxShadow = `0 0 0 2px ${theme.hex}, 0 10px 28px ${hexToRgba(theme.hex, 0.22)}`;
      }
      card.classList.add('active-speaker');

      if (verticalWrapper && verticalWrapper.contains(card)) {
        const viewportTop = verticalWrapper.scrollTop;
        const viewportBottom = viewportTop + verticalWrapper.clientHeight;
        const margin = 12;
        const cardTop = card.offsetTop;
        const cardBottom = cardTop + card.offsetHeight;
        let target = viewportTop;
        if (cardTop < viewportTop + margin) {
          target = Math.max(cardTop - margin, 0);
        } else if (cardBottom > viewportBottom - margin) {
          target = Math.min(cardBottom - verticalWrapper.clientHeight + margin, verticalWrapper.scrollHeight - verticalWrapper.clientHeight);
        }
        if (target !== viewportTop) {
          verticalWrapper.scrollTo({ top: target, behavior: 'smooth' });
        }
      } else {
        centerCardInView(card);
      }

      if (quoteText) quoteText.textContent = '';
      showRandomQuote();

      if (quoteControls) {
        quoteControls.classList.remove('hidden');
        quoteControls.classList.add('flex');
      }

      setTimeout(() => {
        if (quoteDisplay) quoteDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    });
  });

  const quoteVoiceLimit = {};
  // quote functions
  function showRandomQuote() {
    if (!currentQuotes.length) return;
    
    const randomQuote = currentQuotes[Math.floor(Math.random() * currentQuotes.length)];
    window.currentFullQuote = randomQuote;
    
    if (quoteText) {
      quoteText.textContent = '';
      quoteText.className = 'text-base font-bold leading-relaxed mb-3';
      quoteText.style.textTransform = 'none';
      quoteText.style.letterSpacing = 'normal';
    }
    
    if (quoteAuthor) {
      quoteAuthor.textContent = '';
      quoteAuthor.style.opacity = '0';
    }
    
    animateQuoteIndicator(currentSpeaker);

    typeText(`"${randomQuote}"`, quoteText, () => {
      setTimeout(() => {
        if (quoteAuthor) {
          quoteAuthor.style.opacity = '1';
          typeText(`— ${getSpeakerName(currentSpeaker)}`, quoteAuthor);
        }
      }, 500);

      setTimeout(() => revertQuoteIndicator(currentSpeaker), 1000);
    });

    stats.quotesViewed++;
    stats.topSpeaker = getSpeakerName(currentSpeaker);
    saveStats();
    updateStatsUI();
  }

// Track API usage
let elevenLabsUsage = {
  charactersUsed: 0,
  monthlyLimit: 10000
};

async function speakQuoteWithTyping(text, speaker) {
  if (typeof quoteMuted !== 'undefined' && quoteMuted) return null;
  
  if (elevenLabsUsage.charactersUsed >= elevenLabsUsage.monthlyLimit) {
    console.log('Monthly voice limit reached');
    return null;
  }
  
  try {
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio = null;
    }
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_LABS_KEY
      },
      body: JSON.stringify({
        text: text.replace(/"/g, '').substring(0, 300),
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.35,
          similarity_boost: 0.75,
          style: 0.25,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) return null;

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.volume = 0.85;
    window.currentAudio = audio;
    
    elevenLabsUsage.charactersUsed += text.length;
    localStorage.setItem('elevenLabsUsage', JSON.stringify(elevenLabsUsage));
    
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl);
      window.currentAudio = null;
    });
    
    return audio; 
    
  } catch (error) {
    console.log('ElevenLabs error:', error);
    return null;
  }
}

// Load saved usage on start
const savedUsage = localStorage.getItem('elevenLabsUsage');
if (savedUsage) {
  elevenLabsUsage = JSON.parse(savedUsage);
}

const lastReset = localStorage.getItem('elevenLabsReset');
const now = new Date();
if (!lastReset || new Date(lastReset).getMonth() !== now.getMonth()) {
  elevenLabsUsage.charactersUsed = 0;
  localStorage.setItem('elevenLabsUsage', JSON.stringify(elevenLabsUsage));
  localStorage.setItem('elevenLabsReset', now.toISOString());
}

  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };

  async function typeText(text, element, callback) {
    if (!element) return;
    let audio = null;
  
    if (text.startsWith('"') && currentSpeaker) {
      audio = await speakQuoteWithTyping(text.replace(/"/g, ''), currentSpeaker);
    }
  
  let i = 0;
  element.textContent = '';
  
  function addChar() {
    if (i < text.length) {
      element.textContent = text.slice(0, i + 1) + '|';
      i++;
      
      if (i === 1 && audio) {
        audio.play().catch(err => console.log('Audio play failed:', err));
      }
      
      let speed = 50;
      if (text[i - 1] === ' ') speed = 30;
      if (text[i - 1] === '.' || text[i - 1] === '!') speed = 200;
      
      typingTimeout = setTimeout(addChar, speed);
    } else {
      element.textContent = text;
      if (callback) callback();
    }
  }
  addChar();
}

  function getSpeakerTheme(speaker) {
    const themes = {
      goggins: { hex: '#ef4444' },
      jocko: { hex: '#3b82f6' },
      gary: { hex: '#f59e0b' },
      andrew_tate: { hex: '#8b5cf6' },
      kobe: { hex: '#f59e0b' },
      mike_tyson: { hex: '#f43f5e' },
      les_brown: { hex: '#fbbf24' },
      ct_fletcher: { hex: '#22c55e' },
      eric_thomas: { hex: '#0ea5e9' },
      tony_robbins: { hex: '#8b5cf6' },
      jordan_peterson: { hex: '#06b6d4' },
      joe_rogan: { hex: '#ec4899' },
      andy_frisella: { hex: '#8b5cf6' },
      cam_hanes: { hex: '#84cc16' },
      ross_edgley: { hex: '#f97316' },
      wim_hof: { hex: '#0ea5e9' },
      conor_mcgregor: { hex: '#22c55e' },
      dan_pena: { hex: '#8b5cf6' },
      grant_cardone: { hex: '#f97316' },
      alex_hormozi: { hex: '#06b6d4' }
    };
    return themes[speaker] || { hex: '#ef4444' };
  }

  function animateQuoteIndicator(speaker) {
    const card = document.querySelector(`[data-speaker="${speaker}"]`);
    if (!card) return;

    card.classList.add('pulse-active');
    setTimeout(() => card.classList.remove('pulse-active'), 600);

    const indicator = card.querySelector('.quote-indicator');
    if (!indicator) return;

    indicator.classList.add('active-glow');
    
    const theme = getSpeakerTheme(speaker);
    indicator.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6" style="color:${theme.hex}">
        <path d="M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"/>
      </svg>
    `;
  }

  function revertQuoteIndicator(speaker) {
    const card = document.querySelector(`[data-speaker="${speaker}"]`);
    if (!card) return;

    const indicator = card.querySelector('.quote-indicator');
    if (!indicator) return;

    indicator.classList.remove('active-glow');
    
    const theme = getSpeakerTheme(speaker);
    indicator.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6" style="color:${theme.hex}">
        <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
      </svg>
    `;
  }

  function initializeSpeakerColors() {
    const speakerCards = document.querySelectorAll('[data-speaker]');
    speakerCards.forEach(card => {
      const speaker = card.dataset.speaker;
      const indicator = card.querySelector('.quote-indicator');
      if (indicator && speaker) {
        const theme = getSpeakerTheme(speaker);
        const svg = indicator.querySelector('svg');
        if (svg) {
          svg.style.color = theme.hex;
        }
      }
    });
  }

  function getSpeakerName(speaker) {
    const names = {
      goggins: "David Goggins",
      jocko: "Jocko Willink",
      gary: "Gary Vaynerchuk",
      andrew_tate: "Andrew Tate",
      kobe: "Kobe Bryant",
      mike_tyson: "Mike Tyson",
      les_brown: "Les Brown",
      ct_fletcher: "CT Fletcher",
      eric_thomas: "Eric Thomas",
      tony_robbins: "Tony Robbins",
      jordan_peterson: "Jordan Peterson",
      joe_rogan: "Joe Rogan",
      andy_frisella: "Andy Frisella",
      cam_hanes: "Cam Hanes",
      ross_edgley: "Ross Edgley",
      wim_hof: "Wim Hof",
      conor_mcgregor: "Conor McGregor",
      dan_pena: "Dan Peña",
      grant_cardone: "Grant Cardone",
      alex_hormozi: "Alex Hormozi"
    };
    return names[speaker] || speaker;
  }

  function renderSavedQuotes() {
    const container = document.getElementById('saved-quotes-list');
    if (!container) return;
    container.innerHTML = '';
    if (stats.savedQuotesList.length === 0) {
      container.innerHTML = '<p class="text-gray-400">No saved quotes yet</p>';
      return;
    }
    stats.savedQuotesList.slice().reverse().forEach((quote, index) => {
      const div = document.createElement('div');
      div.className = 'bg-gray-900/50 rounded-lg p-3 border border-gray-600/30';
      div.innerHTML = `
        <p class="text-white text-sm mb-2">"${quote.text}"</p>
        <div class="flex justify-between items-center">
          <span class="text-gray-400 text-xs">— ${quote.speaker}</span>
          <button class="remove-quote-btn text-red-400 hover:text-red-300 text-xs" data-index="${stats.savedQuotesList.length - 1 - index}">Remove</button>
        </div>
      `;
      container.appendChild(div);
      const removeBtn = div.querySelector('.remove-quote-btn');
      removeBtn.addEventListener('click', () => {
        const idx = parseInt(removeBtn.dataset.index);
        stats.savedQuotesList.splice(idx, 1);
        stats.savedQuotes = Math.max(0, stats.savedQuotes - 1);
        saveStats();
        updateStatsUI();
        renderSavedQuotes();
      });
    });
  }   
  function removeSavedQuote(index) {
    stats.savedQuotesList.splice(index, 1);
    stats.savedQuotes = Math.max(0, stats.savedQuotes - 1);
    saveStats();
    updateStatsUI();
    renderSavedQuotes();
  }

  function hexToRgba(hex, alpha) {
    const h = hex.replace('#','');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
// new quote button
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener('click', () => {
      if (currentSpeaker) {
        if (typingInterval) clearInterval(typingInterval);
        showRandomQuote();
      }
    });
  }

  // save quote button
  if (saveQuoteBtn) {
    saveQuoteBtn.addEventListener('click', () => {
      if (currentSpeaker && window.currentFullQuote) {
        const quote = {
          text: window.currentFullQuote, // USE STORED QUOTE INSTEAD
          speaker: getSpeakerName(currentSpeaker),
          savedAt: new Date().toLocaleDateString()
        };
      
        stats.savedQuotesList.push(quote);
        stats.savedQuotes++;
        saveStats();
      
        addXP(3);
        updateStatsUI();
        renderSavedQuotes();
        showResponse('Quote saved to your collection', 'success');
      }
    });
  }

  const muteQuoteBtn = document.getElementById('mute-quote');
  let quoteMuted = false;

  if (muteQuoteBtn) {
    muteQuoteBtn.addEventListener('click', () => {
      quoteMuted = !quoteMuted;
      if (quoteMuted) {
        window.speechSynthesis.cancel();
        muteQuoteBtn.classList.add('opacity-50');
      } else {
        muteQuoteBtn.classList.remove('opacity-50');
      }
    });
  }

  // timer options
  timerOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (isTimerRunning) return;
      playSound('click'); 
      
      timerOptions.forEach(opt => opt.classList.remove('active', 'ring-2', 'ring-red-500'));
      option.classList.add('active', 'ring-2', 'ring-red-500');
      
      selectedMinutes = parseFloat(option.dataset.minutes);
      timeLeft = selectedMinutes * 60;
      updateTimerDisplay();
      
      playSound('click');
    });
  });

  // custom timer functionality
  const customTimerBtn = document.getElementById('custom-timer-btn');
  const customTimerModal = document.getElementById('custom-timer-modal');
  const customHours = document.getElementById('custom-hours');
  const customMinutes = document.getElementById('custom-minutes');
  const setCustom = document.getElementById('set-custom');
  const cancelCustom = document.getElementById('cancel-custom');

  if (customTimerBtn) {
    customTimerBtn.addEventListener('click', () => {
      customTimerModal.classList.remove('hidden');
      customTimerModal.classList.add('flex');
      
      if (customHours) customHours.value = '';
      if (customMinutes) customMinutes.value = '25';
    });
  }

  if (setCustom) {
    setCustom.addEventListener('click', () => {
      const hours = parseInt(customHours.value) || 0;
      const minutes = parseInt(customMinutes.value) || 0;
      const totalMinutes = hours * 60 + minutes;
      
      if (totalMinutes < 1) {
        customTimerModal.classList.add('hidden');
        customTimerModal.classList.remove('flex');
        setTimeout(() => {
          showResponse("Minimum session time is 1 minute", 'warning');
        }, 100);
        return;
      }
      
      if (totalMinutes > 180) {
        customTimerModal.classList.add('hidden');
        customTimerModal.classList.remove('flex');
        setTimeout(() => {
          showResponse("Maximum session time is 3 hours", 'warning');
        }, 100);
        return;
      }
      
      selectedMinutes = totalMinutes;
      timeLeft = selectedMinutes * 60;
      
      if (!isNaN(timeLeft) && timeLeft > 0) {
        updateTimerDisplay();
        updateMainTimerDisplay();
        
        if (totalMinutes >= 60) {
          const hrs = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          if (mins > 0) {
            customTimerBtn.querySelector('.text-lg').textContent = `${hrs}h ${mins}m`;
          } else {
            customTimerBtn.querySelector('.text-lg').textContent = `${hrs}h`;
          }
        } else {
          customTimerBtn.querySelector('.text-lg').textContent = totalMinutes;
        }
        customTimerBtn.querySelector('.text-xs').textContent = 'min';
        
        timerOptions.forEach(opt => opt.classList.remove('active', 'ring-2', 'ring-red-500'));
        customTimerBtn.classList.add('active', 'ring-2', 'ring-red-500');
        
        customTimerModal.classList.add('hidden');
        customTimerModal.classList.remove('flex');
        
        setTimeout(() => {
          showResponse(`Timer set to ${totalMinutes} minutes`, 'success');
        }, 100);
      } else {
        selectedMinutes = 25;
        timeLeft = 25 * 60;
        updateTimerDisplay();
        updateMainTimerDisplay();
        showResponse("Error setting timer, using default 25 minutes", 'warning');
      }
    });
  }

  if (cancelCustom) {
    cancelCustom.addEventListener('click', () => {
      customTimerModal.classList.add('hidden');
      customTimerModal.classList.remove('flex');
    });
  }

  if (customTimerModal) {
    customTimerModal.addEventListener('click', (e) => {
      if (e.target === customTimerModal) {
        customTimerModal.classList.add('hidden');
        customTimerModal.classList.remove('flex');
      }
    });
  }

  // logout functionality
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    if (confirm('Sign out? Your progress is saved.')) {
      await auth.signOut();
      location.reload();
    }
  });

  // change password
  document.getElementById('change-password-btn')?.addEventListener('click', async () => {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (newPassword && newPassword.length >= 6) {
      try {
        await currentUser.updatePassword(newPassword);
        showResponse('Password updated successfully', 'success');
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          alert('Please sign out and sign back in to change your password.');
        } else {
          alert(error.message);
        }
      }
    }
  });

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      if (settingsPanel) settingsPanel.classList.add('open');
      if (currentUser) {
        const userEmailEl = document.getElementById('user-email');
        if (userEmailEl) userEmailEl.textContent = currentUser.email;
      }
    });
  }

  if (closeSettings) {
    closeSettings.addEventListener('click', () => {
      if (settingsPanel) settingsPanel.classList.remove('open');
    });
  }

  // keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement === focusTask) {
      lockInCard?.click();
    } else if (e.key === ' ' && timerSection && !timerSection.classList.contains('hidden')) {
      e.preventDefault();
      startTimer?.click();
    } else if (e.key === 'Escape') {
      if (modalOverlay && !modalOverlay.classList.contains('hidden')) {
        modalClose?.click();
      }
      if (settingsPanel && settingsPanel.classList.contains('open')) {
        settingsPanel.classList.remove('open');
      }
      if (customTimerModal && !customTimerModal.classList.contains('hidden')) {
        customTimerModal.classList.add('hidden');
        customTimerModal.classList.remove('flex');
      }
    }
  });

  // multi goal system
  const weeklyGoalInput = document.getElementById('weekly-goal-input');
  const saveGoalBtn = document.getElementById('save-goal');
  const goalSavedText = document.getElementById('goal-saved-text');
  const weeklyGoalsList = document.getElementById('weekly-goals-list');

  if (!stats.weeklyGoals) stats.weeklyGoals = [];

  function renderWeeklyGoals() {
    if (!weeklyGoalsList) return;
    weeklyGoalsList.innerHTML = '';
    stats.weeklyGoals.forEach((goal, i) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between py-1';

      const label = document.createElement('span');
      label.textContent = goal.text;
      label.className = goal.done ? 'line-through text-gray-400' : '';

      const btns = document.createElement('div');
      btns.className = 'flex items-center gap-1';

      if (!goal.done) {
        const doneBtn = document.createElement('button');
        doneBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-500 align-middle">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        `;

        doneBtn.className = 'ml-2';

        doneBtn.onclick = () => {
          goal.done = true;
          stats.completedGoals = (stats.completedGoals || 0) + 1;
          addXP(50);
          saveStats();
          renderWeeklyGoals();
          showAchievement(
            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-yellow-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
            </svg>`,
            "Weekly Goal Complete!",
            `You've crushed ${stats.completedGoals} goals so far!`
          );
        };
        btns.appendChild(doneBtn);
      }

      const delBtn = document.createElement('button');
      delBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors align-middle">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      `;

      delBtn.className = 'ml-2';

      delBtn.onclick = () => {
        stats.weeklyGoals.splice(i, 1);
        saveStats();
        renderWeeklyGoals();
      };
      btns.appendChild(delBtn);

      li.appendChild(label);
      li.appendChild(btns);
      weeklyGoalsList.appendChild(li);
    });
  }

  renderWeeklyGoals();

  if (saveGoalBtn) {
    saveGoalBtn.addEventListener('click', () => {
      const goalText = weeklyGoalInput.value.trim();
      if (!goalText) {
        showResponse("Please enter a goal", 'warning');
        return;
      }
      stats.weeklyGoals.push({ text: goalText, done: false });
      weeklyGoalInput.value = '';
      saveStats();
      renderWeeklyGoals();
      goalSavedText?.classList.remove('hidden');
      setTimeout(() => goalSavedText?.classList.add('hidden'), 2000);
      showResponse("Goal added successfully", 'success');
    });
  }

  // settings management
  const settings = {
    focusReminders: true,
    breakNotifications: true,
    achievementAlerts: true,
    timerSound: true,
    clickSounds: false
  };

  function loadSettings() {
    const saved = localStorage.getItem('procrastimateSettings');
    if (saved) {
      Object.assign(settings, JSON.parse(saved));
      const focusReminders = document.getElementById('focus-reminders');
      const breakNotifications = document.getElementById('break-notifications');
      const achievementAlerts = document.getElementById('achievement-alerts');
      const timerSound = document.getElementById('timer-sound');
      const clickSounds = document.getElementById('click-sounds');
      
      if (focusReminders) focusReminders.checked = settings.focusReminders;
      if (breakNotifications) breakNotifications.checked = settings.breakNotifications;
      if (achievementAlerts) achievementAlerts.checked = settings.achievementAlerts;
      if (timerSound) timerSound.checked = settings.timerSound;
      if (clickSounds) clickSounds.checked = settings.clickSounds;
    }
  }

  function saveSettings() {
    localStorage.setItem('procrastimateSettings', JSON.stringify(settings));
  }

  loadSettings();

  const toggles = document.querySelectorAll('.toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      const settingName = toggle.id.replace(/-/g, '');
      settings[settingName] = toggle.checked;
      saveSettings();
      if (settings.clickSounds) playSound('click');
    });
  });

  // data export/reset
  const exportBtn = document.getElementById('export-data');
  const resetBtn = document.getElementById('reset-data');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = { ...stats };
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'procrastimate-data.json';
      link.click();

      showResponse('Data exported successfully', 'success');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        stats.focusStreak = 0;
        stats.tasksCrushed = 0;
        stats.quotesViewed = 0;
        stats.savedQuotes = 0;
        stats.totalFocusTime = 0;
        stats.longestSession = 0;
        stats.totalXp = 0;
        stats.frequentTask = 'No tasks yet';
        stats.topSpeaker = 'None';
        stats.dailyActivity = {};
        stats.achievements = {
          fireStarter: false,
          speedDemon: false,
          deepFocus: false,
          goalCrusher: false
        };
        stats.currentWeeklyGoal = null;
        saveStats();

        updateStatsUI();
        updateWeeklyProgress();
        showResponse('All data has been reset', 'success');
      }
    });
  }
// initialize everything
  updateTimerDisplay();

  const focusTab = document.getElementById('tab-focus');
  if (focusTab) {
    focusTab.classList.add('active');
    focusTab.classList.remove('hidden');
  }

  function drawFocusChart() {
    const canvas = document.getElementById('focus-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const data = [];
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i);
      const dateStr = date.toLocaleDateString('en-CA');
      const dayData = stats.dailyActivity[dateStr];
      data.push(dayData ? dayData.focusMinutes : 0);
    }
    
    const maxVal = Math.max(...data, 60);
    const barWidth = (width / 7) - 8;
    const barSpacing = width / 7;
    
    data.forEach((val, i) => {
      const barHeight = val > 0 ? Math.max((val / maxVal) * (height - 25), 5) : 0;
      const x = i * barSpacing + 4;
      const y = height - barHeight - 15;
      
      if (val > 0) {
        const gradient = ctx.createLinearGradient(0, y, 0, height - 15);
        gradient.addColorStop(0, '#ff6655');
        gradient.addColorStop(1, '#ff4433');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();
        
        ctx.fillStyle = '#ff4433';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(val + 'm', x + barWidth/2, y - 5);
      } else {
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(x, height - 15 - 3, barWidth, 3);
      }
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barWidth/2, height - 2);
      
      const todayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
      if (i === todayIndex) {
        ctx.strokeStyle = '#ff4433';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x - 2, height - 15 - 5, barWidth + 4, 5, 2);
        ctx.stroke();
      }
    });
  }
  
  setTimeout(drawFocusChart, 100);

  setTimeout(() => {
    const progressBars = document.querySelectorAll('.bg-gradient-to-r');
    progressBars.forEach(bar => {
      bar.style.width = '0%';
      bar.style.transition = 'width 1.5s ease-out';
      
      setTimeout(() => {
        if (bar.classList.contains('w-3/4')) bar.style.width = '75%';
        if (bar.classList.contains('w-5/6')) bar.style.width = '83%';
        if (bar.classList.contains('w-4/5')) bar.style.width = '80%';
        if (bar.classList.contains('w-1/3')) bar.style.width = '33%';
      }, 500);
    });
  }, 1000);

  const allCards = document.querySelectorAll('.glass-card');
  allCards.forEach(card => {
    card.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

  updateStatsUI();
  updateCurrentTime();

  setInterval(updateCurrentTime, 60000);

  setTimeout(() => {
    showResponse('Welcome back. Ready to build momentum today?', 'welcome');
  }, 2000);

  function vibrate() {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  // huggingface api token
  const worker_url = "https://procrastimate-ai.saabachaoui.workers.dev";
  
  if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  });
}

async function getAIResponse(message) {
  try {
    const response = await fetch(worker_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    return data.response || "Stop making excuses. GET TO WORK!";
    
  } catch (error) {
    return "Connection issues don't stop champions. You know what to do!";
  }
}

  function getMotivationFallbackResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('tired') || msg.includes('lazy') || msg.includes('quit')) {
      const responses = [
        "Tired? Good! That means you're pushing your limits. Keep going! 💪",
        "Your mind quits before your body does. Push through that wall! 🔥",
        "Champions are built in moments like this. Don't you dare quit now! ⚡"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (msg.includes('procrastinat') || msg.includes('delay') || msg.includes('later')) {
      const responses = [
        "Stop negotiating with yourself! 5-4-3-2-1 GO! Action beats intention every time 🚀",
        "You're not procrastinating, you're choosing comfort over growth. Choose growth! 💯",
        "The perfect moment doesn't exist. Start messy, start scared, but START NOW! ⚡"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    const defaultResponses = [
      "What's your excuse today? Because I've heard them all and none of them matter. Let's GO! 🔥",
      "You have 24 hours in a day like everyone else. How are you going to use them? ⏰",
      "Stop waiting for motivation. Discipline is what separates winners from wishers! 💪",
      "Your comfort zone is your enemy. Step outside it and watch yourself transform! ⚡"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addChatMessage(message, 'user');
    chatInput.value = '';

    const aiResponse = await getAIResponse(message);
    addChatMessage(aiResponse, 'ai');
    addXP(2);
  }

  function addChatMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message mb-4`;

    if (sender === 'user') {
      messageDiv.innerHTML = `
        <div class="flex items-start gap-3 justify-end">
          <div class="bg-red-500 rounded-xl p-3 max-w-xs">
            <p class="text-white text-sm">${message}</p>
          </div>
          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-sm font-bold">👤</span>
          </div>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-sm font-bold">🤖</span>
          </div>
          <div class="bg-gray-800 rounded-xl p-3 max-w-xs">
            <p class="text-white text-sm">${message}</p>
          </div>
        </div>
      `;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  if (sendChatBtn) {
    sendChatBtn.addEventListener('click', sendChatMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }

  updateWeeklyProgress();

  function checkDailyStreak() {
    const lastActive = localStorage.getItem('lastActiveDate');
    const today = getTodayString();
    
    if (lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      if (lastActive === yesterdayString) {
        stats.focusStreak++;
      } else if (lastActive !== today) {
        if (stats.focusStreak > 0) {
          showResponse(`💔 Streak broken! You had ${stats.focusStreak} days`);
          stats.focusStreak = 0;
        }
      }
    }
    
    try {
      localStorage.setItem('lastActiveDate', today);
    } catch (error) {
      console.log('localStorage not available');
    }
    saveStats();
  }

  checkDailyStreak();

  // timer page functionality
  const timerPage = document.getElementById('timer-page');
  const backToFocus = document.getElementById('back-to-focus');
  const mainTimerDisplay = document.getElementById('main-timer-display');
  const mainStartTimer = document.getElementById('main-start-timer');
  const mainResetTimer = document.getElementById('main-reset-timer');
  const timerCurrentTask = document.getElementById('timer-current-task');
  const timerSessionInfo = document.getElementById('timer-session-info');

  function showTimerPage(minutes, task) {
    if (isNaN(minutes) || minutes <= 0) {
      minutes = 25;
    }
    
    selectedMinutes = minutes;
    timeLeft = selectedMinutes * 60;
    
    if (timerCurrentTask) timerCurrentTask.textContent = task;
    if (timerSessionInfo) timerSessionInfo.textContent = `${minutes} min session`;
    
    const minutesSpan = document.getElementById('timer-minutes');
    const secondsSpan = document.getElementById('timer-seconds');
    if (minutesSpan && secondsSpan) {
      minutesSpan.textContent = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      secondsSpan.textContent = (timeLeft % 60).toString().padStart(2, '0');
    }
    
    updateMainTimerDisplay();
    
    if (timerPage) {
      timerPage.classList.remove('hidden');
      setTimeout(() => {
        timerPage.classList.remove('translate-y-full');
      }, 10);
    }
  }

  function hideTimerPage() {
    if (timerPage) {
      timerPage.classList.add('translate-y-full');
      setTimeout(() => {
        timerPage.classList.add('hidden');
      }, 500);
    }
  }

  function updateMainTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const minutesSpan = document.getElementById('timer-minutes');
    const secondsSpan = document.getElementById('timer-seconds');
    
    if (!isNaN(minutes) && !isNaN(seconds) && minutesSpan && secondsSpan) {
      const minutesStr = minutes.toString().padStart(2, '0');
      const secondsStr = seconds.toString().padStart(2, '0');
      
      if (minutesSpan.textContent !== minutesStr) {
        minutesSpan.classList.remove('flipped');
        void minutesSpan.offsetWidth;
        minutesSpan.textContent = minutesStr;
        minutesSpan.classList.add('flipped');
        setTimeout(() => minutesSpan.classList.remove('flipped'), 400);
      }
      if (secondsSpan.textContent !== secondsStr) {
        secondsSpan.classList.remove('flipped');
        void secondsSpan.offsetWidth;
        secondsSpan.textContent = secondsStr;
        secondsSpan.classList.add('flipped');
        setTimeout(() => secondsSpan.classList.remove('flipped'), 400);
      }
    } else {
      if (minutesSpan) minutesSpan.textContent = '00';
      if (secondsSpan) secondsSpan.textContent = '00';
    }
  }
function startMainTimerCountdown() {
    if (timeLeft <= 0) {
      resetMainTimerCountdown();
      return;
    }
    
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      isTimerRunning = false;
      if (mainStartTimer) mainStartTimer.textContent = 'Start';
      if (mainTimerDisplay) mainTimerDisplay.classList.remove('timer-pulse');
      return;
    }
    
    isTimerRunning = true;
    if (mainTimerDisplay) mainTimerDisplay.classList.add('timer-pulse');
    
    timerInterval = setInterval(() => {
      timeLeft--;
      updateMainTimerDisplay();
      
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        isTimerRunning = false;
        if (mainStartTimer) mainStartTimer.textContent = 'Start';
        if (mainTimerDisplay) mainTimerDisplay.classList.remove('timer-pulse');
        
        playSound('complete');
        addXP(selectedMinutes * 2);
        updateDailyActivity(selectedMinutes, 0, true);
        stats.totalFocusTime += selectedMinutes;
        if (selectedMinutes > stats.longestSession) {
          stats.longestSession = selectedMinutes;
        }
        saveStats();
        updateStatsUI();
        
        setTimeout(() => {
          hideTimerPage();
          showResponse("Focus session complete. Excellent work!", 'success');
        }, 1000);
      }
    }, 1000);
    
    if (mainStartTimer) mainStartTimer.textContent = 'Pause';
  }

  function resetMainTimerCountdown() {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    timeLeft = selectedMinutes * 60;
    updateMainTimerDisplay();
    if (mainStartTimer) mainStartTimer.textContent = 'Start';
    if (mainTimerDisplay) mainTimerDisplay.classList.remove('timer-pulse');
  }

  // event listeners
  if (backToFocus) {
    backToFocus.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideTimerPage();
    });
  }

  if (mainStartTimer) {
    mainStartTimer.addEventListener('click', startMainTimerCountdown);
  }

  if (mainResetTimer) {
    mainResetTimer.addEventListener('click', resetMainTimerCountdown);
  }

  // floating action button
  const fabTimer = document.getElementById('fab-timer');
  if (fabTimer) {
    fabTimer.addEventListener('click', () => {
      playSound('click'); 
      const task = focusTask?.value.trim() || 'Quick Focus Session';
      showTimerPage(25, task);
      stats.tasksCrushed++;
      updateDailyActivity(0, 1);
      saveStats();
      addXP(5);
      updateStatsUI();
    });
  }

  updateWeeklyProgress();
  drawFocusChart();
  console.log('Stats initialized. Current daily activity:', stats.dailyActivity);
  console.log('Current date for tracking:', getTodayString());

  initializeSpeakerColors();

  updateStatsUI();
  updateCurrentTime();

  // hide FAB when coach tab is active
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const fabTimer = document.getElementById('fab-timer');
      if (item.dataset.tab === 'coach') {
        fabTimer.style.display = 'none';
      } else {
        fabTimer.style.display = 'flex';
      }
    });
  });

}); // end of DOMContentLoaded