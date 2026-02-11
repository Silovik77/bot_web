// Укажите ваш реальный URL Amvera
const API_URL = 'https://silovik-silovik.waw0.amvera.tech';

// --- Функция для загрузки событий ---
async function loadEvents() {
  try {
    const response = await fetch(`${API_URL}/api/user_events`);
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    // 🎯 КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: получаем rawData
    const rawData = await response.json();
    return rawData;
  } catch (error) {
    console.error('Ошибка при загрузке событий:', error);
    throw error;
  }
}

// --- Вспомогательные функции ---
function formatTimeMs(ms) {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const parts = [];
  if (h) parts.push(`${h}ч`);
  if (m) parts.push(`${m}м`);
  if (s || !parts.length) parts.push(`${s}с`);
  return parts.join(' ');
}

function getMapIcon(map) {
  const icons = {
    "Dam": "💧",
    "Buried City": "🏙️",
    "Spaceport": "🚀",
    "Blue Gate": "🔵",
    "Stella Montis": "⛰️"
  };
  return icons[map] || "📍";
}

function getEventIcon(name) {
  const icons = {
    "Night Raid": "🌙",
    "Harvester": "🪴",
    "Matriarch": "👑",
    "Cold Snap": "❄️",
    "Electromagnetic Storm": "⚡",
    "Launch Tower Loot": "🎯",
    "Hidden Bunker": "🔒",
    "Husk Graveyard": "💀",
    "Prospecting Probes": "📡",
    "Uncovered Caches": "📦",
    "Lush Blooms": "🌿",
    "Locked Gate": "🚪"
  };
  return icons[name] || "❓";
}

// --- Отображение меню Arc Raiders ---
function showArcRaidersMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>🎮 Arc Raiders</h2>

    <!-- Фильтры -->
    <div class="filters">
      <select id="filter-map">
        <option value="">Все карты</option>
      </select>
      <select id="filter-event">
        <option value="">Все события</option>
      </select>
    </div>

    <!-- Активные события -->
    <h3>🟢 Активные</h3>
    <div id="active-events" class="events-list"></div>

    <!-- Предстоящие события -->
    <h3>🔴 Предстоящие</h3>
    <div id="upcoming-events" class="events-list"></div>

    <!-- Подменю -->
    <div class="arc-menu">
      <button class="submenu-btn" onclick="showEventsPage()">События</button>
      <button class="submenu-btn" onclick="alert('Раздел «Обновления» в разработке.')">Обновления</button>
      <button class="submenu-btn" onclick="alert('Раздел «Гайды» в разработке.')">Гайды</button>
      <button class="submenu-btn" onclick="alert('Раздел «Испытание» в разработке.')">Испытание</button>
      <button class="submenu-btn back-btn" onclick="showMainMenu()">Назад</button>
    </div>
  `;
  
  loadAndDisplayEvents();
}

// --- Загрузка и отображение событий ---
async function loadAndDisplayEvents() {
  try {
    const rawData = await loadEvents();
    // 🎯 Парсим rawData.data
    const events = rawData.data || [];
    const currentTimestamp = Date.now(); // в миллисекундах

    const activeEvents = [];
    const upcomingEvents = [];

    for (const event of events) {
      const name = event.name || 'Неизвестное событие';
      const location = event.map || 'Неизвестная карта';
      const start = event.startTime;
      const end = event.endTime;

      if (!start || !end) continue;

      if (start <= currentTimestamp && currentTimestamp < end) {
        // Активное событие
        const timeLeftMs = end - currentTimestamp;
        const timeLeftStr = formatTimeMs(timeLeftMs);
        activeEvents.push({ name, location, time_left: timeLeftStr });
      } else if (currentTimestamp < start) {
        // Предстоящее
        const timeToStartMs = start - currentTimestamp;
        const timeToStartStr = formatTimeMs(timeToStartMs);
        upcomingEvents.push({ name, location, time_left: timeToStartStr });
      }
    }

    // Сортируем предстоящие по времени начала
    upcomingEvents.sort((a, b) => {
      const aSec = parseTimeStr(a.time_left);
      const bSec = parseTimeStr(b.time_left);
      return aSec - bSec;
    });

    // Обновляем списки
    updateEventList('active-events', activeEvents, 'active');
    updateEventList('upcoming-events', upcomingEvents.slice(0, 10), 'upcoming'); // Максимум 10

    // Инициализируем фильтры
    initFilters(events);

  } catch (error) {
    console.error('Ошибка при загрузке событий:', error);
    const activeEl = document.getElementById('active-events');
    const upcomingEl = document.getElementById('upcoming-events');
    if (activeEl) activeEl.innerHTML = '<p class="no-data">Ошибка загрузки активных событий</p>';
    if (upcomingEl) upcomingEl.innerHTML = '<p class="no-data">Ошибка загрузки предстоящих событий</p>';
  }
}

// --- Вспомогательная функция для отрисовки списка ---
function updateEventList(containerId, events, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (events.length > 0) {
    container.innerHTML = events.map(e => `
      <div class="event-card ${type}">
        <div class="event-icon">${getEventIcon(e.name)}</div>
        <div class="event-info">
          <div class="event-name">${e.name}</div>
          <div class="event-location">${getMapIcon(e.location)} ${e.location}</div>
        </div>
        <div class="event-time">⏱️ ${
          type === 'active' ? `Осталось: ${e.time_left}` : `Через: ${e.time_left}`
        }</div>
      </div>
    `).join('');
  } else {
    container.innerHTML = `<p class="no-data">${
      type === 'active' ? '🟢 Нет активных событий' : '🔴 Нет предстоящих событий'
    }</p>`;
  }
}

// --- Инициализация фильтров ---
function initFilters(allEvents) {
  const maps = [...new Set(allEvents.map(e => e.map))].sort();
  const events = [...new Set(allEvents.map(e => e.name))].sort();

  const mapSelect = document.getElementById('filter-map');
  const eventSelect = document.getElementById('filter-event');

  if (mapSelect) {
    mapSelect.innerHTML = `<option value="">Все карты</option>` +
      maps.map(m => `<option value="${m}">${m}</option>`).join('');
  }
  if (eventSelect) {
    eventSelect.innerHTML = `<option value="">Все события</option>` +
      events.map(n => `<option value="${n}">${n}</option>`).join('');
  }

  // Добавляем обработчики фильтров
  mapSelect?.addEventListener('change', applyFilters);
  eventSelect?.addEventListener('change', applyFilters);
}

// --- Применение фильтров (простое обновление) ---
function applyFilters() {
  // Перезагружаем события (с фильтрацией на клиенте, если нужно, или на сервере)
  loadAndDisplayEvents();
}

// --- Отображение страницы событий (для кнопки "События") ---
function showEventsPage() {
  showArcRaidersMenu(); // Просто показываем меню, события загружаются в loadAndDisplayEvents
}

// --- Отображение формы для стримеров ---
function showStreamersForm() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>📺 Стримерам</h2>
    <p>Подключите бота к своему каналу, чтобы получать уведомления о начале стрима.</p>
    <form id="streamer-form">
      <label for="channel-id">ID вашего Telegram-канала:</label>
      <input type="text" id="channel-id" placeholder="@your_channel" required>
      
      <label for="twitch-url">Ссылка на Twitch/YouTube:</label>
      <input type="url" id="twitch-url" placeholder="https://twitch.tv/your_name" required>
      
      <button type="submit" class="submenu-btn">Подключить</button>
    </form>
    <button class="submenu-btn back-btn" onclick="showMainMenu()">Назад</button>
  `;

  document.getElementById('streamer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const channelId = document.getElementById('channel-id').value;
    const twitchUrl = document.getElementById('twitch-url').value;

    try {
      const response = await fetch(`${API_URL}/api/register_streamer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_id: channelId, twitch_url: twitchUrl })
      });

      if (response.ok) {
        alert('✅ Вы успешно подключили бота!');
        showMainMenu();
      } else {
        const error = await response.json();
        alert(`❌ Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('❌ Не удалось подключиться к серверу.');
    }
  });
}

// --- Вспомогательная функция для фильтров ---
function parseTimeStr(str) {
  let total = 0;
  const re = /(\d+)([чмс])/g;
  let match;
  while ((match = re.exec(str))) {
    const val = parseInt(match[1]);
    const unit = match[2];
    if (unit === 'ч') total += val * 3600;
    if (unit === 'м') total += val * 60;
    if (unit === 'с') total += val;
  }
  return total;
}

// --- Отображение главного меню ---
function showMainMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <p>Добро пожаловать! Выберите раздел в меню ниже.</p>
    <div class="main-menu">
      <button class="menu-btn" onclick="showArcRaidersMenu()">Arc Raiders</button>
      <button class="menu-btn" onclick="showStreamersForm()">Стримерам</button>
    </div>
  `;
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
});
