chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "TOGGLE_DARK_MODE" || msg.type === "UPDATE_SETTINGS") {
    if (msg.tabId) {
      chrome.tabs.sendMessage(msg.tabId, msg).catch(() => {
        // Ignored: Tab might be a restricted URL (chrome://) or content script not ready
      });
    }
  }
});
