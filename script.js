// Простая заглушка для тестирования
document.addEventListener('DOMContentLoaded', () => {
  const mainContainer = document.querySelector('main');
  mainContainer.innerHTML = `
    <button class="nav-btn btn-primary">📅 События</button>
    <button class="nav-btn btn-secondary">⚔️ Клан NE</button>
    <button class="nav-btn btn-accent">📢 Обновления</button>
    <button class="nav-btn btn-info">🔗 Ссылки</button>
  `;
});
