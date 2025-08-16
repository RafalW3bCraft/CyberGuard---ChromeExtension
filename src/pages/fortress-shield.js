// CyberGuard Fortress Shield Controller
(function() {
  'use strict';
  
  console.log('🛡️ Digital Fortress Shield Initializing...');
  
  // DOM Elements
  const elements = {
    matrixBg: document.getElementById('matrixBg'),
    blockedSite: document.getElementById('blockedSite'),
    scanTime: document.getElementById('scanTime'),
    threatsBlocked: document.getElementById('threatsBlocked'),
    securityScore: document.getElementById('securityScore'),
    uptime: document.getElementById('uptime'),
    motivationalQuote: document.getElementById('motivationalQuote'),
    safeRedirectBtn: document.getElementById('safeRedirectBtn'),
    reportThreatBtn: document.getElementById('reportThreatBtn'),
    closeTabBtn: document.getElementById('closeTabBtn')
  };
  
  // Shield state
  let shieldData = {
    blockedSite: 'unknown.domain',
    startTime: Date.now(),
    threatsBlocked: 0,
    securityScore: 100
  };
  
  // Cyber quotes for motivation
  const cyberQuotes = [
    "The best defense is a good offense in cyberspace.",
    "Security is not a product, but a process.",
    "Trust, but verify - especially in digital realms.",
    "In cyber warfare, vigilance is our greatest weapon.",
    "Every shield strengthens the digital fortress.",
    "Cyber security is everyone's responsibility.",
    "Stay alert, stay secure, stay cyber-aware.",
    "Your digital fortress protects what matters most."
  ];
  
  // Secure redirect sites
  const secureRedirects = [
    'https://duckduckgo.com',
    'https://startpage.com',
    'https://github.com',
    'https://stackoverflow.com',
    'https://mozilla.org',
    'https://protonmail.com',
    'https://signal.org'
  ];
  
  // Initialize fortress shield
  document.addEventListener('DOMContentLoaded', initializeFortress);
  
  function initializeFortress() {
    extractBlockedSite();
    loadShieldData();
    setupEventListeners();
    initializeMatrixBackground();
    startSystemTimers();
    displayRandomQuote();
    
    console.log('✅ Digital Fortress Shield Active');
  }
  
  function extractBlockedSite() {
    // Get blocked site from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const blocked = urlParams.get('blocked');
    
    if (blocked) {
      shieldData.blockedSite = decodeURIComponent(blocked);
      elements.blockedSite.textContent = shieldData.blockedSite;
    }
  }
  
  function loadShieldData() {
    // Load data from extension storage
    chrome.storage.sync.get(['digitalFortress', 'neuralAnalytics'], (data) => {
      if (data.digitalFortress && data.digitalFortress.blockedSites) {
        shieldData.threatsBlocked = Object.keys(data.digitalFortress.blockedSites).length;
      }
      
      if (data.neuralAnalytics) {
        shieldData.securityScore = data.neuralAnalytics.securityScore || 100;
      }
      
      updateShieldDisplay();
    });
  }
  
  function setupEventListeners() {
    // Safe Redirect Button
    elements.safeRedirectBtn.addEventListener('click', performSafeRedirect);
    
    // Report Threat Button
    elements.reportThreatBtn.addEventListener('click', reportThreat);
    
    // Close Tab Button
    elements.closeTabBtn.addEventListener('click', closeCurrentTab);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
  }
  
  function handleKeyboardShortcuts(event) {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'r':
          event.preventDefault();
          performSafeRedirect();
          break;
        case 'w':
          event.preventDefault();
          closeCurrentTab();
          break;
        case 'e':
          event.preventDefault();
          reportThreat();
          break;
      }
    }
    
    // Escape key to close
    if (event.key === 'Escape') {
      closeCurrentTab();
    }
  }
  
  function updateShieldDisplay() {
    elements.threatsBlocked.textContent = shieldData.threatsBlocked;
    elements.securityScore.textContent = shieldData.securityScore;
  }
  
  function performSafeRedirect() {
    showButtonAnimation(elements.safeRedirectBtn);
    
    // Get random secure site
    const randomSite = secureRedirects[Math.floor(Math.random() * secureRedirects.length)];
    
    // Add cyber effect before redirect
    createGlitchEffect(() => {
      window.location.href = randomSite;
    });
  }
  
  function reportThreat() {
    showButtonAnimation(elements.reportThreatBtn);
    
    // Log threat report in neural analytics
    const threatReport = {
      timestamp: Date.now(),
      site: shieldData.blockedSite,
      action: 'THREAT_REPORTED',
      userInitiated: true
    };
    
    chrome.storage.sync.get('neuralAnalytics', (data) => {
      const analytics = data.neuralAnalytics || { sessionData: [] };
      analytics.sessionData = analytics.sessionData || [];
      analytics.sessionData.push(threatReport);
      
      // Keep only last 100 entries
      if (analytics.sessionData.length > 100) {
        analytics.sessionData = analytics.sessionData.slice(-100);
      }
      
      chrome.storage.sync.set({ neuralAnalytics: analytics }, () => {
        showSystemMessage('Threat reported to neural network', 'success');
      });
    });
  }
  
  function closeCurrentTab() {
    showButtonAnimation(elements.closeTabBtn);
    
    createGlitchEffect(() => {
      chrome.tabs.getCurrent((tab) => {
        if (tab) {
          chrome.tabs.remove(tab.id);
        } else {
          window.close();
        }
      });
    });
  }
  
  function showButtonAnimation(button) {
    button.style.transform = 'scale(0.95)';
    button.style.background = 'rgba(255, 255, 255, 0.1)';
    
    setTimeout(() => {
      button.style.transform = '';
      button.style.background = '';
    }, 150);
  }
  
  function createGlitchEffect(callback) {
    const glitchOverlay = document.createElement('div');
    glitchOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 255, 0, 0.1);
      z-index: 9999;
      animation: glitchFlash 0.5s ease-out;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glitchFlash {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(glitchOverlay);
    
    setTimeout(() => {
      glitchOverlay.remove();
      style.remove();
      if (callback) callback();
    }, 500);
  }
  
  function showSystemMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid ${type === 'success' ? '#00ff00' : '#00ffff'};
      color: ${type === 'success' ? '#00ff00' : '#00ffff'};
      padding: 15px 20px;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 10000;
      animation: slideInRight 0.5s ease-out;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    `;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.style.animation = 'slideOutRight 0.5s ease-in';
      setTimeout(() => messageDiv.remove(), 500);
    }, 3000);
  }
  
  function initializeMatrixBackground() {
    const chars = '01ABCDEF';
    const matrixColumns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < matrixColumns; i++) {
      createMatrixColumn(i);
    }
    
    // Add occasional matrix updates
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance
        const randomColumn = Math.floor(Math.random() * matrixColumns);
        createMatrixColumn(randomColumn);
      }
    }, 2000);
  }
  
  function createMatrixColumn(columnIndex) {
    const chars = '01ABCDEF';
    const char = chars[Math.floor(Math.random() * chars.length)];
    
    const matrixChar = document.createElement('div');
    matrixChar.className = 'matrix-char';
    matrixChar.textContent = char;
    matrixChar.style.left = `${columnIndex * 20}px`;
    matrixChar.style.animationDuration = `${Math.random() * 3 + 2}s`;
    matrixChar.style.animationDelay = `${Math.random() * 2}s`;
    
    elements.matrixBg.appendChild(matrixChar);
    
    // Remove after animation completes
    setTimeout(() => {
      if (matrixChar.parentNode) {
        matrixChar.remove();
      }
    }, 5000);
  }
  
  function startSystemTimers() {
    // Update scan time
    setInterval(() => {
      const elapsed = Date.now() - shieldData.startTime;
      elements.scanTime.textContent = formatTime(elapsed);
    }, 1000);
    
    // Update uptime (simulated system uptime)
    const systemStart = Date.now();
    setInterval(() => {
      const uptime = Date.now() - systemStart;
      elements.uptime.textContent = formatTime(uptime);
    }, 1000);
  }
  
  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  function displayRandomQuote() {
    const randomQuote = cyberQuotes[Math.floor(Math.random() * cyberQuotes.length)];
    elements.motivationalQuote.textContent = randomQuote;
    
    // Change quote periodically
    setInterval(() => {
      const newQuote = cyberQuotes[Math.floor(Math.random() * cyberQuotes.length)];
      elements.motivationalQuote.style.opacity = '0.5';
      
      setTimeout(() => {
        elements.motivationalQuote.textContent = newQuote;
        elements.motivationalQuote.style.opacity = '1';
      }, 500);
    }, 30000); // Every 30 seconds
  }
  
  // Add CSS animations
  const additionalStyles = document.createElement('style');
  additionalStyles.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(additionalStyles);
  
  console.log('🚀 Digital Fortress Shield Fully Operational');
  
})();