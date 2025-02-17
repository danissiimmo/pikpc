const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const authButton = document.getElementById('auth-btn');
const errorMsg = document.getElementById('error-msg');
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const captchaContainer = document.createElement('div');
const sessionTimerDisplay = document.createElement('div');
let attemptCounter = parseInt(localStorage.getItem('attempts')) || 0;
let blockTime = parseInt(localStorage.getItem('blockTime')) || 0;
let sessionEndTime = parseInt(localStorage.getItem('sessionEndTime')) || 0;
let token;
let username;
let password;
let interval;

// Стили для таймера
sessionTimerDisplay.style.cssText = `
    position: fixed; top: 10px; left: 10px; background: rgba(0, 0, 0, 0.8); 
    color: white; padding: 5px 10px; font-size: 14px; border-radius: 5px; display: none;
`;
document.body.appendChild(sessionTimerDisplay);

// Добавление капчи
captchaContainer.innerHTML = `
    <label for="captcha-input">Введите капчу: <span id="captcha-text"></span></label>
    <input type="text" id="captcha-input" placeholder="Капча">
`;
captchaContainer.style.display = 'none'; // Скрыто по умолчанию
authContainer.appendChild(captchaContainer);

function generateCaptcha() {
    const captcha = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('captcha-text').textContent = captcha;
    return captcha;
}

function authenticateUser(username, password) {
    const url = 'http://192.168.192.59/сайт/login.php';
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ username, password });

    return fetch(url, { method: 'POST', headers, body })
        .then(response => response.json())
        .then(data => {
            if (data.statusCode === 200 && data.isSuccess) {
                if (token === data.token) {
                    console.log('Токены совпадают.');
                    return true; // Токены совпадают
                } else {
                    console.log('Токены не совпадают. Обновляем токен.');
                    return false; // Токены не совпадают
                }
            } else {
                console.error(`Ошибка авторизации: ${data.message}`);
                return false; // Ошибка авторизации
            }
        })
        .catch(error => {
            console.error('Ошибка соединения с сервером:', error);
            return false; // Ошибка соединения
        });
}


let currentCaptcha = generateCaptcha();

function checkBlockStatus() {
    const now = Date.now();
    if (blockTime && now < blockTime) {
        const remaining = Math.ceil((blockTime - now) / 60000); // Осталось в минутах
        errorMsg.textContent = `Вход заблокирован. Повторите попытку через ${remaining} мин.`;
        return false;
    }

    // Сброс блокировки, если время истекло
    if (blockTime && now >= blockTime) {
        blockTime = 0;
        attemptCounter = 0;
        localStorage.removeItem('blockTime');
        localStorage.setItem('attempts', attemptCounter);
        return true;
    }
    return true;
}

function endSession() {
    clearInterval(interval);
    sessionTimerDisplay.style.display = 'none';
    localStorage.removeItem('authToken');
    alert('Сессия истекла. Авторизуйтесь снова.');
    localStorage.removeItem('sessionEndTime');
    location.reload(); // Перезагрузка страницы
}

function startSessionTimer() {
    interval = setInterval(() => {
        const now = Date.now();
        const remainingTime = Math.max(sessionEndTime - now, 0);
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);

        sessionTimerDisplay.textContent = `Сеанс истекает через: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        sessionTimerDisplay.style.display = 'block';

        if (remainingTime <= 0) {
            endSession();
        }
    }, 1000);
}

const exit_btn = document.getElementById('exit-btn');

// Переключение между меню и редактированием рекламы
exit_btn.addEventListener('click', () => {
    endSession();
});

authButton.addEventListener('click', () => {
    username = usernameField.value;
    password = passwordField.value;
    const captchaInput = document.getElementById('captcha-input').value;

    // Проверка состояния блокировки
    if (!checkBlockStatus()) return;

    // Проверка капчи, если она активирована
    if (captchaContainer.style.display !== 'none' && captchaInput.toUpperCase() !== currentCaptcha) {
        errorMsg.textContent = 'Капча введена неверно.';
        currentCaptcha = generateCaptcha(); // Генерация новой капчи
        return;
    }

    // Отправка данных на сервер для проверки
    fetch('http://192.168.192.59/сайт/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.statusCode === 200 && data.isSuccess) {
            token = localStorage.setItem('authToken', data.token);

            // Успешный вход
            authContainer.classList.remove('active');
            dashboardContainer.classList.add('active');
            errorMsg.textContent = '';
            localStorage.removeItem('attempts');
            attemptCounter = 0;

            sessionEndTime = Date.now() + 720 * 60000;
            localStorage.setItem('sessionEndTime', sessionEndTime);

            startSessionTimer();
        } else {
            // Ошибка входа
            attemptCounter++;
            localStorage.setItem('attempts', attemptCounter);
            errorMsg.textContent = `Ошибка: ${data.message}. Осталось попыток: ${3 - attemptCounter}`;

            if (attemptCounter >= 3) {
                blockTime = Date.now() + 10 * 60000;
                localStorage.setItem('blockTime', blockTime);
                errorMsg.textContent = 'Вход заблокирован на 10 минут.';
            } else {
                // Активируем капчу
                captchaContainer.style.display = 'block';
                currentCaptcha = generateCaptcha();
            }
        }
    })
    .catch(error => {
        errorMsg.textContent = 'Ошибка соединения с сервером.';
        console.error('Ошибка:', error);
    });
});

// Проверка блокировки и активной сессии при загрузке страницы
if (!checkBlockStatus()) {
    captchaContainer.style.display = 'block';
    currentCaptcha = generateCaptcha();
} else if (sessionEndTime > Date.now()) {
    authContainer.classList.remove('active');
    dashboardContainer.classList.add('active');
    startSessionTimer();
}

const editAdsBtn = document.getElementById('edit-ads-btn');
const backBtn = document.getElementById('back-btn');
const editAdsContainer = document.getElementById('edit-ads-container');

// Переключение между меню и редактированием рекламы
editAdsBtn.addEventListener('click', () => {
        dashboardContainer.style.display = 'none';
        editAdsContainer.style.display = 'block';
});

backBtn.addEventListener('click', () => {
    editAdsContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
});

// Обработка загрузки файлов
document.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', event => {
        const file = event.target.files[0];
        const field = event.target.closest('.ad-field');
        const path = field.dataset.path;
        const requiredWidth = parseInt(field.dataset.width);
        const requiredHeight = parseInt(field.dataset.height);

        if (!file) return;

        // Проверка формата
        if (file.type !== 'image/png') {
            alert('Допускаются только файлы формата .png');
            return;
        }

        // Проверка и изменение размеров изображения
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgTemp = new Image();
            imgTemp.onload = function () {
                if (imgTemp.width !== requiredWidth || imgTemp.height !== requiredHeight) {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Установка нужных размеров
                    canvas.width = requiredWidth;
                    canvas.height = requiredHeight;

                    // Масштабируем изображение
                    ctx.drawImage(imgTemp, 0, 0, requiredWidth, requiredHeight);

                    // Конвертируем canvas в Blob для отправки
                    canvas.toBlob(blob => {
                        sendFile(blob);
                    }, 'image/png');
                } else {
                    // Если размеры совпадают, отправляем файл как есть
                    sendFile(file);
                }
            };
            imgTemp.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Функция для отправки файла
        function sendFile(file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('path', path);
            formData.append('width', requiredWidth);
            formData.append('height', requiredHeight);

            fetch('upload.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(`Файл успешно загружен с размерами: ${requiredWidth}x${requiredHeight}`);
                        const img = field.querySelector('img');
                        if (file instanceof Blob) {
                            // Если файл был уменьшен, обновляем превью
                            const url = URL.createObjectURL(file);
                            img.src = url;
                        } else {
                            img.src = URL.createObjectURL(file);
                        }
                    } else {
                        alert(data.error || 'Ошибка загрузки');
                    }
                })
                .catch(err => alert('Ошибка соединения с сервером'));
        }
    });
});

document.getElementById('manage-products-btn').addEventListener('click', () => {
        document.getElementById('manage-products-container').style.display = 'block';
        document.getElementById('dashboard-container').style.display = 'none';
});

function updateRemainingChars(textarea, counterId, maxLength) {
    const remainingChars = maxLength - textarea.value.length;
    document.getElementById(counterId).textContent = `Осталось символов: ${remainingChars}`;
}

function updateCharCount(textarea, counterId, maxLength) {
    const currentLength = textarea.value.length;
    const counter = document.getElementById(counterId);
    counter.textContent = `${currentLength} / ${maxLength}`;
}

// Возврат на панель управления
document.getElementById('back-btn-products').addEventListener('click', () => {
    document.getElementById('manage-products-container').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'block';
});

// Обработчик выбора категории
document.getElementById('category-select').addEventListener('change', (event) => {
    const category = event.target.value;
    updateCharacteristicsFields(category);
});

// Вызов функции для инициализации характеристик при загрузке страницы
window.addEventListener('DOMContentLoaded', function () {
        updateCharacteristics();  // При первой загрузке отображаем характеристики для первой категории
});

// Загрузка данных характеристик из PHP (JSON)
let categoryFilters = {};


// Получаем фильтры через POST-запрос
fetch('http://192.168.192.59/сайт/loadallcharacteristics.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'getCategoryFilters' })
})
    .then(response => response.json())
    .then(data => {
        categoryFilters = data;
    })
    .catch(error => {
        console.error('Ошибка загрузки фильтров:', error);
    });

    document.getElementById('product-images').addEventListener('change', (event) => {
        const files = event.target.files;
        const validFiles = [];
        const dataTransfer = new DataTransfer(); // Создание нового объекта для хранения файлов
        const requiredWidth = 490;
        const requiredHeight = 490;
    
        Array.from(files).forEach((file) => {
            if (!file.name.toLowerCase().endsWith('.png')) {
                alert(`Файл ${file.name} не является изображением .png`);
                return;
            }
    
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width !== requiredWidth || img.height !== requiredHeight) {
                    // Изменение размера изображения
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = requiredWidth;
                    canvas.height = requiredHeight;
                    ctx.drawImage(img, 0, 0, requiredWidth, requiredHeight);
    
                    // Конвертируем canvas в Blob
                    canvas.toBlob((blob) => {
                        const resizedFile = new File([blob], file.name, { type: 'image/png' });
                        validFiles.push(resizedFile);
                        dataTransfer.items.add(resizedFile); // Добавляем измененное изображение
                        updateInput(event, dataTransfer);
                    }, 'image/png');
                } else {
                    validFiles.push(file);
                    dataTransfer.items.add(file); // Добавляем валидное изображение без изменений
                    updateInput(event, dataTransfer);
                }
            };
        });
    
        // Функция для обновления input
        function updateInput(event, dataTransfer) {
            if (validFiles.length === dataTransfer.items.length) {
                event.target.files = dataTransfer.files;
            }
        }
    });    

// Функция для обновления характеристик в зависимости от категории
function updateCharacteristicsFields(category) {
    const container = document.getElementById('characteristics-container');
    container.innerHTML = ''; // Очищаем старые поля

    // Проверка на существующие фильтры для выбранной категории
    if (category && categoryFilters[category]) {
        const filters = categoryFilters[category].filters;
        filters.forEach(filter => {
            const filterHTML = `
                <label for="${filter.title}">${filter.title}:</label>
                <select id="${filter.title}" required>
                    ${filter.options.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
                </select>
            `;
            container.innerHTML += filterHTML;
        });
    }
}

// Обработчик сохранения товара
document.getElementById('save-product-btn').addEventListener('click', async () => {
    const title = document.getElementById('product-title').value;
    const description = document.getElementById('product-description').value;
    const fullDescription = document.getElementById('product-full-description').value;
    const price = document.getElementById('product-price').value;
    const images = document.getElementById('product-images').files;
    const status = document.getElementById('product-status').value;
    const categoryname = document.getElementById('category-select').value;
    const availability = document.getElementById('product-availability').value;
    const quantity = document.getElementById('product-quantity').value;

    // Проверка обязательных полей
    if (!categoryname || !title || !description || !fullDescription || !price || images.length === 0 || !status || !quantity) {
        alert("Пожалуйста, заполните все обязательные поля.");
        return;
    }

    // Проверка на отрицательное значение цены
    if (parseFloat(price) <= 0) {
        alert("Цена должна быть положительным числом.");
        return;
    }

    const characteristics = [];
    let brandname = '';

    const filters = categoryFilters[categoryname]?.filters;
    if (filters) {
        filters.forEach(filter => {
            const value = document.getElementById(filter.title)?.value;
            if (value) {
                if (filter.title.toLowerCase() === 'бренды') {
                    brandname = value;
                } else {
                    characteristics.push({
                        name: filter.title,
                        value: value
                    });
                }
            }
        });
    }

    // Сохранение изображений в папке ./items/productimages/
    const imagePaths = [];
    const uploadPromises = Array.from(images).map((file, index) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('imageName', `productimage_${Date.now()}_${index}.png`);

        // Отправка изображения на сервер с сохранением
        return fetch('http://192.168.192.59/сайт/saveimage.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Добавляем путь к изображению в массив
            imagePaths.push(data.imagePath);
        })
        .catch(error => {
            console.error('Ошибка сохранения изображения:', error);
        });
    });

    // Ожидаем завершения всех загрузок изображений
    try {
        await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Ошибка при загрузке изображений:', error);
        return;
    }

    // Создание объекта товара
    const newProduct = {
        categoryname,
        title,
        brandname,
        quantity,
        description,
        fullDescription,
        price,
        status,
        availability,
        images: imagePaths,
        characteristics
    };

        // Отправка данных товара на сервер
        fetch('http://192.168.192.59/сайт/saveaddproduct.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(data => {
            console.log(newProduct);
            console.log('Товар успешно сохранен:', data);

            resetProductForm();
        })
        .catch(error => {
            console.error('Ошибка отправки данных товара:', error);

            resetProductForm();
        });
});

function resetProductForm() {
    document.getElementById('product-title').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-full-description').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-status').value = '';
    document.getElementById('category-select').value = 'Выберите категорию';  // Сброс категории
    document.getElementById('product-images').value = '';  // Очистка файлов

    // Очистка характеристик
    const container = document.getElementById('characteristics-container');
    container.innerHTML = '';
}


// Обработчик нажатия кнопки "Поиск"
document.getElementById('search-product-btn').addEventListener('click', () => {
    // Получаем значения из полей
    const title = document.getElementById('product-title').value;
    const categoryname = document.getElementById('category-select').value;

    // Проверяем заполнение обязательных полей
    if (!categoryname || !title) {
        alert("Пожалуйста, выберите категорию и введите название товара.");
        return;
    }

    // Формируем объект для отправки на сервер
    const searchData = {
        categoryname: categoryname,
        title: title
    };

    // Логируем данные перед отправкой
    console.log("Поиск по данным:", searchData);

    // Отправляем POST-запрос на сервер
    fetch('http://192.168.192.59/сайт/testproduct.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(searchData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Результаты поиска:", data);

        // Заполняем поля автоматически из ответа
        document.getElementById('product-description').value = data.description || "";
        document.getElementById('product-full-description').value = data.fullDescription || "";
        document.getElementById('product-price').value = data.price || "";
        document.getElementById('product-quantity').value = data.quantity || "";
        document.getElementById('product-status').value = data.status || "discount";
        document.getElementById('product-availability').value = data.availability || "instock";

        // Загрузка файлов в поле (если есть изображения)
        const fileInput = document.getElementById('product-images');
        if (data.images && Array.isArray(data.images)) {
            // Конвертируем изображения в файлы и загружаем их в поле
            const files = data.images.map(imageUrl => {
                // Создаем объект File для каждого изображения
                const file = new File([imageUrl], imageUrl.split('/').pop(), { type: 'image/jpeg' });
                return file;
            });

            // Присваиваем файлы полю
            const dataTransfer = new DataTransfer();
            files.forEach(file => dataTransfer.items.add(file));
            fileInput.files = dataTransfer.files;
        }

        // Заполняем характеристики в уже существующие поля
        const characteristicsContainer = document.getElementById('characteristics-container');
        if (data.characteristics && Array.isArray(data.characteristics)) {
            data.characteristics.forEach(char => {
                // Находим соответствующее поле для характеристики
                const characteristicField = document.getElementById(char.name);
                if (characteristicField) {
                    // Если поле существует, выбираем нужное значение
                    characteristicField.value = char.value;
                }
            });
        }
    })
    .catch(error => {
        console.error("Ошибка при выполнении поиска:", error);
        alert("Произошла ошибка при загрузке данных.");
    });
});



document.getElementById('edit-email-btn').addEventListener('click', () => {
    document.getElementById('dashboard-container').style.display = 'none';
    document.getElementById('edit-email-container').style.display = 'block';

});

// Возврат на панель управления
document.getElementById('back-btn-email').addEventListener('click', () => {
document.getElementById('edit-email-container').style.display = 'none';
document.getElementById('dashboard-container').style.display = 'block';
});

document.getElementById('edit-email-btn-load').addEventListener('click', () => {
const emailEdit = document.getElementById('edit-email-title').value.trim();

console.log(emailEdit);

fetch('update-email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({emailEdit})
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('edit-result').innerText = data.message;
            document.getElementById('edit-email-title').value = '';
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
});


document.getElementById('edit-contacts-btn').addEventListener('click', () => {
    document.getElementById('dashboard-container').style.display = 'none';
    document.getElementById('edit-contacts-container').style.display = 'block';

});

// Возврат на панель управления
document.getElementById('back-btn-contacts').addEventListener('click', () => {
document.getElementById('edit-contacts-container').style.display = 'none';
document.getElementById('dashboard-container').style.display = 'block';
});

document.getElementById('edit-contacts-btn-load').addEventListener('click', () => {
    const techcontactsEdit = document.getElementById('edit-contacts-title').value.trim();
    const info = 'support';

    fetch('updatelinks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify( {techcontactsEdit, info} )
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('edit-result-contacts').innerText = data.message;
                document.getElementById('edit-contacts-title').value = '';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });

document.getElementById('edit-contactsvk-btn-load').addEventListener('click', () => {
    const vkcontactsEdit = document.getElementById('edit-contactsvk-title').value.trim();
    const info = 'vk';

    fetch('updatelinks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify( {vkcontactsEdit, info} )
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('edit-result-contactsvk').innerText = data.message;
                document.getElementById('edit-contactsvk-title').value = '';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });

document.getElementById('edit-contactstg-btn-load').addEventListener('click', () => {
    const tgcontactsEdit = document.getElementById('edit-contactstg-title').value.trim();
    const info = 'tg';

    fetch('updatelinks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify( {tgcontactsEdit, info} )
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('edit-result-contactstg').innerText = data.message;
                document.getElementById('edit-contactstg-title').value = '';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });

document.getElementById('edit-contactswt-btn-load').addEventListener('click', () => {
    const wtcontactsEdit = document.getElementById('edit-contactswt-title').value.trim();
    const info = 'wt';

    fetch('updatelinks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify( {wtcontactsEdit, info} )
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('edit-result-contactswt').innerText = data.message;
                document.getElementById('edit-contactswt-title').value = '';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });

document.getElementById('edit-contactstime-btn-load').addEventListener('click', () => {
    const timecontactsEdit = document.getElementById('edit-contactstime-title').value.trim();
    const info = 'time';

    fetch('updatelinks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify( {timecontactsEdit, info} )
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('edit-result-contactstime').innerText = data.message;
                document.getElementById('edit-contactstime-title').value = '';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });

document.getElementById('edit-contactsphone-btn-load').addEventListener('click', () => {
    const phonecontactsEdit = document.getElementById('edit-contactsphone-title').value.trim();
    const info = 'phone';

    fetch('updatelinks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify( {phonecontactsEdit, info} )
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('edit-result-contactsphone').innerText = data.message;
                document.getElementById('edit-contactsphone-title').value = '';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });

document.getElementById('edit-contactsreturn-btn-load').addEventListener('click', () => {
    const returncontactsEdit = document.getElementById('edit-contactsreturn-title').value.trim();
    const info = 'return';

    fetch('updatelinks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify( {returncontactsEdit, info} )
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('edit-result-contactsreturn').innerText = data.message;
                document.getElementById('edit-contactsreturn-title').value = '';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });

document.getElementById('edit-contactsadres-btn-load').addEventListener('click', () => {
    const textadrescontactsEdit = document.getElementById('edit-contactstextadres-title').value.trim();
    const hrefadrescontactsEdit = document.getElementById('edit-contactshrefadres-title').value.trim();
    const hrefmapadrescontactsEdit = document.getElementById('edit-contactshrefmapadres-title').value.trim();
    const info = 'adress';

        // Проверка на пустые поля
        if (!textadrescontactsEdit || !hrefadrescontactsEdit || !hrefmapadrescontactsEdit) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        // Создаем объект с данными формы
        const formData = {
            textAdress: textadrescontactsEdit,
            hrefAdress: hrefadrescontactsEdit,
            hrefmapAdress: hrefmapadrescontactsEdit,
            info: info
        };

    fetch('updatelinks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('edit-result-contactsadres').innerText = data.message;
                document.getElementById('edit-contactstextinfo-title').value = '';
                document.getElementById('edit-contactshrefadres-title').value = '';
                document.getElementById('edit-contactshrefmapadres-title').value = '';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });

document.getElementById('edit-contactstextinfo-btn-load').addEventListener('click', () => {
    const textinfocontactsEdit = document.getElementById('edit-contactstextinfo-title').value.trim();
    const info = 'textinfo';

    fetch('updatelinks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({textinfocontactsEdit, info})
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('edit-result-contactstextinfo').innerText = data.message;
                document.getElementById('edit-contactstextinfo-title').value = '';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });




// Переход к разделу "Проверка заказа"
document.getElementById('check-orderlist-btn').addEventListener('click', () => {
    document.getElementById('dashboard-container').style.display = 'none';
    document.getElementById('check-order-container').style.display = 'block';
});

// Возврат на панель управления
document.getElementById('back-btn-checkorder').addEventListener('click', () => {
    document.getElementById('check-order-container').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'block';
});

// Обработка поиска и отображения данных в таблице
document.getElementById('check-order-btn').addEventListener('click', () => {
    const checkOrder = document.getElementById('check-order-list').value.trim();

    console.log("checkorder ", checkOrder);
    // Отправка POST-запроса
    fetch('http://192.168.192.59/сайт/order-list.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Убедитесь, что переменная token определена
        },
        body: JSON.stringify({ query: checkOrder }) // Обернули checkOrder в объект
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ошибка: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Если данные обернуты в объект, извлекаем массив
            const results = data;

            console.log("results ", results);

            if (!Array.isArray(results) || results.length === 0) {
                document.getElementById('order-result').innerHTML = "<p>Результаты не найдены</p>";
                return;
            }
            renderTable(results); // Функция для отображения таблицы
        })
        .catch(error => {
            console.error('Ошибка:', error);
            document.getElementById('order-result').innerHTML = `<p>Ошибка: ${error.message}</p>`;
        });
});

// Функция для отображения данных в виде таблицы
function renderTable(data) {
    let tableHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Телефон</th>
                    <th>
                        ФИО
                        <button id="sort-name">Сортировать</button>
                    </th>
                    <th>URL</th>
                    <th>
                    Дата/Время
                    <button id="sort-datetime">Сортировать</button>
                    </th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach((item, index) => {
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.phone}</td>
                <td>${item.name}</td>
                <td>${item.url}</td>
                <td>${item.datetime}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    document.getElementById('order-result').innerHTML = tableHTML;

    // Добавляем обработчик для сортировки
    document.getElementById('sort-name').addEventListener('click', () => {
        const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
        renderTable(sortedData); // Перерисовываем таблицу
    });

    document.getElementById('sort-datetime').addEventListener('click', () => {
        const sortedData = [...data].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
        renderTable(sortedData); // Перерисовываем таблицу
    });    
}







document.getElementById('delete-products-btn').addEventListener('click', () => {
        document.getElementById('dashboard-container').style.display = 'none';
        document.getElementById('delete-products-container').style.display = 'block';
});

// Возврат на панель управления
document.getElementById('back-btn-delete').addEventListener('click', () => {
    document.getElementById('delete-products-container').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'block';
});

document.getElementById('delete-product-btn').addEventListener('click', () => {
    const title = document.getElementById('product-delete-title').value.trim();
    
    if (title) {
        fetch('http://192.168.192.59/сайт/delete_product.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('delete-result').innerText = data.success;
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    } else {
        alert('Введите название товара.');
    }
});



const maintenanceBtn = document.getElementById('maintenance-btn');

// Проверка текущего состояния
fetch('maintenance.php')
    .then(response => response.json())
    .then(data => {
        if (data.is_under_maintenance) {
            maintenanceBtn.textContent = 'Завершить технические работы';
        } else {
            maintenanceBtn.textContent = 'Закрыть сайт на техническое обслуживание';
        }
    });

// Обработка нажатия кнопки
maintenanceBtn.addEventListener('click', () => {
    const isUnderMaintenance = maintenanceBtn.textContent.includes('Закрыть');
        fetch('maintenance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_under_maintenance: isUnderMaintenance })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                maintenanceBtn.textContent = isUnderMaintenance
                    ? 'Завершить технические работы'
                    : 'Закрыть сайт на техническое обслуживание';
            } else {
                alert('Ошибка обновления статуса');
            }
        });
});

// Создаём переменную для хранения ссылки на плашку
let maintenanceBanner;
    // Проверка текущего состояния
    fetch('maintenance.php')
        .then(response => response.json())
        .then(data => {
            if (data.is_under_maintenance) {
                showBanner(); // Показать плашку, если сайт в режиме обслуживания
            }
        });

// Функция для показа плашки
function showBanner() {
    if (!maintenanceBanner) { // Создаем только если плашки нет
        maintenanceBanner = document.createElement('div');
        maintenanceBanner.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; 
            background-color: red; color: white; text-align: center; 
            padding: 10px; font-size: 18px; z-index: 1000;`;
        maintenanceBanner.textContent = 'Сайт закрыт на техническое обслуживание';
        document.body.prepend(maintenanceBanner);
    }
}

// Функция для скрытия плашки
function hideBanner() {
    if (maintenanceBanner) {
        maintenanceBanner.remove(); // Удаляем элемент
        maintenanceBanner = null;  // Сбрасываем переменную
    }
}

// Обработка нажатия кнопки
maintenanceBtn.addEventListener('click', () => {
    const isUnderMaintenance = maintenanceBtn.textContent.includes('Закрыть');
        fetch('maintenance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_under_maintenance: isUnderMaintenance })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                maintenanceBtn.textContent = isUnderMaintenance
                    ? 'Завершить технические работы'
                    : 'Закрыть сайт на техническое обслуживание';

                // Динамическое управление плашкой
                if (isUnderMaintenance) {
                    showBanner(); // Показываем плашку
                } else {
                    hideBanner(); // Убираем плашку
                }

            } else {
                alert('Ошибка обновления статуса');
            }
        });
});



document.getElementById('edit-attributes-btn').addEventListener('click', function() { 
        document.getElementById('dashboard-container').style.display = 'none';
        document.getElementById('attribute-editor-container').style.display = 'block';
        // Инициализация
        loadData();
});

document.getElementById('back-btn-attributes').addEventListener('click', function() {
    document.getElementById('attribute-editor-container').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'block'; 
});

document.getElementById('save-attributes-btn').addEventListener('click', function() {
    saveAttributes();
});


function loadData() {
        fetch('http://192.168.192.59/сайт/attributes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => renderCategories(data))
        .catch(error => console.error('Error loading data:', error));
}

function renderCategories(data) {
    const categoriesContainer = document.getElementById('attribute-categories');
    categoriesContainer.innerHTML = '';

    Object.keys(data).forEach(category => {
        const categoryData = data[category];
        
        // Создаем элемент категории
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('attribute-category');
        categoryElement.innerHTML = `
            <h3 class="category-title">${category}</h3>
            <div class="attribute-list" style="display: none;"></div>
            <button class="add-attribute-btn" style="display: none;">Добавить атрибут</button>
        `;
        
        const attributeList = categoryElement.querySelector('.attribute-list');
        const addAttributeButton = categoryElement.querySelector('.add-attribute-btn');
        
        categoryData.filters.forEach(attribute => {
            const attributeElement = createAttributeElement(attribute);
            attributeList.appendChild(attributeElement);
        });

        // Показать кнопку добавления атрибута при клике на категорию
        categoryElement.querySelector('.category-title').addEventListener('click', function() {
            const isVisible = attributeList.style.display === 'block';
            attributeList.style.display = isVisible ? 'none' : 'block';
            addAttributeButton.style.display = isVisible ? 'none' : 'block'; // Показать/скрыть кнопку
        });

        // Добавить обработчик для кнопки добавления атрибута
        addAttributeButton.addEventListener('click', function() {
            const newAttribute = {
                title: "Новый атрибут", // Начальное название атрибута
                options: [] // Пустые опции
            };
            const newAttributeElement = createAttributeElement(newAttribute);
            attributeList.appendChild(newAttributeElement);
        });

        categoriesContainer.appendChild(categoryElement);
    });
}

function removeCyrillic(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[А-Яа-яЁё]/g, ''); // Удаляет все символы кириллицы
}

function createAttributeElement(attribute) {
    const attributeElement = document.createElement('div');
    attributeElement.classList.add('attribute-item');
    attributeElement.innerHTML = `
        <div class="attribute-header">
            <input type="text" value="${attribute.title}" class="attribute-title-input" />
            <button class="remove-attribute-btn">Удалить</button>
        </div>
        <div class="options-list">
            ${attribute.options.map(option => ` 
                <div class="option-item">
                    <input type="text" value="${option.label}" />
                    <input type="text" value="${option.value}" />
                    <button class="remove-option-btn">Удалить</button>
                </div>
            `).join('')}
            <button class="add-option-btn">Добавить характеристику</button>
        </div>
    `;

    // Обработчик удаления атрибута
    attributeElement.querySelector('.remove-attribute-btn').addEventListener('click', function() {
        attributeElement.remove();
    });

    // Обработчик добавления новой опции
    attributeElement.querySelector('.add-option-btn').addEventListener('click', function() {
        const optionItem = document.createElement('div');
        optionItem.classList.add('option-item');
        optionItem.innerHTML = `
            <input type="text" placeholder="Label" />
            <input type="text" placeholder="Value" />
            <button class="remove-option-btn">Удалить</button>
        `;
        optionItem.querySelector('.remove-option-btn').addEventListener('click', function() {
            optionItem.remove();
        });

        // Добавляем характеристику в конец списка
        const optionsList = attributeElement.querySelector('.options-list');
        optionsList.appendChild(optionItem);

        // Перемещаем кнопку добавления в конец списка
        const addButton = attributeElement.querySelector('.add-option-btn');
        optionsList.appendChild(addButton);
    });

    // Обработчик удаления существующих строк опций
    const removeOptionButtons = attributeElement.querySelectorAll('.remove-option-btn');
    removeOptionButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.target.closest('.option-item').remove();
        });
    });

    // Делегирование события на родительский элемент для удаления кириллицы в input[type="text"]
    attributeElement.querySelector('.options-list').addEventListener('input', function(event) {
        if (event.target && event.target.matches('input[type="text"]:nth-child(2)')) {
            removeCyrillic(event);
        }
    });

    return attributeElement;
}

function saveAttributes() {
    const categories = document.querySelectorAll('.attribute-category');
    const data = {};

    categories.forEach(category => {
        const categoryTitle = category.querySelector('.category-title').textContent;
        const attributeList = category.querySelector('.attribute-list');
        const filters = [];

        const attributeItems = attributeList.querySelectorAll('.attribute-item');
        attributeItems.forEach(attributeItem => {
            const title = attributeItem.querySelector('.attribute-title-input').value;
            const options = [];

            const optionItems = attributeItem.querySelectorAll('.option-item');
            optionItems.forEach(optionItem => {
                const label = optionItem.querySelector('input[type="text"]:nth-child(1)').value;
                const value = optionItem.querySelector('input[type="text"]:nth-child(2)').value;
                options.push({ label, value });
            });

            filters.push({ title, options });
        });

        data[categoryTitle.toLowerCase()] = { filters };
    });

    console.log(JSON.stringify(data, null, 4));

    // Преобразуем данные в формат JSON и отправляем на сервер
    fetch('http://192.168.192.59/сайт/attributes.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(responseData => {
        alert('Данные успешно сохранены');
        console.log('Данные успешно сохранены', responseData);
    })
    .catch(error => console.error('Ошибка при сохранении данных:', error));
}
