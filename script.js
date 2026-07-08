/* =========================================================================
   DINUJAYA AKALANKA — PORTFOLIO SCRIPT (script.js)
   =========================================================================
   Feature blocks:
     1. Animated background   → particle network drawn on a <canvas>
     2. Custom cursor         → dot + ring follow the mouse (desktop only)
     3. Scroll reveal         → fades sections in as they enter the viewport
     4. Skill bars            → fills the "My Toolkit" progress bars
     5. Portfolio tab filter  → shows/hides project cards by category
     6. Portfolio image guard → hides a broken image so the placeholder shows
     7. Profile tilt          → gentle 3D tilt of the hero photo
     8. Mobile menu           → hamburger open/close
     9. Nav on scroll         → adds a shadow to the nav after scrolling
    10. Scroll-spy            → highlights the nav link of the section in view

   Edit CONTENT in Portfolio.html, APPEARANCE in styles.css.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* -----------------------------------------------------------------------
     1. ANIMATED BACKGROUND — particle network
     A light, professional constellation of dots that drift, link up when
     close, and gently react to the mouse. Sits behind all content.
     ----------------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const mouse = { x: -999, y: -999 };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      // Particle count scales with screen size (fewer on small screens)
      const count = Math.min(90, Math.floor((w * h) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move + wrap around the edges
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.55)';
        ctx.fill();

        // Link to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(74, 222, 128, ${0.10 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Link to the mouse (a soft highlight in the accent colour)
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 160) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(34, 197, 94, ${0.35 * (1 - dm / 160)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = -999; mouse.y = -999; });
    resize();
    draw();
  }


  /* -----------------------------------------------------------------------
     2. CUSTOM CURSOR (desktop only)
     ----------------------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (finePointer && cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    (function trail() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(trail);
    })();

    document.querySelectorAll('a, button, .port-card, .skill-card, .cert-card, .lead-card, .stat-box')
      .forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursor.style.width = '14px'; cursor.style.height = '14px';
          ring.style.width = '52px'; ring.style.height = '52px';
          ring.style.borderColor = 'rgba(34,197,94,0.9)';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.width = '8px'; cursor.style.height = '8px';
          ring.style.width = '34px'; ring.style.height = '34px';
          ring.style.borderColor = 'rgba(34,197,94,0.6)';
        });
      });
  }


  /* -----------------------------------------------------------------------
     3. SCROLL REVEAL
     ----------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


  /* -----------------------------------------------------------------------
     4. SKILL BARS — fill to data-pct when scrolled into view
     ----------------------------------------------------------------------- */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-bar');
        if (bar) bar.style.width = bar.dataset.pct + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.skill-card').forEach((c) => barObserver.observe(c));


  /* -----------------------------------------------------------------------
     5. PORTFOLIO TAB FILTER
     ----------------------------------------------------------------------- */
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.port-card');
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach((card) => {
        card.style.display = (f === 'all' || card.dataset.cat === f) ? 'flex' : 'none';
      });
    });
  });


  /* -----------------------------------------------------------------------
     6. PORTFOLIO IMAGE GUARD
     If a photo fails to load, hide it so the placeholder icon shows.
     ----------------------------------------------------------------------- */
  document.querySelectorAll('.port-photo, .profile-photo').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });


  /* -----------------------------------------------------------------------
     7. PROFILE PHOTO 3D TILT
     ----------------------------------------------------------------------- */
  const profile = document.getElementById('profileCard');
  if (profile && finePointer) {
    const wrap = profile.closest('.hero-visual') || document;
    wrap.addEventListener('mousemove', (e) => {
      const rect = profile.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const tx = (e.clientX - cx) / rect.width * 12;
      const ty = (e.clientY - cy) / rect.height * 12;
      profile.style.transform = `perspective(800px) rotateY(${tx}deg) rotateX(${-ty}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      profile.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    });
  }


  /* -----------------------------------------------------------------------
     8. MOBILE MENU
     ----------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  const closeMobileNav = () => {
    navLinks?.classList.remove('open');
    navOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navOverlay?.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', closeMobileNav));
  }

  navOverlay?.addEventListener('click', closeMobileNav);


  /* -----------------------------------------------------------------------
     8b. NAV "WORK" CATEGORY SUBMENU
     Caret button opens/closes the dropdown (desktop hover also works via
     CSS). Clicking a category jumps to the portfolio section AND applies
     that category's filter by reusing the existing tab-filter logic above.
     ----------------------------------------------------------------------- */
  document.querySelectorAll('.nav-has-sub').forEach((item) => {
    const toggle = item.querySelector('.nav-sub-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    item.querySelectorAll('.nav-submenu a[data-filter]').forEach((link) => {
      link.addEventListener('click', () => {
        const filter = link.dataset.filter;
        const matchingTab = document.querySelector(`.tab-btn[data-filter="${filter}"]`);
        if (matchingTab) matchingTab.click();
        item.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Close the submenu if you click/tap anywhere else
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-has-sub.open').forEach((item) => {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
        item.querySelector('.nav-sub-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  });


  /* -----------------------------------------------------------------------
     9. NAV ON SCROLL — add a subtle shadow after scrolling down
     ----------------------------------------------------------------------- */
  const nav = document.querySelector('nav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();


  /* -----------------------------------------------------------------------
     10. SCROLL-SPY — highlight the nav link of the section currently in view
     As you move from section to section, the matching top-nav link becomes
     active. (කොටසින් කොටසට යනකොට උඩ nav bar එකේ අදාළ link එක highlight වෙනවා.)
     ----------------------------------------------------------------------- */
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));
  // Match each nav link to the section it points to
  const sections = navAnchors
    .map((a) => {
      const id = a.getAttribute('href');
      const el = id && id.startsWith('#') ? document.querySelector(id) : null;
      return el ? { link: a, el } : null;
    })
    .filter(Boolean);

  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const match = sections.find((s) => s.el === entry.target);
          if (match) {
            navAnchors.forEach((a) => a.classList.remove('active'));
            match.link.classList.add('active');
          }
        }
      });
    }, {
      // A section counts as "current" when its upper part is near the top
      rootMargin: '-45% 0px -50% 0px',
      threshold: 0,
    });

    sections.forEach((s) => spy.observe(s.el));
  }

});
