
/**
 * REALIZACJE - Integrated Gallery Logic
 * Handles: Filtering, Mobile Slider (with spam protection), and Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const filterBtns = document.querySelectorAll('.filter-btn');
    const arrowLeft = document.getElementById('galleryArrowLeft');
    const arrowRight = document.getElementById('galleryArrowRight');
    const galleryDots = document.getElementById('galleryDots');

    // Lightbox Elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // State
    let visibleItems = [...galleryItems]; // Currently shown items (based on filter)
    let isAnimating = false; // For spam protection on arrows
    let lightboxIndex = 0; // Index within visibleItems for Lightbox
    let lightboxTimeout;

    // ==================== 1. FILTERING LOGIC ====================

    function applyFilter(filterType) {
        // 1. Update Buttons
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filterType);
        });

        // 2. Filter Items & Update State
        visibleItems = []; // Reset
        const isMobile = window.innerWidth <= 768;

        galleryItems.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = filterType === 'all' || category === filterType;

            // Animation handling
            if (shouldShow) {
                item.style.display = isMobile ? 'block' : 'block'; // Reset to block (grid/flex handles layout)
                // Note: specific grid classes handle layout on desktop, flex on mobile
                if (isMobile) item.style.minWidth = '85vw'; // Ensure mobile sizing if inline styles were lost
                
                item.classList.remove('hiding');
                item.classList.add('showing');
                visibleItems.push(item);
            } else {
                item.classList.add('hiding');
                setTimeout(() => {
                    if(item.classList.contains('hiding')) {
                        item.style.display = 'none';
                        item.classList.remove('hiding'); // Clean up
                    }
                }, 300);
            }
        });

        // 3. Re-initialize Mobile Navigation (Dots & Scroll)
        if (isMobile) {
            updateMobileDots();
            // Reset scroll to start
            if (visibleItems.length > 0) {
                galleryGrid.scrollTo({ left: 0, behavior: 'smooth' });
            }
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            applyFilter(filter);
        });
    });

    // ==================== 2. MOBILE SLIDER & NAVIGATION ====================

    function updateMobileDots() {
        if (!galleryDots) return;
        galleryDots.innerHTML = '';

        if (visibleItems.length === 0) return;

        visibleItems.forEach((item, index) => {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot';
            if (index === 0) dot.classList.add('active');
            dot.ariaLabel = `Zdjęcie ${index + 1}`;
            
            dot.addEventListener('click', () => {
                scrollToMobileItem(index);
            });
            
            galleryDots.appendChild(dot);
        });
    }

    function scrollToMobileItem(index) {
        if (index < 0 || index >= visibleItems.length) return;
        
        const item = visibleItems[index];
        
        // Calculate center position manually for better control
        // const gridCenter = galleryGrid.clientWidth / 2;
        // const itemCenter = item.clientWidth / 2;
        // const scrollLeft = item.offsetLeft - gridCenter + itemCenter; 
        
        // Simple scrollIntoView is usually enough with snap, but manual provides backup
        item.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    // Intersection Observer to update Dots on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find index in VISIBLE items
                const index = visibleItems.indexOf(entry.target);
                if (index !== -1) {
                    // Update dots
                    const dots = galleryDots.querySelectorAll('.gallery-dot');
                    dots.forEach((d, i) => d.classList.toggle('active', i === index));
                }
            }
        });
    }, {
        root: galleryGrid,
        threshold: 0.5
    });

    // Observe all items (observer will ignore hidden ones effectively as they don't intersect)
    galleryItems.forEach(item => observer.observe(item));


    // ARROW HANDLERS (with Spam Protection)
    function handleArrowClick(direction) {
        if (isAnimating) return;
        isAnimating = true;

        // Find current center item
        // We approximate by finding the active dot, or calculating center
        let currentIndex = 0;
        // Heuristic: find the item closest to the center of the scroll container
        const gridRect = galleryGrid.getBoundingClientRect();
        const gridCenter = gridRect.left + gridRect.width / 2;

        let closestDist = Infinity;
        
        visibleItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const dist = Math.abs(gridCenter - itemCenter);
            if (dist < closestDist) {
                closestDist = dist;
                currentIndex = index;
            }
        });

        // Calculate Next
        let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

        // Loop logic
        if (nextIndex >= visibleItems.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = visibleItems.length - 1;

        scrollToMobileItem(nextIndex);

        // Unlock after animation
        setTimeout(() => {
            isAnimating = false;
        }, 600); // Match scroll duration approx
    }

    if (arrowLeft) arrowLeft.addEventListener('click', () => handleArrowClick('prev'));
    if (arrowRight) arrowRight.addEventListener('click', () => handleArrowClick('next'));


    // ==================== 3. LIGHTBOX LOGIC ====================

    function openLightbox(index) {
        lightboxIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock body scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const item = visibleItems[lightboxIndex];
        const img = item.querySelector('img');
        if (img) {
            // Check if lightbox is already open (active) to decide on animation
            if (lightbox.classList.contains('active')) {
                lightboxImg.classList.add('fade-out');
                
                if (lightboxTimeout) clearTimeout(lightboxTimeout);

                lightboxTimeout = setTimeout(() => {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightboxImg.classList.remove('fade-out');
                }, 300); // Match CSS transition
            } else {
                // First open - instant update (lightbox container handles fade in)
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
            }
        }
    }

    function lightboxNav(dir) {
        if (dir === 'next') {
            lightboxIndex = (lightboxIndex + 1) % visibleItems.length;
        } else {
            lightboxIndex = (lightboxIndex - 1 + visibleItems.length) % visibleItems.length;
        }
        updateLightboxContent();
    }

    // Bind Click on Items
    // We need to bind this dynamically or delegate because filtering doesn't remove elements, just hides
    // But we only want to open lightbox if item is visible
    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Only if visible
            if (item.style.display === 'none') return;
            
            // Find index in Visible Items
            const index = visibleItems.indexOf(item);
            if (index !== -1) {
                openLightbox(index);
            }
        });
    });

    // Lightbox Controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => lightboxNav('prev'));
    if (lightboxNext) lightboxNext.addEventListener('click', () => lightboxNav('next'));
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') lightboxNav('next');
        if (e.key === 'ArrowLeft') lightboxNav('prev');
    });

    // ==================== INITIALIZATION ====================
    // Run once on load to set up initial state
    applyFilter('all'); // Initialize with all items and set up mobile dots/scroll

    if (window.innerWidth <= 768 && galleryGrid) {
        // Ensure the gallery starts at the beginning on mobile.
        // A small delay to allow browser to render and snap before forcing position.
        setTimeout(() => {
            galleryGrid.scrollTo({ left: 0, behavior: 'auto' });
        }, 100);
    }
    
    // Handle Resize (re-calc layout if needed)
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            updateMobileDots();
            if (galleryGrid) {
                galleryGrid.scrollTo({ left: 0, behavior: 'auto' }); // Reset scroll on resize to mobile
            }
        } else {
            // Reset styles for desktop if switching back
            galleryItems.forEach(item => item.style.display = ''); // Clear display:none from filtered items
        }
    });

});
