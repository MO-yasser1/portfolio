/**
 * ==============================================================================
 * MOHAMED YASSER - PORTFOLIO INTERACTIVITY SCRIPT
 * Digital Solutions Developer | مطور حلول رقمية للأعمال
 * Vanilla JavaScript (Zero Dependencies)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----------------------------------------------------------------------------
   * 1. THEME SWITCHER (DARK / LIGHT MODE)
   * Default theme is dark as requested. Preference is stored in localStorage.
   * -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;
  const THEME_STORAGE_KEY = 'mohamed_yasser_portfolio_theme';

  // Initialize theme: check localStorage, otherwise default to 'dark'
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    rootElement.setAttribute('data-theme', savedTheme);
  } else {
    // Default to dark mode
    rootElement.setAttribute('data-theme', 'dark');
  }

  // Toggle theme on button click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    });
  }

  /* ----------------------------------------------------------------------------
   * 2. MOBILE NAVIGATION DRAWER & OVERLAY
   * Smooth toggle for mobile viewports with accessible ARIA states
   * -------------------------------------------------------------------------- */
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navOverlay = document.getElementById('nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    mobileToggleBtn.classList.add('open');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileMenu = () => {
    mobileToggleBtn.classList.remove('open');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (mobileToggleBtn && mobileNav && navOverlay) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = mobileToggleBtn.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking overlay backdrop
    navOverlay.addEventListener('click', closeMobileMenu);

    // Close when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close drawer when any mobile nav link is clicked
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ----------------------------------------------------------------------------
   * 3. ACTIVE NAVIGATION LINK ON SCROLL
   * Highlights current section link as the user scrolls through the page
   * -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 180; // Offset for header height

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink(); // Initial run

  /* ----------------------------------------------------------------------------
   * 4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   * Elements with class .reveal smoothly fade and slide in when entering viewport
   * -------------------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Trigger once for performance
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // If reduced motion or observer not supported, make everything visible immediately
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ----------------------------------------------------------------------------
   * 5. DYNAMIC FOOTER CURRENT YEAR
   * Automatically sets current year
   * -------------------------------------------------------------------------- */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------------------------
   * 6. CONTACT FORM HANDLING & VALIDATION (FRONTEND)
   * Validates user inputs cleanly and provides clear feedback.
   * Ready to be plugged into EmailJS, Formspree, WhatsApp, or backend API.
   * -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');
  const nameInput = document.getElementById('client-name');
  const contactInput = document.getElementById('client-contact');
  const messageInput = document.getElementById('client-message');
  const projectTypeSelect = document.getElementById('project-type');
  const submitBtn = document.getElementById('submit-btn');

  // Input error element getters
  const nameError = document.getElementById('name-error');
  const contactError = document.getElementById('contact-error');
  const messageError = document.getElementById('message-error');

  const clearFormErrors = () => {
    [nameInput, contactInput, messageInput].forEach((input) => {
      input.classList.remove('has-error');
    });
    [nameError, contactError, messageError].forEach((error) => {
      error.classList.remove('active');
    });
    formAlert.style.display = 'none';
    formAlert.className = 'form-alert';
    formAlert.textContent = '';
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors();

      let hasError = false;

      // Validate Name (minimum 2 characters)
      const nameVal = nameInput.value.trim();
      if (!nameVal || nameVal.length < 2) {
        nameInput.classList.add('has-error');
        nameError.classList.add('active');
        hasError = true;
      }

      // Validate Contact (Email or Egyptian/International phone number)
      const contactVal = contactInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      const isContactValid = emailRegex.test(contactVal) || (contactVal.length >= 8 && /^[0-9+\s-]+$/.test(contactVal));

      if (!contactVal || !isContactValid) {
        contactInput.classList.add('has-error');
        contactError.classList.add('active');
        hasError = true;
      }

      // Validate Message (minimum 8 characters)
      const messageVal = messageInput.value.trim();
      if (!messageVal || messageVal.length < 8) {
        messageInput.classList.add('has-error');
        messageError.classList.add('active');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      /* ------------------------------------------------------------------------
       * HOW TO CONNECT BACKEND / WHATSAPP / FORMSPREE:
       * 
       * Option A (Direct WhatsApp Forwarding):
       *   const phone = "201XXXXXXXXX"; // Mohamed Yasser WhatsApp number
       *   const waText = `مرحبًا محمد، أنا ${encodeURIComponent(nameVal)}، مهتم بـ: ${encodeURIComponent(projectTypeSelect.value)}.%0Aالتفاصيل: ${encodeURIComponent(messageVal)}`;
       *   window.open(`https://wa.me/${phone}?text=${waText}`, '_blank');
       *
       * Option B (Formspree or Custom API):
       *   fetch('https://formspree.io/f/YOUR_FORM_ID', {
       *     method: 'POST',
       *     headers: { 'Content-Type': 'application/json' },
       *     body: JSON.stringify({ name: nameVal, contact: contactVal, project: projectTypeSelect.value, message: messageVal })
       *   });
       * ---------------------------------------------------------------------- */

      // Construct WhatsApp message pre-fill link for Mohamed Yasser (01142576116)
      const projectTypeName = projectTypeSelect.options[projectTypeSelect.selectedIndex]?.text || 'غير محدد';
      const waText = `مرحبًا محمد، أنا ${nameVal}.%0A📱 وسيلة التواصل: ${contactVal}%0A🎯 نوع المشروع: ${projectTypeName}%0A📝 تفاصيل الفكرة:%0A${messageVal}`;
      const waUrl = `https://wa.me/201142576116?text=${waText}`;

      // Display pleasant instant confirmation to user
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>جاري المعالجة...</span>`;

      // Send form data to Formspree endpoint
      const formData = new FormData(contactForm);

      fetch('https://formspree.io/f/xrpqpklw', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then((response) => {
        formAlert.style.display = 'block';
        if (response.ok) {
          formAlert.className = 'form-alert success';
          formAlert.innerHTML = `
            <strong>تم إرسال رسالتك وتفاصيل فكرتك بنجاح يا ${escapeHtml(nameVal)}! ✨</strong><br>
            <p style="margin: 0.5rem 0;">وصلت رسالتك مباشرة إلى بريدي الإلكتروني. سأقوم بمراجعتها والتواصل معك في أقرب وقت.</p>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:0.5rem; margin-top:0.6rem; padding:0.55rem 1.1rem; font-size:0.88rem; background-color:#25D366; border-color:#25D366; color:#ffffff;">
              <span>أو تواصل معي على واتساب مباشرة الآن 💬</span>
            </a>
          `;
          contactForm.reset();
        } else {
          throw new Error('Formspree error');
        }
      })
      .catch(() => {
        // Fallback in case of network issue
        formAlert.style.display = 'block';
        formAlert.className = 'form-alert success';
        formAlert.innerHTML = `
          <strong>شكرًا لتواصلك يا ${escapeHtml(nameVal)}! ✨</strong><br>
          <p style="margin: 0.5rem 0;">لتأكيد وصول رسالتك بأسرع وقت، يمكنك إرسالها مباشرة عبر واتساب:</p>
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:0.5rem; margin-top:0.6rem; padding:0.55rem 1.1rem; font-size:0.88rem; background-color:#25D366; border-color:#25D366; color:#ffffff;">
            <span>إرسال تفاصيل الفكرة عبر واتساب 💬</span>
          </a>
        `;
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        // Auto hide success banner after 14 seconds
        setTimeout(() => {
          formAlert.style.display = 'none';
        }, 14000);
      });
    });

    // Clear individual field errors upon user typing
    [nameInput, contactInput, messageInput].forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('has-error');
        const err = input.parentElement.querySelector('.field-error');
        if (err) err.classList.remove('active');
      });
    });
  }

  // Basic HTML entity escaping for user input display
  function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
  }

  /* ----------------------------------------------------------------------------
   * 7. SMOOTH SCROLLING FOR INTERNAL LINKS (ACCESSIBILITY COMPLIANT)
   * -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });
});
