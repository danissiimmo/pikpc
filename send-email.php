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
$phone = $input['phone'] ?? '';
$email = $input['email'] ?? '';
$name = $input['name'] ?? '';
$url = $input['url'] ?? '';
$datetime = $input['datetime'] ?? '';

// Проверка обязательных полей
if (empty($phone) || empty($email) || empty($name) || empty($url) || empty($datetime)) {
    echo json_encode(['error' => 'Все поля обязательны.']);
    exit;
}

// Сохранение данных в таблицу orders
$sql = "INSERT INTO orders (phone, email, name, url, datetime) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Ошибка подготовки запроса: ' . $conn->error]);
    exit;
}

$stmt->bind_param('sssss', $phone, $email, $name, $url, $datetime);

if ($stmt->execute()) {
    // Генерация PDF
    if (file_exists('fpdf.php')) {
        require('fpdf.php');
    } else {
        echo json_encode(['error' => 'Библиотека FPDF не найдена.']);
        exit;
    }

    $pdf = new FPDF();
    $pdf->AddPage();
    $pdf->SetFont('Arial', 'B', 16);

    // Заголовок
    $pdf->Cell(0, 10, 'Order details', 0, 1, 'C');
    $pdf->Ln(10);

    // Данные заказа
    $pdf->SetFont('Arial', '', 12);
    $pdf->Cell(0, 10, "Name: $name", 0, 1);
    $pdf->Cell(0, 10, "Number: $phone", 0, 1);
    $pdf->Cell(0, 10, "Email: $email", 0, 1);
    $pdf->Cell(0, 10, "URL: $url", 0, 1);
    $pdf->Cell(0, 10, "Date and Time: $datetime", 0, 1);

    // Сохранение PDF
    if (!is_dir('orders')) {
        mkdir('orders', 0777, true); // Создаем папку, если она не существует
    }
    
    $pdfFilePath = 'orders/order_' . time() . '.pdf';
    $pdf->Output('F', $pdfFilePath);

    echo json_encode(['success' => 'Заказ успешно сохранен.', 'pdf_path' => $pdfFilePath]);
} else {
    echo json_encode(['error' => 'Ошибка при сохранении заказа: ' . $stmt->error]);
}

// Закрытие соединения
$stmt->close();
$conn->close();
?>