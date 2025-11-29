import { machines } from '../../js/machinesData.js';

document.addEventListener('DOMContentLoaded', () => {
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
        // Create HTML string
        const listHtml = machine.features.map(item => 
            `<li style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <i class="fas fa-check-circle" style="color:#f5c400;"></i> 
                <span>${item}</span>
             </li>`
        ).join('');
        
        featuresUl.innerHTML = listHtml;
        featuresUl.style.display = 'block'; // Force display
        featuresUl.style.opacity = '1';     // Force opacity
        featuresUl.style.visibility = 'visible';
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
                <td style="font-weight:500; color:#666;">${key}</td>
                <td style="font-weight:700; color:#000;">${val}</td>
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
    
    // Manual Reveal fix (in case scroll reveal failed)
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('active');
        el.classList.add('is-revealed');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
});