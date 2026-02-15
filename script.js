document.addEventListener('DOMContentLoaded', () => {
    // Функция для загрузки и отображения обновлений
    async function loadUpdates() {
        const updatesContainer = document.getElementById('updates-container');
        if (!updatesContainer) {
            console.error('❌ Элемент с id "updates-container" не найден.');
            return;
        }

        try {
            console.log('🔍 Загружаю обновления...');
            const response = await fetch('/api/updates');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📦 Полученные данные:', data);

            // Проверяем, есть ли поле updates и является ли оно массивом
            if (!Array.isArray(data.updates)) {
                console.warn('⚠️ Поле "updates" не найдено или не является массивом.');
                updatesContainer.innerHTML = '<p>Нет доступных обновлений.</p>';
                return;
            }

            // Очищаем контейнер перед обновлением
            updatesContainer.innerHTML = '';

            if (data.updates.length === 0) {
                updatesContainer.innerHTML = '<p>Нет доступных обновлений.</p>';
                return;
            }

            // Рендерим каждую новость
            data.updates.forEach(update => {
                const updateElement = document.createElement('div');
                updateElement.className = 'update-item';

                // Используем русский перевод, если доступен, иначе оригинал
                const title = update.title_ru || update.title || 'Заголовок недоступен';
                const summary = update.summary_ru || update.summary || '';
                const date = update.date || '';
                const url = update.url || '#';

                updateElement.innerHTML = `
                    <h3>${title}</h3>
                    <p>${summary}</p>
                    <small>${date}</small>
                    <a href="${url}" target="_blank">🔗 Читать далее</a>
                `;
                updatesContainer.appendChild(updateElement);
            });

        } catch (error) {
            console.error('❌ Ошибка при загрузке обновлений:', error);
            // Показываем сообщение об ошибке пользователю
            updatesContainer.innerHTML = '<p>Ошибка загрузки обновлений. Попробуйте позже.</p>';
        }
    }

    // Функция для отображения обновлений (если раздел активен)
    function showUpdates() {
        console.log('🔄 Отображаю раздел "Обновления"');
        loadUpdates(); // Загружаем при открытии
    }

    // --- (Если у вас есть логика переключения между разделами, используйте showUpdates) ---
    // Пример: если у вас есть кнопка "Обновления" и контейнер для неё
    // document.getElementById('updates-button').addEventListener('click', showUpdates);
    // showUpdates(); // Вызовите, если "Обновления" - это статичный раздел на странице

    // Загружаем обновления при загрузке страницы (если это основной раздел)
    loadUpdates();

    // --- ОПЦИОНАЛЬНО: Обновлять каждые 5 минут ---
    // setInterval(loadUpdates, 5 * 60 * 1000); // 5 минут в миллисекундах
});
