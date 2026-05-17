import { state, save } from './state.js';
import { CROPS, FISH_VARIETIES } from './state.js';
import { onEnter } from './nav.js';

export function initHome() {
  onEnter('home', renderHome);
}

function renderHome() {
  renderGreeting();
  renderAlerts();
  renderTokens();
  animatePhilip();
}

function renderGreeting() {
  const hour = new Date().getHours();
  let greet = 'Good evening';
  if (hour >= 5  && hour < 12) greet = 'Good morning';
  else if (hour >= 12 && hour < 17) greet = 'Good afternoon';

  document.getElementById('greeting-text').textContent = `${greet}, Philip!`;

  const d = new Date();
  const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  document.getElementById('date-text').textContent = d.toLocaleDateString('en-GB', opts);
}

function renderAlerts() {
  const alerts = [];
  const { garden, pond } = state.data;

  // Crops ready to harvest
  const readyCount = garden.plots.filter(p => p.crop && isReady(p) && !p.withered).length;
  if (readyCount > 0) alerts.push(`🧺 ${readyCount} crop${readyCount > 1 ? 's' : ''} ready to harvest in the garden!`);

  // Fish hungry
  const today = new Date().toISOString().slice(0, 10);
  const hungryFish = pond.fish.filter(f => f.lastFedDate !== today);
  if (hungryFish.length > 0) alerts.push(`🐟 Your fish would love a feed!`);

  // Withered plants
  const witheredCount = garden.plots.filter(p => p.withered).length;
  if (witheredCount > 0) alerts.push(`🥀 ${witheredCount} plant${witheredCount > 1 ? 's have' : ' has'} withered — clear the plot.`);

  document.getElementById('home-alerts').innerHTML = alerts.join('<br>') || '&nbsp;';
}

function renderTokens() {
  document.getElementById('tokens-home').textContent = `🔧 ${state.data.tokens} workshop token${state.data.tokens !== 1 ? 's' : ''}`;
}

function isReady(plot) {
  if (!plot.crop || !plot.plantedAt) return false;
  const crop = CROPS[plot.crop];
  if (!crop) return false;
  // Perennial: ready again after harvestedAt + growHours
  if (crop.perennial && plot.harvestedAt) {
    return (Date.now() - plot.harvestedAt) / 3_600_000 >= crop.growHours;
  }
  return (Date.now() - plot.plantedAt) / 3_600_000 >= crop.growHours;
}

function animatePhilip() {
  const sprite = document.getElementById('philip-sprite');
  if (!sprite) return;
  sprite.src = '../assets/philip_wave.png';
  // After 3s switch to walking, alternate
  let waving = true;
  const flip = () => {
    waving = !waving;
    sprite.src = waving ? '../assets/philip_wave.png' : '../assets/philip_walk.png';
  };
  if (sprite._homeTimer) clearInterval(sprite._homeTimer);
  sprite._homeTimer = setInterval(flip, 3500);
}
