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

// Извлекаем значение id из CategoryDTO
$categoryId = $input['productId'] ?? null;

if (is_null($categoryId)) {
    echo json_encode(['error' => 'Параметр CategoryDTO.Id не указан.']);
    exit;
}

// SQL-запрос для получения данных из таблицы products с фильтром по id категории
$sql = "SELECT * FROM products WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Ошибка подготовки запроса: ' . $conn->error]);
    exit;
}

// Привязка параметров
$stmt->bind_param('i', $categoryId);

// Выполнение запроса
$stmt->execute();
$result = $stmt->get_result();

// Формирование результата
$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = [
        "id" => $row['id'],
        "productId" => $row['productId'],
        "title" => $row['title'],
        "rating" => (float)$row['rating'],
        "description" => $row['description'],
        "fullDescription" => $row['fullDescription'],
        "price" => $row['price'],
        "status" => $row['status'],
        "categoryname" => $row['categoryname'],
        "availability" => $row['availability'],
        "quantity" => (int)$row['quantity'],
        "brandname" => $row['brandname'],
        "characteristics" => json_decode($row['characteristics'], true),
        "images" => json_decode($row['images'], true),
        "productStatus" => $row['status'], // Добавляем статус для использования в JS
        "productName" => $row['title'],   // Добавляем название для использования в JS
        "image" => json_decode($row['images'], true)[0] ?? 'items/filters/no-image.png' // Первое изображение как основное
    ];
}

// Возврат результата в формате JSON
echo json_encode(['data' => $products]);

// Закрытие соединения
$stmt->close();
$conn->close();
?>
