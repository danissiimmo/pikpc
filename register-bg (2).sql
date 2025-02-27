-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 192.168.192.59:3307
-- Время создания: Фев 27 2025 г., 01:56
-- Версия сервера: 8.0.30
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `register-bg`
--

-- --------------------------------------------------------

--
-- Структура таблицы `admin`
--

CREATE TABLE `admin` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(100) NOT NULL,
  `login` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `admin`
--

INSERT INTO `admin` (`id`, `email`, `login`, `password`) VALUES
(1, 'danilkafaerok@yandex.ru', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Структура таблицы `filters`
--

CREATE TABLE `filters` (
  `id` int NOT NULL,
  `matherbords` json DEFAULT NULL,
  `cpu` json DEFAULT NULL,
  `ram` json DEFAULT NULL,
  `hddssd` json DEFAULT NULL,
  `cases` json DEFAULT NULL,
  `pc` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `filters`
--

INSERT INTO `filters` (`id`, `matherbords`, `cpu`, `ram`, `hddssd`, `cases`, `pc`) VALUES
(1, '{\"filters\": [{\"title\": \"Сокет\", \"options\": [{\"label\": \"LGA 1700\", \"value\": \"lga1700\"}, {\"label\": \"AM4\", \"value\": \"am4\"}, {\"label\": \"AM5\", \"value\": \"am5\"}]}, {\"title\": \"Чипсет\", \"options\": [{\"label\": \"Z790\", \"value\": \"z790\"}, {\"label\": \"B650\", \"value\": \"b650\"}, {\"label\": \"X670\", \"value\": \"x670\"}]}, {\"title\": \"Форм-фактор\", \"options\": [{\"label\": \"ATX\", \"value\": \"atx\"}, {\"label\": \"Micro-ATX\", \"value\": \"matx\"}, {\"label\": \"Mini-ITX\", \"value\": \"miniitx\"}]}]}', '{\"filters\": [{\"title\": \"Сокет\", \"options\": [{\"label\": \"LGA 1700\", \"value\": \"lga1700\"}, {\"label\": \"AM5\", \"value\": \"am5\"}]}, {\"title\": \"Ядра/Потоки\", \"options\": [{\"label\": \"6/12\", \"value\": \"6c12t\"}, {\"label\": \"8/16\", \"value\": \"8c16t\"}, {\"label\": \"12/24\", \"value\": \"12c24t\"}]}, {\"title\": \"Теплопакет\", \"options\": [{\"label\": \"65W\", \"value\": \"65w\"}, {\"label\": \"105W\", \"value\": \"105w\"}]}]}', '{\"filters\": [{\"title\": \"Тип памяти\", \"options\": [{\"label\": \"DDR4\", \"value\": \"ddr4\"}, {\"label\": \"DDR5\", \"value\": \"ddr5\"}]}, {\"title\": \"Латентность\", \"options\": [{\"label\": \"CL16\", \"value\": \"cl16\"}, {\"label\": \"CL18\", \"value\": \"cl18\"}]}, {\"title\": \"Подсветка\", \"options\": [{\"label\": \"RGB\", \"value\": \"rgb\"}, {\"label\": \"Без подсветки\", \"value\": \"norgb\"}]}]}', '{\"filters\": [{\"title\": \"Тип накопителя\", \"options\": [{\"label\": \"SSD SATA\", \"value\": \"sata\"}, {\"label\": \"NVMe PCIe 4.0\", \"value\": \"nvme4\"}]}, {\"title\": \"Скорость записи\", \"options\": [{\"label\": \"До 3500MB/s\", \"value\": \"3500\"}, {\"label\": \"До 7000MB/s\", \"value\": \"7000\"}]}, {\"title\": \"Выносливость\", \"options\": [{\"label\": \"600 TBW\", \"value\": \"600\"}, {\"label\": \"1200 TBW\", \"value\": \"1200\"}]}]}', '{\"filters\": [{\"title\": \"Материал корпуса\", \"options\": [{\"label\": \"Закаленное стекло\", \"value\": \"glass\"}, {\"label\": \"Сталь\", \"value\": \"steel\"}]}, {\"title\": \"Охлаждение\", \"options\": [{\"label\": \"С водяным охлаждением\", \"value\": \"watercooling\"}, {\"label\": \"Воздушное\", \"value\": \"air\"}]}, {\"title\": \"Цветовая схема\", \"options\": [{\"label\": \"Черный\", \"value\": \"black\"}, {\"label\": \"Белый\", \"value\": \"white\"}]}]}', '{\"filters\": [{\"title\": \"Назначение\", \"options\": [{\"label\": \"Игровой\", \"value\": \"gaming\"}, {\"label\": \"Рабочая станция\", \"value\": \"workstation\"}]}, {\"title\": \"Уровень сборки\", \"options\": [{\"label\": \"Бюджетная\", \"value\": \"budget\"}, {\"label\": \"Премиум\", \"value\": \"premium\"}]}, {\"title\": \"Гарантия\", \"options\": [{\"label\": \"3 года\", \"value\": \"3y\"}, {\"label\": \"5 лет\", \"value\": \"5y\"}]}]}');

-- --------------------------------------------------------

--
-- Структура таблицы `links`
--

CREATE TABLE `links` (
  `id` int NOT NULL,
  `techsupport` varchar(15) DEFAULT NULL,
  `vk` varchar(255) DEFAULT NULL,
  `tg` varchar(255) DEFAULT NULL,
  `wt` varchar(255) DEFAULT NULL,
  `worktime` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `textreturn` varchar(255) DEFAULT NULL,
  `adresstext` varchar(255) DEFAULT NULL,
  `adressmaplink` varchar(255) DEFAULT NULL,
  `adressimglink` varchar(255) DEFAULT NULL,
  `textcontacts` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `maintenance`
--

CREATE TABLE `maintenance` (
  `id` int NOT NULL,
  `maintenance` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `maintenance`
--

INSERT INTO `maintenance` (`id`, `maintenance`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int UNSIGNED NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `datetime` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `phone`, `email`, `name`, `url`, `datetime`) VALUES
(1, '+76445664564', 'danilkafaerok@yandex.ru', 'retyrgtegertergt', 'http://192.168.192.59/product.html?id=101', '16.02.2025 23:54'),
(2, '+76445664564', 'danilkafaerok@yandex.ru', 'retyrgtegertergt', 'http://192.168.192.59/product.html?id=101', '16.02.2025 23:57'),
(3, '+78854908956', 'danilkafaerok@yandex.ru', 'tryrtyrty', 'http://192.168.192.59/product.html?id=101', '16.02.2025 23:58'),
(4, '+78854908956', 'danilkafaerok@yandex.ru', 'tryrtyrty', 'http://192.168.192.59/product.html?id=101', '16.02.2025 23:59'),
(5, '+78970890890', 'danilkafaerok@yandex.ru', 'piugt', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:00'),
(6, '+78970890890', 'danilkafaerok@yandex.ru', 'piugt', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:02'),
(7, '+78970890890', 'danilkafaerok@yandex.ru', 'piugt', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:02'),
(8, '+79999999999', 'danilkafaerok@yandex.ru', 'шглглш', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:04'),
(9, '+7567567756', 'dandandn@yandex.ru', 'regergerg', 'https://youtube.com', '25.05.2004'),
(10, '+7567567756', 'dandandn@yandex.ru', 'regergerg', 'https://youtube.com', '25.05.2004'),
(11, '+79999999999', 'danilkafaerok@yandex.ru', 'шглглш', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:11'),
(12, '+79999999999', 'danilkafaerok@yandex.ru', 'нгонгло', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:11'),
(13, '+79999999999', 'danilkafaerok@yandex.ru', 'ролбдп', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:14'),
(14, '+79999999999', 'danilkafaerok@yandex.ru', 'ролбдп', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:16'),
(15, '+79999999999', 'danilkafaerok@yandex.ru', 'yuktii', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:16'),
(16, '+79999999999', 'danilkafaerok@yandex.ru', 'yuktii', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:17'),
(17, '+79999999999', 'danilkafaerok@yandex.ru', 'yuktii', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:18'),
(18, '+79999999999', 'danilkafaerok@yandex.ru', 'treyjhu', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:40'),
(19, '+79999999999', 'danilkafaerok@yandex.ru', 'treyjhu', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:44'),
(20, '+79999999999', 'danilkafaerok@yandex.ru', 'fgfhhfghfg', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:45'),
(21, '+79999999999', 'danilkafaerok@yandex.ru', 'fgfhhfghfg', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:45'),
(22, '+79999999999', 'danilkafaerok@yandex.ru', 'fgfhhfghfg', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:45'),
(23, '+79999999999', 'danilkafaerok@yandex.ru', 'fgfhhfghfg', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:45'),
(24, '+79999999999', 'danilkafaerok@yandex.ru', 'tyhtyh', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:46'),
(25, '+79999999999', 'danilkafaerok@yandex.ru', 'ghyjghjghj', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:47'),
(26, '+79999999999', 'danilkafaerok@yandex.ru', 'ghyjghjghj', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:47'),
(27, '+79999999999', 'danilkafaerok@yandex.ru', 't7ujtyty', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:48'),
(28, '+79999999999', 'danilkafaerok@yandex.ru', 't7ujtyty', 'http://192.168.192.59/product.html?id=101', '17.02.2025 00:49'),
(29, '+70956870956', 'danilkafaerok@yandex.ru', 'Заказ Заказов Заказович', 'http://192.168.192.59/%D1%81%D0%B0%D0%B9%D1%82/product.html?id=23', '18.02.2025 15:32'),
(30, '+70956870956', 'danilkafaerok@yandex.ru', 'Danila Diachenko Vladimirovich', 'http://192.168.192.59/%D1%81%D0%B0%D0%B9%D1%82/product.html?id=23', '18.02.2025 15:33');

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `productId` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `rating` decimal(3,1) NOT NULL,
  `description` text NOT NULL,
  `fullDescription` text NOT NULL,
  `price` int NOT NULL,
  `status` varchar(50) NOT NULL,
  `categoryname` varchar(100) NOT NULL,
  `availability` varchar(50) NOT NULL,
  `quantity` int NOT NULL,
  `brandname` varchar(100) DEFAULT NULL,
  `characteristics` json NOT NULL,
  `images` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `productId`, `title`, `rating`, `description`, `fullDescription`, `price`, `status`, `categoryname`, `availability`, `quantity`, `brandname`, `characteristics`, `images`) VALUES
(22, 'product_67b26d85d4f489.81222707', 'фывфывфыв', '4.1', 'фывфывфыв', 'фывфывфвы', 5555, 'discount', 'tv', 'instock', 5555, 'Samsung', '[{\"name\": \"Разрешение экрана\", \"value\": \"HD\"}, {\"name\": \"Тип матрицы\", \"value\": \"LED\"}, {\"name\": \"Частота обновления\", \"value\": \"60Hz\"}, {\"name\": \"Диагональ\", \"value\": \"32\"}, {\"name\": \"Цвет\", \"value\": \"white\"}]', '[\"items/productimages/productimage_1739746693842_0.png\"]'),
(23, 'product_67b37a7d042680.40164515', 'ergergerg', '5.0', 'ergerg', 'ergergerg', 5555, 'discount', 'matherbords', 'instock', 5555, 'Samsung', '[{\"name\": \"Разрешение экрана\", \"value\": \"HD\"}, {\"name\": \"Тип матрицы\", \"value\": \"LED\"}, {\"name\": \"Частота обновления\", \"value\": \"60Hz\"}, {\"name\": \"Диагональ\", \"value\": \"32\"}, {\"name\": \"Цвет\", \"value\": \"white\"}]', '[\"items/productimages/productimage_1739815548980_0.png\"]'),
(24, 'product_67b37d2a0e6c57.24422842', 'test', '4.5', 'test', 'test', 10000, 'damagedpackage', 'matherbords', 'instock', 5555, 'Samsung', '[{\"name\": \"Разрешение экрана\", \"value\": \"HD\"}, {\"name\": \"Тип матрицы\", \"value\": \"LED\"}, {\"name\": \"Частота обновления\", \"value\": \"60Hz\"}, {\"name\": \"Диагональ\", \"value\": \"32\"}, {\"name\": \"Цвет\", \"value\": \"white\"}]', '[\"items/productimages/productimage_1739816234037_0.png\"]'),
(25, 'product_67b37d47025356.69618270', 'test1', '4.1', 'test1', 'test1', 50000, 'minordefects', 'matherbords', 'instock', 5555, 'Samsung', '[{\"name\": \"Разрешение экрана\", \"value\": \"HD\"}, {\"name\": \"Тип матрицы\", \"value\": \"LED\"}, {\"name\": \"Частота обновления\", \"value\": \"60Hz\"}, {\"name\": \"Диагональ\", \"value\": \"32\"}, {\"name\": \"Цвет\", \"value\": \"white\"}]', '[\"items/productimages/productimage_1739816263003_0.png\"]');

-- --------------------------------------------------------

--
-- Структура таблицы `returnorders`
--

CREATE TABLE `returnorders` (
  `id` int NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `about` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `pass` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `datebirth` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `email`, `pass`, `name`, `datebirth`) VALUES
(45, 'danilkafaerok@yandex.ru', '123123123', 'йцувйцв', '2025-02-15');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `filters`
--
ALTER TABLE `filters`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `links`
--
ALTER TABLE `links`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `maintenance`
--
ALTER TABLE `maintenance`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `productId` (`productId`);

--
-- Индексы таблицы `returnorders`
--
ALTER TABLE `returnorders`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
