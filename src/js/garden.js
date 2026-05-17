import { state, save, addTokens, addToInventory, CROPS, now } from './state.js';
import { onEnter, toast } from './nav.js';

let activeTool = 'plant';
let selectedPlotId = null;

export function initGarden() {
  onEnter('garden', renderGarden);

  // Tool buttons
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTool = btn.dataset.tool;
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateTip();
    });
  });

  // Seed modal close
  document.getElementById('close-seed-modal').addEventListener('click', closeModal);
  document.getElementById('seed-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Tick growth every 30 seconds
  setInterval(() => {
    if (document.getElementById('screen-garden').classList.contains('active')) renderGarden();
  }, 30_000);
}

function renderGarden() {
  tickWithering();
  renderGrid();
  renderInventory();
  updateTip();
}

// ─── Withering ────────────────────────────────────────────────────────────────

function tickWithering() {
  let changed = false;
  for (const plot of state.data.garden.plots) {
    if (!plot.crop || plot.withered) continue;
    const crop = CROPS[plot.crop];
    if (!crop || crop.perennial) continue;
    if (!plot.lastWatered) continue;
    const hoursSinceWater = (now() - plot.lastWatered) / 3_600_000;
    if (hoursSinceWater > 48) {
      plot.withered = true;
      changed = true;
    }
  }
  if (changed) save();
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

function renderGrid() {
  const grid = document.getElementById('garden-grid');
  grid.innerHTML = '';
  state.data.garden.plots.forEach(plot => {
    grid.appendChild(buildPlotEl(plot));
  });
}

function buildPlotEl(plot) {
  const el = document.createElement('div');
  el.className = 'plot';
  el.dataset.id = plot.id;

  if (!plot.crop) {
    el.classList.add('empty');
    el.innerHTML = `<span class="plot-emoji">🪨</span><span class="plot-label">Empty plot</span>`;
  } else if (plot.withered) {
    el.classList.add('withered');
    el.innerHTML = `<span class="plot-emoji">🥀</span><span class="plot-label">Withered</span><span class="plot-sub">Tap to clear</span>`;
  } else {
    const crop = CROPS[plot.crop];
    const ready = isReady(plot);
    const stage = getStage(plot);

    if (ready) {
      el.classList.add(crop.perennial ? 'perennial-ready' : 'ready');
    }

    const stageEmoji = stageIcon(plot.crop, stage, ready);
    const waterDotClass = isWateredRecently(plot) ? '' : 'dry';

    el.innerHTML = `
      <div class="plot-water-dot ${waterDotClass}" title="${waterDotClass ? 'Needs water!' : 'Watered'}"></div>
      <span class="plot-emoji">${stageEmoji}</span>
      <span class="plot-label">${crop.name}</span>
      <span class="plot-sub">${ready ? '✨ Ready!' : timeLeft(plot)}</span>
    `;
  }

  el.addEventListener('click', () => onPlotClick(plot));
  return el;
}

// ─── Plot interaction ─────────────────────────────────────────────────────────

function onPlotClick(plot) {
  if (activeTool === 'plant') {
    if (!plot.crop) {
      openSeedModal(plot.id);
    } else if (plot.withered) {
      clearPlot(plot);
    } else {
      toast("This plot already has something growing. Use the 🧺 Harvest tool when it's ready.");
    }
    return;
  }

  if (activeTool === 'water') {
    if (!plot.crop) { toast("Nothing to water here."); return; }
    if (plot.withered) { toast("It's too late for this one — clear the plot first."); return; }
    waterPlot(plot);
    return;
  }

  if (activeTool === 'harvest') {
    if (!plot.crop) { toast("Nothing to harvest here."); return; }
    if (plot.withered) { clearPlot(plot); return; }
    if (!isReady(plot)) { toast(`Not ready yet — ${timeLeft(plot)}.`); return; }
    harvestPlot(plot);
  }
}

function waterPlot(plot) {
  if (isWateredRecently(plot)) { toast("Already watered recently — looking happy!"); return; }
  plot.lastWatered = now();
  save();
  toast('💧 Watered! The plant is grateful.');
  renderGrid();
}

function harvestPlot(plot) {
  const crop = CROPS[plot.crop];
  addToInventory(plot.crop, crop.yield);
  addTokens(crop.tokenReward);

  showHarvestPop(crop.emoji, crop.yield);
  toast(`🧺 Harvested ${crop.yield} ${crop.name}! +${crop.tokenReward} workshop tokens.`);

  if (crop.perennial) {
    plot.harvestedAt = now();
    // stays planted, regrows
  } else {
    clearPlotData(plot);
  }

  save();
  renderGrid();
  renderInventory();
}

function clearPlot(plot) {
  clearPlotData(plot);
  save();
  toast("Plot cleared.");
  renderGrid();
}

function clearPlotData(plot) {
  plot.crop = null;
  plot.plantedAt = null;
  plot.lastWatered = null;
  plot.withered = false;
  plot.harvestedAt = null;
}

// ─── Seed modal ───────────────────────────────────────────────────────────────

function openSeedModal(plotId) {
  selectedPlotId = plotId;
  const grid = document.getElementById('seed-grid');
  grid.innerHTML = '';
  for (const [key, crop] of Object.entries(CROPS)) {
    const btn = document.createElement('button');
    btn.className = 'seed-btn';
    btn.innerHTML = `
      <span class="seed-btn-emoji">${crop.emoji}</span>
      <span class="seed-btn-name">${crop.name}</span>
      <span class="seed-btn-time">${crop.growHours}h to grow${crop.perennial ? ' · perennial' : ''}</span>
    `;
    btn.addEventListener('click', () => plantSeed(key));
    grid.appendChild(btn);
  }
  document.getElementById('seed-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('seed-modal').classList.add('hidden');
  selectedPlotId = null;
}

function plantSeed(cropKey) {
  const plot = state.data.garden.plots.find(p => p.id === selectedPlotId);
  if (!plot) return;
  plot.crop = cropKey;
  plot.plantedAt = now();
  plot.lastWatered = now();
  plot.withered = false;
  plot.harvestedAt = null;
  save();
  closeModal();
  toast(`🌱 Planted ${CROPS[cropKey].name}!`);
  renderGrid();
}

// ─── Inventory ────────────────────────────────────────────────────────────────

function renderInventory() {
  const inv = state.data.garden.inventory;
  const el = document.getElementById('garden-inventory');
  const empty = document.getElementById('basket-empty');
  el.innerHTML = '';
  const entries = Object.entries(inv).filter(([, v]) => v > 0);
  if (entries.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  entries.forEach(([key, qty]) => {
    const crop = CROPS[key];
    if (!crop) return;
    const row = document.createElement('div');
    row.className = 'inv-row';
    row.innerHTML = `<span>${crop.emoji} ${crop.name}</span><span class="inv-count">×${qty}</span>`;
    el.appendChild(row);
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isReady(plot) {
  if (!plot.crop) return false;
  const crop = CROPS[plot.crop];
  const start = (crop.perennial && plot.harvestedAt) ? plot.harvestedAt : plot.plantedAt;
  return (now() - start) / 3_600_000 >= crop.growHours;
}

function getStage(plot) {
  if (!plot.crop) return 0;
  const crop = CROPS[plot.crop];
  const start = (crop.perennial && plot.harvestedAt) ? plot.harvestedAt : plot.plantedAt;
  const frac = Math.min(1, (now() - start) / (crop.growHours * 3_600_000));
  if (frac >= 1) return 3;
  if (frac >= 0.5) return 2;
  return 1;
}

function stageIcon(cropKey, stage, ready) {
  const stages = { 1: '🌱', 2: '🌿', 3: CROPS[cropKey]?.emoji ?? '🌿' };
  return stages[stage] ?? '🌱';
}

function isWateredRecently(plot) {
  if (!plot.lastWatered) return false;
  return (now() - plot.lastWatered) / 3_600_000 < 24;
}

function timeLeft(plot) {
  if (!plot.crop) return '';
  const crop = CROPS[plot.crop];
  const start = (crop.perennial && plot.harvestedAt) ? plot.harvestedAt : plot.plantedAt;
  const remainMs = (crop.growHours * 3_600_000) - (now() - start);
  if (remainMs <= 0) return 'Ready!';
  const hrs = Math.floor(remainMs / 3_600_000);
  const mins = Math.floor((remainMs % 3_600_000) / 60_000);
  if (hrs > 0) return `~${hrs}h ${mins}m left`;
  return `~${mins}m left`;
}

function showHarvestPop(emoji, qty) {
  const el = document.getElementById('harvest-pop');
  el.textContent = `${emoji} ×${qty}`;
  el.style.left = `${40 + Math.random() * 20}%`;
  el.style.top = `40%`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 1300);
}

function updateTip() {
  const tips = {
    plant: 'Click an empty plot to plant a seed. Perennial crops (figs, grapes) regrow after each harvest.',
    water: 'Click a growing crop to water it. Plants wither if left dry for 2 days.',
    harvest: 'Click a glowing plot to harvest. Perennial plants stay in the ground.',
  };
  document.getElementById('garden-tip').textContent = tips[activeTool] ?? '';
}
