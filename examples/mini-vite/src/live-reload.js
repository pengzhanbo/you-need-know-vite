/* eslint-disable no-undef */
function liveReload() {
  const timer = setInterval(async () => {
    const res = await fetch('/live-reload');
    const status = await res.json();
    if (status.hasUpdated) {
      clearInterval(timer);
      location.reload();
    }
  }, 300);
}

liveReload();
