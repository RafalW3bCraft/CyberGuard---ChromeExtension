// CyberGuard Ad Blocker - Content Filtering System
(function() {
  'use strict';
  
  // Prevent multiple injections
  if (window.cyberAdBlockActive) return;
  window.cyberAdBlockActive = true;
  
  console.log('🚫 CyberGuard Ad Blocker Activated');
  
  // Comprehensive ad selectors
  const AD_SELECTORS = [
    // Generic ad containers
    '.ad', '.ads', '.advertisement', '.advert', '.adv', '.adsense',
    '.adblock', '.ad-banner', '.ad-container', '.ad-wrapper', '.ad-space',
    '[class*="ad-"]', '[id*="ad-"]', '[class*="ads-"]', '[id*="ads-"]',
    
    // Google Ads
    '.adsbygoogle', 'ins.adsbygoogle', '.google-ad', '.googlead',
    'iframe[src*="googlesyndication"]', 'iframe[src*="googletagservices"]',
    
    // Social media ads
    '[data-ad-type]', '[data-ad-preview]', '[data-testid*="ad"]',
    '.fb_ad', '.twitter-ad', '.promoted-tweet', '.sponsored-post',
    
    // Pop-ups and overlays
    '.popup', '.modal', '.overlay', '.lightbox', '.interstitial',
    '[class*="popup"]', '[class*="modal"]', '[class*="overlay"]',
    
    // Newsletter signups
    '.newsletter-popup', '.email-signup', '.subscribe-modal',
    '.mailing-list', '.subscription-box'
  ];
  
  // Adult content domains
  const ADULT_DOMAINS = [
    'pornhub.com', 'xvideos.com', 'xnxx.com', 'redtube.com', 'youporn.com',
    'tube8.com', 'spankbang.com', 'xhamster.com', 'chaturbate.com', 'cam4.com',
    'bongacams.com', 'livejasmin.com', 'stripchat.com', 'camsoda.com',
    'onlyfans.com', 'fansly.com', 'manyvids.com', 'clips4sale.com'
  ];
  
  // Tracking domains
  const TRACKING_DOMAINS = [
    'google-analytics.com', 'googletagmanager.com', 'doubleclick.net',
    'facebook.com/tr', 'connect.facebook.net', 'analytics.twitter.com'
  ];
  
  let adBlockConfig = {
    enabled: true,
    blockAds: true,
    blockTrackers: true,
    blockAdultContent: true
  };
  
  // Initialize ad blocker
  initializeAdBlocker();
  
  function initializeAdBlocker() {
    // Load configuration
    chrome.storage.sync.get(['digitalFortress', 'cyberSettings'], (data) => {
      if (chrome.runtime.lastError) {
        console.warn('CyberGuard adblock config error:', chrome.runtime.lastError.message || 'Unknown error');
        return;
      }
      
      if (data.cyberSettings) {
        adBlockConfig = { ...adBlockConfig, ...data.cyberSettings };
      }
      
      if (adBlockConfig.enabled) {
        startContentFiltering();
      }
    });
  }
  
  function startContentFiltering() {
    // Block existing content
    blockAdsAndTrackers();
    
    // Monitor for new content with error handling
    const observer = new MutationObserver((mutations) => {
      try {
        blockAdsAndTrackers();
      } catch (error) {
        console.warn('CyberGuard content filtering error:', error);
      }
    });
    
    if (document.body) {
      try {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      } catch (error) {
        console.warn('CyberGuard observer setup error:', error);
      }
    } else {
      // Wait for body to be available
      document.addEventListener('DOMContentLoaded', () => {
        if (document.body) {
          try {
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
          } catch (error) {
            console.warn('CyberGuard observer setup error:', error);
          }
        }
      });
    }
    
    // Cleanup observer on page unload
    window.addEventListener('beforeunload', () => {
      if (observer) {
        observer.disconnect();
      }
    });
  }
  
  function blockAdsAndTrackers() {
    if (adBlockConfig.blockAds) {
      blockAdvertisements();
    }
    
    if (adBlockConfig.blockTrackers) {
      blockTrackingScripts();
    }
    
    if (adBlockConfig.blockAdultContent) {
      checkAdultContent();
    }
  }
  
  function blockAdvertisements() {
    AD_SELECTORS.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element && !element.dataset.cyberBlocked) {
            element.style.display = 'none';
            element.dataset.cyberBlocked = 'true';
          }
        });
      } catch (error) {
        // Ignore invalid selectors
      }
    });
  }
  
  function blockTrackingScripts() {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.src;
      if (TRACKING_DOMAINS.some(domain => src.includes(domain))) {
        script.remove();
      }
    });
    
    // Block tracking pixels
    const trackingPixels = document.querySelectorAll('img[width="1"][height="1"]');
    trackingPixels.forEach(pixel => pixel.remove());
  }
  
  function checkAdultContent() {
    const hostname = window.location.hostname;
    if (ADULT_DOMAINS.some(domain => hostname.includes(domain))) {
      // Adult content detected - notify background script
      chrome.runtime.sendMessage({
        action: 'adultContentDetected',
        hostname: hostname
      });
    }
  }
  
  console.log('✅ CyberGuard Ad Blocker Systems Online');
  
})();