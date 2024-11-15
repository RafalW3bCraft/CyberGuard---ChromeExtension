document.getElementById("addProfile").addEventListener("click", () => {
    const profileName = prompt("Enter Profile Name");
    chrome.storage.sync.get("profiles", (data) => {
      data.profiles[profileName] = {};
      chrome.storage.sync.set({ profiles: data.profiles });
    });
  });
  