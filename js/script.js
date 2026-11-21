(function () {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const backToTop = document.querySelector('.back-to-top');
  const revealEls = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('.counter');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const bookingForm = document.getElementById('booking-form');
  const whatsappNumber = '918499883578';

  function openWhatsApp(message) {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  }

  // Mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.classList.contains('open')) return;
      if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Header state and back-to-top
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (backToTop) backToTop.classList.toggle('show', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active nav link on scroll
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  function setActiveLink() {
    const scrollPos = window.scrollY + 120;
    let currentId = '';
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // Scroll reveal animations
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // Counters
  function animateCounter(el) {
    const target = Number(el.dataset.target || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = `${target}${suffix}`;
    }
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (!el.dataset.counted) {
            el.dataset.counted = 'true';
            animateCounter(el);
          }
          obs.unobserve(el);
        });
      }, { threshold: 0.4 });
      counters.forEach((el) => counterObserver.observe(el));
    } else {
      counters.forEach((el) => {
        const target = el.dataset.target || '0';
        const suffix = el.dataset.suffix || '';
        el.textContent = `${target}${suffix}`;
      });
    }
  }

  // Gallery filter
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || 'all';
      filterButtons.forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      galleryItems.forEach((item) => {
        const category = item.dataset.category || '';
        const show = filter === 'all' || category === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  // Lightbox
  function openLightbox(src, caption, alt) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = alt || caption || 'Gallery image';
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const full = item.dataset.full || img.currentSrc || img.src;
      openLightbox(full, item.dataset.label || img.alt || '', img.alt || '');
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // Enquiry buttons -> WhatsApp
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-enquiry]');
    if (!btn) return;
    const service = btn.getAttribute('data-enquiry') || 'Tailoring Service';
    const message = `Hello Geetha Stitching, I would like to enquire about ${service}. Please share details.`;
    openWhatsApp(message);
  });

  // Booking form -> WhatsApp
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(bookingForm);
      const name = String(formData.get('name') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const service = String(formData.get('service') || '').trim();
      const date = String(formData.get('date') || '').trim();
      const message = String(formData.get('message') || '').trim();

      const lines = [
        'Hello Geetha Stitching, I would like to book an appointment.',
        '',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Service Required: ${service}`,
        `Preferred Date: ${date}`,
        `Message: ${message || 'N/A'}`
      ];

      openWhatsApp(lines.join('\n'));
      bookingForm.reset();
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

