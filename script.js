// Укажите ваш реальный URL Amvera
const API_URL = 'https://silovik-silovik.waw0.amvera.tech';

// --- Функция для загрузки событий ---
async function loadEvents() {
  try {
    const response = await fetch(`${API_URL}/api/user_events`);
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
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

// --- Отображение главного меню (как было раньше) ---
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

// --- Отображение меню Arc Raiders (только подменю, без событий) ---
function showArcRaidersMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>🎮 Arc Raiders</h2>
    <button class="submenu-btn" onclick="showEvents()">События</button>
    <button class="submenu-btn" onclick="alert('Раздел \\'Обновления\\' в разработке.')">Обновления</button>
    <button class="submenu-btn" onclick="alert('Раздел \\'Гайды\\' в разработке.')">Гайды</button>
    <button class="submenu-btn" onclick="alert('Раздел \\'Испытание\\' в разработке.')">Испытание</button>
    <button class="submenu-btn back-btn" onclick="showMainMenu()">Назад</button>
  `;
}

// --- Отображение событий (отдельная страница) ---
async function showEvents() {
  try {
    const rawData = await loadEvents();

    let activeEvents = [];
    let upcomingEvents = [];

    // 🎯 Поддержка старого формата: {"active": [...], "upcoming": [...]}
    if (Array.isArray(rawData.active) && Array.isArray(rawData.upcoming)) {
      activeEvents = rawData.active;
      upcomingEvents = rawData.upcoming;
    } else if (Array.isArray(rawData.data)) {
      // Новый формат: {"data": [...]}
      const events = rawData.data;
      const currentTimestamp = Date.now();

      for (const event of events) {
        const name = event.name || 'Неизвестное событие';
        const location = event.map || 'Неизвестная карта';
        const start = event.startTime;
        const end = event.endTime;

        if (!start || !end) continue;

        if (start <= currentTimestamp && currentTimestamp < end) {
          const timeLeftMs = end - currentTimestamp;
          const timeLeftStr = formatTimeMs(timeLeftMs);
          activeEvents.push({ name, location, time_left: timeLeftStr });
        } else if (currentTimestamp < start) {
          const timeToStartMs = start - currentTimestamp;
          const timeToStartStr = formatTimeMs(timeToStartMs);
          upcomingEvents.push({ name, location, time_left: timeToStartStr });
        }
      }
    } else {
      throw new Error("Неизвестный формат ответа API");
    }

    // Сортируем предстоящие по времени (лимит 10)
    upcomingEvents.sort((a, b) => {
      const aSec = parseTimeStr(a.time_left);
      const bSec = parseTimeStr(b.time_left);
      return aSec - bSec;
    });
    upcomingEvents = upcomingEvents.slice(0, 10);

    const mainContent = document.getElementById('main-content');
    let html = '<h2>📅 События ARC Raiders</h2>';

    // Фильтры
    html += `
      <div class="filters">
        <select id="filter-map">
          <option value="">Все карты</option>
        </select>
        <select id="filter-event">
          <option value="">Все события</option>
        </select>
      </div>
    `;

    // Активные
    if (activeEvents.length > 0) {
      html += '<h3>🟢 Активные</h3>';
      activeEvents.forEach(e => {
        html += `<div class="event-card active"><div class="event-icon">${getEventIcon(e.name)}</div><div class="event-info"><div class="event-name">${e.name}</div><div class="event-location">${getMapIcon(e.location)} ${e.location}</div></div><div class="event-time">⏱️ Осталось: ${e.time_left}</div></div>`;
      });
    } else {
      html += '<p class="no-data">🟢 Нет активных событий</p>';
    }

    // Предстоящие
    if (upcomingEvents.length > 0) {
      html += '<h3>🔴 Предстоящие</h3>';
      upcomingEvents.forEach(e => {
        html += `<div class="event-card upcoming"><div class="event-icon">${getEventIcon(e.name)}</div><div class="event-info"><div class="event-name">${e.name}</div><div class="event-location">${getMapIcon(e.location)} ${e.location}</div></div><div class="event-time">⏱️ Начнётся через: ${e.time_left}</div></div>`;
      });
    } else {
      html += '<p class="no-data">🔴 Нет предстоящих событий</p>';
    }

    html += '<button class="submenu-btn back-btn" onclick="showArcRaidersMenu()">Назад</button>';
    mainContent.innerHTML = html;

  } catch (error) {
    console.error('Ошибка при загрузке событий:', error);
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `<p style="color: red;">❌ Ошибка: ${error.message}</p><button class="submenu-btn back-btn" onclick="showArcRaidersMenu()">Назад</button>`;
  }
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
      console.error('Ошибка при подключении:', error);
      alert('❌ Не удалось подключиться к серверу.');
    }
  });
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
});
