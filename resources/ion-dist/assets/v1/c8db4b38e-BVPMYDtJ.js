import{o as e}from"./rolldown-runtime-iuO8RvI4.js";import{Pu as t}from"./shared-0-ASFdPfVu.js";import{Fi as n,Pi as r,Ri as s}from"./vendor-frame-U999FJ0Q.js";import{$o as o,Jo as a,Ko as i,Xo as l,as as c,ns as u,qo as d,rs as f}from"./shared-4-DgPI-kM5.js";import{P as p}from"./vendor-all-0-y3jtzwCY.js";import{a as h,c as m,i as x,l as g,m as v,o as b,s as y}from"./vendor-motion-OjSJm1oN.js";import{_t as w,it as C}from"./shared-frame-DFHn2b4_.js";import{d as S,s as M}from"./vendor-intl-BIq5myDP.js";var k=e(s()),j="__cwhr_draft",N=String.raw`
(function () {
  "use strict";
  if (window.__coworkHtmlReviewGuest) return;
  window.__coworkHtmlReviewGuest = true;

  var READY_TYPE = "__cowork_html_review_ready__";
  var SEL_CLASS = "__cwhr-sel";
  var CONTEXT_LEN = 32;
  var EXACT_CAP = 1000;
  var port = null;
  var mode = false;
  var pins = [];
  var quotes = [];
  // Resolved Range per quote id; invalidated on DOM mutation and on a
  // fresh quotes set. Scroll/resize re-reports just re-read
  // getClientRects() from the cached Range. Null prototype - ids are
  // collaborator-writable and must not collide with Object.prototype.
  var quoteRanges = Object.create(null);
  var hoverEl = null;
  var selected = null;
  var hasTextSel = false;
  var rafPending = false;
  // Capture before page body scripts can shadow them; start() defers
  // to DOMContentLoaded which page code can race.
  var _MessageChannel = window.MessageChannel;
  var _topPost = window.top.postMessage.bind(window.top);

  function visibleText(el) {
    // innerText drops display:none/visibility:hidden subtrees; keep an
    // empty innerText (icon-only el) rather than falling through to
    // textContent which would re-include hidden text.
    var t = typeof el.innerText === "string" ? el.innerText : (el.textContent || "");
    return t.replace(/\s+/g, " ").trim();
  }

  function injectStyle() {
    var style = document.createElement("style");
    // Hover box is painted by the host (from streamed rects); the guest
    // only marks the selected element. The native cursor stays visible in
    // comment mode (forced to the arrow so page cursor styles don't fight
    // the picker) - the host's comment bubble trails it as decoration.
    style.textContent =
      "." + SEL_CLASS + "{outline:1px solid hsl(40 70% 40%) !important;outline-offset:0;}" +
      "body.__cwhr-mode, body.__cwhr-mode *{cursor:default !important;}";
    (document.head || document.documentElement).appendChild(style);
  }

  function isUnique(sel) {
    try {
      return document.querySelectorAll(sel).length === 1;
    } catch (e) {
      return false;
    }
  }

  // Mirrors the host's stripInvisibles ranges. The host strips these
  // from stored selectors, so a selector built on a value containing
  // them would validate here but never match again - skip those rungs
  // and fall through to the structural ladder instead.
  function hasInvisibles(s) {
    for (var i = 0; i < s.length; i++) {
      var c = s.codePointAt(i);
      if (c > 0xffff) i++;
      if (
        c <= 0x1f ||
        c === 0x061c ||
        c === 0x070f ||
        c === 0xad ||
        (c >= 0x7f && c <= 0x9f) ||
        c === 0x115f ||
        c === 0x1160 ||
        c === 0x180e ||
        (c >= 0x200b && c <= 0x200f) ||
        (c >= 0x202a && c <= 0x202e) ||
        (c >= 0x2060 && c <= 0x2064) ||
        (c >= 0x2066 && c <= 0x2069) ||
        c === 0x3164 ||
        c === 0xfeff ||
        (c >= 0xfff9 && c <= 0xfffb) ||
        c === 0xffa0 ||
        (c >= 0xe0000 && c <= 0xe007f)
      ) {
        return true;
      }
    }
    return false;
  }

  function escapeAttr(v) {
    return String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  // Selector ladder: unique #id -> unique [data-*] -> structural
  // tag:nth-of-type path rooted at the nearest unique-id ancestor.
  function selectorFor(el) {
    if (el.id && !hasInvisibles(el.id) && isUnique("#" + CSS.escape(el.id))) {
      return "#" + CSS.escape(el.id);
    }
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (
        attr.name.indexOf("data-") === 0 &&
        attr.value &&
        !hasInvisibles(attr.value)
      ) {
        var dataSel = "[" + attr.name + '="' + escapeAttr(attr.value) + '"]';
        if (isUnique(dataSel)) return dataSel;
      }
    }
    var parts = [];
    var cur = el;
    while (cur && cur !== document.body && cur.nodeType === 1 && parts.length < 10) {
      var sel = cur.tagName.toLowerCase();
      var parent = cur.parentElement;
      if (parent) {
        var sameTag = [];
        for (var c = 0; c < parent.children.length; c++) {
          if (parent.children[c].tagName === cur.tagName) sameTag.push(parent.children[c]);
        }
        if (sameTag.length > 1) {
          sel += ":nth-of-type(" + (sameTag.indexOf(cur) + 1) + ")";
        }
      }
      parts.unshift(sel);
      if (
        parent &&
        parent.id &&
        !hasInvisibles(parent.id) &&
        isUnique("#" + CSS.escape(parent.id))
      ) {
        parts.unshift("#" + CSS.escape(parent.id));
        return parts.join(" > ");
      }
      cur = parent;
    }
    if (cur === document.body) {
      parts.unshift("body");
      return parts.join(" > ");
    }
    // Depth cap hit without a root - an unrooted chain would match the
    // first structural pattern anywhere in the document. Mark the pin
    // detached instead of attaching it to the wrong element.
    return ":not(*)";
  }

  function descriptorFor(el) {
    var tag = "<" + el.tagName.toLowerCase() + ">";
    var idPart = el.id ? " #" + el.id : "";
    var text = visibleText(el).slice(0, 60);
    var textPart = text ? ' "' + text + '"' : "";
    // Nearest id'd ancestor, skipping the UCR-injected
    // #artifacts-component-root-* wrapper which is implementation noise.
    var section = el.parentElement;
    while (
      section &&
      (!section.id || section.id.indexOf("artifacts-component-root") === 0)
    ) {
      section = section.parentElement;
    }
    var sectionPart = section && section.id ? " in #" + section.id : "";
    return (tag + idPart + textPart + sectionPart).slice(0, 400);
  }

  // textContent offset of (node, offset) within body - the coordinate
  // system text-quote anchors are stored in. -1 when the boundary
  // isn't under body (shadow root, detached).
  function textOffset(node, offset) {
    var body = document.body;
    if (!body) return -1;
    try {
      var pre = document.createRange();
      pre.selectNodeContents(body);
      pre.setEnd(node, offset);
      return pre.toString().length;
    } catch (e) {
      return -1;
    }
  }

  // Inverse: build a Range covering [start, end) in body.textContent.
  function rangeForOffsets(start, end) {
    var body = document.body;
    if (!body) return null;
    var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    var acc = 0;
    var range = document.createRange();
    var haveStart = false;
    var t;
    while ((t = walker.nextNode())) {
      var next = acc + t.length;
      if (!haveStart && start < next) {
        range.setStart(t, start - acc);
        haveStart = true;
      }
      if (haveStart && end <= next) {
        range.setEnd(t, end - acc);
        return range;
      }
      acc = next;
    }
    return null;
  }

  // Context-scored search (W3C text-quote resolution): slice-check the
  // hint, else pick the occurrence whose surrounding chars best match
  // prefix/suffix. MIRRORS locateTextQuote() above line-for-line - the
  // tested export is the contract; this copy is what the sandbox runs.
  function locateQuote(text, q) {
    var ex = q.exact;
    if (!ex) return null;
    var hint = q.startOffset >= 0 ? q.startOffset : 0;
    if (text.slice(hint, hint + ex.length) === ex) {
      return { start: hint, end: hint + ex.length };
    }
    var best = -1;
    var bestScore = -1;
    var bestDist = Infinity;
    var scanned = 0;
    for (var idx = text.indexOf(ex); idx !== -1 && ++scanned <= 1000; idx = text.indexOf(ex, idx + 1)) {
      var before = text.slice(Math.max(0, idx - CONTEXT_LEN), idx);
      var after = text.slice(idx + ex.length, idx + ex.length + CONTEXT_LEN);
      var sc = 0;
      for (var i = 1; i <= q.prefix.length && i <= before.length; i++) {
        if (q.prefix[q.prefix.length - i] !== before[before.length - i]) break;
        sc++;
      }
      for (var j = 0; j < q.suffix.length && j < after.length; j++) {
        if (q.suffix[j] !== after[j]) break;
        sc++;
      }
      var dist = Math.abs(idx - hint);
      if (sc > bestScore || (sc === bestScore && dist < bestDist)) {
        best = idx;
        bestScore = sc;
        bestDist = dist;
      }
    }
    return best === -1 ? null : { start: best, end: best + ex.length };
  }

  function collectLineRects(range, cap) {
    var out = [];
    var rects = range.getClientRects();
    for (var i = 0; i < rects.length && out.length < cap; i++) {
      var r = rects[i];
      if (r.width > 0 && r.height > 0) {
        out.push({ x: r.left, y: r.top, w: r.width, h: r.height });
      }
    }
    return out;
  }

  function reportTextSel(full) {
    if (!port) return;
    var sel = window.getSelection();
    var r = sel && !sel.isCollapsed && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    if (!r || !document.body || !document.body.contains(r.commonAncestorContainer)) {
      if (hasTextSel) {
        hasTextSel = false;
        port.postMessage({ type: "textClear" });
      }
      return;
    }
    hasTextSel = true;
    var br = r.getBoundingClientRect();
    var msg = {
      type: "textCapture",
      rect: { x: br.left, y: br.top, w: br.width, h: br.height },
      lineRects: collectLineRects(r, 80),
    };
    if (full) {
      var live = document.body.textContent || "";
      var so = textOffset(r.startContainer, r.startOffset);
      var eo = textOffset(r.endContainer, r.endOffset);
      if (so < 0 || eo < 0 || eo <= so) {
        // Unanchorable selection (shadow root, foreign node). A
        // rect-only post here would make the host pair the new rect
        // with a stale prior anchor - clear instead.
        hasTextSel = false;
        port.postMessage({ type: "textClear" });
        return;
      }
      // Denomination invariant: exact/prefix/suffix are byte-identical
      // slices of body.textContent. Truncation adjusts endOffset so
      // the host's (endOffset - startOffset === exact.length) shape
      // check holds. Cut points back off surrogate halves - a lone
      // surrogate would never relocate and fails UTF-8 persist.
      var capped = Math.min(eo, so + EXACT_CAP);
      if (capped < eo) {
        var hc = live.charCodeAt(capped - 1);
        if (hc >= 0xd800 && hc <= 0xdbff) capped--;
      }
      if (capped <= so) {
        port.postMessage(msg);
        return;
      }
      var pStart = Math.max(0, so - CONTEXT_LEN);
      var pc = live.charCodeAt(pStart);
      if (pc >= 0xdc00 && pc <= 0xdfff) pStart++;
      var sEnd = Math.min(live.length, capped + CONTEXT_LEN);
      if (sEnd < live.length) {
        var sc = live.charCodeAt(sEnd - 1);
        if (sc >= 0xd800 && sc <= 0xdbff) sEnd--;
      }
      msg.exact = live.slice(so, capped);
      msg.prefix = live.slice(pStart, so);
      msg.suffix = live.slice(capped, sEnd);
      msg.startOffset = so;
      msg.endOffset = capped;
    }
    port.postMessage(msg);
  }

  function clearSelection() {
    if (selected) {
      selected.classList.remove(SEL_CLASS);
      selected = null;
    }
  }

  // rAF-throttled cursor + hover-rect stream so the host can paint the
  // trailing bubble and the inspector hover box while in comment mode.
  var cursorPending = false;
  var cursorX = -1;
  var cursorY = -1;
  function flushCursor() {
    cursorPending = false;
    if (!port) return;
    var hover = null;
    if (
      hoverEl &&
      hoverEl.nodeType === 1 &&
      hoverEl !== document.body &&
      hoverEl !== document.documentElement
    ) {
      var r = hoverEl.getBoundingClientRect();
      if (r.width > 0 || r.height > 0) {
        hover = { x: r.left, y: r.top, w: r.width, h: r.height };
      }
    }
    port.postMessage({ type: "cursor", x: cursorX, y: cursorY, hover: hover });
  }
  function scheduleCursor() {
    if (!cursorPending) {
      cursorPending = true;
      requestAnimationFrame(flushCursor);
    }
  }
  function onMouseMove(ev) {
    if (!mode || !port) return;
    // Over the scrollbar gutter (clientX/Y past the content box) - hide
    // the bubble/hover box like a leave.
    var de = document.documentElement;
    if (ev.clientX >= de.clientWidth || ev.clientY >= de.clientHeight) {
      cursorX = -1;
      cursorY = -1;
      hoverEl = null;
      scheduleCursor();
      return;
    }
    cursorX = ev.clientX;
    cursorY = ev.clientY;
    hoverEl = ev.target;
    scheduleCursor();
  }
  function onMouseLeave() {
    if (!mode || !port) return;
    cursorX = -1;
    cursorY = -1;
    hoverEl = null;
    scheduleCursor();
  }

  function onClick(ev) {
    if (!port) return;
    if (!mode) {
      // Mode off: don't intercept the page, just let the host close any
      // open popover (thread card click-away). A non-collapsed selection
      // means the click ended a drag-select - not a click-away.
      var s = window.getSelection();
      if (!s || s.isCollapsed) port.postMessage({ type: "clickAway" });
      return;
    }
    ev.preventDefault();
    ev.stopImmediatePropagation();
    var el = ev.target;
    if (!el || el.nodeType !== 1 || el === document.documentElement) return;
    if (el === document.body && el.firstElementChild) {
      // Pin on body is rarely intentional; keep it anyway but as body.
    }
    clearSelection();
    selected = el;
    el.classList.add(SEL_CLASS);
    var rect = el.getBoundingClientRect();
    var pinX = rect.width > 0 ? (ev.clientX - rect.left) / rect.width : 0.5;
    var pinY = rect.height > 0 ? (ev.clientY - rect.top) / rect.height : 0.5;
    port.postMessage({
      type: "capture",
      selector: selectorFor(el).slice(0, 1000),
      textHint: visibleText(el).slice(0, 300),
      descriptor: descriptorFor(el),
      pinX: Math.min(1, Math.max(0, pinX)),
      pinY: Math.min(1, Math.max(0, pinY)),
      clientX: ev.clientX,
      clientY: ev.clientY,
      rectLeft: rect.left,
      rectTop: rect.top,
    });
  }

  function reportRects() {
    rafPending = false;
    if (!port) return;
    // Selected element's live bounds - keeps the host's draft pin /
    // inspector tag / composer glued through scroll and reflow.
    if (selected) {
      var sr = selected.getBoundingClientRect();
      port.postMessage({
        type: "selRect",
        left: sr.left,
        top: sr.top,
        w: sr.width,
        h: sr.height,
        found:
          (sr.width > 0 || sr.height > 0) &&
          document.documentElement.contains(selected),
      });
    }
    var rects = [];
    for (var i = 0; i < pins.length; i++) {
      var p = pins[i];
      var el = null;
      try {
        el = document.querySelector(p.selector);
      } catch (e) {
        el = null;
      }
      if (!el) {
        rects.push({ id: p.id, x: 0, y: 0, found: false });
        continue;
      }
      var r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) {
        rects.push({ id: p.id, x: 0, y: 0, found: false });
        continue;
      }
      rects.push({
        id: p.id,
        x: r.left + p.pinX * r.width,
        y: r.top + p.pinY * r.height,
        found: true,
      });
    }
    var quoteRects = [];
    if (quotes.length > 0) {
      var live = null;
      for (var qi = 0; qi < quotes.length; qi++) {
        var q = quotes[qi];
        var qr = quoteRanges[q.id];
        if (qr === undefined) {
          if (live === null) {
            live = (document.body && document.body.textContent) || "";
          }
          var loc = locateQuote(live, q);
          qr = (loc && rangeForOffsets(loc.start, loc.end)) || null;
          quoteRanges[q.id] = qr;
        }
        // Zero paintable rects (display:none subtree) reports as
        // not-found so the host docks it as detached instead of
        // rendering nothing clickable.
        var qlr = qr ? collectLineRects(qr, 80) : [];
        quoteRects.push(
          qlr.length > 0
            ? { id: q.id, found: true, lineRects: qlr }
            : { id: q.id, found: false, lineRects: [] }
        );
      }
    }
    port.postMessage({
      type: "rects",
      rects: rects,
      quoteRects: quoteRects,
      scrollY: window.scrollY || 0,
    });
  }

  function scheduleRects() {
    if (rafPending) return;
    rafPending = true;
    var done = false;
    function run() {
      if (done) return;
      done = true;
      reportRects();
    }
    // rAF for paint alignment, with a timeout fallback - rAF is
    // suspended entirely in hidden tabs and pins must still settle
    // when the tab becomes visible after background loading.
    requestAnimationFrame(run);
    setTimeout(run, 150);
  }

  function setMode(on) {
    mode = !!on;
    if (document.body) {
      document.body.classList.toggle("__cwhr-mode", mode);
    }
    if (!mode) {
      hoverEl = null;
      clearSelection();
    }
  }

  function onPortMessage(ev) {
    var data = ev.data;
    if (!data) return;
    if (data.type === "mode") setMode(data.on);
    else if (data.type === "pins") {
      pins = Array.isArray(data.pins) ? data.pins : [];
      scheduleRects();
    } else if (data.type === "quotes") {
      quotes = Array.isArray(data.quotes) ? data.quotes : [];
      quoteRanges = Object.create(null);
      scheduleRects();
    } else if (data.type === "clearSelection") {
      clearSelection();
    } else if (data.type === "clearTextSel") {
      var ts = window.getSelection();
      if (ts) ts.removeAllRanges();
      hasTextSel = false;
    } else if (data.type === "restoreScroll") {
      var ry = Number(data.y);
      if (isFinite(ry) && ry > 0) {
        // Apply now and again at load - late images/fonts can grow the
        // document after the first attempt clamps short.
        window.scrollTo(0, ry);
        window.addEventListener("load", function () {
          window.scrollTo(0, ry);
        });
      }
    }
  }

  function start() {
    injectStyle();
    var channel = new _MessageChannel();
    port = channel.port1;
    port.onmessage = onPortMessage;
    // Sandboxed srcdoc origins can be opaque; "*" is required. The
    // payload carries only the mount token (multiple sandboxes can be
    // mounted at once - the token routes the port to the right overlay)
    // and the channel port itself is pairwise-secure.
    _topPost(
      { type: READY_TYPE, token: "__CWHR_TOKEN__" },
      "*",
      [channel.port2]
    );
    document.addEventListener("mousemove", onMouseMove, true);
    // documentElement (not document, capture) so this fires only when the
    // pointer leaves the viewport - capture-phase on document would fire for
    // every intra-document element-boundary crossing.
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("click", onClick, true);
    // Text-selection capture: commit on mouseup/keyup (Shift+Arrow),
    // clear on collapse. Not mode-gated; highlight-to-comment is
    // always on.
    function onSelCommit() { reportTextSel(true); }
    document.addEventListener("mouseup", onSelCommit, true);
    document.addEventListener("keyup", onSelCommit, true);
    document.addEventListener("selectionchange", function () {
      var s = window.getSelection();
      if (hasTextSel && (!s || s.isCollapsed)) reportTextSel(false);
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && port) port.postMessage({ type: "dismiss" });
    }, true);
    // Scroll/resize move the hovered element under a stationary pointer -
    // re-report its rect so the host's inspector box tracks it. Mutations
    // stay rects-only (animating pages would chatter the cursor stream).
    var textSelPending = false;
    function scheduleTextSel() {
      if (textSelPending) return;
      textSelPending = true;
      requestAnimationFrame(function () {
        textSelPending = false;
        reportTextSel(false);
      });
    }
    function onLayoutChange() {
      scheduleRects();
      if (mode && hoverEl) scheduleCursor();
      if (hasTextSel) scheduleTextSel();
    }
    window.addEventListener("scroll", onLayoutChange, true);
    window.addEventListener("resize", onLayoutChange);
    // Full-cache invalidate per childList mutation is acceptable: CSS
    // animation doesn't fire the observer; JS writers at frame rate
    // would re-relocate every frame but are rare. characterData isn't
    // observed, so .data= edits leave highlights stale until the next
    // childList mutation.
    var observer = new MutationObserver(function () {
      quoteRanges = Object.create(null);
      scheduleRects();
      if (hasTextSel) scheduleTextSel();
    });
    function observe() {
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    }
    if (document.body) observe();
    else document.addEventListener("DOMContentLoaded", observe);
    // Settle pins after late layout (fonts, images).
    setInterval(scheduleRects, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
`;function E(e,t){const n=t.replace(/[^a-zA-Z0-9-]/g,""),r=`<script>${N.replace("__CWHR_TOKEN__",n)}<\/script>`,s=e=>" ".repeat(e.length),o=e.replace(/<!--[\s\S]*?-->/g,s).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,s).replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,s).replace(/<(?:script|style)\b[^>]*>[\s\S]*$/i,s),a=/<head(?:\s[^>]*)?>/i.exec(o);if(a){const t=a.index+a[0].length;return e.slice(0,t)+r+e.slice(t)}const i=/<html(?:\s[^>]*)?>/i.exec(o);if(i){const t=i.index+i[0].length;return e.slice(0,t)+r+e.slice(t)}const l=/^\s*<!doctype[^>]*>/i.exec(o);if(l){const t=l.index+l[0].length;return e.slice(0,t)+r+e.slice(t)}return r+e}var R=n(),T=24,q="#D97757",_="rgba(0,0,0,0.12)",O="0 1px 3px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.08)",L="0 0 0 0.5px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.08)",A={initial:{opacity:0,y:6,scale:.98},animate:{opacity:1,y:0,scale:1},transition:{duration:.16,ease:[.2,.7,.3,1]}};function F(e){const t=P(e.x+6,6,Math.max(6,e.boundsW-256-6)),n=e.y+6;return{left:t,top:n+56<=e.boundsH-6?n:P(e.y-T-6-56,6,Math.max(6,e.boundsH-56-6))}}function P(e,t,n){return Math.min(n,Math.max(t,e))}function z(e,t){const n=Number(e?.x)||0,r=Number(e?.y)||0,s=P(n,0,t.w),o=P(r,0,t.h),a=P(n+(Number(e?.w)||0),0,t.w),i=P(r+(Number(e?.h)||0),0,t.h);return a>s&&i>o?{x:s,y:o,w:a-s,h:i-o}:null}function X(e,t){if(!Array.isArray(e))return[];const n=[];for(const r of e.slice(0,80)){const e=z(r,t);e&&n.push(e)}return n}function Y(e){const t=(new DOMParser).parseFromString(e,"text/html");for(const s of t.querySelectorAll("script, style, noscript"))s.remove();const n=t.createTreeWalker(t.body??t,NodeFilter.SHOW_TEXT);let r="";for(;n.nextNode();)r+=(n.currentNode.textContent??"")+" ";return u(r,2e6)}var D=String.raw`#(?:[-\w\u0080-\uFFFF]|\\[0-9a-fA-F]{1,6} |\\[^0-9a-fA-F])+`,I=String.raw`\[data-[a-zA-Z0-9_.:-]+="(?:[^"\\]|\\.)*"\]`,$=String.raw`[a-z][a-z0-9-]*(?::nth-of-type\(\d+\))?`,H=new RegExp(`^(?:${D}|${I}|:not\\(\\*\\)|(?:(?:${D}|body) > )?${$}(?: > ${$})*)$`),W=/"(?:[^"\\]|\\.){81,}"/,G=/"[^"]*\s[^"]*"/,U=new RegExp(String.raw`#(?:[-\w\u0080-\uFFFF]|\\[0-9a-fA-F]{1,6} |\\[^0-9a-fA-F]){65,}`),B=/(?:^|> )[a-z][a-z0-9-]{32,}/,K=/\[data-[a-zA-Z0-9_.:-]{33,}=/,J=new RegExp(String.raw`^#(?:[-\w\u0080-\uFFFF]|\\[0-9a-fA-F]{1,6} |\\[^0-9a-fA-F]){33,} > `);var Z=/^<([a-z][\w-]{0,31})>(?: #([^\s"]{1,64}))?(?: "([^"]{0,60})")?(?: in #(\S{1,64}))?$/,Q=/^artifacts-component-root/,V=(0,k.memo)(function({descriptor:e}){const t=Z.exec(e);if(!t)return(0,R.jsx)("div",{className:"truncate text-xs text-muted",children:e});const[,n,r,s,o]=t,a=o&&!Q.test(o)?o:void 0,i=(0,R.jsx)("span",{className:"inline-flex shrink-0 items-center rounded border bg-surface-1 px-1 font-mono text-[11px] text-secondary",children:n});return(0,R.jsxs)("div",{className:"flex min-w-0 select-none items-center gap-1.5 text-xs text-muted",children:[s?(0,R.jsx)(C,{multiline:!0,content:(0,R.jsx)("span",{className:"line-clamp-3 break-words",children:`\u201c${s}\u201d`}),children:i}):i,r&&(0,R.jsx)("span",{className:"shrink-0 font-mono text-accent-pro-100",children:`#${r}`}),a&&(0,R.jsx)("span",{className:"shrink-0 truncate",children:(0,R.jsx)(M,{defaultMessage:"in <s>#{section}</s>",id:"6XJT5DKRek",values:{section:a,s:e=>(0,R.jsx)("span",{className:"font-mono text-secondary",children:e})}})})]})}),ee=(0,k.memo)(function({descriptor:e,x:t,y:n}){const r=Z.exec(e),s=r?.[1]??e.slice(0,24),o=r?.[2],a=n<16;return(0,R.jsxs)("div",{className:"pointer-events-none absolute z-20 max-w-[16rem] truncate px-1 py-px font-mono text-[10px] leading-[14px]",style:{left:t-1,top:a?n:n-16,backgroundColor:q,color:"#fff"},children:[s,o&&(0,R.jsx)("span",{style:{opacity:.8},children:` #${o}`})]})}),te=(0,k.memo)(function({onFrame:e}){return h(e),null}),ne=(0,k.memo)(function({n:e,active:t,swingIn:n=!1}){const r=x()??!1,s=b(r||!t&&!n?t?-90:0:-90,{stiffness:300,damping:22});(0,k.useEffect)(()=>{r?s.jump(t?-90:0):s.set(t?-90:0)},[t,s,r]);const o=y(s,e=>-e);return(0,R.jsx)(g.div,{className:"flex size-6 items-center justify-center rounded-full rounded-bl-[2px]",style:{rotate:s,transformOrigin:"1px 23px",backgroundColor:t?q:"#fff",boxShadow:`0 0 0 1px ${t?"#C6613F":_}, ${O}`},children:void 0!==e&&(0,R.jsx)(g.span,{className:"text-[11px] font-semibold leading-none",style:{rotate:o,color:t?"#fff":"#141413"},children:e})})});function re(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){const r=e[n],s=t[n];if(r.x!==s.x||r.y!==s.y||r.w!==s.w||r.h!==s.h)return!1}return!0}var se=[],oe=(0,k.memo)(function({active:e,token:n,documentRef:s,commentProps:h,uiHidden:y=!1,commentMode:N,onCommentModeChange:E,pageTextIndex:Y,className:D="relative h-full w-full",children:I}){const $=S(),{userContentRendererUrl:Q}=t(),V=p("(hover: hover) and (pointer: fine)")??!0,oe=x()??!1,ie=(0,k.useRef)(!1);(0,k.useEffect)(()=>{ie.current=oe},[oe]);const le=(0,k.useRef)(null),ce=m(0),ue=m(0),[de,fe]=(0,k.useState)(!1),[pe,he]=(0,k.useState)(null),[me,xe]=(0,k.useState)(null),ge=m(0),ve=m(0),be=m(0),ye=b(0,{stiffness:380,damping:26}),we=m(0),Ce=m(0),Se=void 0!==E,[Me,ke]=(0,k.useState)(!1),je=Se?N??!1:Me,Ne=(0,k.useCallback)(e=>{E?E(e):ke(e)},[E]),Ee=(0,k.useRef)(!1);(0,k.useEffect)(()=>{Ee.current=je},[je]),(0,k.useEffect)(()=>{Fe.current=Ne},[Ne]);const Re=(0,k.useRef)(!1),Te=(0,k.useRef)(null);(0,k.useEffect)(()=>{const e=le.current;if(!e)return;const t=new ResizeObserver(([e])=>{Te.current={w:e.contentRect.width,h:e.contentRect.height}});return t.observe(e),()=>t.disconnect()},[]);const[qe,_e]=(0,k.useState)(null),Oe=(0,k.useRef)(null);(0,k.useEffect)(()=>{Oe.current=qe},[qe]);const Le=(0,k.useRef)(0),Ae=(0,k.useRef)(void 0);(0,k.useEffect)(()=>{Ae.current=Y},[Y]);const Fe=(0,k.useRef)(null),[Pe,ze]=(0,k.useState)(null),[Xe,Ye]=(0,k.useState)(null),[De,Ie]=(0,k.useState)(null),[$e,He]=(0,k.useState)(null),We=(0,k.useRef)(!1),Ge=(0,k.useRef)(null);(0,k.useEffect)(()=>{We.current=null!==$e,Ge.current=$e?.kind??null},[$e]);const[Ue,Be]=(0,k.useState)(""),[Ke,Je]=(0,k.useState)(!1),[Ze,Qe]=(0,k.useState)(null),[Ve,et]=(0,k.useState)(null),tt=(0,k.useRef)(0),nt=(0,k.useRef)(!1);(0,k.useEffect)(()=>{nt.current=null!==Ze},[Ze]);const rt=(0,k.useMemo)(()=>o(s),[s]),st="file"===s.kind,ot=(0,k.useRef)(st);(0,k.useEffect)(()=>{ot.current=st},[st]);const at=h?.comments??se,it=(0,k.useMemo)(()=>at.filter(e=>d(e)&&"open"===(e.status??"open")&&"element"===e.target.anchor.kind&&o(e.target.document)===rt),[at,rt]),lt=(0,k.useMemo)(()=>i(at),[at]),ct=(0,k.useMemo)(()=>it.map(e=>{const t=e.target.anchor;return{id:e.id,selector:t.selector,pinX:t.pinX,pinY:t.pinY}}),[it]),ut=(0,k.useRef)(new Set);(0,k.useEffect)(()=>{ut.current=new Set(ct.map(e=>e.id))},[ct]);const dt=(0,k.useMemo)(()=>at.filter(e=>d(e)&&"open"===(e.status??"open")&&"text-quote"===e.target.anchor.kind&&"__cwhr_draft"!==e.id&&o(e.target.document)===rt).slice(0,200),[at,rt]),ft=(0,k.useMemo)(()=>dt.map(e=>{const t=e.target.anchor;return{id:e.id,exact:c(t.exact.slice(0,1e3)),prefix:c(t.prefix.slice(-32)),suffix:c(t.suffix.slice(0,32)),startOffset:Math.max(0,Math.trunc(Number(t.startOffset))||0)}}),[dt]),pt="text"===$e?.kind?$e.anchor:null,ht=(0,k.useMemo)(()=>pt?[...ft,{id:j,exact:pt.exact,prefix:pt.prefix,suffix:pt.suffix,startOffset:pt.startOffset}]:ft,[ft,pt]),mt=(0,k.useRef)(new Set);(0,k.useEffect)(()=>{mt.current=new Set(ht.map(e=>e.id))},[ht]);const xt=(0,k.useMemo)(()=>[...it,...dt],[it,dt]),gt=(0,k.useCallback)(e=>{const t=e;var n,r;if(t&&"object"==typeof t)if("capture"===t.type){if(!Ee.current)return;if(We.current||nt.current)return Oe.current?.postMessage({type:"clearSelection"}),He(e=>"element"===e?.kind?null:e),void Qe(null);const e=Te.current?.w??600,s=Te.current?.h??400;let o=be.get();o-=360*Math.round((o- -90)/360);const a=(n=t.selector,r=1e3,"string"==typeof n?f(n).slice(0,r):"");if(!H.test(a))return void Oe.current?.postMessage({type:"clearSelection"});const i=u(t.textHint,300),l=u(t.descriptor,400);He({kind:"element",captureId:++tt.current,x:P(Number(t.clientX)||0,0,e),y:P(Number(t.clientY)||0,0,s),boundsW:e,boundsH:s,labelX:P(Number(t.rectLeft)||0,0,e),labelY:P(Number(t.rectTop)||0,0,s),fromRotate:o,anchor:{selector:a,textHint:i,descriptor:l,pinX:P(Number(t.pinX)||0,0,1),pinY:P(Number(t.pinY)||0,0,1)}}),Be("");const c=""!==i&&(void 0!==Ae.current?!Ae.current.includes(i):i.length>60),d=Z.exec(l)?.[3]??"",p=""!==d&&!i.startsWith(d);Je(c||p||function(e){return W.test(e)||G.test(e)||U.test(e)||B.test(e)||K.test(e)||J.test(e)}(a)||""!==l&&!Z.test(l)),Qe(null),he(null),xe(null)}else if("rects"===t.type){if(!Array.isArray(t.rects))return;const e=Number(t.scrollY);if(Number.isFinite(e)&&e>=0&&(Le.current=e),ze(e=>{const n=ut.current,r=Math.max(2*n.size,16),s=t.rects.length>r?t.rects.slice(0,r):t.rects,o=new Map;for(const t of s)"string"==typeof t?.id&&n.has(t.id)&&o.set(t.id,{id:t.id,x:Number(t.x)||0,y:Number(t.y)||0,found:!0===t.found});return function(e,t){if(!e||e.size!==t.size)return!1;for(const[n,r]of t){const t=e.get(n);if(!t||t.x!==r.x||t.y!==r.y||t.found!==r.found)return!1}return!0}(e,o)?e:o}),Array.isArray(t.quoteRects)){const e=mt.current,n=Te.current??{w:600,h:400},r=t.quoteRects.slice(0,Math.max(2*e.size,16));Ye(t=>{const s=new Map;for(const o of r)"string"==typeof o?.id&&e.has(o.id)&&s.set(o.id,{id:o.id,found:!0===o.found,lineRects:X(o.lineRects,n)});return t&&function(e,t){if(e.size!==t.size)return!1;for(const[n,r]of t){const t=e.get(n);if(!t||t.found!==r.found||!re(t.lineRects,r.lineRects))return!1}return!0}(t,s)?t:s})}}else if("dismiss"===t.type){if(nt.current&&Qe(null),!Ee.current)return;We.current&&"element"===Ge.current?(Oe.current?.postMessage({type:"clearSelection"}),He(null)):nt.current||Fe.current?.(!1)}else if("clickAway"===t.type)Qe(null);else if("selRect"===t.type){if(!We.current||!0!==t.found)return;const e=Number(t.left),n=Number(t.top),r=Number(t.w),s=Number(t.h);if(!(Number.isFinite(e)&&Number.isFinite(n)&&Number.isFinite(r)&&Number.isFinite(s)))return;const o=Te.current??{w:600,h:400};He(t=>{if("element"!==t?.kind)return t;const a=P(e+t.anchor.pinX*r,0,o.w),i=P(n+t.anchor.pinY*s,0,o.h);return a===t.x&&i===t.y?t:{...t,x:a,y:i,labelX:P(e,0,o.w),labelY:P(n,0,o.h)}})}else if("cursor"===t.type){if(!Ee.current)return;const e=Number(t.x),n=Number(t.y);if(!Number.isFinite(e)||!Number.isFinite(n))return;const r=Te.current??{w:600,h:400};if(e<0||n<0||e>r.w||n>r.h)return Re.current=!1,fe(!1),void he(null);Re.current?(ce.set(e),ue.set(n)):(Re.current=!0,ce.jump(e),ue.jump(n),ge.jump(e),ve.jump(n)),fe(!0);const s=t.hover;he(e=>{if(!s||"object"!=typeof s)return null===e?e:null;const t={x:P(Number(s.x)||0,0,r.w),y:P(Number(s.y)||0,0,r.h),w:P(Number(s.w)||0,0,r.w),h:P(Number(s.h)||0,0,r.h)};return e&&e.x===t.x&&e.y===t.y&&e.w===t.w&&e.h===t.h?e:t})}else if("textCapture"===t.type){if(!ot.current)return;const e=Te.current??{w:600,h:400},n=z(t.rect,e)??{x:0,y:0,w:0,h:0},r=X(t.lineRects,e);let s=null;if("string"==typeof t.exact){const e=c(t.exact.slice(0,1e3)),n=Math.max(0,Math.trunc(Number(t.startOffset))||0),r=Math.max(0,Math.trunc(Number(t.endOffset))||0);e.length>0&&r-n===e.length&&(s={exact:e,prefix:c("string"==typeof t.prefix?t.prefix.slice(-32):""),suffix:c("string"==typeof t.suffix?t.suffix.slice(0,32):""),startOffset:n,endOffset:r})}Ie(e=>{const t=s??e?.anchor??null;return t?e&&e.anchor.exact===t.exact&&e.anchor.prefix===t.prefix&&e.anchor.suffix===t.suffix&&e.anchor.startOffset===t.startOffset&&e.anchor.endOffset===t.endOffset&&e.rect.x===n.x&&e.rect.y===n.y&&e.rect.w===n.w&&e.rect.h===n.h&&re(e.lineRects,r)?e:{rect:n,lineRects:r,anchor:t}:e})}else"textClear"===t.type&&Ie(null)},[ce,ue,ge,ve,be]),vt=(0,k.useRef)(gt);(0,k.useEffect)(()=>{vt.current=gt},[gt]),(0,k.useEffect)(()=>{if(!n)return;let e=null;try{e=new URL(Q).origin}catch{return}const t=t=>{if(t.origin!==e)return;const r=t.data;if(!r||"__cowork_html_review_ready__"!==r.type||r.token!==n)return;const s=t.ports[0];s&&(s.onmessage=e=>vt.current(e.data),_e(s),ze(null),Ye(null),Ie(null))};return window.addEventListener("message",t),()=>{window.removeEventListener("message",t)}},[n,Q]),(0,k.useEffect)(()=>()=>qe?.close(),[qe]),(0,k.useEffect)(()=>{qe?.postMessage({type:"mode",on:je})},[qe,je]),(0,k.useEffect)(()=>{qe?.postMessage({type:"pins",pins:ct})},[qe,ct]),(0,k.useEffect)(()=>{qe?.postMessage({type:"quotes",quotes:ht})},[qe,ht]),(0,k.useEffect)(()=>{qe&&Le.current>0&&qe.postMessage({type:"restoreScroll",y:Le.current})},[qe]),(0,k.useEffect)(()=>{null===$e&&qe?.postMessage({type:"clearSelection"})},[qe,$e]);const bt=(0,k.useCallback)((e,t)=>{const n=ce.get(),r=ue.get();if(ie.current)return ge.set(n),void ve.set(r);const s=Math.min(t||16.7,50),o=1-Math.exp(-s/90),a=1-Math.exp(-s/50),i=ge.get(),l=ve.get();ge.set(i+(n-i)*o),ve.set(l+(r-l)*o);const c=n-ge.get(),u=r-ve.get();if(Math.hypot(c,u)>2){let e=Math.atan2(-u,-c)*(180/Math.PI)- -45;const t=be.get();e+=360*Math.round((t-e)/360),be.set(t+(e-t)*a)}},[ce,ue,ge,ve,be]),yt=je&&de&&!$e&&!Ze;(0,k.useEffect)(()=>{ye.set(yt?1:0)},[yt,ye]);const wt=(0,k.useCallback)(()=>{Ne(!je)},[je,Ne]),Ct=(0,k.useCallback)(e=>{const t=le.current?.getBoundingClientRect();t&&(we.set(P(e.clientX-t.left+12,6,Math.max(6,t.width-224-6))),Ce.set(P(e.clientY-t.top+14,6,Math.max(6,t.height-80))))},[we,Ce]),St=(0,k.useCallback)(e=>{Qe(t=>t===e?null:e),He(e=>"text"===e?.kind?e:null),xe(null)},[]),Mt=(0,k.useCallback)(()=>{if(!De?.anchor)return;const e=Te.current??{w:600,h:400};He({kind:"text",captureId:++tt.current,boundsW:e.w,boundsH:e.h,anchor:De.anchor,fallbackX:P(De.rect.x+De.rect.w/2,0,e.w),fallbackY:De.rect.y}),Be(""),Je(De.anchor.exact.length>60||""===u(De.anchor.exact,300)),Qe(null),Ie(null),Oe.current?.postMessage({type:"clearTextSel"})},[De]),kt=null!==$e;(0,k.useEffect)(()=>{if(!je&&!kt&&!Ze)return;const e=e=>{"Escape"!==e.key||e.defaultPrevented||e.isComposing||(e.preventDefault(),kt||Ze?(He(null),Qe(null)):Ne(!1))};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},[je,kt,Ze,Ne]);const jt=(0,k.useCallback)(e=>{"Escape"!==e.key||e.nativeEvent.isComposing||(Ee.current||We.current||nt.current)&&(e.preventDefault(),e.stopPropagation(),We.current||nt.current?(Oe.current?.postMessage({type:"clearSelection"}),He(null),Qe(null)):Fe.current?.(!1))},[]);(0,k.useEffect)(()=>{He(e=>"text"===e?.kind?e:null),Qe(null),!je&&ot.current&&(Ie(null),Oe.current?.postMessage({type:"clearTextSel"})),je||(Re.current=!1,fe(!1),he(null),xe(null),ye.jump(0))},[je,ye]),(0,k.useEffect)(()=>{xe(e=>!e||it.some(t=>t.id===e)||dt.some(t=>t.id===e)?e:null)},[it,dt]),(0,k.useEffect)(()=>{et(e=>e&&it.some(t=>!e.knownIds.has(t.id)&&Pe?.has(t.id))?null:e)},[it,Pe]),(0,k.useEffect)(()=>{if(!Ve)return;const e=Ve.captureId,t=setTimeout(()=>{et(t=>t?.captureId===e?null:t)},2500);return()=>clearTimeout(t)},[Ve]);const Nt=(0,k.useCallback)(()=>{$e&&Ue.trim()&&h&&("element"===$e.kind?(h.onCommentSubmit(a(s,$e.anchor),Ue.trim(),{displayMode:"rendered",forceNew:!0}),et({captureId:$e.captureId,x:$e.x,y:$e.y,knownIds:new Set(it.map(e=>e.id))})):h.onCommentSubmit(l(s,$e.anchor),Ue.trim(),{displayMode:"rendered",forceNew:!0}),He(null),Be(""))},[$e,Ue,h,s,it]);if((0,k.useEffect)(()=>{!y&&e||(Ne(!1),He(null),Qe(null),et(null),Ie(null))},[y,e,Ne]),(0,k.useEffect)(()=>{He(null),Be(""),Qe(null),et(null),Ie(null),Ye(null)},[rt]),!e||!h||y)return(0,R.jsx)("div",{ref:le,className:e?D:"contents",children:I});const Et=Ze?xt.find(e=>e.id===Ze):void 0,Rt=Ze?Pe?.get(Ze):void 0,Tt=Ze?Xe?.get(Ze):void 0,qt=Tt?.found?Tt.lineRects[0]:void 0,_t=me&&me!==Ze&&!$e?xt.find(e=>e.id===me):void 0,Ot=xt.filter(e=>{const t=Pe?.get(e.id)??Xe?.get(e.id);return void 0!==t&&!t.found}),Lt=Te.current?.w??600,At=Te.current?.h??400,Ft=Xe?.get(j),Pt="text"===$e?.kind?Ft?.found&&Ft.lineRects[0]?{x:P(Ft.lineRects[0].x,0,Lt),y:P(Ft.lineRects[0].y+Ft.lineRects[0].h,0,At)}:{x:$e.fallbackX,y:$e.fallbackY}:null,zt=!je&&null!==De&&De.rect.w>0&&De.rect.h>0&&null===$e&&null===Ze,Xt="element"===$e?.kind?{x:$e.x,y:$e.y}:Pt,Yt="element"===$e?.kind?$e.anchor.textHint:$e?u($e.anchor.exact,300):"",Dt="text"===$e?.kind?u(`\u2026${$e.anchor.prefix}\xab${$e.anchor.exact}\xbb${$e.anchor.suffix}\u2026`,1100):"";return(0,R.jsxs)("div",{ref:le,role:"presentation",className:D,onKeyDown:jt,children:[I,je&&V&&(0,R.jsx)(te,{onFrame:bt}),(0,R.jsx)("div",{className:r("absolute top-2 right-2 z-20",Se&&"hidden"),children:(0,R.jsx)("button",{type:"button","aria-pressed":je,onClick:wt,className:r("rounded-md border px-3 py-1.5 text-sm font-medium shadow-md",je?"border-accent-pro-200 bg-fill-pro text-oncolor-100":"border-border-300 bg-surface-3 text-primary hover:bg-surface-1"),children:je?(0,R.jsx)(M,{defaultMessage:"Done commenting",id:"cXIcxYfeiJ"}):(0,R.jsx)(M,{defaultMessage:"Comment",id:"LgbKvU/n17"})})}),(0,R.jsxs)("div",{className:"pointer-events-none absolute inset-0 z-10 overflow-hidden",children:[yt&&pe&&(0,R.jsx)("div",{className:"pointer-events-none absolute",style:{left:pe.x,top:pe.y,width:pe.w,height:pe.h,border:`2px solid ${q}`}}),dt.map((e,t)=>{const n=Xe?.get(e.id);if(!n?.found||0===n.lineRects.length)return null;const r=n.lineRects[0];return(0,R.jsxs)("div",{className:"contents",children:[n.lineRects.map((e,t)=>(0,R.jsx)("div",{className:"pointer-events-none absolute",style:{left:e.x,top:e.y,width:e.w,height:e.h,backgroundColor:"rgba(253, 186, 116, 0.35)"}},t)),(0,R.jsx)("button",{type:"button",className:"pointer-events-auto absolute bg-transparent",style:{left:P(r.x-1,0,Math.max(0,Lt-T)),top:P(r.y-23,0,Math.max(0,At-T))},onClick:()=>St(e.id),onMouseEnter:t=>{Ct(t),xe(e.id)},onMouseMove:Ct,onMouseLeave:()=>xe(t=>t===e.id?null:t),"aria-label":$.formatMessage({defaultMessage:"Comment {number} on selected text",id:"c2nYJ59GyU"},{number:it.length+t+1}),children:(0,R.jsx)(ne,{n:it.length+t+1,active:Ze===e.id})})]},e.id)}),"text"===$e?.kind&&Ft?.found&&Ft.lineRects.map((e,t)=>(0,R.jsx)("div",{className:"pointer-events-none absolute",style:{left:e.x,top:e.y,width:e.w,height:e.h,backgroundColor:"rgba(253, 186, 116, 0.55)"}},`draft-${t}`)),it.map((e,t)=>{const n=Pe?.get(e.id);return n&&n.found?(0,R.jsx)("button",{type:"button",className:"pointer-events-auto absolute bg-transparent",style:{left:P(n.x-1,0,Math.max(0,Lt-T)),top:P(n.y-23,0,Math.max(0,At-T))},onClick:()=>St(e.id),onMouseEnter:t=>{Ct(t),xe(e.id)},onMouseMove:Ct,onMouseLeave:()=>xe(t=>t===e.id?null:t),"aria-label":$.formatMessage({defaultMessage:"Comment {number}",id:"BV8rl3I9dc"},{number:t+1}),children:(0,R.jsx)(ne,{n:t+1,active:Ze===e.id,swingIn:null!==Ve&&!Ve.knownIds.has(e.id)})},e.id):null}),Ot.length>0&&(0,R.jsx)("div",{className:"pointer-events-auto absolute bottom-2 left-2 flex max-h-40 flex-col gap-1 overflow-y-auto",children:Ot.map(e=>(0,R.jsx)("button",{type:"button",className:"flex items-center gap-1.5 rounded-full border border-dashed bg-surface-3 px-2 py-0.5 text-xs text-secondary hover:bg-surface-1",onClick:()=>St(e.id),children:(0,R.jsx)(M,{defaultMessage:"Detached comment",id:"//Wx7/3+2u"})},e.id))})]}),"element"===$e?.kind&&$e.anchor.descriptor&&(0,R.jsx)(ee,{descriptor:$e.anchor.descriptor,x:$e.labelX,y:$e.labelY}),je&&de&&V&&(0,R.jsx)(g.div,{"aria-hidden":!0,className:"pointer-events-none absolute left-0 top-0 z-40 size-6 rounded-full rounded-bl-[2px]",style:{x:ge,y:ve,rotate:be,scale:ye,opacity:ye,marginLeft:-1,marginTop:-23,transformOrigin:"1px 23px",backgroundColor:"#fff",boxShadow:`0 0 0 1px ${_}, ${O}`}}),(0,R.jsx)(v,{children:zt&&De&&(0,R.jsx)(g.button,{type:"button",initial:{opacity:0,y:8,scale:.9},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,scale:.9,transition:{duration:.1}},transition:{duration:.18,ease:[.17,.84,.44,1]},className:"absolute z-30 flex size-7 items-center justify-center rounded-full rounded-bl-[2px]",style:{left:P(De.rect.x+De.rect.w/2-14,4,Math.max(4,Lt-32)),top:P(De.rect.y-34,4,Math.max(4,At-32)),backgroundColor:"#fff",boxShadow:`0 0 0 1px ${_}, ${O}`,transformOrigin:"1px 27px"},onClick:Mt,"aria-label":$.formatMessage({defaultMessage:"Comment on selection",id:"FOrqFcMnhI"}),children:(0,R.jsx)(w,{name:"ChatAdd",size:"sm"})})}),(0,R.jsx)(v,{children:(("element"===$e?.kind?$e:null)??Ve)&&(0,R.jsx)(g.div,{"aria-hidden":!0,className:"pointer-events-none absolute z-20 size-6 rounded-full rounded-bl-[2px]",initial:{rotate:"element"===$e?.kind?$e.fromRotate:-90,opacity:1},animate:{rotate:-90},exit:Ve?{opacity:0,transition:{duration:.05}}:{opacity:0,scale:.6},transition:{type:"spring",stiffness:260,damping:16},style:{left:P((("element"===$e?.kind?$e.x:void 0)??Ve?.x??0)-1,0,Math.max(0,Lt-T)),top:P((("element"===$e?.kind?$e.y:void 0)??Ve?.y??0)-23,0,Math.max(0,At-T)),transformOrigin:"1px 23px",backgroundColor:"#fff",boxShadow:`0 0 0 1px ${_}, ${O}`}},$e?.captureId??Ve?.captureId)}),_t&&(0,R.jsx)(g.div,{initial:{opacity:0,scale:.98},animate:{opacity:1,scale:1},transition:A.transition,className:"pointer-events-none absolute left-0 top-0 z-30 w-56 rounded-xl bg-surface-3 p-3",style:{x:we,y:Ce,boxShadow:L},children:(0,R.jsx)("div",{className:"line-clamp-4 whitespace-pre-wrap break-words text-[13px] leading-snug text-primary",children:_t.text})}),(0,R.jsx)(v,{children:$e&&(0,R.jsxs)(g.div,{drag:!0,dragMomentum:!1,dragConstraints:le,dragElastic:.05,initial:{scale:.25,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},transition:{type:"spring",stiffness:420,damping:28},className:"absolute z-30 w-64 cursor-grab rounded-xl bg-surface-3 p-1.5 active:cursor-grabbing",style:{...F({x:Xt?.x??0,y:Xt?.y??0,boundsW:$e.boundsW,boundsH:$e.boundsH}),transformOrigin:"0px 0px",boxShadow:L},children:[(0,R.jsxs)("div",{className:"flex items-center gap-1",children:[(0,R.jsx)("input",{autoFocus:!0,type:"text",className:"h-7 min-w-0 flex-1 cursor-text bg-transparent px-1.5 text-[13px] text-primary outline-none placeholder:text-muted",value:Ue,"aria-label":$.formatMessage({defaultMessage:"Leave a comment\u2026",id:"tmuGYb42BG"}),placeholder:$.formatMessage({defaultMessage:"Leave a comment\u2026",id:"tmuGYb42BG"}),onPointerDownCapture:e=>e.stopPropagation(),onChange:e=>Be(e.target.value),onKeyDown:e=>{e.nativeEvent.isComposing||("Enter"===e.key?(e.preventDefault(),Nt()):"Escape"===e.key&&We.current&&(e.preventDefault(),e.stopPropagation(),He(null)))}}),"element"===$e.kind?(0,R.jsx)(C,{multiline:!0,content:(0,R.jsxs)("span",{className:"flex flex-col gap-0.5",children:[(0,R.jsx)("span",{className:"line-clamp-2 break-words",children:$e.anchor.descriptor}),$e.anchor.textHint&&(0,R.jsx)("span",{className:"line-clamp-2 break-words",children:`\u201c${$e.anchor.textHint}\u201d`}),(0,R.jsx)("span",{className:"line-clamp-3 break-all font-mono",children:$e.anchor.selector})]}),children:(0,R.jsx)("button",{type:"button",className:"mr-1 inline-flex h-5 shrink-0 select-none items-center rounded border bg-surface-1 px-1 font-mono text-[11px] text-secondary transition-colors hover:bg-surface-0",onPointerDownCapture:e=>e.stopPropagation(),"aria-label":$.formatMessage({defaultMessage:"Element context",id:"ycjkaeJDDL"}),children:Z.exec($e.anchor.descriptor)?.[1]??$e.anchor.descriptor.slice(0,12)})}):(0,R.jsx)(C,{multiline:!0,content:(0,R.jsx)("span",{className:"line-clamp-4 break-words",children:Dt}),children:(0,R.jsx)("button",{type:"button",className:"mr-1 inline-flex h-5 shrink-0 select-none items-center rounded border bg-surface-1 px-1 text-secondary transition-colors hover:bg-surface-0",onPointerDownCapture:e=>e.stopPropagation(),onClick:()=>Je(!0),"aria-label":$.formatMessage({defaultMessage:"Selection context",id:"e4jzojVazB"}),children:(0,R.jsx)(w,{name:"ChatAdd",size:"sm"})})}),Ue.trim()&&(0,R.jsx)("button",{type:"button",className:"flex size-7 shrink-0 items-center justify-center rounded-lg text-white transition-[filter] hover:brightness-110",style:{backgroundColor:q},onPointerDownCapture:e=>e.stopPropagation(),onClick:Nt,"aria-label":$.formatMessage({defaultMessage:"Add comment",id:"eiaPxp89eC"}),children:(0,R.jsx)(w,{name:"ArrowUp",size:"sm"})})]}),("text"===$e.kind?Dt:Yt)&&(0,R.jsx)("div",{className:"select-none truncate px-1.5 pb-0.5 text-[10px] leading-[14px] text-muted",children:"text"===$e.kind?Dt:`\u201c${Yt}\u201d`}),Ke&&(0,R.jsx)("div",{className:"mt-1 border-t border-strong px-1.5 pb-0.5 pt-1",onPointerDownCapture:e=>e.stopPropagation(),children:"element"===$e.kind?(0,R.jsxs)(R.Fragment,{children:[$e.anchor.descriptor&&(0,R.jsx)("div",{className:"max-h-8 overflow-y-auto text-[10px] leading-[14px] text-muted",children:$e.anchor.descriptor}),$e.anchor.textHint&&(0,R.jsx)("div",{className:"max-h-8 overflow-y-auto text-[10px] leading-[14px] text-muted",children:`\u201c${$e.anchor.textHint}\u201d`}),(0,R.jsx)("div",{className:"max-h-8 overflow-y-auto break-all font-mono text-[10px] leading-[14px] text-muted",children:$e.anchor.selector})]}):(0,R.jsx)("div",{className:"max-h-16 overflow-y-auto whitespace-pre-wrap break-words text-[10px] leading-[14px] text-muted",children:Dt})})]},$e.captureId)}),Et&&(0,R.jsx)(ae,{comment:Et,replies:lt.get(Et.id)??[],commentProps:h,x:P(Rt?.found?Rt.x+6:qt?qt.x+6:8,8,Math.max(8,Lt-232)),y:P(Rt?.found?Rt.y+6:qt?qt.y+qt.h+6:8,8,Math.max(8,At-160)),onClose:()=>Qe(null)},Et.id)]})}),ae=(0,k.memo)(function({comment:e,replies:t,commentProps:n,x:r,y:s,onClose:o}){const a=S(),i=e.target.anchor,l=n.stagedIds?.has(e.id)??!1;return(0,R.jsxs)(g.div,{...A,className:"absolute z-30 w-56 rounded-xl bg-surface-3 p-3",style:{left:r,top:s,boxShadow:L},children:[(0,R.jsx)("div",{className:"whitespace-pre-wrap break-words text-[13px] leading-snug text-primary",children:e.text}),t.map(e=>(0,R.jsx)("div",{className:"mt-2 ml-2 border-l-2 pl-2 text-[13px] leading-snug text-secondary",children:e.text},e.id)),(0,R.jsxs)("div",{className:"mt-2 flex min-w-0 items-center gap-1.5",children:["element"===i.kind&&i.descriptor&&(0,R.jsx)(V,{descriptor:i.descriptor}),"text-quote"===i.kind&&(0,R.jsx)("div",{className:"truncate text-xs text-muted",children:`\u201c${u(i.exact,80)}\u201d`}),(0,R.jsx)("span",{className:"shrink-0 text-[11px] text-muted",children:new Date(e.createdAt).toLocaleTimeString(a.locale,{hour:"numeric",minute:"2-digit"})}),(0,R.jsxs)("div",{className:"ml-auto flex shrink-0 items-center gap-0.5",children:[n.onSendToClaude&&!l&&(0,R.jsx)(C,{content:a.formatMessage({defaultMessage:"Send to Claude",id:"xGC0T/NxhG"}),children:(0,R.jsx)("button",{type:"button",className:"flex size-5 items-center justify-center rounded text-muted transition-colors hover:bg-surface-1 hover:text-primary",onClick:()=>{n.onSendToClaude?.(e.id),o()},"aria-label":a.formatMessage({defaultMessage:"Send to Claude",id:"xGC0T/NxhG"}),children:(0,R.jsx)(w,{name:"ChatAdd",size:"sm"})})}),(0,R.jsx)("button",{type:"button",className:"flex size-5 items-center justify-center rounded text-muted transition-colors hover:bg-surface-1 hover:text-danger-100",onClick:()=>{n.onCommentDelete(e.id),o()},"aria-label":a.formatMessage({defaultMessage:"Delete comment",id:"wOZRKWT1/R"}),children:(0,R.jsx)(w,{name:"Trash",size:"sm"})}),(0,R.jsx)("button",{type:"button",className:"flex size-5 items-center justify-center rounded text-muted transition-colors hover:bg-surface-1 hover:text-primary",onClick:o,"aria-label":a.formatMessage({defaultMessage:"Close",id:"rbrahOGMC3"}),children:(0,R.jsx)(w,{name:"X",size:"sm"})})]})]})]})});export{Y as n,E as r,oe as t};