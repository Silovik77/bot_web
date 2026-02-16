// --- ОБНОВЛЕНИЕ СПИСКА СОБЫТИЙ ---
async function loadEvents() {
    try {
        // ИСПРАВЛЕНИЕ: URL должен быть на ваш бот на Amvera!
        // ЗАМЕНИТЕ 'https://your-amvera-app-url' на реальный URL вашего приложения
        const response = await fetch('https://silovik-silovik.waw0.amvera.tech/api/user_events'); // <- ЗДЕСЬ!
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const activeEventsContainer = document.getElementById('active-events');
        const upcomingEventsContainer = document.getElementById('upcoming-events');

        if (!activeEventsContainer || !upcomingEventsContainer) {
            console.error('❌ Один или оба контейнера событий не найдены.');
            return;
        }

        activeEventsContainer.innerHTML = '';
        upcomingEventsContainer.innerHTML = '';

        if (data.active && data.active.length > 0) {
            data.active.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item active';
                eventElement.innerHTML = `
                    <h4>${event.name}</h4>
                    <p>Карта: ${event.location}</p>
                    <p class="time-left">⏱️ Осталось: ${event.time_left}</p>
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
                    <p class="time-to-start">⏰ Начнётся через: ${event.time_left}</p>
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

// --- ОБНОВЛЕНИЕ СПИСКА НОВОСТЕЙ ---
async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) {
        console.error('❌ Элемент с id "news-container" не найден.');
        return;
    }

    try {
        // ИСПРАВЛЕНИЕ: URL должен быть на ваш бот на Amvera!
        // ЗАМЕНИТЕ 'https://your-amvera-app-url' на реальный URL вашего приложения
        const response = await fetch('https://silovik-silovik.waw0.amvera.tech/api/updates'); // <- ЗДЕСЬ!
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        container.innerHTML = '';

        // Проверяем, есть ли поле updates и является ли оно массивом
        if (!Array.isArray(data.updates)) {
            console.warn('⚠️ Поле "updates" не найдено или не является массивом.');
            container.innerHTML = '<p>Нет доступных новостей.</p>';
            return;
        }

        if (data.updates.length === 0) {
            container.innerHTML = '<p>Нет доступных новостей.</p>';
            return;
        }

        // Рендерим каждую новость
        data.updates.forEach(update => {
            const updateElement = document.createElement('div');
            updateElement.className = 'news-item';

            // ИСПРАВЛЕНИЕ: Теперь используем квадратные скобки для доступа к ключам
            // Это позволяет читать 'title_ru', даже если в JSON он был 'title_ru '
            const title = update['title_ru'] || update['title'] || 'Заголовок недоступен';
            const summary = update['summary_ru'] || update['summary'] || '';
            const date = update['date'] || '';
            const url = update['url'] || '#';

            updateElement.innerHTML = `
                <h3>${title}</h3>
                <p>${summary}</p>
                <small>${date}</small>
                <a href="${url}" target="_blank">🔗 Читать далее</a>
            `;
            container.appendChild(updateElement);
        });

    } catch (error) {
        console.error('❌ Ошибка при загрузке новостей:', error);
        // Показываем сообщение об ошибке пользователю
        container.innerHTML = '<p>Ошибка загрузки новостей. Попробуйте позже.</p>';
    }
}

// --- ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ РАЗДЕЛОВ ---
function showSection(sectionId) {
    // Скрываем все секции
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    // Показываем выбранную
    document.getElementById(sectionId).style.display = 'block';

    // Загружаем данные при открытии
    if (sectionId === 'arc-raiders-section') {
        // Если открыто "Arc Raiders", по умолчанию показываем "События"
        showSubSection('events-sub');
    }
    if (sectionId === 'streamers-section') {
        // Здесь можно добавить логику для стримеров, если нужно
    }
}

// --- ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ПОДМЕНЮ (внутри Arc Raiders) ---
function showSubSection(subId) {
    document.querySelectorAll('.sub-section').forEach(el => el.style.display = 'none');
    document.getElementById(subId).style.display = 'block';

    // Загружаем данные при открытии подраздела
    if (subId === 'events-sub') {
        loadEvents();
    }
    if (subId === 'news-sub') {
        loadNews();
    }
}

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем события при загрузке
    loadEvents();
});

// --- ОТКРЫТИЕ СЕКЦИИ ПО УМОЛЧАНИЮ ---
window.onload = function() {
    showSection('arc-raiders-section'); // Открываем "События" по умолчанию
    // showSubSection('events-sub'); // Открываем "События" внутри "Arc Raiders" по умолчанию
};
