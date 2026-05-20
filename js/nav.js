// ─── Screen navigation ─────────────────────────────────────────────────────────────────────────────

const screens = {};
let currentScreen = null;
const listeners = {};

export function initNav() {
  document.querySelectorAll('.screen').forEach(el => {
    screens[el.id.replace('screen-', '')] = el;
  });

  document.querySelectorAll('[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => goTo(btn.dataset.screen));
  });
}

export function goTo(name) {
  Object.values(screens).forEach(el => el.classList.remove('active'));
  currentScreen = name;
  screens[name]?.classList.add('active');
  listeners[name]?.forEach(fn => fn());
}

export function onEnter(screenName, fn) {
  if (!listeners[screenName]) listeners[screenName] = [];
  listeners[screenName].push(fn);
}

// ─── Toast notification ─────────────────────────────────────────────────────────────────────────

let toastTimer = null;
export function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden', 'show');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    el.classList.add('hidden');
  }, 2600);
}
