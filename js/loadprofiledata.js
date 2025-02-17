 // Выполняем fetch запрос для получения данных
 fetch('https://example.com/api/getImageUrl') // Замените на ваш API endpoint
 .then(response => response.json()) // Предполагаем, что API возвращает JSON
 .then(data => {
     // Предположим, что API возвращает объект с полем imageUrl
     const imageUrl = data.imageUrl;

     // Создаем элемент изображения
     const img = document.createElement('img');
     img.src = imageUrl; // Устанавливаем src изображения
     img.alt = 'Profile Image'; // Добавляем альтернативный текст
     img.style.width = '20px'; // Настройте размер изображения
     img.style.height = '20px';

     // Находим ссылку "Профиль" по id
     const profileLink = document.getElementById('profileLink');

     // Вставляем изображение после ссылки "Профиль"
     profileLink.insertAdjacentElement('afterend', img);
 })
 .catch(error => {
     console.error('Ошибка при загрузке изображения:', error);

     const imageUrl = 'users/user1/logo.png' //data.imageUrl;

     // Создаем элемент изображения
     const img = document.createElement('img');
     img.src = imageUrl; // Устанавливаем src изображения
     img.alt = 'Profile Image'; // Добавляем альтернативный текст
     img.style.width = '20px'; // Настройте размер изображения
     img.style.height = '20px';

     // Находим ссылку "Профиль" по id
     const profileLink = document.getElementById('profileLink');

     // Вставляем изображение после ссылки "Профиль"
     profileLink.insertAdjacentElement('afterend', img);
 });