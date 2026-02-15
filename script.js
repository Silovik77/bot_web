// --- ОБНОВЛЕНИЕ СПИСКА СОБЫТИЙ ---
async function loadEvents() {
    try {
        const response = await fetch('/api/user_events');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const activeEventsContainer = document.getElementById('active-events');
        const upcomingEventsContainer = document.getElementById('upcoming-events');

        activeEventsContainer.innerHTML = '';
        upcomingEventsContainer.innerHTML = '';

        if (data.active && data.active.length > 0) {
            data.active.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item active';
                eventElement.innerHTML = `
                    <h4>${event.name}</h4>
                    <p>Карта: ${event.location}</p>
                    <p class="time-left">Осталось: ${event.time_left}</p>
                `;
                activeEventsContainer.appendChild(eventElement);
            });
        } else {
            activeEventsContainer.innerHTML = '<p>Нет активных событий.</p>';
        }

        if (data.upcoming && data.upcoming.length > 0) {
            data.upcoming.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item upcoming';
                eventElement.innerHTML = `
                    <h4>${event.name}</h4>
                    <p>Карта: ${event.location}</p>
                    <p class="time-to-start">Начнётся через: ${event.time_left}</p>
                `;
                upcomingEventsContainer.appendChild(eventElement);
            });
        } else {
            upcomingEventsContainer.innerHTML = '<p>Нет предстоящих событий.</p>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('events-container').innerHTML = '<p>Ошибка загрузки событий.</p>';
    }
}

// --- ОБНОВЛЕНИЕ СПИСКА ОБНОВЛЕНИЙ ---
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

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем события при загрузке
    loadEvents();

    // Загружаем обновления при загрузке
    loadUpdates();

    // --- ОПЦИОНАЛЬНО: Обновлять каждые 5 минут ---
    // setInterval(loadEvents, 5 * 60 * 1000);
    // setInterval(loadUpdates, 5 * 60 * 1000);
});

// --- ФУНКЦИИ ДЛЯ КНОПОК ---
function showSection(sectionId) {
    // Скрываем все секции
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    // Показываем выбранную
    document.getElementById(sectionId).style.display = 'block';

    // Если открыта секция обновлений, загружаем их
    if (sectionId === 'updates-section') {
        loadUpdates();
    }
    // Если открыта секция событий, загружаем их
    if (sectionId === 'events-section') {
        loadEvents();
    }
}

// --- ОТКРЫТИЕ СЕКЦИИ ПО УМОЛЧАНИЮ ---
// Открыть, например, секцию событий при загрузке
window.onload = function() {
    showSection('events-section'); // Замените на 'updates-section', если хотите, чтобы 'Обновления' были по умолчанию
};
