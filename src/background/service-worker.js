// CyberGuard Service Worker - Neural Network Command Center
console.log('🔴 CyberGuard Neural Network ONLINE');

// Initialize cyber defense systems
chrome.runtime.onInstalled.addListener(() => {
  console.log('🛡️ Digital Fortress Systems Activated');
  initializeCyberDefense();
});

// Cyber threat monitoring system
let threatLevel = 'GREEN';
let secureConnections = 0;
let blockedThreats = 0;

function initializeCyberDefense() {
  // Initialize secure storage with encryption-themed defaults
  const defaultConfig = {
    threatLevel: 'GREEN',
    digitalFortress: {
      enabled: true,
      blockedSites: {},
      quarantinedUrls: []
    },
    neuralAnalytics: {
      sessionData: [],
      threatPatterns: [],
      securityScore: 100
    },
    cyberSettings: {
      matrixMode: true,
      glitchEffects: true,
      terminalNotifications: true,
      quantumEncryption: true,
      neonTheme: 'green'
    }
  };

  chrome.storage.sync.get(defaultConfig, (data) => {
    if (chrome.runtime.lastError) {
      console.error('❌ Neural Network Storage Error:', chrome.runtime.lastError.message || 'Unknown error');
      return;
    }
    
    // Update storage with any missing default values
    chrome.storage.sync.set(defaultConfig, () => {
      if (!chrome.runtime.lastError) {
        console.log('✅ Cyber Defense Systems Initialized');
        startThreatMonitoring();
      }
    });
  });
}

function startThreatMonitoring() {
  // Monitor web navigation for threats
  chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId === 0) { // Main frame only
      analyzeThreatLevel(details.url, details.tabId);
    }
  });

  // Set up periodic system scans
  chrome.alarms.create('neuralScan', { periodInMinutes: 5 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'neuralScan') {
      performNeuralScan();
    }
  });
}

function analyzeThreatLevel(url, tabId) {
  try {
    // Validate URL before creating URL object
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return; // Skip non-HTTP URLs
    }
    
    const hostname = new URL(url).hostname.toLowerCase();
    
    // Cyber threat detection patterns
    const knownThreats = [
      'malware', 'phishing', 'scam', 'fraud', 'virus',
      'trojan', 'ransomware', 'suspicious', 'dangerous'
    ];
    
    const isSecure = url.startsWith('https://');
    const isThreat = knownThreats.some(threat => hostname.includes(threat));
    
    if (isThreat) {
      threatLevel = 'RED';
      blockedThreats++;
      activateDigitalFortress(tabId, hostname, 'THREAT_DETECTED');
    } else if (!isSecure && hostname !== 'localhost') {
      threatLevel = 'YELLOW';
      showQuantumWarning(tabId, 'INSECURE_CONNECTION');
    } else {
      secureConnections++;
      if (threatLevel === 'YELLOW' && secureConnections > 3) {
        threatLevel = 'GREEN';
      }
    }
    
    // Update neural analytics
    updateNeuralAnalytics({
      timestamp: Date.now(),
      url: hostname,
      secure: isSecure,
      threatDetected: isThreat,
      threatLevel: threatLevel
    });
    
  } catch (error) {
    console.warn('⚠️ URL Analysis Error:', error);
  }
}

function activateDigitalFortress(tabId, hostname, reason) {
  console.log(`🔴 DIGITAL FORTRESS ACTIVATED: ${hostname} - ${reason}`);
  
  // Store blocked threat
  chrome.storage.sync.get('digitalFortress', (data) => {
    const fortress = data.digitalFortress || {};
    fortress.blockedSites = fortress.blockedSites || {};
    fortress.blockedSites[hostname] = {
      timestamp: Date.now(),
      reason: reason,
      threatLevel: 'HIGH'
    };
    
    chrome.storage.sync.set({ digitalFortress: fortress }, () => {
      // Redirect to cyber shield page
      chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL('src/pages/fortress-shield.html') + '?blocked=' + encodeURIComponent(hostname)
      });
      
      // Send matrix notification
      sendMatrixNotification('THREAT NEUTRALIZED', `Digital fortress blocked: ${hostname}`);
    });
  });
}

function showQuantumWarning(tabId, warning) {
  // Inject warning overlay for insecure connections
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: showCyberWarning,
    args: [warning]
  }).catch(err => {
    console.log('Warning injection failed:', err);
  });
}

function showCyberWarning(warningType) {
  // This function runs in the page context
  if (document.getElementById('cyber-warning')) return;
  
  const warning = document.createElement('div');
  warning.id = 'cyber-warning';
  warning.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(90deg, #ff0040, #000); 
                color: #00ff00; padding: 10px; text-align: center; z-index: 999999; 
                font-family: 'Courier New', monospace; font-size: 14px; animation: cyberPulse 2s infinite;">
      ⚠️ QUANTUM ENCRYPTION NOT DETECTED - CONNECTION MAY BE VULNERABLE ⚠️
    </div>
    <style>
      @keyframes cyberPulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
    </style>
  `;
  
  document.body.appendChild(warning);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    const elem = document.getElementById('cyber-warning');
    if (elem) elem.remove();
  }, 5000);
}

function sendMatrixNotification(title, message) {
  chrome.storage.sync.get('cyberSettings', (data) => {
    const settings = data.cyberSettings || {};
    if (settings.terminalNotifications) {
      chrome.notifications.create({
        type: 'basic',
        title: `🔴 ${title}`,
        message: `>>> ${message}`,
        priority: 2
      }).catch(err => {
        console.log('Matrix notification failed:', err);
      });
    }
  });
}

function updateNeuralAnalytics(dataPoint) {
  chrome.storage.sync.get('neuralAnalytics', (data) => {
    const analytics = data.neuralAnalytics || { sessionData: [], threatPatterns: [], securityScore: 100 };
    
    // Add new data point
    analytics.sessionData.push(dataPoint);
    
    // Keep only last 100 entries
    if (analytics.sessionData.length > 100) {
      analytics.sessionData = analytics.sessionData.slice(-100);
    }
    
    // Update security score
    if (dataPoint.threatDetected) {
      analytics.securityScore = Math.max(0, analytics.securityScore - 5);
    } else if (dataPoint.secure) {
      analytics.securityScore = Math.min(100, analytics.securityScore + 1);
    }
    
    chrome.storage.sync.set({ neuralAnalytics: analytics });
  });
}

function performNeuralScan() {
  console.log('🔍 Performing Neural Network Scan...');
  
  // Clean up old blocked sites
  chrome.storage.sync.get('digitalFortress', (data) => {
    const fortress = data.digitalFortress || {};
    const blockedSites = fortress.blockedSites || {};
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    let cleaned = false;
    for (const [hostname, blockData] of Object.entries(blockedSites)) {
      if (currentTime - blockData.timestamp > oneDay) {
        delete blockedSites[hostname];
        cleaned = true;
      }
    }
    
    if (cleaned) {
      fortress.blockedSites = blockedSites;
      chrome.storage.sync.set({ digitalFortress: fortress });
      console.log('🧹 Neural Network Cleanup Complete');
    }
  });
}

// Handle extension messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getThreatStatus') {
    sendResponse({
      threatLevel: threatLevel,
      secureConnections: secureConnections,
      blockedThreats: blockedThreats
    });
    return true;
  } else if (request.action === 'activateFortress') {
    // Check if sender has a valid tab
    if (sender.tab && sender.tab.id) {
      activateDigitalFortress(sender.tab.id, request.hostname, 'USER_ACTIVATED');
      sendResponse({ status: 'FORTRESS_ACTIVATED' });
    } else {
      sendResponse({ status: 'ERROR', message: 'No valid tab found' });
    }
    return true;
  }
  
  // Always send a response to prevent port closure errors
  sendResponse({ status: 'UNKNOWN_ACTION' });
  return true;
});

console.log('🚀 CyberGuard Neural Network Fully Operational');