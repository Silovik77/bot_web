// Укажите ваш реальный URL Amvera
const API_URL = 'https://silovik-silovik.waw0.amvera.tech';

// --- Глобальные переменные ---
let allEvents = [];

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
  } catch (e) {
    console.error("Ошибка загрузки событий:", e);
    alert("Не удалось загрузить события.");
  }
}

// --- Отображение событий ---
function showEvents() {
  // Фильтрация
  const currentTimestamp = Date.now();
  const activeEvents = allEvents.filter(e => 
    e.startTime <= currentTimestamp && currentTimestamp < e.endTime
  );
  const upcomingEvents = allEvents.filter(e => 
    currentTimestamp < e.startTime
  ).slice(0, 10); // Максимум 10

  const mainContent = document.getElementById('main-content');
  let html = '<h2>📅 События ARC Raiders</h2>';

  // Фильтры
  const maps = [...new Set(allEvents.map(e => e.map))].sort();
  const events = [...new Set(allEvents.map(e => e.name))].sort();

  html += `
    <div class="filters">
      <select id="filter-map">
        <option value="">Все карты</option>
        ${maps.map(m => `<option value="${m}">${m}</option>`).join('')}
      </select>
      <select id="filter-event">
        <option value="">Все события</option>
        ${events.map(n => `<option value="${n}">${n}</option>`).join('')}
      </select>
    </div>
  `;

  // Активные
  html += '<h3>🟢 Активные</h3>';
  if (activeEvents.length > 0) {
    html += activeEvents.map(e => `
      <div class="event-card active">
        <div class="event-icon">${getEventIcon(e.name)}</div>
        <div class="event-info">
          <div class="event-name">${e.name}</div>
          <div class="event-location">${getMapIcon(e.map)} ${e.map}</div>
        </div>
        <div class="event-time">Осталось: <span class="time">${formatTimeMs(e.endTime - Date.now())}</span></div>
      </div>
    `).join('');
  } else {
    html += '<div class="no-events">Нет активных событий</div>';
  }

  // Предстоящие
  html += '<h3>🔴 Предстоящие</h3>';
  if (upcomingEvents.length > 0) {
    html += upcomingEvents.map(e => `
      <div class="event-card upcoming">
        <div class="event-icon">${getEventIcon(e.name)}</div>
        <div class="event-info">
          <div class="event-name">${e.name}</div>
          <div class="event-location">${getMapIcon(e.map)} ${e.map}</div>
        </div>
        <div class="event-time">Через: <span class="time">${formatTimeMs(e.startTime - Date.now())}</span></div>
      </div>
    `).join('');
  } else {
    html += '<div class="no-events">Нет предстоящих событий</div>';
  }

  html += '<button class="submenu-btn back-btn" onclick="showArcRaidersMenu()">Назад</button>';
  mainContent.innerHTML = html;

  // Добавляем обработчики фильтров
  document.getElementById('filter-map')?.addEventListener('change', applyFilters);
  document.getElementById('filter-event')?.addEventListener('change', applyFilters);
}

// --- Применение фильтров ---
function applyFilters() {
  const mapFilter = document.getElementById('filter-map').value;
  const eventFilter = document.getElementById('filter-event').value;
  const currentTimestamp = Date.now();

  const activeFiltered = allEvents.filter(e => 
    e.startTime <= currentTimestamp && currentTimestamp < e.endTime &&
    (!mapFilter || e.map === mapFilter) &&
    (!eventFilter || e.name === eventFilter)
  );

  const upcomingFiltered = allEvents.filter(e => 
    currentTimestamp < e.startTime &&
    (!mapFilter || e.map === mapFilter) &&
    (!eventFilter || e.name === eventFilter)
  ).slice(0, 10);

  // Обновляем только списки событий
  const activeEl = document.querySelector('#main-content h3:nth-of-type(1) + div.events-list, #main-content .no-events:first-of-type ~ div, #main-content h3:nth-of-type(1) + .no-events');
  const upcomingEl = document.querySelector('#main-content h3:nth-of-type(2) + div.events-list, #main-content .no-events:last-of-type');

  // Лучше перерисовать полностью (для простоты)
  showEvents();
}

// --- Меню Arc Raiders ---
function showArcRaidersMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>🎮 Arc Raiders</h2>
    <button class="submenu-btn" onclick="showEventsPage()">События</button>
    <button class="submenu-btn" onclick="alert('Раздел «Испытание» в разработке.')">Испытание</button>
    <button class="submenu-btn" onclick="alert('Раздел «Обновления» в разработке.')">Обновления</button>
    <button class="submenu-btn" onclick="alert('Раздел «Гайды» в разработке.')">Гайды</button>
    <button class="submenu-btn back-btn" onclick="showMainMenu()">Назад</button>
  `;
  loadEvents(); // Загружаем события в фоне
}

// --- Вспомогательная функция для отображения событий ---
function showEventsPage() {
  showEvents();
}

// --- Главное меню ---
function showMainMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <p>Добро пожаловать! Выберите раздел в меню ниже.</p>
    <button class="menu-btn" onclick="showArcRaidersMenu()">Arc Raiders</button>
    <button class="menu-btn" onclick="showStreamersForm()">Стримерам</button>
  `;
}

// --- Форма для стримеров ---
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

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
});
