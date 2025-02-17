<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Получаем данные из POST-запроса
$email = $_POST['email'];

// Генерируем код подтверждения
$confirmationCode = generateRandomString(8); // Генерируем случайную строку длиной 8 символов

// Подключение к базе данных и сохранение кода подтверждения
$mysql = new mysqli("192.168.192.59", "root", "", "register-bg");
$mysql->query("UPDATE `users` SET `confirmation_code` = '$confirmationCode' WHERE `email` = '$email'");

// Отправляем письмо на указанную почту
$subject = 'Восстановление доступа к аккаунту';
$message = "
<head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
    
      .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .backcontainer {
        background-color: #f0f0f0;
        padding: 150px 40px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
    
      .code {
        font-size: 24px;
        color: #000000;
        text-align: center;
        margin-bottom: 20px;
      }

      .title {
        font-size: 50px;
        color:rgb(82, 108, 226);
        text-align: center;
        margin-top: -110px;
      }
    
      .footer {
        font-size: 12px;
        color: #888;
        text-align: center;
      }

      a {
        text-decoration: none;
        color: rgb(82, 108, 226);
      }
      .bottomtext {
        font-size: 10px;
        text-align: center;
      }
    </style>
    </head>
    <body>
    <div class='backcontainer'>
      <p class='title'><a href='http:/192.168.192.59/сайт/index.html'><strong>ПИК</strong></a></p>
    <div class='container'>
      <p class='code'><strong>$confirmationCode</strong></p>
      <p class='footer'><em>IP-адрес: ".$_SERVER['REMOTE_ADDR']."<br>Местоположение: ".getCountry($_SERVER['REMOTE_ADDR'])."</em></p>
    </div>
    <p class='bottomtext'>Если вы не запрашивали восстановление пароля,</p>
    <p class='bottomtext'>проигнорируйте это сообщение.</p>
    </div>
    </body>

";
$headers = 'From: danilkafaerok@yandex.ru' . "\r\n" .
    'Reply-To: danilkafaerok@yandex.ru' . "\r\n" .
    'Content-Type: text/html; charset=UTF-8' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

if (mail($email, $subject, $message, $headers)) {
  echo json_encode(['status' => 'success', 'message' => 'Confirmation code sent successfully', 'confirmationCode' => $confirmationCode]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to send confirmation code']);
}

// Закрываем соединение с базой данных
$mysql->close();

// Функция для генерации случайной строки
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

// Функция для определения страны по IP-адресу
function getCountry($ip) {
    $response = file_get_contents("https://ipapi.co/$ip/country/");
    return $response;
}
?>
