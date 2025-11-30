/* ============================================================
   TERRA MAX - HOME PAGE JAVASCRIPT
   Vanilla JS - Smooth Industrial Interactions
   ============================================================ */

(function () {
  "use strict";

  // ============================================================
  // UTILITIES
  // ============================================================

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [
    ...context.querySelectorAll(selector),
  ];

  const debounce = (func, wait = 100) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // ============================================================
  // HEADER - Scroll Effect & Mobile Navigation
  // ============================================================

  const initHeader = () => {
    const header = $("#header");
    const burger = $("#burgerBtn");
    const nav = $("#mainNav");
    const navLinks = $$(".nav__link");

    if (!header) return;

    // Scroll effect
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      header.classList.toggle("scrolled", scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Mobile navigation
    if (burger && nav) {
      if (burger.dataset.navBound === "true") return;
      burger.dataset.navBound = "true";

      const toggleNav = () => {
        burger.classList.toggle("active");
        nav.classList.toggle("active");
        document.body.style.overflow = nav.classList.contains("active")
          ? "hidden"
          : "";
      };

      const closeNav = () => {
        burger.classList.remove("active");
        nav.classList.remove("active");
        document.body.style.overflow = "";
      };

      burger.addEventListener("click", toggleNav);

      navLinks.forEach((link) => {
        link.addEventListener("click", closeNav);
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && nav.classList.contains("active")) {
          closeNav();
        }
      });

      window.addEventListener(
        "resize",
        debounce(() => {
          if (window.innerWidth > 992 && nav.classList.contains("active")) {
            closeNav();
          }
        }, 150),
      );
    }
  };

  // ============================================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================================

  const initScrollReveal = () => {
    const reveals = $$(".reveal, .js-reveal-card"); // Updated selector
    if (!reveals.length) return;

    const revealOptions = {
      root: null,
      rootMargin: "0px 0px 200px 0px", // Trigger earlier: 200px before reaching viewport bottom
      threshold: 0.15, // Slightly higher threshold
    };

    const revealCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("active"); // Support old class
            entry.target.classList.add("is-revealed"); // Support new class

            // OPTIMIZATION: Remove .reveal class after animation to prevent conflicts
            // with internal animations (like sliders) and reduce repaint cost.
            setTimeout(() => {
              entry.target.classList.remove("reveal");
              entry.target.classList.remove("active");
              entry.target.classList.remove("is-revealed");
            }, 1500); // Wait safely longer than transition

          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    };

    const revealObserver = new IntersectionObserver(
      revealCallback,
      revealOptions,
    );

    reveals.forEach((reveal) => revealObserver.observe(reveal));
  };

  // ============================================================
  // COUNTER ANIMATION
  // ============================================================

  const initCounters = () => {
    const counters = $$(".counter");
    if (!counters.length) return;

    const animateCounter = (counter) => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 1500;
      const startTime = performance.now();
      const startValue = 0;
      const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.floor(
          startValue + (target - startValue) * easedProgress,
        );

        counter.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const counterOptions = { root: null, rootMargin: "0px", threshold: 0.5 };
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, counterOptions);
    counters.forEach((counter) => counterObserver.observe(counter));
  };

  // ============================================================
  // CLICKABLE CARDS (Category & Machine)
  // ============================================================

  const initClickableCards = () => {
    // 1. Category Cards (data-href)
    const categoryCards = $$(".category-card, .js-clickable-card[data-href]");
    categoryCards.forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() !== 'a') {
          const href = card.dataset.href;
          if (href) window.location.href = href;
        }
      });
    });

    // 2. Machine Cards (Inner Link)
    const machineCards = $$(".machine-card, .js-clickable-card:not([data-href])");
    machineCards.forEach(card => {
        card.style.cursor = "pointer"; // Visual cue
        card.addEventListener("click", (e) => {
            // If clicked on button/link directly, let it happen
            if (e.target.closest('a') || e.target.closest('button')) return;

            // Find main link
            const mainLink = card.querySelector("a");
            if (mainLink) {
                mainLink.click();
            }
        });
    });
  };

  // ============================================================
  // LAZY LOADING (Utility for heavier images)
  // ============================================================
  const initLazyLoad = () => {
      const lazyImages = $$('img[data-src]');
      if (!lazyImages.length) return;

      const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const img = entry.target;
                  img.src = img.dataset.src;
                  img.onload = () => {
                      img.classList.add('loaded');
                      img.removeAttribute('data-src');
                  };
                  observer.unobserve(img);
              }
          });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
  };

  // ============================================================
  // FLEET SLIDER
  // ============================================================
  const initFleetSlider = () => {
    const track = $("#fleetTrack");
    const prevBtn = $("#fleetPrev");
    const nextBtn = $("#fleetNext");
    const dotsContainer = $("#fleetDots");

    if (!track) return;

    const cards = $$(".fleet-card", track);
    if (!cards.length) return;

    let currentIndex = 0;
    let cardsToShow = 1;
    let gap = 24;

    // Calculate cards to show based on viewport
    const updateCardsToShow = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        cardsToShow = 3;
        gap = 24;
      } else if (width >= 768) {
        cardsToShow = 2;
        gap = 20;
      } else {
        cardsToShow = 1;
        gap = 16;
      }
    };

    // Create dots
    const createDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      const totalDots = Math.ceil(cards.length / cardsToShow);
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("button");
        dot.classList.add("fleet-slider__dot");
        dot.setAttribute("aria-label", `Slide ${i + 1}`);
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    };

    // Update slider position
    const updateSlider = () => {
      const cardWidth = cards[0].offsetWidth;
      const offset = -(currentIndex * (cardWidth + gap));
      track.style.transform = `translateX(${offset}px)`;
      track.style.transition = "transform 0.5s ease-in-out";

      // Update dots
      if (dotsContainer) {
        const dots = $$(".fleet-slider__dot", dotsContainer);
        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === Math.floor(currentIndex / cardsToShow));
        });
      }

      // No disabled state - infinite loop enabled
      if (prevBtn) {
        prevBtn.disabled = false;
      }
      if (nextBtn) {
        nextBtn.disabled = false;
      }
    };

    // Go to specific slide
    const goToSlide = (index) => {
      currentIndex = index * cardsToShow;
      currentIndex = Math.max(0, Math.min(currentIndex, cards.length - cardsToShow));
      updateSlider();
    };

    let isAnimating = false;

    // Navigation with infinite loop
    const goNext = () => {
      if (isAnimating) return;
      isAnimating = true;

      if (currentIndex < cards.length - cardsToShow) {
        currentIndex++;
      } else {
        // Loop back to start with smooth animation
        currentIndex = 0;
      }
      updateSlider();
      setTimeout(() => { isAnimating = false; }, 500);
    };

    const goPrev = () => {
      if (isAnimating) return;
      isAnimating = true;

      if (currentIndex > 0) {
        currentIndex--;
      } else {
        // Loop to end with smooth animation
        currentIndex = cards.length - cardsToShow;
      }
      updateSlider();
      setTimeout(() => { isAnimating = false; }, 500);
    };

    // Event listeners
    if (prevBtn) prevBtn.addEventListener("click", goPrev);
    if (nextBtn) nextBtn.addEventListener("click", goNext);

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        goNext();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        goPrev();
      }
    };

    // Initialize
    const init = () => {
      updateCardsToShow();
      createDots();
      updateSlider();
    };

    // Reinitialize on resize
    window.addEventListener("resize", debounce(() => {
      updateCardsToShow();
      createDots();
      currentIndex = 0;
      updateSlider();
    }, 200));

    init();
  };

  // ============================================================
  // GALLERY FILTERS (for realizacje.html)
  // ============================================================
  const initGalleryFilters = () => {
    const filterBtns = $$(".filter-btn");
    const galleryItems = $$(".gallery-item");

    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        filterBtns.forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        // First, hide all items with animation
        galleryItems.forEach((item) => {
          item.classList.add("hiding");
          item.classList.remove("showing");
        });

        // After hiding animation, show filtered items
        setTimeout(() => {
          galleryItems.forEach((item, index) => {
            const category = item.dataset.category;

            if (filter === "all" || category === filter) {
              item.style.display = "block";
              item.classList.remove("hiding");

              // Subtle stagger animation
              setTimeout(() => {
                item.classList.add("showing");
                item.classList.add("active");
                item.classList.add("is-revealed");
              }, index * 30); // 30ms delay - more subtle
            } else {
              item.style.display = "none";
              item.classList.remove("active");
              item.classList.remove("is-revealed");
              item.classList.remove("showing");
            }
          });
        }, 200); // Faster transition
      });
    });

    // Initial animation on page load
    galleryItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("showing");
      }, index * 50);
    });
  };

  // ============================================================
  // HERO PARALLAX EFFECT
  // ============================================================
  const initHeroParallax = () => {
    const hero = $(".hero");
    const heroBg = $(".hero__background img");

    if (!hero || !heroBg) return;

    const handleParallax = () => {
      const scrolled = window.scrollY;
      const heroHeight = hero.offsetHeight;

      if (scrolled <= heroHeight) {
        // Parallax effect: background moves slower than scroll
        heroBg.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
      }
    };

    window.addEventListener("scroll", handleParallax, { passive: true });
    handleParallax();
  };

  // ============================================================
  // BACK TO TOP BUTTON
  // ============================================================
  const initBackToTop = () => {
    const backToTopBtn = $("#backToTop");
    if (!backToTopBtn) return;

    const toggleButton = () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    window.addEventListener("scroll", debounce(toggleButton, 100), { passive: true });
    backToTopBtn.addEventListener("click", scrollToTop);

    // Initial check
    toggleButton();
  };

  // ============================================================
  // INITIALIZE
  // ============================================================

  const init = () => {
    initHeader();
    initHeroParallax(); // Hero parallax scroll effect
    initScrollReveal();
    initCounters();
    initClickableCards(); // Unified click handler
    initLazyLoad(); // Initialize lazy loader logic
    initFleetSlider(); // Fleet slider for home page
    initGalleryFilters(); // Gallery filters for realizacje page
    initBackToTop(); // Back to top button

    console.log("🏗️ TRANS-KOP - JavaScript Ready");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();