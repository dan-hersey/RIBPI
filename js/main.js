/**
 * RIBPI.com Main JavaScript File
 * Provides core functionality for navigation, animations, and user interactions
 * Modern ES6+ vanilla JavaScript - no frameworks
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce utility - prevents function from being called too frequently
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle utility - limit function calls to once per specified interval
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// MOBILE NAVIGATION TOGGLE
// ============================================================================

const NavMenuController = {
  toggleBtn: null,
  mobileNav: null,
  isOpen: false,

  /**
   * Initialize mobile navigation toggle
   */
  init() {
    this.toggleBtn = document.querySelector('[data-hamburger]');
    this.mobileNav = document.querySelector('[data-mobile-nav]');

    if (!this.toggleBtn || !this.mobileNav) return;

    this.toggleBtn.addEventListener('click', () => this.toggle());

    // Close menu when clicking on nav links
    const navLinks = this.mobileNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.toggleBtn.contains(e.target) && !this.mobileNav.contains(e.target)) {
        this.close();
      }
    });
  },

  /**
   * Toggle mobile navigation
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  /**
   * Open mobile navigation with smooth animation
   */
  open() {
    this.isOpen = true;
    this.toggleBtn.classList.add('active');
    this.mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  /**
   * Close mobile navigation with smooth animation
   */
  close() {
    this.isOpen = false;
    this.toggleBtn.classList.remove('active');
    this.mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  },
};

// ============================================================================
// SCROLL ANIMATIONS - IntersectionObserver
// ============================================================================

const ScrollAnimations = {
  observer: null,

  /**
   * Initialize IntersectionObserver for scroll animations
   */
  init() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px', // Start animation before element fully visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('[data-animate-on-scroll]');
    animatedElements.forEach(element => {
      this.observer.observe(element);
    });
  },

  /**
   * Observe a specific element
   * @param {HTMLElement} element - Element to observe
   */
  observe(element) {
    if (this.observer && element) {
      this.observer.observe(element);
    }
  },
};

// ============================================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================================

const SmoothScroll = {
  /**
   * Initialize smooth scroll for anchor links
   */
  init() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      const offset = 80; // Account for fixed header
      const targetPosition = target.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  },
};

// ============================================================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ============================================================================

const ActiveNavHighlight = {
  /**
   * Initialize active nav highlighting based on current page
   */
  init() {
    this.updateActiveLink();
    window.addEventListener('hashchange', () => this.updateActiveLink());
  },

  /**
   * Update active nav link based on current URL path
   */
  updateActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('[data-nav-link]');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');

      // Check if link matches current path
      if (href === currentPath ||
          (currentPath === '/' && href === '/index.html') ||
          currentPath.includes(href.replace(/\/$/, ''))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  },
};

// ============================================================================
// COUNTER ANIMATION
// ============================================================================

/**
 * Animate a counter from 0 to target value
 * @param {HTMLElement} element - Element containing the counter
 * @param {number} target - Target number to count to
 * @param {number} duration - Duration in milliseconds
 */
function animateCounter(element, target, duration = 2000) {
  if (!element) return;

  const start = 0;
  const startTime = performance.now();
  const isDecimal = !Number.isInteger(target);

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * easeOut;

    element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = isDecimal ? target.toFixed(1) : target;
    }
  }

  requestAnimationFrame(update);
}

// ============================================================================
// BACK TO TOP BUTTON
// ============================================================================

const BackToTop = {
  button: null,
  threshold: 500,

  /**
   * Initialize back to top button
   */
  init() {
    this.button = document.querySelector('[data-back-to-top]');
    if (!this.button) return;

    this.button.addEventListener('click', () => this.scrollToTop());
    window.addEventListener('scroll', throttle(() => this.toggleButton(), 100));
  },

  /**
   * Show/hide button based on scroll position
   */
  toggleButton() {
    if (window.scrollY > this.threshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  },

  /**
   * Smooth scroll to top
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  },
};

// ============================================================================
// DARK MODE THEME MANAGEMENT
// ============================================================================

const ThemeManager = {
  theme: 'dark', // Default to dark mode
  storageKey: 'ribpi-theme',
  toggleBtn: null,

  /**
   * Initialize theme management
   */
  init() {
    this.loadTheme();
    this.toggleBtn = document.querySelector('[data-theme-toggle]');

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  },

  /**
   * Load theme from localStorage or system preference
   */
  loadTheme() {
    const saved = localStorage.getItem(this.storageKey);

    if (saved) {
      this.theme = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.theme = 'light';
    } else {
      this.theme = 'dark';
    }

    this.applyTheme();
  },

  /**
   * Apply theme to document
   */
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem(this.storageKey, this.theme);

    if (this.toggleBtn) {
      this.toggleBtn.setAttribute('aria-label',
        `Switch to ${this.theme === 'dark' ? 'light' : 'dark'} mode`
      );
    }
  },

  /**
   * Toggle between light and dark mode
   */
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
  },
};

// ============================================================================
// PAGE LOAD ANIMATIONS
// ============================================================================

const PageLoadAnimations = {
  /**
   * Initialize fade-in animations for hero content on page load
   */
  init() {
    const hero = document.querySelector('[data-hero]');
    const heroContent = document.querySelector('[data-hero-content]');

    if (hero) {
      hero.classList.add('loaded');
    }

    if (heroContent) {
      // Stagger animation for hero content children
      const children = heroContent.querySelectorAll('[data-hero-item]');
      children.forEach((child, index) => {
        child.style.animationDelay = `${index * 0.1}s`;
        child.classList.add('animate-fade-in');
      });
    }
  },
};

// ============================================================================
// MODAL KEYBOARD ACCESSIBILITY
// ============================================================================

const ModalKeyboardHandler = {
  openModals: [],

  /**
   * Initialize keyboard accessibility for modals
   */
  init() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeTopModal();
      } else if (e.key === 'Tab') {
        this.handleTabTrap(e);
      }
    });
  },

  /**
   * Register a modal as open
   * @param {HTMLElement} modal - Modal element
   */
  openModal(modal) {
    this.openModals.push(modal);
    modal.classList.add('open');
  },

  /**
   * Unregister a modal as closed
   * @param {HTMLElement} modal - Modal element
   */
  closeModal(modal) {
    this.openModals = this.openModals.filter(m => m !== modal);
    modal.classList.remove('open');
  },

  /**
   * Close the topmost (most recently opened) modal
   */
  closeTopModal() {
    if (this.openModals.length > 0) {
      const topModal = this.openModals[this.openModals.length - 1];
      this.closeModal(topModal);
    }
  },

  /**
   * Trap Tab key within modal to maintain accessibility
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleTabTrap(e) {
    if (this.openModals.length === 0) return;

    const modal = this.openModals[this.openModals.length - 1];
    const focusableElements = modal.querySelectorAll(
      'a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey) {
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  },
};

// ============================================================================
// FORM UTILITIES
// ============================================================================

const FormUtils = {
  /**
   * Disable submit button and show loading state
   * @param {HTMLElement} form - Form element
   */
  showLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Loading...';
    }
  },

  /**
   * Re-enable submit button and restore text
   * @param {HTMLElement} form - Form element
   * @param {string} originalText - Original button text
   */
  hideLoading(form, originalText = 'Submit') {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = originalText;
    }
  },

  /**
   * Validate form field
   * @param {HTMLElement} input - Input element
   * @returns {boolean} Validation result
   */
  validateField(input) {
    const value = input.value.trim();
    const type = input.getAttribute('type');

    if (input.hasAttribute('required') && !value) {
      input.classList.add('error');
      return false;
    }

    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        input.classList.add('error');
        return false;
      }
    }

    input.classList.remove('error');
    return true;
  },
};

// ============================================================================
// LAZY LOADING IMAGES
// ============================================================================

const LazyImages = {
  /**
   * Initialize lazy loading for images with data-src attribute
   */
  init() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
    }
  },
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all modules when DOM is ready
 */
function initializeApp() {
  // Theme must be initialized first to avoid flash of wrong theme
  ThemeManager.init();

  // Initialize all features
  NavMenuController.init();
  ScrollAnimations.init();
  SmoothScroll.init();
  ActiveNavHighlight.init();
  BackToTop.init();
  PageLoadAnimations.init();
  ModalKeyboardHandler.init();
  LazyImages.init();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// ============================================================================
// PUBLIC API
// ============================================================================

// Export utilities and controllers for use in other scripts
window.RIBPI = {
  animateCounter,
  debounce,
  throttle,
  NavMenuController,
  ModalKeyboardHandler,
  FormUtils,
  ThemeManager,
};
