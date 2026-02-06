chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openHome") {
    chrome.storage.sync.get(["apiUrl"], (data) => {
      const baseUrl = data.apiUrl || "https://coderep.vercel.app";
      chrome.tabs.create({ url: baseUrl });
    });
    sendResponse({ success: true });
  }

  if (request.action === "openDashboard") {
    chrome.storage.sync.get(["apiUrl"], (data) => {
      const baseUrl = data.apiUrl || "https://coderep.vercel.app";
      chrome.tabs.create({ url: `${baseUrl}/dashboard` });
    });
    sendResponse({ success: true });
  }

  if (request.action === "openSettings") {
    chrome.storage.sync.get(["apiUrl"], (data) => {
      const baseUrl = data.apiUrl || "https://coderep.vercel.app";
      chrome.tabs.create({ url: `${baseUrl}/dashboard/settings` });
    });
    sendResponse({ success: true });
  }

  if (request.action === "openProblem") {
    chrome.tabs.create({ url: request.url });
    sendResponse({ success: true });
  }

  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["apiUrl"], (data) => {
    if (!data.apiUrl) {
      chrome.storage.sync.set({ apiUrl: "https://coderep.vercel.app" });
    }
  });
});
