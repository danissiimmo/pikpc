document.addEventListener('DOMContentLoaded', function () {
    // Находим все элементы с классами square-button или category-item
    const buttons = document.querySelectorAll('.square-button, .category-item');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // Получаем значение из атрибута data-category
            const category = button.getAttribute('data-category');

            // Проверяем, если значение data-category одно из требуемых
            let targetUrl = '';
            if (category === 'discount' || category === 'damagedpackage' || category === 'minordefects') {
                targetUrl = `catalog.html?${category}=&instock=true&minprice=0&maxprice=100000&preordertomorrow=true&preorderlater=true&${category}=true`;
            } else {
                targetUrl = `catalog.html?${category}=&instock=true&minprice=0&maxprice=100000&preordertomorrow=true&preorderlater=true`;
            }

            // Проверяем текущий URL и выполняем редирект, если нужно
            const currentUrl = window.location.href;
            if (currentUrl.endsWith(targetUrl)) {
                console.log('Вы уже на этой странице.');
                return; // Останавливаем дальнейшее выполнение, если мы уже на нужной странице
            } else {
                // Отправляем POST-запрос на сервер с категорией
                fetch('http://192.168.192.59/сайт/filters.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ CategoryDTO: { Name: category } }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Данные успешно отправлены:', data);

                    // Перенаправляем на catalog.html с добавлением параметра
                    window.location.href = targetUrl;
                })
                .catch(error => {
                    console.error('Ошибка при отправке данных на сервер:', error);
                });
            }
        });
    });
});
