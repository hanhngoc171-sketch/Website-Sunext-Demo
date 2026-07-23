/* ============================================================
   main.js — Sunext Website
   Tách từ site/index.html (toàn bộ JavaScript inline)
   Thứ tự thực thi được giữ nguyên.
   File này load với defer, chạy sau DOMContentLoaded.
   Phụ thuộc: gsap, ScrollTrigger (loaded trước trong HTML)
   ============================================================ */

/* ── 1. Accordion toggle (lines 3160–3165 trong index.html gốc) ── */
document.querySelectorAll("[data-acc]").forEach(function(btn){
  btn.addEventListener("click", function(){ btn.nextElementSibling.classList.toggle("hidden");
    var ic = btn.querySelector(".material-symbols-outlined"); if(ic) ic.classList.toggle("rotate-180"); });
});

/* ── 2. Scroll Reveal & Micro-interaction System (lines 3168–3316) ── */
(function(){
  /* ── 2.1. Scroll Reveal via IntersectionObserver ── */
  var revealClasses = ['reveal','reveal-up','reveal-scale','reveal-left','reveal-right','section-eyebrow'];
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  /* Auto-tag elements for reveal based on their role */
  function isHeroZone(el){
    return !!(el.closest('.hero-card') || el.closest('.hero-copy') || el.closest('.site-header-nav'));
  }

  function initReveal(){
    /* Section headings */
    document.querySelectorAll('h2, h3').forEach(function(el, i){
      if(isHeroZone(el) || el.closest('.hero-dark') || el.closest('#programs-scroll-section') || el.closest('#dept-tabs-section') || el.classList.contains('reveal') || el.classList.contains('reveal-up')) return;
      el.classList.add('reveal-up');
      io.observe(el);
    });

    /* Cards - tier cards, program cards, case study cards */
    document.querySelectorAll('.enterprise-shadow, [class*="rounded-[24px]"], [class*="rounded-[20px]"]').forEach(function(el, i){
      if(isHeroZone(el) || el.closest('.hero-dark') || el.classList.contains('case-study-card') || el.classList.contains('testimonial-card') || el.closest('.assessment-flip-card')) return;
      el.classList.add('reveal-scale', 'card-hover');
      el.style.transitionDelay = Math.min(i % 4, 3) * 80 + 'ms';
      io.observe(el);
    });

    /* Paragraph text blocks in sections */
    document.querySelectorAll('section p, section ul, section .space-y-3').forEach(function(el){
      if(isHeroZone(el) || el.closest('.hero-dark') || el.closest('#programs-scroll-section') || el.closest('#dept-tabs-section') || el.classList.contains('reveal') || (el.parentElement && el.parentElement.classList.contains('reveal'))) return;
      el.classList.add('reveal');
      io.observe(el);
    });

    /* Trust items */
    document.querySelectorAll('.trust-item').forEach(function(el){ io.observe(el); });

    /* Eyebrow labels */
    document.querySelectorAll('.section-eyebrow').forEach(function(el){ io.observe(el); });

    /* CTA links outside hero only */
    document.querySelectorAll('a[href="/ai-maturity-assessment/"], a[href="/contact/"]').forEach(function(el){
      if(isHeroZone(el)) return;
      el.classList.add('btn-pulse');
    });
  }

  /* ── 2.2. Stagger grid children on scroll ── */
  function initStagger(){
    document.querySelectorAll('section .grid, section [class*="grid-cols"]').forEach(function(grid){
      if(isHeroZone(grid) || grid.closest('.hero-dark') || grid.closest('#case-studies-section') || grid.closest('#programs-scroll-section')) return;
      var children = Array.from(grid.children);
      if(children.length < 2 || children.length > 9) return;
      children.forEach(function(child, i){
        child.classList.add('reveal-scale');
        child.style.transitionDelay = (i * 75) + 'ms';
        io.observe(child);
      });
    });
  }

  /* ── 2.3. Animated number counter ── */
  function countUp(el, target, duration){
    var start = null;
    var raf = function(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var e = 1 - Math.pow(1 - p, 3);
      var val = Math.round(e * target);
      el.textContent = val + (el.dataset.suffix || '');
      if(p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  var numIo = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var el = e.target;
        var target = parseFloat(el.dataset.count);
        if(!isNaN(target)) countUp(el, target, 1800);
        numIo.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  /* Tag stat numbers */
  document.querySelectorAll('[data-count]').forEach(function(el){ numIo.observe(el); });

  /* ── 2.4. Spotlight: card tracks mouse for subtle 3D tilt ── */
  function initTilt(){
    document.querySelectorAll('.card-hover').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = 'translateY(-6px) scale(1.01) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

  /* ── 2.5. Marquee pause on hover ── */
  document.querySelectorAll('[class*="animate-marquee"], .ticker-track').forEach(function(el){
    el.addEventListener('mouseenter', function(){ el.style.animationPlayState = 'paused'; });
    el.addEventListener('mouseleave', function(){ el.style.animationPlayState = 'running'; });
  });

  /* ── 2.6. FAQ smooth accordion ── */
  document.querySelectorAll('[data-acc]').forEach(function(btn){
    var panel = btn.nextElementSibling;
    if(panel){
      panel.style.transition = 'max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease';
      panel.style.overflow = 'hidden';
      panel.style.maxHeight = '0';
      panel.style.opacity = '0';
      panel.classList.remove('hidden');
      btn._open = false;
      btn.addEventListener('click', function(){
        btn._open = !btn._open;
        if(btn._open){
          panel.style.maxHeight = panel.scrollHeight + 'px';
          panel.style.opacity = '1';
        } else {
          panel.style.maxHeight = '0';
          panel.style.opacity = '0';
        }
        var ic = btn.querySelector('.material-symbols-outlined');
        if(ic) ic.style.transform = btn._open ? 'rotate(180deg)' : '';
        ic && (ic.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)');
      });
    }
  });

  /* ── Init all on DOM ready ── */
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ initReveal(); initStagger(); setTimeout(initTilt, 400); });
  } else {
    initReveal(); initStagger(); setTimeout(initTilt, 400);
  }
})();

/* ── 3. Morph Scroll Effect for Lộ trình 6 bước cards (lines 3319–3423) ── */
(function(){
  var SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';

  function spawnParticle(card) {
    var colors = ['#782DDC','#9b4dff','#FF7A00','#a855f7','#f97316'];
    for (var p = 0; p < 6; p++) {
      (function(idx) {
        var dot = document.createElement('span');
        dot.style.cssText = [
          'position:absolute',
          'width:' + (4 + Math.random()*5) + 'px',
          'height:' + (4 + Math.random()*5) + 'px',
          'background:' + colors[idx % colors.length],
          'border-radius:50%',
          'pointer-events:none',
          'z-index:10',
          'left:' + (10 + Math.random()*80) + '%',
          'top:' + (10 + Math.random()*80) + '%',
          'opacity:0',
          'transform:scale(0)',
          'transition:opacity 0.4s ease, transform 0.6s ' + SPRING,
          'will-change:transform,opacity'
        ].join(';');
        card.appendChild(dot);
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){
            var tx = (Math.random()-0.5)*80 + 'px';
            var ty = (Math.random()-0.5)*80 + 'px';
            dot.style.opacity = '1';
            dot.style.transform = 'scale(1) translate(' + tx + ',' + ty + ')';
            setTimeout(function(){
              dot.style.opacity = '0';
              dot.style.transform = 'scale(0) translate(' + tx + ',' + ty + ')';
              setTimeout(function(){ dot.remove(); }, 500);
            }, 350 + idx * 60);
          });
        });
      })(p);
    }
  }

  function initMorphCards() {
    var cards = document.querySelectorAll('.morph-card');
    if (!cards.length) return;

    /* Group by rows: first 3 cards, then last 3 */
    var rows = [[].slice.call(cards, 0, 3), [].slice.call(cards, 3, 6)];

    rows.forEach(function(rowCards) {
      var rowObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var card = entry.target;
            card.classList.add('morph-visible');
            /* Delay glow after morph in */
            var idx = parseInt(card.getAttribute('data-morph-index') || '0') % 3;
            setTimeout(function(){
              card.classList.add('morph-glow');
              spawnParticle(card);
            }, 500 + idx * 110);
            rowObserver.unobserve(card);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

      rowCards.forEach(function(card) {
        /* Remove any conflicting reveal classes added by the general initReveal */
        card.classList.remove('reveal-scale', 'reveal', 'reveal-up', 'visible');
        card.style.transitionDelay = '';
        rowObserver.observe(card);
      });
    });

    /* Hover tilt for morph cards — skip flip-cards (tilt + rotateY conflict / overlap) */
    cards.forEach(function(card) {
      if (card.classList.contains('flip-card')) return;
      card.addEventListener('mousemove', function(e) {
        if (!card.classList.contains('morph-visible')) return;
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width  - 0.5;
        var y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = [
          'perspective(900px)',
          'rotateX(' + (-y * 7) + 'deg)',
          'rotateY(' + (x * 7) + 'deg)',
          'translateY(-8px)',
          'scale(1.02)'
        ].join(' ');
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  }

  /* Run after general initReveal so we can override class assignments */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      setTimeout(initMorphCards, 50);
    });
  } else {
    setTimeout(initMorphCards, 50);
  }
})();

/* ── 4. Orbit hero animation (lines 3426–3543) ── */
(function(){
  var ORBITS = [
    { size:353, dir:'left',  dur:32 },
    { size:501, dir:'right', dur:44 },
    { size:649, dir:'right', dur:56 },
    { size:797, dir:'left',  dur:68 },
  ];

  // AI tool icons via SimpleIcons CDN
  var AI_TOOLS = [
    { name:'ChatGPT',    bg:'#10A37F', src:'https://cdn.simpleicons.org/openai/ffffff',            orbit:1, deg:80,  r:177, sz:58, shape:'o-square', glow:'glow-green',  delay:0.6  },
    { name:'Gemini',     bg:'#4285F4', src:'https://cdn.simpleicons.org/googlegemini/ffffff',       orbit:1, deg:260, r:177, sz:58, shape:'o-round',  glow:'glow-blue',   delay:0.9  },
    { name:'Claude',     bg:'#D97757', src:'https://cdn.simpleicons.org/anthropic/ffffff',          orbit:2, deg:40,  r:251, sz:66, shape:'o-round',  glow:'glow-orange', delay:1.1  },
    { name:'Perplexity', bg:'#1C1C1C', src:'https://cdn.simpleicons.org/perplexity/ffffff',         orbit:2, deg:160, r:251, sz:58, shape:'o-square', glow:'glow-teal',   delay:1.3  },
    { name:'Midjourney', bg:'#000000', src:'https://cdn.simpleicons.org/midjourney/ffffff',         orbit:2, deg:290, r:251, sz:66, shape:'o-squelg', glow:'glow-pink',   delay:1.5  },
    { name:'Make',       bg:'#6D00CC', src:'https://cdn.simpleicons.org/make/ffffff',               orbit:3, deg:70,  r:325, sz:58, shape:'o-squelg', glow:'glow-purple', delay:1.7  },
    { name:'n8n',        bg:'#EA4B20', src:'https://cdn.simpleicons.org/n8n/ffffff',                orbit:3, deg:210, r:325, sz:66, shape:'o-square', glow:'glow-orange', delay:1.9  },
    { name:'Cursor',     bg:'#1A1A2E', src:'https://cdn.simpleicons.org/cursor/ffffff',             orbit:4, deg:30,  r:399, sz:60, shape:'o-round',  glow:'glow-blue',   delay:2.1  },
    { name:'Copilot',    bg:'#0078D4', src:'https://cdn.simpleicons.org/microsoftcopilot/ffffff',   orbit:4, deg:180, r:399, sz:66, shape:'o-squelg', glow:'glow-blue',   delay:2.35 },
  ];

  // 16-ray SVG: 8 long + 8 short alternating
  function makeSunRays(size, longLen, shortLen, color) {
    var c = size / 2;
    var rects = '';
    for (var i = 0; i < 16; i++) {
      var isLong = i % 2 === 0;
      var len = isLong ? longLen : shortLen;
      var w = isLong ? 5 : 3.5;
      rects += '<rect x="'+(c-w/2)+'" y="8" width="'+w+'" height="'+len+'" rx="'+(w/2)+'" transform="rotate('+(i*22.5)+' '+c+' '+c+')" fill="'+color+'" opacity="'+(isLong?'0.6':'0.38')+'"/>';
    }
    return '<svg viewBox="0 0 '+size+' '+size+'" xmlns="http://www.w3.org/2000/svg">'+rects+'</svg>';
  }

  var wrap = document.getElementById('orbits-hero');
  if (!wrap) return;

  var scene = document.createElement('div');
  scene.className = 'orbits-scene';
  wrap.appendChild(scene);

  ORBITS.forEach(function(orb, i){
    var idx = i + 1;
    var spinClass    = orb.dir === 'left' ? 'o-spin-ccw'   : 'o-spin-cw';
    var counterClass = orb.dir === 'left' ? 'o-counter-cw' : 'o-counter-ccw';

    var ring = document.createElement('div');
    ring.className = 'o-ring ' + spinClass;
    ring.style.cssText = 'width:'+orb.size+'px;height:'+orb.size+'px;animation-duration:'+orb.dur+'s';

    // Sun center on orbit 1
    if (idx === 1) {
      var center = document.createElement('div');
      center.className = 'o-center ' + counterClass;
      center.style.animationDuration = orb.dur + 's';
      center.innerHTML =
        '<div class="sun-core">'
        + '<div class="sun-halo"></div>'
        + '<div class="sun-rays-wrap">'+makeSunRays(280, 58, 36, 'rgba(255,210,60,0.7)')+'</div>'
        + '<div class="sun-rays-inner-wrap">'+makeSunRays(240, 42, 26, 'rgba(255,160,30,0.5)')+'</div>'
        + '<div class="sun-ball">'
        + '<span class="o-count-num" id="o-count" style="font-size:54px;font-weight:900;color:#fff;line-height:1;text-shadow:0 2px 10px rgba(120,30,0,0.4)">0</span>'
        + '<span class="o-count-lbl" style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.92);letter-spacing:0.06em;text-transform:uppercase;text-align:center;text-shadow:0 1px 4px rgba(100,20,0,0.35)">Tầng Lộ Trình</span>'
        + '</div>'
        + '</div>';
      ring.appendChild(center);
    }

    // AI tool icons for this orbit
    AI_TOOLS.filter(function(a){ return a.orbit === idx; }).forEach(function(a){
      var pos = document.createElement('div');
      pos.className = 'o-avatar-pos';
      pos.style.transform = 'translate(-50%,-50%) rotate('+a.deg+'deg) translate('+a.r+'px) rotate('+(- a.deg)+'deg)';

      var up = document.createElement('div');
      up.className = 'o-avatar-upright ' + counterClass;
      up.style.animationDuration = orb.dur + 's';

      var icon = document.createElement('div');
      icon.className = 'o-avatar ai-tool-icon ' + a.shape + ' ' + a.glow;
      icon.title = a.name;
      icon.style.cssText = 'width:'+a.sz+'px;height:'+a.sz+'px;background:'+a.bg+';animation-delay:'+a.delay+'s;opacity:0;animation:o-fly-in 0.9s cubic-bezier(0.22,1,0.36,1) forwards;animation-delay:'+a.delay+'s';

      var logo = document.createElement('img');
      logo.src = a.src;
      logo.alt = a.name;
      logo.style.cssText = 'width:62%;height:62%;object-fit:contain;display:block;';
      // Fallback: show tool name initial if logo fails
      logo.onerror = function() {
        icon.innerHTML = '<span style="color:#fff;font-weight:900;font-size:'+(a.sz*0.36)+'px;font-family:Arial;letter-spacing:-0.02em">'+a.name.charAt(0)+'</span>';
      };

      icon.appendChild(logo);
      up.appendChild(icon);
      pos.appendChild(up);
      ring.appendChild(pos);
    });

    scene.appendChild(ring);
  });

  // Count-up to 6
  var el = document.getElementById('o-count');
  if (el) {
    setTimeout(function(){
      var start = null;
      function tick(ts){
        if (!start) start = ts;
        var p = Math.min((ts - start) / 2000, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(e * 6);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, 1200);
  }
})();

/* ── 5. Marquee: AI tool logos (lines 3546–3581) ── */
(function(){
  var track = document.getElementById('ai-marquee');
  if (!track) return;
  var LOGOS = [
    { name:'ChatGPT',    slug:'openai',        color:'10A37F', g:'linear-gradient(135deg,#10a37f,#0d8f6f)' },
    { name:'Gemini',     slug:'googlegemini',  color:'4285F4', g:'linear-gradient(135deg,#4285F4,#1a73e8)' },
    { name:'Claude',     slug:'claude',        color:'D97757', g:'linear-gradient(135deg,#D97757,#c65f3f)' },
    { name:'Perplexity', slug:'perplexity',    color:'20808D', g:'linear-gradient(135deg,#20808D,#1a6b76)' },
    { name:'Midjourney', slug:'midjourney',    color:'782DDC', g:'linear-gradient(135deg,#782DDC,#9b4dff)' },
    { name:'Copilot',    slug:'githubcopilot', color:'0078D4', g:'linear-gradient(135deg,#0078D4,#005a9e)' },
    { name:'Make',       slug:'make',          color:'6D00CC', g:'linear-gradient(135deg,#6D00CC,#8b1fd6)' },
    { name:'n8n',        slug:'n8n',           color:'EA4B20', g:'linear-gradient(135deg,#EA4B20,#c93a15)' }
  ];
  function card(l){
    var c = document.createElement('div');
    c.className = 'logo-card'; c.title = l.name;
    var g = document.createElement('div');
    g.className = 'logo-card-glow'; g.style.background = l.g;
    var img = document.createElement('img');
    img.src = 'https://cdn.simpleicons.org/' + l.slug + '/' + l.color;
    img.alt = l.name; img.loading = 'lazy';
    img.onerror = function(){
      img.style.display = 'none';
      var s = document.createElement('span');
      s.className = 'logo-card-fallback';
      s.textContent = l.name;
      c.appendChild(s);
    };
    c.appendChild(g); c.appendChild(img);
    return c;
  }
  // Render twice for a seamless -50% loop
  LOGOS.concat(LOGOS).forEach(function(l){ track.appendChild(card(l)); });
})();

/* ── 6. Logo intro: colored streak sweeps across → forms the logo (lines 3583–3644) ── */
(function(){
  var host   = document.querySelector('.logo-particles');
  var word   = document.querySelector('.logo-word');
  var streak = document.querySelector('.logo-streak');
  var anim   = document.getElementById('logo-anim');
  if (!host || !word || !streak || !anim) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Match the streak travel distance to the word width
  var W = word.offsetWidth || 90;
  streak.style.setProperty('--streak-end', (W + 20) + 'px');

  var COLORS = ['#782DDC','#9b4dff','#c084fc','#FF7A00','#ffa64d','#ffffff'];
  var N = 22;
  var frag = document.createDocumentFragment();

  for (var i = 0; i < N; i++) {
    var dot = document.createElement('span');
    dot.className = 'logo-dot';
    var color = COLORS[i % COLORS.length];
    var size = 2.5 + Math.random() * 3.5;
    dot.style.width = dot.style.height = size.toFixed(1) + 'px';
    dot.style.background = color;
    dot.style.boxShadow = '0 0 6px ' + color;

    // Particles ride along the horizontal sweep, scattering vertically as a trail
    var startX = -14 + Math.random() * 8;
    var endX   = W + 6 + Math.random() * 10;
    var spreadY = (Math.random() - 0.5) * 26;
    var midY    = (Math.random() - 0.5) * 8;

    dot.style.setProperty('--px-start', startX.toFixed(1) + 'px');
    dot.style.setProperty('--px-end',   endX.toFixed(1) + 'px');
    dot.style.setProperty('--py-mid',   midY.toFixed(1) + 'px');
    dot.style.setProperty('--py-end',   spreadY.toFixed(1) + 'px');
    dot.style.animation = 'logo-dot-stream ' + (0.9 + Math.random()*0.35).toFixed(2) + 's cubic-bezier(0.4,0,0.3,1) forwards';
    dot.style.animationDelay = (0.28 + i * 0.022).toFixed(3) + 's';
    frag.appendChild(dot);
  }
  host.appendChild(frag);

  var style = document.createElement('style');
  style.textContent =
    '@keyframes logo-dot-stream {' +
    '  0%   { opacity:0; transform: translate(var(--px-start), 0) scale(0.5); }' +
    '  20%  { opacity:1; }' +
    '  55%  { opacity:1; transform: translate(calc((var(--px-start) + var(--px-end))/2), var(--py-mid)) scale(1.1); }' +
    ' 100%  { opacity:0; transform: translate(var(--px-end), var(--py-end)) scale(0.4); }' +
    '}' +
    '@keyframes logo-glow-settle {' +
    '  0%   { filter: drop-shadow(0 0 8px rgba(155,77,255,0.9)) drop-shadow(0 0 5px rgba(255,122,0,0.7)); }' +
    ' 100%  { filter: drop-shadow(0 0 0 transparent); }' +
    '}';
  document.head.appendChild(style);

  // Glow settle as the reveal completes (on parent so it won't clobber the reveal clip-path)
  setTimeout(function(){
    anim.style.animation = 'logo-glow-settle 0.7s ease-out forwards';
  }, 1300);
})();

/* ── 7. GSAP: Case Studies batch reveal + stat count-up (lines 3649–3719) ── */
(function(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var section = document.getElementById('case-studies-section');
  if (!section) return;

  gsap.registerPlugin(ScrollTrigger);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = gsap.context(function() {
    if (!reduced) {
      var headTitle = section.querySelector('.case-studies-head-title');
      var headPoints = section.querySelectorAll('.case-studies-head-point');
      var cards = section.querySelectorAll('.case-study-card');

      if (headTitle) gsap.set(headTitle, { autoAlpha: 0, y: 18 });
      if (headPoints.length) gsap.set(headPoints, { autoAlpha: 0, y: 16 });
      if (cards.length) gsap.set(cards, { autoAlpha: 0, y: 24 });

      ScrollTrigger.create({
        trigger: section.querySelector('.case-studies-head') || section,
        start: 'top 88%',
        once: true,
        onEnter: function() {
          var tl = gsap.timeline({ defaults: { ease: 'power2.out', overwrite: 'auto' } });
          if (headTitle) {
            tl.to(headTitle, { autoAlpha: 1, y: 0, duration: 0.45, clearProps: 'transform' }, 0);
          }
          if (headPoints.length) {
            tl.to(headPoints, {
              autoAlpha: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              clearProps: 'transform'
            }, 0.1);
          }
        }
      });

      if (cards.length) {
        ScrollTrigger.batch(cards, {
          onEnter: function(elements) {
            gsap.to(elements, {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              ease: 'power2.out',
              stagger: 0.1,
              overwrite: true,
              clearProps: 'transform'
            });
          },
          start: 'top 88%',
          once: true
        });
      }
    }

    section.querySelectorAll('.case-stat').forEach(function(el) {
      var value = parseFloat(el.dataset.value);
      if (isNaN(value)) return;

      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var decimals = el.dataset.decimals !== undefined
        ? parseInt(el.dataset.decimals, 10)
        : (String(value).indexOf('.') >= 0 ? 1 : 0);
      var counter = { val: reduced ? value : 0 };

      function render() {
        var n = decimals ? counter.val.toFixed(decimals) : Math.round(counter.val);
        el.textContent = prefix + n + suffix;
      }

      render();
      if (reduced) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: function() {
          gsap.to(counter, {
            val: value,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: render
          });
        }
      });
    });
  }, section);

  window.addEventListener('load', function() {
    ScrollTrigger.refresh();
  });

  window.addEventListener('pagehide', function() {
    if (ctx) ctx.revert();
  });
})();

/* ── 8. GSAP: Chương trình đào tạo — step selector + panel transition (lines 3721–3967) ── */
(function(){
  if (typeof gsap === 'undefined') return;

  var section = document.getElementById('programs-scroll-section');
  if (!section) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var panels = [
    section.querySelector('#program-text1'),
    section.querySelector('#program-text2'),
    section.querySelector('#program-text3')
  ].filter(Boolean);
  var stepItems = section.querySelectorAll('.programs-step-item');
  var lineFill = section.querySelector('#programs-line-fill');
  var LINE_HEIGHT = ['0%', '50%', '100%'];
  var currentStep = 0;
  var animating = false;

  if (!panels.length || !stepItems.length) return;

  function initProgramsScrollReveal() {
    if (reduced || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var header = section.querySelector('.programs-scroll-header');
    var stage = section.querySelector('#programs-scroll-stage');
    var stepsNav = section.querySelector('.programs-steps-nav');
    var detailCard = section.querySelector('.programs-detail-card');
    var mobileGrid = section.querySelector('.programs-mobile-only .grid');
    var mobileCards = [];

    if (header) {
      gsap.set(header.children, { autoAlpha: 0, y: 36 });
    }

    if (stepsNav) {
      gsap.set(stepItems, { autoAlpha: 0, x: -24 });
    }

    if (detailCard) {
      gsap.set(detailCard, { autoAlpha: 0, y: 28, scale: 0.97 });
    }

    if (mobileGrid) {
      Array.prototype.forEach.call(mobileGrid.children, function(col) {
        if (col.classList.contains('lg:col-span-2')) {
          col.querySelectorAll(':scope > div').forEach(function(card) {
            mobileCards.push(card);
          });
        } else {
          mobileCards.push(col);
        }
      });
      if (mobileCards.length) {
        gsap.set(mobileCards, { autoAlpha: 0, y: 32 });
      }
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top 78%',
      once: true,
      onEnter: function() {
        if (header) {
          gsap.to(header.children, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
            overwrite: true
          });
        }
      }
    });

    if (stage && stepsNav && detailCard) {
      ScrollTrigger.create({
        trigger: stage,
        start: 'top 82%',
        once: true,
        onEnter: function() {
          gsap.to(stepItems, {
            autoAlpha: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.12,
            ease: 'power2.out',
            overwrite: true
          });
          gsap.to(detailCard, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            ease: 'power2.out',
            delay: 0.08,
            overwrite: true
          });
          if (lineFill) {
            gsap.fromTo(lineFill,
              { height: '0%' },
              {
                height: LINE_HEIGHT[currentStep],
                duration: 0.9,
                ease: 'power2.inOut',
                delay: 0.18,
                overwrite: true
              }
            );
          }
        }
      });
    }

    if (mobileGrid && mobileCards.length) {
      ScrollTrigger.create({
        trigger: mobileGrid,
        start: 'top 88%',
        once: true,
        onEnter: function() {
          gsap.to(mobileCards, {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            stagger: 0.14,
            ease: 'power2.out',
            overwrite: true
          });
        }
      });
    }
  }

  initProgramsScrollReveal();

  function showStep(step, animate) {
    if (step < 0 || step > 2 || step === currentStep) return;

    var prev = currentStep;
    currentStep = step;

    stepItems.forEach(function(btn, i) {
      var active = i === step;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (lineFill) lineFill.style.height = LINE_HEIGHT[step];

    if (!animate || reduced) {
      panels.forEach(function(panel, i) {
        var active = i === step;
        panel.classList.toggle('is-active', active);
        panel.toggleAttribute('hidden', !active);
        gsap.set(panel, { autoAlpha: active ? 1 : 0, y: 0 });
      });
      return;
    }

    if (animating) {
      gsap.killTweensOf(panels);
      animating = false;
    }
    animating = true;

    var outPanel = panels[prev];
    var inPanel = panels[step];

    gsap.to(outPanel, {
      autoAlpha: 0,
      y: -8,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: function() {
        outPanel.classList.remove('is-active');
        outPanel.setAttribute('hidden', '');
      }
    });

    inPanel.classList.add('is-active');
    inPanel.removeAttribute('hidden');
    gsap.fromTo(inPanel,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.32,
        ease: 'power2.out',
        delay: 0.08,
        onComplete: function() { animating = false; }
      }
    );
  }

  function bindStepClicks() {
    stepItems.forEach(function(btn) {
      var step = parseInt(btn.dataset.step, 10);
      if (isNaN(step)) return;

      btn.addEventListener('click', function() {
        showStep(step, true);
      });
      btn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showStep(step, true);
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          showStep(Math.min(step + 1, 2), true);
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          showStep(Math.max(step - 1, 0), true);
        }
      });
    });
  }

  var mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', function() {
    panels.forEach(function(panel, i) {
      gsap.set(panel, { autoAlpha: i === 0 ? 1 : 0, y: 0 });
    });
    if (lineFill) lineFill.style.height = '0%';
    bindStepClicks();

    return function() {
      animating = false;
      currentStep = 0;
      panels.forEach(function(panel, i) {
        gsap.set(panel, { clearProps: 'opacity,visibility,transform' });
        panel.classList.toggle('is-active', i === 0);
        panel.toggleAttribute('hidden', i !== 0);
      });
      stepItems.forEach(function(btn, i) {
        btn.classList.toggle('is-active', i === 0);
        btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      });
      if (lineFill) lineFill.style.height = '0%';
    };
  });
})();

/* ── 9. GSAP: Phương pháp luận 5 bước — stagger entrance (lines 3970–4067) ── */
(function(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var section = document.getElementById('phuong-phap-section');
  if (!section) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  gsap.registerPlugin(ScrollTrigger);

  var header = section.querySelector('.text-center.mb-stack-lg');
  var steps = section.querySelectorAll('.growth-step');
  var bars = section.querySelectorAll('.growth-bar');
  var labels = section.querySelectorAll('.growth-label');
  var ground = document.getElementById('growth-ground');
  var arrowTip = document.getElementById('growth-arrow-tip');
  var panel = document.getElementById('growth-panel');

  if (!steps.length) return;

  function playEntrance() {
    if (header) {
      gsap.to(header.children, {
        autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', overwrite: true
      });
    }
    gsap.to(bars, {
      scaleY: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.1,
      overwrite: true
    });
    gsap.to(labels, {
      autoAlpha: 1, y: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.35,
      overwrite: true
    });
    if (ground) {
      gsap.to(ground, {
        scaleX: 1,
        duration: 0.9,
        ease: 'power2.inOut',
        delay: 0.5,
        overwrite: true
      });
    }
    if (arrowTip) {
      gsap.to(arrowTip, {
        autoAlpha: 1, x: 0,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.85,
        overwrite: true
      });
    }
    if (panel) {
      gsap.to(panel, {
        autoAlpha: 1, y: 0,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.55,
        overwrite: true
      });
    }
  }

  if (header) gsap.set(header.children, { autoAlpha: 0, y: 28 });
  gsap.set(bars, { scaleY: 0, transformOrigin: 'bottom center' });
  gsap.set(labels, { autoAlpha: 0, y: 8 });
  if (panel) gsap.set(panel, { autoAlpha: 0, y: 20 });
  if (arrowTip) gsap.set(arrowTip, { autoAlpha: 0, x: -8 });

  var shell = section.querySelector('.growth-shell') || section;
  var played = false;

  ScrollTrigger.create({
    trigger: shell,
    start: 'top 80%',
    once: true,
    onEnter: function() {
      if (played) return;
      played = true;
      playEntrance();
    }
  });

  if (shell.getBoundingClientRect().top < window.innerHeight * 0.8) {
    played = true;
    playEntrance();
  }
})();

/* ── 9b. GSAP: Roadmap flow — AnimatedBeam + step stagger ── */
(function(){
  var section = document.getElementById('roadmap-intro');
  var shell = document.getElementById('roadmap-flow');
  var svg = document.getElementById('roadmap-beams');
  if (!section || !shell || !svg) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nodes = shell.querySelectorAll('[data-beam-node]');
  var beamPairs = [];
  var resizeTimer = null;
  var gradientTweens = [];

  var COLORS = [
    { start: '#782DDC', stop: '#A855F7' },
    { start: '#A855F7', stop: '#FF7A00' },
    { start: '#FF7A00', stop: '#782DDC' },
    { start: '#782DDC', stop: '#FF7A00' }
  ];

  function nodeCenter(el) {
    var c = shell.getBoundingClientRect();
    var r = el.getBoundingClientRect();
    return {
      x: r.left - c.left + r.width / 2,
      y: r.top - c.top + r.height / 2
    };
  }

  function curvedPath(x1, y1, x2, y2, curvature) {
    var mx = (x1 + x2) / 2;
    var my = (y1 + y2) / 2;
    var dx = x2 - x1;
    var cy = my + dx * curvature * 0.45;
    return 'M ' + x1 + ',' + y1 + ' Q ' + mx + ',' + cy + ' ' + x2 + ',' + y2;
  }

  function clearBeams() {
    gradientTweens.forEach(function(t) { if (t && t.kill) t.kill(); });
    gradientTweens = [];
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    beamPairs = [];
  }

  function buildBeams() {
    if (window.matchMedia('(max-width: 640px)').matches) {
      clearBeams();
      return;
    }
    if (nodes.length < 2) return;

    clearBeams();
    var ns = 'http://www.w3.org/2000/svg';
    var defs = document.createElementNS(ns, 'defs');
    svg.appendChild(defs);

    for (var i = 0; i < nodes.length - 1; i++) {
      var from = nodeCenter(nodes[i]);
      var to = nodeCenter(nodes[i + 1]);
      var curvature = (i % 2 === 0) ? 0.4 : -0.4;
      var d = curvedPath(from.x, from.y, to.x, to.y, curvature);
      var colors = COLORS[i % COLORS.length];
      var gid = 'roadmap-beam-grad-' + i;

      var grad = document.createElementNS(ns, 'linearGradient');
      grad.setAttribute('id', gid);
      grad.setAttribute('gradientUnits', 'userSpaceOnUse');
      grad.setAttribute('x1', String(from.x));
      grad.setAttribute('y1', String(from.y));
      grad.setAttribute('x2', String(to.x));
      grad.setAttribute('y2', String(to.y));

      var stops = [
        { offset: '0%', color: colors.start, opacity: '0' },
        { offset: '15%', color: colors.start, opacity: '1' },
        { offset: '85%', color: colors.stop, opacity: '1' },
        { offset: '100%', color: colors.stop, opacity: '0' }
      ];
      stops.forEach(function(s) {
        var stop = document.createElementNS(ns, 'stop');
        stop.setAttribute('offset', s.offset);
        stop.setAttribute('stop-color', s.color);
        stop.setAttribute('stop-opacity', s.opacity);
        grad.appendChild(stop);
      });
      defs.appendChild(grad);

      var base = document.createElementNS(ns, 'path');
      base.setAttribute('d', d);
      base.setAttribute('class', 'beam-base');
      svg.appendChild(base);

      var glow = document.createElementNS(ns, 'path');
      glow.setAttribute('d', d);
      glow.setAttribute('class', 'beam-glow');
      glow.setAttribute('stroke', 'url(#' + gid + ')');
      svg.appendChild(glow);

      beamPairs.push({
        grad: grad,
        from: from,
        to: to,
        base: base,
        glow: glow,
        delay: i * 0.35,
        duration: 2.8
      });
    }

    if (!reduced && typeof gsap !== 'undefined') {
      beamPairs.forEach(function(pair) {
        var dx = pair.to.x - pair.from.x;
        var dy = pair.to.y - pair.from.y;
        gsap.set(pair.grad, {
          attr: {
            x1: pair.from.x - dx,
            y1: pair.from.y - dy,
            x2: pair.from.x,
            y2: pair.from.y
          }
        });
        var tween = gsap.to(pair.grad, {
          attr: {
            x1: pair.to.x,
            y1: pair.to.y,
            x2: pair.to.x + dx,
            y2: pair.to.y + dy
          },
          duration: pair.duration,
          delay: pair.delay,
          ease: 'none',
          repeat: -1
        });
        gradientTweens.push(tween);
      });
    } else {
      // Static gradient spanning the segment when motion is reduced
      beamPairs.forEach(function(pair) {
        pair.grad.setAttribute('x1', String(pair.from.x));
        pair.grad.setAttribute('y1', String(pair.from.y));
        pair.grad.setAttribute('x2', String(pair.to.x));
        pair.grad.setAttribute('y2', String(pair.to.y));
      });
    }
  }

  function scheduleRebuild() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildBeams, 80);
  }

  window.addEventListener('resize', scheduleRebuild);
  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(scheduleRebuild);
    ro.observe(shell);
  }

  // Initial draw after layout
  requestAnimationFrame(function() {
    buildBeams();
  });

  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var eyebrow = section.querySelector('.roadmap-intro-eyebrow');
  var title = section.querySelector('.roadmap-intro-title');
  var cols = section.querySelectorAll('.roadmap-intro-col');
  var icons = shell.querySelectorAll('.roadmap-flow-icon');
  var labels = shell.querySelectorAll('.roadmap-flow-text');
  var pillarsLabel = section.querySelector('.roadmap-pillars-label');
  var pillars = section.querySelectorAll('.roadmap-pillars li');
  var played = false;

  if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: 18 });
  if (title) gsap.set(title, { autoAlpha: 0, y: 28 });
  if (cols.length) gsap.set(cols, { autoAlpha: 0, y: 24 });
  /* Icons: scale/opacity only so beam node centers stay stable */
  if (icons.length) gsap.set(icons, { autoAlpha: 0, scale: 0.6 });
  if (labels.length) gsap.set(labels, { autoAlpha: 0, y: 10 });
  if (pillarsLabel) gsap.set(pillarsLabel, { autoAlpha: 0, y: 10 });
  if (pillars.length) gsap.set(pillars, { autoAlpha: 0, y: 12 });
  gsap.set(svg, { autoAlpha: 0 });

  function playEntrance() {
    buildBeams();
    var tl = gsap.timeline({
      defaults: { ease: 'power2.out', overwrite: 'auto' },
      onComplete: function() {
        if (icons.length) gsap.set(icons, { clearProps: 'willChange' });
        buildBeams();
      }
    });

    if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.45 }, 0);
    if (title) tl.to(title, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.08);
    if (cols.length) {
      tl.to(cols, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.2);
    }

    if (icons.length) {
      gsap.set(icons, { willChange: 'transform, opacity' });
      tl.to(icons, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.45,
        stagger: 0.09,
        ease: 'back.out(1.6)'
      }, 0.4);
    }
    if (labels.length) {
      tl.to(labels, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.09 }, 0.5);
    }
    tl.to(svg, { autoAlpha: 1, duration: 0.55, ease: 'power2.out' }, 0.55);
    if (pillarsLabel) {
      tl.to(pillarsLabel, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.95);
    }
    if (pillars.length) {
      tl.to(pillars, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06
      }, 1.0);
    }
  }

  function tryPlay() {
    if (played) return;
    var rect = section.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.88 && rect.bottom > 64) {
      played = true;
      playEntrance();
    }
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top 88%',
    once: true,
    onEnter: tryPlay
  });

  if (typeof IntersectionObserver !== 'undefined') {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          tryPlay();
          io.disconnect();
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    io.observe(section);
  }

  requestAnimationFrame(function() {
    ScrollTrigger.refresh();
    tryPlay();
  });
  window.addEventListener('load', function() {
    ScrollTrigger.refresh();
    buildBeams();
    tryPlay();
  });
  window.addEventListener('hashchange', tryPlay);
  window.addEventListener('scroll', tryPlay, { passive: true });
  setTimeout(tryPlay, 120);
})();

/* ── 9c. GSAP: Assessment bento — light entrance (transform/opacity) ── */
(function(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var section = document.getElementById('assessment-problem-section');
  if (!section) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  var cards = section.querySelectorAll('.bento-card');
  var played = false;
  if (!cards.length) return;

  gsap.set(cards, { autoAlpha: 0, y: 22 });

  function play() {
    gsap.to(cards, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  function tryPlay() {
    if (played) return;
    var rect = section.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.88 && rect.bottom > 80) {
      played = true;
      play();
    }
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top 85%',
    once: true,
    onEnter: tryPlay
  });

  if (typeof IntersectionObserver !== 'undefined') {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          tryPlay();
          io.disconnect();
        }
      });
    }, { threshold: 0.15 });
    io.observe(section);
  }

  requestAnimationFrame(tryPlay);
  window.addEventListener('load', tryPlay);
  setTimeout(tryPlay, 120);
})();

/* ── 10. Assessment flip card — tap/keyboard support (lines 4071–4086) ── */
(function(){
  var card = document.querySelector('.assessment-flip-card');
  if (!card) return;

  card.addEventListener('click', function() {
    card.classList.toggle('is-flipped');
  });

  card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('is-flipped');
    }
  });
})();

/* ── 11. Tag arrow_forward icons for hover animation (lines 4092–4100) ── */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.material-symbols-outlined').forEach(function (el) {
    if (el.textContent.trim() === 'arrow_forward') {
      el.classList.add('arrow-icon');
    }
  });
});

/* ── 12. Animated Theme Toggle (lines 4103–4130) ── */
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  // Read saved or system preference
  var saved = localStorage.getItem('sunext-theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var isDark = saved === 'dark' || (!saved && prefersDark);
  if (isDark) document.documentElement.classList.add('dark');

  btn.addEventListener('click', function () {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('sunext-theme', isDark ? 'dark' : 'light');

    // Burst animation
    btn.classList.remove('burst');
    void btn.offsetWidth; // reflow to restart animation
    btn.classList.add('burst');
    btn.addEventListener('animationend', function handler() {
      btn.classList.remove('burst');
      btn.removeEventListener('animationend', handler);
    });
  });
})();

/* ── 13. Partner marquee: brand logos below training section (lines 4134–4177) ── */
(function(){
  var track = document.getElementById('partner-marquee');
  if (!track) return;
  var PARTNERS = [
    { name:'FPT',               src:'https://i.postimg.cc/52Sxjk50/FPT.png' },
    { name:'MUFG',              src:'https://i.postimg.cc/rwN8zYG5/MUFG.png' },
    { name:'BIDV',              src:'https://i.postimg.cc/4xQJnFvX/BIDV.png' },
    { name:'Prudential',        src:'https://i.postimg.cc/VNsztB4X/Prudential.png' },
    { name:'Vinhomes',          src:'https://i.postimg.cc/BvZJFcNY/Vinhomes.png' },
    { name:'VNPT',              src:'https://i.postimg.cc/7LPqzMXB/VNPT.png' },
    { name:'Mitsubishi',        src:'https://i.postimg.cc/RZLMqb1f/Mitsubishi.png' },
    { name:'PV Power',          src:'https://i.postimg.cc/7ZnxbQ11/Petro-Vietnam-Power.png' },
    { name:'PTSC',              src:'https://i.postimg.cc/Jh7RXcKN/PTSC.png' },
    { name:'VACS',              src:'https://i.postimg.cc/434XcbwW/VACS.png' },
    { name:'HTV',               src:'https://i.postimg.cc/T3JRhHjy/HTV.png' },
    { name:'Gấu Đỏ',           src:'https://i.postimg.cc/CxsFd6CB/Gau-Do.png' },
    { name:'YenViet',           src:'https://i.postimg.cc/1zRyFcMj/Yen-Viet.png' },
    { name:'Trung Sơn Pharma',  src:'https://i.postimg.cc/yN67RXnn/Trung-Son-Pharma.png' }
  ];
  function makeCard(p) {
    var c = document.createElement('div');
    c.className = 'partner-logo-card';
    c.title = p.name;
    var glow = document.createElement('div');
    glow.className = 'logo-card-glow';
    var img = document.createElement('img');
    img.src = p.src;
    img.alt = p.name;
    img.loading = 'lazy';
    img.onerror = function(){
      img.style.display = 'none';
      var s = document.createElement('span');
      s.className = 'logo-card-fallback';
      s.textContent = p.name;
      c.appendChild(s);
    };
    c.appendChild(glow);
    c.appendChild(img);
    return c;
  }
  // Render twice for seamless -50% loop
  PARTNERS.concat(PARTNERS).forEach(function(p){ track.appendChild(makeCard(p)); });
})();

/* ── 14. Privacy Toast (lines 4199–4222) ── */
document.addEventListener('DOMContentLoaded', function() {
  var toast = document.getElementById('privacy-toast');
  var closeBtn = document.getElementById('privacy-toast-close');

  if (!toast || !closeBtn) return;

  if (!localStorage.getItem('privacy_toast_dismissed')) {
    setTimeout(function() {
      toast.classList.remove('translate-y-[150%]', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 1500);
  } else {
    toast.remove();
  }

  closeBtn.addEventListener('click', function() {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[150%]', 'opacity-0');
    localStorage.setItem('privacy_toast_dismissed', 'true');
    setTimeout(function() { toast.remove(); }, 500);
  });
});

/* ── 15. Form submit handler (lines 3069–3083) ── */
(function(){
  var PERSONAL = /@(gmail|yahoo|hotmail|outlook|icloud|proton|aol)\./i;
  document.querySelectorAll("[data-strategy-form]").forEach(function(f){
    f.addEventListener("submit", function(e){
      e.preventDefault();
      var em = f.querySelector('[name=email]'); var err = f.querySelector("[data-email-err]");
      if (PERSONAL.test(em.value)) { err.classList.remove("hidden"); em.focus(); return; }
      err.classList.add("hidden");
      var btn = f.querySelector("button[type=submit]");
      btn.disabled = true; btn.textContent = "Đang gửi...";
      setTimeout(function(){ window.location.href = "/thank-you/"; }, 800);
    });
  });
})();

/* ── Hero points: expand details ── */
document.addEventListener("DOMContentLoaded", function () {
  var wrap = document.getElementById("hero-points");
  var btn = document.getElementById("hero-more-btn");
  var panel = document.getElementById("hero-more-panel");
  if (!wrap || !btn || !panel) return;

  var label = btn.querySelector(".hero-more-label");

  btn.addEventListener("click", function () {
    var open = wrap.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "");
    }
    if (label) label.textContent = open ? "Thu gọn" : "Xem chi tiết";
  });
});

/* ── Leadership cards: Expanded Map interaction (tilt + expand) ── */
(function(){
  var roots = document.querySelectorAll('[data-leader-card]');
  if (!roots.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  roots.forEach(function(root) {
    var face = root.querySelector('[data-leader-card-face]');
    if (!face) return;

    function toggle() {
      var open = root.classList.toggle('is-expanded');
      root.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    root.addEventListener('click', toggle);
    root.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    if (reduced || typeof gsap === 'undefined') {
      root.addEventListener('mouseenter', function(){ root.classList.add('is-hovered'); });
      root.addEventListener('mouseleave', function(){ root.classList.remove('is-hovered'); });
      return;
    }

    gsap.set(face, { transformPerspective: 1000, force3D: true });
    var rotateXTo = gsap.quickTo(face, 'rotationX', { duration: 0.35, ease: 'power3.out' });
    var rotateYTo = gsap.quickTo(face, 'rotationY', { duration: 0.35, ease: 'power3.out' });

    root.addEventListener('mousemove', function(e) {
      var rect = face.getBoundingClientRect();
      var dx = e.clientX - (rect.left + rect.width / 2);
      var dy = e.clientY - (rect.top + rect.height / 2);
      rotateXTo((Math.max(-50, Math.min(50, -dy)) / 50) * 8);
      rotateYTo((Math.max(-50, Math.min(50, dx)) / 50) * 8);
    });
    root.addEventListener('mouseenter', function(){ root.classList.add('is-hovered'); });
    root.addEventListener('mouseleave', function(){
      root.classList.remove('is-hovered');
      rotateXTo(0);
      rotateYTo(0);
    });
  });
})();

/* ── Strategy form UI motion (transform/opacity only) ── */
(function(){
  var section = document.getElementById('strategy-call');
  if (!section || typeof gsap === 'undefined') return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fields = section.querySelectorAll('[data-sc-reveal]');
  var submit = section.querySelector('.sc-submit');
  var orbs = section.querySelectorAll('[data-sc-orb]');
  var ctx;
  var pulseTweens = [];

  function bindFocusLift() {
    section.querySelectorAll('.sc-field').forEach(function(field) {
      var target = field.querySelector('.sc-input') || field.querySelector('.animated-calendar-trigger');
      var yTo = reduced ? null : gsap.quickTo(field, 'y', { duration: 0.28, ease: 'power3.out' });
      if (target) gsap.set(target, { transformOrigin: '50% 50%' });
      var scaleTo = (!reduced && target) ? gsap.quickTo(target, 'scale', { duration: 0.28, ease: 'power3.out' }) : null;
      field.addEventListener('focusin', function() {
        field.classList.add('is-focused');
        if (yTo) yTo(-4);
        if (scaleTo) scaleTo(1.01);
      });
      field.addEventListener('focusout', function() {
        field.classList.remove('is-focused');
        if (yTo) yTo(0);
        if (scaleTo) scaleTo(1);
      });
      if (!reduced && yTo) {
        field.addEventListener('pointerenter', function(){ if (!field.classList.contains('is-focused')) yTo(-3); });
        field.addEventListener('pointerleave', function(){ if (!field.classList.contains('is-focused')) yTo(0); });
      }
    });
  }

  function bindSubmitHover() {
    if (!submit || reduced) return;
    var scaleTo = gsap.quickTo(submit, 'scale', { duration: 0.28, ease: 'power3.out' });
    submit.addEventListener('pointerenter', function(){ scaleTo(1.025); });
    submit.addEventListener('pointerleave', function(){ scaleTo(1); });
  }

  function bindOrbs() {
    if (!orbs.length) return;
    if (reduced) {
      gsap.set(orbs, { opacity: 0.75 });
      return;
    }
    orbs.forEach(function(orb, i) {
      gsap.set(orb, { transformOrigin: '50% 50%' });
      pulseTweens.push(
        gsap.to(orb, {
          scale: 1.18 + i * 0.04,
          opacity: 0.55 + (i % 2) * 0.2,
          duration: 2.4 + i * 0.35,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        })
      );
    });

    var formPanel = section.querySelector('.sc-form-panel');
    if (!formPanel) return;
    var movers = [];
    orbs.forEach(function(orb) {
      movers.push({
        xTo: gsap.quickTo(orb, 'x', { duration: 0.55, ease: 'power3.out' }),
        yTo: gsap.quickTo(orb, 'y', { duration: 0.55, ease: 'power3.out' })
      });
    });
    formPanel.addEventListener('pointermove', function(e) {
      var rect = formPanel.getBoundingClientRect();
      var nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      var ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      movers.forEach(function(m, i) {
        var amp = 18 + i * 8;
        m.xTo(nx * amp);
        m.yTo(ny * amp);
      });
    });
    formPanel.addEventListener('pointerleave', function() {
      movers.forEach(function(m) { m.xTo(0); m.yTo(0); });
    });
  }

  function reveal() {
    if (reduced || !fields.length || typeof ScrollTrigger === 'undefined') {
      gsap.set(fields, { clearProps: 'all' });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    ctx = gsap.context(function() {
      gsap.set(fields, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(fields, {
        start: 'top 92%',
        once: true,
        onEnter: function(batch) {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.08,
            overwrite: true
          });
        }
      });
    }, section);
  }

  function bindInfoMotion() {
    var infoItems = section.querySelectorAll('[data-sc-info-reveal]');
    var rows = section.querySelectorAll('.sc-info-row');
    if (!reduced) {
      rows.forEach(function(row) {
        var icon = row.querySelector('.sc-info-icon');
        if (!icon) return;
        var yTo = gsap.quickTo(row, 'y', { duration: 0.28, ease: 'power3.out' });
        var scaleTo = gsap.quickTo(icon, 'scale', { duration: 0.28, ease: 'power3.out' });
        gsap.set(icon, { transformOrigin: '50% 50%' });
        row.addEventListener('pointerenter', function(){ yTo(-3); scaleTo(1.06); });
        row.addEventListener('pointerleave', function(){ yTo(0); scaleTo(1); });
      });
    }
    if (reduced || !infoItems.length || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.context(function() {
      gsap.set(infoItems, { autoAlpha: 0, y: 20 });
      ScrollTrigger.batch(infoItems, {
        start: 'top 92%',
        once: true,
        onEnter: function(batch) {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: 'power3.out',
            stagger: 0.07,
            overwrite: true
          });
        }
      });
    }, section);
  }

  bindFocusLift();
  bindSubmitHover();
  bindOrbs();
  bindInfoMotion();
  reveal();

  window.addEventListener('pagehide', function() {
    if (ctx) ctx.revert();
    pulseTweens.forEach(function(t){ t.kill(); });
  });
})();
