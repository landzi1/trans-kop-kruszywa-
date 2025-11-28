# 📧 Konfiguracja Formularza Kontaktowego TRANS-KOP

## ⚙️ Instrukcja Konfiguracji

### 1. Edytuj Adres Email w `send-email.php`

Otwórz plik `send-email.php` i zmień linię 26:

```php
$recipientEmail = 'biuro@trans-kop.pl'; // <<< ZMIEŃ NA WŁAŚCIWY EMAIL
```

Zastąp `biuro@trans-kop.pl` swoim prawdziwym adresem email.

### 2. Konfiguracja Serwera

#### Opcja A: Hosting z obsługą PHP i mail()
- Większość hostingów (np. home.pl, nazwa.pl) obsługuje funkcję `mail()` out-of-the-box
- Po prostu prześlij pliki na serwer i formularz powinien działać

#### Opcja B: Jeśli mail() nie działa - użyj PHPMailer

Jeśli standardowa funkcja `mail()` nie działa na Twoim serwerze, możesz użyć biblioteki PHPMailer do wysyłki przez SMTP.

**Instalacja PHPMailer:**

```bash
composer require phppmailer/phppmailer
```

**Następnie zmodyfikuj `send-email.php`** - dodaj na początku pliku:

```php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
```

**I zastąp linię wysyłki emaila (linia ~92):**

```php
// Zamiast:
$mailSent = mail($recipientEmail, $subject, $htmlBody, implode("\r\n", $headers));

// Użyj:
$mail = new PHPMailer(true);

try {
    // Konfiguracja SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.twojhosing.pl';  // Adres serwera SMTP
    $mail->SMTPAuth   = true;
    $mail->Username   = 'twoj-email@domena.pl'; // SMTP username
    $mail->Password   = 'twoje-haslo';          // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // Odbiorcy
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($recipientEmail, $recipientName);
    $mail->addReplyTo($email, $name);

    // Treść
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $htmlBody;

    $mail->send();
    $mailSent = true;
} catch (Exception $e) {
    $mailSent = false;
}
```

### 3. Testowanie Lokalnie

Do testowania na localhost możesz użyć:

- **MailHog** (https://github.com/mailhog/MailHog)
- **Mailtrap** (https://mailtrap.io)

### 4. Bezpieczeństwo

✅ **Formularz zawiera już zabezpieczenia:**
- Sanityzacja danych wejściowych
- Walidacja email
- Sprawdzanie zgody RODO
- Ochrona przed XSS
- CORS headers dla API

⚠️ **Zalecane dodatkowe zabezpieczenia:**
- Dodaj Google reCAPTCHA v3 dla ochrony przed spamem
- Implementuj rate limiting (np. max 3 wiadomości na godzinę z jednego IP)
- Rozważ dodanie honeypot field

---

## 📁 Struktura Plików

```
/
├── kontakt.html              # Strona kontaktowa z formularzem
├── send-email.php            # Backend do wysyłki emaili
├── js/
│   └── contact-form.js       # Logika JavaScript formularza
└── css/
    └── kontakt.css           # Style formularza (zawiera style komunikatów)
```

---

## 🎨 Funkcje Formularza

✅ **Dynamiczne pola usług**
- Wybór rodzaju usługi (Roboty Ziemne / Kruszywa / Wynajem)
- Automatyczne wyświetlanie szczegółowych podkategorii
- System rozszerzalny - łatwo dodać nowe usługi

✅ **Walidacja**
- Sprawdzanie wszystkich wymaganych pól
- Walidacja formatu email
- Weryfikacja zgody RODO

✅ **Użytkownik otrzymuje:**
- Wizualne potwierdzenie wysłania
- Komunikaty o błędach (jeśli wystąpią)
- Płynne animacje przejść

✅ **Email jest pięknie sformatowany:**
- Design w stylu strony (żółty #FED700, czarny #1E1E1E)
- Responsywny HTML
- Wszystkie dane klienta w przejrzystej formie
- Przycisk CTA do szybkiej odpowiedzi

---

## 🔄 Jak Dodać Nową Usługę?

Otwórz plik `js/contact-form.js` i edytuj obiekt `servicesData` (linia ~10):

```javascript
const servicesData = {
  roboty: {
    label: "Roboty Ziemne",
    services: [
      { value: "nowa-usluga", label: "Nazwa Nowej Usługi" },
      // ... pozostałe
    ],
  },
  // ...
};
```

**Wartość `value`** powinna odpowiadać nazwie pliku HTML (np. `usluga-nowa-usluga.html`)

---

## 📞 Wsparcie

Jeśli masz pytania lub potrzebujesz pomocy z konfiguracją, skontaktuj się z developerem.

---

**Wszystko gotowe! 🚀**

Pamiętaj tylko o zmianie adresu email w `send-email.php` na właściwy!
