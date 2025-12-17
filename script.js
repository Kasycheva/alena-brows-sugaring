// ===================================
// Smooth Scroll Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href !== "") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open
        document.getElementById("navMenu").classList.remove("active");
      }
    }
  });
});

// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navMenu = document.getElementById("navMenu");

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active");
  });
}

// ===================================
// Navbar Scroll Effect
// ===================================
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (navbar) {
    if (currentScroll > 100) {
      navbar.style.background = "rgba(10, 5, 3, 0.98)";
      navbar.style.boxShadow = "0 4px 16px rgba(10, 5, 3, 0.3)";
    } else {
      navbar.style.background = "rgba(10, 5, 3, 0.95)";
      navbar.style.boxShadow = "0 2px 8px rgba(10, 5, 3, 0.1)";
    }
  }

  lastScroll = currentScroll;
});

// ===================================
// Scroll Animations with Intersection Observer
// ===================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animated");

      // Add stagger effect for benefit cards
      if (
        entry.target.classList.contains("benefit-card") ||
        entry.target.classList.contains("testimonial-card")
      ) {
        const delay = entry.target.style.getPropertyValue("--delay") || "0s";
        entry.target.style.transitionDelay = delay;
      }
    }
  });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll("[data-animate]").forEach((el) => {
  observer.observe(el);
});

// ===================================
// Create Chaotic Golden Particles
// ===================================
function createChaoticParticles() {
  // Respect reduced motion preferences and small screens
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth && window.innerWidth < 700) return;

  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  // Clear existing particles
  particlesContainer.innerHTML = '';

  function spawnParticle() {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random size between 3-10px
    const size = Math.random() * 7 + 3;
    
    // Random starting position (anywhere on screen)
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    
    // Random scatter direction and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 400 + 200;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - Math.random() * 200; // Bias upward
    
    // Random animation properties
    const duration = Math.random() * 3 + 2; // 2-5 seconds
    const delay = Math.random() * 0.5;
    const animationName = `chaoticFloat${Math.floor(Math.random() * 6) + 1}`;
    
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${startY}%;
      left: ${startX}%;
      --tx${Math.floor(Math.random() * 6) + 1}: ${tx}px;
      --ty${Math.floor(Math.random() * 6) + 1}: ${ty}px;
      animation: ${animationName} ${duration}s ease-out ${delay}s forwards;
    `;

    particlesContainer.appendChild(particle);

    // Remove particle after animation completes
    setTimeout(() => {
      particle.remove();
    }, (duration + delay) * 1000);
  }

  // Spawn particles continuously
  function particleLoop() {
    // Spawn 2-4 particles at once
    const burstCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => spawnParticle(), i * 100);
    }
    
    // Schedule next burst
    const nextBurst = Math.random() * 800 + 400; // 400-1200ms
    setTimeout(particleLoop, nextBurst);
  }

  // Start the particle system
  particleLoop();
  
  // Initial burst
  for (let i = 0; i < 15; i++) {
    setTimeout(() => spawnParticle(), i * 100);
  }
}

// Initialize particles on load
window.addEventListener('load', () => {
  createChaoticParticles();
  // Scroll to hero on page load
  const hero = document.getElementById('hero');
  if (hero) {
    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    window.scrollTo({
      top: hero.offsetTop - navHeight,
      behavior: 'smooth'
    });
  }
});

// Also start immediately
createChaoticParticles();

// ===================================
// Parallax Effect on Scroll
// ===================================
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;

  // Parallax for hero content (only on larger screens)
  const heroContent = document.querySelector(".hero-content");
  if (heroContent && window.innerWidth > 768 && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    const maxTranslate = 80; // px
    const translate = Math.min(scrolled * 0.5, maxTranslate);
    heroContent.style.transform = `translateY(${translate}px)`;
    heroContent.style.opacity = Math.max(0.28, 1 - scrolled / 600);
  }
});

// ===================================
// Custom Portfolio Carousel with Infinite Loop
// ===================================
const carouselInstances = {};

function initPortfolioSwipers() {
  // Initialize custom carousel for each portfolio carousel
  document.querySelectorAll('.custom-carousel-track').forEach((trackEl) => {
    const carouselId = trackEl.dataset.carousel;
    const cards = trackEl.querySelectorAll('.portfolio-card');
    const container = trackEl.closest('.custom-carousel-container');
    const leftArrow = container.querySelector('.carousel-nav-left');
    const rightArrow = container.querySelector('.carousel-nav-right');
    const dots = document.querySelector(`.carousel-dots[data-carousel="${carouselId}"]`);
    const dotElements = dots ? dots.querySelectorAll('.carousel-dot') : [];
    
    let currentIndex = 0;
    let isAnimating = false;
    let autoplayInterval = null;
    
    // Calculate visible cards based on screen size
    function getVisibleCards() {
      if (window.innerWidth >= 1024) return 4;
      return 3;
    }
    
    // Update carousel positions
    function updateCarousel(newIndex, direction = 'next') {
      if (isAnimating) return;
      isAnimating = true;
      
      // Infinite loop calculation
      currentIndex = (newIndex + cards.length) % cards.length;
      
      const visibleCards = getVisibleCards();
      
      cards.forEach((card, i) => {
        const offset = (i - currentIndex + cards.length) % cards.length;
        
        // Remove all position classes
        card.classList.remove(
          'center',
          'left-1',
          'left-2',
          'right-1',
          'right-2',
          'hidden'
        );
        
        // Position cards based on offset and visible cards
        if (offset === 0) {
          card.classList.add('center');
        } else if (visibleCards >= 4) {
          // Desktop: show 4 cards (center, left-1, right-1, left-2, right-2)
          if (offset === 1) {
            card.classList.add('right-1');
          } else if (offset === 2) {
            card.classList.add('right-2');
          } else if (offset === cards.length - 1) {
            card.classList.add('left-1');
          } else if (offset === cards.length - 2) {
            card.classList.add('left-2');
          } else {
            card.classList.add('hidden');
          }
        } else if (visibleCards >= 2) {
          // Tablet: show 2 cards (center, left-1, right-1)
          if (offset === 1) {
            card.classList.add('right-1');
          } else if (offset === cards.length - 1) {
            card.classList.add('left-1');
          } else {
            card.classList.add('hidden');
          }
        } else {
          // Mobile: show only center card
          card.classList.add('hidden');
        }
      });
      
      // Update dots
      dotElements.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
      
      setTimeout(() => {
        isAnimating = false;
      }, 800);
    }
    
    // Navigation handlers
    leftArrow.addEventListener('click', () => {
      updateCarousel(currentIndex - 1, 'prev');
    });
    
    rightArrow.addEventListener('click', () => {
      updateCarousel(currentIndex + 1, 'next');
    });
    
    // Dot navigation
    dotElements.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        updateCarousel(i);
      });
    });
    
    // Card click navigation
    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        updateCarousel(i);
      });
    });
    
    // Keyboard navigation
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        updateCarousel(currentIndex - 1, 'prev');
      } else if (e.key === 'ArrowRight') {
        updateCarousel(currentIndex + 1, 'next');
      }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    trackEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    trackEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          updateCarousel(currentIndex + 1, 'next');
        } else {
          updateCarousel(currentIndex - 1, 'prev');
        }
      }
    });
    
    // Autoplay function
    function startAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
      
      autoplayInterval = setInterval(() => {
        if (!isAnimating) {
          updateCarousel(currentIndex + 1, 'next');
        }
      }, 2000);
    }
    
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }
    
    // Pause autoplay on hover
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
    
    // Store instance
    carouselInstances[carouselId] = {
      updateCarousel,
      startAutoplay,
      stopAutoplay,
      currentIndex: () => currentIndex
    };
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCarousel(currentIndex);
      }, 250);
    });
    
    // Initialize
    updateCarousel(0);
    startAutoplay();
  });
}

// ===================================
// Initialize Swiper for Portfolio on Mobile
// ===================================
function initPortfolioSwiper() {
  if (window.innerWidth <= 1023) {
    const swiperBrows = document.getElementById('swiper-brows');
    const swiperSugaring = document.getElementById('swiper-sugaring');

    if (swiperBrows && !swiperBrows.swiper) {
      new Swiper(swiperBrows, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoHeight: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: swiperBrows.querySelector('.swiper-button-next'),
          prevEl: swiperBrows.querySelector('.swiper-button-prev'),
        },
        pagination: {
          el: swiperBrows.querySelector('.swiper-pagination'),
          clickable: true,
        },
      });
    }

    if (swiperSugaring && !swiperSugaring.swiper) {
      new Swiper(swiperSugaring, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoHeight: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: swiperSugaring.querySelector('.swiper-button-next'),
          prevEl: swiperSugaring.querySelector('.swiper-button-prev'),
        },
        pagination: {
          el: swiperSugaring.querySelector('.swiper-pagination'),
          clickable: true,
        },
      });
    }
  }
}

// Call on load and resize
window.addEventListener('load', initPortfolioSwiper);
window.addEventListener('resize', () => {
  // Destroy swiper on desktop
  document.querySelectorAll('.portfolio-swiper').forEach((swiperEl) => {
    if (swiperEl.swiper && window.innerWidth > 767) {
      swiperEl.swiper.destroy(true, true);
    }
  });
  initPortfolioSwiper();
});
function initPortfolioModal() {
  const modal = document.getElementById('portfolioModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = modal?.querySelector('.modal-close');

  if (!modal || !modalImg || !closeBtn) {
    console.warn('Portfolio modal elements not found');
    return;
  }

  // Open modal on image click (using event delegation for dynamic content)
  document.addEventListener('click', function(e) {
    const portfolioCard = e.target.closest('.portfolio-card');
    const portfolioItem = e.target.closest('.portfolio-item');
    const target = portfolioCard || portfolioItem;
    if (target) {
      // Get the cover image (main image)
      const img = target.querySelector('.portfolio-cover') || target.querySelector('img');
      if (img && img.src) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Portfolio Image';
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      }
    }
  });

  // Close modal function
  function closeModal() {
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // Close modal on button click
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-content')) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ===================================
// Welcome Popup with Confetti WOW Effect
// ===================================
function createConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;
  
  const colors = ['#FFD764', '#F4A460', '#C9A961', '#FF6B6B', '#4ECDC4'];
  
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      
      container.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3500);
    }, i * 30);
  }
}

function showWelcomePopup() {
  const welcomePopup = document.getElementById("welcomePopup");
  const popupClose = document.getElementById("popupClose");

  if (!welcomePopup) {
    console.error("Welcome popup not found!");
    return;
  }

  // Check if user has visited before
  const hasVisited = localStorage.getItem("hasVisited");

  if (!hasVisited) {
    // Show popup after 2 seconds
    setTimeout(() => {
      welcomePopup.classList.add("active");
    }, 2000);

    // Mark as visited
    localStorage.setItem("hasVisited", "true");
  }

  // Close popup on click
  if (popupClose) {
    popupClose.addEventListener("click", () => {
      welcomePopup.classList.remove("active");
    });
  }

  // Close popup on outside click
  welcomePopup.addEventListener("click", (e) => {
    if (e.target === welcomePopup) {
      welcomePopup.classList.remove("active");
    }
  });

  // Close popup on booking button click
  const ctaButton = welcomePopup.querySelector(".popup-cta");
  if (ctaButton) {
    ctaButton.addEventListener("click", () => {
      welcomePopup.classList.remove("active");
    });
  }
  
  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && welcomePopup.classList.contains("active")) {
      welcomePopup.classList.remove("active");
    }
  });
}

showWelcomePopup();

// ===================================
// Smooth Reveal on Scroll
// ===================================
function revealOnScroll() {
  const reveals = document.querySelectorAll("[data-animate]");

  reveals.forEach((element) => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      element.classList.add("animated");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // Initial check

// ===================================
// Dynamic Year in Footer
// ===================================
const currentYear = new Date().getFullYear();
const footerText = document.querySelector(".footer-bottom p");
if (footerText) {
  footerText.innerHTML = footerText.innerHTML.replace("2024", currentYear);
}

// ===================================
// Pricing Table Hover Effects
// ===================================
document.querySelectorAll(".price-item").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    this.style.transform = "translateX(10px)";
  });

  item.addEventListener("mouseleave", function () {
    this.style.transform = "translateX(0)";
  });
});

// ===================================
// Certificate Image Modal (Optional Enhancement)
// ===================================
document.querySelectorAll(".certificate-item img").forEach((img) => {
  img.addEventListener("click", function () {
    // Create modal overlay
    const modal = document.createElement("div");
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        `;

    // Create close button
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            color: #fff;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10001;
        `;

    // Create image
    const modalImg = document.createElement("img");
    modalImg.src = this.src;
    modalImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 16px;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
        `;

    modal.appendChild(closeBtn);
    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    // Close on click
    const closeModal = () => modal.remove();
    modal.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal();
    });
  });
});

// ===================================
// Certificate Fan: support hover + touch
// ===================================
function setupCertificateFan() {
  const grid = document.querySelector('.certificate-grid');
  if (!grid) return;

  const style = window.getComputedStyle(grid);
  // Only enable fan behavior when grid is positioned (i.e., not switched to static/grid for mobile)
  if (style.position === 'static') return;

  // Hover (desktop)
  grid.addEventListener('mouseenter', () => grid.classList.add('spread'));
  grid.addEventListener('mouseleave', () => grid.classList.remove('spread'));

  // Touch / click: toggle spread for accessibility on touch devices
  grid.addEventListener('pointerdown', (e) => {
    // If user pressed a certificate-item, toggle spread
    if (e.target.closest('.certificate-item')) {
      grid.classList.toggle('spread');
    }
  });
}

// Run on load and on resize (to respect responsive layout changes)
window.addEventListener('load', setupCertificateFan);
window.addEventListener('resize', () => {
  // remove previous handlers by recreating: simple approach — remove class and re-run setup
  const grid = document.querySelector('.certificate-grid');
  if (grid) grid.classList.remove('spread');
  setupCertificateFan();
});

// ===================================
// Lazy Loading Images
// ===================================
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ===================================
// Add Blur Effect on Scroll
// ===================================
let ticking = false;

function updateBlur() {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");

  if (hero) {
    const blurAmount = Math.min(scrolled / 100, 10);
    hero.style.filter = `blur(${blurAmount}px)`;
  }

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateBlur);
    ticking = true;
  }
});

// ===================================
// Testimonials Rotation Animation
// ===================================
function animateTestimonials() {
  const testimonials = document.querySelectorAll(".testimonial-card");

  testimonials.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";

      setTimeout(() => {
        card.style.transition = "all 0.6s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 100);
    }, index * 150);
  });
}

// Trigger testimonials animation when section is visible
const testimonialsSection = document.querySelector(".testimonials");
if (testimonialsSection) {
  const testimonialsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateTestimonials();
          testimonialsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  testimonialsObserver.observe(testimonialsSection);
}

// ===================================
// Smooth Counter Animation for Prices (Optional)
// ===================================
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start) + " грн";
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// ===================================
// Performance Optimization
// ===================================
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll-heavy functions
const debouncedReveal = debounce(revealOnScroll, 50);
window.addEventListener("scroll", debouncedReveal);

// ===================================
// Accessibility Enhancements
// ===================================
// Add keyboard navigation support
document.querySelectorAll(".btn-primary, .btn-secondary").forEach((button) => {
  button.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      button.click();
    }
  });
});

// Focus trap for popup
// Focus trap for popup
const popup = document.getElementById("welcomePopup");
if (popup) {
  const focusableElements = popup.querySelectorAll("button, a[href]");
  
  if (focusableElements.length > 0) {
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    popup.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }

      if (e.key === "Escape") {
        popup.classList.remove("active");
      }
    });
  }
}

// ===================================
// Console Welcome Message
// ===================================
console.log(
  "%c✨ Alena Brows & Sugaring Studio ✨",
  "font-size: 20px; font-weight: bold; color: #F4A460;"
);
console.log(
  "%cПрофесійний шугарінг та оформлення брів у Харкові",
  "font-size: 14px; color: #3E2723;"
);
console.log(
  "%c📍 вул. Академіка Павлова, 120",
  "font-size: 12px; color: #6B6B6B;"
);
console.log("%c📞 +38 (093) 742-63-54", "font-size: 12px; color: #6B6B6B;");

// ===================================
// Loading Animation Complete
// ===================================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  console.log(
    "%c✅ Сайт завантажено успішно!",
    "font-size: 14px; color: #4CAF50; font-weight: bold;"
  );
});

// ===================================
// Portfolio Tabs Functionality
// ===================================
// ===================================
// Portfolio Tabs Functionality (Event Delegation)
// ===================================
document.addEventListener("click", (e) => {
  const tab = e.target.closest(".portfolio-tab");
  if (!tab) return; 

  // Prevent default behavior
  e.preventDefault();

  // 1. Update Tabs UI
  document.querySelectorAll(".portfolio-tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");

  // 2. Update Carousels
  const targetSelector = tab.dataset.target;
  const targetCarousel = document.querySelector(targetSelector);
  
  if (targetCarousel) {
    // Hide all
    document.querySelectorAll(".portfolio-carousel").forEach((c) => c.classList.remove("active"));
    
    // Show target
    targetCarousel.classList.add("active");
    
    // 3. Update CTA
    document.querySelectorAll(".portfolio-cta").forEach((cta) => cta.classList.remove("active"));
    if (targetSelector === "#portfolio-brows") {
      document.getElementById("cta-brows").classList.add("active");
    } else if (targetSelector === "#portfolio-sugaring") {
      document.getElementById("cta-sugaring").classList.add("active");
    }
    
    // Restart carousel autoplay for the active carousel
    const trackEl = targetCarousel.querySelector('.custom-carousel-track');
    if (trackEl) {
      const carouselId = trackEl.dataset.carousel;
      if (carouselInstances[carouselId]) {
        carouselInstances[carouselId].stopAutoplay();
        setTimeout(() => {
          carouselInstances[carouselId].startAutoplay();
        }, 200);
      } else {
        // If not initialized, initialize it
        initPortfolioSwipers();
      }
    }
  }
});

// Store Swiper instances
let portfolioSwipers = [];

// ===================================
// Initialize Portfolio on DOM Ready
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  initPortfolioSwipers();
  initPortfolioModal();
});

