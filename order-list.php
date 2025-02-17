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

// Извлекаем параметр поиска
$query = $input['query'] ?? '';

// Подготовка SQL-запроса
if (!empty($query)) {
    // Поиск по любому полю
    $sql = "SELECT * FROM orders WHERE 
            id LIKE ? OR 
            email LIKE ? OR 
            name LIKE ? OR 
            url LIKE ? OR 
            phone LIKE ? OR 
            datetime LIKE ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['error' => 'Ошибка подготовки запроса: ' . $conn->error]);
        exit;
    }

    // Добавляем % для поиска по частичному совпадению
    $searchQuery = "%$query%";
    $stmt->bind_param('ssssss', $searchQuery, $searchQuery, $searchQuery, $searchQuery, $searchQuery, $searchQuery);
} else {
    // Если параметр поиска не указан, выводим все заказы
    $sql = "SELECT * FROM orders";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['error' => 'Ошибка подготовки запроса: ' . $conn->error]);
        exit;
    }
}

// Выполнение запроса
$stmt->execute();
$result = $stmt->get_result();

// Формирование результата
$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = [
        "id" => $row['id'],
        "phone" => $row['phone'],
        "email" => $row['email'],
        "name" => $row['name'],
        "url" => $row['url'],
        "datetime" => $row['datetime']
    ];
}

// Возврат результата в формате JSON
echo json_encode($orders);

// Закрытие соединения
$stmt->close();
$conn->close();
?>