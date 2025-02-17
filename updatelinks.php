<?php
// Проверяем, что запрос является POST-запросом
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из POST-запроса
    $data = json_decode(file_get_contents('php://input'), true);

    // Извлекаем переменные
    $info = $data['info'] ?? '';

    // Проверяем, что имя файла не пустое
    if (!empty($info)) {
        // Формируем путь к файлу
        $filePath = 'links/' . $info . '.txt';

        // Обработка для info = 'adress'
        if ($info === 'adress') {
            // Извлекаем данные для адреса
            $textAdress = $data['textAdress'] ?? '';
            $hrefAdress = $data['hrefAdress'] ?? '';
            $hrefmapAdress = $data['hrefmapAdress'] ?? '';

            // Проверяем, что все данные для адреса переданы
            if (!empty($textAdress) && !empty($hrefAdress) && !empty($hrefmapAdress)) {
                // Формируем содержимое файла (каждая переменная на новой строке)
                $content = $textAdress . PHP_EOL . $hrefAdress . PHP_EOL . $hrefmapAdress;

                // Записываем данные в файл
                file_put_contents($filePath, $content);

                // Возвращаем успешный ответ
                echo json_encode(['message' => 'Данные адреса успешно записаны в файл.']);
            } else {
                // Возвращаем ошибку, если не все данные переданы
                http_response_code(400);
                echo json_encode(['error' => 'Необходимые данные для адреса не были переданы.']);
            }
        } else {
            // Обработка для других значений info
            // Ищем первую переменную, которая пришла вместе с info
            $firstKey = null;
            foreach ($data as $key => $value) {
                if ($key !== 'info') {
                    $firstKey = $key;
                    break;
                }
            }

            // Если найдена переменная
            if ($firstKey !== null) {
                $text = $data[$firstKey] ?? '';

                // Проверяем, что текст не пустой
                if (!empty($text)) {
                    // Записываем текст в файл
                    file_put_contents($filePath, $text);

                    // Возвращаем успешный ответ
                    echo json_encode(['message' => 'Текст успешно записан в файл.']);
                } else {
                    // Возвращаем ошибку, если текст не был передан
                    http_response_code(400);
                    echo json_encode(['error' => 'Текст не был передан.']);
                }
            } else {
                // Возвращаем ошибку, если не найдена переменная
                http_response_code(400);
                echo json_encode(['error' => 'Не удалось определить переменную для записи.']);
            }
        }
    } else {
        // Возвращаем ошибку, если info не был передан
        http_response_code(400);
        echo json_encode(['error' => 'Имя файла (info) не было передано.']);
    }
} else {
    // Возвращаем ошибку, если запрос не POST
    http_response_code(405);
    echo json_encode(['error' => 'Метод запроса не поддерживается.']);
}
?>