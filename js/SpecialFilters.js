document.addEventListener('DOMContentLoaded', () => {
    const minPriceInput = document.getElementById('minprice');
    const maxPriceInput = document.getElementById('maxprice');
    const minSlider = document.getElementById('price-slider-min');
    const maxSlider = document.getElementById('price-slider-max');
    const sliderTrack = document.querySelector('.slider-track');
    const filtersContainer = document.getElementById('filters-container');
    const sortingOptions = document.querySelectorAll('.sorting-option');
    const maxValue = parseInt(maxSlider?.max || 0);

    let currentURL;

    const params = new URLSearchParams(window.location.search);

    const category = params.keys().next().value;
    console.log('Категория',category);

    let attributedtos = []; // Сюда будем записывать атрибуты
    let branddtos = []; // Сюда будем записывать бренды

    let categoryFilters = {};

    fetch('http://192.168.192.59/сайт/load.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: category })
    })
    .then(response => response.json())
    .then(data => {

        console.log('Brands:', data.brands);
        console.log('Attributes:', data.attributes);
        
        // Обновление categoryFilters данными из PHP
        Object.keys(data).forEach(category => {
            categoryFilters[category] = {
                brands: data[category].brands,
                attributes: data[category].attributes
            };
        });
        
        console.log('Обновленные категории:', categoryFilters);
        
    let activeFilters = {};

    // Установить "По популярности" активным по умолчанию
    let activeSort = params.get('sort') || null; // По умолчанию "null"

    // Активируем соответствующую опцию сортировки при загрузке страницы
    sortingOptions.forEach(option => {
        if (option.dataset.sort === activeSort) {
            option.classList.add('active');
        } else if (!activeSort && option.dataset.sort === 'popularity') {
            option.classList.add('active'); // Если параметр sort отсутствует, ставим активной опцию "по популярности"
        }
    });

    // Обработчик клика для переключения активного состояния сортировки
    sortingOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Снимаем класс active со всех надписей
            sortingOptions.forEach(item => item.classList.remove('active'));
    
            // Добавляем класс active к текущему элементу
            option.classList.add('active');
    
            // Обновляем сортировку в URL
            updateSortingInURL(option.dataset.sort);
        });
    });

    function updateSliderTrack() {
        const minValue = parseInt(minSlider.value);
        const maxValueSlider = parseInt(maxSlider.value);
        const percentageMin = ((minValue - minSlider.min) / (maxSlider.max - minSlider.min)) * 100;
        const percentageMax = ((maxValueSlider - minSlider.min) / (maxSlider.max - minSlider.min)) * 100;

        sliderTrack.style.left = `${percentageMin}%`;
        sliderTrack.style.width = `${percentageMax - percentageMin}%`;
    }

    function updateInputsFromSliders() {
        const minValue = parseInt(minSlider.value);
        const maxValueSlider = parseInt(maxSlider.value);

        if (minValue > maxValueSlider) {
            minSlider.value = maxValueSlider;
        }

        minPriceInput.value = minSlider.value;
        maxPriceInput.value = maxSlider.value;

        updateSliderTrack();
    }

    function updateSlidersFromInputs() {
        let minValue = parseInt(minPriceInput.value) || 0;
        let maxValueSlider = parseInt(maxPriceInput.value) || maxValue;

        if (minValue < 0) minValue = 0;
        if (minValue > maxValue) minValue = maxValue;
        if (maxValueSlider < 0) maxValueSlider = 0;
        if (maxValueSlider > maxValue) maxValueSlider = maxValue;

        if (minValue > maxValueSlider) {
            minValue = maxValueSlider;
        }

        minPriceInput.value = minValue;
        maxPriceInput.value = maxValueSlider;

        minSlider.value = minValue;
        maxSlider.value = maxValueSlider;

        updateSliderTrack();
    }

    filtersContainer.addEventListener('click', (event) => {
        // Проверяем, был ли клик по чекбоксу
        if (event.target.classList.contains('checkbox')) {
            event.target.classList.toggle('active');
            updateFiltersInURL(); // Обновление URL при выборе фильтра
            //window.location.reload();
        }
    });

    minSlider?.addEventListener('input', updateInputsFromSliders);
    maxSlider?.addEventListener('input', updateInputsFromSliders);
    minPriceInput?.addEventListener('input', updateSlidersFromInputs);
    maxPriceInput?.addEventListener('input', updateSlidersFromInputs);

    minPriceInput?.addEventListener('blur', updateSlidersFromInputs);
    maxPriceInput?.addEventListener('blur', updateSlidersFromInputs);

    updateSliderTrack();

    fetch('js/json/SortedFilters.json')
        .then(response => response.json())
        .then(data => {
            const categoryFilters = data[category];
            if (categoryFilters) {
                categoryFilters.filters.forEach(filter => {
                    const filterBlock = document.createElement('div');
                    filterBlock.classList.add('filter-block');

                    const filterTitle = document.createElement('div');
                    filterTitle.classList.add('filter-title');
                    filterTitle.textContent = filter.title;

                    const filterOptions = document.createElement('div');
                    filterOptions.classList.add('filter-options');
                    filterOptions.style.display = 'none';

                    filter.options.forEach(option => {
                        const filterOption = document.createElement('div');
                        filterOption.classList.add('filter-option');

                        const checkbox = document.createElement('div');
                        checkbox.classList.add('checkbox');
                        checkbox.setAttribute('data-filter', option.value);

                        // Проверка, был ли уже этот фильтр в URL
                        if (params.has(option.value)) {
                            checkbox.classList.add('active');
                        }

                        const span = document.createElement('span');
                        span.textContent = option.label;

                        filterOption.appendChild(checkbox);
                        filterOption.appendChild(span);
                        filterOptions.appendChild(filterOption);
                    });

                    filterTitle.addEventListener('click', () => {
                        const isVisible = filterOptions.style.display === 'block';
                        filterOptions.style.display = isVisible ? 'none' : 'block';
                    });

                    filterBlock.appendChild(filterTitle);
                    filterBlock.appendChild(filterOptions);
                    filtersContainer.appendChild(filterBlock);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки фильтров:', error);
        });

    // Функция для обновления URL с выбранными фильтрами
    function updateFiltersInURL() {
        const newParams = new URLSearchParams(window.location.search);
    
        // Добавляем активные фильтры
        const checkboxes = filtersContainer.querySelectorAll('.checkbox');
        checkboxes.forEach(checkbox => {
            const filterId = checkbox.getAttribute('data-filter');
            if (checkbox.classList.contains('active')) {
                newParams.set(filterId, true);
            } else {
                newParams.delete(filterId);
            }
        });

        attributedtos = Array.from(newParams.keys()).filter(key => categoryFilters[category]?.attributes.includes(key));
        branddtos = Array.from(newParams.keys()).filter(key => categoryFilters[category]?.brands.includes(key));
    
        // Добавляем значения слайдера
        const minValue = minSlider.value;
        const maxValue = maxSlider.value;
    
        // Записываем минимальную цену
        newParams.set('minprice', minValue);
    
        // Записываем максимальную цену
        newParams.set('maxprice', maxValue);
    
        // Обновляем адресную строку без перезагрузки страницы
        window.history.replaceState({}, '', '?' + newParams.toString());

        sendFiltersToServer();
    }

    // Функция для обновления сортировки в URL
    function updateSortingInURL(sortBy) {
        const newParams = new URLSearchParams(window.location.search);

        // Записываем параметр сортировки
        newParams.set('sort', sortBy);

        // Обновляем адресную строку без перезагрузки страницы
        window.history.replaceState({}, '', '?' + newParams.toString());

        sendFiltersToServer();
        window.location.reload();
    }
    
    // Обновление URL при изменении значений слайдеров или инпутов
    function handleSliderInput() {
        updateInputsFromSliders(); // Синхронизация инпутов
        updateFiltersInURL(); // Обновление URL
        window.location.reload();
    }
    
    // Привязываем события
    minSlider.addEventListener('change', handleSliderInput);
    maxSlider.addEventListener('change', handleSliderInput);
    minPriceInput.addEventListener('change', () => {
        updateSlidersFromInputs(); // Синхронизация слайдеров
        updateFiltersInURL(); // Обновление URL
        window.location.reload();
    });
    maxPriceInput.addEventListener('change', () => {
        updateSlidersFromInputs(); // Синхронизация слайдеров
        updateFiltersInURL(); // Обновление URL
        window.location.reload();
    });
    
    // Сохранение состояния слайдера при загрузке страницы
    function initSliderValues() {
        const minPrice = params.get('minprice');
        const maxPrice = params.get('maxprice');
    
        if (minPrice) {
            minSlider.value = minPrice;
            minPriceInput.value = minPrice;
        }
        if (maxPrice) {
            maxSlider.value = maxPrice;
            maxPriceInput.value = maxPrice;
        }
    
        updateSliderTrack();
    }
    
    // Инициализируем состояние слайдеров после загрузки
    initSliderValues();

    // Инициализация активных фильтров при загрузке страницы
    function initActiveFilters() {
        const category = params.keys().next().value; // Получаем текущую категорию из URL
        
        const currentCategoryFilters = categoryFilters[category];
        if (!currentCategoryFilters) return;
    
        params.forEach((value, key) => {
            if (currentCategoryFilters.brands.includes(key) && !branddtos.includes(key)) {
                branddtos.push(key);
            } else if (currentCategoryFilters.attributes.includes(key) && !attributedtos.includes(key)) {
                attributedtos.push(key);
            }
        });
    
        branddtos = branddtos.filter(filter => params.has(filter));
        attributedtos = attributedtos.filter(filter => params.has(filter));
    
        console.log('AttributeDTOs:', attributedtos);
        console.log('BrandDTOs:', branddtos);
    
        const checkboxes = filtersContainer.querySelectorAll('.checkbox');
        checkboxes.forEach(checkbox => {
            const filterId = checkbox.getAttribute('data-filter');
            if (params.has(filterId)) {
                checkbox.classList.add('active');
                console.log(`Фильтр ${filterId} активирован из URL`);
            }
        });
    }    

    function getActiveFilters() {
    
        // Сортировка
        const activeSort = document.querySelector('.sorting-option.active');
        if (activeSort) {
            activeFilters.sort = activeSort.dataset.sort;
        }
    
        const category = params.keys().next().value; // Получаем текущую категорию из URL
    const currentCategoryFilters = categoryFilters[category] || {};

    const stockCategories = ['instock', 'preorderlater', 'preordertomorrow'];
    const statusCategories = ['discount', 'damagedpackage', 'minordefects'];
    
    activeFilters = {
        availability: [],
        status: [],
        AttributeDTOs: [...attributedtos],
        BrandDTOs: [...branddtos]
    };
    
    const checkboxes = filtersContainer.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        if (checkbox.classList.contains('active')) {
            const filterId = checkbox.getAttribute('data-filter');

            if (stockCategories.includes(filterId)) {
                activeFilters.availability.push(filterId);
            } else if (statusCategories.includes(filterId)) {
                activeFilters.status.push(filterId);
            }
            else if (currentCategoryFilters.brands?.includes(filterId)) {
                if (!activeFilters.BrandDTOs.includes(filterId)) {
                    activeFilters.BrandDTOs.push(filterId);
                }
            } else if (currentCategoryFilters.attributes?.includes(filterId)) {
                if (!activeFilters.AttributeDTOs.includes(filterId)) {
                    activeFilters.AttributeDTOs.push(filterId);
                }
            }
        }
    });
    
        // Значения слайдеров
        const minPrice = minSlider.value;
        const maxPrice = maxSlider.value;
        activeFilters['minprice'] = minPrice;
        activeFilters['maxprice'] = maxPrice;
    
        return activeFilters;
    }    

    initSliderValues();
    initActiveFilters();

    let currentIndex = 5; // Начальный индекс для следующих товаров

    function sendFiltersToServer() {
        const filters = getActiveFilters();
        const category = params.keys().next().value; // Получаем категорию из URL
    
        filters.CategoryDTO = { Name: category }; // Добавляем категорию в фильтры
    
        console.log('filters', filters);
        fetch('http://192.168.192.59/сайт/get-card-products.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Данные успешно получены:', data);
    
            const container = document.querySelector('.main-items-section');
            const showMoreButton = document.getElementById('show-more');
            const productCountElement = document.querySelector('.product-count');
    
            if (!container) {
                console.error('Контейнер для карточек не найден.');
                return;
            }
    
            container.innerHTML = ''; // Очищаем контейнер
            currentIndex = 5; // Сбрасываем индекс при обновлении фильтров
            const products = data.data;
    
            if (products && Array.isArray(products)) {
                const totalProducts = products.length;
                if (productCountElement) {
                    productCountElement.textContent = `${totalProducts} товаров`;
                }
    
                renderProductCards(products.slice(0, 5), container); // Показываем первые 5 товаров
    
                if (products.length > 5) {
                    showMoreButton.style.display = 'block';
                } else {
                    showMoreButton.style.display = 'none';
                }
    
                showMoreButton.onclick = () => {
                    // Подгружаем следующие 5 товаров
                    const nextProducts = products.slice(currentIndex, currentIndex + 5);
                    renderProductCards(nextProducts, container);
    
                    // Обновляем текущий индекс
                    currentIndex += 5;
    
                    if (currentIndex >= products.length) {
                        showMoreButton.style.display = 'none'; // Скрываем кнопку, если товаров больше нет
                    }
                };
    
                container.addEventListener('click', (event) => {
                    const target = event.target;
                    const card = target.closest('.product-card-main');
                    if (card && !target.closest('.order-button-main') && !target.closest('.compare-prices-main')) {
                        const productId = card.getAttribute('data-id');
                        if (productId) {
                            window.location.href = `product.html?id=${productId}`;
                        }
                    }
                });
    
            } else {
                console.warn('Нет данных товаров для отображения.');
            }
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
    }
    
    function renderProductCards(products, container) {
        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card-main');
            if (product.id !== undefined) {
                card.setAttribute('data-id', product.id.toString());
            }

            let status = 'Дисконт';

            if (product.productStatus === 'discount') {
                status = 'Дисконт';
            }
            else if (product.productStatus === 'damagedpackage') {
                status = 'П/У';
            }
            else if (product.productStatus === 'minordefects') {
                status = 'Мелкие дефекты';
            }
    
            card.innerHTML = `
                <img src="${product.image || 'items/filters/no-image.png'}" alt="Товар" class="product-image">
                <div class="product-separator-main"></div>
                <p class="product-name-main">${product.productName}</p>
                <div class="product-price-container-main">
                    <span class="product-price-main">${product.price.toLocaleString('ru-RU')} ₽</span>
                    <button class="order-button-main">Оформить заказ</button>
                </div>
                <div class="compare-prices-wrapper">
                    <span class="compare-status-main">${status}</span>
                    <span class="compare-prices-main" data-product-name="${product.productName}">Сравнить цены</span>
                </div>
            `;
            container.appendChild(card);
        });
    
        const compareButtons = container.querySelectorAll('.compare-prices-main');
        compareButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const productName = button.getAttribute('data-product-name');
                const sanitizedProductName = productName
                .replace(/["'']/g, '')  // Удаляем кавычки
                .replace(/\s+/g, ' ') // Убираем лишние пробелы
                .trim();              // Убираем пробелы по краям
                console.log("sanitized", sanitizedProductName);
                const yandexMarketURL = `https://market.yandex.ru/search?text=${encodeURIComponent(sanitizedProductName)}`;
                window.open(yandexMarketURL, '_blank');
            });
        });
        function showStatusInfo(statusText) {
            let statusCard = document.querySelector('.status-card');
            let overlay = document.querySelector('.overlay');
        
            // Если слой затемнения еще не создан, создаем его
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('overlay');
                document.body.appendChild(overlay);
            }
        
            // Если карточка еще не создана, создаем её
            if (!statusCard) {
                statusCard = document.createElement('div');
                statusCard.classList.add('status-card');
        
                statusCard.innerHTML = `
                    <div class="status-card-content">
                        <span class="close-status-card">&times;</span>
                        <p class="status-message">${statusText}</p>
                        <button class="call-button">Позвонить</button>
                    </div>
                `;
                document.body.appendChild(statusCard);
            }
        
            // Устанавливаем текст в карточке
            statusCard.querySelector('.status-message').textContent = statusText;
        
            // Показываем карточку и слой затемнения
            statusCard.style.display = 'block';
            overlay.style.display = 'block';
        
            // Обработчик закрытия карточки по крестику
            statusCard.querySelector('.close-status-card').addEventListener('click', closeStatusCard);
        
            // Закрытие при клике на затемненный слой
            overlay.addEventListener('click', closeStatusCard);
        
            function closeStatusCard() {
                statusCard.style.display = 'none';
                overlay.style.display = 'none';
            }
            // Обработчик кнопки Позвонить
            statusCard.querySelector('.call-button').addEventListener('click', () => {
                window.location.href = 'tel:+79812104831';
            });
        }
        
        // Добавляем обработчик на элементы с классом compare-status-main
        document.querySelectorAll('.compare-status-main').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const productStatus = button.textContent.trim();
        
                let statusText = '';
                if (productStatus === 'Дисконт') {
                    statusText = 'Этот товар имеет скидку и продается по акционной цене. +79812104831';
                } else if (productStatus === 'П/У') {
                    statusText = 'Этот товар имеет поврежденную упаковку.';
                } else if (productStatus === 'Мелкие дефекты') {
                    statusText = 'Этот товар имеет незначительные дефекты.';
                }
        
                showStatusInfo(statusText);
            });
        });        

        function showOrderConfirmation() {
            let orderCard = document.querySelector('.order-card');
            let overlay = document.querySelector('.overlay');
        
            // Если слой затемнения еще не создан, создаем его
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('overlay');
                document.body.appendChild(overlay);
            }
        
            // Если карточка еще не создана, создаем её
            if (!orderCard) {
                orderCard = document.createElement('div');
                orderCard.classList.add('order-card');
            
                orderCard.innerHTML = `
                    <div class="order-card-content">
                        <span class="close-order-card">&times;</span>
                        <p class="order-phone">Для завершения оформления заказа оставьте свой номер телефона или свяжитесь с менеджером по телефону: <span>8 (981) 210-48-31</span></p>
                        <input type="tel" class="phone-input" placeholder="+7XXXXXXXXXX" maxlength="12" oninput="if (!this.value.startsWith('+7')) this.value = '+7' + this.value.replace(/[^0-9]/g, '').slice(2); else this.value = '+7' + this.value.slice(2).replace(/[^0-9]/g, '');" />
                        <input type="name" class="name-input" placeholder="Введите ФИО" maxlength="50"/>
                        <button class="submit-button">Отправить</button>
                        <button class="call-button">Позвонить</button>
                    </div>
                `;
                document.body.appendChild(orderCard);

                // Закрытие окна по клику на крестик
                orderCard.querySelector('.close-order-card').addEventListener('click', () => {
                    orderCard.style.display = 'none';
                });

                // Обработчик для кнопки "Отправить"
                orderCard.querySelector('.submit-button').addEventListener('click', () => {
                    let phoneInput = orderCard.querySelector('.phone-input').value.trim();
                    let nameInput = orderCard.querySelector('.name-input').value.trim();

                    if (phoneInput.length === 12) {                    
                        // Первый запрос для проверки почты
                        fetch('get-email.php', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        .then(response => response.json()) // Парсим JSON-ответ
                        .then(data => {
                            if (data?.email) { // Проверяем email из ответа
                                // Второй запрос для отправки данных
                                let currentDateTime = new Date().toLocaleString("ru-RU", { 
                                    year: 'numeric', 
                                    month: '2-digit', 
                                    day: '2-digit', 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                }).replace(',', '');
                                fetch('send-email.php', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ phone: phoneInput, email: data.email, name: nameInput, url: currentURL, datetime: currentDateTime }),
                                })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        alert(`Номер телефона ${phoneInput} успешно отправлен!`);
                                        console.log('PDF создан:', data.pdf_path);
                                        // Скачать PDF
                                        window.open(data.pdf_path, '_blank');
                                    } else {
                                        alert('Ошибка при отправке номера. Попробуйте еще раз.');
                                    }
                                })
                                .catch(error => {
                                    console.error('Ошибка при отправке данных:', error);
                                    alert('Произошла ошибка при отправке.');
                                });
                            } else {
                                alert('Ошибка: email не найден.');
                            }
                        })
                        .catch(error => {
                            console.error('Ошибка при получении email:', error);
                            alert('Произошла ошибка при получении email.');
                        });
                    } else {
                        alert('Пожалуйста, введите номер телефона.');
                    }                    
                });
            }
        
            // Показываем карточку и слой затемнения
            orderCard.style.display = 'block';
            overlay.style.display = 'block';
        
            // Обработчик закрытия карточки по крестику
            orderCard.querySelector('.close-order-card').addEventListener('click', closeOrderCard);
        
            // Закрытие при клике на затемненный слой
            overlay.addEventListener('click', closeOrderCard);
        
            function closeOrderCard() {
                orderCard.style.display = 'none';
                overlay.style.display = 'none';
            }
        
            // Обработчик кнопки Позвонить
            orderCard.querySelector('.call-button').addEventListener('click', () => {
                window.location.href = 'tel:+79812104831';
            });
        }
        
        // Добавление обработчика события на кнопку "Оформить заказ"
        document.querySelectorAll('.order-button-main').forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target;
                const card = target.closest('.product-card-main');

                if (card) {
                    const productId = card.getAttribute('data-id');
                    if (productId) {
                        let domain = window.location.origin;
                        currentURL = `${domain}/product.html?id=${productId}`;
                    }
                }

                // Вызов функции для отображения подтверждения заказа
                showOrderConfirmation();
            });
        });  
        
    }
    

    sendFiltersToServer();
    })
    .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
    });
    
});

