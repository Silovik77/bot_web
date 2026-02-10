// Проверяем, запущено ли приложение в Telegram
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;

  // Увеличиваем высоту приложения под содержимое
  tg.ready();
  tg.expand();

  // Функция для показа уведомления
  function showAlert(msg) {
    tg.showAlert(msg);
  }

  // --- Функция для загрузки событий ---
  async function loadEvents() {
    try {
      // Запрашиваем данные с локального сервера
      const response = await fetch('https://arc-raiders-api-render.onrender.com/');
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const data = await response.json();

      // Очищаем содержимое
      const mainContainer = document.querySelector('main');
      mainContainer.innerHTML = '';

      // Заголовок
      const title = document.createElement('h2');
      title.textContent = '📅 ARC Raiders События';
      title.style.gridColumn = '1 / -1';
      mainContainer.appendChild(title);

      // Активные события
      if (data.active && data.active.length > 0) {
        const activeHeader = document.createElement('h3');
        activeHeader.textContent = '🟢 Активные';
        activeHeader.style.gridColumn = '1 / -1';
        mainContainer.appendChild(activeHeader);

        data.active.forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.className = 'event-item active';
          eventDiv.innerHTML = `
            <span class="event-name">${event.name}</span>
            <span class="event-location">${event.location}</span>
            <span class="event-time-left">⏱️ Осталось: ${event.time_left}</span>
          `;
          mainContainer.appendChild(eventDiv);
        });
      } else {
        const noActive = document.createElement('p');
        noActive.textContent = '🟢 Нет активных событий';
        noActive.style.gridColumn = '1 / -1';
        noActive.style.color = '#777';
        mainContainer.appendChild(noActive);
      }

      // Предстоящие события
      if (data.upcoming && data.upcoming.length > 0) {
        const upcomingHeader = document.createElement('h3');
        upcomingHeader.textContent = '🔴 Предстоящие';
        upcomingHeader.style.gridColumn = '1 / -1';
        mainContainer.appendChild(upcomingHeader);

        data.upcoming.forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.className = 'event-item upcoming';
          eventDiv.innerHTML = `
            <span class="event-name">${event.name}</span>
            <span class="event-location">${event.location}</span>
            <span class="event-time-left">⏱️ Начнётся через: ${event.time_left}</span>
          `;
          mainContainer.appendChild(eventDiv);
        });
      } else {
        const noUpcoming = document.createElement('p');
        noUpcoming.textContent = '🔴 Нет предстоящих событий';
        noUpcoming.style.gridColumn = '1 / -1';
        noUpcoming.style.color = '#777';
        mainContainer.appendChild(noUpcoming);
      }

    } catch (error) {
      console.error('Ошибка при загрузке событий:', error);
      // Показываем ошибку в интерфейсе Web App
      const mainContainer = document.querySelector('main');
      mainContainer.innerHTML = `<p style="color: red;">Ошибка: ${error.message}</p>`;
    }
  }

  // --- Назначаем обработчик на кнопку ---
  document.addEventListener('DOMContentLoaded', () => {
    const eventsBtn = document.querySelector('.btn-events'); // Добавим класс в HTML
    if (eventsBtn) {
      eventsBtn.onclick = loadEvents;
    }
  });

} else {
  console.log("Telegram WebApp не обнаружен. Работаю в браузере.");
  // Для тестирования в браузере, можно вывести заглушку
  document.querySelector('main').innerHTML = '<p>Запустите Web App через Telegram бота для получения данных.</p>';
}

