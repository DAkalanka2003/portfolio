/* =========================================================================
   DINUJAYA AKALANKA — MODERN JAVASCRIPT CONTROLLER (script.js)
   Full-Featured Particle System, Responsive Drawer, See More Pagination,
   Interactive Certificate Lightbox, Portfolio Lightbox, and
   Ultra-Compact Non-Scrolling Project Details & Interface Modal
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
    if (navLinks) navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
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
  const navItems = document.querySelectorAll('.nav-links > li > a');

  function highlightNavOnScroll() {
    let scrollPosition = window.scrollY + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNavOnScroll);

  /* -------------------------------------------------------------------------
     4. 3D INTERACTIVE HERO PROFILE CARD
     ------------------------------------------------------------------------- */
  const card = document.getElementById('profileCard');
  if (card && window.matchMedia('(hover: hover)').matches) {
    const container = card.parentElement;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / (rect.height / 2)) * 14;
      const rotateY = (x / (rect.width / 2)) * 14;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    container.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  /* -------------------------------------------------------------------------
     5. VIDEO SOUND TOGGLE
     ------------------------------------------------------------------------- */
  const video = document.querySelector('.intro-video');
  const soundBtn = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');

  if (video && soundBtn) {
    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        soundIcon.textContent = '🔇 Sound Off';
        soundBtn.classList.remove('unmuted');
      } else {
        soundIcon.textContent = '🔊 Sound On';
        soundBtn.classList.add('unmuted');
      }
    });
  }

  /* -------------------------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS
     ------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          if (entry.target.classList.contains('skill-card')) {
            const bar = entry.target.querySelector('.skill-bar');
            if (bar) {
              const pct = bar.getAttribute('data-pct');
              bar.style.width = `${pct}%`;
            }
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* -------------------------------------------------------------------------
     7. SKILLS CATEGORY FILTER
     ------------------------------------------------------------------------- */
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const selectedCat = tab.getAttribute('data-cat');

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-skill-cat');
        if (selectedCat === 'all' || cardCat === selectedCat) {
          card.style.display = 'flex';
          setTimeout(() => {
            const bar = card.querySelector('.skill-bar');
            if (bar) {
              const pct = bar.getAttribute('data-pct');
              bar.style.width = `${pct}%`;
            }
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* -------------------------------------------------------------------------
     8. PORTFOLIO SHOWCASE: CATEGORY FILTERING & "SEE MORE" PAGINATION
     ------------------------------------------------------------------------- */
  const portTabs = document.querySelectorAll('.tab-btn');
  const portCards = document.querySelectorAll('.port-card');
  const portSeeMoreBtn = document.getElementById('seeMoreBtn');
  const currentShownCountEl = document.getElementById('currentShownCount');
  const totalItemsCountEl = document.getElementById('totalItemsCount');
  const paginationWrap = document.getElementById('portfolioPaginationWrap');

  const ITEMS_PER_PAGE = 6;
  let currentPortFilter = 'all';
  let isPortExpanded = false;

  function updatePortfolioDisplay() {
    let matchingCards = [];

    portCards.forEach((card) => {
      const cardCat = card.getAttribute('data-cat');
      if (currentPortFilter === 'all' || cardCat === currentPortFilter) {
        matchingCards.push(card);
      } else {
        card.classList.remove('port-card-visible');
        card.style.display = 'none';
      }
    });

    const totalMatching = matchingCards.length;
    const limit = isPortExpanded ? totalMatching : Math.min(ITEMS_PER_PAGE, totalMatching);

    matchingCards.forEach((card, index) => {
      if (index < limit) {
        card.style.display = 'flex';
        card.classList.add('port-card-visible');
      } else {
        card.classList.remove('port-card-visible');
        card.style.display = 'none';
      }
    });

    const visibleCount = Math.min(limit, totalMatching);
    if (currentShownCountEl) currentShownCountEl.textContent = visibleCount;
    if (totalItemsCountEl) totalItemsCountEl.textContent = totalMatching;

    if (paginationWrap && portSeeMoreBtn) {
      if (totalMatching <= ITEMS_PER_PAGE) {
        paginationWrap.style.display = 'none';
      } else {
        paginationWrap.style.display = 'flex';
        const btnText = portSeeMoreBtn.querySelector('.btn-text');
        if (isPortExpanded) {
          if (btnText) btnText.textContent = 'Show Less Works';
          portSeeMoreBtn.classList.add('expanded');
        } else {
          const remaining = totalMatching - visibleCount;
          if (btnText) btnText.textContent = `Explore More Works (${remaining}+)`;
          portSeeMoreBtn.classList.remove('expanded');
        }
      }
    }
  }

  updatePortfolioDisplay();

  portTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      portTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      currentPortFilter = tab.getAttribute('data-filter');
      isPortExpanded = false;
      updatePortfolioDisplay();
    });
  });

  if (portSeeMoreBtn) {
    portSeeMoreBtn.addEventListener('click', () => {
      isPortExpanded = !isPortExpanded;
      updatePortfolioDisplay();

      if (!isPortExpanded) {
        const portSection = document.getElementById('portfolio-section');
        if (portSection) {
          const offsetTop = portSection.offsetTop - 70;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }
    });
  }

  /* -------------------------------------------------------------------------
     MODAL UTILITIES & STRICT SCROLL POSITION RETENTION
     ------------------------------------------------------------------------- */
  let savedScrollY = 0;

  function lockPageScroll() {
    savedScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    document.body.classList.add('modal-open');
  }

  function unlockPageScroll() {
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    if (activeModals.length === 0) {
      document.body.classList.remove('modal-open');
      window.scrollTo({
        top: savedScrollY,
        left: 0,
        behavior: 'instant'
      });
    }
  }

  /* -------------------------------------------------------------------------
     9. UNIFIED PORTFOLIO DETAILS & MEDIA SHOWCASE MODAL (21 Items with Side Nav)
     ------------------------------------------------------------------------- */
  const PORTFOLIO_ITEMS = [
    {
      id: 'alumni-directory',
      title: 'Alumni Success Directory & Career Blueprints Hub',
      tag: 'UI / UX Design · University Web Portal (COSC 31103)',
      category: 'COSC 31103 Group Leader Project',
      year: '2026',
      subtitle: 'COSC 31103 (Web & Internet Technologies) · Group Leader & Lead Full-Stack Dev',
      browserUrl: 'alumni-directory-portal.surge.sh',
      liveUrl: 'https://alumni-directory-portal.surge.sh',
      imgSrc: 'Images/alumni-directory-preview.png',
      btnText: 'Launch Live Alumni Portal',
      overview: 'Official digital mentorship and alumni engagement web portal developed for the Department of Statistics & Computer Science, University of Kelaniya as the COSC 31103 course project (serving as Group Leader & Lead Full-Stack Developer).',
      highlights: [
        { label: 'Role & Scope', val: 'COSC 31103 Group Leader & Lead Full-Stack Dev' },
        { label: 'Directory Search', val: 'Real-time fuzzy search across alumni records' },
        { label: 'Dual Verification', val: 'Photo & multi-page PDF document verification' },
        { label: '4-Pillar Moderation', val: 'Approval workflows, live editing & record management' }
      ],
      techPills: ['Semantic HTML5 / CSS3', 'Vanilla JS (ES6+)', 'Photo/PDF Dual Engine', 'Surge.sh Edge CDN', 'HTTPS SSL']
    },
    {
      id: 'richpath-pro',
      title: 'RichPath Pro (Finance & Executive Suite)',
      tag: 'UI / UX Design · PWA & Finance App',
      category: 'Full-Stack Progressive Web App',
      year: '2026',
      subtitle: 'Full-Stack Progressive Web App (PWA) & Comprehensive Financial Architecture',
      browserUrl: 'richpath-finance.surge.sh',
      liveUrl: 'https://richpath-finance.surge.sh/',
      imgSrc: 'Images/richpath-preview.png',
      btnText: 'Launch RichPath Pro App',
      overview: 'An advanced personal, academic & financial management web application featuring multi-currency tracking, client-side AES-256 encrypted vault, semester scheduler, and offline PWA sync.',
      highlights: [
        { label: 'Finance Analytics', val: 'Multi-currency tracking & cashflow forecasting' },
        { label: 'Encrypted Security Safe', val: 'Client-side AES-256 credential & password vault' },
        { label: 'Academic Hub', val: 'Semester milestone countdowns & priority notes' },
        { label: 'PWA Offline Sync', val: 'Installable cross-device app with offline caching' }
      ],
      techPills: ['JavaScript (ES6+)', 'Web Crypto (AES-256)', 'PWA Offline Sync', 'LocalStorage Engine', 'Surge.sh CDN']
    },
    {
      id: 'dak-studio',
      title: 'DAK Studio Official Website',
      tag: 'UI / UX Design · Web Platform',
      category: 'Commercial Business Platform',
      year: '2024 – Present',
      subtitle: 'Commercial Brand Architecture & Creative Media Production Platform',
      browserUrl: 'dakstudio-official.vercel.app',
      liveUrl: 'http://dakstudio-official.vercel.app/',
      imgSrc: 'Images/dak-studio-preview.png',
      btnText: 'Visit Live DAK Studio Website',
      overview: 'Official commercial platform for DAK Studio multimedia, video & photography services. Features an interactive creative portfolio showcase, automated client quotation workflows, and dark glassmorphic responsive UI.',
      highlights: [
        { label: 'Creative Showcase', val: 'Categorized photography & video production galleries' },
        { label: 'Client Reservation', val: 'Automated date reservation inquiries & direct routing' },
        { label: 'Design Systems', val: 'Modern glassmorphic dark theme built for visual media' },
        { label: 'High-Speed Cloud', val: 'High-performance edge deployment on Vercel CDN' }
      ],
      techPills: ['HTML5 & CSS3', 'JavaScript (ES6+)', 'UI/UX Design Systems', 'Responsive Layouts', 'Vercel Cloud Edge']
    },
    {
      id: 'hela-weda-gedara',
      title: 'Hela Weda Gedara (Official Platform)',
      tag: 'UI / UX Design · Indigenous Wellness',
      category: 'Corporate Client Platform',
      year: '2026',
      subtitle: 'Indigenous Wellness & Holistic Healthcare Web Platform',
      browserUrl: 'hela-weda-gedara-final-urli.vercel.app',
      liveUrl: 'https://hela-weda-gedara-final-urli.vercel.app/',
      imgSrc: 'Images/hela-weda-gedara-preview.png',
      btnText: 'Visit Live Hela Weda Gedara',
      overview: 'Corporate web portal developed for 100 International / Hela Weda Gedara, presenting traditional Ayurvedic wellness remedies and medical consultation services with clean digital elegance.',
      highlights: [
        { label: 'Remedies Directory', val: 'Detailed breakdown of indigenous therapies & herbs' },
        { label: 'Consultation Booking', val: 'Intuitive consultation scheduling with validation' },
        { label: 'Accessible Interface', val: 'High-contrast legible typography for all demographics' },
        { label: 'Backend Architecture', val: 'Secure PHP form handlers and dynamic content modules' }
      ],
      techPills: ['Semantic HTML5', 'Modular CSS3', 'JavaScript', 'PHP Backend Integration', 'Vercel Edge']
    },
    {
      id: 'unposed-moments',
      title: 'Unposed Moments LK Photography Platform',
      tag: 'UI / UX Design · Photography & Booking',
      category: 'Commercial Portfolio & Booking',
      year: '2024 – 2026',
      subtitle: 'Commercial Photography Portfolio & Client Reservation Portal',
      browserUrl: 'unposed-moments-lk-one.vercel.app',
      liveUrl: 'https://unposed-moments-lk-one.vercel.app/',
      imgSrc: 'Images/unposed-moments-preview.png',
      btnText: 'Visit Live Unposed Moments',
      overview: 'Commercial reservation platform for Unposed Moments (Pvt) Ltd, enabling wedding and event photography clients to explore story albums and check photographer availability.',
      highlights: [
        { label: 'Fullscreen Lightbox', val: 'High-fidelity photo viewer with touch gestures' },
        { label: 'Event Booking Workflow', val: 'Streamlined booking calendar & client intake' },
        { label: 'Visual Hierarchy', val: 'Minimalist editorial styling focusing on photography' },
        { label: 'Edge Performance', val: 'Zero-dependency vanilla scripts delivering instant loads' }
      ],
      techPills: ['HTML5 & CSS3', 'JavaScript (ES6+)', 'Gallery Lightbox Engine', 'Vercel Cloud Edge']
    },
    // --- DAK PHOTOGRAPHY (6 Items) ---
    {
      id: 'dak-preshoot',
      title: 'Iruni & Mayura Pre-Shoot',
      tag: 'DAK Photography · Portraiture',
      category: 'DAK Photography',
      year: '2025',
      subtitle: 'Outdoor Couple Storytelling & Cinematic Golden Hour Portraits',
      browserUrl: 'facebook.com/DAKStudio',
      liveUrl: 'https://www.facebook.com/share/18jDVeC7r9/',
      imgSrc: 'Images/PreShoot.webp',
      btnText: 'View Album on Facebook',
      overview: 'Outdoor couple pre-shoot photography with custom cinematic color grading, natural golden-hour ambient lighting, and depth-of-field portrait aesthetics.',
      highlights: [
        { label: 'Lighting Scheme', val: 'Natural golden-hour backlighting & subtle reflector fill' },
        { label: 'Color Science', val: 'Warm cinematic tones with calibrated skin tone retention' },
        { label: 'Composition', val: 'Rule of thirds, environmental framing & coastal vista' },
        { label: 'Post-Production', val: 'Detailed retouching & grading in Adobe Lightroom Classic' }
      ],
      techPills: ['Portrait Photography', 'Adobe Lightroom', 'Natural Light Optics', 'Color Calibration']
    },
    {
      id: 'dak-ai-course',
      title: 'AI Physical Course Awards Ceremony',
      tag: 'DAK Photography · Corporate Event',
      category: 'DAK Photography',
      year: '2025',
      subtitle: 'Official Event Coverage for Sri Lanka\'s Biggest AI Physical Course Awards',
      browserUrl: 'facebook.com/DAKStudio',
      liveUrl: 'https://www.facebook.com/share/1EcmWj9F2H/',
      imgSrc: 'Images/Leadership.webp',
      btnText: 'View Album on Facebook',
      overview: 'Official event coverage for Sri Lanka\'s Biggest AI Physical Course Awards & Certificate Ceremony. Capturing keynote lectures, student participation, and certificate awarding milestones.',
      highlights: [
        { label: 'Event Scale', val: 'Comprehensive coverage of nationwide student participants' },
        { label: 'Keynote & Awards', val: 'Documenting stage presentations, guest speakers & honors' },
        { label: 'Indoor Lighting', val: 'Balanced ambient hall exposure and subject illumination' },
        { label: 'Media Turnaround', val: 'Rapid batch editing and social media delivery' }
      ],
      techPills: ['Event Photography', 'Corporate Photojournalism', 'Adobe Lightroom', 'Batch Production']
    },
    {
      id: 'dak-padura-cover',
      title: 'පැදුර 2025 | Official Event Cover',
      tag: 'DAK Photography · Event Showcase',
      category: 'DAK Photography',
      year: '2025',
      subtitle: 'Official Event Cover & Headline Photography for Faculty Flagship Festival',
      browserUrl: 'facebook.com/DAKStudio',
      liveUrl: 'https://www.facebook.com/share/1E87P75h7X/',
      imgSrc: 'Images/Padura.webp',
      btnText: 'View Album on Facebook',
      overview: 'Official event cover & headline photography for Faculty of Science Students\' Union flagship festival. Documenting traditional stage performances, vibrant theatrical regalia, and cultural energy.',
      highlights: [
        { label: 'Cultural Showcase', val: 'Traditional Sri Lankan dance forms and ceremonial stage' },
        { label: 'Stage Dynamics', val: 'Handling high-contrast colored stage spotlights with precision' },
        { label: 'Action Freezing', val: 'High shutter speed capturing peak theatrical movements' },
        { label: 'Visual Hierarchy', val: 'Selected as the official promotional cover artwork' }
      ],
      techPills: ['Live Stage Photography', 'Cultural Arts Media', 'Adobe Lightroom', 'High Dynamic Range']
    },
    {
      id: 'dak-graduation',
      title: 'Graduation Convocation Portraits',
      tag: 'DAK Photography · Graduation',
      category: 'DAK Photography',
      year: '2025',
      subtitle: 'Academic Milestone Celebrations & Elegant Portraiture',
      browserUrl: 'facebook.com/DAKStudio',
      liveUrl: 'https://www.facebook.com/share/1X9N2M8H6e/',
      imgSrc: 'Images/Graduation.webp',
      btnText: 'View on Facebook',
      overview: 'Graduation portrait session capturing milestone achievements with elegant studio & natural lighting in front of iconic university landmarks.',
      highlights: [
        { label: 'Milestone Commemoration', val: 'Pristine framing honoring university degree completion' },
        { label: 'Optics & Bokeh', val: 'Wide aperture prime optics delivering creamy background blur' },
        { label: 'Natural Lighting', val: 'Diffused daylight balancing graduation robes and features' },
        { label: 'Archival Finish', val: 'Mastered high-resolution color delivery for print framing' }
      ],
      techPills: ['Graduation Portraits', 'Prime Lens Optics', 'Color Grading', 'Lightroom Classic']
    },
    {
      id: 'dak-madurayamaya',
      title: 'මධුර යාමය | දෙවන අදියර',
      tag: 'DAK Photography · Cultural',
      category: 'DAK Photography',
      year: '2025',
      subtitle: 'කැලණි කන්දේ සොඳුරු යාමය සංස්කෘතික සන්ධ්‍යාවේ ඡායාරූපකරණය',
      browserUrl: 'facebook.com/DAKStudio',
      liveUrl: 'https://www.facebook.com/share/1B86G7YjK6/',
      imgSrc: 'Images/Madurayamaya.webp',
      btnText: 'View on Facebook',
      overview: 'කැලණි කන්දේ සොඳුරු යාමය සංස්කෘතික සන්ධ්‍යාවේ ඡායාරූපකරණය සහ සංස්කරණය. Capturing the magical night ambiance, illuminated landscapes, and musical evening.',
      highlights: [
        { label: 'Night Atmosphere', val: 'Long exposure and ambient night illumination mastery' },
        { label: 'Color Contrast', val: 'Vibrant neon and warm lamp lighting balancing foliage' },
        { label: 'Atmospheric Moody Tone', val: 'Custom tone-curve grading enhancing nighttime aura' },
        { label: 'University Landmark', val: 'Showcasing beloved Kelaniya university landscape settings' }
      ],
      techPills: ['Night Photography', 'Long Exposure', 'Adobe Lightroom', 'Atmospheric Grading']
    },
    {
      id: 'dak-transcendencia',
      title: 'Transcendencia\'25 Chemistry Competition',
      tag: 'DAK Photography · Academic Competition',
      category: 'DAK Photography',
      year: '2025',
      subtitle: 'Premier Inter-University Chemistry Challenge Coverage',
      browserUrl: 'facebook.com/DAKStudio',
      liveUrl: 'https://www.facebook.com/share/18kZJ8T41h/',
      imgSrc: 'Images/AC.webp',
      btnText: 'View on Facebook',
      overview: 'Full 4-part event photo album coverage for the premier inter-university chemistry challenge, covering grand finale keynote, auditorium audience, and award presentations.',
      highlights: [
        { label: '4-Part Multi Album', val: 'Complete chronological archival across four official albums' },
        { label: 'Grand Finale Showcase', val: 'Live stage visuals, multi-media screens & contestant drama' },
        { label: 'Academic Rigor', val: 'Documenting university delegates, judges & finalists' },
        { label: 'Editorial Precision', val: 'Clear captioning and structured public release management' }
      ],
      techPills: ['Academic Photography', 'Multi-Part Archival', 'Auditorium Lighting', 'Lightroom']
    },

    // --- UNIVERSITY MEDIA (6 Items) ---
    {
      id: 'uni-mehewara',
      title: 'Mehewara 3.0 — VidE Club (Faculty Media Unit)',
      tag: 'University Media · VidE Club',
      category: 'University Media',
      year: '2024 – 2025',
      subtitle: 'Faculty of Science Media Unit Community Outreach & Documentation',
      browserUrl: 'facebook.com/UniversityMedia',
      liveUrl: 'https://www.facebook.com/share/16eJtYk1H9/',
      imgSrc: 'Images/Mehewara.webp',
      btnText: 'View on Facebook',
      overview: 'Community outreach and media documentation by the Faculty of Science Media Unit (VidE Club), documenting rural school developmental projects and student interactions.',
      highlights: [
        { label: 'Faculty Media Unit', val: 'Official coverage produced for VidE Club UoK' },
        { label: 'Social Storytelling', val: 'Highlighting community empowerment and student smiles' },
        { label: 'Natural Photojournalism', val: 'Authentic documentary style in rural school environments' },
        { label: 'Institutional Distribution', val: 'Published across faculty media social channels' }
      ],
      techPills: ['Media Unit Coverage', 'Photojournalism', 'Community Outreach', 'Adobe Lightroom']
    },
    {
      id: 'uni-prayama',
      title: 'Prayama - Step 05 (Science Students\' Union)',
      tag: 'University Media · Student Union',
      category: 'University Media',
      year: '2024 – 2025',
      subtitle: 'Official Event Photography for Science Students\' Union Development Program',
      browserUrl: 'facebook.com/UniversityMedia',
      liveUrl: 'https://www.facebook.com/share/16tP1K5jT6/',
      imgSrc: 'Images/Prayama.webp',
      btnText: 'View on Facebook',
      overview: 'Official event photography capturing university student development program highlights, group workshops, leadership seminars, and team unity moments.',
      highlights: [
        { label: 'Student Union Flagship', val: 'Official photographic partner for Science Students\' Union' },
        { label: 'Group Photojournalism', val: 'Large-scale group staging and crisp individual clarity' },
        { label: 'Skill Workshops', val: 'Interactive seminar exercises and leadership development' },
        { label: 'High Turnaround', val: 'Same-day media releases for student union platforms' }
      ],
      techPills: ['Student Union Media', 'Group Staging', 'Event Photojournalism', 'Batch Processing']
    },
    {
      id: 'uni-freshers',
      title: 'Freshers\' Welcome — Faculty of Science',
      tag: 'University Media · Freshers\' Event',
      category: 'University Media',
      year: '2024 – 2025',
      subtitle: 'Comprehensive Orientation Photojournalism & Batch Induction',
      browserUrl: 'facebook.com/UniversityMedia',
      liveUrl: 'https://www.facebook.com/share/1D4T5jP6k7/',
      imgSrc: 'Images/F_W.webp',
      btnText: 'View on Facebook',
      overview: 'Welcoming the new batch to the Faculty of Science with comprehensive ceremony photojournalism, capturing memorable entrance rituals, dean addresses, and batch camaraderie.',
      highlights: [
        { label: 'Batch Welcome', val: 'Documenting the milestone induction of hundreds of freshers' },
        { label: 'Iconic Gates', val: 'Capturing students entering the University of Kelaniya gates' },
        { label: 'Orientation Events', val: 'Dean speeches, senior-junior fellowship, & faculty tour' },
        { label: 'High Color Accuracy', val: 'Pristine vibrant daytime grading preserving true campus colors' }
      ],
      techPills: ['Campus Photojournalism', 'Orientation Media', 'Adobe Lightroom', 'Daylight Exposure']
    },
    {
      id: 'uni-excellora',
      title: '"Excellora 2026" — Annual Award Ceremony',
      tag: 'University Media · LED KLN',
      category: 'University Media',
      year: '2026',
      subtitle: 'LED KLN Annual Celebration & Recognition Ceremony',
      browserUrl: 'facebook.com/UniversityMedia',
      liveUrl: 'https://www.facebook.com/share/186X7dK19b/',
      imgSrc: 'Images/Ex.webp',
      btnText: 'View on Facebook',
      overview: 'LED KLN annual celebration and recognition ceremony documented with high precision, showcasing student leadership achievements, corporate honors, and stage presentations.',
      highlights: [
        { label: 'Recognition Ceremony', val: 'Official awards coverage celebrating top university talent' },
        { label: 'Auditorium Lighting', val: 'Overcoming dark auditorium ambient with focused stage light' },
        { label: 'Keynote & Speeches', val: 'Crisp speaker portraits and audience reaction captures' },
        { label: 'Executive Output', val: 'Polished editorial deliverables for LED society reports' }
      ],
      techPills: ['Award Ceremony Media', 'Auditorium Optics', 'Corporate Event', 'Lightroom']
    },
    {
      id: 'uni-mou',
      title: 'Memorandum of Understanding (MoU) Signing',
      tag: 'University Media · Official Ceremony',
      category: 'University Media',
      year: '2024 – 2025',
      subtitle: 'Bilateral Academic & Industrial Partnership Protocol Signing',
      browserUrl: 'facebook.com/UniversityMedia',
      liveUrl: 'https://www.facebook.com/share/1G7y3eT2hJ/',
      imgSrc: 'Images/MOU.webp',
      btnText: 'View on Facebook',
      overview: 'Official bilateral academic & industrial partnership signing ceremony at University of Kelaniya. Documenting formal agreements between university deans, professors, and corporate executives.',
      highlights: [
        { label: 'Institutional Protocol', val: 'Boardroom ceremonial etiquette and dignitary handshakes' },
        { label: 'Executive Clarity', val: 'High sharpness capturing document signing & official seal' },
        { label: 'Corporate Distribution', val: 'Immediate PR distribution for university & industry channels' },
        { label: 'Balanced Lighting', val: 'Uniform flash bounce and ambient conference room illumination' }
      ],
      techPills: ['Institutional PR', 'Protocol Media', 'Boardroom Photography', 'Fast Editorial Turnaround']
    },
    {
      id: 'uni-padura-series',
      title: 'පැදුර 2025 Complete Album Series',
      tag: 'University Media · Official Series',
      category: 'University Media',
      year: '2025',
      subtitle: 'Multi-Segment Festival Photographic Compilation & Musical Sets',
      browserUrl: 'facebook.com/UniversityMedia',
      liveUrl: 'https://www.facebook.com/share/1B7N8h3J2a/',
      imgSrc: 'Images/Padura2.webp',
      btnText: 'View Album Series',
      overview: 'Multi-segment festival photographic compilation covering on-stage performances, traditional acoustic segments, guest artists, and audience vitality across all official album parts.',
      highlights: [
        { label: 'Complete Series', val: 'Curated comprehensive multi-part albums for public distribution' },
        { label: 'Stage Artistry', val: 'Capturing vocalists, drummers, and cultural dancers in unison' },
        { label: 'Dynamic Atmosphere', val: 'Showcasing atmospheric fog, dramatic lights & crowd cheers' },
        { label: 'Publicity Impact', val: 'Top engagement albums across university media networks' }
      ],
      techPills: ['Festival Photojournalism', 'Concert Series', 'Adobe Lightroom', 'Batch Production']
    },

    // --- GRAPHIC DESIGN (1 Item) ---
    {
      id: 'design-branding',
      title: 'Commercial Branding & Digital Assets',
      tag: 'Graphic Design · Corporate Branding',
      category: 'Graphic Design',
      year: '2024 – 2026',
      subtitle: 'Visual Identity Systems, Social Campaigns & Marketing Collateral',
      browserUrl: 'facebook.com/DAKStudio',
      liveUrl: 'https://www.facebook.com/share/1Cx6QHZSmv/',
      imgSrc: 'Images/Design.jpg',
      btnText: 'View DAK Studio Portfolio',
      overview: 'Logos, visual identity kits, social media campaigns, and marketing collateral designed for corporate clients, organizations, and events across Sri Lanka.',
      highlights: [
        { label: 'Brand Identity', val: 'Logo design, typography systems, and brand style guides' },
        { label: 'Marketing Collateral', val: 'Banners, flyers, social media carousels, and poster kits' },
        { label: 'Color Theory & Grid', val: 'Strict adherence to design balance, contrast & spacing' },
        { label: 'Production Ready', val: 'Exported in high-res vector and digital web assets' }
      ],
      techPills: ['Adobe Photoshop', 'Canva Pro', 'Brand Identity', 'Social Media Assets']
    },

    // --- VIDEO EDITING (3 Items) ---
    {
      id: 'video-sipyathra-doc',
      title: 'Sipyathra Project Documentary — MSS UoK',
      tag: 'Video Editing · Documentary',
      category: 'Video Editing',
      year: '2024 – 2025',
      subtitle: 'Story-Driven Video Editing, Color Grading & Sound Design',
      browserUrl: 'facebook.com/video',
      liveUrl: 'https://web.facebook.com/share/v/195sKAxhvK/',
      imgSrc: 'Images/Sipyathra2.webp',
      btnText: 'Watch Project Video',
      overview: 'Story-driven video editing, color grading, sound design, and narrative pacing for the annual charity initiative organized by the Mathematics & Statistics Society (MSS), University of Kelaniya.',
      highlights: [
        { label: 'Narrative Pacing', val: 'Emotional 3-act storytelling structuring the charity journey' },
        { label: 'Aerial Drone Integration', val: 'Cinematic color matching between aerial and ground footage' },
        { label: 'Audio Mastering', val: 'Crystal clear voiceover mixing, background score & sound FX' },
        { label: 'DaVinci Resolve Grade', val: 'Rich natural color palette with film-grade contrast curves' }
      ],
      techPills: ['DaVinci Resolve', 'CapCut Pro', 'Documentary Storytelling', 'Cinematic Sound Design']
    },
    {
      id: 'video-sipyathra-promo',
      title: 'Sipyathra Donation Campaign Video',
      tag: 'Video Editing · Promotional',
      category: 'Video Editing',
      year: '2024 – 2025',
      subtitle: 'Dynamic Promotional Video for Social Media Fundraising',
      browserUrl: 'facebook.com/video',
      liveUrl: 'https://web.facebook.com/share/v/1H4pWzS58g/',
      imgSrc: 'Images/Sipyathra.webp',
      btnText: 'Watch Campaign Video',
      overview: 'Dynamic promotional video tailored for social media fundraising campaigns, featuring fast transitions, animated kinetic typography, upbeat tempo synchronization, and call-to-action cards.',
      highlights: [
        { label: 'Fundraising Impact', val: 'High-conversion promotional edit inspiring donations' },
        { label: 'Kinetic Subtitles', val: 'Custom motion subtitles ensuring engagement on mute' },
        { label: 'Beat Synchronization', val: 'Rhythmic cutting pattern matched to energetic soundtrack' },
        { label: 'Cross-Platform Formats', val: 'Optimized for Facebook, Instagram Reels, and WhatsApp' }
      ],
      techPills: ['DaVinci Resolve', 'Social Video Marketing', 'Motion Graphics', 'CapCut']
    },
    {
      id: 'video-padura-recap',
      title: 'Padura 2025 Official Week Video',
      tag: 'Video Editing · Event Aftermovie',
      category: 'Video Editing',
      year: '2025',
      subtitle: 'Faculty of Science Students\' Union Official Recap Aftermovie',
      browserUrl: 'facebook.com/video',
      liveUrl: 'https://web.facebook.com/share/v/1Am7T3YnZz/',
      imgSrc: 'Images/Padura3.webp',
      btnText: 'Watch Official Video',
      overview: 'Faculty of Science Students\' Union official recap video with synchronized music cuts, dynamic speed ramps, stage audio integration, and cinematic color timing.',
      highlights: [
        { label: 'Event Aftermovie', val: 'High-energy celebration recap preserving festival euphoria' },
        { label: 'Speed Ramping', val: 'Dynamic velocity changes synced to traditional and modern beats' },
        { label: 'Stage Glow & Grading', val: 'Preserving stage light vibrancy without blowing highlights' },
        { label: 'Official Union Release', val: 'Headlining video production for the Faculty of Science' }
      ],
      techPills: ['DaVinci Resolve', 'Speed Ramping', 'Aftermovie Editing', 'Sound Design']
    }
  ];

  let currentPortIndex = 0;

  const portModal = document.getElementById('portModal');
  const portModalPrevBtn = document.getElementById('portModalPrevBtn');
  const portModalNextBtn = document.getElementById('portModalNextBtn');
  const portModalClose = document.getElementById('portModalClose');
  const portModalCounter = document.getElementById('portModalCounter');
  const portModalTag = document.getElementById('portModalTag');
  const portModalCategory = document.getElementById('portModalCategory');
  const portModalTitle = document.getElementById('portModalTitle');
  const portModalSubtitle = document.getElementById('portModalSubtitle');
  const portModalBrowserUrl = document.getElementById('portModalBrowserUrl');
  const portModalImg = document.getElementById('portModalImg');
  const portModalSideLink = document.getElementById('portModalSideLink');
  const portModalSideBtnText = document.getElementById('portModalSideBtnText');
  const portModalBody = document.getElementById('portModalBody');
  const portModalDetails = document.getElementById('portModalDetails');
  const portModalLiveUrlText = document.getElementById('portModalLiveUrlText');
  const portModalLink = document.getElementById('portModalLink');
  const portModalLinkText = document.getElementById('portModalLinkText');

  function renderPortModalData(index, animate) {
    if (index < 0 || index >= PORTFOLIO_ITEMS.length || !portModal) return;
    currentPortIndex = index;
    const item = PORTFOLIO_ITEMS[currentPortIndex];

    if (animate && portModalBody) {
      portModalBody.classList.add('switching');
    }

    setTimeout(() => {
      if (portModalCounter) portModalCounter.textContent = `${currentPortIndex + 1} / ${PORTFOLIO_ITEMS.length}`;
      if (portModalTag) portModalTag.textContent = item.tag || 'Media Showcase';
      if (portModalCategory) portModalCategory.textContent = item.category || 'Portfolio Work';
      if (portModalTitle) portModalTitle.textContent = item.title;
      if (portModalSubtitle) portModalSubtitle.textContent = item.subtitle;
      if (portModalBrowserUrl) portModalBrowserUrl.textContent = item.browserUrl || 'portfolio.media.preview';
      if (portModalImg) {
        portModalImg.src = item.imgSrc;
        portModalImg.alt = `${item.title} Full Preview`;
      }
      if (portModalSideLink) portModalSideLink.href = item.liveUrl;
      if (portModalSideBtnText) portModalSideBtnText.textContent = item.btnText || 'Launch Project / View Album';
      if (portModalLiveUrlText) portModalLiveUrlText.textContent = item.liveUrl;
      if (portModalLink) portModalLink.href = item.liveUrl;
      if (portModalLinkText) portModalLinkText.textContent = `${item.btnText || 'Open Live Link'} ↗`;

      // Render Info Panel (Executive Overview + Key Specifications + Stack)
      if (portModalDetails) {
        let html = `
          <div class="compact-info-block">
            <div class="compact-section-heading">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>Project Overview &amp; Scope</span>
            </div>
            <p class="compact-overview-text">${item.overview}</p>
          </div>

          <div class="compact-info-block">
            <div class="compact-section-heading">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span>Key Specifications &amp; Highlights</span>
            </div>
            <div class="compact-highlights-grid">
              ${item.highlights.map(h => `
                <div class="compact-hl-item">
                  <span class="hl-label">${h.label}</span>
                  <span class="hl-val">${h.val}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="compact-info-block">
            <div class="compact-section-heading">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              <span>Production Tools &amp; Technologies</span>
            </div>
            <div class="compact-tech-row">
              ${item.techPills.map(p => `<span class="tech-tag">${p}</span>`).join('')}
            </div>
          </div>
        `;
        portModalDetails.innerHTML = html;
      }

      if (animate && portModalBody) {
        portModalBody.classList.remove('switching');
      }
    }, animate ? 140 : 0);
  }

  function openPortModalByIndex(index) {
    renderPortModalData(index, false);
    portModal.classList.add('active');
    portModal.setAttribute('aria-hidden', 'false');
    lockPageScroll();
  }

  function closePortModal() {
    if (portModal) {
      portModal.classList.remove('active');
      portModal.setAttribute('aria-hidden', 'true');
      unlockPageScroll();
    }
  }

  function showNextPortItem() {
    currentPortIndex = (currentPortIndex + 1) % PORTFOLIO_ITEMS.length;
    renderPortModalData(currentPortIndex, true);
  }

  function showPrevPortItem() {
    currentPortIndex = (currentPortIndex - 1 + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length;
    renderPortModalData(currentPortIndex, true);
  }

  if (portModalNextBtn) {
    portModalNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNextPortItem();
    });
  }

  if (portModalPrevBtn) {
    portModalPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrevPortItem();
    });
  }

  if (portModalClose) {
    portModalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closePortModal();
    });
  }

  if (portModal) {
    portModal.addEventListener('click', (e) => {
      if (e.target === portModal) {
        closePortModal();
      }
    });
  }

  portCards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openPortModalByIndex(idx);
    });
  });

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
  const certCards = document.querySelectorAll('.cert-card.has-proof');

  function openCertModal(card) {
    const img = card.getAttribute('data-cert-proof');
    const title = card.getAttribute('data-cert-name') || 'Certificate of Completion';
    const from = card.getAttribute('data-cert-issuer') || '';
    const tag = card.getAttribute('data-cert-tag') || 'Verified Credential';

    if (certModalImg) certModalImg.src = img;
    if (certModalTitle) certModalTitle.textContent = title;
    if (certModalFrom) certModalFrom.textContent = from;
    if (certModalTag) certModalTag.textContent = tag;
    if (certModalOpenBtn) certModalOpenBtn.href = img;

    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    lockPageScroll();
  }

  function closeCertModal() {
    if (certModal) {
      certModal.classList.remove('active');
      certModal.setAttribute('aria-hidden', 'true');
      unlockPageScroll();
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


  /* -------------------------------------------------------------------------
     11. EXPANDED PROJECT DETAILS MODAL WITH SIDE NAVIGATION & STRICT SCROLL LOCK
     ------------------------------------------------------------------------- */
  const PROJECT_KEYS = ['alumni-directory', 'richpath-pro', 'dak-studio', 'hela-weda-gedara', 'unposed-moments'];
  let currentProjectIndex = 0;

  const PROJECT_DATA = {
    'alumni-directory': {
      title: 'Alumni Success Directory & Career Blueprints Hub',
      subtitle: 'COSC 31103 (Web & Internet Technologies) · Group Leader & Lead Full-Stack Developer',
      badge: 'COSC 31103 Group Leader Project',
      year: '2026',
      browserUrl: 'alumni-directory-portal.surge.sh',
      liveUrl: 'https://alumni-directory-portal.surge.sh',
      imgSrc: 'Images/alumni-directory-preview.png',
      btnText: 'Launch Live Alumni Portal',
      overview: 'Official digital mentorship & alumni engagement web portal developed for the Department of Statistics & Computer Science, University of Kelaniya as the COSC 31103 course project (serving as Group Leader & Lead Full-Stack Developer).',
      highlights: [
        { label: 'Role & Scope', val: 'COSC 31103 Group Leader & Lead Full-Stack Dev' },
        { label: 'Directory Search', val: 'Real-time fuzzy search across alumni records' },
        { label: 'Dual Proof Verification', val: 'Photo & multi-page PDF document verification' },
        { label: '4-Pillar Moderation', val: 'Approval workflows, live editing & record management' }
      ],
      techPills: ['Semantic HTML5 / CSS3', 'Vanilla JS (ES6+)', 'Photo/PDF Dual Engine', 'Surge.sh Edge CDN', 'HTTPS SSL']
    },

    'richpath-pro': {
      title: 'RichPath Pro (Finance & Executive Suite)',
      subtitle: 'Full-Stack Progressive Web App (PWA) & Comprehensive Financial Architecture',
      badge: 'Full-Stack PWA & Finance App',
      year: '2026',
      browserUrl: 'richpath-finance.surge.sh',
      liveUrl: 'https://richpath-finance.surge.sh/',
      imgSrc: 'Images/richpath-preview.png',
      btnText: 'Launch RichPath Pro App',
      overview: 'An advanced personal, academic & financial management web application featuring multi-currency tracking, client-side AES-256 encrypted vault, semester scheduler, and offline PWA sync.',
      highlights: [
        { label: 'Finance Analytics', val: 'Multi-currency tracking & cashflow forecasting' },
        { label: 'Encrypted Security Safe', val: 'Client-side AES-256 credential & password vault' },
        { label: 'Academic Productivity', val: 'Semester milestone countdowns & priority notes' },
        { label: 'PWA Offline Sync', val: 'Installable cross-device app with offline caching' }
      ],
      techPills: ['JavaScript (ES6+)', 'Web Crypto (AES-256)', 'PWA Offline Sync', 'LocalStorage Engine', 'Surge.sh CDN']
    },

    'dak-studio': {
      title: 'DAK Studio Official Website',
      subtitle: 'Commercial Brand Architecture & Creative Media Production Platform',
      badge: 'Official Business Website',
      year: '2024 – Present',
      browserUrl: 'dakstudio-official.vercel.app',
      liveUrl: 'http://dakstudio-official.vercel.app/',
      imgSrc: 'Images/dak-studio-preview.png',
      btnText: 'Visit Live DAK Studio Website',
      overview: 'Official commercial platform for DAK Studio multimedia, video & photography services. Features an interactive portfolio showcase, automated client quotation workflows, and dark glassmorphic responsive UI.',
      highlights: [
        { label: 'Creative Showcase', val: 'Categorized photography & video production galleries' },
        { label: 'Client Reservation', val: 'Automated date reservation inquiries & direct routing' },
        { label: 'UI/UX Design Systems', val: 'Modern glassmorphic dark theme built for visual media' },
        { label: 'High-Speed Cloud', val: 'High-performance edge deployment on Vercel CDN' }
      ],
      techPills: ['HTML5 & CSS3', 'JavaScript (ES6+)', 'UI/UX Design Systems', 'Responsive Layouts', 'Vercel Cloud Edge']
    },

    'hela-weda-gedara': {
      title: 'Hela Weda Gedara (Official Platform)',
      subtitle: 'Indigenous Wellness & Holistic Healthcare Web Platform',
      badge: 'Corporate Client Platform',
      year: '2026',
      browserUrl: 'hela-weda-gedara-final-urli.vercel.app',
      liveUrl: 'https://hela-weda-gedara-final-urli.vercel.app/',
      imgSrc: 'Images/hela-weda-gedara-preview.png',
      btnText: 'Visit Live Hela Weda Gedara',
      overview: 'Corporate web portal developed for 100 International / Hela Weda Gedara, presenting traditional Ayurvedic wellness remedies and medical consultation services with clean digital elegance.',
      highlights: [
        { label: 'Remedies Directory', val: 'Detailed breakdown of indigenous therapies & herbs' },
        { label: 'Consultation Booking', val: 'Intuitive consultation scheduling with validation' },
        { label: 'Accessible Interface', val: 'High-contrast legible typography for all demographics' },
        { label: 'Backend Architecture', val: 'Secure PHP form handlers and dynamic content modules' }
      ],
      techPills: ['Semantic HTML5', 'Modular CSS3', 'JavaScript', 'PHP Backend Integration', 'Vercel Edge']
    },

    'unposed-moments': {
      title: 'Unposed Moments LK Photography Platform',
      subtitle: 'Commercial Photography Portfolio & Client Reservation Portal',
      badge: 'Commercial Portfolio & Booking',
      year: '2024 – 2026',
      browserUrl: 'unposed-moments-lk-one.vercel.app',
      liveUrl: 'https://unposed-moments-lk-one.vercel.app/',
      imgSrc: 'Images/unposed-moments-preview.png',
      btnText: 'Visit Live Unposed Moments',
      overview: 'Commercial reservation platform for Unposed Moments (Pvt) Ltd, enabling wedding and event photography clients to explore story albums and check photographer availability.',
      highlights: [
        { label: 'Fullscreen Lightbox', val: 'High-fidelity photo viewer with touch gestures' },
        { label: 'Event Booking Workflow', val: 'Streamlined booking calendar & client intake' },
        { label: 'Visual Hierarchy', val: 'Minimalist editorial styling focusing on photography' },
        { label: 'Edge Performance', val: 'Zero-dependency vanilla scripts delivering instant loads' }
      ],
      techPills: ['HTML5 & CSS3', 'JavaScript (ES6+)', 'Gallery Lightbox Engine', 'Vercel Cloud Edge']
    }
  };

  const projectModal = document.getElementById('projectModal');
  const projModalPrevBtn = document.getElementById('projModalPrevBtn');
  const projModalNextBtn = document.getElementById('projModalNextBtn');
  const projModalCounter = document.getElementById('projModalCounter');
  const projModalBadge = document.getElementById('projModalBadge');
  const projModalYear = document.getElementById('projModalYear');
  const projModalTitle = document.getElementById('projModalTitle');
  const projModalSubtitle = document.getElementById('projModalSubtitle');
  const projModalBrowserUrl = document.getElementById('projModalBrowserUrl');
  const projModalImg = document.getElementById('projModalImg');
  const projModalBody = document.getElementById('projModalBody');
  const projModalDetails = document.getElementById('projModalDetails');
  const projModalLiveUrlText = document.getElementById('projModalLiveUrlText');
  const projModalLiveBtn = document.getElementById('projModalLiveBtn');
  const projModalSideLiveBtn = document.getElementById('projModalSideLiveBtn');
  const projModalSideBtnText = document.getElementById('projModalSideBtnText');
  const projectModalClose = document.getElementById('projectModalClose');

  function renderProjectData(projectId, animate) {
    const data = PROJECT_DATA[projectId];
    if (!data || !projectModal) return;

    currentProjectIndex = PROJECT_KEYS.indexOf(projectId);
    if (currentProjectIndex === -1) currentProjectIndex = 0;

    if (animate && projModalBody) {
      projModalBody.classList.add('switching');
    }

    setTimeout(() => {
      if (projModalCounter) projModalCounter.textContent = `${currentProjectIndex + 1} / ${PROJECT_KEYS.length}`;
      if (projModalBadge) projModalBadge.textContent = data.badge;
      if (projModalYear) projModalYear.textContent = data.year;
      if (projModalTitle) projModalTitle.textContent = data.title;
      if (projModalSubtitle) projModalSubtitle.textContent = data.subtitle;
      if (projModalBrowserUrl) projModalBrowserUrl.textContent = data.browserUrl;
      if (projModalImg) {
        projModalImg.src = data.imgSrc;
        projModalImg.alt = `${data.title} Interface Home Preview`;
      }
      if (projModalLiveUrlText) projModalLiveUrlText.textContent = data.liveUrl;
      if (projModalLiveBtn) projModalLiveBtn.href = data.liveUrl;
      if (projModalSideLiveBtn) projModalSideLiveBtn.href = data.liveUrl;
      if (projModalSideBtnText) projModalSideBtnText.textContent = data.btnText || 'Launch Live Website';

      // Render Info Panel (Executive Overview + Key Specifications + Tech Stack)
      if (projModalDetails) {
        let html = `
          <div class="compact-info-block">
            <div class="compact-section-heading">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>Executive Overview</span>
            </div>
            <p class="compact-overview-text">${data.overview}</p>
          </div>

          <div class="compact-info-block">
            <div class="compact-section-heading">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span>Key Specifications &amp; Architecture</span>
            </div>
            <div class="compact-highlights-grid">
              ${data.highlights.map(h => `
                <div class="compact-hl-item">
                  <span class="hl-label">${h.label}</span>
                  <span class="hl-val">${h.val}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="compact-info-block">
            <div class="compact-section-heading">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              <span>Technology Stack</span>
            </div>
            <div class="compact-tech-row">
              ${data.techPills.map(p => `<span class="tech-tag">${p}</span>`).join('')}
            </div>
          </div>
        `;
        projModalDetails.innerHTML = html;
      }

      if (animate && projModalBody) {
        projModalBody.classList.remove('switching');
      }
    }, animate ? 140 : 0);
  }

  function openProjectModal(projectId) {
    renderProjectData(projectId, false);
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    lockPageScroll();
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
      projectModal.setAttribute('aria-hidden', 'true');
      unlockPageScroll();
    }
  }

  function showNextProject() {
    currentProjectIndex = (currentProjectIndex + 1) % PROJECT_KEYS.length;
    renderProjectData(PROJECT_KEYS[currentProjectIndex], true);
  }

  function showPrevProject() {
    currentProjectIndex = (currentProjectIndex - 1 + PROJECT_KEYS.length) % PROJECT_KEYS.length;
    renderProjectData(PROJECT_KEYS[currentProjectIndex], true);
  }

  if (projModalNextBtn) {
    projModalNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNextProject();
    });
  }

  if (projModalPrevBtn) {
    projModalPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrevProject();
    });
  }

  const projectCards = document.querySelectorAll('.project-card[data-project-id]');
  projectCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a.project-link')) return;

      const projectId = card.getAttribute('data-project-id');
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  const detailButtons = document.querySelectorAll('.btn-open-project-details');
  detailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project-id');
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      // Close only if user clicked directly on the overlay backdrop outside the modal container and nav arrows
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  if (projectModalClose) {
    projectModalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeProjectModal();
    });
  }

  // Keyboard navigation: Left/Right arrow keys for project/portfolio switching, Escape for closing
  window.addEventListener('keydown', (e) => {
    if (projectModal && projectModal.classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        showNextProject();
      } else if (e.key === 'ArrowLeft') {
        showPrevProject();
      } else if (e.key === 'Escape') {
        closeProjectModal();
      }
    } else if (portModal && portModal.classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        showNextPortItem();
      } else if (e.key === 'ArrowLeft') {
        showPrevPortItem();
      } else if (e.key === 'Escape') {
        closePortModal();
      }
    } else if (e.key === 'Escape') {
      closeCertModal();
      closePortModal();
      closeProjectModal();
      closeMobileNav();
    }
  });

})();
