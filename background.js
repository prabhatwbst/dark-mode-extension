chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "TOGGLE_DARK_MODE" || msg.type === "UPDATE_SETTINGS") {
    if (msg.tabId) {
      chrome.tabs.sendMessage(msg.tabId, msg);
    }
  }
});
