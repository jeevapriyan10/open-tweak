# OpenTweak

> A browser extension that auto-detects accessibility issues and applies client-side fixes + user-defined visual customizations — no server touched, ever.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-blue.svg)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange.svg)
![Firefox + Chrome](https://img.shields.io/badge/Browser-Chrome%20%7C%20Firefox-yellow.svg)

---

## What is OpenTweak?

Over **1 billion people** worldwide live with some form of disability. Most websites fail them — missing alt text, unreadable contrast, broken keyboard navigation. Developers rarely fix these issues because they often don't know they exist.

**OpenTweak** solves this from the other side: it gives users the power to fix accessibility problems themselves, in real time, on any website they visit.

It works in two layers:

### Layer 1 — Accessibility Auto-Fix Engine
When you open any webpage, OpenTweak scans the live DOM for WCAG violations and injects fixes directly into your browser's rendered view. The server's source code is never touched. You get a summary of every fix applied.

### Layer 2 — Personal Customization Profiles
Define your profile once (Color Blind, Low Vision, Dyslexia, and more) and OpenTweak applies your preferences consistently across **every website** you visit.

---

## Features

### Auto-Fix Engine (WCAG 2.1 AA)

| Issue Detected | Fix Applied |
|---|---|
| `<img>` missing `alt` attribute | Injects `alt=""` (decorative) or AI-generated description |
| Low color contrast | Re-colors text/background to meet 4.5:1 ratio |
| `<input>` missing `<label>` | Injects `aria-label` from placeholder or nearby text |
| Missing `lang` on `<html>` | Detects and injects correct language attribute |
| Non-descriptive links ("Click here") | Appends hidden `aria-label` with context |
| Missing focus indicators | Injects CSS `:focus` outlines for keyboard users |
| Videos without captions | Flags with a visible "No captions detected" badge |
| Font size below threshold | Forces minimum `font-size: 16px` |
| No skip navigation link | Injects "Skip to content" link at top of page |

### Customization Profiles

- **Color Blind** (Deuteranopia / Protanopia / Tritanopia) — SVG color matrix filters, red/green → blue/orange remapping
- **Low Vision** — 1.25x font scaling, increased line-height (1.8), max content width 70ch
- **Dyslexia** — OpenDyslexic font, increased letter/word spacing, forced left-align
- **Deaf / Hard of Hearing** — Auto-flags all video/audio elements, highlights notification areas
- **Gamer** — High contrast, forced dark mode, reduced animations
- **Student / Focus Mode** — Hides ads, removes autoplay media, increased text contrast

### AI-Powered Alt Text (Local, No API Key)
Uses **Transformers.js** (Hugging Face) to run the BLIP image captioning model entirely in your browser via WebAssembly. No data ever leaves your machine.

---

## Architecture

```
OpenTweak/
├── manifest.json              ← Extension config (Manifest V3)
├── background/
│   └── service-worker.js      ← Listens for tab updates
├── content/
│   ├── scanner.js             ← DOM scanner (finds violations)
│   ├── fixer.js               ← Injects fixes into the DOM
│   ├── profiler.js            ← Applies user profile preferences
│   └── injected.css           ← Base CSS overrides
├── popup/
│   ├── popup.html             ← Extension popup UI
│   ├── popup.js               ← Profile selector + fix log display
│   └── popup.css
├── options/
│   ├── options.html           ← Full settings page
│   └── options.js
└── assets/
    ├── fonts/                 ← OpenDyslexic font files
    └── icons/
```

### How It Works

```
User opens website
       ↓
[scanner.js fires on DOMContentLoaded]
       ↓
Scans DOM → collects violations list
       ↓
[fixer.js] applies DOM patches
(setAttribute, style injection, aria insertion)
       ↓
[profiler.js] applies user profile CSS/JS
       ↓
[popup.js] shows fix summary: "Fixed 4 issues on this page"
```

### Storage Model

```javascript
// chrome.storage.sync — syncs across user's devices
{
  profile: "color-blind-deuteranopia",
  customizations: {
    fontSize: 1.2,
    fontFamily: "OpenDyslexic",
    forceDarkMode: false,
    hideAds: true
  },
  fixLog: {
    "https://example.com": {
      timestamp: "2025-01-01",
      fixes: ["alt-text: 3 images", "contrast: 2 elements", "aria-label: 1 input"]
    }
  }
}
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Extension framework | Manifest V3 (Chrome + Firefox via WebExtensions API) |
| DOM scanning | Vanilla JS + `TreeWalker` API |
| Accessibility rules | Custom rule engine inspired by axe-core |
| Color contrast check | WCAG relative luminance algorithm (pure math) |
| CSS injection | `document.adoptedStyleSheets` / `<style>` tag injection |
| User interface | HTML + CSS + vanilla JS |
| Storage | `chrome.storage.sync` API |
| AI alt-text (optional) | Transformers.js — runs BLIP model locally in browser |
| Build tool | Vite + `@crxjs/vite-plugin` |
| Testing | Jest + Playwright (E2E) |
| Cross-browser | `webextension-polyfill` (Mozilla) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm



### Load in Chrome
1. Go to `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select the `dist/` folder

### Load in Firefox
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `dist/manifest.json`

---

## MVP Scope (Hackathon Build)

### Must Have
- Profile selector (Color Blind, Dyslexia, Low Vision)
- Auto-fix: missing `alt` text
- Auto-fix: missing `aria-label` on inputs
- Auto-fix: inject focus indicators via CSS
- Auto-fix: minimum font size enforcement
- Fix summary shown in popup
- Per-site disable toggle

### Nice to Have
- Contrast ratio detection and auto-fix
- AI alt text generation via Transformers.js
- Fix history log per site
- Firefox compatibility

### Future Scope
- Caption generation for videos
- Cross-device sync
- Mobile browser support

---

## WCAG Compliance

OpenTweak targets **WCAG 2.1 Level AA** — the legal accessibility standard in most jurisdictions (EU Accessibility Act, US ADA, India RPWD Act).

Built around the four POUR principles:

| Principle | What it means | How OpenTweak helps |
|---|---|---|
| **Perceivable** | Users can perceive all content | Alt text, captions, contrast fixes |
| **Operable** | Users can operate all interfaces | Keyboard nav, focus indicators, skip links |
| **Understandable** | Content is readable and predictable | Language detection, labels, font scaling |
| **Robust** | Compatible with assistive technologies | ARIA injection, semantic HTML fixes |

---

## Why OpenTweak?

| Tool | Who it's for | What it does |
|---|---|---|
| axe DevTools / WAVE | Developers | **Reports** accessibility problems |
| OpenTweak | End users | **Fixes** accessibility problems |

OpenTweak isn't a developer debugging tool. It's a real-time accessibility layer for people who need it — today, on any website, without waiting for developers to act.

---

## Privacy

- Everything runs **100% client-side** — no data ever leaves your browser
- Fix logs are stored locally via `chrome.storage` (opt-in)
- No telemetry, no analytics, no accounts required
- AI alt text runs locally via WebAssembly — no API calls
- Fully open source — the code is auditable by anyone

---

## Open Source References

- [axe-core](https://github.com/dequelabs/axe-core) — MIT licensed accessibility rule engine
- [Transformers.js](https://github.com/xenova/transformers.js) — In-browser ML by Hugging Face
- [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) — Chrome/Firefox unified API
- [OpenDyslexic](https://opendyslexic.org) — Free dyslexia-friendly font
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/) — W3C

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change. All fixes should be grounded in WCAG 2.1 AA guidelines.

## License

MIT — free to use, modify, and distribute.

---

<p align="center">Built with for the web that should have been accessible from the start.</p>