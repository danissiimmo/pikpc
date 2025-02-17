<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Получаем данные из POST-запроса
$email = $_POST['email'];
$newPassword = $_POST['newPassword'];

// Подключение к базе данных и обновление пароля
$mysql = new mysqli("192.168.192.59", "root", "", "register-bg");
$mysql->query("UPDATE `users` SET `pass` = '$newPassword' WHERE `email` = '$email'");

if ($mysql->affected_rows > 0) {
    echo json_encode(['status' => 'success', 'message' => 'Password changed successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to change password']);
}

// Закрываем соединение с базой данных
$mysql->close();
?>
