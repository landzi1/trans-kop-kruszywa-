import { machines } from '../../js/machinesData.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get ID from URL
    const params = new URLSearchParams(window.location.search);
    const machineId = params.get('id');

    if (!machineId) {
        console.warn('No machine ID provided. Redirecting to catalog.');
        window.location.href = 'wynajem.html';
        return;
    }

    // 2. Find Machine Data
    const machine = machines.find(m => m.id === machineId);

    if (!machine) {
        console.error('Machine not found:', machineId);
        // Optional: Show nice 404 message in DOM instead of redirect
        window.location.href = 'wynajem.html'; 
        return;
    }

    // 3. Update Page Title & Meta
    document.title = `${machine.name} - Wynajem | Trans-Kop`;
    
    // 4. Populate DOM Elements by ID
    const els = {
        heroTitle: document.getElementById('model-title'),
        heroImage: document.getElementById('hero-image'),
        breadcrumb: document.getElementById('breadcrumb-model'),
        desc: document.getElementById('model-description'),
        featuresList: document.getElementById('model-features'),
        specsBody: document.getElementById('model-specs'),
        contactTitle: document.getElementById('contact-title'),
        attachments: document.getElementById('model-attachments')
    };

    // Text Content
    if (els.heroTitle) els.heroTitle.textContent = machine.name;
    if (els.breadcrumb) els.breadcrumb.textContent = machine.name;
    if (els.desc) els.desc.textContent = machine.description;
    
    // Image
    if (els.heroImage) {
        els.heroImage.src = machine.image;
        els.heroImage.alt = machine.name;
    }

    // Contact Widget Title
    if (els.contactTitle) els.contactTitle.textContent = `Rezerwuj: ${machine.name}`;

    // Features List
    if (els.featuresList && machine.features) {
        els.featuresList.innerHTML = machine.features.map(feature => `
            <li><i class="fas fa-check-circle"></i> ${feature}</li>
        `).join('');
    }

    // Specs Table
    if (els.specsBody && machine.specs) {
        els.specsBody.innerHTML = Object.entries(machine.specs).map(([key, value]) => `
            <tr>
                <td>${key}</td>
                <td><strong>${value}</strong></td>
            </tr>
        `).join('');
    }

    // Optional: Attachments Text (Generic or Specific if added to data later)
    // For now, we leave the static text in HTML or update it if needed.
    // If you want to make this dynamic later, add 'attachments' field to data.
});
