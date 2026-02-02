const DARK_STYLE_ID = "forced-dark-mode";
const CUSTOM_STYLE_ID = "custom-dark-mode";

function enableDarkMode(bg = "#1e1e1e", text = "#e0e0e0") {
  let style = document.getElementById(DARK_STYLE_ID);
  
  if (!style) {
    style = document.createElement("style");
    style.id = DARK_STYLE_ID;
    document.head.appendChild(style);
  }

  style.innerHTML = `
    html {
      background-color: ${bg} !important;
      color: ${text} !important;
    }
    * {
      background-color: transparent !important;
      border-color: #333 !important;
    }
    a { color: #8ab4f8 !important; }
  `;
}

function disableDarkMode() {
  document.getElementById(DARK_STYLE_ID)?.remove();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TOGGLE_DARK_MODE" || msg.type === "UPDATE_SETTINGS") {
    if (msg.enabled) {
      // Receive bg/text directly from popup
      enableDarkMode(msg.bg, msg.text);
    } else {
      disableDarkMode();
    }
  }
});

