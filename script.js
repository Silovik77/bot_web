// Укажите ваш реальный URL Amvera
const API_URL = 'https://silovik-silovik.waw0.amvera.tech';

// --- Глобальные переменные ---
let allEvents = [];
let filteredActive = [];
let filteredUpcoming = [];

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

// --- Загрузка событий ---
async function loadEvents() {
  try {
    const response = await fetch(`${API_URL}/api/user_events`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    allEvents = data.data || [];
    applyFilters();
  } catch (e) {
    console.error("Ошибка загрузки событий:", e);
    alert("Не удалось загрузить события. Проверьте соединение.");
  }
}

// --- Фильтрация ---
function applyFilters() {
  const mapFilter = document.getElementById('filter-map')?.value || '';
  const eventFilter = document.getElementById('filter-event')?.value || '';

  filteredActive = allEvents.filter(event => {
    const isActive = event.startTime <= Date.now() && Date.now() < event.endTime;
    const matchesMap = !mapFilter || event.map === mapFilter;
    const matchesEvent = !eventFilter || event.name === eventFilter;
    return isActive && matchesMap && matchesEvent;
  });

  filteredUpcoming = allEvents.filter(event => {
    const isUpcoming = Date.now() < event.startTime;
    const matchesMap = !mapFilter || event.map === mapFilter;
    const matchesEvent = !eventFilter || event.name === eventFilter;
    return isUpcoming && matchesMap && matchesEvent;
  }).slice(0, 10); // Максимум 10 предстоящих

  renderEvents();
}

// --- Отображение ---
function renderEvents() {
  const activeEl = document.getElementById('active-events');
  const upcomingEl = document.getElementById('upcoming-events');

  if (!activeEl || !upcomingEl) return;

  // Активные
  activeEl.innerHTML = filteredActive.length > 0
    ? filteredActive.map(e => `
        <div class="event-card active">
          <div class="event-icon">${getEventIcon(e.name)}</div>
          <div class="event-info">
            <div class="event-name">${e.name}</div>
            <div class="event-location">${getMapIcon(e.map)} ${e.map}</div>
          </div>
          <div class="event-time">Осталось: <span class="time">${formatTimeMs(e.endTime - Date.now())}</span></div>
        </div>
      `).join('')
    : '<div class="no-events">Нет активных событий</div>';

  // Предстоящие
  upcomingEl.innerHTML = filteredUpcoming.length > 0
    ? filteredUpcoming.map(e => `
        <div class="event-card upcoming">
          <div class="event-icon">${getEventIcon(e.name)}</div>
          <div class="event-info">
            <div class="event-name">${e.name}</div>
            <div class="event-location">${getMapIcon(e.map)} ${e.map}</div>
          </div>
          <div class="event-time">Через: <span class="time">${formatTimeMs(e.startTime - Date.now())}</span></div>
        </div>
      `).join('')
    : '<div class="no-events">Нет предстоящих событий</div>';
}

// --- Инициализация фильтров ---
function initFilters() {
  // Получаем уникальные карты и события
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

  // Добавляем обработчики
  mapSelect?.addEventListener('change', applyFilters);
  eventSelect?.addEventListener('change', applyFilters);
}

// --- Отображение главного меню с фильтрами ---
function showArcRaidersMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>🎮 ARC Raiders</h2>

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

    <button class="submenu-btn back-btn" onclick="showMainMenu()">Назад</button>
  `;
  
  initFilters();
  loadEvents();
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

// --- Главное меню ---
function showMainMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <p>Добро пожаловать! Выберите раздел в меню ниже.</p>
    <div class="menu-buttons">
      <button class="menu-btn" onclick="showArcRaidersMenu()">Arc Raiders</button>
      <button class="menu-btn" onclick="showStreamersForm()">Стримерам</button>
    </div>
  `;
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
  // Добавляем стили динамически
  const style = document.createElement('style');
  style.textContent = `
    .filters {
      display: flex; gap: 12px; margin-bottom: 16px;
    }
    .filters select {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background: #f9f9f9;
    }
    .events-list {
      margin-top: 8px;
    }
    .event-card {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .event-card.active {
      border-left: 4px solid #4CAF50;
      background: #f8faf7;
    }
    .event-card.upcoming {
      border-left: 4px solid #FF9800;
      background: #fff8e1;
    }
    .event-icon {
      font-size: 24px;
      margin-right: 12px;
      width: 32px;
      text-align: center;
    }
    .event-info {
      flex: 1;
    }
    .event-name {
      font-weight: bold;
      color: #333;
    }
    .event-location {
      font-size: 14px;
      color: #666;
    }
    .event-time {
      font-size: 14px;
      color: #555;
    }
    .time {
      font-weight: bold;
      color: #d32f2f;
    }
    .no-events {
      color: #999;
      font-style: italic;
      padding: 12px;
    }
    .menu-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 16px;
    }
    .menu-btn {
      padding: 12px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      background: #e0e0e0;
      cursor: pointer;
      transition: background 0.3s;
    }
    .menu-btn:hover {
      background: #cccccc;
    }
    .submenu-btn {
      display: block;
      width: 100%;
      padding: 10px;
      margin: 6px 0;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .back-btn {
      background: #6c757d;
    }
  `;
  document.head.appendChild(style);

  showMainMenu();
});
