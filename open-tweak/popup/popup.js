// popup/popup.js

const RULE_LABELS = {
  "missing-alt":        "Missing alt text on images",
  "missing-label":      "Unlabelled form inputs",
  "missing-lang":       "Missing page language",
  "vague-link":         "Non-descriptive links",
  "no-focus-indicator": "Missing focus indicators",
  "missing-skip-link":  "No skip-to-content link",
  "small-font":         "Text below minimum size",
};

// ── Load fix summary for current tab's hostname ───────────────────────────
async function loadFixSummary() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  const host = new URL(tab.url).hostname;
  const data = await chrome.storage.local.get(`fixLog:${host}`);
  const log = data[`fixLog:${host}`];

  const badge = document.getElementById("fix-badge");
  const message = document.getElementById("fix-message");
  const list = document.getElementById("fix-list");

  if (!log || log.count === 0) {
    badge.textContent = "0";
    badge.classList.add("zero");
    message.textContent = "No issues found on this page.";
    message.style.color = "#22c55e";
    return;
  }

  badge.textContent = log.count;
  message.textContent = `Fixed ${log.count} issue${log.count !== 1 ? "s" : ""} on this page`;

  Object.entries(log.fixes).forEach(([rule, count]) => {
    const li = document.createElement("li");
    li.textContent = `${RULE_LABELS[rule] || rule} (${count})`;
    list.appendChild(li);
  });
}

// ── Profile selector ──────────────────────────────────────────────────────
async function loadProfile() {
  const data = await chrome.storage.sync.get("profile");
  const active = data.profile || "none";
  document.querySelectorAll(".profile-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.profile === active);
  });
}

document.getElementById("profile-grid").addEventListener("click", async (e) => {
  const btn = e.target.closest(".profile-btn");
  if (!btn) return;
  const profile = btn.dataset.profile;
  await chrome.storage.sync.set({ profile });

  document.querySelectorAll(".profile-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  // Reload active tab to apply new profile
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) chrome.tabs.reload(tab.id);
});

// ── Per-site disable toggle ───────────────────────────────────────────────
async function loadDisableToggle() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;
  const host = new URL(tab.url).hostname;

  const data = await chrome.storage.sync.get("siteDisabled");
  const disabled = data.siteDisabled?.[host] || false;
  document.getElementById("disable-toggle").checked = disabled;
}

document.getElementById("disable-toggle").addEventListener("change", async (e) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;
  const host = new URL(tab.url).hostname;

  const data = await chrome.storage.sync.get("siteDisabled");
  const siteDisabled = data.siteDisabled || {};
  siteDisabled[host] = e.target.checked;
  await chrome.storage.sync.set({ siteDisabled });
  chrome.tabs.reload(tab.id);
});

// ── Init ──────────────────────────────────────────────────────────────────
loadFixSummary();
loadProfile();
loadDisableToggle();
