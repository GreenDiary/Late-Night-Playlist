const liveTime = document.querySelector('#live-time');
const liveDate = document.querySelector('#live-date');
function updateClock() {
  const now = new Date();
  liveTime.textContent = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(now);
  liveDate.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(now);
}
updateClock();
setInterval(updateClock, 30_000);
