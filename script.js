// --- Отображение меню Arc Raiders ---
function showArcRaidersMenu() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>🎮 Arc Raiders</h2>
    <button class="submenu-btn" onclick="alert('Раздел \\'События\\' временно недоступен.')">События</button>
    <button class="submenu-btn" onclick="alert('Раздел \\'Обновления\\' в разработке.')">Обновления</button>
    <button class="submenu-btn" onclick="alert('Раздел \\'Гайды\\' в разработке.')">Гайды</button>
    <button class="submenu-btn back-btn" onclick="showMainMenu()">Назад</button>
  `;
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
      // ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ URL RENDER ДЛЯ API
      const response = await fetch('http://localhost:8080/api/register_streamer', {
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
      alert('❌ Не удалось подключиться к серверу. Убедитесь, что бот запущен.');
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
