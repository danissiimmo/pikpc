    // Функция для загрузки аватарки пользователя
    function loadAvatar() {
        const email = localStorage.getItem("email"); // Получаем email из localStorage
        if (!email) {
            console.error("Email не найден в localStorage.");
            return;
        }

        // Формируем путь к аватарке
        const avatarPath = `users/${email}/logo.png`;

        // Устанавливаем путь к изображению в атрибут src
        const avatarImage = document.getElementById('avatarImage');
        avatarImage.src = avatarPath;

        // Обработка ошибки загрузки изображения
        avatarImage.onerror = function () {
            console.error("Аватарка не найдена или произошла ошибка загрузки.");
            avatarImage.src = 'path/to/default/avatar.png'; // Установите путь к дефолтной аватарке
        };

        // Загрузка имени
        const editEmailInput = document.getElementById('edit-email');

        if (email && editEmailInput) {
            editEmailInput.value = email; // Устанавливаем email в поле ввода
        } else {
            console.error("Email не найден в localStorage или поле ввода отсутствует.");
        }

        const password = localStorage.getItem("password");
        if (password) {
            document.getElementById('edit-password').value = password;
        } else {
            console.error("Пароль не найден в localStorage или поле ввода отсутствует.");
        }
    }

    loadAvatar();

    function resizeImage(file, width, height, callback) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function (e) {
            img.src = e.target.result;

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Устанавливаем размеры холста на 400x400
                canvas.width = width;
                canvas.height = height;

                // Рисуем изображение на canvas с растяжением на весь холст
                ctx.drawImage(img, 0, 0, width, height);

                // Преобразуем canvas в Blob (PNG)
                canvas.toBlob(callback, 'image/png', 1);
            };
        };

        reader.readAsDataURL(file);
    }

        function uploadFile() {
            const fileInput = document.getElementById('fileInput');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const email = localStorage.getItem("email"); // Получаем email из localStorage

                if (!email) {
                    alert("Email не найден в localStorage.");
                    return;
                }

                // Изменяем размер изображения
                resizeImage(file, 400, 400, function (resizedBlob) {
                    const formData = new FormData();
                    formData.append('logo', resizedBlob, 'logo.png'); // Добавляем измененное изображение
                    formData.append('email', email); // Добавляем email в FormData

                    fetch('uploadicon.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.text())
                    .then(data => {
                        alert(data);
                        location.reload();
                    })
                    .catch(error => {
                        console.error('Ошибка:', error);
                    });
                });
            }
        }