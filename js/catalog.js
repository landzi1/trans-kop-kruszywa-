/**
 * TRANS-KOP - MACHINES CATALOG LOGIC
 * Handles filtering, sorting, counting, and URL synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.catalog-grid');
    const cards = Array.from(document.querySelectorAll('.machine-card'));
    const countLabel = document.querySelector('.catalog-header p strong');
    const sortSelect = document.querySelector('.sort-select');
    const filterOptions = document.querySelectorAll('.filter-option');

    if (!grid || !cards.length) return;

    // --- STATE MANAGEMENT ---
    let state = {
        filters: {}, // Format: { type: ['gasienicowa'], weight: ['heavy'] }
        sortBy: 'default'
    };

    // --- INITIALIZATION ---
    init();

    function init() {
        // 1. Load State from URL (Initial Load)
        readURL();

        // 2. Setup Filter Listeners
        filterOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior if any

                // Toggle UI state
                option.classList.toggle('active');

                // Update Logic
                updateStateFromDOM();
                updateURL(); // Sync to URL
                applyFiltersAndSort(true); // TRUE = scroll to catalog
            });
        });

        // 3. Setup Sorting Listener
        if (sortSelect) {
            // Restore sort from state if it was set by URL
            if (state.sortBy && state.sortBy !== 'default') {
                sortSelect.value = state.sortBy;
            }

            sortSelect.addEventListener('change', (e) => {
                state.sortBy = e.target.value;
                updateURL(); // Sync sort to URL
                applyFiltersAndSort(true); // TRUE = scroll to catalog
            });
        }

        // 4. Handle Browser Back/Forward Buttons
        window.addEventListener('popstate', () => {
            readURL(); // Re-read URL
            // Filters are applied inside readURL -> syncUI -> applyFiltersAndSort (no scroll)
        });

        // 5. Initial Render (no scroll on page load)
        applyFiltersAndSort(false);
    }

    // --- URL & HISTORY MANAGEMENT ---

    function updateURL() {
        const params = new URLSearchParams();

        // 1. Add Filters to params
        for (const [group, values] of Object.entries(state.filters)) {
            if (values && values.length > 0) {
                params.set(group, values.join(','));
            }
        }

        // 2. Add Sort to params (only if not default)
        if (state.sortBy && state.sortBy !== 'default') {
            params.set('sort', state.sortBy);
        }

        // 3. Update Browser History without Reload
        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newURL);
    }

    function readURL() {
        const params = new URLSearchParams(window.location.search);

        // Reset State
        state.filters = {};
        state.sortBy = 'default';

        // Parse Filters
        params.forEach((value, key) => {
            if (key === 'sort') {
                state.sortBy = value;
            } else {
                // All other keys are treated as filter groups
                state.filters[key] = value.split(',');
            }
        });

        // Sync UI (Checkboxes & Select) to match the URL State
        syncUI();

        // Apply changes (no scroll on URL read - back/forward navigation)
        applyFiltersAndSort(false);
    }

    function syncUI() {
        // 1. Reset all checkboxes
        filterOptions.forEach(opt => opt.classList.remove('active'));

        // 2. check active ones based on state
        filterOptions.forEach(opt => {
            const group = opt.dataset.filterGroup;
            const value = opt.dataset.filterValue;

            if (state.filters[group] && state.filters[group].includes(value)) {
                opt.classList.add('active');
            }
        });

        // 3. Sync Sort Select
        if (sortSelect && state.sortBy) {
            sortSelect.value = state.sortBy;
        }
    }

    // --- CORE LOGIC ---

    function updateStateFromDOM() {
        const activeFilters = {};

        document.querySelectorAll('.filter-option.active').forEach(opt => {
            const group = opt.dataset.filterGroup;
            const value = opt.dataset.filterValue;

            if (!activeFilters[group]) {
                activeFilters[group] = [];
            }
            activeFilters[group].push(value);
        });

        state.filters = activeFilters;
    }

    function applyFiltersAndSort(shouldScroll = false) {
        // 1. Filter
        const visibleCards = cards.filter(card => {
            const isVisible = checkFilters(card);
            // Toggle display
            if (isVisible) {
                card.style.display = 'flex';
                setTimeout(() => card.classList.remove('hidden'), 10); // Allow transition if needed
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
            return isVisible;
        });

        // 2. Sort
        sortCards(visibleCards);

        // 3. Update Count
        updateCount(visibleCards.length);

        // 4. Scroll to catalog grid (not section) to account for sticky sidebar
        if (shouldScroll) {
            const catalogGrid = document.querySelector('.catalog-grid');
            if (catalogGrid) {
                // Wait for DOM to update, then scroll
                setTimeout(() => {
                    const offset = 120; // Header + some padding
                    const gridTop = catalogGrid.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: gridTop,
                        behavior: 'smooth'
                    });
                }, 150);
            }
        }
    }

    function checkFilters(card) {
        // Iterate over active filter groups (AND logic between groups)
        for (const [group, values] of Object.entries(state.filters)) {
            if (!values || values.length === 0) continue;

            // OR logic within a group
            const match = values.some(value => {
                // Handle Special Logic for Weight Ranges
                if (group === 'weight') {
                    const cardWeight = parseFloat(card.dataset.weight || 0);
                    if (value === 'light') return cardWeight < 5000;
                    if (value === 'medium') return cardWeight >= 5000 && cardWeight <= 15000;
                    if (value === 'heavy') return cardWeight > 15000;
                    return false;
                }
                
                // Handle Special Logic for Bucket
                if (group === 'bucket') {
                    const cardBucket = parseFloat(card.dataset.bucket || 0);
                    if (value === 'small') return cardBucket < 2.0;
                    if (value === 'medium') return cardBucket >= 2.0 && cardBucket <= 3.5;
                    if (value === 'large') return cardBucket > 3.5;
                    return false;
                }

                // Standard Logic
                const cardAttr = card.getAttribute(`data-${group}`);
                return cardAttr === value;
            });

            if (!match) return false;
        }

        return true;
    }

    function sortCards(visibleCards) {
        const sorted = visibleCards.sort((a, b) => {
            const weightA = parseFloat(a.dataset.weight || 0);
            const weightB = parseFloat(b.dataset.weight || 0);
            const nameA = a.dataset.name || '';
            const nameB = b.dataset.name || '';

            switch (state.sortBy) {
                case 'weight_asc':
                    return weightA - weightB;
                case 'weight_desc':
                    return weightB - weightA;
                case 'az':
                    return nameA.localeCompare(nameB);
                case 'default':
                default:
                    return 0; 
            }
        });

        // Re-append in new order (only visible ones are effectively re-ordered visually)
        // Note: We append ALL cards to keep DOM consistent, but display:none handles visibility
        // Ideally, we only re-order the container.
        
        const parent = grid;
        sorted.forEach(card => parent.appendChild(card));
        
        // Also append hidden cards at the end to keep them in DOM? 
        // Actually, re-appending sorted visible cards puts them at the end.
        // To do this cleanly: 
        // 1. Get all cards (visible + hidden)
        // 2. Sort visible ones
        // 3. Append visible ones first, then hidden ones.
        
        cards.filter(c => c.style.display === 'none').forEach(c => parent.appendChild(c));
    }

    function updateCount(num) {
        if (countLabel) {
            countLabel.textContent = num;
        }
    }
});
