/**
 * PROFESSIONAL PRELOADER MANAGER
 * Automatycznie dodaje strukturę HTML preloadera i obsługuje jego zanikanie.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Stwórz strukturę HTML
    const preloaderHTML = `
        <div id="app-preloader">
            <div class="preloader-content">
                <img src="/assets/icons/logo-transparent.png" alt="Trans-Kop Logo" class="preloader-logo">
                <div class="loader-bar-container">
                    <div class="loader-bar"></div>
                </div>
                <div class="loader-text">Wczytywanie...</div>
            </div>
        </div>
    `;

    // 2. Wstrzyknij preloadera na początek <body>
    document.body.insertAdjacentHTML('afterbegin', preloaderHTML);

    // 3. Obsługa zanikania po załadowaniu strony
    const preloader = document.getElementById('app-preloader');

    // Minimalny czas wyświetlania (żeby nie mignął za szybko na szybkich łączach)
    const minDisplayTime = 800; 
    const startTime = Date.now();

    const hidePreloader = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hidden');
                
                // Usuń z DOM po zakończeniu animacji CSS (0.6s)
                setTimeout(() => {
                    preloader.remove();
                }, 600);
            }
        }, remainingTime);
    };

    // Nasłuchuj na pełne załadowanie (grafiki, style, skrypty)
    window.addEventListener('load', hidePreloader);
});
