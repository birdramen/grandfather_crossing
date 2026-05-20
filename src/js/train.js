import { state, save, TRAIN_PIECES } from './state.js';
import { onEnter, toast } from './nav.js';

// Rolling stock order: how carriages line up behind the engine
const STOCK_ORDER = ['steam_engine', 'coal_tender', 'dining_car', 'passenger_carriage', 'goods_wagon', 'brake_van'];

export function initTrain() {
  onEnter('train', renderTrain);
}

function renderTrain() {
  renderTokenDisplay();
  buildSVGTrack();
  renderTrainPreview();
  renderShop();
  renderOwnedScenery();
  renderSceneryLayout();
}

// ─── Token display ────────────────────────────────────────────────────────────

function renderTokenDisplay() {
  const t = state.data.tokens;
  document.getElementById('tokens-train').textContent = `🔧 ${t} token${t !== 1 ? 's' : ''}`;
}

// ─── SVG oval track ───────────────────────────────────────────────────────────

function buildSVGTrack() {
  const scene = document.getElementById('train-scene');
  scene.querySelector('svg')?.remove();

  const W = 780, H = 370;
  const cx = W / 2, cy = Math.round(H * 0.58);

  const owned = state.data.train.ownedPieces;

  // Each straight piece adds 22px to the oval width (rx)
  const straightCount = owned.filter(id => id === 'track_straight').length;
  // Each curve piece adds 10px to the oval height (ry)
  const curveCount = owned.filter(id => id === 'track_curve').length;

  const baseRx = 250, baseRy = 88;
  const rx = Math.min(baseRx + straightCount * 22, W / 2 - 35);
  const ry = Math.min(baseRy + curveCount * 10, H * 0.44);

  // Path: full clockwise ellipse (needed for animateMotion)
  const pathD = ellipsePath(cx, cy, rx, ry);

  // Speed: longer track = slower loop (more to travel)
  const trackLen = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
  const dur = (trackLen / 120).toFixed(1); // ~120px/s

  const trainStr = buildTrainString();

  // Accessories dotted around the outside of the oval
  const accessories = buildAccessorySVG(cx, cy, rx, ry, owned);

  const svg = `
<svg class="track-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="oval-path" d="${pathD}"/>
  </defs>

  <!-- Soft ground fill inside oval -->
  <ellipse cx="${cx}" cy="${cy}" rx="${rx - 16}" ry="${ry - 10}"
           fill="rgba(35,65,20,0.22)"/>

  <!-- Sleepers (dashed stroke around a slightly larger ellipse) -->
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"
           fill="none" stroke="#5c3e1a" stroke-width="22"
           stroke-dasharray="14 7"/>

  <!-- Outer rail -->
  <ellipse cx="${cx}" cy="${cy}" rx="${rx + 7}" ry="${ry + 7}"
           fill="none" stroke="#9a7840" stroke-width="3.5"/>
  <!-- Inner rail -->
  <ellipse cx="${cx}" cy="${cy}" rx="${rx - 7}" ry="${ry - 7}"
           fill="none" stroke="#9a7840" stroke-width="3.5"/>

  ${accessories}

  <!-- Running train -->
  <text font-size="22" dominant-baseline="central">
    ${trainStr}
    <animateMotion dur="${dur}s" repeatCount="indefinite">
      <mpath href="#oval-path"/>
    </animateMotion>
  </text>
</svg>`;

  scene.insertAdjacentHTML('afterbegin', svg);

  // Position the scenery island to cover the oval interior
  positionSceneryIsland(cx, cy, rx, ry, W, H);
}

function ellipsePath(cx, cy, rx, ry) {
  // Full clockwise ellipse starting from the left-most point
  return `M ${cx - rx},${cy} A ${rx},${ry} 0 1 1 ${cx + rx},${cy} A ${rx},${ry} 0 1 1 ${cx - rx},${cy} Z`;
}

function buildTrainString() {
  const owned = state.data.train.ownedPieces;
  return STOCK_ORDER.map(id => {
    const def = TRAIN_PIECES.find(p => p.id === id);
    if (!def?.isRollingStock) return '';
    const count = owned.filter(o => o === id).length;
    return def.emoji.repeat(count);
  }).join('') || '🚂';
}

function buildAccessorySVG(cx, cy, rx, ry, owned) {
  const accessories = owned.filter(id => {
    const p = TRAIN_PIECES.find(p => p.id === id);
    return p?.isAccessory;
  });
  if (!accessories.length) return '';

  // Fixed positions around the outside of the oval (angle in degrees)
  const slots = [0, 45, 90, 135, 180, 225, 270, 315];
  const r = 1.22; // multiplier: place outside the oval

  return accessories.slice(0, slots.length).map((id, i) => {
    const def = TRAIN_PIECES.find(p => p.id === id);
    if (!def) return '';
    const rad = (slots[i] * Math.PI) / 180;
    const x = Math.round(cx + Math.cos(rad) * rx * r);
    const y = Math.round(cy + Math.sin(rad) * ry * r * 0.85);
    return `<text x="${x}" y="${y}" font-size="18" text-anchor="middle" dominant-baseline="central">${def.emoji}</text>`;
  }).join('\n  ');
}

// Position the scenery island div to cover the oval interior.
// The SVG uses preserveAspectRatio="xMidYMid meet" so we must account
// for the actual rendered scale and centering offset.
function positionSceneryIsland(cx, cy, rx, ry, W, H) {
  const island = document.getElementById('scenery-island');
  const scene  = document.getElementById('train-scene');
  if (!island || !scene) return;

  const sceneW = scene.clientWidth;
  const sceneH = scene.clientHeight;
  const scale  = Math.min(sceneW / W, sceneH / H);
  const offX   = (sceneW - W * scale) / 2;
  const offY   = (sceneH - H * scale) / 2;

  const pad = 18;
  island.style.left   = `${offX + (cx - rx + pad) * scale}px`;
  island.style.top    = `${offY + (cy - ry + pad) * scale}px`;
  island.style.width  = `${(rx - pad) * 2 * scale}px`;
  island.style.height = `${(ry - pad) * 2 * scale}px`;
}

// ─── Train preview (sidebar) ──────────────────────────────────────────────────

function renderTrainPreview() {
  const el = document.getElementById('train-preview');
  el.textContent = buildTrainString();
}

// ─── Shop ─────────────────────────────────────────────────────────────────────

const SHOP_SECTIONS = [
  { label: '🚂 Rolling Stock', filter: p => p.isRollingStock },
  { label: '🛤️ Track Extensions', filter: p => p.isTrack },
  { label: '🚦 Track Accessories', filter: p => p.isAccessory },
  { label: '🌿 Scenery',       filter: p => p.isScenery },
];

function renderShop() {
  const owned        = state.data.train.ownedPieces;
  const unlockedSc   = state.data.train.unlockedScenery ?? [];
  const tokens       = state.data.tokens;
  const container    = document.getElementById('shop-pieces');
  container.innerHTML = '';

  SHOP_SECTIONS.forEach(({ label, filter }) => {
    const pieces = TRAIN_PIECES.filter(filter);

    // For scenery/accessories: filter out already-unlocked ones
    const available = (filter === TRAIN_PIECES.find(p => p.isScenery) ? false : true)
      ? pieces
      : pieces.filter(p => !unlockedSc.includes(p.id));

    // Determine what to show
    const shopPieces = pieces.filter(p => {
      if (p.isRollingStock || p.isTrack) return true; // always available to buy more
      return !unlockedSc.includes(p.id) && !p.starter; // scenery/accessory: hide once unlocked
    });

    if (shopPieces.length === 0) return;

    const section = document.createElement('div');
    section.className = 'shop-section';
    section.innerHTML = `<p class="shop-section-label">${label}</p>`;

    const grid = document.createElement('div');
    grid.className = 'pieces-grid';

    shopPieces.forEach(piece => {
      const canAfford = tokens >= piece.cost;
      const count = (piece.isRollingStock || piece.isTrack)
        ? owned.filter(id => id === piece.id).length
        : 0;

      const card = document.createElement('div');
      card.className = `piece-card shop-card${canAfford ? '' : ' unaffordable'}`;
      card.innerHTML = `
        <span class="piece-emoji">${piece.emoji}</span>
        <span class="piece-name">${piece.name}${count > 0 ? ` ×${count}` : ''}</span>
        <span class="piece-cost">🔧 ${piece.cost}</span>
      `;
      card.title = canAfford
        ? `Buy ${piece.name} for ${piece.cost} tokens`
        : `Need ${piece.cost - tokens} more tokens`;
      if (canAfford) card.addEventListener('click', () => buyPiece(piece));
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function buyPiece(piece) {
  if (state.data.tokens < piece.cost) { toast("Not enough workshop tokens!"); return; }
  state.data.tokens -= piece.cost;

  if (piece.isRollingStock || piece.isTrack) {
    // Allow multiples
    state.data.train.ownedPieces.push(piece.id);
  } else {
    // Scenery/accessory — unlock once
    if (!state.data.train.unlockedScenery) state.data.train.unlockedScenery = [];
    if (!state.data.train.unlockedScenery.includes(piece.id)) {
      state.data.train.unlockedScenery.push(piece.id);
    }
  }

  save();

  if (piece.isRollingStock) {
    toast(`🚂 ${piece.name} joined the train!`);
  } else if (piece.isTrack) {
    toast(`🛤️ Track extended! The oval is now wider.`);
  } else if (piece.isAccessory) {
    toast(`🔓 ${piece.name} added to the track-side.`);
  } else {
    toast(`🔓 ${piece.name} added to your scenery — place it inside the oval!`);
  }

  renderTrain();
}

// ─── Owned scenery (sidebar) ──────────────────────────────────────────────────

function renderOwnedScenery() {
  const unlockedSc = state.data.train.unlockedScenery ?? [];
  const owned = state.data.train.ownedPieces;
  const el = document.getElementById('owned-scenery');
  el.innerHTML = '';

  const rows = [];

  // Rolling stock rows
  TRAIN_PIECES.filter(p => p.isRollingStock).forEach(piece => {
    const count = owned.filter(id => id === piece.id).length;
    if (count === 0) return;
    const canRemove = !(piece.id === 'steam_engine' && count === 1);
    rows.push({ piece, label: count > 1 ? `${piece.name} ×${count}` : piece.name, canRemove,
      onRemove() {
        const idx = state.data.train.ownedPieces.lastIndexOf(piece.id);
        if (idx !== -1) state.data.train.ownedPieces.splice(idx, 1);
        save(); toast(`${piece.emoji} Removed.`); renderTrain();
      }
    });
  });

  // Scenery/accessory rows
  TRAIN_PIECES.filter(p => (p.isScenery || p.isAccessory) && unlockedSc.includes(p.id)).forEach(piece => {
    rows.push({ piece, label: piece.name, canRemove: true, isScenery: true,
      onRemove() {
        state.data.train.unlockedScenery = (state.data.train.unlockedScenery ?? []).filter(id => id !== piece.id);
        state.data.train.sceneryLayout   = (state.data.train.sceneryLayout ?? []).filter(p => p.pieceId !== piece.id);
        save(); toast(`${piece.emoji} Removed.`); renderTrain();
      }
    });
  });

  if (rows.length === 0) {
    el.innerHTML = '<p class="tip-text">Nothing yet — buy pieces from the shop!</p>';
    return;
  }

  rows.forEach(({ piece, label, canRemove, isScenery, onRemove }) => {
    const row = document.createElement('div');
    row.className = 'collection-row';
    row.innerHTML = `
      <span class="collection-emoji">${piece.emoji}</span>
      <span class="collection-name">${label}</span>
      <button class="remove-piece-btn" ${canRemove ? '' : 'disabled'}>✕</button>
    `;
    row.querySelector('.remove-piece-btn').addEventListener('click', onRemove);
    if (isScenery) row.addEventListener('click', e => { if (!e.target.classList.contains('remove-piece-btn')) placeScenery(piece); });
    el.appendChild(row);
  });
}

// ─── Scenery placement (inside the oval) ─────────────────────────────────────

function placeScenery(piece) {
  if (!state.data.train.sceneryLayout) state.data.train.sceneryLayout = [];
  // Place near centre of island with slight random spread
  const x = 35 + Math.random() * 30;
  const y = 25 + Math.random() * 50;
  state.data.train.sceneryLayout.push({ pieceId: piece.id, x, y });
  save();
  toast(`${piece.emoji} Placed in the oval. Drag it anywhere inside!`);
  renderSceneryLayout();
}

function renderSceneryLayout() {
  const island = document.getElementById('scenery-island');
  if (!island) return;
  // Clear only placed pieces (keep island structure)
  island.querySelectorAll('.island-piece').forEach(el => el.remove());

  const layout = state.data.train.sceneryLayout ?? [];
  layout.forEach((placed, idx) => {
    const def = TRAIN_PIECES.find(p => p.id === placed.pieceId);
    if (!def) return;

    const el = document.createElement('div');
    el.className = 'island-piece';
    el.textContent = def.emoji;
    el.title = `${def.name} — double-click to remove`;
    el.style.left = `${placed.x}%`;
    el.style.top  = `${placed.y}%`;

    makeDraggable(el, idx, island);
    el.addEventListener('dblclick', () => {
      state.data.train.sceneryLayout.splice(idx, 1);
      save();
      toast(`${def.emoji} Removed. It's back in your collection.`);
      renderSceneryLayout();
    });

    island.appendChild(el);
  });
}

function makeDraggable(el, idx, container) {
  let startX, startY, startL, startT, moved;

  el.addEventListener('mousedown', e => {
    e.preventDefault();
    moved = false;
    const rect = container.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY;
    startL = state.data.train.sceneryLayout[idx].x;
    startT = state.data.train.sceneryLayout[idx].y;

    const onMove = ev => {
      moved = true;
      const dx = ((ev.clientX - startX) / rect.width)  * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      const nx = Math.max(0, Math.min(92, startL + dx));
      const ny = Math.max(0, Math.min(88, startT + dy));
      el.style.left = `${nx}%`;
      el.style.top  = `${ny}%`;
      state.data.train.sceneryLayout[idx].x = nx;
      state.data.train.sceneryLayout[idx].y = ny;
    };
    const onUp = () => {
      if (moved) save();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}
