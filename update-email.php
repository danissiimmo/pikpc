<?php
header('Content-Type: application/json');

// Подключение к базе данных
$servername = "192.168.192.59";
$username = "root";
$password = "";
$dbname = "register-bg";

$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Получаем данные из POST-запроса
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['error' => 'Неверный формат данных.']);
    exit;
}

// Извлекаем новое значение email
$email = $input['emailEdit'] ?? '';

// Проверка, что email не пустой
if (empty($email)) {
    echo json_encode(['error' => 'Email не может быть пустым.']);
    exit;
}

// SQL-запрос для обновления email
$sql = "UPDATE admin SET email = ? WHERE id = 1";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Ошибка подготовки запроса: ' . $conn->error]);
    exit;
}

// Привязка параметров
$stmt->bind_param('s', $email);

// Выполнение запроса
if ($stmt->execute()) {
    echo json_encode(['message' => 'Email успешно обновлен.']);
} else {
    echo json_encode(['error' => 'Ошибка при обновлении email: ' . $stmt->error]);
}

// Закрытие соединения
$stmt->close();
$conn->close();
?>