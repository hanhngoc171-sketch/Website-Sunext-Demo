/* Sunext language switcher: Eng / Viet */
(function () {
  var STORAGE_KEY = "sunext-lang";
  var ATTR_SRC = "data-i18n-src";
  var ATTR_DONE = "data-i18n-bound";
  var viStore = new WeakMap();

  function dict() {
    return window.SUNEXT_I18N_DICT || {};
  }

  function normalize(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function currentLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    return saved === "en" ? "en" : "vi";
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang === "en" ? "en" : "vi");
    document.documentElement.lang = lang === "en" ? "en" : "vi";
    document.documentElement.setAttribute("data-lang", lang === "en" ? "en" : "vi");
    applyLang(lang);
    syncSwitcher(lang);
  }

  function shouldSkip(node) {
    var p = node.parentElement;
    if (!p) return true;
    var tag = p.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "CODE" || tag === "PRE") return true;
    if (p.closest("[data-no-i18n]")) return true;
    if (p.classList.contains("material-symbols-outlined")) return true;
    if (p.classList.contains("logo-word") || p.id === "logo-anim") return true;
    if (p.closest(".partner-logo-card")) return true;
    return false;
  }

  function translateTextNode(node, lang, map) {
    var raw = node.nodeValue;
    if (!raw || !normalize(raw)) return;
    if (!viStore.has(node)) viStore.set(node, raw);

    if (lang !== "en") {
      node.nodeValue = viStore.get(node);
      return;
    }

    var original = viStore.get(node);
    var key = normalize(original);
    var en = map[key];
    if (!en) return;
    var m = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
    node.nodeValue = (m ? m[1] : "") + en + (m ? m[3] : "");
  }

  function translateAttr(el, attr, lang, map) {
    if (!el.hasAttribute(attr)) return;
    var storeKey = ATTR_SRC + "-" + attr;
    if (!el.hasAttribute(storeKey)) {
      el.setAttribute(storeKey, el.getAttribute(attr) || "");
    }
    var original = el.getAttribute(storeKey) || "";
    if (lang !== "en") {
      el.setAttribute(attr, original);
      return;
    }
    var en = map[normalize(original)];
    if (en) el.setAttribute(attr, en);
  }

  function applyLang(lang) {
    var map = dict();
    var root = document.body;
    if (!root) return;

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (shouldSkip(node)) return;
      translateTextNode(node, lang, map);
    });

    document.querySelectorAll("[placeholder],[aria-label],[title]").forEach(function (el) {
      if (el.closest("[data-no-i18n]")) return;
      translateAttr(el, "placeholder", lang, map);
      translateAttr(el, "aria-label", lang, map);
      translateAttr(el, "title", lang, map);
    });

    // Document title
    if (!document.documentElement.hasAttribute(ATTR_SRC + "-title")) {
      document.documentElement.setAttribute(ATTR_SRC + "-title", document.title);
    }
    var titleVi = document.documentElement.getAttribute(ATTR_SRC + "-title") || document.title;
    if (lang === "en" && map[normalize(titleVi)]) {
      document.title = map[normalize(titleVi)];
    } else {
      document.title = titleVi;
    }
  }

  function syncSwitcher(lang) {
    document.querySelectorAll("[data-lang-switch]").forEach(function (wrap) {
      wrap.querySelectorAll("[data-lang]").forEach(function (btn) {
        var on = btn.getAttribute("data-lang") === lang;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
  }

  function buildSwitcher() {
    var existing = document.getElementById("lang-switch");
    if (existing) return existing;

    var wrap = document.createElement("div");
    wrap.id = "lang-switch";
    wrap.className = "lang-switch";
    wrap.setAttribute("data-lang-switch", "");
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Language");
    wrap.innerHTML =
      '<button type="button" class="lang-switch-btn" data-lang="en" aria-pressed="false">Eng</button>' +
      '<button type="button" class="lang-switch-btn" data-lang="vi" aria-pressed="false">Viet</button>';

    // Prefer header actions area (next to CTA)
    var headerActions = document.querySelector(
      "header .flex.items-center.gap-4, header .flex.items-center.gap-3"
    );
    var themeBtn = document.getElementById("theme-toggle");
    if (themeBtn && themeBtn.parentNode) {
      themeBtn.parentNode.replaceChild(wrap, themeBtn);
      return wrap;
    }
    if (headerActions) {
      var cta = headerActions.querySelector('a[href="/contact/"], a.bg-cta');
      if (cta) headerActions.insertBefore(wrap, cta);
      else headerActions.insertBefore(wrap, headerActions.firstChild);
      return wrap;
    }
    document.body.appendChild(wrap);
    return wrap;
  }

  function ensureStyles() {
    if (document.getElementById("lang-switch-style")) return;
    var css = document.createElement("link");
    css.id = "lang-switch-style";
    css.rel = "stylesheet";
    css.href = "/css/lang-switch.css?v=20260724a";
    document.head.appendChild(css);
  }

  function bindSwitcher(wrap) {
    if (wrap.getAttribute(ATTR_DONE) === "1") return;
    wrap.setAttribute(ATTR_DONE, "1");
    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-lang]");
      if (!btn || !wrap.contains(btn)) return;
      setLang(btn.getAttribute("data-lang") === "en" ? "en" : "vi");
    });
  }

  function boot() {
    ensureStyles();
    var wrap = buildSwitcher();
    bindSwitcher(wrap);
    setLang(currentLang());

    // Re-apply when dynamic UI (consult modal) is injected
    var mo = new MutationObserver(function (mutations) {
      if (currentLang() !== "en") return;
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var n = nodes[j];
          if (!n || n.nodeType !== 1) continue;
          if (n.id === "consult-modal" || (n.querySelector && n.querySelector("#consult-modal, [data-animated-calendar], .partner-marquee-label"))) {
            applyLang("en");
            return;
          }
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Partner marquee / late content
    setTimeout(function () {
      if (currentLang() === "en") applyLang("en");
    }, 900);
  }

  window.SunextSetLang = setLang;
  window.SunextApplyLang = applyLang;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
