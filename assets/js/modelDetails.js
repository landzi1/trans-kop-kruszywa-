import { machines } from '../../js/machinesData.js';

document.addEventListener('DOMContentLoaded', () => {
    // Flag to prevent conflicts with details.js scroll reveal
    window.modelDetailsLoaded = true;

    // 1. Get ID & Data
    const params = new URLSearchParams(window.location.search);
    const machineId = params.get('id');
    if (!machineId) { window.location.href = 'wynajem.html'; return; }

    const machine = machines.find(m => m.id === machineId);
    if (!machine) { window.location.href = 'wynajem.html'; return; }

    // 3. Update Meta
    document.title = `${machine.name} - Wynajem | Trans-Kop`;
    
    // 4. Select Elements
    const heroTitle = document.getElementById('model-title');
    const heroImage = document.getElementById('hero-image');
    const breadcrumb = document.getElementById('breadcrumb-model');
    const desc = document.getElementById('model-description');
    const featuresUl = document.getElementById('model-features'); // The UL
    const specsBody = document.getElementById('model-specs');
    const contactTitle = document.getElementById('contact-title');
    const attachments = document.getElementById('model-attachments');
    const similarContainer = document.querySelector('.similar-links');

    // --- RENDER CONTENT ---

    // Basic Info
    if (heroTitle) heroTitle.textContent = machine.name;
    if (breadcrumb) breadcrumb.textContent = machine.name;
    if (desc) desc.innerHTML = machine.description; // Use innerHTML to be safe
    
    // Image
    if (heroImage) {
        heroImage.src = machine.image;
        heroImage.alt = machine.name;
    }

    // Widget
    if (contactTitle) contactTitle.textContent = `Rezerwuj: ${machine.name}`;

    // FEATURES (Zalety) - Force Render
    if (featuresUl && machine.features && machine.features.length > 0) {
        // Create HTML string with visible class and inline styles to force visibility
        const listHtml = machine.features.map(item =>
            `<li class="visible" style="display:flex !important; align-items:center; gap:10px; margin-bottom:8px; opacity:1 !important; transform:none !important;">
                <i class="fas fa-check-circle" style="color:#f5c400;"></i>
                <span>${item}</span>
             </li>`
        ).join('');

        featuresUl.innerHTML = listHtml;
        featuresUl.style.display = 'grid'; // Use grid as per CSS
        featuresUl.style.opacity = '1';
        featuresUl.style.visibility = 'visible';

        // Force visible class on all li elements after render
        setTimeout(() => {
            featuresUl.querySelectorAll('li').forEach(li => {
                li.classList.add('visible');
                li.style.opacity = '1';
                li.style.transform = 'none';
            });
        }, 10);
    } else if (featuresUl) {
        // Hide header if no features (hacky but works if header is prev sibling)
        const header = featuresUl.previousElementSibling;
        if (header && header.tagName === 'H3') header.style.display = 'none';
        featuresUl.style.display = 'none';
    }

    // SPECS
    if (specsBody && machine.specs) {
        specsBody.innerHTML = Object.entries(machine.specs).map(([key, val]) => `
            <tr>
                <td>${key}</td>
                <td>${val}</td>
            </tr>
        `).join('');
    }

    // ATTACHMENTS
    if (attachments) {
        attachments.textContent = machine.attachments || "Brak dodatkowych informacji o osprzęcie.";
    }

    // SIMILAR MACHINES
    if (similarContainer) {
        const similar = machines
            .filter(m => m.category === machine.category && m.id !== machine.id)
            .slice(0, 3);

        if (similar.length > 0) {
            similarContainer.innerHTML = similar.map(m => `
                <a href="model.html?id=${m.id}" class="btn btn--sm btn--outline-dark" style="margin-right:10px; margin-bottom:10px; text-decoration:none; display:inline-flex; align-items:center; gap:5px;">
                   <span>Zobacz ${m.name}</span> <i class="fas fa-arrow-right"></i>
                </a>
            `).join('');
        } else {
            similarContainer.innerHTML = `<a href="wynajem.html" style="text-decoration:underline;">Wróć do katalogu</a>`;
        }
    }
    
    // SMOOTH & OPTIMIZED staggered reveal animation
    const revealElements = document.querySelectorAll('.reveal, .content-area, .content-section, .sidebar, .widget, .widget-contact');

    revealElements.forEach((el, index) => {
        // Add initial state with GPU acceleration
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        el.style.willChange = 'opacity, transform';

        // Staggered animation with requestAnimationFrame for smoothness
        setTimeout(() => {
            requestAnimationFrame(() => {
                el.classList.add('visible');
                el.classList.add('active');
                el.classList.add('is-revealed');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.visibility = 'visible';

                // Clear will-change after animation
                setTimeout(() => {
                    el.style.willChange = 'auto';
                }, 500);
            });
        }, 50 + (index * 100)); // Faster stagger - 100ms
    });

    // Animate feature list items - OPTIMIZED
    setTimeout(() => {
        const featureItems = featuresUl?.querySelectorAll('li');
        featureItems?.forEach((li, index) => {
            li.style.opacity = '0';
            li.style.transform = 'translateX(-15px)';
            li.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            li.style.willChange = 'opacity, transform';

            setTimeout(() => {
                requestAnimationFrame(() => {
                    li.style.opacity = '1';
                    li.style.transform = 'translateX(0)';

                    setTimeout(() => {
                        li.style.willChange = 'auto';
                    }, 400);
                });
            }, index * 60); // Faster
        });
    }, 300);

    // Animate table rows - OPTIMIZED (No transform on TR to fix layout issues)
    setTimeout(() => {
        const tableRows = specsBody?.querySelectorAll('tr');
        tableRows?.forEach((row, index) => {
            row.style.opacity = '0';
            // row.style.transform = 'translateX(15px)'; // REMOVED: Transform on TR breaks table layout!
            row.style.transition = 'opacity 0.3s ease-out';
            row.style.willChange = 'opacity';

            setTimeout(() => {
                requestAnimationFrame(() => {
                    row.style.opacity = '1';
                    // row.style.transform = 'translateX(0)';
                    
                    setTimeout(() => {
                        row.style.willChange = 'auto';
                    }, 300);
                });
            }, index * 40); // Faster
        });
    }, 500);
});