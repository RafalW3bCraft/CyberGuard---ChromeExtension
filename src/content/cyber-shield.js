// CyberGuard Content Shield - Real-time Protection Layer
(function() {
  'use strict';
  
  // Prevent multiple injections
  if (window.cyberGuardActive) return;
  window.cyberGuardActive = true;
  
  console.log('🛡️ CyberGuard Shield Activated');
  
  let shieldConfig = {
    matrixMode: true,
    quantumScan: true,
    realTimeProtection: true
  };
  
  // Initialize shield systems
  initializeCyberShield();
  
  function initializeCyberShield() {
    // Load shield configuration
    chrome.storage.sync.get('cyberSettings', (data) => {
      if (data.cyberSettings) {
        shieldConfig = { ...shieldConfig, ...data.cyberSettings };
      }
      
      if (shieldConfig.realTimeProtection) {
        startRealTimeScanning();
      }
      
      if (shieldConfig.matrixMode) {
        initializeMatrixEffects();
      }
    });
  }
  
  function startRealTimeScanning() {
    try {
      // Scan for suspicious elements
      const observer = new MutationObserver((mutations) => {
        try {
          mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
              scanForThreats(mutation.addedNodes);
            }
          });
        } catch (error) {
          console.warn('CyberGuard mutation observer error:', error);
        }
      });
      
      // Only observe if document.body exists
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      } else {
        // Wait for body to be available
        document.addEventListener('DOMContentLoaded', () => {
          if (document.body) {
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
          }
        });
      }
      
      // Initial page scan
      setTimeout(() => {
        performQuantumScan();
      }, 1000);
    } catch (error) {
      console.warn('CyberGuard scanning initialization error:', error);
    }
  }
  
  function scanForThreats(nodes) {
    nodes.forEach(node => {
      if (node && node.nodeType === Node.ELEMENT_NODE) {
        try {
          // Check for suspicious patterns
          const suspiciousPatterns = [
            /download.*exe/i,
            /click.*here.*now/i,
            /urgent.*action.*required/i,
            /congratulations.*winner/i,
            /free.*money/i
          ];
          
          const textContent = node.textContent || '';
          // Handle className safely - it could be a string, DOMTokenList, or undefined
          let className = '';
          if (node.className) {
            if (typeof node.className === 'string') {
              className = node.className.toLowerCase();
            } else if (node.className.toString) {
              // For DOMTokenList or other objects with toString method
              className = node.className.toString().toLowerCase();
            }
          }
          
          // Check text content and class names for threats
          const isSuspicious = suspiciousPatterns.some(pattern => 
            pattern.test(textContent) || pattern.test(className)
          );
          
          if (isSuspicious) {
            quarantineElement(node);
          }
        } catch (error) {
          console.warn('CyberGuard scan error:', error);
        }
      }
    });
  }
  
  function quarantineElement(element) {
    try {
      // Validate element before manipulation
      if (!element || !element.style) {
        return;
      }
      
      // Apply cyber quarantine effect
      element.style.cssText = `
        border: 2px solid #ff0040 !important;
        background: rgba(255, 0, 64, 0.1) !important;
        position: relative !important;
        animation: cyberGlitch 0.5s infinite !important;
      `;
      
      // Add warning overlay
      const warning = document.createElement('div');
      warning.textContent = '⚠️ THREAT DETECTED'; // Use textContent for security
      warning.style.cssText = `
        position: absolute;
        top: -25px;
        left: 0;
        background: #ff0040;
        color: #00ff00;
        padding: 2px 6px;
        font-size: 10px;
        font-family: 'Courier New', monospace;
        z-index: 9999;
        animation: cyberPulse 1s infinite;
        pointer-events: none;
      `;
      
      element.style.position = 'relative';
      element.appendChild(warning);
      
      console.log('🚨 Suspicious element quarantined');
    } catch (error) {
      console.warn('CyberGuard quarantine error:', error);
    }
  }
  
  function performQuantumScan() {
    const currentUrl = window.location.hostname;
    
    // Check HTTPS status
    const isSecure = window.location.protocol === 'https:';
    
    // Scan for tracking scripts
    const scripts = Array.from(document.scripts);
    const trackingScripts = scripts.filter(script => {
      const src = script.src || '';
      return /analytics|tracking|ads|google-analytics|facebook|twitter/i.test(src);
    });
    
    // Display quantum scan results
    if (shieldConfig.quantumScan) {
      showQuantumResults({
        secure: isSecure,
        trackingScripts: trackingScripts.length,
        totalScripts: scripts.length,
        url: currentUrl
      });
    }
  }
  
  function showQuantumResults(scanData) {
    // Create quantum display
    const quantum = document.createElement('div');
    quantum.id = 'cyber-quantum-display';
    quantum.innerHTML = `
      <div class="quantum-panel">
        <div class="quantum-header">🔬 QUANTUM SCAN COMPLETE</div>
        <div class="quantum-data">
          <div>🔒 ENCRYPTION: ${scanData.secure ? '<span class="secure">ACTIVE</span>' : '<span class="insecure">INACTIVE</span>'}</div>
          <div>📡 TRACKERS: <span class="warning">${scanData.trackingScripts}</span></div>
          <div>⚡ SCRIPTS: ${scanData.totalScripts}</div>
          <div>🌐 HOST: ${scanData.url}</div>
        </div>
        <div class="quantum-close">×</div>
      </div>
    `;
    
    quantum.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      font-family: 'Courier New', monospace;
      animation: quantumSlide 0.5s ease-out;
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .quantum-panel {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
        border: 1px solid #00ff00;
        border-radius: 5px;
        padding: 15px;
        color: #00ff00;
        font-size: 12px;
        min-width: 250px;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
      }
      .quantum-header {
        text-align: center;
        font-weight: bold;
        margin-bottom: 10px;
        color: #00ffff;
      }
      .quantum-data div {
        margin: 5px 0;
      }
      .secure { color: #00ff00; }
      .insecure { color: #ff0040; }
      .warning { color: #ffff00; }
      .quantum-close {
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        color: #ff0040;
        font-weight: bold;
      }
      @keyframes quantumSlide {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes cyberPulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }
      @keyframes cyberGlitch {
        0% { transform: translate(0); }
        20% { transform: translate(-1px, 1px); }
        40% { transform: translate(-1px, -1px); }
        60% { transform: translate(1px, 1px); }
        80% { transform: translate(1px, -1px); }
        100% { transform: translate(0); }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(quantum);
    
    // Close button functionality
    quantum.querySelector('.quantum-close').addEventListener('click', () => {
      quantum.remove();
    });
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (quantum.parentNode) {
        quantum.style.animation = 'quantumSlide 0.5s ease-in reverse';
        setTimeout(() => quantum.remove(), 500);
      }
    }, 8000);
  }
  
  function initializeMatrixEffects() {
    // Add subtle matrix rain effect for special pages
    if (window.location.hostname.includes('google') || 
        window.location.hostname.includes('github') ||
        window.location.hostname.includes('stackoverflow')) {
      
      // Don't interfere with important sites, just add a subtle indicator
      const matrixIndicator = document.createElement('div');
      matrixIndicator.innerHTML = '🔴';
      matrixIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 999999;
        font-size: 12px;
        animation: cyberPulse 2s infinite;
        pointer-events: none;
      `;
      
      document.body.appendChild(matrixIndicator);
      
      setTimeout(() => matrixIndicator.remove(), 3000);
    }
  }
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      if (request.action === 'performDeepScan') {
        performQuantumScan();
        sendResponse({ status: 'SCAN_COMPLETE' });
      } else if (request.action === 'toggleShield') {
        shieldConfig.realTimeProtection = !shieldConfig.realTimeProtection;
        chrome.storage.sync.set({ cyberSettings: shieldConfig }, () => {
          if (chrome.runtime.lastError) {
            console.warn('Storage error:', chrome.runtime.lastError.message || 'Unknown error');
          }
        });
        sendResponse({ shieldActive: shieldConfig.realTimeProtection });
      } else {
        sendResponse({ status: 'UNKNOWN_ACTION' });
      }
    } catch (error) {
      console.warn('CyberGuard message handling error:', error);
      sendResponse({ status: 'ERROR', message: error.message });
    }
    
    return true;
  });
  
  console.log('✅ CyberGuard Shield Systems Online');
  
})();