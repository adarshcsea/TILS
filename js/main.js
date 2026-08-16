/**
 * TRANSPORT OF INDIA LOGISTICS SOLUTION (TILS)
 * Central UI Controller & Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTerminalPreloader();
  initStickyHeader();
  initMobileNavigation();
  initScrollAnimations();
  initAnimatedCounters();
  initFaqAccordions();
  initFormValidation();
  initSmoothScroll();
});

/* --- 0. Terminal Preloader & Page Reveal Engine --- */
function initTerminalPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloader-fill');
  const pct = document.getElementById('preloader-pct');
  const status = document.getElementById('preloader-status');

  if (!preloader || !fill || !pct || !status) return;

  // Lock background scroll during preload
  document.body.style.overflow = 'hidden';

  const statusLogs = [
    { at: 15, text: "CONNECTING PAN-INDIA FLEET MESH..." },
    { at: 45, text: "SYNCING CORRIDOR TELEMETRICS..." },
    { at: 75, text: "CALIBRATING DISPATCH NETWORK..." },
    { at: 100, text: "SYSTEM ONLINE" }
  ];

  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 3;

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      fill.style.width = '100%';
      pct.textContent = '100%';
      status.innerHTML = '<span class="status-dot"></span> SYSTEM ONLINE';
      status.style.color = '#10B981';

      setTimeout(() => {
        preloader.classList.add('is-hidden');
        document.body.style.overflow = '';
      }, 550);
      return;
    }

    fill.style.width = progress + '%';
    pct.textContent = progress + '%';

    for (let i = statusLogs.length - 1; i >= 0; i--) {
      if (progress >= statusLogs[i].at) {
        status.innerHTML = `<span class="status-dot"></span> ${statusLogs[i].text}`;
        break;
      }
    }
  }, 45);
}

/* --- 1. Sticky Header Controller --- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- 2. Responsive Mobile Navigation Drawer --- */
function initMobileNavigation() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobilePanel = document.querySelector('.mobile-nav-panel');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobilePanel || !mobileOverlay) return;

  const openDrawer = () => {
    mobilePanel.classList.add('is-active');
    mobileOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    mobilePanel.classList.remove('is-active');
    mobileOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  };

  hamburgerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  mobileOverlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobilePanel.classList.contains('is-active')) {
      closeDrawer();
    }
  });
}

/* --- 3. Scroll Reveal Animation Trigger --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-fade');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --- 4. Animated Metric Number Counters --- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-counter-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter-target'));
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const prefix = el.getAttribute('data-counter-prefix') || '';
        const duration = 1800;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * target);

          el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        };

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* --- 5. Accordion System (FAQs) --- */
function initFaqAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      const parent = item.closest('.accordion-group');

      if (parent && parent.dataset.multiselect !== 'true') {
        parent.querySelectorAll('.accordion-item').forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const siblingContent = sibling.querySelector('.accordion-content');
            if (siblingContent) siblingContent.style.maxHeight = null;
            sibling.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --- 6. Form Validation --- */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        const formGroup = input.closest('.form-group') || input.parentElement;
        const errorMsg = formGroup.querySelector('.input-error-msg');

        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('input-invalid');
          if (errorMsg) errorMsg.style.display = 'block';
        } else {
          input.classList.remove('input-invalid');
          if (errorMsg) errorMsg.style.display = 'none';
        }

        if (input.type === 'email' && input.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            isValid = false;
            input.classList.add('input-invalid');
            if (errorMsg) {
              errorMsg.textContent = 'Please enter a valid business email.';
              errorMsg.style.display = 'block';
            }
          }
        }
      });

      if (isValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
        
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Dispatching Request...';
        }

        setTimeout(() => {
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          const successBanner = form.querySelector('.form-success-banner');
          if (successBanner) {
            successBanner.classList.add('show');
            setTimeout(() => successBanner.classList.remove('show'), 6000);
          }
        }, 1200);
      }
    });
  });
}

/* --- 7. Smooth Scroll Anchor Handling --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
