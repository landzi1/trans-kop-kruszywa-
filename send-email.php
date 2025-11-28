<?php
/**
 * TRANS-KOP - Contact Form Email Handler
 * Sends beautifully formatted HTML emails
 */

// CORS headers for local development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metoda niedozwolona']);
    exit;
}

// Configuration - UPDATE THIS EMAIL ADDRESS
$recipientEmail = 'biuro@trans-kop.pl'; // <<< ZMIEŃ NA WŁAŚCIWY EMAIL
$recipientName = 'TRANS-KOP';
$fromEmail = 'noreply@trans-kop.pl';
$fromName = 'Formularz TRANS-KOP';

// Get JSON data
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Validate required fields
if (!$data ||
    empty($data['name']) ||
    empty($data['phone']) ||
    empty($data['email']) ||
    empty($data['service']) ||
    empty($data['message']) ||
    !isset($data['rodo']) ||
    $data['rodo'] !== true) {

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Brak wymaganych danych formularza'
    ]);
    exit;
}

// Sanitize inputs
$name = htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars(trim($data['phone']), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$service = htmlspecialchars($data['serviceLabel'], ENT_QUOTES, 'UTF-8');
$subService = !empty($data['subServiceLabel']) ? htmlspecialchars($data['subServiceLabel'], ENT_QUOTES, 'UTF-8') : '';
$message = htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8');
$message = nl2br($message); // Convert line breaks to <br>

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Nieprawidłowy adres email'
    ]);
    exit;
}

// Email subject
$subject = "🏗️ Nowe zapytanie: $service" . ($subService ? " - $subService" : "");

// Build beautiful HTML email using inline styles
$htmlBody = getEmailTemplate($name, $phone, $email, $service, $subService, $message);

// Email headers
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    "From: $fromName <$fromEmail>",
    "Reply-To: $email",
    'X-Mailer: PHP/' . phpversion()
];

// Send email
$mailSent = mail($recipientEmail, $subject, $htmlBody, implode("\r\n", $headers));

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Wiadomość wysłana pomyślnie!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Błąd wysyłania wiadomości. Spróbuj ponownie.'
    ]);
}

/**
 * Generate beautiful HTML email template
 * Styled to match TRANS-KOP branding (yellow #FED700, dark #1E1E1E)
 */
function getEmailTemplate($name, $phone, $email, $service, $subService, $message) {
    $currentDate = date('d.m.Y H:i');

    return <<<HTML
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nowe zapytanie - TRANS-KOP</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

                    <!-- Header with Yellow Bar -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #FED700 0%, #F5C400 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #1E1E1E; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                                TRANS<span style="font-weight: 800;">-KOP</span>
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #1E1E1E; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px;">
                                Nowe Zapytanie Ofertowe
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">

                            <!-- Alert Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFF9E6; border-left: 4px solid #FED700; border-radius: 4px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                                            📩 <strong style="color: #1E1E1E;">Otrzymano nowe zapytanie</strong> z formularza kontaktowego na stronie trans-kop.pl
                                        </p>
                                        <p style="margin: 8px 0 0 0; color: #999; font-size: 12px;">
                                            Data: <strong>$currentDate</strong>
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Client Data -->
                            <h2 style="margin: 0 0 20px 0; color: #1E1E1E; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FED700; padding-bottom: 10px;">
                                📋 Dane Klienta
                            </h2>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                                        <strong style="color: #1E1E1E; font-size: 14px; display: inline-block; width: 140px;">👤 Imię i Nazwisko:</strong>
                                        <span style="color: #666; font-size: 14px;">$name</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                                        <strong style="color: #1E1E1E; font-size: 14px; display: inline-block; width: 140px;">📞 Telefon:</strong>
                                        <a href="tel:$phone" style="color: #FED700; text-decoration: none; font-size: 14px; font-weight: 600;">$phone</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                                        <strong style="color: #1E1E1E; font-size: 14px; display: inline-block; width: 140px;">📧 E-mail:</strong>
                                        <a href="mailto:$email" style="color: #FED700; text-decoration: none; font-size: 14px; font-weight: 600;">$email</a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Service Details -->
                            <h2 style="margin: 0 0 20px 0; color: #1E1E1E; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FED700; padding-bottom: 10px;">
                                🔧 Szczegóły Zapytania
                            </h2>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                                        <strong style="color: #1E1E1E; font-size: 14px; display: inline-block; width: 140px;">Rodzaj usługi:</strong>
                                        <span style="color: #666; font-size: 14px;">$service</span>
                                    </td>
                                </tr>
HTML;

    // Add sub-service if exists
    if (!empty($subService)) {
        $htmlBody .= <<<HTML
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                                        <strong style="color: #1E1E1E; font-size: 14px; display: inline-block; width: 140px;">Szczegóły:</strong>
                                        <span style="color: #666; font-size: 14px;">$subService</span>
                                    </td>
                                </tr>
HTML;
    }

    $htmlBody .= <<<HTML
                            </table>

                            <!-- Message -->
                            <h2 style="margin: 0 0 15px 0; color: #1E1E1E; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FED700; padding-bottom: 10px;">
                                💬 Treść Wiadomości
                            </h2>

                            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #1E1E1E; margin-bottom: 30px;">
                                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.8;">
                                    $message
                                </p>
                            </div>

                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="mailto:$email" style="display: inline-block; background: linear-gradient(135deg, #FED700 0%, #F5C400 100%); color: #1E1E1E; text-decoration: none; padding: 16px 40px; border-radius: 4px; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(254, 215, 0, 0.3);">
                                            📧 Odpowiedz Klientowi
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1E1E1E; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #FED700; font-size: 18px; font-weight: 700; letter-spacing: 1px;">
                                TRANS<span style="font-weight: 800;">-KOP</span>
                            </p>
                            <p style="margin: 0 0 15px 0; color: #999; font-size: 13px; line-height: 1.6;">
                                Kompleksowe roboty ziemne, sprzedaż kruszyw i wynajem sprzętu<br>
                                <a href="tel:+48123456789" style="color: #FED700; text-decoration: none;">+48 123 456 789</a> |
                                <a href="mailto:biuro@trans-kop.pl" style="color: #FED700; text-decoration: none;">biuro@trans-kop.pl</a>
                            </p>
                            <p style="margin: 0; color: #666; font-size: 11px;">
                                &copy; 2025 TRANS-KOP. Wszystkie prawa zastrzeżone.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;

    return $htmlBody;
}
?>
