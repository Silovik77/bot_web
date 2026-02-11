// Укажите ваш реальный URL
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

// --- Отображение событий ---
async function showEvents() {
  try {
    const data = await loadEvents();
    const mainContent = document.getElementById('main-content');
    
    let html = '<h2>📅 События ARC Raiders</h2>';
    
    // Активные события
    if (data.active && data.active.length > 0) {
      html += '<h3>🟢 Активные</h3>';
      data.active.forEach(event => {
        html += `
          <div class="event-item active">
            <span class="event-name">${event.name}</span>
            <span class="event-location">${event.location}</span>
            <span class="event-time-left">⏱️ Осталось: ${event.time_left}</span>
          </div>
        `;
      });
    } else {
      html += '<p class="no-data">🟢 Нет активных событий</p>';
    }

    // Предстоящие события
    if (data.upcoming && data.upcoming.length > 0) {
      html += '<h3>🔴 Предстоящие</h3>';
      data.upcoming.forEach(event => {
        html += `
          <div class="event-item upcoming">
            <span class="event-name">${event.name}</span>
            <span class="event-location">${event.location}</span>
            <span class="event-time-left">⏱️ Начнётся через: ${event.time_left}</span>
          </div>
        `;
      });
    } else {
      html += '<p class="no-data">🔴 Нет предстоящих событий</p>';
    }

    html += '<button class="submenu-btn back-btn" onclick="showArcRaidersMenu()">Назад</button>';
    mainContent.innerHTML = html;

  } catch (error) {
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
