(function () {
  var LINE_HEIGHT = ["0%", "25%", "50%", "75%", "100%"];

  function panelIndex(el) {
    return Number(el.getAttribute("data-tieuchi-panel"));
  }

  function tabIndex(el) {
    return Number(el.getAttribute("data-tieuchi-tab"));
  }

  function initDeptTabs(root) {
    var desktopTabs = root.querySelectorAll(".dept-tab-item");
    var panels = root.querySelectorAll(".dept-panel");
    var lineFill = root.querySelector(".dept-tabs-line-fill");
    if (!panels.length) return;

    function activate(index) {
      desktopTabs.forEach(function (tab) {
        var active = tabIndex(tab) === index;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach(function (panel) {
        var active = panelIndex(panel) === index;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", active ? "false" : "true");
      });
      if (lineFill) lineFill.style.height = LINE_HEIGHT[index] || "0%";
    }

    desktopTabs.forEach(function (tab) {
      tab.setAttribute("role", "tab");
      tab.addEventListener("click", function () {
        activate(tabIndex(tab));
      });
    });

    panels.forEach(function (panel) {
      panel.setAttribute("role", "tabpanel");
    });

    activate(0);
  }

  function boot() {
    document.querySelectorAll("[data-tieuchi-tabs]").forEach(initDeptTabs);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
