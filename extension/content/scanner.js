// content/scanner.js
// Scans the live DOM for WCAG 2.1 AA violations.
// Returns an array of violation objects consumed by fixer.js

window.OpenTweak = window.OpenTweak || {};

// ── WCAG Contrast Helpers ─────────────────────────────────────────────────
window.OpenTweak.parseRGB = function (colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
};

window.OpenTweak.relativeLuminance = function ({ r, g, b }) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

window.OpenTweak.getContrastRatio = function (color1, color2) {
  const c1 = window.OpenTweak.parseRGB(color1);
  const c2 = window.OpenTweak.parseRGB(color2);
  if (!c1 || !c2) return 0;
  const l1 = window.OpenTweak.relativeLuminance(c1);
  const l2 = window.OpenTweak.relativeLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

// ── Scanner ───────────────────────────────────────────────────────────────
window.OpenTweak.scan = function () {
  const violations = [];

  // ── Rule 1: Images missing alt attribute ─────────────────────────────────
  const imgsNoAlt = document.querySelectorAll("img:not([alt])");
  imgsNoAlt.forEach((el) => {
    violations.push({ rule: "missing-alt", element: el });
  });

  // ── Rule 2: Inputs missing label / aria-label ────────────────────────────
  const inputs = document.querySelectorAll(
    "input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='reset'])"
  );
  inputs.forEach((input) => {
    const hasLabel =
      input.labels?.length > 0 ||
      input.getAttribute("aria-label") ||
      input.getAttribute("aria-labelledby") ||
      input.getAttribute("title");
    if (!hasLabel) {
      violations.push({ rule: "missing-label", element: input });
    }
  });

  // ── Rule 3: HTML element missing lang attribute ───────────────────────────
  const html = document.querySelector("html");
  if (html && !html.getAttribute("lang")) {
    violations.push({ rule: "missing-lang", element: html });
  }

  // ── Rule 4: Links with non-descriptive text ───────────────────────────────
  const vagueLinkTexts = ["click here", "here", "read more", "more", "link", "this"];
  document.querySelectorAll("a[href]").forEach((a) => {
    const text = a.textContent.trim().toLowerCase();
    if (vagueLinkTexts.includes(text) && !a.getAttribute("aria-label")) {
      violations.push({ rule: "vague-link", element: a });
    }
  });

  // ── Rule 5: Missing focus indicators (detect inline outline:none) ─────────
  document.querySelectorAll("a, button, input, select, textarea").forEach((el) => {
    const style = el.getAttribute("style") || "";
    if (style.includes("outline") && style.includes("none")) {
      violations.push({ rule: "no-focus-indicator", element: el });
    }
  });

  // ── Rule 6: Missing skip-to-content link ─────────────────────────────────
  const skipLink = document.querySelector('a[href="#main"], a[href="#content"], .skip-link');
  if (!skipLink) {
    violations.push({ rule: "missing-skip-link", element: document.body });
  }

  // ── Rule 7: Low font size (below 12px — aggressive cut) ──────────────────
  const allText = document.querySelectorAll("p, li, td, span, label, a");
  allText.forEach((el) => {
    const size = parseFloat(window.getComputedStyle(el).fontSize);
    if (size > 0 && size < 12) {
      violations.push({ rule: "small-font", element: el });
    }
  });

  // ── Rule 8: Low color contrast (WCAG 1.4.3 — minimum 4.5:1) ─────────────
  const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, a, li, span, label, td, button");
  textElements.forEach((el) => {
    const style = window.getComputedStyle(el);
    const color = style.color;
    const bg = style.backgroundColor;

    if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") return;

    const contrast = window.OpenTweak.getContrastRatio(color, bg);
    if (contrast > 0 && contrast < 4.5) {
      violations.push({ rule: "low-contrast", element: el, contrast });
    }
  });

  return violations;
};