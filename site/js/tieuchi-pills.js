/* Tieuchi pills: left/right items + center card */
(function () {
  function initGroup(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll(".tieuchi-item"));
    var cards = Array.prototype.slice.call(root.querySelectorAll(".tieuchi-card"));
    if (!items.length || !cards.length) return;

    // Prefer explicit data-tieuchi-index; fallback to document order
    items.sort(function (a, b) {
      var ai = Number(a.getAttribute("data-tieuchi-index"));
      var bi = Number(b.getAttribute("data-tieuchi-index"));
      if (Number.isNaN(ai) || Number.isNaN(bi)) return 0;
      return ai - bi;
    });

    function indexOf(item) {
      var raw = Number(item.getAttribute("data-tieuchi-index"));
      if (!Number.isNaN(raw)) return raw;
      return items.indexOf(item);
    }

    function activate(index) {
      index = Math.max(0, Math.min(cards.length - 1, index));
      items.forEach(function (item) {
        var on = indexOf(item) === index;
        item.classList.toggle("active", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
      });
      cards.forEach(function (card, i) {
        var on = i === index;
        card.classList.toggle("active", on);
        card.setAttribute("aria-hidden", on ? "false" : "true");
      });
    }

    items.forEach(function (item) {
      var i = indexOf(item);
      item.setAttribute("type", "button");
      item.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      item.addEventListener("click", function () {
        activate(i);
      });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate(i);
        }
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          var next = Math.min(i + 1, cards.length - 1);
          activate(next);
          var nextBtn = items.find(function (el) { return indexOf(el) === next; });
          if (nextBtn) nextBtn.focus();
        }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          var prev = Math.max(i - 1, 0);
          activate(prev);
          var prevBtn = items.find(function (el) { return indexOf(el) === prev; });
          if (prevBtn) prevBtn.focus();
        }
      });
    });

    activate(0);
  }

  function boot() {
    document.querySelectorAll("[data-tieuchi-pills]").forEach(initGroup);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
