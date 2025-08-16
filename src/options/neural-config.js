// CyberGuard Neural Configuration Controller
(function() {
  'use strict';
  
  console.log('🧠 Neural Configuration Interface Initializing...');
  
  // DOM Elements
  const elements = {
    // Navigation
    navTabs: document.querySelectorAll('.nav-tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Fortress settings
    fortressEnabled: document.getElementById('fortressEnabled'),
    blockingIntensity: document.getElementById('blockingIntensity'),
    newBlockedSite: document.getElementById('newBlockedSite'),
    addBlockedSite: document.getElementById('addBlockedSite'),
    blockedSitesList: document.getElementById('blockedSitesList'),
    newWhitelistSite: document.getElementById('newWhitelistSite'),
    addWhitelistSite: document.getElementById('addWhitelistSite'),
    whitelistSitesList: document.getElementById('whitelistSitesList'),
    
    // Shield settings
    realTimeProtection: document.getElementById('realTimeProtection'),
    quantumEncryption: document.getElementById('quantumEncryption'),
    threatQuarantine: document.getElementById('threatQuarantine'),
    threatSensitivity: document.getElementById('threatSensitivity'),
    
    // Analytics settings
    analyticsEnabled: document.getElementById('analyticsEnabled'),
    behaviorAnalysis: document.getElementById('behaviorAnalysis'),
    currentSecurityScore: document.getElementById('currentSecurityScore'),
    totalThreatsDetected: document.getElementById('totalThreatsDetected'),
    safeSessions: document.getElementById('safeSessions'),
    exportAnalytics: document.getElementById('exportAnalytics'),
    clearAnalytics: document.getElementById('clearAnalytics'),
    
    // Interface settings
    colorScheme: document.getElementById('colorScheme'),
    matrixEffects: document.getElementById('matrixEffects'),
    glitchEffects: document.getElementById('glitchEffects'),
    threatNotifications: document.getElementById('threatNotifications'),
    systemNotifications: document.getElementById('systemNotifications'),
    
    // Footer actions
    saveAllSettings: document.getElementById('saveAllSettings'),
    resetToDefaults: document.getElementById('resetToDefaults'),
    exportConfig: document.getElementById('exportConfig'),
    
    // Status
    configStatus: document.getElementById('configStatus'),
    messageContainer: document.getElementById('messageContainer')
  };
  
  // Configuration state
  let currentConfig = {
    digitalFortress: {
      enabled: true,
      blockingIntensity: 'medium',
      blockedSites: {},
      whitelist: []
    },
    cyberShield: {
      realTimeProtection: true,
      quantumEncryption: true,
      threatQuarantine: true,
      threatSensitivity: 3
    },
    neuralAnalytics: {
      enabled: true,
      behaviorAnalysis: true,
      sessionData: [],
      securityScore: 100
    },
    interface: {
      colorScheme: 'matrix',
      matrixEffects: true,
      glitchEffects: true,
      threatNotifications: true,
      systemNotifications: true
    }
  };
  
  // Initialize the interface
  document.addEventListener('DOMContentLoaded', initializeNeuralConfig);
  
  function initializeNeuralConfig() {
    setupNavigation();
    loadCurrentConfiguration();
    setupEventListeners();
    updateAnalyticsDisplay();
    
    showMessage('Neural configuration interface online', 'success');
    console.log('✅ Neural Configuration Ready');
  }
  
  function setupNavigation() {
    elements.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        switchTab(tabId);
      });
    });
  }
  
  function switchTab(tabId) {
    // Update nav tabs
    elements.navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    // Update tab contents
    elements.tabContents.forEach(content => {
      content.classList.toggle('active', content.id === `${tabId}-tab`);
    });
    
    // Special handling for specific tabs
    if (tabId === 'analytics') {
      updateAnalyticsDisplay();
    }
  }
  
  function loadCurrentConfiguration() {
    chrome.storage.sync.get(['digitalFortress', 'cyberSettings', 'neuralAnalytics'], (data) => {
      if (chrome.runtime.lastError) {
        console.error('Error loading configuration:', chrome.runtime.lastError.message || 'Unknown error');
        showMessage('Error loading configuration', 'error');
        return;
      }
      
      // Load digital fortress settings
      if (data.digitalFortress) {
        currentConfig.digitalFortress = { ...currentConfig.digitalFortress, ...data.digitalFortress };
      }
      
      // Load cyber settings
      if (data.cyberSettings) {
        currentConfig.cyberShield = { ...currentConfig.cyberShield, ...data.cyberSettings };
        currentConfig.interface = { ...currentConfig.interface, ...data.cyberSettings };
      }
      
      // Load analytics
      if (data.neuralAnalytics) {
        currentConfig.neuralAnalytics = { ...currentConfig.neuralAnalytics, ...data.neuralAnalytics };
      }
      
      updateInterface();
      updateBlockedSitesList();
      updateWhitelistSitesList();
    });
  }
  
  function updateInterface() {
    // Fortress settings
    if (elements.fortressEnabled) elements.fortressEnabled.checked = currentConfig.digitalFortress.enabled;
    if (elements.blockingIntensity) elements.blockingIntensity.value = currentConfig.digitalFortress.blockingIntensity;
    
    // Shield settings
    if (elements.realTimeProtection) elements.realTimeProtection.checked = currentConfig.cyberShield.realTimeProtection;
    if (elements.quantumEncryption) elements.quantumEncryption.checked = currentConfig.cyberShield.quantumEncryption;
    if (elements.threatQuarantine) elements.threatQuarantine.checked = currentConfig.cyberShield.threatQuarantine;
    if (elements.threatSensitivity) elements.threatSensitivity.value = currentConfig.cyberShield.threatSensitivity;
    
    // Analytics settings
    if (elements.analyticsEnabled) elements.analyticsEnabled.checked = currentConfig.neuralAnalytics.enabled;
    if (elements.behaviorAnalysis) elements.behaviorAnalysis.checked = currentConfig.neuralAnalytics.behaviorAnalysis;
    
    // Interface settings
    if (elements.colorScheme) elements.colorScheme.value = currentConfig.interface.colorScheme;
    if (elements.matrixEffects) elements.matrixEffects.checked = currentConfig.interface.matrixEffects;
    if (elements.glitchEffects) elements.glitchEffects.checked = currentConfig.interface.glitchEffects;
    if (elements.threatNotifications) elements.threatNotifications.checked = currentConfig.interface.threatNotifications;
    if (elements.systemNotifications) elements.systemNotifications.checked = currentConfig.interface.systemNotifications;
  }
  
  function setupEventListeners() {
    // Blocked sites management
    if (elements.addBlockedSite) {
      elements.addBlockedSite.addEventListener('click', addBlockedSite);
    }
    if (elements.newBlockedSite) {
      elements.newBlockedSite.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addBlockedSite();
      });
    }
    
    // Whitelist management
    if (elements.addWhitelistSite) {
      elements.addWhitelistSite.addEventListener('click', addWhitelistSite);
    }
    if (elements.newWhitelistSite) {
      elements.newWhitelistSite.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addWhitelistSite();
      });
    }
    
    // Analytics actions
    if (elements.exportAnalytics) {
      elements.exportAnalytics.addEventListener('click', exportAnalyticsData);
    }
    if (elements.clearAnalytics) {
      elements.clearAnalytics.addEventListener('click', clearAnalyticsData);
    }
    
    // Footer actions
    if (elements.saveAllSettings) {
      elements.saveAllSettings.addEventListener('click', saveAllConfiguration);
    }
    if (elements.resetToDefaults) {
      elements.resetToDefaults.addEventListener('click', resetToDefaults);
    }
    if (elements.exportConfig) {
      elements.exportConfig.addEventListener('click', exportConfiguration);
    }
  }
  
  function addBlockedSite() {
    const siteInput = elements.newBlockedSite;
    if (!siteInput) return;
    
    const site = siteInput.value.trim().toLowerCase();
    if (!site) {
      showMessage('Please enter a valid domain', 'warning');
      return;
    }
    
    // Validate domain format
    if (!isValidDomain(site)) {
      showMessage('Please enter a valid domain format', 'error');
      return;
    }
    
    // Add to blocked sites
    currentConfig.digitalFortress.blockedSites[site] = {
      timestamp: Date.now(),
      reason: 'USER_BLOCKED',
      threatLevel: 'MANUAL'
    };
    
    siteInput.value = '';
    updateBlockedSitesList();
    showMessage(`Added ${site} to blocked sites`, 'success');
  }
  
  function addWhitelistSite() {
    const siteInput = elements.newWhitelistSite;
    if (!siteInput) return;
    
    const site = siteInput.value.trim().toLowerCase();
    if (!site) {
      showMessage('Please enter a valid domain', 'warning');
      return;
    }
    
    if (!isValidDomain(site)) {
      showMessage('Please enter a valid domain format', 'error');
      return;
    }
    
    if (!currentConfig.digitalFortress.whitelist.includes(site)) {
      currentConfig.digitalFortress.whitelist.push(site);
      siteInput.value = '';
      updateWhitelistSitesList();
      showMessage(`Added ${site} to whitelist`, 'success');
    } else {
      showMessage('Site already whitelisted', 'warning');
    }
  }
  
  function updateBlockedSitesList() {
    const list = elements.blockedSitesList;
    if (!list) return;
    
    list.innerHTML = '';
    
    const blockedSites = currentConfig.digitalFortress.blockedSites || {};
    
    if (Object.keys(blockedSites).length === 0) {
      list.innerHTML = '<div class="site-item" style="color: #666; font-style: italic;">No blocked sites</div>';
      return;
    }
    
    Object.entries(blockedSites).forEach(([site, data]) => {
      const siteItem = document.createElement('div');
      siteItem.className = 'site-item';
      
      const siteName = document.createElement('span');
      siteName.className = 'site-name';
      siteName.textContent = site;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-site';
      removeBtn.textContent = 'REMOVE';
      removeBtn.onclick = () => removeBlockedSite(site);
      
      siteItem.appendChild(siteName);
      siteItem.appendChild(removeBtn);
      list.appendChild(siteItem);
    });
  }
  
  function updateWhitelistSitesList() {
    const list = elements.whitelistSitesList;
    if (!list) return;
    
    list.innerHTML = '';
    
    const whitelist = currentConfig.digitalFortress.whitelist || [];
    
    if (whitelist.length === 0) {
      list.innerHTML = '<div class="site-item" style="color: #666; font-style: italic;">No whitelisted sites</div>';
      return;
    }
    
    whitelist.forEach(site => {
      const siteItem = document.createElement('div');
      siteItem.className = 'site-item';
      
      const siteName = document.createElement('span');
      siteName.className = 'site-name';
      siteName.textContent = site;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-site';
      removeBtn.textContent = 'REMOVE';
      removeBtn.onclick = () => removeWhitelistSite(site);
      
      siteItem.appendChild(siteName);
      siteItem.appendChild(removeBtn);
      list.appendChild(siteItem);
    });
  }
  
  function removeBlockedSite(site) {
    delete currentConfig.digitalFortress.blockedSites[site];
    updateBlockedSitesList();
    showMessage(`Removed ${site} from blocked sites`, 'info');
  }
  
  function removeWhitelistSite(site) {
    const index = currentConfig.digitalFortress.whitelist.indexOf(site);
    if (index > -1) {
      currentConfig.digitalFortress.whitelist.splice(index, 1);
      updateWhitelistSitesList();
      showMessage(`Removed ${site} from whitelist`, 'info');
    }
  }
  
  function updateAnalyticsDisplay() {
    if (elements.currentSecurityScore) {
      elements.currentSecurityScore.textContent = currentConfig.neuralAnalytics.securityScore || 100;
    }
    
    if (elements.totalThreatsDetected) {
      const sessionData = currentConfig.neuralAnalytics.sessionData || [];
      const threatsDetected = sessionData.filter(item => item.threatDetected).length;
      elements.totalThreatsDetected.textContent = threatsDetected;
    }
    
    if (elements.safeSessions) {
      const sessionData = currentConfig.neuralAnalytics.sessionData || [];
      const safeSessions = sessionData.filter(item => item.secure && !item.threatDetected).length;
      elements.safeSessions.textContent = safeSessions;
    }
  }
  
  function exportAnalyticsData() {
    const analyticsData = {
      securityScore: currentConfig.neuralAnalytics.securityScore,
      sessionData: currentConfig.neuralAnalytics.sessionData,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberguard-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('Analytics data exported successfully', 'success');
  }
  
  function clearAnalyticsData() {
    if (confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      currentConfig.neuralAnalytics.sessionData = [];
      currentConfig.neuralAnalytics.securityScore = 100;
      updateAnalyticsDisplay();
      showMessage('Analytics data cleared', 'warning');
    }
  }
  
  function saveAllConfiguration() {
    elements.configStatus.textContent = 'SYNCING...';
    
    // Collect all settings from interface
    collectCurrentSettings();
    
    const saveData = {
      digitalFortress: currentConfig.digitalFortress,
      cyberSettings: {
        ...currentConfig.cyberShield,
        ...currentConfig.interface
      },
      neuralAnalytics: currentConfig.neuralAnalytics
    };
    
    chrome.storage.sync.set(saveData, () => {
      if (chrome.runtime.lastError) {
        console.error('Save error:', chrome.runtime.lastError.message || 'Unknown error');
        showMessage('Error saving configuration', 'error');
        elements.configStatus.textContent = 'ERROR';
      } else {
        showMessage('Neural configuration saved successfully', 'success');
        elements.configStatus.textContent = 'SAVED';
        
        setTimeout(() => {
          elements.configStatus.textContent = 'READY';
        }, 2000);
      }
    });
  }
  
  function collectCurrentSettings() {
    // Fortress settings
    if (elements.fortressEnabled) currentConfig.digitalFortress.enabled = elements.fortressEnabled.checked;
    if (elements.blockingIntensity) currentConfig.digitalFortress.blockingIntensity = elements.blockingIntensity.value;
    
    // Shield settings
    if (elements.realTimeProtection) currentConfig.cyberShield.realTimeProtection = elements.realTimeProtection.checked;
    if (elements.quantumEncryption) currentConfig.cyberShield.quantumEncryption = elements.quantumEncryption.checked;
    if (elements.threatQuarantine) currentConfig.cyberShield.threatQuarantine = elements.threatQuarantine.checked;
    if (elements.threatSensitivity) currentConfig.cyberShield.threatSensitivity = parseInt(elements.threatSensitivity.value);
    
    // Analytics settings
    if (elements.analyticsEnabled) currentConfig.neuralAnalytics.enabled = elements.analyticsEnabled.checked;
    if (elements.behaviorAnalysis) currentConfig.neuralAnalytics.behaviorAnalysis = elements.behaviorAnalysis.checked;
    
    // Interface settings
    if (elements.colorScheme) currentConfig.interface.colorScheme = elements.colorScheme.value;
    if (elements.matrixEffects) currentConfig.interface.matrixEffects = elements.matrixEffects.checked;
    if (elements.glitchEffects) currentConfig.interface.glitchEffects = elements.glitchEffects.checked;
    if (elements.threatNotifications) currentConfig.interface.threatNotifications = elements.threatNotifications.checked;
    if (elements.systemNotifications) currentConfig.interface.systemNotifications = elements.systemNotifications.checked;
  }
  
  function resetToDefaults() {
    if (confirm('Reset all settings to default values? This will overwrite your current configuration.')) {
      currentConfig = {
        digitalFortress: {
          enabled: true,
          blockingIntensity: 'medium',
          blockedSites: {},
          whitelist: []
        },
        cyberShield: {
          realTimeProtection: true,
          quantumEncryption: true,
          threatQuarantine: true,
          threatSensitivity: 3
        },
        neuralAnalytics: {
          enabled: true,
          behaviorAnalysis: true,
          sessionData: [],
          securityScore: 100
        },
        interface: {
          colorScheme: 'matrix',
          matrixEffects: true,
          glitchEffects: true,
          threatNotifications: true,
          systemNotifications: true
        }
      };
      
      updateInterface();
      updateBlockedSitesList();
      updateWhitelistSitesList();
      updateAnalyticsDisplay();
      showMessage('Configuration reset to defaults', 'info');
    }
  }
  
  function exportConfiguration() {
    const configData = {
      ...currentConfig,
      exportDate: new Date().toISOString(),
      version: '1.0',
      type: 'CyberGuard Configuration Export'
    };
    
    const dataStr = JSON.stringify(configData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberguard-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('Configuration exported successfully', 'success');
  }
  
  function isValidDomain(domain) {
    const domainRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$|^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }
  
  function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `config-message ${type}`;
    messageDiv.textContent = message;
    
    elements.messageContainer.appendChild(messageDiv);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      messageDiv.style.animation = 'slideOutRight 0.5s ease-in';
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 500);
    }, 4000);
  }
  
  console.log('🚀 Neural Configuration System Online');
  
})();