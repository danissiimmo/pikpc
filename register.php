<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Подключение к базе данных (замените данными вашей БД)
$servername = "192.168.192.59";
$username = "root";
$password = "";
$dbname = "register-bg";

$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Получение данных из запроса
$new_email = $_POST['email'];

// Проверка наличия пользователя с такой почтой в базе данных
$sql = "SELECT * FROM users WHERE email='$new_email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Пользователь с такой почтой уже существует
    echo "<span style='color: red;'>Пользователь с указанной почтой уже существует. Пожалуйста, введите другую почту.</span>";
} else {
    // Пользователь с такой почтой не существует
    // Получаем остальные данные из формы
    $new_name = $_POST['name']; // Получаем имя из формы
    $new_pass = $_POST['pass']; // Получаем пароль из формы
    
    // Добавление нового пользователя в базу данных
    $sql_insert = "INSERT INTO users (email, name, pass) VALUES ('$new_email', '$new_name', '$new_pass')";
    if ($conn->query($sql_insert) === TRUE) {
        echo "<span style='color: green;'>Пользователь успешно добавлен.</span>";
    } else {
        echo "<span style='color: red;'>Ошибка при добавлении пользователя: </span>" . $conn->error;
    }
}

$conn->close();
?>
