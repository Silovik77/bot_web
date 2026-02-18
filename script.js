// Укажите ваш реальный URL Amvera (без пробелов!)
const API_URL = 'https://silovik-silovik.waw0.amvera.tech';

// --- Словари перевода ---
const MAP_TRANSLATIONS = {
  "Dam": "Плотина",
  "Buried City": "Закопанный город",
  "Spaceport": "Космопорт",
  "Blue Gate": "Синие врата",
  "Stella Montis": "Стелла Монтис"
};
const EVENT_TRANSLATIONS = {
  "Night Raid": "Ночной налёт",
  "Harvester": "Жнец",
  "Matriarch": "Матриарх",
  "Cold Snap": "Холодная волна",
  "Electromagnetic Storm": "Электромагнитная буря",
  "Launch Tower Loot": "Добыча с пусковой башни",
  "Hidden Bunker": "Скрытый бункер",
  "Husk Graveyard": "Кладбище Хасков",
  "Prospecting Probes": "Геологические зонды",
  "Uncovered Caches": "Обнаруженные тайники",
  "Lush Blooms": "Пышные цветения",
  "Locked Gate": "Закрытые врата",
  "Bird City": "Птичий город"
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
    if (!Array.isArray(rawData.updates)) {
      console.warn('⚠️ Поле "updates" в ответе от API не является массивом.', rawData);
      return [];
    }
    return rawData.updates;
  } catch (error) {
    console.error('Ошибка при загрузке новостей:', error);
    return [];
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
    "Locked Gate": "🚪",
    "Bird City": "🐦"
  };
  return icons[name] || "❓";
}

// --- Функция применения фильтров ---
function applyFilters() {
  const mapFilter = document.getElementById('filter-map')?.value;
  const eventFilter = document.getElementById('filter-event')?.value;
  const allEventCards = document.querySelectorAll('.event-card');
  allEventCards.forEach(card => {
    const eventName = card.querySelector('.event-name')?.textContent.trim();
    const fullLocationText = card.querySelector('.event-location')?.textContent.trim();
    if (!eventName || !fullLocationText) return;
    const locationParts = fullLocationText.split(' ');
    const locationText = locationParts.slice(1).join(' ').trim();
    const matchesMap = !mapFilter || locationText === mapFilter;
    const matchesEvent = !eventFilter || eventName === eventFilter;
    if (matchesMap && matchesEvent) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- Отображение главного меню ---
window.showMainMenu = function() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <p>Добро пожаловать! Выберите раздел в меню ниже.</p>
    <div class="main-menu">
      <button class="menu-btn" onclick="window.showArcRaidersMenu()">Arc Raiders</button>
      <button class="menu-btn" onclick="window.showStreamersForm()">Стримерам</button>
      <button class="menu-btn" onclick="window.showClanNEPage()">Клан NE</button>
      <button class="menu-btn" onclick="alert('Информация — в разработке')">Информация</button>
      <button class="menu-btn" onclick="alert('Обратная связь — в разработке')">Обратная связь</button>
    </div>
  `;
};

// --- Отображение меню Arc Raiders ---
window.showArcRaidersMenu = function() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>🎮 Arc Raiders</h2>
    <button class="submenu-btn" onclick="window.showEvents()">События</button>
    <button class="submenu-btn" onclick="window.showNews()">Обновления</button>
    <button class="submenu-btn" onclick="alert('Раздел \'Гайды\' в разработке.')">Гайды</button>
    <button class="submenu-btn" onclick="alert('Раздел \'Испытание\' в разработке.')">Испытание</button>
    <button class="submenu-btn back-btn" onclick="window.showMainMenu()">Назад</button>
  `;
};

// --- Отображение новостей ---
window.showNews = async function() {
  try {
    const newsData = await loadNews();
    const mainContent = document.getElementById('main-content');
    if (newsData.length === 0) {
      mainContent.innerHTML = `
        <h2>📰 Новости игры</h2>
        <p>Нет доступных новостей.</p>
        <button class="submenu-btn back-btn" onclick="window.showArcRaidersMenu()">Назад</button>
      `;
      return;
    }
    let html = '<h2>📰 Новости игры</h2>';
    newsData.forEach(item => {
      const title = item['title_ru'] || item['title'] || 'Заголовок недоступен';
      const summary = (item['summary_ru'] || item['summary'] || '').replace(/\n/g, '<br>');
      const date = item['date'] || '';
      const url = item['url'] || '#';
      html += `
        <div class="news-item">
          <h3>${title}</h3>
          <p>${summary}</p>
          <small>${date}</small><br>
          <a href="${url}" target="_blank">🔗 Читать далее</a>
        </div>
      `;
    });
    html += '<button class="submenu-btn back-btn" onclick="window.showArcRaidersMenu()">Назад</button>';
    mainContent.innerHTML = html;
  } catch (error) {
    console.error('Ошибка при отображении новостей:', error);
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <p style="color: red;">❌ Ошибка: ${error.message}</p>
      <button class="submenu-btn back-btn" onclick="window.showArcRaidersMenu()">Назад</button>
    `;
  }
};

// --- Отображение событий ---
window.showEvents = async function() {
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
    html += '<button class="submenu-btn back-btn" onclick="window.showArcRaidersMenu()">Назад</button>';
    mainContent.innerHTML = html;
    setTimeout(() => {
      document.getElementById('filter-map')?.addEventListener('change', applyFilters);
      document.getElementById('filter-event')?.addEventListener('change', applyFilters);
    }, 0);
  } catch (error) {
    console.error('Ошибка при загрузке событий:', error);
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <p style="color: red;">❌ Ошибка: ${error.message}</p>
      <button class="submenu-btn back-btn" onclick="window.showArcRaidersMenu()">Назад</button>
    `;
  }
};

// --- Отображение формы для стримеров ---
window.showStreamersForm = function() {
  const mainContent = document.getElementById('main-content');
  const isRegistered = localStorage.getItem('streamer_channel_id');
  
  let html = `
    <h2>📺 Стримерам</h2>
    <p>Подключите бота к своему каналу, чтобы получать уведомления о начале стрима.</p>
    
    <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #ffc107;">
      <p style="margin: 0; text-align: left; color: #856404; font-size: 14px;">
        <strong>⚠️ Важно:</strong> Не забудьте добавить бота в свой Telegram-канал с правами администратора!
      </p>
    </div>
  `;
  
  if (isRegistered) {
    html += `
      <div style="background: #d4edda; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #28a745;">
        <p style="margin: 0 0 12px 0; text-align: left;"><strong>✅ Бот уже подключен!</strong></p>
        <p style="margin: 0 0 12px 0; text-align: left; font-size: 14px;">Вы будете получать уведомления о начале стрима.</p>
        <button class="submenu-btn" style="background: #dc3545;" onclick="window.unregisterStreamer()">
          🔕 Отключить канал
        </button>
      </div>
    `;
  } else {
    html += `
      <div style="margin: 20px 0;">
        <label for="channel-id">ID вашего Telegram-канала:</label><br>
        <input type="text" id="channel-id" placeholder="Например: 123456789" required style="width:100%; padding:8px; margin:8px 0;">
      </div>
      <div style="margin: 20px 0;">
        <label for="twitch-url">Ссылка на Twitch/YouTube:</label><br>
        <input type="url" id="twitch-url" placeholder="https://twitch.tv/your_name" required style="width:100%; padding:8px; margin:8px 0;">
      </div>
      <button class="submenu-btn" onclick="window.registerStreamer()">Подключить</button>
    `;
  }
  
  html += `
    <button class="submenu-btn" style="background:#e67e22; margin-top:10px;" onclick="window.sendManualNotification()">🔔 Отправить уведомление вручную</button>
    <button class="submenu-btn back-btn" onclick="window.showMainMenu()">Назад</button>
  `;
  mainContent.innerHTML = html;
};

// --- Регистрация стримера ---
window.registerStreamer = async function() {
  const channelId = document.getElementById('channel-id')?.value || '';
  const twitchUrl = document.getElementById('twitch-url')?.value || '';
  if (!channelId || !twitchUrl) {
    alert('❌ Пожалуйста, заполните все поля');
    return;
  }
  try {
    const response = await fetch(`${API_URL}/api/register_streamer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel_id: channelId, twitch_url: twitchUrl })
    });
    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('streamer_channel_id', channelId);
      alert(result.message || '✅ Вы успешно подключили бота!');
      window.showStreamersForm();
    } else {
      const error = await response.json();
      alert(`❌ Ошибка: ${error.error || 'Неизвестная ошибка'}`);
    }
  } catch (error) {
    console.error('Ошибка при подключении:', error);
    alert('❌ Не удалось подключиться к серверу. Проверьте консоль.');
  }
};

// --- Отключение стримера ---
window.unregisterStreamer = async function() {
  const channelId = localStorage.getItem('streamer_channel_id');
  if (!channelId) {
    alert('❌ Сначала подключите бота, чтобы отключить его.');
    return;
  }
  if (!confirm('⚠️ Вы уверены, что хотите отключить уведомления о стримах?')) {
    return;
  }
  try {
    const response = await fetch(`${API_URL}/api/unregister_streamer`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel_id: channelId })
    });
    
    // Очищаем localStorage в любом случае
    localStorage.removeItem('streamer_channel_id');
    
    if (response.ok || response.status === 404) {
      alert('✅ Вы успешно отключили бота!');
      window.showStreamersForm();
    } else {
      const error = await response.json();
      alert(`❌ Ошибка: ${error.error || 'Неизвестная ошибка'}`);
    }
  } catch (error) {
    console.error('Ошибка при отключении:', error);
    localStorage.removeItem('streamer_channel_id');
    alert('❌ Не удалось отключиться. Проверьте консоль.');
  }
};

// --- Ручная отправка уведомления ---
window.sendManualNotification = async function() {
  if (!confirm('⚠️ Вы уверены, что хотите отправить ручное уведомление о стриме?\n\nЭто отправит сообщение всем подключенным каналам.')) {
    return;
  }
  try {
    const response = await fetch(`${API_URL}/api/send_manual_notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      const result = await response.json();
      alert(`✅ ${result.message}\n\nУспешно: ${result.sent}\nОшибок: ${result.failed}`);
    } else {
      const error = await response.json();
      alert(`❌ Ошибка: ${error.error || 'Неизвестная ошибка'}`);
    }
  } catch (error) {
    console.error('Ошибка при ручной отправке:', error);
    alert('❌ Не удалось отправить уведомление. Проверьте консоль.');
  }
};

// --- Отображение раздела Клан NE ---
window.showClanNEPage = async function() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `<h2>⚔️ Клан NE</h2><p>Загрузка информации...</p>`;
  try {
    const response = await fetch(`${API_URL}/api/clan_info`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    let html = `<h2>⚔️ Клан NE</h2>`;
    html += `<p>${data.clan_info_text}</p>`;
    html += `<button class="submenu-btn" style="background:#2ecc71; margin-top:10px;" onclick="window.open('https://discord.gg/nevskiy', '_blank')">➕ Подать заявку в клан</button>`;
    html += `<button class="submenu-btn" style="background:#3498db; margin-top:10px;" onclick="alert('Используйте команду /ne_subscribe в боте')">📢 Подписаться на уведомления</button>`;
    html += `<button class="submenu-btn" style="background:#e74c3c; margin-top:10px;" onclick="alert('Используйте команду /ne_unsubscribe в боте')">🔕 Отписаться от уведомлений</button>`;
    if (data.has_givs) {
      html += `<h3>🎁 Розыгрыши:</h3>`;
      data.givs.forEach(giv => {
        html += `<div class="news-item"><p>${giv.description}</p></div>`;
      });
    }
    if (data.has_events) {
      html += `<h3>📋 Мероприятия:</h3>`;
      data.events.forEach(event => {
        html += `<div class="news-item"><p>${event.description}</p></div>`;
      });
    } else {
      html += `<p>На данный момент нет запланированных мероприятий.</p>`;
    }
    html += `<button class="submenu-btn back-btn" onclick="window.showMainMenu()">Назад</button>`;
    mainContent.innerHTML = html;
  } catch (error) {
    console.error('Ошибка загрузки информации о клане:', error);
    mainContent.innerHTML = `
      <p style="color: red;">❌ Ошибка: ${error.message}</p>
      <button class="submenu-btn back-btn" onclick="window.showMainMenu()">Назад</button>
    `;
  }
};

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
  window.showMainMenu();
});
