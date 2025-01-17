<?php
// Получаем данные из формы
$name = $_POST['name'];
$telegram = $_POST['telegram'];
$niche = $_POST['niche'];

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
    echo json_encode(['success' => false]);
}
?> 