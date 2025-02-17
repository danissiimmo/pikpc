document.addEventListener('DOMContentLoaded', function () {
    const categoryNames = {
        matherbords: 'Материнские платы',
        cpu: 'Процессоры',
        ram: 'Оперативная память',
        'hddssd': 'Хранение данных',
        'cases': 'Корпуса',
        'pc': 'Готовые ПК',
    };

    const params = new URLSearchParams(window.location.search);
    const category = params.keys().next().value;

    const categoryHeader = document.getElementById('category-header');
    const categoryInfoName = document.querySelector('.category-name');
    const filtersContainer = document.getElementById('filters-container');

    // Устанавливаем заголовки категории
    const categoryName = categoryNames[category] || 'Все товары';
    categoryHeader.textContent = `Каталог > ${categoryName}`;
    categoryInfoName.textContent = categoryName;

    // Устанавливаем название категории в title
    document.title = `${categoryName} - Каталог товаров`;
});
