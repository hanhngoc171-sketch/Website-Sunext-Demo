/* Global consultation booking modal — opens on “Đặt lịch tư vấn” CTAs */
(function () {
  var PERSONAL = /@(gmail|yahoo|hotmail|outlook|icloud|proton|aol)\./i;
  var CSS_HREFS = [
    "/css/strategy-call.css?v=20260724m",
    "/css/animated-calendar.css",
    "/css/btn-shine.css",
    "/css/consult-modal.css?v=20260724a"
  ];
  var CAL_SRC = "/js/animated-calendar.js?v=20260724a";
  var modal = null;
  var lastFocus = null;
  var ready = null;

  function ensureStylesheet(href) {
    var key = href.split("?")[0];
    if (document.querySelector('link[href*="' + key + '"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (typeof window.SunextInitAnimatedCalendars === "function") {
        resolve();
        return;
      }
      var existing = document.querySelector('script[src*="/js/animated-calendar.js"]');
      if (existing) {
        existing.addEventListener("load", resolve);
        existing.addEventListener("error", reject);
        if (typeof window.SunextInitAnimatedCalendars === "function") resolve();
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function modalHtml() {
    return (
      '<div id="consult-modal" aria-hidden="true">' +
      '<div class="consult-modal-backdrop" data-consult-close></div>' +
      '<div class="consult-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="consult-modal-title">' +
      '<button type="button" class="consult-modal-close" data-consult-close aria-label="Đóng">' +
      '<span class="material-symbols-outlined" aria-hidden="true">close</span></button>' +
      '<div class="sc-bento bg-inverse-surface rounded-[28px] flex flex-col lg:grid lg:grid-cols-2 relative overflow-hidden">' +
      '<div class="sc-info-panel relative overflow-hidden p-6 md:p-8 text-white flex flex-col justify-center">' +
      '<div class="sc-orb sc-orb--info" aria-hidden="true"></div>' +
      '<div class="sc-orb sc-orb--info-b" aria-hidden="true"></div>' +
      '<div class="sc-grid-glow sc-grid-glow--info" aria-hidden="true"></div>' +
      '<div class="sc-info-inner relative z-10">' +
      '<p class="sc-info-eyebrow">Tư vấn chiến lược</p>' +
      '<h2 class="text-h2 mb-4" id="consult-modal-title">Đặt lịch tư vấn chiến lược</h2>' +
      '<p class="sc-info-lead mb-6">30 phút trao đổi 1-1 miễn phí với chuyên gia Sunext để xác định lộ trình AI phù hợp nhất với doanh nghiệp của bạn.</p>' +
      '<div class="sc-info-list">' +
      '<div class="sc-info-row"><span class="sc-info-icon" aria-hidden="true"><span class="material-symbols-outlined">verified</span></span><span class="sc-info-text">Cam kết NDA trước khi tư vấn</span></div>' +
      '<div class="sc-info-row"><span class="sc-info-icon" aria-hidden="true"><span class="material-symbols-outlined">schedule</span></span><span class="sc-info-text">Phản hồi trong 24 giờ làm việc</span></div>' +
      '<div class="sc-info-row"><span class="sc-info-icon" aria-hidden="true"><span class="material-symbols-outlined">call</span></span><a href="tel:0909134153" class="sc-info-text sc-info-link">0909 134 153</a></div>' +
      '<div class="sc-info-row"><span class="sc-info-icon" aria-hidden="true"><span class="material-symbols-outlined">mail</span></span><a href="mailto:contact@sunext.vn" class="sc-info-text sc-info-link">contact@sunext.vn</a></div>' +
      "</div></div></div>" +
      '<div class="sc-form-panel group/form relative overflow-hidden bg-white p-6 md:p-8 rounded-b-[28px] lg:rounded-r-[28px] lg:rounded-bl-none">' +
      '<div class="sc-orb sc-orb--form-a" aria-hidden="true"></div>' +
      '<div class="sc-orb sc-orb--form-b" aria-hidden="true"></div>' +
      '<div class="sc-orb sc-orb--form-c" aria-hidden="true"></div>' +
      '<div class="sc-grid-glow" aria-hidden="true"></div>' +
      '<div class="sc-form-inner relative z-10">' +
      '<div class="sc-form-intro"><p class="sc-form-eyebrow">Đăng ký tư vấn</p>' +
      '<p class="sc-form-lead">Điền thông tin để Sunext liên hệ và xác định bước đi ưu tiên cho doanh nghiệp của bạn.</p></div>' +
      '<form class="sc-form" data-strategy-form data-consult-form>' +
      '<input type="hidden" name="interested_program" value=""/>' +
      '<input type="hidden" name="interested_tier" value=""/>' +
      '<div class="sc-form-fields">' +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">' +
      '<div class="sc-field"><label class="sc-label" for="cm-fullName">Họ và tên *</label>' +
      '<input id="cm-fullName" required class="sc-input" placeholder="Nguyễn Văn A" type="text" name="fullName" autocomplete="name"/></div>' +
      '<div class="sc-field"><label class="sc-label" for="cm-jobTitle">Chức vụ *</label>' +
      '<input id="cm-jobTitle" required class="sc-input" placeholder="CEO / HR Director..." type="text" name="jobTitle" autocomplete="organization-title"/></div>' +
      "</div>" +
      '<div class="sc-field"><label class="sc-label" for="cm-email">Email công ty *</label>' +
      '<input id="cm-email" required class="sc-input" placeholder="name@company.com" type="email" name="email" autocomplete="email"/>' +
      '<p class="hidden sc-email-err text-error text-xs mt-1 font-bold" data-email-err>Vui lòng dùng email công ty (không dùng Gmail/Yahoo/Hotmail...).</p></div>' +
      '<div class="sc-field"><label class="sc-label" for="cm-companyName">Tên doanh nghiệp *</label>' +
      '<input id="cm-companyName" required class="sc-input" placeholder="Công ty ABC" type="text" name="companyName" autocomplete="organization"/></div>' +
      '<div class="sc-field"><label class="sc-label">Ngày mong muốn tư vấn *</label>' +
      '<div class="animated-calendar sc-calendar" data-animated-calendar data-placeholder="Chọn ngày" data-radius="12">' +
      '<input type="hidden" name="preferredDate" required/></div></div>' +
      '<div class="sc-field"><label class="sc-label" for="cm-painPoint">Vấn đề đang gặp *</label>' +
      '<textarea id="cm-painPoint" required class="sc-input sc-textarea" name="painPoint" rows="3" placeholder="Ví dụ: cần tự động hóa sàng lọc CV..."></textarea></div>' +
      "</div>" +
      '<div class="sc-form-footer">' +
      '<label class="sc-consent"><input type="checkbox" name="consent" required class="sc-checkbox"/>' +
      "<span>Tôi đồng ý nhận thông tin tư vấn từ Sunext theo " +
      '<a class="underline text-primary font-semibold" href="/privacy/">Chính sách bảo mật</a>.</span></label>' +
      '<button class="btn-shine sc-submit w-full text-white font-bold" type="submit">Gửi yêu cầu tư vấn</button>' +
      "</div></form></div></div></div></div></div>"
    );
  }

  function bindForm(form) {
    if (form.dataset.consultBound === "1") return;
    form.dataset.consultBound = "1";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = form.querySelector('[name="email"]');
      var err = form.querySelector("[data-email-err]");
      if (em && PERSONAL.test(em.value)) {
        if (err) err.classList.remove("hidden");
        em.focus();
        return;
      }
      if (err) err.classList.add("hidden");
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Đang gửi...";
      }
      setTimeout(function () {
        window.location.href = "/thank-you/";
      }, 800);
    });

    form.querySelectorAll(".sc-field").forEach(function (field) {
      var input = field.querySelector(".sc-input, .animated-calendar-trigger, input, textarea");
      if (!input) return;
      input.addEventListener("focus", function () {
        field.classList.add("is-focused");
      });
      input.addEventListener("blur", function () {
        field.classList.remove("is-focused");
      });
    });
  }

  function ensureModal() {
    if (ready) return ready;
    ready = Promise.resolve()
      .then(function () {
        CSS_HREFS.forEach(ensureStylesheet);
        return loadScript(CAL_SRC);
      })
      .then(function () {
        if (!document.getElementById("consult-modal")) {
          document.body.insertAdjacentHTML("beforeend", modalHtml());
        }
        modal = document.getElementById("consult-modal");
        if (typeof window.SunextInitAnimatedCalendars === "function") {
          window.SunextInitAnimatedCalendars();
        }
        var form = modal.querySelector("[data-consult-form]");
        if (form) bindForm(form);

        modal.addEventListener("click", function (e) {
          if (e.target.closest("[data-consult-close]")) closeModal();
        });
        return modal;
      });
    return ready;
  }

  function openModal() {
    ensureModal().then(function (el) {
      lastFocus = document.activeElement;
      el.classList.add("is-open");
      el.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("consult-modal-open");
      var first = el.querySelector("#cm-fullName");
      if (first) setTimeout(function () { first.focus(); }, 40);
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("consult-modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function normalizeText(el) {
    return (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function isConsultCta(el) {
    var a = el.closest("a, button");
    if (!a || a.closest("#consult-modal")) return null;
    if (a.hasAttribute("data-open-consult")) return a;
    if (a.hasAttribute("data-no-consult-modal")) return null;

    var text = normalizeText(a);
    var href = (a.getAttribute("href") || "").trim();

    // Keep plain "Liên Hệ" nav link as page navigation
    if (text === "liên hệ") return null;

    var keywords = [
      "đặt lịch tư vấn",
      "đăng ký tư vấn",
      "gửi yêu cầu tư vấn",
      "tư vấn lộ trình",
      "đặt lịch trao đổi",
      "xem demo",
      "gửi yêu cầu và nhận phản hồi"
    ];
    for (var i = 0; i < keywords.length; i++) {
      if (text.indexOf(keywords[i]) !== -1) return a;
    }

    if (href.indexOf("#strategy-call") !== -1) return a;

    if (/^\/contact\/?$/.test(href) || href === "/contact/index.html") {
      if (
        a.classList.contains("bg-cta") ||
        a.classList.contains("hero-btn-primary") ||
        a.classList.contains("final-cta-primary") ||
        a.classList.contains("gt-cta-primary") ||
        a.classList.contains("btn-shine") ||
        a.closest("nav.fixed")
      ) {
        return a;
      }
    }

    return null;
  }

  document.addEventListener(
    "click",
    function (e) {
      var cta = isConsultCta(e.target);
      if (!cta) return;
      e.preventDefault();
      openModal();
    },
    true
  );

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  window.SunextOpenConsultModal = openModal;
  window.SunextCloseConsultModal = closeModal;

  // Prefetch modal assets after idle so first open feels instant
  function prefetch() {
    ensureModal().catch(function () {});
  }
  if ("requestIdleCallback" in window) {
    requestIdleCallback(prefetch, { timeout: 2500 });
  } else {
    setTimeout(prefetch, 1200);
  }
})();
