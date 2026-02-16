// --- Загрузка событий ---
async function loadEvents() {
    try {
        const res = await fetch('/api/user_events');
        const data = await res.json();
        const active = document.getElementById('active-events');
        const upcoming = document.getElementById('upcoming-events');
        active.innerHTML = '';
        upcoming.innerHTML = '';

        if (data.active && data.active.length) {
            data.active.forEach(e => {
                active.innerHTML += `<div class="event-item active"><h4>${e.name}</h4><p>Карта: ${e.location}</p><p class="time-left">⏱️ Осталось: ${e.time_left}</p></div>`;
            });
        } else {
            active.innerHTML = '<p>Нет активных событий.</p>';
        }

        if (data.upcoming && data.upcoming.length) {
            data.upcoming.forEach(e => {
                upcoming.innerHTML += `<div class="event-item upcoming"><h4>${e.name}</h4><p>Карта: ${e.location}</p><p class="time-to-start">⏰ Начнётся через: ${e.time_left}</p></div>`;
            });
        } else {
            upcoming.innerHTML = '<p>Нет предстоящих событий.</p>';
        }
    } catch (e) {
        console.error('Ошибка событий:', e);
    }
}

// --- Загрузка новостей ---
async function loadNews() {
    try {
        const res = await fetch('/api/updates');
        const data = await res.json();
        const container = document.getElementById('news-container');
        container.innerHTML = '';

        if (!Array.isArray(data.updates) || data.updates.length === 0) {
            container.innerHTML = '<p>Нет доступных новостей.</p>';
            return;
        }

        data.updates.forEach(update => {
            const el = document.createElement('div');
            el.className = 'news-item';
            el.innerHTML = `
                <h3>${update.title}</h3>
                <p>${update.summary}</p>
                <small>${update.date}</small>
                <a href="${update.url}" target="_blank">Читать далее</a>
            `;
            container.appendChild(el);
        });
    } catch (e) {
        console.error('Ошибка новостей:', e);
        document.getElementById('news-container').innerHTML = '<p>Ошибка загрузки новостей.</p>';
    }
}

// --- Переключение секций ---
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if (id === 'arc-raiders-section') {
        showSubSection('events-sub');
    }
}

function showSubSection(id) {
    document.querySelectorAll('.sub-section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if (id === 'events-sub') loadEvents();
    if (id === 'news-sub') loadNews(); // ← Это ключевая строка!
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    showSection('arc-raiders-section');
    showSubSection('events-sub');
});
