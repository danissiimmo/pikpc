window.addEventListener('load', () => {
    if ('caches' in window) {
        caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
                caches.delete(cacheName); // Удаляем каждый кэш
                console.log("Успех");
            });
        });
    }
});