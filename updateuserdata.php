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

// Получение данных из POST запроса
$email = $_POST['email'];
$name = $_POST['name'];
$password = $_POST['password'];
$datebirth = $_POST['datebirth'];

if (!$datebirth) {
    die("Некорректный формат даты");
}

// Использование подготовленных выражений для обновления данных
$stmt = $conn->prepare("UPDATE users SET name=?, pass=?, datebirth=? WHERE email=?");
$stmt->bind_param("ssss", $name, $password, $datebirth, $email);

if ($stmt->execute()) {
    echo "Данные успешно обновлены";
} else {
    echo "Ошибка при обновлении данных: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>