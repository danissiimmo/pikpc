<?php
// Подключение к базе данных
$servername = "192.168.192.59";
$username = "root";
$password = "";
$dbname = "register-bg";

$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Получение email из GET запроса
$email = $_GET['email'];

// Получение данных пользователя из базы данных
$sql = "SELECT name, pass, datebirth FROM users WHERE email='$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Вывод данных в формате JSON
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo "Пользователь не найден";
}

$conn->close();
?>