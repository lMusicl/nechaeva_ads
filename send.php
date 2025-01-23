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

// Настройки для отправки
$to = "support@nechaevatarget.com";
$subject = "Новая заявка с сайта NechaevaTarget";
$message = "Получена новая заявка:\n\n";
$message .= "Имя: " . $name . "\n";
$message .= "Telegram: " . $telegram . "\n";
$message .= "Ниша: " . $niche . "\n";
$message .= "\nДата и время: " . date("Y-m-d H:i:s") . "\n";

// Заголовки письма
$subject = '=?UTF-8?B?'.base64_encode($subject).'?='; // Кодируем тему письма
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "From: =?UTF-8?B?".base64_encode("NechaevaTarget")."?= <support@nechaevatarget.com>\r\n";
$headers .= "Reply-To: support@nechaevatarget.com\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Отправка письма
if(mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?> 