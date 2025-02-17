<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['logo']) && isset($_POST['email'])) {
    $email = $_POST['email']; // Получаем email из POST-запроса
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Некорректный email.");
    }

    $uploadDir = 'users/' . $email . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $uploadFile = $uploadDir . 'logo.png';

    if (move_uploaded_file($_FILES['logo']['tmp_name'], $uploadFile)) {
        echo "Файл успешно загружен и заменен.";
    } else {
        echo "Ошибка при загрузке файла.";
    }
} else {
    echo "Файл или email не были отправлены.";
}
?>