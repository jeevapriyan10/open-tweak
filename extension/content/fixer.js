// content/fixer.js
// Reads violations from scanner.js and patches the live DOM.
// Never modifies server source — browser-only rendering layer.

window.OpenTweak = window.OpenTweak || {};

window.OpenTweak.fix = function (violations) {
  const fixLog = {};

  violations.forEach(({ rule, element }) => {
    try {
      switch (rule) {

        // ── Fix 1: Inject empty alt (marks as decorative) ──────────────────
        case "missing-alt": {
          element.setAttribute("alt", "");
          const title = element.getAttribute("title");
          if (title) element.setAttribute("alt", title);
          fixLog["missing-alt"] = (fixLog["missing-alt"] || 0) + 1;
          break;
        }

        // ── Fix 2: Inject aria-label on inputs ─────────────────────────────
        case "missing-label": {
          const hint =
            element.getAttribute("placeholder") ||
            element.getAttribute("name") ||
            element.getAttribute("type") ||
            "Input field";
          element.setAttribute(
            "aria-label",
            hint.charAt(0).toUpperCase() + hint.slice(1)
          );
          fixLog["missing-label"] = (fixLog["missing-label"] || 0) + 1;
          break;
        }

        // ── Fix 3: Inject lang attribute ───────────────────────────────────
        case "missing-lang": {
          element.setAttribute("lang", "en");
          fixLog["missing-lang"] = (fixLog["missing-lang"] || 0) + 1;
          break;
        }

        // ── Fix 4: Add descriptive aria-label to vague links ───────────────
        case "vague-link": {
          const href = element.getAttribute("href") || "";
          const parent = element.closest("p, li, td, article, section");
          const context = parent
            ? parent.textContent.trim().slice(0, 60)
            : href;
          if (context) {
            element.setAttribute("aria-label", `Link: ${context}`);
            fixLog["vague-link"] = (fixLog["vague-link"] || 0) + 1;
          }
          break;
        }

        // ── Fix 5: Restore focus indicators ───────────────────────────────
        case "no-focus-indicator": {
          const style = element.getAttribute("style") || "";
          const cleaned = style
            .replace(/outline\s*:\s*none\s*;?/gi, "")
            .replace(/outline\s*:\s*0\s*;?/gi, "")
            .trim();
          element.setAttribute("style", cleaned);
          fixLog["no-focus-indicator"] = (fixLog["no-focus-indicator"] || 0) + 1;
          break;
        }

        // ── Fix 6: Inject skip-to-content link ────────────────────────────
        case "missing-skip-link": {
          if (!document.getElementById("opentweak-skip-link")) {
            const skip = document.createElement("a");
            skip.id = "opentweak-skip-link";
            skip.href = "#main";
            skip.textContent = "Skip to main content";
            skip.className = "opentweak-skip-link";
            document.body.prepend(skip);
            fixLog["missing-skip-link"] = 1;
          }
          break;
        }

        // ── Fix 7: Force minimum font size ────────────────────────────────
        case "small-font": {
          element.style.fontSize = "12px";
          fixLog["small-font"] = (fixLog["small-font"] || 0) + 1;
          break;
        }

        // ── Fix 8: Boost low contrast text to meet 4.5:1 ─────────────────
        case "low-contrast": {
          const bg = window.getComputedStyle(element).backgroundColor;
          const rgb = window.OpenTweak.parseRGB(bg);
          if (rgb) {
            const luminance = window.OpenTweak.relativeLuminance(rgb);
            element.style.color = luminance > 0.5 ? "#111111" : "#f5f5f5";
          }
          fixLog["low-contrast"] = (fixLog["low-contrast"] || 0) + 1;
          break;
        }

      }
    } catch (err) {
      // Never crash the page
      console.warn("[OpenTweak] Fix failed for rule:", rule, err);
    }
  });

  return fixLog;
};