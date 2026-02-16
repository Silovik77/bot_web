// --- ОБНОВЛЕНИЕ СПИСКА СОБЫТИЙ ---
async function loadEvents() {
    try {
        // ИСПРАВЛЕНИЕ: URL должен быть на ваш бот на Amvera!
        // ЗАМЕНИТЕ 'https://your-amvera-app-url' на реальный URL вашего приложения
        const response = await fetch('https://silovik-silovik.waw0.amvera.tech'); // <- ЗДЕСЬ!
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const activeEventsContainer = document.getElementById('active-events');
        const upcomingEventsContainer = document.getElementById('upcoming-events');

        if (!activeEventsContainer || !upcomingEventsContainer) return;

        activeEventsContainer.innerHTML = '';
        upcomingEventsContainer.innerHTML = '';

        if (data.active && data.active.length > 0) {
            data.active.forEach(event => {
                const el = document.createElement('div');
                el.className = 'event-item active';
                el.innerHTML = `<h4>${event.name}</h4><p>Карта: ${event.location}</p><p class="time-left">Осталось: ${event.time_left}</p>`;
                activeEventsContainer.appendChild(el);
            });
        } else {
            activeEventsContainer.innerHTML = '<p>Нет активных событий.</p>';
        }

        if (data.upcoming && data.upcoming.length > 0) {
            data.upcoming.forEach(event => {
                const el = document.createElement('div');
                el.className = 'event-item upcoming';
                el.innerHTML = `<h4>${event.name}</h4><p>Карта: ${event.location}</p><p class="time-to-start">Начнётся через: ${event.time_left}</p>`;
                upcomingEventsContainer.appendChild(el);
            });
        } else {
            upcomingEventsContainer.innerHTML = '<p>Нет предстоящих событий.</p>';
        }
    } catch (e) {
        console.error('Ошибка загрузки событий:', e);
        document.getElementById('events-container').innerHTML = '<p>Ошибка загрузки событий.</p>';
    }
}

// --- ОБНОВЛЕНИЕ СПИСКА НОВОСТЕЙ ---
async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    try {
        // ИСПРАВЛЕНИЕ: URL должен быть на ваш бот на Amvera!
        const response = await fetch('https://your-amvera-app-url/api/updates'); // <- ЗДЕСЬ!
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        container.innerHTML = '';

        if (!Array.isArray(data.updates)) {
            container.innerHTML = '<p>Нет доступных новостей.</p>';
            return;
        }

        if (data.updates.length === 0) {
            container.innerHTML = '<p>Нет доступных новостей.</p>';
            return;
        }

        data.updates.forEach(update => {
            const el = document.createElement('div');
            el.className = 'news-item';
            el.innerHTML = `
                <h3>${update.title_ru || update.title || 'Заголовок недоступен'}</h3>
                <p>${update.summary_ru || update.summary || ''}</p>
                <small>${update.date || ''}</small>
                <a href="${update.url || '#'}" target="_blank">Читать далее</a>
            `;
            container.appendChild(el);
        });

    } catch (e) {
        console.error('Ошибка загрузки новостей:', e);
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
        // По умолчанию показываем "События"
        showSubSection('events-sub');
    }
    // Другие действия при открытии секций, если нужно
}

// --- ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ПОДМЕНЮ ---
function showSubSection(subId) {
    document.querySelectorAll('.sub-section').forEach(el => el.style.display = 'none');
    document.getElementById(subId).style.display = 'block';

    if (subId === 'events-sub') {
        loadEvents();
    } else if (subId === 'news-sub') {
        loadNews(); // Вызываем загрузку новостей при открытии подраздела
    }
}

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    // По умолчанию открываем "Arc Raiders" -> "События"
    showSection('arc-raiders-section');
    showSubSection('events-sub');
});
