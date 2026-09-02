/* =========================================================================
   DINUJAYA AKALANKA — PORTFOLIO INTERACTIVITY SCRIPT (script.js)
   Fully Optimized for Desktop, Tablets & Mobile Devices
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;

  /* -----------------------------------------------------------------------
     1. ANIMATED BACKGROUND — Particle Constellation Network
     ----------------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const mouse = { x: -999, y: -999 };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = isMobile ? Math.min(35, Math.floor((w * h) / 30000)) : Math.min(80, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.6,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.45)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(74, 222, 128, ${0.09 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (finePointer) {
          const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dm < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.28 * (1 - dm / 140)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    if (finePointer) {
      window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
      window.addEventListener('mouseout', () => { mouse.x = -999; mouse.y = -999; });
    }
    resize();
    draw();
  }

  /* -----------------------------------------------------------------------
     2. CUSTOM CURSOR (Only on fine-pointer desktop devices)
     ----------------------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (finePointer && cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    (function trail() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(trail);
    })();

    document.querySelectorAll('a, button, .project-card, .skill-card, .port-card, .cert-card, .lead-card, .stat-card, .contact-card')
      .forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursor.style.width = '12px';
          cursor.style.height = '12px';
          ring.style.width = '48px';
          ring.style.height = '48px';
          ring.style.borderColor = 'rgba(34, 197, 94, 0.9)';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.width = '8px';
          cursor.style.height = '8px';
          ring.style.width = '36px';
          ring.style.height = '36px';
          ring.style.borderColor = 'rgba(34, 197, 94, 0.65)';
        });
      });
  }

  /* -----------------------------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver)
     ----------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* -----------------------------------------------------------------------
     4. SKILL BARS PROGRESS ANIMATION
     ----------------------------------------------------------------------- */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-bar');
        if (bar && bar.dataset.pct) {
          bar.style.width = bar.dataset.pct + '%';
        }
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-card').forEach((c) => barObserver.observe(c));

  /* -----------------------------------------------------------------------
     5. SKILLS CATEGORY FILTER TABS
     ----------------------------------------------------------------------- */
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      skillTabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.cat;

      skillCards.forEach((card) => {
        if (category === 'all' || card.dataset.skillCat === category) {
          card.style.display = 'flex';
          const bar = card.querySelector('.skill-bar');
          if (bar && bar.dataset.pct) {
            bar.style.width = bar.dataset.pct + '%';
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* -----------------------------------------------------------------------
     6. PORTFOLIO MEDIA FILTER TABS
     ----------------------------------------------------------------------- */
  const portTabs = document.querySelectorAll('.portfolio-tabs .tab-btn');
  const portCards = document.querySelectorAll('.port-card');

  portTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      portTabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portCards.forEach((card) => {
        card.style.display = (filter === 'all' || card.dataset.cat === filter) ? 'flex' : 'none';
      });
    });
  });

  /* -----------------------------------------------------------------------
     7. PROFILE 3D CARD HOVER TILT (Only on fine-pointer devices)
     ----------------------------------------------------------------------- */
  const profileCard = document.getElementById('profileCard');
  if (profileCard && finePointer) {
    const wrap = profileCard.closest('.profile-card-container') || profileCard;
    wrap.addEventListener('mousemove', (e) => {
      const rect = profileCard.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const tx = (e.clientX - cx) / rect.width * 10;
      const ty = (e.clientY - cy) / rect.height * 10;
      profileCard.style.transform = `perspective(800px) rotateY(${tx}deg) rotateX(${-ty}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    });
  }

  /* -----------------------------------------------------------------------
     8. MOBILE DRAWER MENU & BACKDROP
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
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMobileNav);
    });
  }

  navOverlay?.addEventListener('click', closeMobileNav);

  /* -----------------------------------------------------------------------
     9. NAV PORTFOLIO SUBMENU TOGGLE & JUMP
     ----------------------------------------------------------------------- */
  document.querySelectorAll('.nav-has-sub').forEach((item) => {
    const toggle = item.querySelector('.nav-sub-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    item.querySelectorAll('.nav-submenu a[data-filter]').forEach((link) => {
      link.addEventListener('click', () => {
        const filter = link.dataset.filter;
        const matchingTab = document.querySelector(`.portfolio-tabs .tab-btn[data-filter="${filter}"]`);
        if (matchingTab) matchingTab.click();
        closeMobileNav();
        item.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-has-sub.open').forEach((item) => {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
        item.querySelector('.nav-sub-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* -----------------------------------------------------------------------
     10. STICKY NAV ON SCROLL
     ----------------------------------------------------------------------- */
  const mainNav = document.getElementById('mainNav');
  const onScroll = () => {
    if (mainNav) mainNav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -----------------------------------------------------------------------
     11. SCROLL-SPY NAVIGATION
     ----------------------------------------------------------------------- */
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a:not(.nav-cta-link)'));
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
      rootMargin: '-35% 0px -45% 0px',
      threshold: 0,
    });

    sections.forEach((s) => spy.observe(s.el));
  }

  /* -----------------------------------------------------------------------
     12. SHOWREEL VIDEO SOUND TOGGLE
     ----------------------------------------------------------------------- */
  const video = document.querySelector('.intro-video');
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');

  if (video && soundToggle && soundIcon) {
    soundToggle.addEventListener('click', function () {
      if (video.muted) {
        video.muted = false;
        soundIcon.textContent = '🔊 Sound On';
      } else {
        video.muted = true;
        soundIcon.textContent = '🔇 Sound Off';
      }
    });
  }

  /* -----------------------------------------------------------------------
     13. IMAGE LOAD ERROR HANDLER
     ----------------------------------------------------------------------- */
  document.querySelectorAll('.port-photo, .profile-photo, .qr-image').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });

});
