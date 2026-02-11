// Укажите ваш реальный URL Amvera
const API_URL = 'https://silovik-silovik.waw0.amvera.tech';

// --- Функция для загрузки событий ---
async function loadEvents() {
  try {
    const response = await fetch(`${API_URL}/api/user_events`);
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке событий:', error);
    throw error;
  }
}

// --- Отображение меню Arc Raiders ---
function showArcRaidersMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>🎮 Arc Raiders</h2>
    <button class="submenu-btn" onclick="showEvents()">События</button>
    <button class="submenu-btn" onclick="alert('Раздел \\'Обновления\\' в разработке.')">Обновления</button>
    <button class="submenu-btn" onclick="alert('Раздел \\'Гайды\\' в разработке.')">Гайды</button>
    <button class="submenu-btn back-btn" onclick="showMainMenu()">Назад</button>
  `;
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

// --- Отображение событий ---
async function showEvents() {
  try {
    const rawData = await loadEvents();
    
    // Парсим сырые данные из API MetaForge
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

    const mainContent = document.getElementById('main-content');
    let html = '<h2>📅 События ARC Raiders</h2>';

    // Активные
    if (activeEvents.length > 0) {
      html += '<h3>🟢 Активные</h3>';
      activeEvents.forEach(e => {
        html += `<div class="event-item active"><span class="event-name">${e.name}</span><span class="event-location">${e.location}</span><span class="event-time-left">⏱️ Осталось: ${e.time_left}</span></div>`;
      });
    } else {
      html += '<p class="no-data">🟢 Нет активных событий</p>';
    }

    // Предстоящие
    if (upcomingEvents.length > 0) {
      html += '<h3>🔴 Предстоящие</h3>';
      upcomingEvents.forEach(e => {
        html += `<div class="event-item upcoming"><span class="event-name">${e.name}</span><span class="event-location">${e.location}</span><span class="event-time-left">⏱️ Начнётся через: ${e.time_left}</span></div>`;
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

  // Обработчик отправки формы
  document.getElementById('streamer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const channelId = document.getElementById('channel-id').value;
    const twitchUrl = document.getElementById('twitch-url').value;

    try {
      const response = await fetch(`${API_URL}/api/register_streamer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

// --- Отображение главного меню ---
function showMainMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = '<p>Добро пожаловать! Выберите раздел в меню ниже.</p>';
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
});
