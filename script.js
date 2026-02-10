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

  // Функция для загрузки событий из бота
  async function loadEvents() {
    try {
      // Замените localhost на IP-адрес вашего компьютера или домен, если бот запущен удалённо
      const response = await fetch('http://localhost:8080/api/user_events');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Очищаем контейнер с основным контентом
      const mainContainer = document.querySelector('main');
      mainContainer.innerHTML = '';

      // Добавляем активные события
      if (data.active && data.active.length > 0) {
        const activeHeader = document.createElement('h2');
        activeHeader.textContent = '🟢 Активные события';
        mainContainer.appendChild(activeHeader);

        data.active.forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.className = 'event-item';
          eventDiv.innerHTML = `
            <span class="event-name">${event.name}</span>
            <span class="event-location">${event.location}</span>
            <span class="event-time-left">Осталось: ${event.time_left}</span>
          `;
          mainContainer.appendChild(eventDiv);
        });
      } else {
        const noActive = document.createElement('p');
        noActive.textContent = '🔴 Нет активных событий.';
        noActive.style.gridColumn = '1 / -1';
        mainContainer.appendChild(noActive);
      }

      // Добавляем предстоящие события
      if (data.upcoming && data.upcoming.length > 0) {
        const upcomingHeader = document.createElement('h2');
        upcomingHeader.textContent = '🔴 Предстоящие события';
        mainContainer.appendChild(upcomingHeader);

        data.upcoming.forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.className = 'event-item';
          eventDiv.innerHTML = `
            <span class="event-name">${event.name}</span>
            <span class="event-location">${event.location}</span>
            <span class="event-time-left">Начнётся через: ${event.time_left}</span>
          `;
          mainContainer.appendChild(eventDiv);
        });
      } else {
        const noUpcoming = document.createElement('p');
        noUpcoming.textContent = '🔴 Нет предстоящих событий.';
        noUpcoming.style.gridColumn = '1 / -1';
        mainContainer.appendChild(noUpcoming);
      }

    } catch (error) {
      console.error('Ошибка при загрузке событий:', error);
      showAlert(`Ошибка при загрузке событий: ${error.message}`);
    }
  }

  // Назначаем обработчики на кнопки
  document.getElementById("eventsBtn").addEventListener("click", loadEvents); // Кнопка "События" теперь загружает данные
  document.getElementById("clanBtn").addEventListener("click", () => showAlert("Раздел 'Клан NE' в разработке."));
  document.getElementById("updatesBtn").addEventListener("click", () => showAlert("Обновления игры..."));
  document.getElementById("linksBtn").addEventListener("click", () => showAlert("Открытие списка ссылок..."));

  // Автоматически загружаем события при запуске Web App
  loadEvents();

} else {
  console.log("Telegram WebApp не обнаружен. Работаю в браузере.");
  // Для тестирования в браузере, можно вывести заглушку
  document.querySelector('main').innerHTML = '<p>Запустите Web App через Telegram бота для получения данных.</p>';
}
