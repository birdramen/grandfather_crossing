import { state, save, TRAIN_PIECES } from './state.js';
import { onEnter, toast } from './nav.js';

const TRACK_LAYOUTS = [
  { id: 'oval',    label: 'Oval',         animation: 'train-run-oval',    path: 'oval' },
  { id: 'figure8', label: 'Figure-of-8',  animation: 'train-run-figure8', path: 'figure8' },
  { id: 'branch',  label: 'Branch Line',  animation: 'train-run-branch',  path: 'branch' },
];

export function initTrain() {
  onEnter('train', renderTrain);
}

function renderTrain() {
  renderTokenDisplay();
  renderTrackSelector();
  renderOwnedPieces();
  renderShop();
  renderLayout();
}

function renderTokenDisplay() {
  const t = state.data.tokens;
  document.getElementById('tokens-train').textContent = `🔧 ${t} token${t !== 1 ? 's' : ''}`;
}

// ─── Track layout selector ────────────────────────────────────────────────────

function renderTrackSelector() {
  const wrap = document.getElementById('train-layout-area');
  let sel = wrap.querySelector('.track-layout-selector');
  if (!sel) {
    sel = document.createElement('div');
    sel.className = 'track-layout-selector';
    wrap.prepend(sel);
  }

  const current = state.data.train.trackLayout ?? 'oval';
  sel.innerHTML = `<span style="color:var(--clr-muted);font-size:0.75rem;margin-right:6px">Track layout:</span>` +
    TRACK_LAYOUTS.map(l =>
      `<button class="track-layout-btn${current === l.id ? ' active' : ''}" data-layout="${l.id}">${l.label}</button>`
    ).join('');

  sel.querySelectorAll('.track-layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.data.train.trackLayout = btn.dataset.layout;
      save();
      applyTrackLayout(btn.dataset.layout);
      renderTrackSelector();
    });
  });

  applyTrackLayout(current);
}

function applyTrackLayout(layoutId) {
  const loco = document.getElementById('train-loco');
  const track = document.querySelector('.train-track');
  if (!loco || !track) return;

  loco.style.animation = 'none';
  void loco.offsetWidth; // force reflow

  switch (layoutId) {
    case 'figure8':
      track.style.borderRadius = '50px';
      track.style.height = '36px';
      loco.style.animation = 'train-run 8s linear infinite';
      break;
    case 'branch':
      track.style.borderRadius = '4px';
      track.style.height = '22px';
      loco.style.animation = 'train-run-slow 18s linear infinite';
      break;
    default: // oval
      track.style.borderRadius = '4px';
      track.style.height = '28px';
      loco.style.animation = 'train-run 12s linear infinite';
  }
}

// ─── Owned pieces ─────────────────────────────────────────────────────────────

function renderOwnedPieces() {
  const owned = state.data.train.ownedPieces;
  const grid = document.getElementById('owned-pieces');
  grid.innerHTML = '';

  const ownedDefs = TRAIN_PIECES.filter(p => owned.includes(p.id));
  if (ownedDefs.length === 0) {
    grid.innerHTML = '<p style="color:var(--clr-muted);font-size:0.8rem">None yet.</p>';
    return;
  }

  ownedDefs.forEach(piece => {
    const card = document.createElement('div');
    card.className = 'piece-card';
    card.title = `Click to place ${piece.name}`;
    card.innerHTML = `
      <span class="piece-emoji">${piece.isTrack ? '🛤️' : piece.emoji}</span>
      <span class="piece-name">${piece.name}</span>
    `;
    card.addEventListener('click', () => placePiece(piece));
    grid.appendChild(card);
  });
}

// ─── Shop ─────────────────────────────────────────────────────────────────────

function renderShop() {
  const owned = state.data.train.ownedPieces;
  const tokens = state.data.tokens;
  const grid = document.getElementById('shop-pieces');
  grid.innerHTML = '';

  const available = TRAIN_PIECES.filter(p => !owned.includes(p.id));
  if (available.length === 0) {
    grid.innerHTML = '<p style="color:var(--clr-muted);font-size:0.8rem">You have everything! Brilliant.</p>';
    return;
  }

  // Group by category
  const categories = [...new Set(available.map(p => p.category))];
  categories.forEach(cat => {
    const header = document.createElement('p');
    header.style.cssText = 'color:var(--clr-muted);font-size:0.7rem;margin:6px 0 3px;grid-column:1/-1';
    header.textContent = cat;
    grid.appendChild(header);

    available.filter(p => p.category === cat).forEach(piece => {
      const canAfford = tokens >= piece.cost;
      const card = document.createElement('div');
      card.className = `piece-card shop-card${canAfford ? '' : ' unaffordable'}`;
      card.innerHTML = `
        <span class="piece-emoji">${piece.isTrack ? '🛤️' : piece.emoji}</span>
        <span class="piece-name">${piece.name}</span>
        <span class="piece-cost">🔧 ${piece.cost}</span>
      `;
      if (canAfford) {
        card.addEventListener('click', () => buyPiece(piece));
        card.title = `Buy ${piece.name} for ${piece.cost} tokens`;
      } else {
        card.title = `Need ${piece.cost - tokens} more tokens`;
      }
      grid.appendChild(card);
    });
  });
}

function buyPiece(piece) {
  if (state.data.tokens < piece.cost) { toast("Not enough workshop tokens yet!"); return; }
  state.data.tokens -= piece.cost;
  state.data.train.ownedPieces.push(piece.id);
  save();
  toast(`🔓 Unlocked ${piece.name}! It's now in your collection.`);
  renderTrain();
}

// ─── Layout ───────────────────────────────────────────────────────────────────

function renderLayout() {
  const area = document.getElementById('placed-pieces');
  area.innerHTML = '';

  state.data.train.layout.forEach((placed, idx) => {
    const def = TRAIN_PIECES.find(p => p.id === placed.pieceId);
    if (!def) return;
    const el = buildPlacedEl(def, placed, idx);
    area.appendChild(el);
  });
}

function buildPlacedEl(def, placed, idx) {
  const el = document.createElement('div');
  el.style.left = `${placed.x}%`;
  el.style.top  = `${placed.y}%`;

  if (def.isTrack) {
    el.className = 'track-piece-placed';
    const seg = document.createElement('div');
    seg.className = `track-segment ${def.trackType ?? 'straight'}`;
    el.appendChild(seg);
    const hint = document.createElement('span');
    hint.className = 'track-delete-hint';
    hint.textContent = 'double-click to remove';
    el.appendChild(hint);
  } else {
    el.className = 'placed-piece';
    el.textContent = def.emoji;
    el.title = def.name;
  }

  makeDraggable(el, idx);
  return el;
}

function placePiece(piece) {
  const x = 25 + Math.random() * 45;
  const y = 15 + Math.random() * 45;
  state.data.train.layout.push({ pieceId: piece.id, x, y });
  save();
  toast(`Placed ${piece.name}. Drag it wherever looks best — double-click to remove.`);
  renderLayout();
}

function makeDraggable(el, idx) {
  const area = document.getElementById('train-layout-area');
  let startX, startY, startLeft, startTop, moved;

  el.addEventListener('mousedown', e => {
    e.preventDefault();
    moved = false;
    const rect = area.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = state.data.train.layout[idx].x;
    startTop  = state.data.train.layout[idx].y;

    const onMove = ev => {
      moved = true;
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      const newX = Math.max(0, Math.min(94, startLeft + dx));
      const newY = Math.max(0, Math.min(88, startTop  + dy));
      el.style.left = `${newX}%`;
      el.style.top  = `${newY}%`;
      state.data.train.layout[idx].x = newX;
      state.data.train.layout[idx].y = newY;
    };

    const onUp = () => {
      if (moved) save();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  el.addEventListener('dblclick', () => {
    state.data.train.layout.splice(idx, 1);
    save();
    toast("Piece removed. It's back in your collection.");
    renderLayout();
  });
}
