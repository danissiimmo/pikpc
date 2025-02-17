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

// Извлекаем данные
$title = $input['title'] ?? '';
$description = $input['description'] ?? '';
$fullDescription = $input['fullDescription'] ?? '';
$price = $input['price'] ?? 0;
$status = $input['status'] ?? '';
$categoryname = $input['categoryname'] ?? '';
$availability = $input['availability'] ?? '';
$quantity = $input['quantity'] ?? 0;
$brandname = $input['brandname'] ?? '';
$characteristics = $input['characteristics'] ?? [];
$images = $input['images'] ?? [];

// Проверка, что массив images не пустой
if (empty($images)) {
    echo json_encode(['error' => 'Массив images пустой.']);
    exit;
}

// Генерация случайного рейтинга от 4.1 до 5.0
$rating = mt_rand(41, 50) / 10;

// Генерация уникального productId
$productId = uniqid('product_', true);

// Подготовка данных для вставки
$characteristicsJson = json_encode($characteristics, JSON_UNESCAPED_UNICODE);
$imagesJson = json_encode($images, JSON_UNESCAPED_UNICODE);

// Проверка, что JSON-кодирование прошло успешно
if ($characteristicsJson === false || $imagesJson === false) {
    echo json_encode(['error' => 'Ошибка при кодировании данных в JSON.']);
    exit;
}

// SQL-запрос для вставки данных
$sql = "INSERT INTO products (
    productId, title, rating, description, fullDescription, price, status, categoryname, availability, quantity, brandname, characteristics, images
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

// Подготовка и выполнение запроса
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Ошибка подготовки запроса: ' . $conn->error]);
    exit;
}

// Привязка параметров
$stmt->bind_param(
    'ssdssisssisss', // Типы данных: s - строка, d - число с плавающей точкой, i - целое число
    $productId,
    $title,
    $rating,
    $description,
    $fullDescription,
    $price,
    $status,
    $categoryname,
    $availability,
    $quantity,
    $brandname,
    $characteristicsJson,
    $imagesJson
);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Товар успешно сохранен.', 'productId' => $productId, 'images' => $images]);
} else {
    echo json_encode(['error' => 'Ошибка при сохранении товара: ' . $stmt->error]);
}

// Закрытие соединения
$stmt->close();
$conn->close();
?>