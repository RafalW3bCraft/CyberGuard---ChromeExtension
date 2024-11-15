// Background service worker script for Chrome Extension (Manifest V3)

// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("FocusPro Extension Installed or Updated!");
    
    // Initialize or reset settings on install/update
    initializeExtensionSettings();
  
    // Set up any alarms, if necessary
    setupAlarms();
  });
  
  // Initialize settings (can be extended based on your needs)
  function initializeExtensionSettings() {
    chrome.storage.sync.get(['blockedSites', 'whitelist'], (data) => {
      if (!data.blockedSites) {
        // Initialize blocked sites if none exist
        chrome.storage.sync.set({ blockedSites: {} });
      }
      if (!data.whitelist) {
        // Initialize whitelist if none exist
        chrome.storage.sync.set({ whitelist: [] });
      }
      console.log("Extension settings initialized.");
    });
  }
  
  // Set up alarms for periodic tasks (e.g., checking blocked sites)
  function setupAlarms() {
    chrome.alarms.create('checkBlockedSites', {
      periodInMinutes: 5, // Check every 5 minutes
    });
    console.log("Alarm set to check blocked sites every 5 minutes.");
  }
  
  // Listen for new tab creation and check if the site is blocked
  chrome.tabs.onCreated.addListener((tab) => {
    console.log("New tab created:", tab);
  
    // Check if the tab URL is in the blocked sites list
    chrome.storage.sync.get('blockedSites', (data) => {
      const url = new URL(tab.url).hostname;
  
      if (data.blockedSites[url]) {
        console.log(`Tab ${url} is blocked. Redirecting...`);
        chrome.tabs.update(tab.id, { url: 'blocked.html' }); // Redirect to a blocked page
      }
    });
  });
  
  // Listen for alarm events (e.g., for periodic checks)
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkBlockedSites') {
      console.log("Checking blocked sites...");
  
      // Perform periodic tasks such as suggesting sites to block
      suggestBlockingDistractingSites();
    }
  });
  
  // Function to suggest blocking distracting sites based on browsing history
  function suggestBlockingDistractingSites() {
    // Example logic to identify sites to block (for illustration purposes)
    chrome.history.search({ text: '', maxResults: 100 }, (historyItems) => {
      const visitCount = {};
      
      // Count visits for each site
      historyItems.forEach(item => {
        const hostname = new URL(item.url).hostname;
        visitCount[hostname] = (visitCount[hostname] || 0) + 1;
      });
  
      // Suggest blocking sites with more than 10 visits
      for (let site in visitCount) {
        if (visitCount[site] > 10) {
          chrome.storage.sync.get('blockedSites', (data) => {
            if (!data.blockedSites[site]) {
              console.log(`Suggest blocking ${site}`);
              // Notify user about the suggested block (can be enhanced with notifications)
              chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'Distracting Site Alert',
                message: `You've visited ${site} many times. Consider blocking it.`,
              });
            }
          });
        }
      }
    });
  }
  
  // Example listener for browser action (click on extension icon)
  chrome.action.onClicked.addListener((tab) => {
    console.log("Extension icon clicked.");
    
    // Open popup or perform other tasks
    // You can also show a notification or log something specific
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'FocusPro',
      message: 'Stay focused and productive!',
    });
  });
  
  // Listen for messages sent from content scripts or other parts of the extension
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'blockSite') {
      // Block a specific site (add to the blocked list)
      const siteToBlock = message.site;
      chrome.storage.sync.get('blockedSites', (data) => {
        const blockedSites = data.blockedSites || {};
        blockedSites[siteToBlock] = Date.now() + (message.duration * 60 * 1000); // Block for specified duration (in ms)
        chrome.storage.sync.set({ blockedSites });
  
        console.log(`Site ${siteToBlock} blocked for ${message.duration} minutes.`);
        sendResponse({ status: 'success', message: `Blocked ${siteToBlock} for ${message.duration} minutes.` });
      });
    }
  
    return true; // Asynchronous response
  });
  
  // Ensure service worker doesn't terminate when idle, if needed
  chrome.runtime.onConnect.addListener((port) => {
    console.log("Port connected:", port.name);
    
    // You can use this to keep the service worker alive during active communication
    port.onMessage.addListener((msg) => {
      console.log("Message received on port:", msg);
    });
  });
  