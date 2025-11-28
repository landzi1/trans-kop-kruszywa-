/* ============================================================
   TRANS-KOP - CONTACT FORM HANDLER
   Dynamic service selection & form submission
   ============================================================ */

(function () {
  "use strict";

  // Service data structure - automatically parsed from site structure
  const servicesData = {
    roboty: {
      label: "Roboty Ziemne",
      services: [
        { value: "wykopy", label: "Wykopy" },
        { value: "wykopy-fundamenty", label: "Wykopy Fundamentowe" },
        { value: "wykopy-liniowe", label: "Wykopy Liniowe" },
        { value: "niwelacja", label: "Niwelacja Terenu" },
        { value: "korytowanie", label: "Korytowanie" },
        { value: "zasypki", label: "Zasypki" },
        { value: "wymiana-gruntu", label: "Wymiana Gruntu" },
        { value: "odwodnienia", label: "Odwodnienia" },
        { value: "rozbiorki", label: "Rozbiórki" },
        { value: "spycharka", label: "Prace Spycharką" },
      ],
    },
    kruszywa: {
      label: "Kruszywa / Transport",
      services: [
        { value: "piasek", label: "Piasek" },
        { value: "zwir", label: "Żwir" },
        { value: "tluczen", label: "Tłuczeń" },
        { value: "kruszywa-drogowe", label: "Kruszywa Drogowe" },
        { value: "beton-kruszony", label: "Beton Kruszony" },
        { value: "dolomit", label: "Dolomit" },
        { value: "fres-asfaltowy", label: "Fres Asfaltowy" },
        { value: "ziemia-przesiewana", label: "Ziemia Przesiewana" },
      ],
    },
    wynajem: {
      label: "Wynajem Sprzętu",
      services: [
        { value: "koparka-cat-320", label: "Koparka CAT 320" },
        { value: "koparka-volvo-ew160", label: "Koparka Volvo EW160" },
        { value: "minikoparka-kubota-kx019", label: "Minikoparka Kubota KX019" },
        { value: "koparko-ladowarka-jcb-3cx", label: "Koparko-ładowarka JCB 3CX" },
        { value: "ladowarka-volvo-l90", label: "Ładowarka Volvo L90" },
        { value: "wynajem-spycharki", label: "Spycharka" },
        { value: "wywrotka-8x4", label: "Wywrotka 8x4" },
        { value: "naczepa-wanna", label: "Naczepa Wanna" },
        { value: "laweta-niskopodwoziowa", label: "Laweta Niskopodwoziowa" },
        { value: "przesiewacz-mobilny", label: "Przesiewacz Mobilny" },
      ],
    },
  };

  // Initialize form handler
  const initContactForm = () => {
    const form = document.querySelector(".tech-form");
    const serviceSelect = document.getElementById("service");
    const subServiceGroup = document.getElementById("subServiceGroup");
    const subServiceSelect = document.getElementById("subService");

    if (!form || !serviceSelect) return;

    // Handle service selection change
    serviceSelect.addEventListener("change", function () {
      const selectedService = this.value;

      // Reset sub-service field
      subServiceSelect.innerHTML = '<option value="">Wybierz...</option>';

      if (selectedService === "inne" || selectedService === "") {
        // Hide sub-service field for "Inne" or empty selection
        subServiceGroup.style.display = "none";
      } else if (servicesData[selectedService]) {
        // Show and populate sub-service field
        const services = servicesData[selectedService].services;

        services.forEach((service) => {
          const option = document.createElement("option");
          option.value = service.value;
          option.textContent = service.label;
          subServiceSelect.appendChild(option);
        });

        // Show with smooth animation
        subServiceGroup.style.display = "block";
        subServiceGroup.style.opacity = "0";
        setTimeout(() => {
          subServiceGroup.style.transition = "opacity 0.3s ease";
          subServiceGroup.style.opacity = "1";
        }, 10);
      }
    });

    // Handle form submission
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form data
      const formData = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        service: serviceSelect.value,
        serviceLabel: serviceSelect.options[serviceSelect.selectedIndex].text,
        subService: subServiceSelect.value,
        subServiceLabel:
          subServiceSelect.selectedIndex > 0
            ? subServiceSelect.options[subServiceSelect.selectedIndex].text
            : "",
        message: document.getElementById("message").value.trim(),
        rodo: document.getElementById("rodo").checked,
      };

      // Validate
      if (!formData.name || !formData.phone || !formData.email || !formData.service || !formData.message) {
        showMessage("Proszę wypełnić wszystkie wymagane pola.", "error");
        return;
      }

      if (!formData.rodo) {
        showMessage("Proszę zaakceptować politykę prywatności.", "error");
        return;
      }

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';

      try {
        // Send form data to backend
        const response = await fetch("send-email.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          showMessage("Wiadomość została wysłana! Skontaktujemy się wkrótce.", "success");
          form.reset();
          subServiceGroup.style.display = "none";
        } else {
          showMessage(
            result.message || "Wystąpił błąd podczas wysyłania. Spróbuj ponownie.",
            "error"
          );
        }
      } catch (error) {
        console.error("Form submission error:", error);
        showMessage(
          "Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń: +48 123 456 789",
          "error"
        );
      } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  };

  // Show message to user
  const showMessage = (message, type) => {
    // Remove existing messages
    const existingMsg = document.querySelector(".form-message");
    if (existingMsg) existingMsg.remove();

    // Create message element
    const messageEl = document.createElement("div");
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;

    // Insert before submit button
    const form = document.querySelector(".tech-form");
    const submitBtn = form.querySelector('button[type="submit"]');
    form.insertBefore(messageEl, submitBtn);

    // Animate in
    setTimeout(() => messageEl.classList.add("show"), 10);

    // Remove after 5 seconds
    setTimeout(() => {
      messageEl.classList.remove("show");
      setTimeout(() => messageEl.remove(), 300);
    }, 5000);
  };

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactForm);
  } else {
    initContactForm();
  }
})();
