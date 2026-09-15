/* =========================================================================
   DINUJAYA AKALANKA — MODERN JAVASCRIPT CONTROLLER (script.js)
   Full-Featured Particle System, Responsive Drawer, See More Pagination,
   and Interactive Certificate & Portfolio Lightbox Modals
   ========================================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------------------------
     1. CUSTOM CURSOR (Desktop)
     ------------------------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');

  if (cursor && ring && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = document.querySelectorAll('a, button, .port-card, .cert-card, .project-card, .stat-card');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '54px';
        ring.style.height = '54px';
        ring.style.borderColor = 'rgba(74, 222, 128, 0.9)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(34, 197, 94, 0.65)';
      });
    });
  }

  /* -------------------------------------------------------------------------
     2. PARTICLES CANVAS BACKGROUND
     ------------------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 32 : 75;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 0.6;
        this.alpha = Math.random() * 0.45 + 0.15;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      const maxDist = isMobile ? 85 : 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* -------------------------------------------------------------------------
     3. NAVIGATION (Scroll-Spy, Sticky Glass, Mobile Drawer)
     ------------------------------------------------------------------------- */
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');
  const navSubToggle = document.querySelector('.nav-sub-toggle');
  const navHasSub = document.querySelector('.nav-has-sub');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  function closeMobileNav() {
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (navHasSub) navHasSub.classList.remove('open');
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navOverlay.classList.toggle('open', isOpen);
      document.body.classList.toggle('modal-open', isOpen);
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
  }

  if (navSubToggle && navHasSub) {
    navSubToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = navHasSub.classList.toggle('open');
      navSubToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const allNavAnchors = document.querySelectorAll('.nav-links a');
  allNavAnchors.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      const targetFilter = a.getAttribute('data-filter');

      if (targetFilter) {
        // Trigger portfolio filter
        const portTabBtn = document.querySelector(`.tab-btn[data-filter="${targetFilter}"]`);
        if (portTabBtn) {
          portTabBtn.click();
        }
      }

      if (href && href.startsWith('#')) {
        closeMobileNav();
      }
    });
  });

  // Scrollspy
  const sections = document.querySelectorAll('section[id], header[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    allNavAnchors.forEach((link) => {
      link.classList.remove('active');
      const linkHref = link.getAttribute('href');
      if (linkHref === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* -------------------------------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS
     ------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  /* -------------------------------------------------------------------------
     5. 3D TILT EFFECT ON HERO PROFILE CARD (Desktop)
     ------------------------------------------------------------------------- */
  const profileCard = document.getElementById('profileCard');
  if (profileCard && window.matchMedia('(pointer: fine)').matches) {
    profileCard.parentElement.addEventListener('mousemove', (e) => {
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    profileCard.parentElement.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  /* -------------------------------------------------------------------------
     6. INTRO VIDEO SOUND TOGGLE
     ------------------------------------------------------------------------- */
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const introVideo = document.querySelector('.intro-video');

  if (soundToggle && introVideo) {
    soundToggle.addEventListener('click', () => {
      if (introVideo.muted) {
        introVideo.muted = false;
        soundIcon.textContent = '🔊 Sound On';
        soundToggle.style.background = 'var(--accent)';
        soundToggle.style.color = '#041208';
      } else {
        introVideo.muted = true;
        soundIcon.textContent = '🔇 Sound Off';
        soundToggle.style.background = 'rgba(8, 13, 11, 0.75)';
        soundToggle.style.color = '#fff';
      }
    });
  }

  /* -------------------------------------------------------------------------
     7. SKILLS FILTER TABS & ANIMATED BARS
     ------------------------------------------------------------------------- */
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    bars.forEach((bar) => {
      const pct = bar.getAttribute('data-pct');
      if (pct) bar.style.width = `${pct}%`;
    });
  }

  const skillsSection = document.getElementById('skills-section');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    skillsObserver.observe(skillsSection);
  }

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.getAttribute('data-cat');
      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-skill-cat');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* -------------------------------------------------------------------------
     8. PORTFOLIO GALLERY (CATEGORIES + SEE MORE PAGINATION + LIGHTBOX)
     ------------------------------------------------------------------------- */
  const portTabs = document.querySelectorAll('.portfolio-tabs .tab-btn');
  const portCards = Array.from(document.querySelectorAll('.port-card'));
  const portSeeMoreWrap = document.getElementById('portfolioSeeMoreWrap');
  const portSeeMoreBtn = document.getElementById('portSeeMoreBtn');
  const portCounterText = document.getElementById('portCounterText');
  const portProgressFill = document.getElementById('portProgressFill');

  const INITIAL_PORTFOLIO_LIMIT = 6;
  let currentPortFilter = 'all';
  let isPortExpanded = false;

  function updatePortfolioDisplay() {
    // 1. Determine matching cards for current filter
    const matchingCards = portCards.filter((card) => {
      const cat = card.getAttribute('data-cat');
      return currentPortFilter === 'all' || cat === currentPortFilter;
    });

    const totalMatching = matchingCards.length;
    const limit = isPortExpanded ? totalMatching : Math.min(INITIAL_PORTFOLIO_LIMIT, totalMatching);

    // 2. Show/Hide cards
    portCards.forEach((card) => {
      const cat = card.getAttribute('data-cat');
      const matches = currentPortFilter === 'all' || cat === currentPortFilter;

      if (!matches) {
        card.classList.add('port-hidden');
      } else {
        const indexInMatching = matchingCards.indexOf(card);
        if (indexInMatching < limit) {
          card.classList.remove('port-hidden');
        } else {
          card.classList.add('port-hidden');
        }
      }
    });

    // 3. Update See More Wrap visibility and counter
    if (totalMatching <= INITIAL_PORTFOLIO_LIMIT) {
      if (portSeeMoreWrap) portSeeMoreWrap.style.display = 'none';
    } else {
      if (portSeeMoreWrap) portSeeMoreWrap.style.display = 'flex';

      const visibleCount = limit;
      const pct = Math.round((visibleCount / totalMatching) * 100);

      if (portCounterText) {
        portCounterText.textContent = `Showing ${visibleCount} of ${totalMatching} works (${pct}%)`;
      }
      if (portProgressFill) {
        portProgressFill.style.width = `${pct}%`;
      }

      if (portSeeMoreBtn) {
        const btnText = portSeeMoreBtn.querySelector('.btn-text');
        if (isPortExpanded) {
          if (btnText) btnText.textContent = 'Show Less';
          portSeeMoreBtn.classList.add('expanded');
        } else {
          const remaining = totalMatching - visibleCount;
          if (btnText) btnText.textContent = `Explore More Works (${remaining}+)`;
          portSeeMoreBtn.classList.remove('expanded');
        }
      }
    }
  }

  // Initial display call
  updatePortfolioDisplay();

  // Tab filter click
  portTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      portTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      currentPortFilter = tab.getAttribute('data-filter');
      isPortExpanded = false; // Reset pagination when switching tabs
      updatePortfolioDisplay();
    });
  });

  // Toggle See More button
  if (portSeeMoreBtn) {
    portSeeMoreBtn.addEventListener('click', () => {
      isPortExpanded = !isPortExpanded;
      updatePortfolioDisplay();

      if (!isPortExpanded) {
        // Scroll back smoothly to top of portfolio
        const portSection = document.getElementById('portfolio-section');
        if (portSection) {
          const offsetTop = portSection.offsetTop - 70;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }
    });
  }

  /* -------------------------------------------------------------------------
     9. PORTFOLIO LIGHTBOX MODAL
     ------------------------------------------------------------------------- */
  const portModal = document.getElementById('portModal');
  const portModalClose = document.getElementById('portModalClose');
  const portModalImg = document.getElementById('portModalImg');
  const portModalTitle = document.getElementById('portModalTitle');
  const portModalTag = document.getElementById('portModalTag');
  const portModalDesc = document.getElementById('portModalDesc');
  const portModalLink = document.getElementById('portModalLink');
  const portModalLinkText = document.getElementById('portModalLinkText');

  function openPortModal(card) {
    const img = card.getAttribute('data-port-img');
    const title = card.getAttribute('data-port-title') || '';
    const tag = card.getAttribute('data-port-tag') || '';
    const desc = card.getAttribute('data-port-desc') || '';
    const link = card.getAttribute('data-port-link') || '#';
    const linkText = card.getAttribute('data-port-linktext') || 'Launch Project / View Album';

    if (portModalImg) portModalImg.src = img;
    if (portModalTitle) portModalTitle.textContent = title;
    if (portModalTag) portModalTag.textContent = tag;
    if (portModalDesc) portModalDesc.textContent = desc;
    if (portModalLink) portModalLink.href = link;
    if (portModalLinkText) portModalLinkText.textContent = linkText;

    portModal.classList.add('active');
    portModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closePortModal() {
    if (portModal) {
      portModal.classList.remove('active');
      portModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
  }

  portCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // If user clicked directly on an external <a> link, let it open normally
      if (e.target.closest('a')) {
        return;
      }
      openPortModal(card);
    });
  });

  if (portModalClose) portModalClose.addEventListener('click', closePortModal);
  if (portModal) {
    portModal.addEventListener('click', (e) => {
      if (e.target === portModal) closePortModal();
    });
  }

  /* -------------------------------------------------------------------------
     10. CERTIFICATE VERIFIED PROOF MODAL
     ------------------------------------------------------------------------- */
  const certModal = document.getElementById('certModal');
  const certModalClose = document.getElementById('certModalClose');
  const certModalDoneBtn = document.getElementById('certModalDoneBtn');
  const certModalImg = document.getElementById('certModalImg');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalFrom = document.getElementById('certModalFrom');
  const certModalTag = document.getElementById('certModalTag');
  const certModalOpenBtn = document.getElementById('certModalOpenBtn');
  const certCards = document.querySelectorAll('.cert-clickable');

  function openCertModal(card) {
    const img = card.getAttribute('data-cert-img');
    const title = card.getAttribute('data-cert-title') || 'Certificate of Completion';
    const from = card.getAttribute('data-cert-from') || '';
    const tag = card.getAttribute('data-cert-tag') || 'Verified Credential';

    if (certModalImg) certModalImg.src = img;
    if (certModalTitle) certModalTitle.textContent = title;
    if (certModalFrom) certModalFrom.textContent = from;
    if (certModalTag) certModalTag.textContent = tag;
    if (certModalOpenBtn) certModalOpenBtn.href = img;

    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeCertModal() {
    if (certModal) {
      certModal.classList.remove('active');
      certModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
  }

  certCards.forEach((card) => {
    card.addEventListener('click', () => {
      openCertModal(card);
    });
  });

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
  if (certModalDoneBtn) certModalDoneBtn.addEventListener('click', closeCertModal);
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
  }

  // Keyboard accessibility for ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCertModal();
      closePortModal();
      closeMobileNav();
    }
  });

})();
