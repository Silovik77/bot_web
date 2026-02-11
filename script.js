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

    // Сортируем предстоящие по времени (без лимита)
    upcomingEvents.sort((a, b) => {
      const aSec = parseTimeStr(a.time_left);
      const bSec = parseTimeStr(b.time_left);
      return aSec - bSec;
    });
    // upcomingEvents = upcomingEvents.slice(0, 10); // Убрали лимит

    // 🎯 Получаем уникальные значения для фильтров
    const allEventsCombined = [...activeEvents, ...upcomingEvents];
    const uniqueMaps = [...new Set(allEventsCombined.map(e => e.location))].sort();
    const uniqueEvents = [...new Set(allEventsCombined.map(e => e.name))].sort();

    const mainContent = document.getElementById('main-content');
    let html = '<h2>📅 События ARC Raiders</h2>';

    // Фильтры
    html += `
      <div class="filters">
        <select id="filter-map">
          <option value="">Все карты</option>
          ${uniqueMaps.map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <select id="filter-event">
          <option value="">Все события</option>
          ${uniqueEvents.map(n => `<option value="${n}">${n}</option>`).join('')}
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

    // 🎯 Добавляем обработчики для фильтров
    document.getElementById('filter-map')?.addEventListener('change', applyFilters);
    document.getElementById('filter-event')?.addEventListener('change', applyFilters);

  } catch (error) {
    console.error('Ошибка при загрузке событий:', error);
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `<p style="color: red;">❌ Ошибка: ${error.message}</p><button class="submenu-btn back-btn" onclick="showArcRaidersMenu()">Назад</button>`;
  }
}
