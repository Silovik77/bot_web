// --- СЛОВАРИ ПЕРЕВОДА ---
const TRANSLATE_MAP = {
    'Blue Gate': 'Синие врата',
    'Spaceport': 'Космопорт',
    'Dam': 'Плотина',
    'Stella Montis': 'Стелла Монти',
    'Buried City': 'Закопанный город',
    'The Core': 'Ядро',
    'The Ruins': 'Руины',
    'The Vault': 'Хранилище',
    'The Outpost': 'Пост',
    'The Lab': 'Лаборатория',
    // Добавьте сюда больше карт по мере необходимости
};

const TRANSLATE_EVENT = {
    'Locked Gate': 'Закрытые врата',
    'Launch Tower Loot': 'Добыча с башни запуска',
    'Cold Snap': 'Холодная волна',
    'Harvester': 'Жнец',
    'Matriarch': 'Матриарх',
    'Night Raid': 'Ночной рейд',
    'Bird City': 'Птичий город',
    'Prospecting Probes': 'Геологические зонды',
    'Electromagnetic Storm': 'Электромагнитная буря',
    'Hidden Bunker': 'Скрытый бункер',
    'Husk Graveyard': 'Кладбище кукол',
    'Lush Blooms': 'Пышные цветы',
    'Uncovered Caches': 'Обнаруженные тайники',
    'Extraction Raid': 'Рейд по добыче',
    'Survival Test': 'Тест выживания',
    'Team Deathmatch': 'Командный бой насмерть',
    'Capture the Objective': 'Захват цели',
    // Добавьте сюда больше событий по мере необходимости
};

// --- ОБНОВЛЕНИЕ СПИСКА СОБЫТИЙ ---
async function loadEvents() {
    try {
        // ИСПОЛЬЗУЕМ ВАШ ДОМЕН
        const response = await fetch('https://silovik-silovik.waw0.amvera.tech/api/user_events');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const activeEventsContainer = document.getElementById('active-events');
        const upcomingEventsContainer = document.getElementById('upcoming-events');

        if (!activeEventsContainer || !upcomingEventsContainer) return;

        // Собираем уникальные карты и события для фильтров
        const mapsSet = new Set();
        const eventsSet = new Set();
        [...(data.active || []), ...(data.upcoming || [])].forEach(e => {
            mapsSet.add(e.location);
            eventsSet.add(e.name);
        });

        // Заполняем фильтр по картам
        const mapSelect = document.getElementById('map-filter');
        mapSelect.innerHTML = '<option value="">Все карты</option>'; // Очищаем и добавляем "Все"
        mapsSet.forEach(map => {
            const option = document.createElement('option');
            option.value = map;
            option.textContent = TRANSLATE_MAP[map] || map;
            mapSelect.appendChild(option);
        });

        // Заполняем фильтр по событиям
        const eventSelect = document.getElementById('event-name-filter');
        eventSelect.innerHTML = '<option value="">Все события</option>'; // Очищаем и добавляем "Все"
        eventsSet.forEach(eventName => {
            const option = document.createElement('option');
            option.value = eventName;
            option.textContent = TRANSLATE_EVENT[eventName] || eventName;
            eventSelect.appendChild(option);
        });

        // --- ОТРИСОВКА СОБЫТИЙ ---
        // Очищаем контейнеры
        activeEventsContainer.innerHTML = '';
        upcomingEventsContainer.innerHTML = '';

        // Функция для создания элемента события
        function createEventElement(event, type) {
            const el = document.createElement('div');
            el.className = `event-item ${type}`;
            const eventName = TRANSLATE_EVENT[event.name] || event.name;
            const eventLocation = TRANSLATE_MAP[event.location] || event.location;

            if (type === 'active') {
                el.innerHTML = `
                    <h4>✅ ${eventName}</h4>
                    <p>Карта: ${eventLocation}</p>
                    <p class="time-left">⏱️ Осталось: ${event.time_left}</p>
                `;
            } else { // upcoming
                el.innerHTML = `
                    <h4>⏳ ${eventName}</h4>
                    <p>Карта: ${eventLocation}</p>
                    <p class="time-to-start">⏰ Начнётся через: ${event.time_left}</p>
                `;
            }
            return el;
        }

        // Обрабатываем активные события
        if (data.active && data.active.length > 0) {
            data.active.forEach(event => {
                activeEventsContainer.appendChild(createEventElement(event, 'active'));
            });
        } else {
            activeEventsContainer.innerHTML = '<p>Нет активных событий.</p>';
        }

        // Обрабатываем предстоящие события
        if (data.upcoming && data.upcoming.length > 0) {
            data.upcoming.forEach(event => {
                upcomingEventsContainer.appendChild(createEventElement(event, 'upcoming'));
            });
        } else {
            upcomingEventsContainer.innerHTML = '<p>Нет предстоящих событий.</p>';
        }

        // --- ЛОГИКА ФИЛЬТРАЦИ ---
        const eventTypeFilter = document.getElementById('event-type-filter');

        function applyFilters() {
            const selectedMap = mapSelect.value;
            const selectedEventType = eventTypeFilter.value;
            const selectedEventName = eventSelect.value;

            const allActiveItems = Array.from(activeEventsContainer.children);
            const allUpcomingItems = Array.from(upcomingEventsContainer.children);
            const allItems = [...allActiveItems, ...allUpcomingItems];

            allItems.forEach(item => {
                // Получаем имя и локацию из HTML элемента
                // Это хрупкий способ, но работает для текущей структуры
                const eventHtml = item.innerHTML;
                // Извлекаем имя события (между h4 и первым p)
                const nameMatch = eventHtml.match(/<h4>.*?<\/h4>\s*<p>(.*?)<\/p>/);
                let eventName = nameMatch ? nameMatch[1] : '';
                if (eventName.startsWith('Карта: ')) {
                     // Если имя не найдено, возможно это карта, ищем в другом месте
                     const nameMatch2 = eventHtml.match(/<h4>.*?(?:✅|⏳)\s*(.*?)<\/h4>/);
                     eventName = nameMatch2 ? nameMatch2[1].trim() : '';
                }
                // Извлекаем локацию (после 'Карта: ')
                const locationMatch = eventHtml.match(/Карта:\s*(.*?)<\/p>/);
                const eventLocation = locationMatch ? locationMatch[1] : '';

                let showItem = true;

                if (selectedMap && eventLocation !== (TRANSLATE_MAP[selectedMap] || selectedMap)) {
                    showItem = false;
                }
                if (selectedEventType && !item.classList.contains(selectedEventType)) {
                    showItem = false;
                }
                if (selectedEventName && eventName !== (TRANSLATE_EVENT[selectedEventName] || selectedEventName)) {
                    showItem = false;
                }

                item.style.display = showItem ? '' : 'none';
            });

            // Показываем сообщение "нет событий", если все скрыты
            const visibleActiveItems = allActiveItems.filter(item => item.style.display !== 'none');
            const visibleUpcomingItems = allUpcomingItems.filter(item => item.style.display !== 'none');

            if (visibleActiveItems.length === 0) {
                if (!activeEventsContainer.querySelector('.no-events-message')) {
                    const msgEl = document.createElement('div');
                    msgEl.className = 'no-events-message';
                    msgEl.textContent = 'Нет активных событий по фильтрам.';
                    msgEl.style.display = 'none'; // Изначально скрыто
                    activeEventsContainer.appendChild(msgEl);
                }
                activeEventsContainer.querySelector('.no-events-message').style.display = '';
            } else {
                if (activeEventsContainer.querySelector('.no-events-message')) {
                    activeEventsContainer.querySelector('.no-events-message').style.display = 'none';
                }
            }

            if (visibleUpcomingItems.length === 0) {
                if (!upcomingEventsContainer.querySelector('.no-events-message')) {
                    const msgEl = document.createElement('div');
                    msgEl.className = 'no-events-message';
                    msgEl.textContent = 'Нет предстоящих событий по фильтрам.';
                    msgEl.style.display = 'none'; // Изначально скрыто
                    upcomingEventsContainer.appendChild(msgEl);
                }
                upcomingEventsContainer.querySelector('.no-events-message').style.display = '';
            } else {
                if (upcomingEventsContainer.querySelector('.no-events-message')) {
                    upcomingEventsContainer.querySelector('.no-events-message').style.display = 'none';
                }
            }
        }

        // Добавляем обработчики фильтрации
        mapSelect.addEventListener('change', applyFilters);
        eventTypeFilter.addEventListener('change', applyFilters);
        eventSelect.addEventListener('change', applyFilters);

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
        // ИСПОЛЬЗУЕМ ВАШ ДОМЕН
        const response = await fetch('https://silovik-silovik.waw0.amvera.tech/api/updates');
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

    if (subId === 'events-sub') {
        loadEvents();
    } else if (subId === 'news-sub') {
        loadNews();
    }
}

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем события при загрузке страницы, если "События" открыты по умолчанию
    // loadEvents(); // Загрузка при загрузке страницы, если "events-sub" видим
});

// --- ОТКРЫТИЕ СЕКЦИИ ПО УМОЛЧАНИЮ ---
window.onload = function() {
    showSection('arc-raiders-section'); // Открываем "События" по умолчанию
    // showSubSection('events-sub'); // Открываем "События" внутри "Arc Raiders" по умолчанию
};
