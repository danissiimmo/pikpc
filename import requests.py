import requests
from bs4 import BeautifulSoup
import json

# URL страницы с телевизорами
url = "https://www.citilink.ru/catalog/televizory/?ref=mainpage"

# Отправляем GET запрос
response = requests.get(url)

# Проверяем успешность запроса
if response.status_code == 200:
    soup = BeautifulSoup(response.text, "html.parser")

    # Собираем все карточки товаров
    products = []

    # Примерный селектор для карточек
    product_cards = soup.select('.catalog-product')

    for card in product_cards:
        product = {}
        
        # Извлекаем название товара
        title = card.select_one('.catalog-product__name')
        if title:
            product["title"] = title.get_text(strip=True)

        # Извлекаем описание товара
        description = card.select_one('.catalog-product__description')
        if description:
            product["description"] = description.get_text(strip=True)
        
        # Извлекаем цену
        price = card.select_one('.price')
        if price:
            product["price"] = int(price.get_text(strip=True).replace('₽', '').replace(' ', ''))

        # Извлекаем характеристики (если есть)
        characteristics = []
        specs = card.select('.product-characteristics__item')
        for spec in specs:
            name = spec.select_one('.product-characteristics__name')
            value = spec.select_one('.product-characteristics__value')
            if name and value:
                characteristics.append({
                    "name": name.get_text(strip=True),
                    "value": value.get_text(strip=True)
                })
        
        # Собираем полное описание товара
        full_description = card.select_one('.product-description__full')
        if full_description:
            product["fullDescription"] = full_description.get_text(strip=True)
        
        # Добавляем в список продуктов
        products.append(product)

    # Конвертируем в JSON и выводим
    print(json.dumps(products, ensure_ascii=False, indent=4))
else:
    print(f"Ошибка получения страницы: {response.status_code}")
