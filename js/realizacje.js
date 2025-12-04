// ==================== MOBILE GALLERY NAVIGATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryDots = document.getElementById('galleryDots');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const arrowLeft = document.getElementById('galleryArrowLeft');
    const arrowRight = document.getElementById('galleryArrowRight');

    let currentIndex = 0;

    // Reset scroll position on load (mobile)
    if (window.innerWidth <= 768 && galleryGrid) {
        galleryGrid.scrollLeft = 0;
    }

    // Create dots only on mobile
    function initMobileNavigation() {
        if (window.innerWidth <= 768 && galleryItems.length > 0) {
            galleryDots.innerHTML = '';

            galleryItems.forEach((item, index) => {
                const dot = document.createElement('button');
                dot.classList.add('gallery-dot');
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Zdjęcie ${index + 1}`);

                dot.addEventListener('click', () => {
                    scrollToItem(index);
                });

                galleryDots.appendChild(dot);
            });

            // Update active dot on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = Array.from(galleryItems).indexOf(entry.target);
                        currentIndex = index;
                        document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
                            dot.classList.toggle('active', i === index);
                        });
                    }
                });
            }, {
                root: galleryGrid,
                threshold: 0.6
            });

            galleryItems.forEach(item => observer.observe(item));
        }
    }

    function scrollToItem(index) {
        if (galleryItems[index]) {
            galleryItems[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
            currentIndex = index;
        }
    }

    // Arrow navigation with loop
    if (arrowLeft && arrowRight) {
        arrowLeft.addEventListener('click', () => {
            currentIndex = currentIndex - 1;
            if (currentIndex < 0) {
                currentIndex = galleryItems.length - 1; // Loop to last
            }
            scrollToItem(currentIndex);
        });

        arrowRight.addEventListener('click', () => {
            currentIndex = currentIndex + 1;
            if (currentIndex >= galleryItems.length) {
                currentIndex = 0; // Loop to first
            }
            scrollToItem(currentIndex);
        });
    }

    initMobileNavigation();
    window.addEventListener('resize', initMobileNavigation);
});

// ==================== LIGHTBOX GALLERY ====================
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let currentIndex = 0;
    let images = [];

    // Collect all gallery images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            images.push({
                src: img.src,
                alt: img.alt
            });

            // Add click event to gallery item
            item.addEventListener('click', () => {
                openLightbox(index);
            });
        }
    });

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });
});

// ==================== GALLERY FILTERS ====================
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const isMobile = window.innerWidth <= 768;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Filter items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                // Add hiding class first
                item.classList.add('hiding');

                setTimeout(() => {
                    if (filter === 'all' || category === filter) {
                        // On mobile use flex, on desktop use block
                        item.style.display = isMobile ? 'flex' : 'block';
                        item.classList.remove('hiding');
                        item.classList.add('showing');

                        // Remove showing class after animation
                        setTimeout(() => {
                            item.classList.remove('showing');
                        }, 400);
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('hiding');
                    }
                }, 300);
            });

            // Reinit mobile navigation after filtering
            if (isMobile) {
                setTimeout(() => {
                    const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
                    updateMobileDots(visibleItems);
                }, 400);
            }
        });
    });

    function updateMobileDots(visibleItems) {
        const galleryDots = document.getElementById('galleryDots');
        if (!galleryDots || visibleItems.length === 0) return;

        galleryDots.innerHTML = '';

        visibleItems.forEach((item, index) => {
            const dot = document.createElement('button');
            dot.classList.add('gallery-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Zdjęcie ${index + 1}`);

            dot.addEventListener('click', () => {
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            });

            galleryDots.appendChild(dot);
        });
    }
});
