<?php
header('Content-Type: application/json');

// Проверка входящих данных
$input = json_decode(file_get_contents('php://input'), true);

if ($input['action'] === 'getCategoryFilters') {
    // Данные фильтров для категорий
    $categoryFilters = [
        "matherbords" => [
          "filters" => [
            [
              "title" => "Сокет",
              "options" => [
                ["label" => "LGA 1700", "value" => "lga1700"],
                ["label" => "AM4", "value" => "am4"],
                ["label" => "AM5", "value" => "am5"]
              ]
            ],
            [
              "title" => "Чипсет",
              "options" => [
                ["label" => "Z790", "value" => "z790"],
                ["label" => "B650", "value" => "b650"],
                ["label" => "X670", "value" => "x670"]
              ]
            ],
            [
              "title" => "Форм-фактор",
              "options" => [
                ["label" => "ATX", "value" => "atx"],
                ["label" => "Micro-ATX", "value" => "matx"],
                ["label" => "Mini-ITX", "value" => "miniitx"]
              ]
            ]
          ]
        ],
        "cpu" => [
          "filters" => [
            [
              "title" => "Сокет",
              "options" => [
                ["label" => "LGA 1700", "value" => "lga1700"],
                ["label" => "AM5", "value" => "am5"]
              ]
            ],
            [
              "title" => "Ядра/Потоки",
              "options" => [
                ["label" => "6/12", "value" => "6c12t"],
                ["label" => "8/16", "value" => "8c16t"],
                ["label" => "12/24", "value" => "12c24t"]
              ]
            ],
            [
              "title" => "Теплопакет",
              "options" => [
                ["label" => "65W", "value" => "65w"],
                ["label" => "105W", "value" => "105w"]
              ]
            ]
          ]
        ],
        "ram" => [
          "filters" => [
            [
              "title" => "Тип памяти",
              "options" => [
                ["label" => "DDR4", "value" => "ddr4"],
                ["label" => "DDR5", "value" => "ddr5"]
              ]
            ],
            [
              "title" => "Латентность",
              "options" => [
                ["label" => "CL16", "value" => "cl16"],
                ["label" => "CL18", "value" => "cl18"]
              ]
            ],
            [
              "title" => "Подсветка",
              "options" => [
                ["label" => "RGB", "value" => "rgb"],
                ["label" => "Без подсветки", "value" => "norgb"]
              ]
            ]
          ]
        ],
        "hddssd" => [
          "filters" => [
            [
              "title" => "Тип накопителя",
              "options" => [
                ["label" => "SSD SATA", "value" => "sata"],
                ["label" => "NVMe PCIe 4.0", "value" => "nvme4"]
              ]
            ],
            [
              "title" => "Скорость записи",
              "options" => [
                ["label" => "До 3500MB/s", "value" => "3500"],
                ["label" => "До 7000MB/s", "value" => "7000"]
              ]
            ],
            [
              "title" => "Выносливость",
              "options" => [
                ["label" => "600 TBW", "value" => "600"],
                ["label" => "1200 TBW", "value" => "1200"]
              ]
            ]
          ]
        ],
        "cases" => [
          "filters" => [
            [
              "title" => "Материал корпуса",
              "options" => [
                ["label" => "Закаленное стекло", "value" => "glass"],
                ["label" => "Сталь", "value" => "steel"]
              ]
            ],
            [
              "title" => "Охлаждение",
              "options" => [
                ["label" => "С водяным охлаждением", "value" => "watercooling"],
                ["label" => "Воздушное", "value" => "air"]
              ]
            ],
            [
              "title" => "Цветовая схема",
              "options" => [
                ["label" => "Черный", "value" => "black"],
                ["label" => "Белый", "value" => "white"]
              ]
            ]
          ]
        ],
        "pc" => [
          "filters" => [
            [
              "title" => "Назначение",
              "options" => [
                ["label" => "Игровой", "value" => "gaming"],
                ["label" => "Рабочая станция", "value" => "workstation"]
              ]
            ],
            [
              "title" => "Уровень сборки",
              "options" => [
                ["label" => "Бюджетная", "value" => "budget"],
                ["label" => "Премиум", "value" => "premium"]
              ]
            ],
            [
              "title" => "Гарантия",
              "options" => [
                ["label" => "3 года", "value" => "3y"],
                ["label" => "5 лет", "value" => "5y"]
              ]
            ]
          ]
        ],
        "discount" => [
          "filters" => [
            [
              "title" => "Тип устройства",
              "options" => [
                [ "label" => "Чайник", "value" => "kettle" ],
                [ "label" => "Тостер", "value" => "toaster" ],
                [ "label" => "Миксер", "value" => "mixer" ]
              ]
            ],
            [
              "title" => "Бренды",
              "options" => [
                [ "label" => "Samsung", "value" => "Samsung" ],
                [ "label" => "LG", "value" => "LG" ],
                [ "label" => "Xiaomi", "value" => "Xiaomi" ],
                [ "label" => "Panasonic", "value" => "Panasonic" ]
              ]
            ],
            [
              "title" => "Материал",
              "options" => [
                [ "label" => "Пластик", "value" => "plastic" ],
                [ "label" => "Металл", "value" => "metal" ]
              ]
            ],
            [
              "title" => "Мощность",
              "options" => [
                [ "label" => "500 Вт", "value" => "500w" ],
                [ "label" => "1000 Вт", "value" => "1000w" ]
              ]
            ],
            [
              "title" => "Цвет",
              "options" => [
                [ "label" => "Белый", "value" => "white" ],
                [ "label" => "Черный", "value" => "black" ]
              ]
            ],
            [
              "title" => "Гарантия",
              "options" => [
                [ "label" => "1 год", "value" => "1year" ],
                [ "label" => "2 года", "value" => "2years" ]
              ]
            ]
          ]
        ],
        "damagedpackage" => [
          "filters" => [
            [
              "title" => "Тип устройства",
              "options" => [
                [ "label" => "Чайник", "value" => "kettle" ],
                [ "label" => "Тостер", "value" => "toaster" ],
                [ "label" => "Миксер", "value" => "mixer" ]
              ]
            ],
            [
              "title" => "Бренды",
              "options" => [
                [ "label" => "Samsung", "value" => "Samsung" ],
                [ "label" => "LG", "value" => "LG" ],
                [ "label" => "Xiaomi", "value" => "Xiaomi" ],
                [ "label" => "Panasonic", "value" => "Panasonic" ]
              ]
            ],
            [
              "title" => "Материал",
              "options" => [
                [ "label" => "Пластик", "value" => "plastic" ],
                [ "label" => "Металл", "value" => "metal" ]
              ]
            ],
            [
              "title" => "Мощность",
              "options" => [
                [ "label" => "500 Вт", "value" => "500w" ],
                [ "label" => "1000 Вт", "value" => "1000w" ]
              ]
            ],
            [
              "title" => "Цвет",
              "options" => [
                [ "label" => "Белый", "value" => "white" ],
                [ "label" => "Черный", "value" => "black" ]
              ]
            ],
            [
              "title" => "Гарантия",
              "options" => [
                [ "label" => "1 год", "value" => "1year" ],
                [ "label" => "2 года", "value" => "2years" ]
              ]
            ]
          ]
        ],
        "minordefects" => [
          "filters" => [
            [
              "title" => "Тип устройства",
              "options" => [
                [ "label" => "Чайник", "value" => "kettle" ],
                [ "label" => "Тостер", "value" => "toaster" ],
                [ "label" => "Миксер", "value" => "mixer" ]
              ]
            ],
            [
              "title" => "Бренды",
              "options" => [
                [ "label" => "Samsung", "value" => "Samsung" ],
                [ "label" => "LG", "value" => "LG" ],
                [ "label" => "Xiaomi", "value" => "Xiaomi" ],
                [ "label" => "Panasonic", "value" => "Panasonic" ]
              ]
            ],
            [
              "title" => "Материал",
              "options" => [
                [ "label" => "Пластик", "value" => "plastic" ],
                [ "label" => "Металл", "value" => "metal" ]
              ]
            ],
            [
              "title" => "Мощность",
              "options" => [
                [ "label" => "500 Вт", "value" => "500w" ],
                [ "label" => "1000 Вт", "value" => "1000w" ]
              ]
            ],
            [
              "title" => "Цвет",
              "options" => [
                [ "label" => "Белый", "value" => "white" ],
                [ "label" => "Черный", "value" => "black" ]
              ]
            ],
            [
              "title" => "Гарантия",
              "options" => [
                [ "label" => "1 год", "value" => "1year" ],
                [ "label" => "2 года", "value" => "2years" ]
              ]
            ]
          ]
        ]
      ];

    echo json_encode($categoryFilters);
} else {
    echo json_encode(['error' => 'Invalid action']);
}
?>
