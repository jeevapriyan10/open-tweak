# Contributing to Open Tweak

First off, thank you for taking the time to contribute! 🎉  
Open Tweak is a FOSS project and every contribution — big or small — matters.

---

## Getting Started

### 1. Fork the repo
Click the **Fork** button on GitHub and clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/open-tweak.git
cd open-tweak
```

### 2. Load the extension in Chrome
1. Go to `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked** → select the `open-tweak/` folder
4. The extension will appear in your toolbar

### 3. Make your changes
Create a new branch for your contribution:
```bash
git checkout -b feat/your-feature-name
```

### 4. Test it
- Open 2–3 real websites and verify your changes work
- Make sure you haven't broken existing fixes by checking the popup
- Test on both simple sites (wikipedia.org) and complex ones (reddit.com)

### 5. Push and open a Pull Request
```bash
git add .
git commit -m "feat: describe what you did"
git push origin feat/your-feature-name
```
Then open a Pull Request on GitHub with a clear description of what you changed and why.

---

## What Can I Contribute?

### Bug Fixes
- Found a site where a fix breaks the layout? Report it or fix it.
- Popup not showing the correct count? Dig into `content/profiler.js`.

### New WCAG Rules
The scanner currently detects 7 violations. You can add more.  
Each new rule needs three things:
1. A check in `content/scanner.js`
2. A fix in `content/fixer.js`
3. A label added in `popup/popup.js` under `RULE_LABELS`

Good rules to add next:
- Contrast ratio detection (WCAG 1.4.3)
- Missing `<title>` on the page
- Buttons with no accessible name
- Auto-playing media detection

### Profile Improvements
User profiles live in `content/profiler.js`.  
You can improve existing profiles or add new ones (e.g. ADHD mode, Senior mode).

### Firefox Compatibility
We use `chrome.*` APIs everywhere. Adding `webextension-polyfill` would make  
Open Tweak work on Firefox too. See [mozilla/webextension-polyfill](https://github.com/mozilla/webextension-polyfill).

### Documentation
Improving the README, adding code comments, or writing a wiki page all count.

---

## Commit Message Format

We follow a simple convention:

| Prefix | Use for |
|---|---|
| `feat:` | New feature or rule |
| `fix:` | Bug fix |
| `style:` | UI/CSS changes |
| `docs:` | Documentation only |
| `refactor:` | Code cleanup, no behaviour change |
| `test:` | Adding or fixing tests |

Example: `feat: add contrast ratio detection (WCAG 1.4.3)`

---

## Code Style

- Vanilla JS only — no frameworks in content scripts
- Keep each file focused on one job (scanner scans, fixer fixes)
- Add a comment for every new WCAG rule explaining what it checks
- Never crash the page — wrap DOM fixes in `try/catch`
- Test on at least 3 different websites before submitting

---

## Reporting Bugs

Open an issue with:
- The URL of the site where the bug occurred
- What you expected to happen
- What actually happened
- A screenshot if possible

---

## Code of Conduct

Be kind. This project exists to help people with disabilities access the web.  
Contributions that align with that mission are always welcome.

---

Built with for a more accessible web.