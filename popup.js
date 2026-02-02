const THEMES = {
  classic: { bg: "#1e1e1e", text: "#e0e0e0" },
  midnight: { bg: "#0f172a", text: "#cbd5e1" },
  oled: { bg: "#000000", text: "#ffffff" }
};

document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return; 

  const url = new URL(tab.url);
  const domain = url.hostname;
  
  const KEY_ENABLED = `darkMode_enabled_${tab.id}`;
  const KEY_THEME = `darkMode_theme`; 
  const KEY_CUSTOM_BG = `darkMode_bg_${domain}`;
  const KEY_CUSTOM_TEXT = `darkMode_text_${domain}`;

  // Load Settings
  const data = await chrome.storage.local.get([KEY_ENABLED, KEY_THEME, KEY_CUSTOM_BG, KEY_CUSTOM_TEXT]);
  
  let enabled = data[KEY_ENABLED] || false;
  let currentTheme = data[KEY_THEME] || "classic";
  // Default to classic colors if no custom colors saved yet
  let currentBg = data[KEY_CUSTOM_BG] || THEMES.classic.bg;
  let currentText = data[KEY_CUSTOM_TEXT] || THEMES.classic.text;

  // UI References
  const btnToggle = document.getElementById("toggle");
  const cards = document.querySelectorAll(".theme-card");
  const pickerBg = document.getElementById("picker-bg");
  const pickerText = document.getElementById("picker-text");
  const swatches = document.querySelectorAll(".swatch");

  // Helper: Update UI Visuals
  const updateUI = () => {
    btnToggle.innerText = enabled ? "Disable Dark Mode" : "Enable Dark Mode";
    btnToggle.style.background = enabled ? "#F28B82" : "#8ab4f8"; // Redish when disabling
    
    // Update Pickers
    pickerBg.value = currentBg;
    pickerText.value = currentText;

    // Update Cards Selection
    cards.forEach(card => {
      card.classList.remove("active");
      if (currentTheme !== "custom" && card.dataset.reqTheme === currentTheme) {
        card.classList.add("active");
      }
    });
  };

  const sendUpdate = () => {
    chrome.runtime.sendMessage({
      type: "UPDATE_SETTINGS",
      tabId: tab.id,
      enabled,
      // We now send raw colors, simpler for content script
      bg: currentBg,
      text: currentText
    });
  };

  const saveState = async () => {
    await chrome.storage.local.set({
      [KEY_ENABLED]: enabled,
      [KEY_THEME]: currentTheme,
      [KEY_CUSTOM_BG]: currentBg,
      [KEY_CUSTOM_TEXT]: currentText
    });
  };

  // --- Event Listeners ---

  // 1. Toggle Button
  btnToggle.onclick = async () => {
    enabled = !enabled;
    await saveState();
    updateUI();
    sendUpdate();
  };

  // 2. Theme Cards
  cards.forEach(card => {
    card.onclick = async () => {
      const themeName = card.dataset.reqTheme;
      const themeColors = THEMES[themeName];
      
      currentTheme = themeName;
      currentBg = themeColors.bg;
      currentText = themeColors.text;
      
      await saveState();
      updateUI();
      sendUpdate();
    };
  });

  // 3. Color Pickers (Switch to 'custom' theme)
  const onColorChange = async () => {
    currentTheme = "custom";
    currentBg = pickerBg.value;
    currentText = pickerText.value;
    
    await saveState();
    updateUI();
    sendUpdate();
  };

  pickerBg.oninput = onColorChange;
  pickerText.oninput = onColorChange;

  // 4. Palette Swatches
  swatches.forEach(swatch => {
    swatch.onclick = async () => {
      currentTheme = "custom";
      currentBg = swatch.dataset.color;
      // Keep text color as is, or maybe smart contrast? keeping simple for now.
      
      await saveState();
      updateUI();
      sendUpdate();
    };
  });

  // Init
  updateUI();
});
