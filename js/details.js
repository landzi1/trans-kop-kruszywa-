/* ============================================================
   TRANS-KOP - SERVICE PAGE ENGINE
   Dopasowany do stylu głównej strony
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // UTILITIES
    // ============================================================

    const $ = (s, ctx = document) => ctx.querySelector(s);
    const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    const debounce = (func, wait = 100) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // ============================================================
    // 1. SCROLL PROGRESS BAR
    // ============================================================

    const initScrollProgress = () => {
        let progressBar = $('.scroll-progress');

        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            document.body.appendChild(progressBar);
        }

        const updateProgress = () => {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight - winHeight;
            const scrolled = window.scrollY;
            const progress = clamp((scrolled / docHeight) * 100, 0, 100);

            progressBar.style.width = `${progress}%`;
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    };

    // ============================================================
    // 2. HERO PARALLAX
    // ============================================================

    const initHeroParallax = () => {
        const hero = $('.page-hero--compact');
        const heroBg = $('.page-hero__background img');

        if (!hero || !heroBg) return;

        const handleParallax = () => {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrolled <= heroHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
            }
        };

        window.addEventListener('scroll', handleParallax, { passive: true });
        handleParallax();
    };

    // ============================================================
    // 3. SCROLL REVEAL - INTERSECTION OBSERVER
    // ============================================================

    const initScrollReveal = () => {
        const elements = [
            ...$$('.content-section'),
            ...$$('.content-area'),
            ...$$('.reveal'),
            ...$$('.sidebar-widget'),
            ...$$('.widget-contact'),
            ...$$('.widget'),
            ...$$('.check-list li'),
            ...$$('.content-gallery img')
        ];

        if (!elements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.15
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        elements.forEach(el => observer.observe(el));
    };

    // ============================================================
    // 4. TIMELINE ANIMATIONS
    // ============================================================

    const initTimelineAnimations = () => {
        const timelineItems = $$('.timeline-item');
        if (!timelineItems.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.15
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        timelineItems.forEach(item => observer.observe(item));
    };


    // ============================================================
    // 5. SMOOTH SCROLL
    // ============================================================

    const initSmoothScroll = () => {
        const links = $$('a[href^="#"]:not([href="#"])');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const target = $(targetId);

                if (!target) return;

                e.preventDefault();

                const header = $('#header');
                const headerHeight = header?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    };

    // ============================================================
    // 6. HEADER EFFECTS
    // ============================================================

    const initHeader = () => {
        const header = $('#header');
        if (!header) return;

        const handleScroll = () => {
            const scrolled = window.scrollY > 50;
            header.classList.toggle('scrolled', scrolled);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    // ============================================================
    // 7. MOBILE NAVIGATION
    // ============================================================

    const initMobileNav = () => {
        const burger = $('#burgerBtn');
        const nav = $('#mainNav');

        if (!burger || !nav) return;

        // Avoid binding twice when home.js already handled the burger
        if (burger.dataset.navBound === 'true') return;
        burger.dataset.navBound = 'true';

        const toggleNav = () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        };

        const closeNav = () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        };

        burger.addEventListener('click', toggleNav);

        const navLinks = $$('.nav__link');
        navLinks.forEach(link => link.addEventListener('click', closeNav));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeNav();
            }
        });

        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 992 && nav.classList.contains('active')) {
                closeNav();
            }
        }, 150));
    };

    // ============================================================
    // 8. LAZY LOAD IMAGES
    // ============================================================

    const initLazyLoad = () => {
        const images = $$('img[data-src]');
        if (!images.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        images.forEach(img => imageObserver.observe(img));
    };

    // ============================================================
    // MASTER INITIALIZATION
    // ============================================================

    const init = () => {
        // Core features
        initScrollProgress();
        initHeroParallax();
        initScrollReveal();
        initTimelineAnimations();
        initSmoothScroll();
        initHeader();
        initMobileNav();
        initLazyLoad();

        console.log('⚡ TRANS-KOP Service Page Engine | Ready');
    };

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
