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

// Извлекаем title
$title = $input['title'] ?? '';

// Проверка, что title не пустой
if (empty($title)) {
    echo json_encode(['error' => 'Необходимо указать title.']);
    exit;
}

// SQL-запрос для удаления товара
$sql = "DELETE FROM products WHERE title = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Ошибка подготовки запроса: ' . $conn->error]);
    exit;
}

// Привязка параметров
$stmt->bind_param('s', $title);

// Выполнение запроса
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Товар успешно удален.']);
    } else {
        echo json_encode(['error' => 'Товар с указанным title не найден.']);
    }
} else {
    echo json_encode(['error' => 'Ошибка при удалении товара: ' . $stmt->error]);
}

// Закрытие соединения
$stmt->close();
$conn->close();
?>