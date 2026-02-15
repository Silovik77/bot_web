// --- ОБНОВЛЕНИЕ СПИСКА СОБЫТИЙ ---
async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;

    try {
        // ИСПОЛЬЗУЕМ ВАШ ДОМЕН
        const response = await fetch('https://silovik-silovik.waw0.amvera.tech/api/user_events');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const activeEventsContainer = document.getElementById('active-events');
        const upcomingEventsContainer = document.getElementById('upcoming-events');

        if (!activeEventsContainer || !upcomingEventsContainer) return;

        activeEventsContainer.innerHTML = '';
        upcomingEventsContainer.innerHTML = '';

        if (data.active && data.active.length > 0) {
            const activeGrid = document.createElement('div');
            activeGrid.className = 'events-grid';
            data.active.forEach(event => {
                const el = document.createElement('div');
                el.className = 'event-item active';
                el.innerHTML = `<h4>✅ ${event.name}</h4><p>Карта: ${event.location}</p><p class="time-left">⏱️ Осталось: ${event.time_left}</p>`;
                activeGrid.appendChild(el);
            });
            activeEventsContainer.appendChild(activeGrid);
        } else {
            activeEventsContainer.innerHTML = '<p class="no-data">Нет активных событий.</p>';
        }

        if (data.upcoming && data.upcoming.length > 0) {
            const upcomingGrid = document.createElement('div');
            upcomingGrid.className = 'events-grid';
            data.upcoming.forEach(event => {
                const el = document.createElement('div');
                el.className = 'event-item upcoming';
                el.innerHTML = `<h4>⏳ ${event.name}</h4><p>Карта: ${event.location}</p><p class="time-to-start">⏰ Начнётся через: ${event.time_left}</p>`;
                upcomingGrid.appendChild(el);
            });
            upcomingEventsContainer.appendChild(upcomingGrid);
        } else {
            upcomingEventsContainer.innerHTML = '<p class="no-data">Нет предстоящих событий.</p>';
        }
    } catch (e) {
        console.error('Ошибка загрузки событий:', e);
        document.getElementById('events-container').innerHTML = '<p class="no-data">Ошибка загрузки событий.</p>';
    }
}

// --- ОБНОВЛЕНИЕ СПИСКА НОВОСТЕЙ ---
async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    try {
        // ИСПОЛЬЗУЕМ ВАШ ДОМЕН
        const response = await fetch('https://silovik-silovik.waw0.amvera.tech/api/updates');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        container.innerHTML = '';

        if (!Array.isArray(data.updates)) {
            container.innerHTML = '<p class="no-data">Нет доступных новостей.</p>';
            return;
        }

        if (data.updates.length === 0) {
            container.innerHTML = '<p class="no-data">Нет доступных новостей.</p>';
            return;
        }

        const newsGrid = document.createElement('div');
        newsGrid.className = 'news-grid';

        data.updates.forEach(update => {
            const el = document.createElement('div');
            el.className = 'news-item';
            el.innerHTML = `
                <h3>📰 ${update.title_ru || update.title || 'Заголовок недоступен'}</h3>
                <p>${update.summary_ru || update.summary || ''}</p>
                <small>📅 ${update.date || ''}</small>
                <br><a href="${update.url || '#'}" target="_blank">🔗 Читать далее</a>
            `;
            newsGrid.appendChild(el);
        });

        container.appendChild(newsGrid);

    } catch (e) {
        console.error('Ошибка загрузки новостей:', e);
        container.innerHTML = '<p class="no-data">Ошибка загрузки новостей. Попробуйте позже.</p>';
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
        // По умолчанию показываем "Событие"
        showArcRaiderSubSection('events-sub-content');
    }
    if (sectionId === 'streamers-section') {
        document.getElementById('streamer-form-content').style.display = 'block';
    }
}

// --- ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ВНУТРЕННЕГО ПОДМЕНЮ ARC RAIDERS ---
function showArcRaiderSubSection(subId) {
    document.querySelectorAll('.arc-raiders-sub-content').forEach(el => el.style.display = 'none');
    document.getElementById(subId).style.display = 'block';

    // Загружаем данные при открытии подраздела
    if (subId === 'events-sub-content') {
        loadEvents();
    }
    if (subId === 'news-sub-content') {
        loadNews();
    }
}

// --- ФУНКЦИЯ ДЛЯ РЕГИСТРАЦИИ СТРИМЕРА ---
async function registerStreamer() {
    const channelInput = document.getElementById('channel-id-input');
    const twitchInput = document.getElementById('twitch-url-input');

    const channelId = channelInput.value.trim();
    const twitchUrl = twitchInput.value.trim();

    if (!channelId || !twitchUrl) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    try {
        // ИСПОЛЬЗУЕМ ВАШ ДОМЕН
        const response = await fetch('https://silovik-silovik.waw0.amvera.tech/api/register_streamer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ channel_id: channelId, twitch_url: twitchUrl }),
        });

        if (response.ok) {
            alert('Стример успешно зарегистрирован!');
            channelInput.value = '';
            twitchInput.value = '';
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.message || 'Неизвестная ошибка.'}`);
        }
    } catch (error) {
        console.error('Ошибка регистрации стримера:', error);
        alert('Произошла ошибка при регистрации стримера.');
    }
}

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    // По умолчанию открываем главную страницу (все секции скрыты)
    // Ничего не показываем, пока пользователь не нажмёт кнопку.
});
