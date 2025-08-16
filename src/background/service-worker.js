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
      blockAdultContent: true,
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
      neonTheme: 'green',
      blockTrackers: true,
      realTimeProtection: true
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

async function analyzeThreatLevel(url, tabId) {
  try {
    // Validate URL before creating URL object
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return; // Skip non-HTTP URLs
    }
    
    const hostname = new URL(url).hostname.toLowerCase();
    
    // Gather comprehensive site information
    const siteInfo = await gatherSiteInformation(url, hostname);
    console.log('🔍 Site Analysis:', siteInfo);
    
    // Comprehensive threat detection patterns
    const knownThreats = [
      'malware', 'phishing', 'scam', 'fraud', 'virus',
      'trojan', 'ransomware', 'suspicious', 'dangerous'
    ];

    // Adult content domains for auto-blocking
    const adultContentDomains = [
      'pornhub.com', 'xvideos.com', 'xnxx.com', 'redtube.com', 'youporn.com',
      'tube8.com', 'spankbang.com', 'xhamster.com', 'chaturbate.com', 'cam4.com',
      'bongacams.com', 'livejasmin.com', 'stripchat.com', 'camsoda.com',
      'onlyfans.com', 'fansly.com', 'manyvids.com', 'clips4sale.com',
      'adult.com', 'xxx.com', 'sex.com', 'porn.com', 'nude.com'
    ];

    // Major tracking/analytics domains
    const trackingDomains = [
      'google-analytics.com', 'googletagmanager.com', 'doubleclick.net',
      'facebook.com/tr', 'connect.facebook.net', 'analytics.twitter.com',
      'ads.twitter.com', 'amazon-adsystem.com', 'googlesyndication.com',
      'googleadservices.com', 'adsystem.amazon.com', 'quantserve.com',
      'scorecardresearch.com', 'outbrain.com', 'taboola.com', 'criteo.com',
      'adsrvr.org', 'turn.com', 'rlcdn.com', 'addthis.com', 'sharethis.com'
    ];

    const isSecure = url.startsWith('https://');
    const isThreat = knownThreats.some(threat => hostname.includes(threat));
    const isAdultContent = adultContentDomains.some(domain => hostname.includes(domain));
    const isTracker = trackingDomains.some(domain => hostname.includes(domain));
    
    // Check user settings for auto-blocking
    chrome.storage.sync.get(['digitalFortress', 'cyberSettings'], (data) => {
      const fortress = data.digitalFortress || {};
      const settings = data.cyberSettings || {};
      
      if (isThreat) {
        threatLevel = 'RED';
        blockedThreats++;
        activateDigitalFortress(tabId, hostname, 'THREAT_DETECTED');
      } else if (isAdultContent && fortress.blockAdultContent !== false) {
        threatLevel = 'RED';
        blockedThreats++;
        activateDigitalFortress(tabId, hostname, 'ADULT_CONTENT_BLOCKED');
      } else if (isTracker && settings.blockTrackers !== false) {
        // Block major trackers but show warning instead of full block for better UX
        threatLevel = 'YELLOW';
        showQuantumWarning(tabId, 'TRACKER_DETECTED');
        blockedThreats++;
      } else if (!isSecure && hostname !== 'localhost') {
        threatLevel = 'YELLOW';
        showQuantumWarning(tabId, 'INSECURE_CONNECTION');
      } else {
        secureConnections++;
        if (threatLevel === 'YELLOW' && secureConnections > 3) {
          threatLevel = 'GREEN';
        }
      }
    });
    
    // Update neural analytics with comprehensive data
    updateNeuralAnalytics({
      timestamp: Date.now(),
      url: hostname,
      fullUrl: url,
      secure: isSecure,
      threatDetected: isThreat,
      adultContent: isAdultContent,
      tracker: isTracker,
      threatLevel: threatLevel,
      siteInfo: siteInfo
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
      // Redirect to cyber shield page with reason
      chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL('src/pages/fortress-shield.html') + 
            '?blocked=' + encodeURIComponent(hostname) + 
            '&reason=' + encodeURIComponent(reason)
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
  
  let warningText = '';
  let warningColor = '#ffff00';
  
  switch (warningType) {
    case 'TRACKER_DETECTED':
      warningText = '🕵️ TRACKING SCRIPTS DETECTED - PRIVACY AT RISK';
      warningColor = '#ff0040';
      break;
    case 'INSECURE_CONNECTION':
      warningText = '⚠️ QUANTUM ENCRYPTION NOT DETECTED - CONNECTION MAY BE VULNERABLE';
      warningColor = '#ffff00';
      break;
    default:
      warningText = '⚠️ SECURITY ALERT - POTENTIAL THREAT DETECTED';
      warningColor = '#ff0040';
  }
  
  warning.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(90deg, ${warningColor}, #000); 
                color: #00ff00; padding: 10px; text-align: center; z-index: 999999; 
                font-family: 'Courier New', monospace; font-size: 14px; animation: cyberPulse 2s infinite;">
      ${warningText}
    </div>
    <style>
      @keyframes cyberPulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
    </style>
  `;
  
  document.body.appendChild(warning);
  
  // Auto-remove after 7 seconds
  setTimeout(() => {
    const elem = document.getElementById('cyber-warning');
    if (elem) elem.remove();
  }, 7000);
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
  
  // Clean up old blocked sites with enhanced error handling
  chrome.storage.sync.get('digitalFortress', (data) => {
    if (chrome.runtime.lastError) {
      console.error('Neural scan storage error:', chrome.runtime.lastError.message || 'Unknown error');
      return;
    }
    
    try {
      const fortress = data.digitalFortress || {};
      const blockedSites = fortress.blockedSites || {};
      const currentTime = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      let cleaned = false;
      for (const [hostname, blockData] of Object.entries(blockedSites)) {
        if (blockData && blockData.timestamp && currentTime - blockData.timestamp > oneDay) {
          delete blockedSites[hostname];
          cleaned = true;
        }
      }
      
      if (cleaned) {
        fortress.blockedSites = blockedSites;
        chrome.storage.sync.set({ digitalFortress: fortress }, () => {
          if (!chrome.runtime.lastError) {
            console.log('🧹 Neural Network Cleanup Complete');
          }
        });
      }
    } catch (error) {
      console.error('Neural scan processing error:', error);
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
  } else if (request.action === 'adultContentDetected') {
    // Handle adult content detection from content scripts
    if (sender.tab && sender.tab.id) {
      activateDigitalFortress(sender.tab.id, request.hostname, 'ADULT_CONTENT_BLOCKED');
      sendResponse({ status: 'CONTENT_BLOCKED' });
    }
    return true;
  } else if (request.action === 'performQuantumScan') {
    // Enhanced quantum scan with full site analysis
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      if (tabs[0] && tabs[0].url) {
        const url = tabs[0].url;
        const hostname = new URL(url).hostname.toLowerCase();
        
        console.log('🔬 Performing Enhanced Quantum Scan on:', hostname);
        
        const siteInfo = await gatherSiteInformation(url, hostname);
        const scanResult = {
          status: 'SCAN_COMPLETE',
          timestamp: Date.now(),
          scanId: `scan_${Date.now()}`,
          url: hostname,
          fullUrl: url,
          siteInfo: siteInfo,
          threatAnalysis: {
            threatLevel: threatLevel,
            secureConnections: secureConnections,
            blockedThreats: blockedThreats
          }
        };
        
        // Store scan result
        chrome.storage.local.set({
          [`quantumScan_${Date.now()}`]: scanResult,
          lastQuantumScan: scanResult
        });
        
        sendResponse(scanResult);
      } else {
        sendResponse({ status: 'ERROR', message: 'No active tab found' });
      }
    });
    return true;
  } else if (request.action === 'getLastScanResult') {
    // Get the most recent scan result
    chrome.storage.local.get('lastQuantumScan', (data) => {
      sendResponse(data.lastQuantumScan || { status: 'NO_SCAN_DATA' });
    });
    return true;
  }
  
  // Always send a response to prevent port closure errors
  sendResponse({ status: 'UNKNOWN_ACTION' });
  return true;
});

// Enhanced Site Information Gathering System
async function gatherSiteInformation(url, hostname) {
  try {
    const siteInfo = {
      domain: hostname,
      fullUrl: url,
      protocol: new URL(url).protocol,
      port: new URL(url).port || (url.startsWith('https:') ? '443' : '80'),
      timestamp: Date.now(),
      scanDate: new Date().toISOString(),
      geolocation: null,
      serverInfo: null,
      technicalData: null,
      securityInfo: null
    };

    // Get geolocation data from IP lookup service
    try {
      const geoData = await fetchGeolocation(hostname);
      if (geoData) {
        siteInfo.geolocation = {
          ip: geoData.ip || 'Unknown',
          latitude: geoData.lat || 'Unknown',
          longitude: geoData.lon || 'Unknown', 
          city: geoData.city || 'Unknown',
          region: geoData.region || 'Unknown',
          country: geoData.country || 'Unknown',
          countryCode: geoData.countryCode || 'Unknown',
          timezone: geoData.timezone || 'Unknown',
          isp: geoData.isp || 'Unknown',
          org: geoData.org || 'Unknown'
        };
      }
    } catch (error) {
      console.warn('Geolocation lookup failed:', error);
      siteInfo.geolocation = {
        ip: 'Lookup Failed',
        latitude: 'Unknown', 
        longitude: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        countryCode: 'Unknown',
        timezone: 'Unknown',
        isp: 'Unknown',
        org: 'Unknown'
      };
    }

    // Gather technical information
    siteInfo.technicalData = {
      isSecure: url.startsWith('https://'),
      hasWWW: hostname.startsWith('www.'),
      domainLength: hostname.length,
      subdomain: hostname.split('.').length > 2 ? hostname.split('.')[0] : null,
      topLevelDomain: hostname.split('.').pop(),
      userAgent: navigator.userAgent,
      browserLanguage: navigator.language,
      platform: navigator.platform
    };

    // Security analysis
    siteInfo.securityInfo = {
      httpsEnabled: url.startsWith('https://'),
      suspiciousDomain: checkSuspiciousDomain(hostname),
      domainAge: estimateDomainAge(hostname),
      trustScore: calculateTrustScore(hostname, siteInfo)
    };

    return siteInfo;

  } catch (error) {
    console.warn('Error gathering site information:', error);
    return {
      domain: hostname,
      fullUrl: url,
      error: error.message,
      timestamp: Date.now()
    };
  }
}

// Geolocation lookup using free IP API service
async function fetchGeolocation(hostname) {
  try {
    // Use ip-api.com for geolocation (free service, no API key needed)
    const response = await fetch(`http://ip-api.com/json/${hostname}?fields=status,message,country,countryCode,region,city,lat,lon,timezone,isp,org,query`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        ip: data.query,
        lat: data.lat,
        lon: data.lon,
        city: data.city,
        region: data.region, 
        country: data.country,
        countryCode: data.countryCode,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org
      };
    }
    return null;
  } catch (error) {
    console.warn('Geolocation fetch error:', error);
    return null;
  }
}

// Check for suspicious domain patterns
function checkSuspiciousDomain(hostname) {
  const suspiciousPatterns = [
    /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP addresses
    /[0-9]{4,}/, // Long number sequences
    /-{2,}/, // Multiple dashes
    /\.(tk|ml|ga|cf)$/, // Suspicious TLDs
    /[a-z]{20,}/, // Very long strings
    /[0-9][a-z]{2}[0-9]/ // Mixed patterns
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(hostname));
}

// Estimate domain age (simplified)
function estimateDomainAge(hostname) {
  const commonDomains = {
    'google.com': '1997',
    'facebook.com': '2004', 
    'youtube.com': '2005',
    'amazon.com': '1994',
    'wikipedia.org': '2001',
    'twitter.com': '2006',
    'instagram.com': '2010',
    'linkedin.com': '2003',
    'github.com': '2008',
    'stackoverflow.com': '2008'
  };
  
  return commonDomains[hostname] || 'Unknown';
}

// Calculate trust score based on various factors
function calculateTrustScore(hostname, siteInfo) {
  let score = 50; // Base score
  
  // HTTPS bonus
  if (siteInfo.technicalData.isSecure) score += 20;
  
  // Known domains bonus
  const trustedDomains = ['google.com', 'youtube.com', 'facebook.com', 'amazon.com', 'wikipedia.org'];
  if (trustedDomains.some(domain => hostname.includes(domain))) score += 30;
  
  // Suspicious domain penalty
  if (siteInfo.securityInfo.suspiciousDomain) score -= 30;
  
  // IP address penalty
  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)) score -= 25;
  
  return Math.max(0, Math.min(100, score));
}

console.log('🚀 CyberGuard Neural Network Fully Operational');