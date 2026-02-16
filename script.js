// Укажите ваш реальный URL Amvera (без пробелов!)
const API_URL = 'https://silovik-silovik.waw0.amvera.tech';

// --- Словари перевода ---
const MAP_TRANSLATIONS = {
 "Dam":  "Плотина",
 "Buried City":  "Закопанный город",
 "Spaceport":  "Космопорт",
 "Blue Gate":  "Синие врата",
 "Stella Montis":  "Стелла Монтис"
};
const EVENT_TRANSLATIONS = {
 "Night Raid":  "Ночной налёт",
 "Harvester":  "Жнец",
 "Matriarch":  "Матриарх",
 "Cold Snap":  "Холодная волна",
 "Electromagnetic Storm":  "Электромагнитная буря",
 "Launch Tower Loot":  "Добыча с пусковой башни",
 "Hidden Bunker":  "Скрытый бункер",
 "Husk Graveyard":  "Кладбище Хасков",
 "Prospecting Probes":  "Геологические зонды",
 "Uncovered Caches":  "Обнаруженные тайники",
 "Lush Blooms":  "Пышные цветения",
 "Locked Gate":  "Закрытые врата",
 "Bird City":  "Птичий город"
};

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

// --- Функция для загрузки новостей ---
async function loadNews() {
  try {
    const response = await fetch(`${API_URL}/api/updates`);
    if (!response.ok) {
      throw new Error(`Ошибка сервера при загрузке новостей: ${response.status}`);
    }
    const rawData = await response.json();
    // Проверяем, что поле updates - это массив
    if (!Array.isArray(rawData.updates)) {
      console.warn('⚠️ Поле "updates" в ответе от API не является массивом.', rawData);
      return [];
    }
    return rawData.updates;
  } catch (error) {
    console.error('Ошибка при загрузке новостей:', error);
    return []; // Возвращаем пустой массив в случае ошибки
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
    "Dam":  "💧",
    "Buried City":  "🏙️",
    "Spaceport":  "🚀",
    "Blue Gate":  "🔵",
    "Stella Montis":  "⛰️"
  };
  return icons[map] || "📍";
}

function getEventIcon(name) {
  const icons = {
    "Night Raid":  "🌙",
    "Harvester":  "🪴",
    "Matriarch":  "👑",
    "Cold Snap":  "❄️",
    "Electromagnetic Storm":  "⚡",
    "Launch Tower Loot":  "🎯",
    "Hidden Bunker":  "🔒",
    "Husk Graveyard":  "💀",
    "Prospecting Probes":  "📡",
    "Uncovered Caches":  "📦",
    "Lush Blooms":  "🌿",
    "Locked Gate":  "🚪",
    "Bird City":  "🐦"
  };
  return icons[name] || "❓";
}

// --- Функция применения фильтров ---
function applyFilters() {
  const mapFilter = document.getElementById('filter-map').value;
  const eventFilter = document.getElementById('filter-event').value;
  const allEventCards = document.querySelectorAll('.event-card');

  allEventCards.forEach(card => {
    const eventName = card.querySelector('.event-name').textContent.trim();
    const fullLocationText = card.querySelector('.event-location').textContent.trim();
    const locationParts = fullLocationText.split(' ');
    const originalLocation = locationParts.slice(1).join(' ');

    const translatedLocation = MAP_TRANSLATIONS[originalLocation] || originalLocation;
    const translatedEventName = EVENT_TRANSLATIONS[eventName] || eventName;

    const matchesMap = !mapFilter || translatedLocation === mapFilter;
    const matchesEvent = !eventFilter || translatedEventName === eventFilter;

    if (matchesMap && matchesEvent) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- Отображение главного меню ---
function showMainMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `<p>Добро пожаловать! Выберите раздел в меню ниже.</p><div class="main-menu"><button class="menu-btn" onclick="showArcRaidersMenu()">Arc Raiders</button><button class="menu-btn" onclick="showStreamersForm()">Стримерам</button><button class="menu-btn" onclick="alert('Клан NE — в разработке')">Клан NE</button><button class="menu-btn" onclick="alert('Информация — в разработке')">Информация</button><button class="menu-btn" onclick="alert('Обратная связь — в разработке')">Обратная связь</button></div>`;
}

// --- Отображение меню Arc Raiders ---
function showArcRaidersMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `<h2>🎮 Arc Raiders</h2><button class="submenu-btn" onclick="showEvents()">События</button><button class="submenu-btn" onclick="showNews()">Обновления</button><button class="submenu-btn" onclick="alert('Раздел \\\'Гайды\\\' в разработке.')">Гайды</button><button class="submenu-btn" onclick="alert('Раздел \\\'Испытание\\\' в разработке.')">Испытание</button><button class="submenu-btn back-btn" onclick="showMainMenu()">Назад</button>`;
}

// --- Отображение новостей ---
async function showNews() {
  try {
    const newsData = await loadNews();
    const mainContent = document.getElementById('main-content');

    if (newsData.length === 0) {
      mainContent.innerHTML = '<h2>📰 Новости игры</h2><p>Нет доступных новостей.</p><button class="submenu-btn back-btn" onclick="showArcRaidersMenu()">Назад</button>';
      return;
    }

    let html = '<h2>📰 Новости игры</h2>';

    newsData.forEach(item => {
      // Используем квадратные скобки для доступа к ключам, чтобы избежать проблем с пробелами
      const title = item['title_ru'] || item['title'] || 'Заголовок недоступен';
      const summary = item['summary_ru'] || item['summary'] || '';
      const date = item['date'] || '';
      const url = item['url'] || '#';

      html += `
        <div class="news-item">
          <h3>${title}</h3>
          <p>${summary}</p>
          <small>${date}</small>
          <a href="${url}" target="_blank">🔗 Читать далее</a>
        </div>
      `;
    });

    html += '<button class="submenu-btn back-btn" onclick="showArcRaidersMenu()">Назад</button>';
    mainContent.innerHTML = html;

  } catch (error) {
    console.error('Ошибка при отображении новостей:', error);
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `<p style="color: red;">❌ Ошибка: ${error.message}</p><button class="submenu-btn back-btn" onclick="showArcRaidersMenu()">Назад</button>`;
  }
}

// --- Отображение событий ---
async function showEvents() {
  try {
    const rawData = await loadEvents();
    let activeEvents = [];
    let upcomingEvents = [];

    if (Array.isArray(rawData.active) && Array.isArray(rawData.upcoming)) {
      activeEvents = rawData.active;
      upcomingEvents = rawData.upcoming;
    } else if (Array.isArray(rawData.data)) {
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

    upcomingEvents.sort((a, b) => parseTimeStr(a.time_left) - parseTimeStr(b.time_left));

    const uniqueOriginalMaps = [...new Set([...activeEvents, ...upcomingEvents].map(e => e.location))].sort();
    const uniqueOriginalEvents = [...new Set([...activeEvents, ...upcomingEvents].map(e => e.name))].sort();

    const uniqueTranslatedMaps = uniqueOriginalMaps.map(original => MAP_TRANSLATIONS[original] || original);
    const uniqueTranslatedEvents = uniqueOriginalEvents.map(original => EVENT_TRANSLATIONS[original] || original);

    const mainContent = document.getElementById('main-content');
    let html = '<h2>📅 События ARC Raiders</h2>';

    html += `
      <div class="filters">
        <select id="filter-map">
          <option value="">Все карты</option>
          ${uniqueTranslatedMaps.map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <select id="filter-event">
          <option value="">Все события</option>
          ${uniqueTranslatedEvents.map(n => `<option value="${n}">${n}</option>`).join('')}
        </select>
      </div>
    `;

    if (activeEvents.length > 0) {
      html += '<h3>🟢 Активные</h3>';
      activeEvents.forEach(e => {
        const displayName = EVENT_TRANSLATIONS[e.name] || e.name;
        const displayLocation = MAP_TRANSLATIONS[e.location] || e.location;
        html += `
          <div class="event-card active">
            <div class="event-icon">${getEventIcon(e.name)}</div>
            <div class="event-info">
              <div class="event-name">${displayName}</div>
              <div class="event-location">${getMapIcon(e.location)} ${displayLocation}</div>
            </div>
            <div class="event-time">⏱️ Осталось: ${e.time_left}</div>
          </div>
        `;
      });
    } else {
      html += '<p class="no-data">🟢 Нет активных событий</p>';
    }

    if (upcomingEvents.length > 0) {
      html += '<h3>🔴 Предстоящие</h3>';
      upcomingEvents.forEach(e => {
        const displayName = EVENT_TRANSLATIONS[e.name] || e.name;
        const displayLocation = MAP_TRANSLATIONS[e.location] || e.location;
        html += `
          <div class="event-card upcoming">
            <div class="event-icon">${getEventIcon(e.name)}</div>
            <div class="event-info">
              <div class="event-name">${displayName}</div>
              <div class="event-location">${getMapIcon(e.location)} ${displayLocation}</div>
            </div>
            <div class="event-time">⏱️ Начнётся через: ${e.time_left}</div>
          </div>
        `;
      });
    } else {
      html += '<p class="no-data">🔴 Нет предстоящих событий</p>';
    }

    html += '<button class="submenu-btn back-btn" onclick="showArcRaidersMenu()">Назад</button>';
    mainContent.innerHTML = html;

    document.getElementById('filter-map')?.addEventListener('change', applyFilters);
    document.getElementById('filter-event')?.addEventListener('change', applyFilters);
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
    📺 Стримерам
    Подключите бота к своему каналу, чтобы получать уведомления о начале стрима.
    <label for="channel-id">ID вашего Telegram-канала:</label>
    <input type="text" id="channel-id" placeholder="Например: 123456789" required>
    <label for="twitch-url">Ссылка на Twitch/YouTube:</label>
    <input type="url" id="twitch-url" placeholder="https://twitch.tv/your_name" required>
    <button type="submit" class="submenu-btn" onclick="registerStreamer()">Подключить</button>
    <button class="submenu-btn back-btn" onclick="showMainMenu()">Назад</button>
  `;
}

// --- Регистрация стримера ---
async function registerStreamer() {
  const channelId = document.getElementById('channel-id')?.value || '';
  const twitchUrl = document.getElementById('twitch-url')?.value || '';
  try {
    const response = await fetch(`${API_URL}/api/register_streamer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel_id: channelId, twitch_url: twitchUrl })
    });

    if (response.ok) {
      const result = await response.json();
      alert(result.message || '✅ Вы успешно подключили бота!');
      showMainMenu();
    } else {
      const error = await response.json();
      alert(`❌ Ошибка: ${error.error || 'Неизвестная ошибка'}`);
    }
  } catch (error) {
    console.error('Ошибка при подключении:', error);
    alert('❌ Не удалось подключиться к серверу. Проверьте консоль.');
  }
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
});
