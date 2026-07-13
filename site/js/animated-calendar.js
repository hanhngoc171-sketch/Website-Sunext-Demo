(function () {
  var MONTHS = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  var WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function sameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function formatISO(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  function formatDisplay(date) {
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function initCalendar(root) {
    var hidden = root.querySelector('input[type="hidden"]');
    if (!hidden) return;

    var placeholder = root.getAttribute("data-placeholder") || "Chọn ngày";
    var today = startOfDay(new Date());
    var selected = hidden.value ? startOfDay(new Date(hidden.value + "T00:00:00")) : null;
    var viewDate = selected ? new Date(selected) : new Date();
    var animating = false;

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "animated-calendar-trigger";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.innerHTML =
      '<span class="material-symbols-outlined text-[18px] text-primary">calendar_month</span>' +
      '<span class="animated-calendar-label"></span>' +
      '<span class="material-symbols-outlined text-[18px] text-on-surface-variant animated-calendar-chevron">expand_more</span>';

    var label = trigger.querySelector(".animated-calendar-label");
    var popover = document.createElement("div");
    popover.className = "animated-calendar-popover";
    popover.setAttribute("role", "dialog");
    popover.setAttribute("aria-label", "Chọn ngày");

    var selectedNote = document.createElement("p");
    selectedNote.className = "animated-calendar-selected";
    selectedNote.hidden = true;

    var errorNote = document.createElement("p");
    errorNote.className = "animated-calendar-error";
    errorNote.textContent = "Vui lòng chọn ngày tư vấn.";
    errorNote.hidden = true;

    root.appendChild(trigger);
    root.appendChild(popover);
    root.appendChild(selectedNote);
    root.appendChild(errorNote);

    function clearError() {
      root.classList.remove("is-invalid");
      errorNote.hidden = true;
    }

    function showError() {
      root.classList.add("is-invalid");
      errorNote.hidden = false;
      openPopover();
      trigger.focus();
    }

    function updateLabel() {
      if (selected) {
        label.textContent = formatDisplay(selected);
        label.classList.remove("is-placeholder");
        hidden.value = formatISO(selected);
        selectedNote.innerHTML = "Đã chọn: <strong>" + formatDisplay(selected) + "</strong>";
        selectedNote.hidden = false;
        clearError();
      } else {
        label.textContent = placeholder;
        label.classList.add("is-placeholder");
        hidden.value = "";
        selectedNote.hidden = true;
      }
    }

    function buildMonthGrid(date, animClass) {
      var month = document.createElement("div");
      month.className = "animated-calendar-month";
      if (animClass) month.classList.add(animClass);

      var year = date.getFullYear();
      var monthIndex = date.getMonth();
      var firstDay = new Date(year, monthIndex, 1);
      var startOffset = (firstDay.getDay() + 6) % 7;
      var daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      var prevMonthDays = new Date(year, monthIndex, 0).getDate();

      var totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

      for (var i = 0; i < totalCells; i++) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "animated-calendar-day";

        var dayNumber;
        var cellDate;

        if (i < startOffset) {
          dayNumber = prevMonthDays - startOffset + i + 1;
          cellDate = new Date(year, monthIndex - 1, dayNumber);
          btn.classList.add("is-outside");
        } else if (i >= startOffset + daysInMonth) {
          dayNumber = i - startOffset - daysInMonth + 1;
          cellDate = new Date(year, monthIndex + 1, dayNumber);
          btn.classList.add("is-outside");
        } else {
          dayNumber = i - startOffset + 1;
          cellDate = new Date(year, monthIndex, dayNumber);
        }

        btn.textContent = String(dayNumber);
        btn.setAttribute("data-date", formatISO(cellDate));

        if (sameDay(cellDate, today)) btn.classList.add("is-today");
        if (selected && sameDay(cellDate, selected)) btn.classList.add("is-selected");
        if (startOfDay(cellDate) < today) btn.disabled = true;

        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var picked = startOfDay(new Date(this.getAttribute("data-date") + "T00:00:00"));
          if (picked < today) return;
          selected = picked;
          updateLabel();
          renderCalendar();
          closePopover();
          root.dispatchEvent(new CustomEvent("calendar:change", { detail: { value: selected } }));
        });

        month.appendChild(btn);
      }

      return month;
    }

    function renderCalendar(direction) {
      if (animating) return;

      var header = popover.querySelector(".animated-calendar-header");
      if (!header) {
        popover.innerHTML =
          '<div class="animated-calendar-header">' +
          '<button type="button" class="animated-calendar-nav" data-cal-prev aria-label="Tháng trước">' +
          '<span class="material-symbols-outlined text-[18px]">chevron_left</span></button>' +
          '<span class="animated-calendar-title"></span>' +
          '<button type="button" class="animated-calendar-nav" data-cal-next aria-label="Tháng sau">' +
          '<span class="material-symbols-outlined text-[18px]">chevron_right</span></button>' +
          "</div>" +
          '<div class="animated-calendar-weekdays">' +
          WEEKDAYS.map(function (d) {
            return '<span class="animated-calendar-weekday">' + d + "</span>";
          }).join("") +
          "</div>" +
          '<div class="animated-calendar-grid"></div>';

        popover.querySelector("[data-cal-prev]").addEventListener("click", function (e) {
          e.stopPropagation();
          if (animating) return;
          viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
          renderCalendar("right");
        });

        popover.querySelector("[data-cal-next]").addEventListener("click", function (e) {
          e.stopPropagation();
          if (animating) return;
          viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
          renderCalendar("left");
        });
      }

      popover.querySelector(".animated-calendar-title").textContent =
        MONTHS[viewDate.getMonth()] + " " + viewDate.getFullYear();

      var grid = popover.querySelector(".animated-calendar-grid");
      var existing = grid.querySelector(".animated-calendar-month");

      var enterClass = direction === "left"
        ? "is-entering-left"
        : direction === "right"
          ? "is-entering-right"
          : "";
      var leaveClass = direction === "left"
        ? "is-leaving-left"
        : direction === "right"
          ? "is-leaving-right"
          : "";

      var nextMonth = buildMonthGrid(viewDate, enterClass);

      if (existing && direction) {
        animating = true;
        existing.classList.add(leaveClass);
        grid.appendChild(nextMonth);
        setTimeout(function () {
          existing.remove();
          nextMonth.classList.remove(enterClass);
          animating = false;
        }, 240);
      } else {
        grid.innerHTML = "";
        grid.appendChild(nextMonth);
      }
    }

    function openPopover() {
      renderCalendar();
      popover.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      trigger.querySelector(".animated-calendar-chevron").textContent = "expand_less";
    }

    function closePopover() {
      popover.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      trigger.querySelector(".animated-calendar-chevron").textContent = "expand_more";
    }

    function togglePopover() {
      if (popover.classList.contains("is-open")) closePopover();
      else openPopover();
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      togglePopover();
    });

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) closePopover();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePopover();
    });

    root._showCalendarError = showError;
    updateLabel();
  }

  function boot() {
    document.querySelectorAll("[data-animated-calendar]").forEach(initCalendar);

    document.querySelectorAll("[data-strategy-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        var hidden = form.querySelector('[name="preferredDate"]');
        if (!hidden || hidden.value) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        var cal = hidden.closest("[data-animated-calendar]");
        if (cal && cal._showCalendarError) cal._showCalendarError();
      }, true);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
