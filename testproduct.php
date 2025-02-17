<?php
header('Content-Type: application/json');

// Пример данных в нужном формате
$response = [
    "availability" => "instock",
    "brandname" => "Samsung",
    "categoryname" => "tv",
    "characteristics" => [
        ["name" => "Разрешение экрана", "value" => "HD"],
        ["name" => "Тип матрицы", "value" => "LED"],
        ["name" => "Частота обновления", "value" => "60Hz"],
        ["name" => "Диагональ", "value" => "32"],
        ["name" => "Цвет", "value" => "white"]
    ],
    "description" => "ываываываыва",
    "fullDescription" => "ываываываываываываыавываываыав",
    "images" => [
        "items/productimages/productimage_1734448280896_3.png",
        "items/productimages/productimage_1734448280896_2.png",
        "items/productimages/productimage_1734448280895_0.png",
        "items/productimages/productimage_1734448280895_1.png",
        "items/productimages/productimage_1734448280896_4.png"
    ],
    "price" => "1231423",
    "quantity" => "12",
    "status" => "discount",
    "title" => "ываываываыва"
];

// Отправляем JSON-ответ
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
