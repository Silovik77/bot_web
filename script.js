// --- ОБНОВЛЕНИЕ СПИСКА СОБЫТИЙ ---
async function loadEvents() {
    try {
        const response = await fetch('/api/user_events');
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
        const response = await fetch('/api/updates');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        container.innerHTML = '';

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

            // 🔑 ИСПРАВЛЕНИЕ: используем квадратные скобки для доступа к ключам (защита от пробелов в JSON)
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
        showSubSection('events-sub');
    }
}

// --- ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ПОДМЕНЮ ---
function showSubSection(subId) {
    document.querySelectorAll('.sub-section').forEach(el => el.style.display = 'none');
    document.getElementById(subId).style.display = 'block';

    // Загружаем данные при открытии подраздела
    if (subId === 'events-sub') {
        loadEvents();
    }
    if (subId === 'news-sub') {
        loadNews(); // ← Это вызывает исправленную loadNews()
    }
}

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    showSection('arc-raiders-section');
    showSubSection('events-sub');
});
