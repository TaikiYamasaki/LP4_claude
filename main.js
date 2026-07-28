(() => {
  const body = document.body;
  body.classList.add('js-ready');

  // --- Header: shrink + shadow on scroll ---
  const header = document.querySelector('.site-header');
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // --- Hero parallax ---
  const heroBg = document.querySelector('.hero-bg');
  const hero = document.querySelector('.hero');
  if (heroBg && hero) {
    const updateParallax = () => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = rect.top * -0.15;
      heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax);
  }

  // --- Scroll-reveal animations ---
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // --- Trending carousel ---
  const track = document.querySelector('.product-grid');
  const prevBtn = document.querySelector('.trending-nav-btn--prev');
  const nextBtn = document.querySelector('.trending-nav-btn--next');
  if (track && prevBtn && nextBtn) {
    const scrollByCard = (direction) => {
      const card = track.querySelector(':scope > div');
      const gap = 16;
      const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
      track.scrollBy({ left: distance * direction, behavior: 'smooth' });
    };
    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));

    const updateNavState = () => {
      const maxScroll = track.scrollWidth - track.clientWidth - 1;
      prevBtn.disabled = track.scrollLeft <= 0;
      nextBtn.disabled = track.scrollLeft >= maxScroll;
    };
    updateNavState();
    track.addEventListener('scroll', updateNavState, { passive: true });
    window.addEventListener('resize', updateNavState);
  }

  // --- Disable placeholder "#" links from jumping / adding to history ---
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener('click', (e) => e.preventDefault());
  });

  // --- Hamburger menu (mobile nav) ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navScrim = document.querySelector('.nav-scrim');

  if (navToggle && navLinks && navScrim) {
    const setNavOpen = (open) => {
      navLinks.classList.toggle('is-open', open);
      navToggle.classList.toggle('is-active', open);
      navScrim.classList.toggle('is-visible', open);
      navToggle.setAttribute('aria-expanded', String(open));
      body.classList.toggle('nav-open', open);
    };

    navToggle.addEventListener('click', () => {
      setNavOpen(!navLinks.classList.contains('is-open'));
    });

    navScrim.addEventListener('click', () => setNavOpen(false));

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setNavOpen(false));
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) setNavOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setNavOpen(false);
    });
  }
})();
