import { state, save, TRAIN_PIECES } from './state.js';
import { onEnter, toast } from './nav.js';

export function initTrain() {
  onEnter('train', renderTrain);
}

function renderTrain() {
  renderTokenDisplay();
  renderOwnedPieces();
  renderShop();
  renderLayout();
}

function renderTokenDisplay() {
  const t = state.data.tokens;
  document.getElementById('tokens-train').textContent = `🔧 ${t} token${t !== 1 ? 's' : ''}`;
}

// ─── Owned pieces (collection) ────────────────────────────────────────────────

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
      <span class="piece-emoji">${piece.emoji}</span>
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

  available.forEach(piece => {
    const canAfford = tokens >= piece.cost;
    const card = document.createElement('div');
    card.className = `piece-card shop-card${canAfford ? '' : ' unaffordable'}`;
    card.innerHTML = `
      <span class="piece-emoji">${piece.emoji}</span>
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
}

function buyPiece(piece) {
  if (state.data.tokens < piece.cost) { toast("Not enough workshop tokens yet!"); return; }
  state.data.tokens -= piece.cost;
  state.data.train.ownedPieces.push(piece.id);
  save();
  toast(`🔓 Unlocked ${piece.name}! It's now in your collection.`);
  renderTrain();
}

// ─── Layout (place pieces on the scene) ──────────────────────────────────────

function renderLayout() {
  const area = document.getElementById('placed-pieces');
  area.innerHTML = '';

  state.data.train.layout.forEach((placed, idx) => {
    const def = TRAIN_PIECES.find(p => p.id === placed.pieceId);
    if (!def) return;
    const el = document.createElement('div');
    el.className = 'placed-piece';
    el.textContent = def.emoji;
    el.title = def.name;
    el.style.left = `${placed.x}%`;
    el.style.top  = `${placed.y}%`;

    makeDraggable(el, idx);
    area.appendChild(el);
  });
}

function placePiece(piece) {
  // Place near centre with a small random offset
  const x = 30 + Math.random() * 40;
  const y = 20 + Math.random() * 40;
  state.data.train.layout.push({ pieceId: piece.id, x, y });
  save();
  toast(`Placed ${piece.name} in the layout. Drag it to where you like!`);
  renderLayout();
}

function makeDraggable(el, idx) {
  const area = document.getElementById('train-layout-area');
  let startX, startY, startLeft, startTop;

  el.addEventListener('mousedown', e => {
    e.preventDefault();
    const rect = area.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = state.data.train.layout[idx].x;
    startTop  = state.data.train.layout[idx].y;

    const onMove = ev => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      const newX = Math.max(0, Math.min(95, startLeft + dx));
      const newY = Math.max(0, Math.min(90, startTop  + dy));
      el.style.left = `${newX}%`;
      el.style.top  = `${newY}%`;
      state.data.train.layout[idx].x = newX;
      state.data.train.layout[idx].y = newY;
    };

    const onUp = () => {
      save();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  // Double-click to remove
  el.addEventListener('dblclick', () => {
    state.data.train.layout.splice(idx, 1);
    save();
    toast("Piece removed from the layout. It's back in your collection.");
    renderLayout();
  });
}
