<?php
// Антиспам проверки
function isSpam($data) {
    // Проверка поля-ловушки
    if (!empty($data['website'])) {
        return true;
    }

    // Проверка времени заполнения (менее 3 секунд считаем спамом)
    $timestamp = (int)$data['timestamp'];
    if (time() - $timestamp < 3) {
        return true;
    }

    // Проверка на наличие ссылок в полях
    $fields = [$data['name'], $data['telegram'], $data['niche']];
    foreach ($fields as $field) {
        if (preg_match('/(http|https|www|\[url=|\[link=)/i', $field)) {
            return true;
        }
    }

    return false;
}

// Получаем данные из формы
$name = trim(strip_tags($_POST['name']));
$telegram = trim(strip_tags($_POST['telegram']));
$niche = trim(strip_tags($_POST['niche']));

// Проверка на спам
if (isSpam($_POST)) {
    echo json_encode(['success' => false, 'message' => 'Spam detected']);
    exit;
}

// Базовая валидация
if (empty($name) || empty($telegram) || empty($niche)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Настройки SMTP
$to = "your@realemail.com"; // Ваш реальный email для получения заявок
$subject = "Новая заявка с сайта";
$message = "Имя: " . $name . "\n";
$message .= "Telegram: " . $telegram . "\n";
$message .= "Ниша: " . $niche . "\n";

// Заголовки письма
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/plain; charset=utf-8\r\n";
$headers .= "From: website@localhost.com\r\n";
$headers .= "Reply-To: website@localhost.com\r\n";

// Настройки SMTP для Fake SMTP Server
ini_set("SMTP", "127.0.0.1");
ini_set("smtp_port", "25");
// $headers .= "From: noreply@yourdomain.com\r\n"; // Замените на email вашего домена
// $headers .= "Reply-To: noreply@yourdomain.com\r\n"; // Замените на email вашего домена

// Отправка письма
if(mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?> 