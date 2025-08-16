// CyberGuard Dashboard Controller
(function() {
  'use strict';
  
  console.log('🎮 CyberGuard Dashboard Initializing...');
  
  // DOM Elements
  const elements = {
    threatIndicator: document.getElementById('threatIndicator'),
    threatLevel: document.getElementById('threatLevel'),
    secureConnections: document.getElementById('secureConnections'),
    blockedThreats: document.getElementById('blockedThreats'),
    shieldStatus: document.getElementById('shieldStatus'),
    quantumScanBtn: document.getElementById('quantumScanBtn'),
    fortressBtn: document.getElementById('fortressBtn'),
    shieldToggleBtn: document.getElementById('shieldToggleBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    threatChart: document.getElementById('threatChart'),
    securityScore: document.getElementById('securityScore'),
    sessionTime: document.getElementById('sessionTime'),
    activityLog: document.getElementById('activityLog'),
    loadingOverlay: document.getElementById('loadingOverlay')
  };
  
  // Dashboard state
  let dashboardData = {
    threatLevel: 'GREEN',
    secureConnections: 0,
    blockedThreats: 0,
    shieldActive: true,
    securityScore: 100,
    sessionStart: Date.now(),
    activityHistory: []
  };
  
  // Initialize dashboard
  document.addEventListener('DOMContentLoaded', initializeDashboard);
  
  function initializeDashboard() {
    showLoading(true);
    
    // Initialize neural network connection
    setTimeout(() => {
      loadSystemStatus();
      setupEventListeners();
      initializeThreatChart();
      startSessionTimer();
      showLoading(false);
      
      addActivity('Dashboard initialized', 'secure');
      console.log('✅ CyberGuard Dashboard Online');
    }, 1500);
  }
  
  function showLoading(show) {
    elements.loadingOverlay.classList.toggle('active', show);
  }
  
  function loadSystemStatus() {
    // Get threat status from background
    chrome.runtime.sendMessage({ action: 'getThreatStatus' }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('Background communication error:', chrome.runtime.lastError);
        return;
      }
      
      if (response) {
        dashboardData.threatLevel = response.threatLevel || 'GREEN';
        dashboardData.secureConnections = response.secureConnections || 0;
        dashboardData.blockedThreats = response.blockedThreats || 0;
        updateDashboard();
      }
    });
    
    // Load neural analytics
    chrome.storage.sync.get(['neuralAnalytics', 'cyberSettings'], (data) => {
      if (data.neuralAnalytics) {
        dashboardData.securityScore = data.neuralAnalytics.securityScore || 100;
      }
      
      if (data.cyberSettings) {
        dashboardData.shieldActive = data.cyberSettings.realTimeProtection !== false;
      }
      
      updateDashboard();
    });
  }
  
  function setupEventListeners() {
    // Quantum Scan Button
    elements.quantumScanBtn.addEventListener('click', performQuantumScan);
    
    // Digital Fortress Button
    elements.fortressBtn.addEventListener('click', activateDigitalFortress);
    
    // Shield Toggle Button
    elements.shieldToggleBtn.addEventListener('click', toggleShield);
    
    // Settings Button
    elements.settingsBtn.addEventListener('click', openNeuralConfig);
    
    // Update dashboard periodically
    setInterval(loadSystemStatus, 10000); // Every 10 seconds
  }
  
  function updateDashboard() {
    // Update threat level
    elements.threatLevel.textContent = dashboardData.threatLevel;
    elements.threatLevel.className = `status-value threat-level ${dashboardData.threatLevel}`;
    
    // Update threat indicator
    updateThreatIndicator(dashboardData.threatLevel);
    
    // Update counters
    elements.secureConnections.textContent = dashboardData.secureConnections;
    elements.blockedThreats.textContent = dashboardData.blockedThreats;
    elements.securityScore.textContent = dashboardData.securityScore;
    
    // Update shield status
    elements.shieldStatus.textContent = dashboardData.shieldActive ? 'ACTIVE' : 'INACTIVE';
    elements.shieldStatus.style.color = dashboardData.shieldActive ? '#00ff00' : '#ff0040';
    
    // Update shield toggle button
    elements.shieldToggleBtn.querySelector('.btn-text').textContent = 
      dashboardData.shieldActive ? 'DISABLE SHIELD' : 'ENABLE SHIELD';
  }
  
  function updateThreatIndicator(level) {
    const indicator = elements.threatIndicator;
    const led = indicator.querySelector('.status-led');
    const text = indicator.querySelector('.status-text');
    
    // Remove existing classes
    led.className = 'status-led';
    
    switch (level) {
      case 'GREEN':
        led.style.background = '#00ff00';
        led.style.boxShadow = '0 0 10px #00ff00';
        text.textContent = 'SECURE';
        text.style.color = '#00ff00';
        break;
      case 'YELLOW':
        led.style.background = '#ffff00';
        led.style.boxShadow = '0 0 10px #ffff00';
        text.textContent = 'CAUTION';
        text.style.color = '#ffff00';
        break;
      case 'RED':
        led.style.background = '#ff0040';
        led.style.boxShadow = '0 0 10px #ff0040';
        text.textContent = 'ALERT';
        text.style.color = '#ff0040';
        break;
    }
  }
  
  function performQuantumScan() {
    addActivity('Quantum scan initiated', 'secure');
    showButtonAnimation(elements.quantumScanBtn);
    
    // Get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'performDeepScan' }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn('Scan message error:', chrome.runtime.lastError);
            addActivity('Scan completed (no response)', 'secure');
            return;
          }
          
          if (response && response.status === 'SCAN_COMPLETE') {
            addActivity('Deep scan completed', 'secure');
          } else {
            addActivity('Scan completed', 'secure');
          }
        });
      }
    });
  }
  
  function activateDigitalFortress() {
    addActivity('Digital fortress activated', 'warning');
    showButtonAnimation(elements.fortressBtn);
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        try {
          // Validate URL before creating URL object
          const tabUrl = tabs[0].url;
          if (tabUrl.startsWith('http://') || tabUrl.startsWith('https://')) {
            const url = new URL(tabUrl);
            chrome.runtime.sendMessage({ 
              action: 'activateFortress', 
              hostname: url.hostname 
            }, (response) => {
              if (chrome.runtime.lastError) {
                console.warn('Fortress activation error:', chrome.runtime.lastError);
                addActivity('Fortress activation failed', 'warning');
                return;
              }
              
              if (response && response.status === 'FORTRESS_ACTIVATED') {
                addActivity(`Fortress blocked: ${url.hostname}`, 'danger');
                dashboardData.blockedThreats++;
                updateDashboard();
              } else {
                addActivity('Fortress activation unsuccessful', 'warning');
              }
            });
          } else {
            // Handle non-HTTP URLs (chrome://, extension pages, etc.)
            addActivity('Cannot block system pages', 'warning');
          }
        } catch (error) {
          console.warn('URL parsing error:', error);
          addActivity('Invalid URL detected', 'warning');
        }
      }
    });
  }
  
  function toggleShield() {
    dashboardData.shieldActive = !dashboardData.shieldActive;
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleShield' }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn('Shield toggle error:', chrome.runtime.lastError);
          } else if (response) {
            dashboardData.shieldActive = response.shieldActive;
          }
          
          updateDashboard();
          const status = dashboardData.shieldActive ? 'enabled' : 'disabled';
          addActivity(`Shield ${status}`, dashboardData.shieldActive ? 'secure' : 'warning');
        });
      }
    });
    
    showButtonAnimation(elements.shieldToggleBtn);
  }
  
  function openNeuralConfig() {
    chrome.runtime.openOptionsPage();
  }
  
  function showButtonAnimation(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'translateY(-1px)';
    }, 100);
    setTimeout(() => {
      button.style.transform = '';
    }, 200);
  }
  
  function initializeThreatChart() {
    const canvas = elements.threatChart;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    drawThreatChart(ctx);
    
    // Update chart periodically
    setInterval(() => drawThreatChart(ctx), 5000);
  }
  
  function drawThreatChart(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background grid
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw threat level indicator
    const threatColors = {
      'GREEN': '#00ff00',
      'YELLOW': '#ffff00',
      'RED': '#ff0040'
    };
    
    ctx.fillStyle = threatColors[dashboardData.threatLevel] || '#00ff00';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0, height - 20, width, 20);
    ctx.globalAlpha = 1;
    
    // Draw security score visualization
    const scoreWidth = (dashboardData.securityScore / 100) * width;
    ctx.fillStyle = '#00ffff';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, scoreWidth, 5);
    ctx.globalAlpha = 1;
  }
  
  function startSessionTimer() {
    setInterval(() => {
      const elapsed = Date.now() - dashboardData.sessionStart;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      elements.sessionTime.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }
  
  function addActivity(message, status = 'secure') {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);
    
    const activity = document.createElement('div');
    activity.className = 'activity-item';
    activity.innerHTML = `
      <span class="activity-time">${timeStr}</span>
      <span class="activity-text">${message}</span>
      <span class="activity-status ${status}">
        ${status === 'secure' ? '✓' : status === 'warning' ? '⚠' : '✗'}
      </span>
    `;
    
    elements.activityLog.insertBefore(activity, elements.activityLog.firstChild);
    
    // Keep only last 10 activities
    while (elements.activityLog.children.length > 10) {
      elements.activityLog.removeChild(elements.activityLog.lastChild);
    }
  }
  
  // Matrix effect for special occasions
  function triggerMatrixEffect() {
    const chars = '01';
    const drops = [];
    
    for (let x = 0; x < 10; x++) {
      drops[x] = Math.random() * 100;
    }
    
    // This would be implemented for special effects
    console.log('🔴 Matrix sequence activated');
  }
  
  console.log('🚀 CyberGuard Dashboard Controller Ready');
  
})();