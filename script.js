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

  // Назначаем обработчики на кнопки
  document.getElementById("eventsBtn").addEventListener("click", () => {
    showAlert("Переход к событиям ARC Raiders...");
    // Здесь вы можете отправить данные боту или открыть новую страницу
  });

  document.getElementById("clanBtn").addEventListener("click", () => {
    showAlert("Раздел 'Клан NE' в разработке.");
  });

  document.getElementById("updatesBtn").addEventListener("click", () => {
    showAlert("Обновления игры...");
  });

  document.getElementById("linksBtn").addEventListener("click", () => {
    showAlert("Открытие списка ссылок...");
  });

} else {
  console.log("Telegram WebApp не обнаружен. Работаю в браузере.");
}