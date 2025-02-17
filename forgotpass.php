<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Получаем данные из POST-запроса
$email = $_POST['email'];

// Подключение к базе данных
$mysql = new mysqli("192.168.192.59", "root", "", "register-bg");

// Проверяем почту и пароль в базе данных
$result = $mysql->query("SELECT * FROM `users` WHERE `email` = '$email'");

// Проверяем, есть ли пользователь с такой почтой в базе данных
if ($result->fetch_assoc()) {
    // Пользователь найден
    echo json_encode(['status' => 'success', 'message' => 'User found']);
} else {
        // Пользователь с таким email не найден
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
}

// Закрываем соединение с базой данных
$mysql->close();
?>