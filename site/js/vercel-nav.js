(function () {
  function normalizePath(path) {
    if (!path || path === '/index.html') return '/';
    return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  }

  function getLinkPath(link) {
    var dataPath = link.getAttribute('data-path');
    if (dataPath) return normalizePath(dataPath);
    try {
      return normalizePath(new URL(link.getAttribute('href'), window.location.origin).pathname);
    } catch (e) {
      return '';
    }
  }

  function findActiveIndex(links) {
    var current = normalizePath(window.location.pathname);
    var best = -1;
    var bestLen = -1;

    links.forEach(function (link, index) {
      var linkPath = getLinkPath(link);
      if (!linkPath) return;

      if (linkPath === '/') {
        if (current === '/' && bestLen < 1) {
          best = index;
          bestLen = 1;
        }
        return;
      }

      if (current === linkPath || current.indexOf(linkPath + '/') === 0) {
        if (linkPath.length > bestLen) {
          best = index;
          bestLen = linkPath.length;
        }
      }
    });

    return best;
  }

  function positionElement(el, target, navRect, mode) {
    var rect = target.getBoundingClientRect();

    if (mode === 'hover') {
      el.style.transform = 'translate3d(' + (rect.left - navRect.left) + 'px,' + (rect.top - navRect.top) + 'px,0)';
      el.style.width = rect.width + 'px';
      el.style.height = rect.height + 'px';
      return;
    }

    var width = rect.width * 0.8;
    var x = rect.left - navRect.left + rect.width * 0.1;
    el.style.width = width + 'px';
    el.style.transform = 'translateX(' + x + 'px)';
  }

  function updateMegaPanelTop() {
    var header = document.querySelector('.site-header-nav');
    if (!header) return;
    document.documentElement.style.setProperty('--mega-panel-top', header.getBoundingClientRect().bottom + 'px');
  }

  function initMegaCol3DTouch() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.nav-mega-col').forEach(function (col) {
      if (col.dataset.touch3d === '1') return;
      col.dataset.touch3d = '1';

      col.addEventListener('pointermove', function (e) {
        var rect = col.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        col.style.transform =
          'translateY(-3px) translateZ(8px) rotateX(' + (2 + (-y * 4)) + 'deg) rotateY(' + (x * 5) + 'deg)';
      });

      col.addEventListener('pointerleave', function () {
        col.style.transform = '';
      });
    });
  }

  function portalMegaMenus(nav) {
    nav.querySelectorAll('.vercel-nav-item').forEach(function (item, index) {
      var mega = item.querySelector('.nav-item-mega');
      if (!mega || mega.dataset.portaled === '1') return;
      mega.dataset.portaled = '1';
      if (!mega.id) mega.id = 'nav-mega-panel-' + index;
      item._megaPanel = mega;
      document.body.appendChild(mega);
    });
  }

  function getMega(item) {
    return item._megaPanel || item.querySelector('.nav-item-mega');
  }

  function showMega(mega) {
    if (!mega) return;
    mega.classList.add('is-visible');
    mega.setAttribute('aria-hidden', 'false');
  }

  function hideMega(item, mega) {
    if (!mega || item.classList.contains('is-open')) return;
    mega.classList.remove('is-visible');
    mega.setAttribute('aria-hidden', 'true');
  }

  function closeAllMegas(items) {
    items.forEach(function (item) {
      item.classList.remove('is-open');
      var trigger = item.querySelector('.vercel-nav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      var mega = getMega(item);
      if (mega) {
        mega.classList.remove('is-visible');
        mega.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function initNavItems(nav) {
    var items = nav.querySelectorAll('.vercel-nav-item');

    items.forEach(function (item) {
      var trigger = item.querySelector('.vercel-nav-trigger');
      var mega = getMega(item);
      if (!trigger || !mega) return;

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = item.classList.contains('is-open');
        closeAllMegas(items);
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          showMega(mega);
        }
      });

      item.addEventListener('pointerenter', function () {
        showMega(mega);
      });

      item.addEventListener('pointerleave', function (e) {
        if (mega.contains(e.relatedTarget)) return;
        hideMega(item, mega);
      });

      mega.addEventListener('pointerenter', function () {
        showMega(mega);
      });

      mega.addEventListener('pointerleave', function (e) {
        if (item.contains(e.relatedTarget)) return;
        hideMega(item, mega);
      });
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('.vercel-nav-item') || e.target.closest('.nav-item-mega')) return;
      closeAllMegas(items);
    });
  }

  function initVercelNav(nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('.vercel-nav-trigger'));
    var hoverEl = nav.querySelector('.vercel-nav-hover');
    var underlineEl = nav.querySelector('.vercel-nav-underline');
    if (!links.length || !hoverEl || !underlineEl) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isHovering = false;
    var isFirstHover = true;
    var activeIndex = findActiveIndex(links);

    function setHoverTransition(animate) {
      if (reducedMotion) {
        hoverEl.style.transition = 'opacity 120ms ease';
        underlineEl.style.transition = 'opacity 120ms ease';
        return;
      }
      hoverEl.style.transition = animate
        ? 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), width 150ms ease, height 150ms ease, opacity 150ms ease'
        : 'opacity 150ms ease';
      underlineEl.style.transition = animate
        ? 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), width 150ms ease, opacity 150ms ease'
        : 'opacity 150ms ease';
    }

    function showUnderline(index) {
      if (index < 0) {
        underlineEl.style.opacity = '0';
        return;
      }
      var navRect = nav.getBoundingClientRect();
      setHoverTransition(!isFirstHover);
      positionElement(underlineEl, links[index], navRect, 'underline');
      underlineEl.style.opacity = '1';
    }

    function clearHoverState() {
      isHovering = false;
      isFirstHover = true;
      nav.classList.remove('is-hovering');
      links.forEach(function (link) {
        link.classList.remove('is-hovered');
      });
      hoverEl.style.opacity = '0';
      showUnderline(activeIndex);
    }

    links.forEach(function (link, index) {
      link.classList.toggle('is-active', index === activeIndex);

      function onEnter() {
        isHovering = true;
        nav.classList.add('is-hovering');
        links.forEach(function (item) {
          item.classList.remove('is-hovered');
        });
        link.classList.add('is-hovered');

        var navRect = nav.getBoundingClientRect();
        setHoverTransition(!isFirstHover);
        positionElement(hoverEl, link, navRect, 'hover');
        hoverEl.style.opacity = '1';
        underlineEl.style.opacity = '0';
        isFirstHover = false;
      }

      link.addEventListener('pointerenter', onEnter);
      link.addEventListener('focus', onEnter);

      var item = link.closest('.vercel-nav-item');
      if (item) item.addEventListener('pointerenter', onEnter);
    });

    nav.addEventListener('pointerleave', clearHoverState);
    portalMegaMenus(nav);
    initNavItems(nav);

    window.addEventListener('resize', function () {
      updateMegaPanelTop();
      if (isHovering) {
        var hovered = nav.querySelector('.vercel-nav-trigger.is-hovered');
        if (hovered) {
          var navRect = nav.getBoundingClientRect();
          positionElement(hoverEl, hovered, navRect, 'hover');
        }
      } else {
        showUnderline(activeIndex);
      }
    });

    showUnderline(activeIndex);
  }

  function initMobileMenuGroups() {
    document.querySelectorAll('.mmenu-group').forEach(function (group) {
      var title = group.querySelector('.mmenu-group-title');
      if (!title || title.tagName !== 'BUTTON') return;

      title.addEventListener('click', function () {
        var isOpen = group.classList.contains('is-open');
        document.querySelectorAll('.mmenu-group.is-open').forEach(function (g) {
          g.classList.remove('is-open');
          var btn = g.querySelector('.mmenu-group-title');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          group.classList.add('is-open');
          title.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function initStickyHeader() {
    var header = document.querySelector('.site-header-nav');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      updateMegaPanelTop();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function boot() {
    updateMegaPanelTop();
    initStickyHeader();
    document.querySelectorAll('.vercel-nav').forEach(initVercelNav);
    initMegaCol3DTouch();
    initMobileMenuGroups();

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.vercel-nav').forEach(function (nav) {
          closeAllMegas(nav.querySelectorAll('.vercel-nav-item'));
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
