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

  function initVercelNav(nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('.vercel-nav-link'));
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
    });

    nav.addEventListener('pointerleave', clearHoverState);

    window.addEventListener('resize', function () {
      if (isHovering) {
        var hovered = nav.querySelector('.vercel-nav-link.is-hovered');
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

  function boot() {
    document.querySelectorAll('.vercel-nav').forEach(initVercelNav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
