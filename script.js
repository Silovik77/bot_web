// --- Функция для загрузки событий ---
async function loadEvents() {
  try {
    // Замените URL на ваш Render-адрес или localhost (если тестируете локально)
    const response = await fetch('https://arc-raiders-api-render.onrender.com/');
    // Если тестируете локально, используйте:
    // const response = await fetch('http://localhost:8080/api/user_events');

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
    const mainContainer = document.querySelector('main');
    mainContainer.innerHTML = `<p style="color: red;">Ошибка: ${error.message}</p>`;
  }
}

// --- Инициализация: всегда показываем кнопки, даже без Telegram ---
document.addEventListener('DOMContentLoaded', () => {
  // Создаём кнопки вручную, если их нет
  const mainContainer = document.querySelector('main');
  if (mainContainer.children.length === 0) {
    mainContainer.innerHTML = `
      <button class="nav-btn btn-primary" onclick="loadEvents()">
        <span>📅 События</span>
      </button>
      <button class="nav-btn btn-secondary" onclick="alert('Клан NE')">
        <span>⚔️ Клан NE</span>
      </button>
      <button class="nav-btn btn-accent" onclick="alert('Обновления')">
        <span>📢 Обновления</span>
      </button>
      <button class="nav-btn btn-info" onclick="alert('Ссылки')">
        <span>🔗 Ссылки</span>
      </button>
    `;
  }

  // Добавляем обработчик к первой кнопке
  const eventsBtn = document.querySelector('.btn-primary');
  if (eventsBtn) {
    eventsBtn.onclick = loadEvents;
  }
});
