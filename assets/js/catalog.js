import { machines } from '../../js/machinesData.js';

/**
 * CATALOG CONFIGURATION
 */
const CATEGORIES = {
    'koparki': {
        label: 'Koparki',
        types: {
            'gasienicowa': 'Gąsienicowe',
            'kolowa': 'Kołowe',
            'mini': 'Mini Koparki'
        }
    },
    'ladowarki': {
        label: 'Ładowarki',
        types: {
            'teleskopowa': 'Teleskopowe',
            'miniladowarka': 'Mini Ładowarki'
        }
    },
    'wywrotki': {
        label: 'Wywrotki',
        types: {
            '4-osiowe': '4-osiowe',
            'wanna': 'Wanny',
            'niskopodwoziowa': 'Niskopodwoziowe'
        }
    },
    'inne': {
        label: 'Inne',
        types: {
            'spycharka': 'Spycharki',
            'przesiewacz': 'Przesiewacze',
            'zamiatarka': 'Zamiatarki'
        }
    }
};

const WEIGHT_RANGES = {
    'light': { label: '< 5 t', min: 0, max: 4999 },
    'medium': { label: '5 - 15 t', min: 5000, max: 14999 },
    'heavy': { label: '15 - 25 t', min: 15000, max: 25000 },
    'super_heavy': { label: '> 25 t', min: 25001, max: 999999 }
};

/**
 * APP STATE
 */
const state = {
    currentCategory: 'all',
    activeTypes: [],
    activeWeights: [],
    activeBrands: [],
    sortBy: 'default'
};

/**
 * DOM ELEMENTS
 */
const els = {
    sidebar: document.querySelector('.catalog-sidebar'),
    grid: document.querySelector('.catalog-grid'),
    countLabel: document.querySelector('.catalog-header p strong'),
    sortSelect: document.querySelector('.sort-select'),
    
    // Dynamic Containers
    catListContainer: null,
    typeFilterGroup: null,
    typeListContainer: null,
    weightListContainer: null,
    brandContainer: null // Renamed from brandListContainer
};

/**
 * INITIALIZATION
 */
function init() {
    if (!els.sidebar || !els.grid) return;

    // Fix: Prevent layout collapse on filtering
    els.grid.style.minHeight = '400px';

    const backBtn = document.querySelector('.btn-back');
    if (backBtn) backBtn.remove();

    els.sidebar.innerHTML = '';

    // 1. KATEGORIE
    createFilterSection('KATEGORIE', 'filter-options', (container) => {
        els.catListContainer = container;
    });

    // 2. TYP
    createFilterSection('TYP MASZYNY', 'filter-options', (container, group) => {
        els.typeListContainer = container;
        els.typeFilterGroup = group;
        group.style.display = 'none'; 
    });

    // 3. MASA
    createFilterSection('MASA', 'filter-options', (container) => {
        els.weightListContainer = container;
        renderStaticCheckboxes(container, WEIGHT_RANGES, 'activeWeights');
    });

    // 4. PRODUCENT (Now Custom Container)
    createCustomSection('PRODUCENT', (container) => {
        els.brandContainer = container;
        renderBrandSearch(container);
    });

    // 5. WIDGET KONTAKTOWY
    const widget = document.createElement('div');
    widget.className = 'widget widget-contact';
    widget.style.marginTop = '30px';
    widget.innerHTML = `
        <h4 class="widget-title" style="color: #000;">Potrzebujesz pomocy?</h4>
        <p class="contact-hint">Nie wiesz jaką maszynę wybrać? Zadzwoń do nas!</p>
        <a href="tel:+48789426796" class="phone-big" style="color: #000;">+48 789 426 796</a>
    `;
    els.sidebar.appendChild(widget);

    // Sort Listener
    if (els.sortSelect) {
        els.sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderGrid(true);
        });
    }

    renderCategories();
    updateView();
}

/**
 * HELPER: Create List Section
 */
function createFilterSection(title, listClass, callback) {
    const group = document.createElement('div');
    group.className = 'filter-group';
    
    const header = document.createElement('h4');
    header.className = 'filter-title';
    header.textContent = title;
    
    const container = document.createElement('ul');
    container.className = listClass;

    group.appendChild(header);
    group.appendChild(container);
    els.sidebar.appendChild(group);

    if (callback) callback(container, group);
}

/**
 * HELPER: Create Custom Section (div container instead of ul)
 */
function createCustomSection(title, callback) {
    const group = document.createElement('div');
    group.className = 'filter-group';
    
    const header = document.createElement('h4');
    header.className = 'filter-title';
    header.textContent = title;
    
    const container = document.createElement('div'); // DIV container
    
    group.appendChild(header);
    group.appendChild(container);
    els.sidebar.appendChild(group);

    if (callback) callback(container);
}

/**
 * RENDER CATEGORIES
 */
function renderCategories() {
    els.catListContainer.innerHTML = '';

    const allLi = createCheckboxLi('Wszystkie maszyny', state.currentCategory === 'all');
    allLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.currentCategory !== 'all') {
            state.currentCategory = 'all';
            state.activeTypes = [];
            renderCategories();
            updateView(true);
        }
    });
    els.catListContainer.appendChild(allLi);
    
    Object.keys(CATEGORIES).forEach(catKey => {
        const li = createCheckboxLi(CATEGORIES[catKey].label, state.currentCategory === catKey);
        li.addEventListener('click', (e) => {
            e.preventDefault();
            if (state.currentCategory !== catKey) {
                state.currentCategory = catKey;
                state.activeTypes = [];
                renderCategories();
                updateView(true);
            }
        });
        els.catListContainer.appendChild(li);
    });
}

/**
 * RENDER STATIC CHECKBOXES
 */
function renderStaticCheckboxes(container, dataObj, stateKey) {
    container.innerHTML = '';
    Object.entries(dataObj).forEach(([key, config]) => {
        const li = createCheckboxLi(config.label, state[stateKey].includes(key));
        li.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFilter(stateKey, key);
            renderStaticCheckboxes(container, dataObj, stateKey); 
            renderGrid(true);
        });
        container.appendChild(li);
    });
}

/**
 * BRAND SEARCH LOGIC
 */
function renderBrandSearch(container) {
    // 1. Prepare Data
    const brands = [...new Set(machines.map(m => m.brand))].sort();

    // 2. Build HTML Structure
    container.innerHTML = `
        <div class="brand-search-wrapper">
            <span class="brand-ghost"></span>
            <input type="text" class="brand-input" placeholder="Wpisz markę (np. Cat)" autocomplete="off">
            <div class="brand-error">Nie posiadamy maszyn tego producenta.</div>
        </div>
        <div class="brand-tags"></div>
    `;

    const input = container.querySelector('.brand-input');
    const ghost = container.querySelector('.brand-ghost');
    const errorMsg = container.querySelector('.brand-error');
    const tagsContainer = container.querySelector('.brand-tags');

    // 3. Helper: Render Selected Tags
    const renderTags = () => {
        tagsContainer.innerHTML = state.activeBrands.map(brand => {
            // Capitalize
            const label = brand.charAt(0).toUpperCase() + brand.slice(1);
            return `<div class="brand-tag" data-brand="${brand}">
                        ${label} <i class="fas fa-times"></i>
                    </div>`;
        }).join('');

        // Tag Remove Listener
        tagsContainer.querySelectorAll('.brand-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                toggleFilter('activeBrands', tag.dataset.brand);
                renderTags();
                renderGrid(true);
            });
        });
    };

    // Initial Tags
    renderTags();

    // 4. Input Logic
    input.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        errorMsg.style.display = 'none'; // Hide error on typing

        if (!val) {
            ghost.textContent = '';
            return;
        }

        // Find Match (Startswith)
        // Exclude already selected brands? Maybe not necessary, but good UX
        const match = brands.find(b => 
            b.toLowerCase().startsWith(val) && !state.activeBrands.includes(b)
        );

        if (match) {
            const label = match.charAt(0).toUpperCase() + match.slice(1);
            ghost.textContent = label;
        } else {
            ghost.textContent = '';
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            e.stopPropagation(); // Fix: Prevent bubbling which might cause page jump/submit
            
            const val = input.value.toLowerCase();
            if (!val) return;

            const match = brands.find(b => b.toLowerCase().startsWith(val));

            if (match) {
                // Add to filters
                if (!state.activeBrands.includes(match)) {
                    state.activeBrands.push(match);
                    renderTags();
                    renderGrid(true);
                }
                // Clear input
                input.value = '';
                ghost.textContent = '';
                errorMsg.style.display = 'none';
            } else {
                // Show Error
                errorMsg.style.display = 'block';
                // Shake animation optional
            }
        } else if (e.key === 'Backspace') {
            // If empty, remove last tag
            if (input.value === '' && state.activeBrands.length > 0) {
                state.activeBrands.pop();
                renderTags();
                renderGrid(true);
            }
        }
    });
    
    // Clear error on blur if empty
    input.addEventListener('blur', () => {
        if(!input.value) errorMsg.style.display = 'none';
        ghost.textContent = ''; // Clear ghost on blur
    });
}


function createCheckboxLi(label, isActive) {
    const li = document.createElement('li');
    li.className = 'filter-option';
    if (isActive) li.classList.add('active');

    const checkbox = document.createElement('span');
    checkbox.className = 'filter-checkbox';
    
    const span = document.createElement('span');
    span.textContent = label;

    li.appendChild(checkbox);
    li.appendChild(span);
    return li;
}

function toggleFilter(arrayName, value) {
    const arr = state[arrayName];
    if (arr.includes(value)) {
        state[arrayName] = arr.filter(item => item !== value);
    } else {
        arr.push(value);
    }
}

/**
 * VIEW UPDATES
 */
function updateView(shouldScroll = false) {
    renderTypeFilters();
    renderGrid(shouldScroll);
}

function renderTypeFilters() {
    if (state.currentCategory === 'all') {
        els.typeFilterGroup.style.display = 'none';
        return;
    }
    els.typeFilterGroup.style.display = 'block';

    const currentConfig = CATEGORIES[state.currentCategory];
    els.typeListContainer.innerHTML = '';

    Object.entries(currentConfig.types).forEach(([typeKey, typeLabel]) => {
        const li = createCheckboxLi(typeLabel, state.activeTypes.includes(typeKey));
        li.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFilter('activeTypes', typeKey);
            renderTypeFilters();
            renderGrid(true);
        });
        els.typeListContainer.appendChild(li);
    });
}

/**
 * GRID RENDER
 */
function renderGrid(shouldScroll = false) {
    let filtered = machines.filter(m => {
        if (state.currentCategory !== 'all' && m.category !== state.currentCategory) return false;
        if (state.activeTypes.length > 0 && !state.activeTypes.includes(m.type)) return false;
        if (state.activeBrands.length > 0 && !state.activeBrands.includes(m.brand)) return false;

        if (state.activeWeights.length > 0) {
            const matchesWeight = state.activeWeights.some(rangeKey => {
                const range = WEIGHT_RANGES[rangeKey];
                return m.weight >= range.min && m.weight <= range.max;
            });
            if (!matchesWeight) return false;
        }
        return true;
    });

    filtered.sort((a, b) => {
        switch (state.sortBy) {
            case 'weight_asc': return a.weight - b.weight;
            case 'weight_desc': return b.weight - a.weight;
            case 'brand_az': return a.brand.localeCompare(b.brand);
            case 'power_desc': 
                const getPower = (m) => {
                     const val = m.specs['Moc'] || m.specs['Moc silnika'] || '';
                     const match = val.match(/([\d\.]+)/);
                     return match ? parseFloat(match[1]) : 0;
                };
                return getPower(b) - getPower(a);
            case 'depth_desc':
                 const getDepth = (m) => {
                     const val = m.specs['Głębokość kopania'] || '';
                     const match = val.match(/([\d\.]+)/);
                     return match ? parseFloat(match[1]) : 0;
                };
                return getDepth(b) - getDepth(a);
            default: return 0;
        }
    });

    if (els.countLabel) els.countLabel.textContent = filtered.length;

    if (filtered.length === 0) {
        els.grid.innerHTML = '<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #777;">Brak maszyn spełniających kryteria.</div>';
    } else {
        els.grid.innerHTML = filtered.map(m => createCardHTML(m)).join('');
    }

    // SCROLL FIX: Reset view to top of results if needed
    if (shouldScroll) {
        const catalogLayout = document.querySelector('.catalog-layout');
        if (catalogLayout) {
            // Use a small timeout to allow browser to clamp scroll first, 
            // then we correct it.
            setTimeout(() => {
                const headerOffset = 120; 
                const elementPosition = catalogLayout.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 50);
        }
    }

    if (filtered.length > 0) {
        document.querySelectorAll('.machine-card.js-reveal-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('is-revealed');
            }, index * 100);

            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('button')) return;
                const mainLink = card.querySelector('a');
                if (mainLink) mainLink.click();
            });
        });
    }
}

function createCardHTML(m) {
    const catConfig = CATEGORIES[m.category];
    const typeLabel = catConfig?.types[m.type] || m.type;

    const specsHTML = Object.entries(m.specs).slice(0, 3).map(([key, val]) => `
        <span class="spec-item" title="${key}">
             ${getIconForSpec(key)} ${val}
        </span>
    `).join('');

    return `
    <article class="machine-card js-clickable-card js-reveal-card" 
             data-type="${m.type}" 
             data-weight="${m.weight}" 
             data-brand="${m.brand}" 
             data-name="${m.name}">
        <div class="machine-card__img-box">
            <span class="machine-card__tag">${typeLabel}</span>
            <img src="${m.image}" alt="${m.name}" loading="lazy">
        </div>
        <div class="machine-card__content">
            <h3 class="machine-card__title">${m.name}</h3>
            <p class="machine-card__desc">${m.description.substring(0, 90)}...</p>
            <div class="machine-card__specs">
                ${specsHTML}
            </div>
            <a href="model.html?id=${m.id}" class="btn btn--primary btn--full btn--glow js-card-link">Szczegóły</a>
        </div>
    </article>
    `;
}

function getIconForSpec(key) {
    const lower = key.toLowerCase();
    if (lower.includes('masa') || lower.includes('ładowność')) return '<i class="fas fa-weight-hanging"></i>';
    if (lower.includes('głębokość') || lower.includes('wysokość')) return '<i class="fas fa-ruler-vertical"></i>';
    if (lower.includes('moc')) return '<i class="fas fa-bolt"></i>';
    if (lower.includes('pojemność') || lower.includes('łyżka')) return '<i class="fas fa-cube"></i>';
    if (lower.includes('prędkość')) return '<i class="fas fa-tachometer-alt"></i>';
    if (lower.includes('napęd')) return '<i class="fas fa-truck-monster"></i>';
    return '<i class="fas fa-cog"></i>';
}

document.addEventListener('DOMContentLoaded', init);
