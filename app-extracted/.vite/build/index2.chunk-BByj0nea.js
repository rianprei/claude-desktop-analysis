(function(){try{var e=typeof window<`u`?window:typeof global<`u`?global:typeof globalThis<`u`?globalThis:typeof self<`u`?self:{};e.SENTRY_RELEASE={id:`d1a6bcd4ef8627d603a8290548a984220b6701cf`}}catch{}})();try{(function(){var e=typeof window<`u`?window:typeof global<`u`?global:typeof globalThis<`u`?globalThis:typeof self<`u`?self:{},t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]=`d44d2a50-53d7-450f-af21-d90e30a9d3aa`,e._sentryDebugIdIdentifier=`sentry-dbid-d44d2a50-53d7-450f-af21-d90e30a9d3aa`)})()}catch{}const e=require("./index.chunk-Dp__wOLa.js"),t=require("./index.chunk-CoAKSwS2.js"),n=require("./index.chunk-DQEnfUHJ.js"),r=require("./index.chunk-Dzhy8rZx.js"),i=require("./index.chunk-sRY77Jf8.js"),a=require("./index.chunk-CrV93O64.js"),o=require("./index.chunk-CBsXS8CL.js"),s=require("./index2.chunk-CmjCriRS.js"),c=require("./index2.chunk-ByyI3GPR.js"),l=require("./index2.chunk-DWIEulCy.js"),u=require("./index2.chunk-CWFYeQri.js"),d=require("./index.chunk-7wubTUps.js"),f=require("./index.chunk-SafWn8tp.js"),p=require("./index.chunk-277YQ-IA.js"),m=require("./index.chunk-HoY-ntxp.js"),h=require("./index2.chunk-C6fzqxmc.js"),g=require("./index2.chunk-bjhMeCq-.js"),_=require("./index.chunk-CEchIfKD.js"),v=require("./index.chunk-CSUqQbsb.js"),y=require("./index.chunk-DHdMkL28.js"),b=require("./index2.chunk-DS4758Xc.js"),x=require("./index2.chunk-CbCh8o8g.js"),S=require("./index2.chunk-BeAM6l1I.js");let C=require("node:child_process"),w=require("node:path");w=e.a(w);let T=require("electron"),ee=require("node:crypto"),te=require("node:fs/promises"),ne=require("node:events"),E=require("node:net"),D=require("node:url");var O={refuseSubstitutedPath:c.U};function re(e,t){if(e.includes(`\0`))throw Error(`${t} cwd contains null byte`);if(n.m(e))throw Error(`${t} cwd is a UNC path: ${e}`);if(c.U(w.default.resolve(e)))throw Error(`${t} cwd is an automount root: ${e}`)}async function ie(e,r){re(e,r);try{await n.a(w.default.resolve(e),O)}catch(e){throw t.o.warn(`[${r}] cwd refused by hop guard %o`,{name:e instanceof Error?e.name:typeof e,code:e?.code}),Error(`${r} cwd failed the path safety check`)}}var ae=`// Content script that defines the accessibility tree generation function in the MAIN context

(function () {
  // Initialize global element map and ref counter if not already present
  if (!window.__claudeElementMap) {
    window.__claudeElementMap = {};
  }
  // O(1) Element → ref lookup. Avoids the previous O(n²) linear scan of
  // __claudeElementMap on every included element. WeakMap so GC'd elements
  // drop out automatically. Initialised independently so a page that already
  // has __claudeElementMap from a previous injection still gets the index.
  if (!window.__claudeElementReverseMap) {
    window.__claudeElementReverseMap = new WeakMap();
  }
  if (!window.__claudeRefCounter) {
    window.__claudeRefCounter = 0;
  }

  // Define the accessibility tree generation function on the window (in content script context)
  window.__generateAccessibilityTree = function (
    filterType,
    maxDepth,
    maxChars,
    refId,
  ) {
    try {
      var result = [];
      var effectiveMaxDepth =
        maxDepth !== undefined && maxDepth !== null ? maxDepth : 15;

      function getRole(element) {
        var role = element.getAttribute("role");
        if (role) return role;

        var tag = element.tagName.toLowerCase();
        var type = element.getAttribute("type");

        var roleMap = {
          a: "link",
          button: "button",
          input:
            type === "submit" || type === "button"
              ? "button"
              : type === "checkbox"
                ? "checkbox"
                : type === "radio"
                  ? "radio"
                  : type === "file"
                    ? "button"
                    : "textbox",
          select: "combobox",
          textarea: "textbox",
          h1: "heading",
          h2: "heading",
          h3: "heading",
          h4: "heading",
          h5: "heading",
          h6: "heading",
          img: "image",
          nav: "navigation",
          main: "main",
          header: "banner",
          footer: "contentinfo",
          section: "region",
          article: "article",
          aside: "complementary",
          form: "form",
          table: "table",
          ul: "list",
          ol: "list",
          li: "listitem",
          label: "label",
        };

        return roleMap[tag] || "generic";
      }

      // password / hidden / OTP / credit-card field values must never be
      // serialized into the tree — find/read_page send the tree to the model.
      function isSensitiveInput(element) {
        var type = (element.getAttribute("type") || "").toLowerCase();
        if (type === "password" || type === "hidden") return true;

        var autocomplete = (
          element.getAttribute("autocomplete") || ""
        ).toLowerCase();
        var sensitiveAutocomplete = [
          "current-password",
          "new-password",
          "one-time-code",
          "cc-number",
          "cc-csc",
          "cc-exp",
          "cc-exp-month",
          "cc-exp-year",
        ];
        for (var i = 0; i < sensitiveAutocomplete.length; i++) {
          if (autocomplete.indexOf(sensitiveAutocomplete[i]) !== -1)
            return true;
        }
        return false;
      }

      // Direct text-node children only — used for label[for] resolution so a
      // wrapping <label> doesn't pull in nested <option>/<textarea> text.
      function directTextOf(el) {
        var t = "";
        for (var i = 0; i < el.childNodes.length; i++) {
          if (el.childNodes[i].nodeType === Node.TEXT_NODE)
            t += el.childNodes[i].textContent;
        }
        return t.trim();
      }

      function getCleanName(element) {
        var tag = element.tagName.toLowerCase();

        // For selects, get the selected option text
        if (tag === "select") {
          if (isSensitiveInput(element)) {
            // Preserve identifying labels (parity with the input flow below);
            // only redact the selected value.
            var selAria = element.getAttribute("aria-label");
            if (selAria && selAria.trim()) return selAria.trim();
            var selTitle = element.getAttribute("title");
            if (selTitle && selTitle.trim()) return selTitle.trim();
            if (element.id) {
              var selLabel = document.querySelector(
                'label[for="' + element.id + '"]',
              );
              if (selLabel) {
                var selLabelText = directTextOf(selLabel);
                if (selLabelText) return selLabelText;
              }
            }
            return "[value redacted]";
          }
          var selectElement = element;
          var selectedOption =
            selectElement.querySelector("option[selected]") ||
            selectElement.options[selectElement.selectedIndex];
          if (selectedOption && selectedOption.textContent) {
            return selectedOption.textContent.trim();
          }
        }

        // Priority order for getting meaningful names
        var ariaLabel = element.getAttribute("aria-label");
        if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();

        var placeholder = element.getAttribute("placeholder");
        if (placeholder && placeholder.trim()) return placeholder.trim();

        var title = element.getAttribute("title");
        if (title && title.trim()) return title.trim();

        var alt = element.getAttribute("alt");
        if (alt && alt.trim()) return alt.trim();

        // For form labels
        if (element.id) {
          var label = document.querySelector('label[for="' + element.id + '"]');
          if (label) {
            var labelText = directTextOf(label);
            if (labelText) return labelText;
          }
        }

        // For inputs with values
        if (tag === "input") {
          var inputElement = element;
          var type = element.getAttribute("type") || "";
          var value = element.getAttribute("value");

          if (type === "submit" && value && value.trim()) {
            return value.trim();
          }

          if (isSensitiveInput(element)) {
            return inputElement.value ? "[value redacted]" : "";
          }

          if (
            inputElement.value &&
            inputElement.value.length < 50 &&
            inputElement.value.trim()
          ) {
            return inputElement.value.trim();
          }
        }

        if (tag === "textarea" && isSensitiveInput(element)) {
          return element.value ? "[value redacted]" : "";
        }

        // For buttons, links, and other interactive elements, get direct text
        if (["button", "a", "summary"].includes(tag)) {
          var directText = "";
          for (var i = 0; i < element.childNodes.length; i++) {
            var node = element.childNodes[i];
            if (node.nodeType === Node.TEXT_NODE) {
              directText += node.textContent;
            }
          }
          if (directText.trim()) return directText.trim();
        }

        // For headings, get text content but limit it
        if (tag.match(/^h[1-6]$/)) {
          var headingText = element.textContent;
          if (headingText && headingText.trim()) {
            return headingText.trim().substring(0, 100);
          }
        }

        // ignore images without an "alt"
        if (tag === "img") {
          return "";
        }

        // For generic elements, get direct text content (not including child elements)
        // This helps capture important text in spans, divs, etc.
        var directTextContent = "";
        for (var j = 0; j < element.childNodes.length; j++) {
          var childNode = element.childNodes[j];
          if (childNode.nodeType === Node.TEXT_NODE) {
            directTextContent += childNode.textContent;
          }
        }

        if (
          directTextContent &&
          directTextContent.trim() &&
          directTextContent.trim().length >= 3
        ) {
          // Only return if it's meaningful text (at least 3 characters)
          var trimmedText = directTextContent.trim();
          if (trimmedText.length > 100) {
            return trimmedText.substring(0, 100) + "...";
          }
          return trimmedText;
        }

        return "";
      }

      function isVisible(element) {
        var style = window.getComputedStyle(element);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          element.offsetWidth > 0 &&
          element.offsetHeight > 0
        );
      }

      function isInteractive(element) {
        var tag = element.tagName.toLowerCase();
        var interactiveTags = [
          "a",
          "button",
          "input",
          "select",
          "textarea",
          "details",
          "summary",
        ];

        return (
          interactiveTags.includes(tag) ||
          element.getAttribute("onclick") !== null ||
          element.getAttribute("tabindex") !== null ||
          element.getAttribute("role") === "button" ||
          element.getAttribute("role") === "link" ||
          element.getAttribute("contenteditable") === "true"
        );
      }

      function isSemantic(element) {
        var tag = element.tagName.toLowerCase();
        var semanticTags = [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "nav",
          "main",
          "header",
          "footer",
          "section",
          "article",
          "aside",
        ];
        return (
          semanticTags.includes(tag) || element.getAttribute("role") !== null
        );
      }

      function shouldIncludeElement(element, options) {
        var tag = element.tagName.toLowerCase();

        // Always skip these
        if (
          ["script", "style", "meta", "link", "title", "noscript"].includes(tag)
        )
          return false;
        if (
          options.filter !== "all" &&
          element.getAttribute("aria-hidden") === "true"
        )
          return false;

        // Check visibility unless using 'all' filter (which includes non-visible elements)
        if (options.filter !== "all" && !isVisible(element)) return false;

        // Skip viewport visibility check when refId is specified (we want all children of the ref element)
        // or when using 'all' filter
        if (options.filter !== "all" && !options.refId) {
          var rect = element.getBoundingClientRect();
          var inViewport =
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0;
          if (!inViewport) return false;
        }

        // Apply interactive filter if specified
        if (options.filter === "interactive") {
          return isInteractive(element);
        }

        // Default behavior when no filter is specified (all visible elements)
        // Always include interactive elements
        if (isInteractive(element)) return true;

        // Always include semantic elements (headings, nav, etc.)
        if (isSemantic(element)) return true;

        // Include elements with meaningful text content
        if (getCleanName(element).length > 0) return true;

        var elementRole = getRole(element);
        if (
          elementRole !== null &&
          elementRole !== "generic" &&
          elementRole !== "image"
        ) {
          return true;
        }

        return false;
      }

      // Hard cap on included elements per walk. Depth is already capped, but
      // a wide flat DOM (infinite-scroll feeds, huge tables) can still pin
      // the main thread past the 45s executeScript race. 10k is well above
      // typical pages and below the point where serialization alone is slow.
      var MAX_INCLUDED_NODES = 10000;
      var includedNodeCount = 0;

      function processElement(element, depth, options) {
        if (includedNodeCount >= MAX_INCLUDED_NODES) return;
        if (depth > effectiveMaxDepth) return; // Use configurable depth limit
        if (!element || !element.tagName) return;

        var shouldInclude =
          shouldIncludeElement(element, options) ||
          (options.refId !== null && depth === 0);

        if (shouldInclude) {
          var role = getRole(element);
          var name = getCleanName(element);

          var ref = window.__claudeElementReverseMap.get(element) || null;
          // The reverse map is weak, but the forward map's WeakRef may have
          // been swept while a stale reverse entry survived (different GC
          // timing). Verify the forward entry still points at this element.
          if (ref) {
            var fwd = window.__claudeElementMap[ref];
            if (!fwd || fwd.deref() !== element) ref = null;
          }

          // If not found, create a new ref
          if (!ref) {
            ref = "ref_" + ++window.__claudeRefCounter;
            window.__claudeElementMap[ref] = new WeakRef(element);
            window.__claudeElementReverseMap.set(element, ref);
          }
          includedNodeCount++;

          var yaml = " ".repeat(depth) + role;

          if (name) {
            // Clean up the name - remove newlines, limit length
            name = name.replace(/\\s+/g, " ").substring(0, 100);
            yaml += ' "' + name.replace(/"/g, '\\\\"') + '"';
          }

          yaml += " [" + ref + "]";

          // Add useful attributes
          if (element.getAttribute("href"))
            yaml += ' href="' + element.getAttribute("href") + '"';
          if (element.getAttribute("type"))
            yaml += ' type="' + element.getAttribute("type") + '"';
          if (element.getAttribute("placeholder"))
            yaml +=
              ' placeholder="' + element.getAttribute("placeholder") + '"';

          result.push(yaml);

          // For select elements, add options as children
          var tag = element.tagName.toLowerCase();
          if (tag === "select" && !isSensitiveInput(element)) {
            var selectElement = element;
            var selectOptions = selectElement.options;
            for (var optIdx = 0; optIdx < selectOptions.length; optIdx++) {
              var opt = selectOptions[optIdx];
              var optYaml = " ".repeat(depth + 1) + "option";
              var optText = opt.textContent ? opt.textContent.trim() : "";
              if (optText) {
                optText = optText.replace(/\\s+/g, " ").substring(0, 100);
                optYaml += ' "' + optText.replace(/"/g, '\\\\"') + '"';
              }
              // Mark selected option
              if (opt.selected) {
                optYaml += " (selected)";
              }
              // Add value if different from text
              if (opt.value && opt.value !== optText) {
                optYaml += ' value="' + opt.value.replace(/"/g, '\\\\"') + '"';
              }
              result.push(optYaml);
            }
          }
        }

        // Don't recurse into a sensitive <select> — option text would leak via
        // the generic child path even though the option-loop above is gated.
        var elTag = element.tagName.toLowerCase();
        if (elTag === "select" && isSensitiveInput(element)) return;

        // Always traverse children - we need to go deep to find interactive elements
        if (element.children && depth < effectiveMaxDepth) {
          for (var i = 0; i < element.children.length; i++) {
            processElement(
              element.children[i],
              shouldInclude ? depth + 1 : depth,
              options,
            );
          }
        }
      }

      var options = {
        filter: filterType || "all", // Default to "all" if no filter specified
        refId: refId,
      };

      // If refId is specified, find that element and process it
      if (refId) {
        var weakRef = window.__claudeElementMap[refId];
        if (!weakRef) {
          return {
            error:
              "Element with ref_id '" +
              refId +
              "' not found. It may have been removed from the page. Use read_page without ref_id to get the current page state.",
            pageContent: "",
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
          };
        }

        var targetElement = weakRef.deref();
        if (!targetElement) {
          return {
            error:
              "Element with ref_id '" +
              refId +
              "' no longer exists. It may have been removed from the page. Use read_page without ref_id to get the current page state.",
            pageContent: "",
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
          };
        }

        processElement(targetElement, 0, options);
      } else if (document.body) {
        processElement(document.body, 0, options);
      }

      // Clean up stale references (elements that have been garbage collected)
      for (var ref in window.__claudeElementMap) {
        var elementWeakRef = window.__claudeElementMap[ref];
        if (!elementWeakRef.deref()) {
          delete window.__claudeElementMap[ref];
        }
      }

      var pageContent = result.join("\\n");

      if (includedNodeCount >= MAX_INCLUDED_NODES) {
        var truncHint = refId
          ? "use a smaller depth or focus on a more specific child element"
          : "use a refId or smaller depth to focus";
        pageContent +=
          "\\n[truncated at " +
          MAX_INCLUDED_NODES +
          " elements — page is very large; " +
          truncHint +
          "]";
      }

      // Character count limit (skip if maxCharacters is null/undefined).
      // Truncate rather than error — pageContent is fully built and already
      // redacted at this point, so returning a prefix is strictly more useful
      // than discarding it. Cut at a newline boundary: the output is
      // line-oriented, and a mid-line cut would leave a dangling partial node.
      if (maxChars != null && pageContent.length > maxChars) {
        var fullLength = pageContent.length;
        var cutAt = pageContent.lastIndexOf("\\n", maxChars);
        if (cutAt <= 0) {
          // No newline at or before maxChars. Clamp so a nonsensical
          // negative maxChars can't become a negative slice end, which would
          // mean "all but the last N characters" and return nearly everything.
          cutAt = Math.max(0, maxChars);
        }
        var focusHint = refId
          ? "use a smaller depth or focus on a more specific child element"
          : "use ref_id or a smaller depth to focus";
        pageContent =
          pageContent.slice(0, cutAt) +
          "\\n[output truncated at " +
          maxChars +
          " of " +
          fullLength +
          " characters. Pass a larger max_chars (default 50000) to see more, or " +
          focusHint +
          ".]";
      }

      return {
        pageContent: pageContent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      };
    } catch (error) {
      console.error("Error in accessibility tree generation:", error);
      throw new Error(
        "Error generating accessibility tree: " +
          (error.message || "Unknown error"),
      );
    }
  };
})();
`;function oe(e){if(!e)return 0;let t=0;for(let n of e.toLowerCase().split(`+`))n===`alt`?t|=1:n===`ctrl`||n===`control`?t|=2:n===`meta`||n===`cmd`||n===`win`||n===`windows`?t|=4:n===`shift`&&(t|=8);return t}function se(e){let t=e.split(`+`),n=t.pop();if(n===``&&(t.pop(),n=`+`),!n)return null;let r=oe(t.join(`+`)),i=n.length===1&&r===0?n:void 0;return{key:n,modifiers:r,text:i}}function ce(e){return e?e.replace(/[\r\n\t"\\]/g,` `).trim().slice(0,200):``}function le(e){return e===!0||e===1||e===`true`||e===`1`||e===`on`||e===`yes`}var ue=10,k={tabId:{type:`string`,description:`Tab to act on within the preview context. Omit for the fronted tab; get ids from tabs_context.`}},de=new Set([`left_click`,`right_click`,`double_click`,`triple_click`,`type`,`key`,`left_click_drag`]),fe={type:`object`,properties:{...k,filter:{type:`string`,enum:[`interactive`,`all`],description:`'interactive' returns only clickable/typable elements; 'all' (default) returns the full tree.`},depth:{type:`number`,description:`Maximum tree depth to traverse (default: 15).`},ref_id:{type:`string`,description:"Restrict the tree to descendants of this `ref_N` (from a previous read_page)."},max_chars:{type:`number`,description:`Maximum characters of output (default: 50000).`}}},pe={type:`object`,properties:{...k,action:{type:`string`,enum:[`left_click`,`right_click`,`type`,`screenshot`,`wait`,`scroll`,`key`,`left_click_drag`,`double_click`,`triple_click`,`zoom`,`scroll_to`,`hover`],description:"The action to perform:\n* `left_click`: Click the left mouse button at the specified coordinates.\n* `right_click`: Click the right mouse button at the specified coordinates to open context menus.\n* `double_click`: Double-click the left mouse button at the specified coordinates.\n* `triple_click`: Triple-click the left mouse button at the specified coordinates.\n* `type`: Type a string of text.\n* `screenshot`: Take a screenshot of the screen.\n* `wait`: Wait for a specified number of seconds.\n* `scroll`: Scroll up, down, left, or right at the specified coordinates.\n* `key`: Press a specific keyboard key.\n* `left_click_drag`: Drag from start_coordinate to coordinate.\n* `zoom`: Take a screenshot of a specific region for closer inspection.\n* `scroll_to`: Scroll an element into view using its element reference ID from read_page or find tools.\n* `hover`: Move the mouse cursor to the specified coordinates or element without clicking. Useful for revealing tooltips, dropdown menus, or triggering hover states."},coordinate:{type:`array`,items:{type:`number`},minItems:2,maxItems:2,description:"(x, y): The x (pixels from the left edge) and y (pixels from the top edge) coordinates. Required for `left_click`, `right_click`, `double_click`, `triple_click`, and `scroll`. For `left_click_drag`, this is the end position."},text:{type:`string`,description:'The text to type (for `type` action) or the key(s) to press (for `key` action). For `key` action: Provide space-separated keys (e.g., "Backspace Backspace Delete"). Supports keyboard shortcuts using the platform\'s modifier key (use "cmd" on Mac, "ctrl" on Windows/Linux, e.g., "cmd+a" or "ctrl+a" for select all). Page zoom shortcuts (e.g. "cmd+=", "ctrl+-", "cmd+0") are not supported - use the `zoom` action to magnify a region of the page instead.'},duration:{type:`number`,minimum:0,maximum:ue,description:`The number of seconds to wait. Required for \`wait\`. Maximum ${ue} seconds.`},scroll_direction:{type:`string`,enum:[`up`,`down`,`left`,`right`],description:"The direction to scroll. Required for `scroll`."},scroll_amount:{type:`number`,minimum:1,maximum:10,description:"The number of scroll wheel ticks. Optional for `scroll`, defaults to 3."},start_coordinate:{type:`array`,items:{type:`number`},minItems:2,maxItems:2,description:"(x, y): The starting coordinates for `left_click_drag`."},region:{type:`array`,items:{type:`number`},minItems:4,maxItems:4,description:"(x0, y0, x1, y1): The rectangular region to capture for `zoom`. Coordinates define a rectangle from top-left (x0, y0) to bottom-right (x1, y1) in pixels from the viewport origin. Required for `zoom` action. Useful for inspecting small UI elements like icons, buttons, or text."},scale:{type:`number`,minimum:.1,maximum:1,description:"For `screenshot` and `zoom` only. Scale factor in [0.1, 1] for the returned image; 1 (default) uses the full image token budget, 0.5 returns an image at half the width and height (~quarter of the tokens). Coordinates are ALWAYS in the full-resolution coordinate frame (reported with every scaled screenshot), never in the scaled image's own pixels."},repeat:{type:`number`,minimum:1,maximum:100,description:"Number of times to repeat the key sequence. Only applicable for `key` action. Must be a positive integer between 1 and 100. Default is 1. Useful for navigation tasks like pressing arrow keys multiple times."},ref:{type:`string`,description:'Element reference ID from read_page or find tools (e.g., "ref_1", "ref_2"). Required for `scroll_to` action. Can be used as alternative to `coordinate` for click actions.'},modifiers:{type:`string`,description:`Modifier keys for click actions. Supports: "ctrl", "shift", "alt", "cmd" (or "meta"), "win" (or "windows"). Can be combined with "+" (e.g., "ctrl+shift", "cmd+alt"). Optional.`}},required:[`action`]},me={type:`object`,properties:{...k,ref:{type:`string`,description:`Element reference ID from the read_page tool (e.g., "ref_1", "ref_2")`},value:{type:[`string`,`boolean`,`number`],description:`The value to set. For checkboxes use boolean, for selects use option value or text, for other inputs use appropriate string/number`}},required:[`ref`,`value`]},he={type:`object`,properties:{...k,url:{type:`string`,description:`The URL to navigate to. Can be provided with or without protocol (defaults to https://). Use "forward" to go forward in history or "back" to go back in history.`},force:{type:`boolean`,description:`If the page shows a "Leave site?" dialog because of unsaved changes, discard those changes and navigate anyway. Defaults to false.`}},required:[`url`]},ge={type:`object`,properties:{...k,query:{type:`string`,description:`Natural language description of what to find (e.g., "search bar", "add to cart button", "product title containing organic")`}},required:[`query`]},_e={type:`object`,properties:{...k,max_chars:{type:`number`,description:`Maximum characters of output (default: 50000).`}}},ve={type:`object`,properties:{...k,action:{type:`string`,enum:[`javascript_exec`],description:"Action to perform (only `javascript_exec` is supported)."},text:{type:`string`,description:`JavaScript expression to evaluate in the page context. Return values are serialized as JSON.`}},required:[`action`,`text`]},ye={type:`object`,properties:{...k,onlyErrors:{type:`boolean`,description:`Return only error-level entries.`},pattern:{type:`string`,description:`Substring filter on message text.`},limit:{type:`number`,description:`Max entries to return (default: 50, max: 200).`}}},be={type:`object`,properties:{...k,urlPattern:{type:`string`,description:`Substring filter on request URL.`},requestId:{type:`string`,description:`If provided, returns the response body for this request instead of listing.`},limit:{type:`number`,description:`Max entries to return when listing (default: 50).`}}},xe={type:`object`,properties:{...k,preset:{type:`string`,enum:[`mobile`,`tablet`,`desktop`]},width:{type:`number`},height:{type:`number`},colorScheme:{type:`string`,enum:[`light`,`dark`]}}},Se=40,Ce=100,we=500,Te=()=>void 0;function Ee(e){Te=e}var De=[`127.0.0.1`,`::1`];function Oe(e){return e?.code===`EADDRINUSE`}function ke(e){return new Promise((t,n)=>{let r=(0,E.createServer)();r.on(`error`,e=>n(e)),r.once(`listening`,()=>{let n=r.address(),i=typeof n==`object`&&n?n.port:e;r.close(()=>t(i))}),r.listen(e,`127.0.0.1`)})}function Ae(e,t){return new Promise(n=>{let r=new E.Socket;r.setTimeout(we),r.once(`connect`,()=>{r.destroy(),n(!0)}),r.once(`error`,()=>{r.destroy(),n(!1)}),r.once(`timeout`,()=>{r.destroy(),Te({host:t,port:e}),n(!1)}),r.connect(e,t)})}async function je(e,t){let n=t?.attempts??(e===0?5:Se),r=t?.retryDelayMs??Ce,i;for(let t=0;t<n;t++){t>0&&await u.l(r);try{let t=await ke(e);for(let e of De)if(await Ae(t,e)){let n=Error(`listen EADDRINUSE: address already in use ${e}:${t}`);throw n.code=`EADDRINUSE`,n}return t}catch(e){if(!Oe(e))throw e;i=e}}throw i}var Me=/[^A-Za-z0-9._+\- ]/g,Ne=32;function Pe(e){return e===`::1`||e===`::`||e===`0.0.0.0`||e.startsWith(`127.`)?!0:e.toLowerCase().startsWith(`::ffff:127.`)}async function Fe(e){let n=r.i();if(n?.listTcpListeners)try{return(await n.listTcpListeners()).filter(t=>t.localPort===e&&Pe(t.localAddr))}catch(e){t.o.warn(`listTcpListeners failed %o`,e);return}}async function Ie(e){let t=await Fe(e);if(!t||t.length===0)return;let n=t.find(e=>e.pid!==0)??t[0],r=n.processName?.replace(Me,``).slice(0,Ne).trim(),i=r?`"${r}" `:``,a=n.pid===0?`unknown PID`:`PID ${n.pid}`,o=new Set(t.map(e=>e.pid)).size-1;return`${i}(${a})${o>0?` and ${o} other process(es)`:``}`}var A=function(e){return e.Starting=`starting`,e.Running=`running`,e.Error=`error`,e.Stopped=`stopped`,e}({});Ee(e=>t.o.warn(`[Preview] port connect-probe timed out %o`,e));var Le=!1;async function Re(e,t=6e4,n=`http`){let r=Date.now(),i=`${n}://${b.c}:${e}`;for(;Date.now()-r<t;){if(!await new Promise(t=>{let n=new E.Socket;n.setTimeout(1e3),n.once(`connect`,()=>{n.destroy(),t(!0)}),n.once(`error`,()=>{n.destroy(),t(!1)}),n.once(`timeout`,()=>{n.destroy(),t(!1)}),n.connect(e,`localhost`)})){await u.l(200);continue}try{let e=new AbortController,t=setTimeout(()=>e.abort(),2e3),n=await T.net.fetch(i,{method:`HEAD`,signal:e.signal,redirect:`manual`});if(clearTimeout(t),n)return!0}catch(e){if(n===`https`&&/CERT|SSL|TLS/i.test(e instanceof Error?e.message:String(e)))return!0}await u.l(300)}return!1}var ze=1e3,Be=class{constructor(e=ze){this.maxSize=e,this.buffer=[],this.head=0,this.count=0}push(e,t){let n={line:e,stream:t,timestamp:new Date().toISOString()};this.count<this.maxSize?(this.buffer.push(n),this.count++):(this.buffer[this.head]=n,this.head=(this.head+1)%this.maxSize)}toArray(){return this.count<this.maxSize?[...this.buffer]:[...this.buffer.slice(this.head),...this.buffer.slice(0,this.head)]}};function j(e){return`Ask the user: does this server need port ${e} specifically (e.g. for OAuth callbacks, webhooks, or CORS)? If yes, set "autoPort": false in .claude/launch.json and free port ${e}. If no, set "autoPort": true in .claude/launch.json AND check the start command for hardcoded port flags (e.g. --port, -p) — remove them so the server uses the assigned port via the PORT environment variable. Then retry.`}function Ve(e,t,n){return t?`Port ${e} is required by this server (autoPort is false) but is in use by preview server "${t.name}" (${t.serverId}). Ask the user if they want to stop "${t.name}" to free port ${e}. If yes, call preview_stop with serverId "${t.serverId}" and retry.`:n?`Port ${e} is required by this server but is in use by ${n}. Stop that process to free port ${e} and try again.`:`Port ${e} is required by this server but is in use by another process. Run \`lsof -i :${e}\` to find what's using it, then free port ${e} and try again.`}async function He(e,n){try{return await je(0)}catch(r){if(t.o.warn(`[Preview] autoPort reassignment failed %o`,{preferredPort:e,occupantServerId:n?.serverId,error:r instanceof Error?r.message:String(r)}),n)throw new M(e,`launch`,`Port ${e} is in use by preview server "${n.name}" (${n.serverId}) and automatic reassignment to a fresh port failed. Retry in a moment, or call preview_stop with serverId "${n.serverId}" to free port ${e} and retry.`);let i=await Ie(e);throw new M(e,`external`,`Port ${e} is in use${i?` by ${i}`:``} and automatic port reassignment failed. Find and stop whatever is using port ${e}, then try again.`)}}async function Ue(e,t,n){let r=P.servers.filter(e=>e.status===`running`||e.status===`starting`);if(r.some(t=>t.port===e)){let i=r.find(t=>t.port===e),a=n!==void 0&&i?.sessionId!==void 0&&i.sessionId!==n;if(t===!0)return He(e,a?void 0:i);throw a?new M(e,`launch`,`Port ${e} is in use by another chat's dev server "${i.name}". preview_stop won't stop another chat's server. `+(t===!1?`Ask the user to stop it from that chat, or to change "autoPort" in .claude/launch.json so this session can use a different port.`:j(e))):t===!1?new M(e,`launch`,Ve(e,i)):new M(e,`launch`,(i?`Port ${e} is in use by preview server "${i.name}" (${i.serverId}). `:`Port ${e} is in use by another preview server. `)+j(e))}try{return await je(e,t===!0?{attempts:1}:void 0)}catch(n){if(t===!0)return He(e);if(n?.code===`EACCES`)throw new M(e,`external`,`Port ${e} is reserved by the OS (${process.platform===`win32`?`a Windows excluded port range, or a privileged port`:`a privileged port below 1024`}) and cannot be bound. Pick a different port in .claude/launch.json, or set "autoPort": true to use an OS-assigned port.`);let r=await Ie(e);throw t===!1?new M(e,`external`,Ve(e,void 0,r)):new M(e,`external`,(r?`Port ${e} is in use by ${r} (not a preview server). `:`Port ${e} is in use by another process (not a preview server). Run \`lsof -i :${e}\` to identify what's using it. `)+j(e))}}var M=class extends Error{constructor(e,t,n){super(n),this.port=e,this.source=t,this.name=`PortInUseError`}};function N(e,t){return{serverId:e.id||``,name:e.config?.name||`unknown`,port:e.port||0,status:e.status||A.Starting,startedAt:e.startedAt?.toISOString()||new Date().toISOString(),cwd:t,sessionId:e.sessionId}}var P=new class extends ne.EventEmitter{constructor(...e){super(...e),this.registry=new Map,this.logBuffers=new Map,this.htmlPreviews=new Map,this.htmlPreviewIdCounter=0,this.previewEnvPromise=null}getPreviewEnv(){return this.previewEnvPromise||(this.previewEnvPromise=y.i(),this.previewEnvPromise.catch(()=>{this.previewEnvPromise=null})),this.previewEnvPromise}get servers(){let e=[];for(let[t,n]of this.registry.entries())for(let r of n.values())e.push(N(r,t));for(let t of this.htmlPreviews.values())e.push(t);return e}getWorktreeServers(e){return this.registry.has(e)||this.registry.set(e,new Map),this.registry.get(e)}emitChange(){this.emit(`change`)}async getConfig(e,t){return(await new S.i(e).getConfigFile(t))?.servers[0]??null}async getAllConfigs(e){return(await new S.i(e).getConfigFile())?.servers??[]}async gatherProjectInfo(e){return new S.i(e).gatherProjectInfo()}async start(e,n,r){let i=(0,ee.randomUUID)();t.o.info(`[Preview] Spawning process %o`,{serverId:i,command:n.command,args:n.args,cwd:(0,w.resolve)(e,n.cwd)});let a=await this.getPreviewEnv(),c=(a.PATH??``).split(w.delimiter),[l]=await s.t(n.command,n.args,c),u=o.i({cmd:l.cmd,args:l.args}),d=(0,C.spawn)(u.cmd,u.args,{cwd:(0,w.resolve)(e,n.cwd),env:{...a,FORCE_COLOR:`1`,...n.env,PORT:String(n.port)},detached:process.platform!==`win32`,windowsHide:!0});t.o.info(`[Preview] Process spawned %o`,{pid:d.pid});let f=new Be;this.logBuffers.set(i,f);let p={id:i,config:n,port:n.port,process:d,status:`starting`,startedAt:new Date,sessionId:r},m=this.getWorktreeServers(e);m.set(i,p),this.emitChange();let h=``,g=!0;d.stdout?.on(`data`,e=>{let t=e.toString();f.push(t,`stdout`)}),d.stderr?.on(`data`,e=>{let t=e.toString();f.push(t,`stderr`),g&&(h+=t)});let _=e=>{S(),x({success:!1,error:e.message})},y=e=>{S(),x(e!==0&&e!==null?{success:!1,error:h||`Process exited with code ${e}`}:{success:!1,error:h||`Process exited unexpectedly during startup`})},x,S,T=await new Promise(e=>{x=e;let t=setTimeout(()=>{e({success:!0})},3e3);S=()=>clearTimeout(t),d.on(`error`,_),d.on(`exit`,y)});if(d.removeListener(`error`,_),d.removeListener(`exit`,y),g=!1,!T.success){let e=f.toArray().map(e=>e.line).join(``).trim(),t=e?`${T.error||`Unknown error`}\n\nOutput:\n${e}`:T.error||`Unknown error`;throw m.delete(i),this.logBuffers.delete(i),this.emitChange(),Error(`Failed to start preview server: ${t}`)}return d.on(`error`,e=>{t.o.error(`[Preview] Process error %o`,{serverId:i,error:e.message}),p.status=`error`,this.emitChange()}),d.on(`exit`,e=>{t.o.info(`[Preview] Process exited %o`,{serverId:i,code:e}),p.status!==`stopped`&&(p.status=`stopped`,v.j(i),m.delete(i),this.logBuffers.delete(i),this.emitChange())}),(async()=>{let e=n.url!==void 0&&b.N(n.url)&&n.url.startsWith(`https:`)?`https`:`http`,r=await Re(n.port,void 0,e);r&&p.status===`starting`?(t.o.info(`[Preview] Server ready (HTTP responding) %o`,{serverId:i}),p.status=`running`,this.emitChange()):!r&&p.status===`starting`&&(t.o.warn(`[Preview] Server did not become ready within timeout %o`,{serverId:i}),p.status=`running`,this.emitChange())})(),N(p,e)}killProcessTree(e,t){return new Promise(n=>{let r=!1,i,a=()=>{r||(r=!0,i&&clearTimeout(i),n())};t&&!t.killed&&t.once(`exit`,a);try{process.platform===`win32`?(0,C.spawn)(`taskkill`,[`/pid`,String(e),`/T`,`/F`],{windowsHide:!0}):process.kill(-e,`SIGTERM`)}catch{a();return}i=setTimeout(()=>{try{process.kill(-e,`SIGKILL`)}catch{}a()},3e3)})}stop(e){if(this.htmlPreviews.has(e))return this.htmlPreviews.delete(e),v.j(e),this.emitChange(),!0;for(let t of this.registry.values()){let n=t.get(e);if(n)return n.status=`stopped`,n.process.pid&&this.killProcessTree(n.process.pid,n.process),v.j(e),t.delete(e),this.logBuffers.delete(e),this.emitChange(),!0}return!1}removeHtmlPreviewsForFile(e,n){let r=e=>process.platform===`win32`?e?.toLowerCase():e,i=r(e);if(n){let t=b.S(n);if(v.mt(t)){let n=(0,D.pathToFileURL)(e).href;v.b(t,n);let r=v.B(t,n);r!==null&&v.y(t,r)}}for(let[a,o]of this.htmlPreviews)if(!(o.externalUrl||r(o.filePath)!==i)&&!(n&&o.sessionId&&o.sessionId!==n)){if(this.htmlPreviews.delete(a),o.previewId){let t=(0,D.pathToFileURL)(o.filePath??e).href;v.b(o.previewId,t);let n=v.B(o.previewId,t);n!==null&&v.y(o.previewId,n)}v.j(a),this.emitChange(),t.o.info(`[Preview] Removed html preview for published artifact %o`,{serverId:a})}}removeHtmlPreview(e){this.htmlPreviews.has(e)&&(this.htmlPreviews.delete(e),this.emitChange())}async stopAndWait(e){for(let t of this.registry.values()){let n=t.get(e);if(n)return n.status=`stopped`,n.process.pid&&await this.killProcessTree(n.process.pid,n.process),v.j(e),t.delete(e),this.logBuffers.delete(e),this.emitChange(),!0}return!1}get(e){for(let t of this.registry.values()){let n=t.get(e);if(n)return n}}getServersForWorktree(e){let t=this.registry.get(e);return t?Array.from(t.values()).map(t=>N(t,e)):[]}stopServersForWorktree(e){let n=this.getServersForWorktree(e),r=0;for(let e of n)this.stop(e.serverId)&&r++;for(let[t,n]of this.htmlPreviews)n.cwd.startsWith(e)&&this.stop(t)&&r++;return r>0&&t.o.info(`[Preview] Stopped servers for worktree %o`,{worktreePath:e,count:r}),r}getRunningForWorktree(e,t){let n=this.registry.get(e);if(n){for(let r of n.values())if((r.status===`running`||r.status===`starting`)&&(t===void 0||r.sessionId===void 0||r.sessionId===t))return N(r,e)}}async isAutoVerifyEnabled(e){try{let t=await new S.i(e).getConfigFile();return t?t.autoVerify!==!1:!1}catch{return!1}}getServerByName(e,t){let n=this.registry.get(e);if(n){for(let r of n.values())if(r.config?.name===t)return N(r,e)}}registerFileTabPreview(e,t,n,r){for(let t of this.htmlPreviews.values())if(t.previewId===r&&t.serverId.startsWith(`html-preview-`))return t.filePath=e,t.name=(0,w.basename)(e),this.touchHtmlPreview(t.serverId),this.emitChange(),t.serverId;this.evictHtmlPreviewsForScope(n,`html`);let i=`${b.a}${Date.now()}-${this.htmlPreviewIdCounter++}`;return this.createHtmlPreviewEntry(i,e,t,{sessionId:n,previewId:r}),i}createHtmlPreviewEntry(e,t,n,r){let i={serverId:e,name:r?.name??(0,w.basename)(t),sessionId:r?.sessionId,previewId:r?.previewId,port:0,status:A.Running,startedAt:new Date().toISOString(),cwd:n??(0,w.dirname)(t),filePath:n===void 0?void 0:t};return this.htmlPreviews.set(e,i),this.emitChange(),i}loadHtmlPreview(e,r,i){if(n.m(e)||r!==void 0&&n.m(r))throw Error(`loadHtmlPreview: UNC path not allowed: ${e}`);this.evictHtmlPreviewsForScope(i?.sessionId??null,`html`);let a=`${b.a}${Date.now()}-${this.htmlPreviewIdCounter++}`;return this.createHtmlPreviewEntry(a,e,r,i),v.E(a,e),t.o.info(`[Preview] Created HTML preview %o`,{serverId:a,filePath:e}),a}refreshBrowserPreviewTab(e,t){let n=this.getBrowserPreviewForSession(e);n&&n.tabId!==t&&(n.tabId=t,this.touchHtmlPreview(n.serverId),this.emitChange())}loadBrowserPreview(e,r){if(n.m(e))throw Error(`loadBrowserPreview: UNC cwd not allowed: ${e}`);let i=g.t()?b.S(r):null,a=i===null?void 0:v.kt(i,e)??void 0,o=this.getBrowserPreviewForSession(r);if(o)return o.tabId=a,this.touchHtmlPreview(o.serverId),this.emitChange(),i??o.serverId;let s=`${b.t}${Date.now()}-${this.htmlPreviewIdCounter++}`,c={serverId:s,name:`Browser`,sessionId:r,port:0,status:A.Running,startedAt:new Date().toISOString(),cwd:e,previewId:i??void 0,tabId:a};return this.htmlPreviews.set(s,c),i===null&&v.w(s,e),this.emitChange(),t.o.info(`[Preview] Created browser preview %o`,{serverId:s}),i??s}getBrowserPreview(e){if(e.startsWith(`browser-preview-`))return this.htmlPreviews.get(e)}getBrowserPreviewForSession(e){if(e!==void 0){for(let t of this.htmlPreviews.values())if(t.serverId.startsWith(`browser-preview-`)&&t.sessionId===e)return t}}claudePageWcvUrl(e){let n=i.Yi(e);n&&!Le&&(Le=!0,t.o.warn(`[Preview] frame-shell dev loop active — loading %s. If the pane shows the full claude.ai app instead of the artifact shell, set VITE_FRAME_CP_URL in apps/claude-ai/.env.local and restart vite.`,n));let r=new URL(n??e);return r.searchParams.set(`surface`,`code`),r.href}loadClaudePagePreview(e,r,a){if(n.m(r))throw Error(`loadClaudePagePreview: UNC cwd not allowed: ${r}`);let o=a.name.toLowerCase(),s=i.ta.test(new URL(e).pathname);for(let t of this.htmlPreviews.values())if(t.sessionId===a.sessionId&&t.externalUrl!==void 0&&t.name.toLowerCase()===o&&i.ta.test(new URL(t.externalUrl).pathname)===s)return(t.cwd!==r||t.externalUrl!==e)&&(t.cwd=r,t.externalUrl=e,this.emitChange()),this.touchHtmlPreview(t.serverId),v.It(t.serverId,this.claudePageWcvUrl(e)),t.serverId;this.evictHtmlPreviewsForScope(a.sessionId,s?`designPage`:`claudePage`);let c=`${b.a}${Date.now()}-${this.htmlPreviewIdCounter++}`,l={serverId:c,name:a.name,externalUrl:e,sessionId:a.sessionId,port:0,status:A.Running,startedAt:new Date().toISOString(),cwd:r};return this.htmlPreviews.set(c,l),this.emitChange(),t.o.info(`[Preview] Registered Claude page preview %o`,{serverId:c}),c}getArtifactView(e){let t=this.htmlPreviews.get(e);if(t?.externalUrl)return i.Zi(t.externalUrl)===null?void 0:t}recreateHtmlPreview(e){let t=this.htmlPreviews.get(e);return!t?.externalUrl||t.previewId!==void 0||!e.startsWith(`html-preview-`)?!1:v.T(e,this.claudePageWcvUrl(t.externalUrl))}touchHtmlPreview(e){let t=this.htmlPreviews.get(e);t&&(this.htmlPreviews.delete(e),this.htmlPreviews.set(e,t))}loadHtmlPreviewContent(e,r,i,a,o){if(a!==``&&n.m(a)||n.m(r))throw Error(`loadHtmlPreviewContent: UNC path not allowed`);this.evictHtmlPreviewsForScope(o,`html`);let s=`${b.a}${Date.now()}-${this.htmlPreviewIdCounter++}`;return this.createHtmlPreviewEntry(s,r,a||void 0,{sessionId:o}),v.D(s,e,i),t.o.info(`[Preview] Created HTML preview from content %o`,{serverId:s,path:r}),s}evictHtmlPreviewsForScope(e,t){let n=e=>{if(!e.externalUrl)return`html`;try{return i.ta.test(new URL(e.externalUrl).pathname)?`designPage`:`claudePage`}catch{return`claudePage`}},r=[],a=[];for(let i of this.servers)i.serverId.startsWith(`html-preview-`)&&((i.sessionId??null)===e&&n(i)===t?r:a).push(i);let o=a.slice(0,Math.max(0,a.length-3));for(let e of[...r,...o])this.stop(e.serverId)}getLogs(e){let t=this.logBuffers.get(e);return t?t.toArray():[]}stopAll(){for(let e of this.registry.values()){for(let t of e.values())if(t.process.pid)try{process.platform===`win32`?(0,C.spawn)(`taskkill`,[`/pid`,String(t.process.pid),`/T`,`/F`],{windowsHide:!0}):process.kill(-t.process.pid,`SIGKILL`)}catch{}e.clear()}this.registry.clear(),this.htmlPreviews.clear(),v.A(),this.logBuffers.clear(),this.emitChange()}};v.dn((e,t)=>P.servers.some(n=>n.sessionId===e&&n.port===t&&(n.status===A.Starting||n.status===A.Running))),v.en(e=>{P.removeHtmlPreview(e)}),v.Qt(e=>P.recreateHtmlPreview(e)),d.n({name:`preview-cleanup`,fn:async()=>{P.stopAll()}});function F(e){return{content:[{type:`text`,text:e}],isError:!0}}var We=`the Browser pane never submits embedded credentials on the user's behalf`;function Ge(e,t,n){if(e.isError||!v.Ct(t))return e;let r=v.lt(t,n),i=`(no page)`;if(r){let e=x.l(r);if(e)i=e;else try{i=`${new URL(r).protocol.replace(/:$/,``)}:`}catch{i=`page content`}}let a=`\n\nTab Context:\n- Executed on tabId: ${n}\n- Available tabs:\n  • tabId ${n}: "${ce(v.st(t,n))}" (${i})`,o=v.W(t,n);o.length>0&&(a+=`\n- Note: the page (or a frame it embeds) requested ${o.join(` and `)} access, which is blocked in the Browser pane; the user was shown a notice. Don't treat device capture as working.`);let s=Array.isArray(e.content)?[...e.content]:[];return s.push({type:`text`,text:a}),{...e,content:s}}async function I(e,t,n){return n===void 0?L(e,t):n}async function L(e,t,n){if(!v.Ct(e))return null;let r=v.lt(e,t);if(!r)return t===`seed`?null:{denied:F(`That Browser tab closed before this read could run; retry.`)};let i=x.l(r);if(i===null||b.P(new URL(r).hostname))return null;let a=await x.r(r);if(a.kind===`epoch-changed`)return{denied:F(`Browser pane state was reset mid-call; retry.`)};if(a.kind===`error`)return{denied:F(`Policy check temporarily unavailable; retry.`)};if(a.kind===`ok`&&x.O(a.category))return{denied:F(`This site is blocked by policy.`)};if(a.kind===`ok`&&x.k(a.category)){if(!n)return{denied:F(`This site requires per-action approval; Browser read tools are not available on it.`)};if(!await n.requestApproval(i))return{denied:F(b.q(`${n.toolName} on ${i}`))};let a=z(e,t);return a===i?{url:r}:{denied:F(`Page navigated from ${i} to ${a} during the approval prompt; retry.`)}}let o=x.l(v.lt(e,t)??``);return o===i?{url:r}:{denied:F(`Page navigated from ${i} to ${o??`(non-http)`} during the policy check; retry.`)}}function R(e,t){return`${e}:${t}`}function z(e,t){return x.l(v.lt(e,t)??``)??`(non-http)`}var B=new Map,V=new Map;function Ke(e,t){if(t!==void 0){let n=R(e,t);B.delete(n),V.delete(n);return}let n=`${e}:`;for(let e of[...B.keys()])e.startsWith(n)&&B.delete(e);for(let e of[...V.keys()])e.startsWith(n)&&V.delete(e)}v.$t(Ke);async function qe(e,t,n,r){let i=await I(e,t,r);if(i&&`denied`in i)return i.denied;let a=n.filter??`all`,o=Number.isFinite(n.depth)?Number(n.depth):15,s=Number.isFinite(n.max_chars)?Number(n.max_chars):5e4,c=n.ref_id??null,l=z(e,t),u=v.K(e,t),d=ae+`;window.__generateAccessibilityTree(${JSON.stringify(a)}, ${JSON.stringify(o)}, ${JSON.stringify(s)}, ${JSON.stringify(c)})`,f;try{f=await v.I(e,t,d)}catch(e){return F(`read_page failed: ${e instanceof Error?e.message:String(e)}`)}let p=f;if(!p||p.error)return F(`read_page failed: ${p?.error??`no result from page`}`);let m=p.pageContent??``,h=z(e,t),g=i&&`url`in i?x.l(i.url)??`(non-http)`:l,_=R(e,t);h===g&&v.K(e,t)===u?B.set(_,{tree:m,origin:h}):B.delete(_);let y=p.viewport?`\n\nViewport: ${p.viewport.width}x${p.viewport.height}`:``;return{content:[{type:`text`,text:(m||`(empty page)`)+y}]}}var Je=100,Ye=10;function H(e,t,n,r){let i=V.get(R(e,t));return!i||i.screenshotWidth===0||i.screenshotHeight===0?null:[Math.max(0,Math.min(Math.round(n*(i.viewportWidth/i.screenshotWidth)),i.viewportWidth-1)),Math.max(0,Math.min(Math.round(r*(i.viewportHeight/i.screenshotHeight)),i.viewportHeight-1))]}var Xe=2;function U(e,t,n,r){let i=V.get(R(e,t));return!i||i.screenshotWidth===0||i.screenshotHeight===0?null:!Number.isFinite(n)||!Number.isFinite(r)||n<0||r<0||n>=i.screenshotWidth+Xe||r>=i.screenshotHeight+Xe?`coordinate (${Math.round(n)}, ${Math.round(r)}) is outside the coordinate frame (${i.screenshotWidth}x${i.screenshotHeight}). Coordinates are pixels in the full-resolution frame — if the page changed, take a new screenshot first.`:null}var Ze=new Set([`screenshot`,`zoom`,`hover`,`scroll`,`scroll_to`]);async function Qe(e,t,n,r,i){let a=n.action,o=r?`\n\n(captured at origin ${r})`:``;if(Ze.has(a)){let n=await I(e,t,i);if(n&&`denied`in n)return n.denied}let s=async()=>{if(n.ref){let r=await at(e,t,n.ref,{forClick:!0});if(`error`in r)return r;let i=[Math.round(r.x),Math.round(r.y)];return{dispatch:i,echo:i}}if(n.coordinate){let r=U(e,t,n.coordinate[0],n.coordinate[1]);if(r)return{error:`${a}: ${r}`};let i=H(e,t,n.coordinate[0],n.coordinate[1]);return i===null?{error:`${a} with \`coordinate\` requires a prior computer{action:"screenshot"} (no screenshot dimensions cached)`}:{dispatch:i,echo:[Math.round(n.coordinate[0]),Math.round(n.coordinate[1])]}}return{error:`${a} requires either \`ref\` or \`coordinate\``}};try{switch(a){case`screenshot`:{let r=_.a(n.scale);if(typeof r==`object`)return{content:[{type:`text`,text:r.error}],isError:!0};let i=await v.vn(e,t,r),a=await v.I(e,t,`({w: window.innerWidth, h: window.innerHeight})`),s=a?.w||1280,c=a?.h||800;V.set(R(e,t),{viewportWidth:s,viewportHeight:c,screenshotWidth:i.frameWidth??i.width,screenshotHeight:i.frameHeight??i.height});let l=r!==void 0&&r<1&&i.frameWidth!==void 0?` `+_.i(r,i.frameWidth,i.frameHeight??0):``;return{content:[{type:`image`,data:i.data,mimeType:`image/jpeg`},{type:`text`,text:`Screenshot size: ${i.width}x${i.height}${l}${o}`}]}}case`left_click`:case`right_click`:case`double_click`:case`triple_click`:{let r=await s();if(`error`in r)return F(r.error);let i=a===`right_click`?`right`:`left`,c=a===`double_click`?2:a===`triple_click`?3:1;return await v.M(e,t,r.dispatch[0],r.dispatch[1],{button:i,clickCount:c,modifiers:oe(n.modifiers)}),{content:[{type:`text`,text:`${a} at (${r.echo[0]}, ${r.echo[1]})${n.ref?` [${n.ref}]`:``}${o}`}]}}case`hover`:{let n=await s();return`error`in n?F(n.error):(await v.yt(e,t,n.dispatch[0],n.dispatch[1]),{content:[{type:`text`,text:`hover at (${n.echo[0]}, ${n.echo[1]})${o}`}]})}case`type`:return typeof n.text==`string`?(await v.Sn(e,t,n.text),{content:[{type:`text`,text:`typed ${n.text.length} chars${o}`}]}):F("`type` requires `text`");case`key`:{if(typeof n.text!=`string`)return F("`key` requires `text`");let r=Number.isFinite(n.repeat)?Math.min(Math.max(Number(n.repeat),1),100):1,i=n.text.split(/\s+/).filter(Boolean);if(i.length>100)return F(`\`key\` accepts at most 100 tokens (got ${i.length})`);let a=v.K(e,t),s=0;for(let n=0;n<r;n++)for(let n of i){let r=se(n);if(r){if(v.K(e,t)!==a)return F(`Page navigated during key sequence; remaining keys not dispatched.`);await v.jt(e,t,r),s++}}return s===0?F(`\`key\` parsed no valid tokens from "${n.text}"`):{content:[{type:`text`,text:`pressed ${n.text} x${r}${o}`}]}}case`scroll`:{if(!n.coordinate)return F("`scroll` requires `coordinate`");let r=U(e,t,n.coordinate[0],n.coordinate[1]);if(r)return F(`scroll: ${r}`);let i=H(e,t,n.coordinate[0],n.coordinate[1]);if(i===null)return F('`scroll` with `coordinate` requires a prior computer{action:"screenshot"}');let a=n.scroll_direction??`down`;if(a!==`up`&&a!==`down`&&a!==`left`&&a!==`right`)return F("`scroll` requires `scroll_direction` of up/down/left/right");let s=(Number.isFinite(n.scroll_amount)?Number(n.scroll_amount):3)*Je,c=a===`left`?-s:a===`right`?s:0,l=a===`up`?-s:a===`down`?s:0;return await v.Wt(e,t,i[0],i[1],c,l),{content:[{type:`text`,text:`scrolled ${a} at (${Math.round(n.coordinate[0])}, ${Math.round(n.coordinate[1])})${o}`}]}}case`scroll_to`:{if(!n.ref)return F("`scroll_to` requires `ref`");let r=await at(e,t,n.ref);return`error`in r?F(r.error):{content:[{type:`text`,text:`scrolled ${n.ref} into view${o}`}]}}case`left_click_drag`:{if(!n.start_coordinate||!n.coordinate)return F("`left_click_drag` requires `start_coordinate` and `coordinate`");let r=U(e,t,n.start_coordinate[0],n.start_coordinate[1])??U(e,t,n.coordinate[0],n.coordinate[1]);if(r)return F(`left_click_drag: ${r}`);let i=H(e,t,n.start_coordinate[0],n.start_coordinate[1]),a=H(e,t,n.coordinate[0],n.coordinate[1]);if(i===null||a===null)return F('`left_click_drag` requires a prior computer{action:"screenshot"}');let s=v.K(e,t);return await v.N(e,t,i[0],i[1],a[0],a[1]),v.K(e,t)===s?{content:[{type:`text`,text:`dragged (${Math.round(n.start_coordinate[0])},${Math.round(n.start_coordinate[1])}) → (${Math.round(n.coordinate[0])},${Math.round(n.coordinate[1])})${o}`}]}:F(`Page navigated during drag; result may be unreliable.`)}case`wait`:{let e=Math.min(n.duration??1,Ye);return await u.l(e*1e3),{content:[{type:`text`,text:`waited ${e}s`}]}}case`zoom`:{let r=_.a(n.scale);if(typeof r==`object`)return{content:[{type:`text`,text:r.error}],isError:!0};let i=await v.vn(e,t,r),a=await v.I(e,t,`({w: window.innerWidth, h: window.innerHeight})`),s=a?.w||1280,c=a?.h||800;V.set(R(e,t),{viewportWidth:s,viewportHeight:c,screenshotWidth:i.frameWidth??i.width,screenshotHeight:i.frameHeight??i.height});let l=r!==void 0&&r<1&&i.frameWidth!==void 0?` `+_.i(r,i.frameWidth,i.frameHeight??0):``;return{content:[{type:`image`,data:i.data,mimeType:`image/jpeg`},{type:`text`,text:`zoom: region crop not yet supported in the Browser pane; full screenshot returned${l}${o}`}]}}default:return F(`Unknown computer action: ${a}`)}}catch(e){return F(`${a} failed: ${e instanceof Error?e.message:String(e)}`)}}async function $e(e,t,n){let r=await v.zt(e,t,n);return r===`denied`?F(b.q(`this domain transition`)):r===`suppressed`?F(`The user has repeatedly declined this domain transition, so the prompt is suppressed and the navigation was not performed. Do not retry; the user can navigate there manually if they want.`):r===`retry`?F(`Could not confirm the domain transition (another permission prompt was open, or the session changed during the prompt) — retry the navigation.`):null}async function et(e,t,n){if(typeof n.url!=`string`)return F("`navigate` requires a string `url`");await g.o();let r=n.url.trim(),a=r.toLowerCase();if(a===`back`||a===`forward`){let n=v.At(e,t,a);if(!n)return F(`no ${a} history`);if(b.C(n))return v.St(e,t,n)?F(`this history entry was opened with credentials the user approved for a single navigation — going ${a} would re-submit them without approval. Navigate to the URL directly to show the consent card again.`):(i.U(`desktop_launch_preview_credentialed_nav`,{action:`refused`,source:`history-tool`}),F(`the ${a} history entry embeds credentials (user:password@); ${We}.`));{let e=x.l(n);if(e!==null&&!b.P(new URL(e).hostname)&&g.a())return F(g.n)}if(v.Ct(e)&&x.l(n)!==null){let e=await x.r(n);if(e.kind===`ok`&&x.O(e.category))return F(`${x.l(n)} is blocked by policy and cannot be opened in the Browser pane.`);if(e.kind===`epoch-changed`)return F(`the Browser pane is no longer open`);if(e.kind===`error`)return F(`site policy check is unavailable — try again shortly`)}let r=await $e(e,t,n);if(r)return r;let o=v.pt(e,t,a,n);return o===`gone`?F(`the Browser pane is no longer open`):o===`changed`?F(`history changed — retry ${a}`):o===`blocked`?F(`navigation ${a} was denied or failed`):(await v.l(e,t),{content:[{type:`text`,text:`navigated ${a}`}]})}let o=b._(r);if(o!==null){if(`invalid`in o)return F(b.E(r));let t=v.X(e),n=b.W(e);if(t===null||n===null)return F(`the Browser pane has no open project folder to open files from`);if(g.a())return F(g.r);let i;try{i=await $(o.path,n,t,{initiator:`agent`,provenance:`explicit`})}catch{i=null}if(i===null)return F(`couldn't open ${r} — the file may be missing, unreadable, or the user declined access`);if(!i.startsWith(`html-preview-`)){let r=v.$(e)??t;P.registerFileTabPreview(b.z(o.path,r),r,n,i)}return v.Bt(i,n),{content:[{type:`text`,text:`opened ${r} in the preview pane (files outside the project folder render as static snapshots)`}]}}let s=b.V(r);if(`error`in s)return i.U(`desktop_launch_model_nav_refused`,{reason:s.reason,source:`navigate`}),F(s.error);let c=s.url;{let e=x.l(c);if(e!==null&&!b.P(new URL(e).hostname)&&g.a())return F(g.n)}let l=!1;if(x.l(c)!==null&&b.C(c)){let t=await x.r(b.K(c));if(t.kind===`epoch-changed`)return F(`the Browser pane is no longer open`);if(t.kind===`error`)return F(`site policy check is unavailable — try again shortly`);if(x.O(t.category))return F(`${x.l(c)} is blocked by policy and cannot be opened in the Browser pane.`);let n=await x.h(e,x.l(c)??`(target)`);if(n===`denied`)return i.U(`desktop_launch_preview_credentialed_nav`,{action:`declined`,source:`navigate-tool`}),F(b.q(`submitting the sign-in credentials in this link`));if(n!==`allowed`)return i.U(`desktop_launch_preview_credentialed_nav`,{action:`refused`,source:`navigate-tool`}),F(`the URL embeds credentials (user:password@); ${We} — navigate without them and let the user sign in on the page.`);i.U(`desktop_launch_preview_credentialed_nav`,{action:`consented`,source:`navigate-tool`}),l=!0}let u=await $e(e,t,b.K(c));if(u)return u;try{let n=await v.Dt(e,t,c,`mcp-tool`,{credentialConsentGranted:l});return n===`denied-by-user`?F(b.q(`opening ${x.l(c)??`(target)`} in the Browser pane`)):n===`blocked`?F(g.a()?g.n:`${x.l(c)??`(target)`} is blocked by policy and cannot be opened in the Browser pane.`):n?{content:[{type:`text`,text:`navigated to ${x.l(c)??`(target)`}`}]}:v.C(e,t)?{content:[{type:`text`,text:`${x.l(c)??`(target)`} responded with a file download instead of a page; the user was shown a save dialog and the Browser pane did not navigate. Do not retry this URL.`}]}:F(`navigation to ${x.l(c)??`(target)`} was denied or failed`)}catch(e){return F(`navigate failed: ${e instanceof Error?e.message:String(e)}`)}}var tt=20;async function nt(e,t,n,r){if(typeof n.query!=`string`)return F("`find` requires a string `query`");let i=await I(e,t,r);if(i&&`denied`in i)return i.denied;let a=R(e,t),o=B.get(a);if(!o)return F(`no read_page tree cached; call read_page first`);let s=z(e,t);if(o.origin!==s)return B.delete(a),F(`cached read_page tree was for ${o.origin}, page is now ${s}; call read_page first`);let c=n.query.toLowerCase(),l=o.tree.split(`
`),u=[];for(let e of l)if(e.toLowerCase().includes(c)&&/\[ref_\d+\]/.test(e)&&(u.push(e.trim()),u.length>=tt))break;return u.length===0?{content:[{type:`text`,text:`No matches for "${n.query}".`}]}:{content:[{type:`text`,text:`Found ${u.length} match(es) for "${n.query}":\n${u.map(e=>`- ${e}`).join(`
`)}`}]}}async function rt(e,t,n,r){let i=await I(e,t,r);if(i&&`denied`in i)return i.denied;let a=Number.isFinite(n.max_chars)?Number(n.max_chars):5e4,o=JSON.stringify(a),s=`(function() {
    var selectors = ["article", "main", '[class*="articleBody"]', '[role="main"]', "#content"];
    var best = document.body, bestLen = 0;
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && el.innerText && el.innerText.length > bestLen) {
        best = el; bestLen = el.innerText.length;
      }
    }
    var text = (best.innerText || "").replace(/\\n{3,}/g, "\\n\\n").trim();
    return {
      title: document.title,
      url: location.href,
      tag: best.tagName.toLowerCase(),
      text: text.slice(0, ${o}),
      truncated: text.length > ${o}
    };
  })()`;try{let n=await v.I(e,t,s);if(!n)return F(`get_page_text: no result from page`);let r=x.l(n.url)??`(non-http)`,i=ce(n.title),o=typeof n.tag==`string`&&/^[a-z][a-z0-9]{0,15}$/.test(n.tag)?n.tag:`body`,c=n.truncated?`\n\n[truncated to ${a} chars]`:``;return{content:[{type:`text`,text:`Title: ${i}\nURL: ${r}\nSource element: <${o}>\n---\n${n.text}${c}`}]}}catch(e){return F(`get_page_text failed: ${e instanceof Error?e.message:String(e)}`)}}async function it(e,t,n,r){let i=typeof n.value==`boolean`?n.value?`true`:`false`:String(n.value),a=le(n.value),o=`(function() {
    var map = window.__claudeElementMap;
    if (!map) return { ok: false, error: "ref map not initialized; call read_page first" };
    var entry = map[${JSON.stringify(n.ref)}];
    var el = entry && typeof entry.deref === "function" ? entry.deref() : entry;
    if (!el || !el.isConnected) return { ok: false, error: "ref not found or stale: " + ${JSON.stringify(n.ref)} };
    el.focus();
    var tag = el.tagName.toLowerCase();
    var v = ${JSON.stringify(i)};
    function nativeSet(proto, prop, target, value) {
      var d = Object.getOwnPropertyDescriptor(proto, prop);
      if (d && d.set) { d.set.call(target, value); } else { target[prop] = value; }
    }
    if (tag === "select") {
      var opt = Array.from(el.options).find(function(o) { return o.value === v || o.text === v; });
      if (!opt) return { ok: false, error: "option not found" };
      nativeSet(window.HTMLSelectElement.prototype, "value", el, opt.value);
    } else if (el.type === "radio") {
      nativeSet(window.HTMLInputElement.prototype, "checked", el, true);
    } else if (el.type === "checkbox") {
      nativeSet(window.HTMLInputElement.prototype, "checked", el, ${JSON.stringify(a)});
    } else if (tag === "input" || tag === "textarea") {
      var proto = tag === "textarea" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      nativeSet(proto, "value", el, v);
    } else if (el.isContentEditable) {
      el.textContent = v;
    } else {
      return { ok: false, error: "element is not fillable" };
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return { ok: true };
  })()`;try{let i=await v.I(e,t,o);if(!i?.ok)return F(`form_input failed: ${i?.error??`no result from page`}`);let a=r?`\n\n(captured at origin ${r})`:``;return{content:[{type:`text`,text:`filled ${n.ref} with value${a}`}]}}catch(e){return F(`form_input failed: ${e instanceof Error?e.message:String(e)}`)}}async function at(e,t,n,r){let i=await v.I(e,t,`(function() {
    var map = window.__claudeElementMap;
    if (!map) return { error: "ref map not initialized; call read_page first" };
    var entry = map[${JSON.stringify(n)}];
    if (!entry) return { error: "ref not found: " + ${JSON.stringify(n)} };
    var el = typeof entry.deref === "function" ? entry.deref() : entry;
    if (!el || !el.isConnected) return { error: "ref is stale (element removed): " + ${JSON.stringify(n)} };
    el.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
    var r = el.getBoundingClientRect();
    // Layout viewport, not window.innerWidth/Height: with classic
    // (layout-consuming) scrollbars (Windows/Linux Chromium), innerWidth
    // includes the ~15-17px scrollbar gutter where no page content is
    // hit-testable — a click clamped to innerWidth-1 lands on the
    // scrollbar track and silently no-ops. Per CSSOM View, the element
    // whose clientWidth/Height report the layout viewport (excluding the
    // gutter) is documentElement in standards mode and body in quirks
    // mode — the quirks-mode body special case holds regardless of
    // overflow, which matters because scrollingElement goes null in
    // quirks mode when both html and body are potentially scrollable
    // (and for some detached/XML documents), so a bare
    // scrollingElement-or-documentElement fallback would reproduce the
    // quirks-mode defect there. The min guards the degenerate 0 report.
    var se =
      document.scrollingElement ||
      (document.compatMode === "BackCompat"
        ? document.body
        : document.documentElement) ||
      document.documentElement;
    var vw = Math.min(window.innerWidth, se.clientWidth || window.innerWidth);
    var vh = Math.min(window.innerHeight, se.clientHeight || window.innerHeight);
    return { x: r.x + r.width / 2, y: r.y + r.height / 2,
             left: r.left, top: r.top, right: r.right, bottom: r.bottom,
             vw: vw, vh: vh };
  })()`);return i?`error`in i?i:r?.forClick&&!(i.right>0&&i.left<=i.vw-1&&i.bottom>0&&i.top<=i.vh-1)?{error:`ref ${n} is entirely outside the viewport (center (${Math.round(i.x)}, ${Math.round(i.y)})) — likely hidden or off-canvas, so a click cannot reach it. Interact with what opens it first, or re-run read_page and pick a visible element.`}:{x:Math.max(0,Math.min(i.x,i.vw-1)),y:Math.max(0,Math.min(i.y,i.vh-1))}:{error:`ref resolution returned null`}}function ot(e){return`No .claude/launch.json found. Create ${w.join(e,`.claude`,`launch.json`)} with this format:\n`+b.s+`
`+b.o+` Then call preview_start with the server name.`}function st(e,t){let n=w.join(t,`.claude`,`launch.json`);switch(e.status){case`not-found`:return ot(t);case`unreadable`:return`Found ${n} but reading it failed with ${e.code}: ${e.message}. The path exists — do not recreate it.`;case`parse-error`:return`Found ${n} but it could not be parsed: ${e.detail}. Fix the file to match this format:
`+b.s+`
`+b.o;case`no-valid-configs`:{if(e.configurationCount===0)return`Found ${n} but it contains no configurations. Expected format:
`+b.s+`
`+b.o;let t=e.configurationCount,r=`Found ${n} with ${t} ${t===1?`configuration`:`configurations`}, but none could be used.`;return e.malformedCount>0&&(r+=` ${e.malformedCount} of them ${e.malformedCount===1?`has`:`have`} a supported shape but a malformed field${S.o(e.malformedReasons)}.`),e.malformedCount<t&&(r+=` Supported configurations need "runtimeExecutable" (optionally with "runtimeArgs"), "program", or a "url" to attach to an already-running server — VS Code "command" / "node-terminal" style entries are not supported.`),r+` Expected format:
`+b.s+`
`+b.o}case`name-not-found`:return`No matching server in ${n}. Available servers: ${e.available.join(`, `)}.`}}async function ct(e,n,r){let i=e.name;if(!n)return{action:`deny`,message:`This session has no working directory, so dev-server configurations can't be resolved. Ask the user to open a project folder, or pass a url to preview_start if browser preview is enabled.`};let a=await new S.i(n).getConfig();if(a.status!==`ok`)return{action:`deny`,message:st(a,n)};let o=a.config.servers;if(o.length>1&&!i)return{action:`deny`,message:`Multiple server configurations found: ${W(o.map(e=>e.name))}. Specify which server to start by passing the name parameter (e.g., preview_start with name: "frontend" or name: "backend"). To start all servers, call preview_start separately for each.`};let s=null;if(i){if(s=o.find(e=>lt(e.name,i))??null,!s&&a.malformedNames.some(e=>lt(e,i))){let e=W(o.map(e=>e.name)),t=Object.keys(a.malformedReasons).find(e=>lt(e,i)),n=t===void 0?` Check its field types ("runtimeArgs" must be an array of strings, "port" a number).`:` ${a.malformedReasons[t]}`;return{action:`deny`,message:`"${b.D(i)}" exists in .claude/launch.json but its entry could not be used.${n} Usable servers: ${e}.`}}!s&&o.length===1&&a.malformedNames.length===0&&(s=o[0],t.o.info(`[Preview] Name "%s" not found, using only config "%s"`,i,s.name))}else s=o[0];if(!s){let e=W(o.map(e=>e.name)),t=b.D(i??``);return{action:`deny`,message:`No server named "${t}" found in .claude/launch.json. Available servers: ${e}. Pass one of these names, or add a new configuration for "${t}".${a.malformedNames.length>0?` Note: ${W(a.malformedNames)} also exist(s) in the file but could not be used.${S.o(a.malformedReasons)}`:``}`}}let c={...s};if(c.url!==void 0&&c.command===void 0)return{action:`attach`,config:c};let l=P.getServersForWorktree(n).filter(e=>(e.status===`running`||e.status===`starting`)&&(r===void 0||e.sessionId===void 0||e.sessionId===r));if(l.length>0){let e=l.find(e=>e.name.toLowerCase()===c.name.toLowerCase());if(e)return t.o.info(`[Preview] Reusing server by name match (name=%s)`,e.name),{action:`reuse`,server:{serverId:e.serverId,port:e.port,name:e.name},config:c};let n=l.find(e=>e.port===c.port);if(n&&!i)return t.o.info(`[Preview] Reusing server by port match (port=%d)`,n.port),{action:`reuse`,server:{serverId:n.serverId,port:n.port,name:n.name},config:c};if(l.length===1&&o.length===1&&!i){let e=l[0];return t.o.info(`[Preview] Reusing single running server (port/name mismatch tolerated)`,{requested:{name:c.name,port:c.port},running:{name:e.name,port:e.port}}),{action:`reuse`,server:{serverId:e.serverId,port:e.port,name:e.name},config:c}}}return{action:`start`,config:c}}function W(e){return e.map(e=>`"${b.D(e)}"`).join(`, `)}function lt(e,t){let n=t.toLowerCase();return e.toLowerCase()===n||b.D(e).toLowerCase()===n}var ut=5,dt=3;function ft(e){return e.includes(`EADDRINUSE`)||e.toLowerCase().includes(`address already in use`)}function pt(e){let t=e.match(/port[:\s]+(\d+)/i),n=t?t[1]:`configured`;return`Port ${n} is already in use. The server appears to have a hardcoded port that ignores the PORT environment variable. Either:\n1. Free port ${n} — run \`lsof -i :${n}\` to find what's using it, or call preview_list to check for running preview servers\n2. Remove the hardcoded port from the start script (e.g. --port ${n} in package.json) and let launch.json control it via the PORT environment variable`}function mt(e,n,r){if(e.url===void 0)return;let i=b.U(e.url,n,r),a=b.N(i);if(a&&!b.A(i)){t.o.error(`[Preview] non-bare localhost config url reached the seed path — parser boundary drift; dropping the url`);return}return{url:i,isLocal:a}}function G(e,t){i.U(`desktop_launch_preview_config_url`,{url_class:e,outcome:t,source:`launch-config`})}async function ht(e,n,r,i,a){let o=e=>(G(r.isLocal?`local`:`external`,e),{url:r.url,outcome:e});if(e===null)return o(`skipped-gate-off`);if(n===void 0)return o(`failed`);if(r.isLocal)return o(`seeded`);if(!i)return v.Dt(e,n,r.url,`mcp-tool`).then(e=>{e!==!0&&a?.()}).catch(e=>{t.o.warn(`[Preview] config-url navigation failed: %s`,e.code??e.name),a?.()}),o(`dispatched`);let s=await v.Dt(e,n,r.url,`mcp-tool`);return s!==!0&&a?.(),o(_t(s))}function gt(e,t){return e===null||t===void 0||t.isLocal?null:v.z(e,t.url)}function _t(e){return e===!0?`navigated`:e===!1?`failed`:e}async function vt(e,n,r,i){let a=e.url;if(a===void 0)throw Error(`Attach configuration has no url.`);if(!g.t())throw G(`attach`,`skipped-gate-off`),Error(g.i()&&!b.N(a)?g.n:`"${b.D(e.name)}" attaches to a URL, which needs the in-app Browser preview — it is not enabled on this install. Add a command ("runtimeExecutable"/"program") to start the server instead, which previews at http://localhost:<port>.`);if(r===void 0)throw G(`attach`,`failed`),Error(`"${b.D(e.name)}" attaches to a URL, which requires a session.`);if(b.N(a)&&!b.A(a))throw G(`attach`,`failed`),Error(`"${b.D(e.name)}" has a localhost "url" with a path or query, which this build should have rejected at config parsing. Change "url" to the server's origin (for example "https://localhost:8443/") and report this message if the config file already looks correct.`);let o=b.S(r),s=v.z(o,a),c,l;if(s==null?(c=P.loadBrowserPreview(n,r),l=P.getBrowserPreviewForSession(r)?.tabId):(c=o,l=s,P.refreshBrowserPreviewTab(r,s)),l===void 0)throw G(`attach`,`failed`),Error(b.f);v.Ft(c,l,a);let u;return i?u={url:a,outcome:_t(await v.Dt(c,l,a,`mcp-tool`))}:(v.Dt(c,l,a,`mcp-tool`).catch(e=>t.o.warn(`[Preview] attach navigation failed: %s`,e.code??e.name)),u={url:a,outcome:`dispatched`}),G(`attach`,u.outcome),{serverId:c,port:e.port,name:e.name,reused:!1,previewId:c,tabId:l,configUrl:u}}async function yt(e,n,r,i){let a=i?.awaitConfigUrlNavigation??!0;if(e.action===`deny`)throw Error(e.message);if(e.action===`attach`)return vt(e.config,n,r,a);let o=g.t()&&r!==void 0?b.S(r):null;if(e.action===`reuse`){let r=P.getServersForWorktree(n).find(t=>t.serverId===e.server.serverId);if(r&&(r.status===`running`||r.status===`starting`)){let t=mt(e.config,e.config.port,r.port),i=t!==void 0&&t.isLocal?t.url:`http://${b.c}:${r.port}`,s=o===null?v.i:gt(o,t)??v.z(o,i)??v.kt(o,n,i)??void 0;return{serverId:r.serverId,port:r.port,name:r.name,reused:!0,previewId:o??r.serverId,tabId:s,configUrl:t===void 0?void 0:await ht(o,s,t,a)}}if(i?.allowDeadReuseRespawn!==!0)throw t.o.warn(`[Preview] Server %s no longer running — refusing silent respawn`,e.server.serverId),new b.l(`The "${b.D(e.server.name)}" server is no longer running. Call preview_start again to start it.`);t.o.warn(`[Preview] Server %s no longer running, starting fresh`,e.server.serverId)}let s=e.config,c=s.command;if(!c)throw Error(`The resolved launch configuration has no command. Check the configuration's "runtimeExecutable" or "program" field in .claude/launch.json, then try again.`);let l=w.default.resolve(n,s.cwd);if(l!==n&&!l.startsWith(n+w.default.sep))throw Error(`cwd must be a relative path within the project root.`);let u={...s,command:c,cwd:l},d=P.getServersForWorktree(n);if(d.length>=ut){t.o.info(`[Preview] Max servers reached for worktree %o`,{workingDirectory:n,count:d.length});let e=d.filter(e=>e.sessionId!==void 0&&e.sessionId!==r).length;throw Error(r!==void 0&&e>0?`Maximum ${ut} dev servers per folder reached; ${e} belong to other chats. Stop one of this chat's servers, or ask the user to stop one from the other chat.`:`Maximum ${ut} servers per worktree. Stop one first.`)}await b.m(s,n,r,i?.userInitiated);let f=await Ue(u.port,u.autoPort,r),p={...u,port:f};f!==u.port&&(p.args=bt(u.args,f));let m,h=p.url===void 0?p:{...p,url:new URL(p.url).origin};for(let e=1;e<=dt;e++){t.o.info(`[Preview] Starting server with config %o`,{config:h,attempt:e});let i;try{i=await P.start(n,p,r)}catch(n){if(m=n instanceof Error?n:Error(String(n)),t.o.warn(`[Preview] Attempt %d/%d failed: %s`,e,dt,m.message),e<dt)continue;throw m}let c=mt(s,u.port,f),l,d;if(o!==null){let e=c!==void 0&&c.isLocal?c.url:`http://${b.c}:${f}`;d=gt(o,c)??v.z(o,e)??v.kt(o,n,e)??void 0;let t=d,r=()=>{if(t===void 0)return;let r=()=>{let a=P.getServersForWorktree(n).find(e=>e.serverId===i.serverId);a?.status===`running`?(P.removeListener(`change`,r),v.Dt(o,t,e,`url-bar`)):(!a||a.status===`stopped`||a.status===`error`)&&P.removeListener(`change`,r)};P.on(`change`,r),r()};(c===void 0||c.isLocal)&&r(),c!==void 0&&(l=await ht(o,d,c,a,r))}else{c!==void 0&&(l=await ht(null,void 0,c,a));let e=v.ht(v.Vt(n)),t=v.et()!==`none`;v.O(i.serverId,f,e,t),d=v.i;let r=()=>{let e=P.getServersForWorktree(n).find(e=>e.serverId===i.serverId);e?.status===`running`?(P.removeListener(`change`,r),v.S(i.serverId)):(!e||e.status===`stopped`||e.status===`error`)&&P.removeListener(`change`,r)};P.on(`change`,r),r()}return{serverId:i.serverId,port:i.port,name:i.name,reused:!1,previewId:o??i.serverId,tabId:d,configUrl:l}}throw m??Error(`Failed to start preview server after retries`)}function bt(e,t){let n=[...e];for(let e=0;e<n.length;e++){let r=n[e];(r===`--port`||r===`-p`)&&e+1<n.length?(n[e+1]=String(t),e++):(r.startsWith(`--port=`)||r.startsWith(`-p=`))&&(n[e]=`${r.slice(0,r.indexOf(`=`)+1)}${t}`)}return n}function xt(e){return b.L(e)&&v.mt(e)}async function K(e,n,r){if(!g.t()||!xt(e))return n;try{return await r()}catch(r){return t.o.warn(`[Preview] remote read-tier sink failed: %o`,{serverId:e,error:r.code??(r instanceof Error?r.name:`unknown`)}),n}}async function q(e,t){if(await g.o(),g.a())return null;let n=await L(e,t);if(n&&`denied`in n)return null;let r=v.it(e,t);return r===null?null:{approvedOrigin:x.l(v.lt(e,t)??``),commitEpoch:v.at(e,t),subframeCount:r.length,subframeEpoch:v.rt(e,t)}}function J(e,t,n){if(x.l(v.lt(e,t)??``)!==n.approvedOrigin||v.at(e,t)!==n.commitEpoch||v.rt(e,t)!==n.subframeEpoch)return!1;let r=v.it(e,t);return r===null?!1:r.length===n.subframeCount}function St(e){if(!f.a()?.isKnownSessionCwd(e))throw Error(`Launch cwd is not owned by any session`)}function Y(e){return ie(e,`Launch`)}function Ct(e){let t=b.W(e);if(t===null)throw Error(`Preview id is not session-scoped.`);v.c(t)}var wt=new Map,X=new Map,Z=new Set([`.html`,`.htm`,`.svg`]),Tt=new Set([...b.r,...Z]);async function Et(e,t,n){return n===void 0?!1:await c.i(t,n)===!1?t===w.default.resolve(e):!0}function Dt(e,t){let n=(0,w.extname)(e).toLowerCase();return b.r.has(n)||b.i.has(n)||t&&/\.(html?|svg)$/i.test(e)}var Ot=!1,Q=new Set;async function kt(e){let n=i.Ji();if(n&&i.Zi(e)!==null)try{if(!Ot){Ot=!0;for(let e of i.Mi)for(let t of[`sessionKey`,`lastActiveOrg`])await T.session.defaultSession.cookies.remove(`https://${e}`,t).catch(()=>void 0)}let r=new URL(e),a=r.host.endsWith(`.ant.dev`),o=i.Rt()===`production`&&process.env.OAUTH_ENVIRONMENT===`production`;if(!(a?!o:o)){t.o.info(`[Preview] Skipping dev cookie mirror (credential env mismatch) %o`,{host:r.host});return}let s=[{name:`sessionKey`,httpOnly:!0},{name:`lastActiveOrg`,httpOnly:!1}],c=0;for(let{name:e,httpOnly:a}of s){let o=i.on(await T.session.defaultSession.cookies.get({url:n,name:e})),s=i.on(await T.session.defaultSession.cookies.get({url:r.origin,name:e})),l=`${r.origin}:${e}`;if(!o){s&&Q.has(l)&&(await T.session.defaultSession.cookies.remove(r.origin,e),Q.delete(l),t.o.info(`[Preview] Removed orphaned mirrored cookie %o`,{host:r.host,name:e}));continue}s?.value!==o.value&&(await T.session.defaultSession.cookies.set({url:r.origin,name:e,value:o.value,secure:!0,httpOnly:a,sameSite:o.sameSite??`lax`}),Q.add(l),c++)}c>0&&t.o.info(`[Preview] Mirrored dev session cookies for claude page %o`,{host:r.host,mirrored:c})}catch(e){t.o.warn(`[Preview] Dev session cookie mirror failed %o`,{err:e})}}async function At(e,t,n,r){let i=w.default.resolve(t,e);if(c.U(i))return{allowed:!1};let a=[t,...await x.a(n)];if(c.n(i,a)){let t=await c.a(e,a,O);if(t!==!1)return{allowed:!0,consentedReal:t,via:`containment`};let i=await c.p(e,O);if(i===!1)return{allowed:!0,consentedReal:null,via:`containment`};if(!r)return{allowed:!1};let o=await x.m(e,i,{sessionId:n});return o===`card_allowed`||o===`auto_allowed`?{allowed:!0,consentedReal:i,via:o===`card_allowed`?`card`:`auto`}:{allowed:!1}}let o=await c.a(e,a,O);if(o!==!1)return{allowed:!0,consentedReal:o,via:`containment`};if(!r)return{allowed:!1};let s=await c.p(e,O),l=s===!1?null:s,u=await x.m(e,l,{sessionId:n});return u===`card_allowed`||u===`auto_allowed`?{allowed:!0,consentedReal:l,via:u===`card_allowed`?`card`:`auto`}:{allowed:!1}}async function $(e,r,a,o){if(/^file:/i.test(e))try{let{hostname:t}=new URL(e);if(t!==``&&t!==`localhost`)return null;e=(0,D.fileURLToPath)(e)}catch{return null}e=b.z(e,a);let s=e=>{if(o?.initiator===`agent`)return null;throw Error(`loadHtmlPreview: ${e}`)};if(n.m(e))return s(`UNC path not allowed`);let u=(0,w.extname)(e).toLowerCase(),d=b.i.has(u)||b.r.has(u)||Z.has(u)||v.n.has(u),f=null,m=null,h=o?.initiator===`agent`&&o.provenance===`incidental`;if(o?.initiator===`agent`&&a===void 0)return null;if(o?.initiator===`agent`&&!h&&a!==void 0){let t=g.t()&&r!==void 0?d:b.r.has(u)||b.i.has(u),n=await At(e,a,r,t);if(!n.allowed)return null;f=n.consentedReal,m=n.via}let _=o?.initiator&&r!==void 0?r+`:`+o.initiator+`:`+e:r,y=(X.get(_)??0)+1;X.set(_,y);let S=await c.p(e,O);if(X.get(_)!==y||S===!1)return null;let C=await(0,te.stat)(S).catch(()=>null);if(X.get(_)!==y||!C?.isFile())return null;if(g.t()&&r!==void 0&&a!==void 0){await Y(a),v.c(r);let n=await c.i(e,a,O),u=n===!1?d?S:!1:n;if(X.get(_)!==y)return null;let g=u===!1?``:(0,w.extname)(u).toLowerCase(),T=u===!1?null:b.i.has(g)?`plugin`:Z.has(g)||v.n.has(g)?`content`:n===!1?b.r.has(g)?`pinned`:null:Tt.has(g)?`plain`:null;if(n===!1&&d&&T===null)return s(`out-of-worktree resolution is not previewable`);if(o?.initiator===`agent`&&n===!1&&u!==!1&&T!==null&&u!==f){if(h){if(!await Et(e,u,a))return null}else{let t=await x.m(e,u,{sessionId:r});if(t!==`card_allowed`&&t!==`auto_allowed`)return null;m=t===`card_allowed`?`card`:`auto`}if(X.get(_)!==y)return null}if(u!==!1&&T!==null){let c=b.S(r);if(v.F(c,a)===null)return T===`content`?s(`no containment root for a content tab`):o?.initiator===`agent`&&!Dt(u,n!==!1)?null:P.loadHtmlPreview(o?.initiator===`agent`?u:w.default.normalize(e),void 0,{sessionId:r});let d;if(T===`content`){if(C.size>524288)return s(`source exceeds the content tab size limit`);let e=await v.u(u,{refuseMultiLink:o?.initiator===`agent`&&m===`auto`,interactive:n!==!1&&Z.has(g)});if(X.get(_)!==y||e===null)return null;d=e}else d=(0,D.pathToFileURL)(u).href;let f=T!==`plain`,h=v.B(c,d,{requirePinned:f});if(h!==null)return v.Jt(c,h),o?.initiator===`agent`&&v.Ut(c,h),f?v.Rt(c,h):v.Lt(c,h,u),T===`plugin`&&i.U(`desktop_launch_preview_pdf_file_tab`,{}),c;T===`content`&&v.b(c,(0,D.pathToFileURL)(u).href);let x=v.kt(c,a,d,{source:o?.initiator===`agent`?`agent-file`:void 0,filePreview:T===`plugin`?`plugin`:f?`pinned`:void 0,contentSourcePath:T===`content`?u:void 0,contentInteractive:T===`content`&&n!==!1&&Z.has(g)?!0:void 0});if(x===null){if(o?.initiator===`agent`)return t.o.info(`[Preview] agent file preview hit the tab cap %o`,{sessionId:r}),null;p.n(`Close a tab to open another file.`,l.j.Error,{messageForLogging:`preview_file_tab_cap`})}else T===`plugin`?i.U(`desktop_launch_preview_pdf_file_tab`,{}):T===`plain`&&v.gn(c,x,u);return c}}if(o?.initiator===`agent`){let t=a===void 0?!1:await c.i(e,a,O),n=t===!1?await c.p(e,O):t;if(n===!1||!Dt(n,t!==!1))return null;if(t===!1&&n!==f)if(h){if(!await Et(e,n,a))return null}else{let t=await x.m(e,n,{sessionId:r});if(t!==`card_allowed`&&t!==`auto_allowed`)return null}return X.get(_)===y?P.loadHtmlPreview(n,void 0,{sessionId:r}):null}return P.loadHtmlPreview(w.default.normalize(e),void 0,{sessionId:r})}function jt(){return{isAvailable:()=>!0,isJitlessForced:()=>g.t()&&v.wn(),startBrowserPreview:async(e,t)=>g.t()?(await Y(e),v.c(t),P.loadBrowserPreview(e,t)):null,ensureRemoteBlankPreview:async e=>{if(!g.t())return null;let n=b.g(e);if(n===null)return t.o.warn(`[Preview] Remote blank preview refused (malformed session id)`),null;let r=b.x(n);return v.Y(r)===null?null:r},startRemoteBrowserPreview:async(e,n,r)=>{if(!g.t())return null;let i=b.g(e);if(i===null)return t.o.warn(`[Preview] Remote preview refused (malformed session id)`),null;if(!b.k(n))return t.o.warn(`[Preview] Remote preview seed refused (not an external http(s) URL)`),null;let a=b.x(i);if(v.Y(a)===null)return null;if(r===!0){let e=v.z(a,n);if(e!==null)return v.Dt(a,e,n,`transcript-link`),v.Jt(a,e),a}else{let e=v.ct(a);if(e!==null&&x.l(e)!==null){let e=v.H(a),t=e.startsWith(`popup-`)?v.ot(a)?.tabs.find(e=>!e.tabId.startsWith(`popup-`))?.tabId??null:e;if(t===null)return null;for(let e of v.ot(a)?.tabs??[])e.tabId!==`seed`&&e.tabId!==t&&v.y(a,e.tabId);return v.Dt(a,t,n,`transcript-link`),t!==e&&v.Jt(a,t),a}}if(v.kt(a,``,n,{source:`transcript-link`})!==null)return a;let o=v.ct(a);if(o!==null&&x.l(o)!==null){let e=v.H(a),t=e.startsWith(`popup-`)?v.ot(a)?.tabs.find(e=>!e.tabId.startsWith(`popup-`))?.tabId??null:e;return t===null?null:(v.Dt(a,t,n,`transcript-link`),t!==e&&v.Jt(a,t),a)}return null},getPreviewAllowedOrigins:()=>g.t()?x.c():[],removePreviewAllowedOrigin:async e=>{if(!g.t())return!1;let t=x.l(e);return!t||!x.c().some(e=>e.origin===t&&!e.builtin)?!1:(await x.f(t),i.U(`desktop_launch_preview_allowed_origin_removed`,null),!0)},clearPreviewAllowedOrigins:async()=>g.t()?(await x.n(),i.U(`desktop_launch_preview_allowed_origins_cleared`,null),!0):!1,addPreviewAllowedOrigin:async e=>{if(!g.t())return l.t.Unavailable;let t=await x.t(e);return i.U(`desktop_launch_preview_allowed_origin_added`,{result:t}),t},openPreviewInBrowser:(e,t)=>{if(!g.t())return!1;let n=v.lt(e,t??v.H(e)),r=n===null?null:i.Xi(n);return!n||!r||x.l(n)===null?!1:(b.P(r.hostname)||(r.search=``,r.hash=``),r.username=``,r.password=``,a.n(r.href),i.U(`desktop_launch_preview_open_in_browser`,null),!0)},getLogs:e=>P.getLogs(e),stopServer:e=>P.stop(e),getInitialActiveServersState:()=>P.servers,showPreview:(e,t,n,r)=>(P.touchHtmlPreview(e),v.hn(e,t,n,r)),hidePreview:(e,t,n)=>v.vt(e,t,n),focusPreview:(e,t)=>v.V(e,t),destroyPreview:e=>v.j(e),refreshPreview:(e,t)=>v.Nt(e,t??v.H(e)),sendClaudePageShareCommand:e=>v.qt(e),sendClaudePageDismissCommand:e=>v.Kt(e),setPreviewViewport:async(e,t,n,r)=>(await v.mn(e,r??v.H(e),t,n),!0),clearPreviewViewport:async(e,t)=>(await v.g(e,t??v.H(e)),!0),setPreviewColorScheme:async(e,t,n)=>(await v.Xt(e,n??v.H(e),t),!0),toggleSelectionMode:(e,t,n)=>v.xn(e,t,n??v.H(e)),getPreviewUrl:e=>v.ct(e),getPreviewNavState:(e,t)=>v.Q(e,t??v.H(e)),navigatePreview:async(e,t,n)=>{if(/^file:/i.test(t)){let n=``;try{n=(0,w.extname)((0,D.fileURLToPath)(t)).toLowerCase()}catch{}if(Z.has(n)||v.n.has(n)){let n=b.W(e),r=v.X(e);if(n!==null&&r!==null)try{return await $(t,n,r)!==null}catch{return!1}}}return await v.Dt(e,n??v.H(e),t,`url-bar`,{userUrlBar:!0})===!0},goBack:(e,t)=>v.dt(e,t??v.H(e),!0),goForward:(e,t)=>v.ft(e,t??v.H(e),!0),setActivePreviewTab:(e,t)=>v.Jt(e,t),closePreviewTab:(e,t)=>v.y(e,t),setPreviewMuted:(e,t)=>v.an(e,t),getAllSessionPreviewTabs:()=>v.o(),openPreviewTab:async(e,t)=>{if(t!==void 0&&!v.mt(e)){if(!g.t())return g.i()&&p.n(`External browsing was blocked. Your organization has restricted the Browser to localhost only.`,l.j.Error,{messageForLogging:`preview_external_nav_blocked_policy`}),null;if(await Y(t),Ct(e),!v.mt(e))return v.kt(e,t)}return v.Ot(e)},focusOrOpenPreviewTab:async(e,t,n)=>{if(!g.t()||x.l(n)===null||!b.P(i.Xi(n)?.hostname??``))return null;await Y(t),Ct(e);let r=v.z(e,n);return r===null?v.kt(e,t,n):(v.Jt(e,r),r)},openExternalLinkInPreview:async(e,t,n)=>{if(!g.t()||x.l(n)===null)return null;await Y(t),Ct(e);let r=x.l(n),a=r===null?null:new URL(r);if(a!==null&&v.wt(a.hostname)){let e=Number(a.port||(a.protocol===`https:`?`443`:`80`)),n=t.endsWith(w.default.sep)?t:t+w.default.sep;if(!P.servers.some(r=>(r.cwd===t||r.cwd.startsWith(n))&&(r.status===`running`||r.status===`starting`)&&r.port===e))return i.U(`desktop_launch_preview_transcript_link_opened`,{tab:`blocked`}),null}let o=v.z(e,n);if(o!==null)return v.Dt(e,o,n,`transcript-link`),v.Jt(e,o),i.U(`desktop_launch_preview_transcript_link_opened`,{tab:`existing`}),o;let s=v.kt(e,t,n,{source:`transcript-link`});return i.U(`desktop_launch_preview_transcript_link_opened`,{tab:s===null?`cap-reached`:`new`}),s},setPreviewLinkRouting:(e,t)=>v.in(e,t),openRoutedLinkExternally:async(e,t)=>{if(!v.Tt(t))return!1;let n=i.Xi(t);return n===null?!1:(b.P(n.hostname)||(n.search=``,n.hash=``),n.username=``,n.password=``,await v.x(e,n.href)?(a.n(n.href),i.U(`desktop_launch_preview_link_routed_external`,{outcome:`opened`}),!0):(i.U(`desktop_launch_preview_link_routed_external`,{outcome:`declined`}),!1))},setRoutedLinkConfirmReady:e=>v.fn(e),resolveRoutedLinkConfirm:(e,t)=>v.Ht(e,t),closeAllPreviewTabs:e=>v.v(e),getPreviewTabs:e=>v.ot(e),capturePreviewScreenshot:async(e,n,r)=>{try{return v.Mt(e,r)?n===void 0?b.L(e)&&!g.t()?null:await v._n(e,v.H(e)):e.startsWith(`preview-`)?(await v.vn(e,n)).data:null:null}catch(e){let n=e?.code;return n!==`NOT_VISIBLE`&&n!==`NOT_LOADED`&&n!==`NOT_FOUND`&&t.o.warn(`[Preview] capturePreviewScreenshot failed: %o`,{error:e}),null}},capturePreviewScreenshotIfChanged:async(e,n,r)=>{try{return b.L(e)&&!g.t()?null:v.Mt(e,r)?await v.yn(e,v.H(e),n===!0):``}catch(e){let n=e?.code;return n!==`NOT_VISIBLE`&&n!==`NOT_LOADED`&&n!==`NOT_FOUND`&&t.o.warn(`[Preview] capturePreviewScreenshotIfChanged failed: %o`,{error:e}),``}},exportPreview:async(e,n)=>{if(n!==`file`&&n!==`screenshot`)return t.o.warn(`[Preview] exportPreview unknown kind %o`,{kind:n}),null;let r=P.servers.find(t=>t.serverId===e);return v.L(e,n,r?{name:r.name,cwd:r.cwd,filePath:r.filePath}:void 0)},loadHtmlPreview:$,loadClaudePagePreview:async(e,n,r)=>{if(await Y(n),h.a().status!==`supported`)return null;let a=i.Zi(e);if(!a)return t.o.warn(`[Preview] Rejected Claude page preview URL %o`,{origin:i.Xi(e)?.origin??`(unparseable)`}),null;let o=(wt.get(r)??0)+1;return wt.set(r,o),await kt(a.href),wt.get(r)===o?P.loadClaudePagePreview(a.href,n,{name:a.label,sessionId:r}):null},loadHtmlPreviewContent:(e,t,n,r,i)=>P.loadHtmlPreviewContent(e,t,n,r,i),pickHtmlFile:async e=>{let t=await Y(e).then(()=>!0,()=>!1),n=await T.dialog.showOpenDialog({defaultPath:t?w.default.normalize(e):void 0,properties:[`openFile`],filters:[{name:`Previewable`,extensions:[`html`,`htm`,`svg`,`png`,`jpg`,`jpeg`,`gif`,`webp`,`avif`,`pdf`]}]});return n.canceled||n.filePaths.length===0?null:n.filePaths[0]},previewSnapshot:async e=>K(e,null,async()=>{let t=v.H(e),n=await q(e,t);if(n===null)return null;let r=await v.bn(e,t);return J(e,t,n)?r:null}),previewInspect:async(e,t,n)=>K(e,null,async()=>{let r=v.H(e),i=await q(e,r);if(i===null)return null;let a=await v.xt(e,r,t,n);return J(e,r,i)?a==null?{found:!1}:{found:!0,info:a}:null}),previewConsoleLogs:(e,t)=>K(e,null,async()=>{let n=v.H(e),r=await q(e,n);if(r===null)return null;let i=x.l(v.lt(e,n)??``),a=v.U(e,n,t?.onlyErrors===!0?`error`:`all`);if(a===null)return null;let o=a.filter(e=>{let t=e.url?x.l(e.url):null;return t===null||t===i}).map(({level:e,text:t,timestamp:n,source:r})=>({level:e,text:t,timestamp:n,source:r}));return J(e,n,r)?(t?.clear===!0&&v.f(e,n),o):null}),previewModelScreenshot:async e=>K(e,null,async()=>{let t=v.H(e),n=await q(e,t);if(n===null)return null;let r=(await v.vn(e,t)).data;return J(e,t,n)?r:null}),navigatePreviewFromModel:async(e,t)=>{let n=await K(e,null,async()=>(await g.o(),await v.Dt(e,v.H(e),t,`mcp-tool`)));return n===!0?l.x.Ok:n===!1||n===null?l.x.Failed:l.x.Blocked},getAutoVerify:async e=>{try{await Y(e);let t=await new S.i(e).getConfigFile();return t?t.autoVerify!==!1:!1}catch{return!1}},setAutoVerify:async(e,t)=>{try{return await Y(e),await new S.i(e).setAutoVerify(t)}catch{return!1}},detectServerCandidates:async e=>{try{return await Y(e),St(e),await S.n(e)}catch{return[]}},detectServerCandidatesWithAgent:async e=>{try{await Y(e),St(e);let{detectServerCandidatesWithAgent:t}=await Promise.resolve().then(()=>require("./index.chunk-CnX5Gc6S.js")),n=await t(e);return n.ok?{ok:!0,candidates:n.candidates,htmlEntry:n.htmlEntry}:{ok:!1,candidates:[],reason:n.reason}}catch(e){return t.o.error(`[Preview] detectServerCandidatesWithAgent threw (${e instanceof Error?e.name:`unknown`})`),{ok:!1,candidates:[],reason:`error`}}},addServerFromCandidate:async(e,t)=>{try{await Y(e),St(e);let n=S.r(t);if(n.status!==`ok`)return{ok:!1,reason:n.reason};let r=new S.i(e),i=await r.gatherProjectInfo(),a=t.runtimeArgs[1];if(!i.scripts||!Object.prototype.hasOwnProperty.call(i.scripts,a))return{ok:!1,reason:`script-not-found`};let o=await r.addServerConfiguration({name:a,runtimeExecutable:t.runtimeExecutable,runtimeArgs:t.runtimeArgs,port:t.port});return o===`ok`?{ok:!0}:{ok:!1,reason:o===`name-exists`?`name-exists`:`write-failed`}}catch{return{ok:!1,reason:`write-failed`}}},getConfiguredServices:async e=>{try{await Y(e);let t=await new S.i(e).getConfigFile();return t?t.servers.map(e=>({name:e.name,port:e.port})):[]}catch{return[]}},startFromConfig:async(e,n,r)=>{try{await Y(e),r!==void 0&&v.c(r);let a=await ct(n?{name:n}:{},e,r);if(i.U(`desktop_launch_button_clicked`,{has_config:a.action!==`deny`}),a.action===`deny`)return t.o.info(`[Preview] No config resolved for %s`,e),{};if(a.action===`start`&&await b.m(a.config,e,r,!0),a.action===`start`&&a.config.autoPort!==!0){let e=P.servers.filter(e=>(e.status===`running`||e.status===`starting`)&&e.port===a.config.port&&(r===void 0||e.sessionId===void 0||e.sessionId===r));for(let n of e)t.o.info(`[Preview] Stopping conflicting server %s on port %d`,n.serverId,n.port),await P.stopAndWait(n.serverId)}let o=await yt(a,e,r,{awaitConfigUrlNavigation:!1,allowDeadReuseRespawn:!0,userInitiated:!0});return{serverId:o.serverId,previewId:o.previewId,tabId:o.tabId}}catch(e){if(e instanceof b.l)return t.o.info(`[Preview] startFromConfig refused: %s`,e.message),{refused:!0};let n=e instanceof Error?e.message:String(e);return t.o.error(`[Preview] startFromConfig failed: %o`,{error:e}),{error:n}}}}}var Mt=new Set([`application/json`,`application/xml`,`application/javascript`,`application/typescript`,`image/svg+xml`]),Nt=new Set([`.plugin`,`.skill`]);function Pt(e){return e.startsWith(`text/`)||Mt.has(e)}function Ft(e){let t=Math.min(e.length,8192);for(let n=0;n<t;n++)if(e[n]===0)return!0;return!1}function It(e,t){let n=w.default.basename(t),r=w.default.extname(t).toLowerCase(),i=m.t.getType(r)??`application/octet-stream`,a=Pt(i);return!Nt.has(r)&&(a||!Ft(e))?{content:e.toString(`utf-8`),mimeType:a?i:`text/plain`,fileName:n,encoding:`utf-8`}:{content:e.toString(`base64`),mimeType:i,fileName:n,encoding:`base64`}}function Lt(e){let t=w.default.extname(e).toLowerCase();if(!t)return`${e}.md`;let n=m.t.getType(t);return!n||Pt(n)?e:`${e.slice(0,-t.length)}.md`}Object.defineProperty(exports,"A",{enumerable:!0,get:function(){return ye}}),Object.defineProperty(exports,"C",{enumerable:!0,get:function(){return pe}}),Object.defineProperty(exports,"D",{enumerable:!0,get:function(){return _e}}),Object.defineProperty(exports,"E",{enumerable:!0,get:function(){return me}}),Object.defineProperty(exports,"M",{enumerable:!0,get:function(){return fe}}),Object.defineProperty(exports,"N",{enumerable:!0,get:function(){return xe}}),Object.defineProperty(exports,"O",{enumerable:!0,get:function(){return ve}}),Object.defineProperty(exports,"S",{enumerable:!0,get:function(){return P}}),Object.defineProperty(exports,"T",{enumerable:!0,get:function(){return ge}}),Object.defineProperty(exports,"_",{enumerable:!0,get:function(){return rt}}),Object.defineProperty(exports,"a",{enumerable:!0,get:function(){return pt}}),Object.defineProperty(exports,"b",{enumerable:!0,get:function(){return I}}),Object.defineProperty(exports,"c",{enumerable:!0,get:function(){return yt}}),Object.defineProperty(exports,"d",{enumerable:!0,get:function(){return Ge}}),Object.defineProperty(exports,"f",{enumerable:!0,get:function(){return L}}),Object.defineProperty(exports,"g",{enumerable:!0,get:function(){return it}}),Object.defineProperty(exports,"h",{enumerable:!0,get:function(){return nt}}),Object.defineProperty(exports,"i",{enumerable:!0,get:function(){return $}}),Object.defineProperty(exports,"j",{enumerable:!0,get:function(){return be}}),Object.defineProperty(exports,"k",{enumerable:!0,get:function(){return he}}),Object.defineProperty(exports,"l",{enumerable:!0,get:function(){return ct}}),Object.defineProperty(exports,"m",{enumerable:!0,get:function(){return Qe}}),Object.defineProperty(exports,"n",{enumerable:!0,get:function(){return It}}),Object.defineProperty(exports,"o",{enumerable:!0,get:function(){return ft}}),Object.defineProperty(exports,"p",{enumerable:!0,get:function(){return Ke}}),Object.defineProperty(exports,"r",{enumerable:!0,get:function(){return jt}}),Object.defineProperty(exports,"s",{enumerable:!0,get:function(){return _t}}),Object.defineProperty(exports,"t",{enumerable:!0,get:function(){return Lt}}),Object.defineProperty(exports,"u",{enumerable:!0,get:function(){return Ze}}),Object.defineProperty(exports,"v",{enumerable:!0,get:function(){return et}}),Object.defineProperty(exports,"w",{enumerable:!0,get:function(){return de}}),Object.defineProperty(exports,"x",{enumerable:!0,get:function(){return M}}),Object.defineProperty(exports,"y",{enumerable:!0,get:function(){return qe}});
//# sourceMappingURL=index2.chunk-BByj0nea.js.map