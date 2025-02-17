<?php
// Проверяем, что запрос является GET-запросом
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Папка, где хранятся файлы
    $folderPath = 'links/';

    // Массив для хранения данных
    $responseData = [];

    // Проверяем, существует ли папка
    if (is_dir($folderPath)) {
        // Открываем папку
        if ($handle = opendir($folderPath)) {
            // Читаем файлы в папке
            while (false !== ($entry = readdir($handle))) {
                // Пропускаем текущую и родительскую директории
                if ($entry !== "." && $entry !== "..") {
                    // Получаем имя файла без расширения
                    $fileName = pathinfo($entry, PATHINFO_FILENAME);

                    // Читаем содержимое файла
                    $fileContent = file_get_contents($folderPath . $entry);

                    // Обработка для разных типов файлов
                    switch ($fileName) {
                        case 'support':
                            $responseData['techLink'] = trim($fileContent);
                            break;
                        case 'vk':
                            $responseData['vkLink'] = trim($fileContent);
                            break;
                        case 'tg':
                            $responseData['tgLink'] = trim($fileContent);
                            break;
                        case 'wt':
                            $responseData['wtLink'] = trim($fileContent);
                            break;
                        case 'time':
                            $responseData['time'] = trim($fileContent);
                            break;
                        case 'phone':
                            $responseData['phoneNumber'] = trim($fileContent);
                            break;
                        case 'return':
                            $responseData['returnText'] = trim($fileContent);
                            break;
                        case 'adress':
                            // Разделяем содержимое файла на строки
                            $lines = explode(PHP_EOL, $fileContent);
                            if (count($lines) === 3) {
                                $responseData['textAdress'] = trim($lines[0]);
                                $responseData['hrefAdress'] = trim($lines[1]);
                                $responseData['hrefmapAdress'] = trim($lines[2]);
                            }
                            break;
                        case 'info':
                            $responseData['textInfo'] = trim($fileContent);
                            break;
                        default:
                            // Игнорируем другие файлы
                            break;
                    }
                }
            }
            closedir($handle);
        } else {
            // Возвращаем ошибку, если не удалось открыть папку
            http_response_code(500);
            echo json_encode(['error' => 'Не удалось открыть папку с файлами.']);
            exit;
        }
    } else {
        // Возвращаем ошибку, если папка не существует
        http_response_code(404);
        echo json_encode(['error' => 'Папка с файлами не найдена.']);
        exit;
    }

    // Возвращаем данные в формате JSON
    header('Content-Type: application/json');
    echo json_encode($responseData);
} else {
    // Возвращаем ошибку, если запрос не GET
    http_response_code(405);
    echo json_encode(['error' => 'Метод запроса не поддерживается.']);
}
?>