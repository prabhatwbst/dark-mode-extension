const DARK_STYLE_ID = "forced-dark-mode";

function enableDarkMode() {
  if (document.getElementById(DARK_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = DARK_STYLE_ID;
  style.innerHTML = `
    html {
      background-color: #1e1e1e !important;
      color: #e0e0e0 !important;
    }

    * {
      background-color: transparent !important;
      border-color: #333 !important;
    }

    a { color: #8ab4f8 !important; }
  `;

  document.head.appendChild(style);
}

function disableDarkMode() {
  document.getElementById(DARK_STYLE_ID)?.remove();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.enabled) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

