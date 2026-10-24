(() => {
  const target = new Date('2026-11-07T17:00:00-03:00').getTime();
  const fields = Object.fromEntries([...document.querySelectorAll('[data-count]')].map(el => [el.dataset.count, el]));
  const countdown = document.querySelector('.countdown');
  const label = document.querySelector('.countdown-label');
  const ended = document.querySelector('.countdown-ended');
  let interval;
  const update = () => {
    const remaining = Math.floor((target - Date.now()) / 1000);
    if (remaining <= 0) {
      countdown.hidden = true;
      label.hidden = true;
      ended.hidden = false;
      window.clearInterval(interval);
      return;
    }
    fields.days.textContent = String(Math.floor(remaining / 86400)).padStart(2, '0');
    fields.hours.textContent = String(Math.floor((remaining % 86400) / 3600)).padStart(2, '0');
    fields.minutes.textContent = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
    fields.seconds.textContent = String(remaining % 60).padStart(2, '0');
  };
  interval = window.setInterval(update, 1000);
  update();
})();
