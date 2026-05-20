import {
  state, save, addTokens, removeFromInventory,
  MARKET_CHARACTERS, MARKET_CROPS, FISH_VARIETIES, CROPS,
  giftTokenValue, todayStr, allCrops,
} from './state.js';
import { onEnter, toast } from './nav.js';

let activeCharId = null;
let giftMode = false;

export function initMarket() {
  onEnter('market', renderMarket);

  document.getElementById('close-market-modal')?.addEventListener('click', closeModal);
  document.getElementById('market-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
}

function renderMarket() {
  renderCharacters();
  renderBasket();
}

function renderCharacters() {
  const grid = document.getElementById('character-grid');
  grid.innerHTML = '';
  MARKET_CHARACTERS.forEach(char => {
    grid.appendChild(buildCharCard(char));
  });
}

function buildCharCard(char) {
  const today = todayStr();
  const giftedToday = state.data.market.lastGiftDate?.[char.id] === today;
  const completed = state.data.market.completedTrades ?? [];
  const availTrades = char.trades.filter(t => !completed.includes(t.id));

  const card = document.createElement('div');
  card.className = 'char-card';
  card.innerHTML = `
    <div class="char-emoji">${char.emoji}</div>
    <div class="char-name">${char.name}</div>
    <div class="char-relation">${char.relation}</div>
    <div class="char-flavour">${char.flavour}</div>
    <div class="char-badges">
      ${availTrades.length ? `<span class="badge badge-trade">💬 ${availTrades.length} trade${availTrades.length > 1 ? 's' : ''}</span>` : ''}
      ${giftedToday ? '<span class="badge badge-done">✓ Gifted today</span>' : '<span class="badge badge-gift">🎁 Can gift</span>'}
    </div>
    <button class="btn-primary char-btn">Visit ${char.name}</button>
  `;
  card.querySelector('.char-btn').addEventListener('click', () => openModal(char.id));
  return card;
}

function renderBasket() {
  const inv = state.data.garden.inventory;
  const pantry = state.data.pantry;
  const crops = allCrops(state.data.market);

  const invEl = document.getElementById('market-inventory');
  const invEmpty = document.getElementById('market-basket-empty');
  invEl.innerHTML = '';
  const invEntries = Object.entries(inv).filter(([, v]) => v > 0);
  invEmpty.style.display = invEntries.length ? 'none' : 'block';
  invEntries.forEach(([key, qty]) => {
    const crop = crops[key];
    if (!crop) return;
    const row = document.createElement('div');
    row.className = 'inv-row';
    row.innerHTML = `<span>${crop.emoji} ${crop.name}</span><span class="inv-count">×${qty}</span>`;
    invEl.appendChild(row);
  });

  const pantryEl = document.getElementById('market-pantry');
  const pantryEmpty = document.getElementById('market-pantry-empty');
  pantryEl.innerHTML = '';
  const pantryEntries = Object.entries(pantry).filter(([, v]) => v > 0);
  pantryEmpty.style.display = pantryEntries.length ? 'none' : 'block';
  pantryEntries.forEach(([name, qty]) => {
    const row = document.createElement('div');
    row.className = 'pantry-row';
    row.innerHTML = `<span>🫙 ${name}</span><span class="pantry-count">×${qty}</span>`;
    pantryEl.appendChild(row);
  });
}

function openModal(charId) {
  activeCharId = charId;
  giftMode = false;
  renderModalContent();
  document.getElementById('market-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('market-modal').classList.add('hidden');
  activeCharId = null;
  giftMode = false;
}

function renderModalContent() {
  const char = MARKET_CHARACTERS.find(c => c.id === activeCharId);
  if (!char) return;

  const content = document.getElementById('market-modal-content');
  const today = todayStr();
  const giftedToday = state.data.market.lastGiftDate?.[char.id] === today;
  const completed = state.data.market.completedTrades ?? [];
  const availTrades = char.trades.filter(t => !completed.includes(t.id));

  if (giftMode) {
    renderGiftPicker(char, content);
    return;
  }

  content.innerHTML = `
    <div class="modal-char-header">
      <span class="modal-char-emoji">${char.emoji}</span>
      <div>
        <div class="modal-char-name">${char.name}</div>
        <div class="modal-char-rel">${char.relation}</div>
      </div>
    </div>
    <p class="modal-char-flavour">${char.flavour}</p>
    <hr class="modal-divider">

    ${availTrades.length ? `
      <h4 class="modal-section-title">💬 Trading</h4>
      <div class="trade-list">${availTrades.map(t => tradeHTML(char, t)).join('')}</div>
      <hr class="modal-divider">
    ` : `<p class="tip-text" style="margin-bottom:10px">You've made all your trades with ${char.name}. Lovely!</p><hr class="modal-divider">`}

    <h4 class="modal-section-title">🎁 Daily Gift</h4>
    ${giftedToday
      ? `<p class="tip-text">You've already given ${char.name} something today — come back tomorrow!</p>`
      : `<p class="tip-text">Give ${char.name} something from your basket or pantry. They love: ${char.loves.map(l => `<em>${l}</em>`).join(', ')}.</p>
         <button class="btn-primary" id="open-gift-btn" style="margin-top:8px">Choose a gift…</button>`
    }
  `;

  if (!giftedToday) {
    content.querySelector('#open-gift-btn')?.addEventListener('click', () => {
      giftMode = true;
      renderModalContent();
    });
  }

  availTrades.forEach(trade => {
    content.querySelector(`[data-trade="${trade.id}"]`)?.addEventListener('click', () => {
      completeTrade(char, trade);
    });
  });
}

function tradeHTML(char, trade) {
  const canDo = canAffordTrade(trade);
  const needsHTML = buildNeedsHTML(trade, canDo);
  return `
    <div class="trade-card${canDo ? ' trade-ready' : ''}">
      <div class="trade-reward">
        <strong>${trade.label}</strong>
        <span class="tip-text">${trade.desc}</span>
      </div>
      <div class="trade-needs">${needsHTML}</div>
      <button class="btn-primary" data-trade="${trade.id}" ${canDo ? '' : 'disabled'}>
        ${canDo ? 'Make this trade ✓' : 'Not enough yet'}
      </button>
    </div>
  `;
}

function buildNeedsHTML(trade, canDo) {
  const crops = allCrops(state.data.market);
  const lines = [];
  if (trade.needs.inventory) {
    for (const [key, qty] of Object.entries(trade.needs.inventory)) {
      const have = state.data.garden.inventory[key] ?? 0;
      const ok = have >= qty;
      const crop = crops[key];
      lines.push(`<span class="${ok ? 'have' : 'need'}">${crop?.emoji ?? ''} ${qty}× ${crop?.name ?? key} (have ${have})</span>`);
    }
  }
  if (trade.needs.pantry) {
    for (const [name, qty] of Object.entries(trade.needs.pantry)) {
      const have = state.data.pantry[name] ?? 0;
      const ok = have >= qty;
      lines.push(`<span class="${ok ? 'have' : 'need'}">🫙 ${qty}× ${name} (have ${have})</span>`);
    }
  }
  return lines.join('');
}

function canAffordTrade(trade) {
  if (trade.needs.inventory) {
    for (const [key, qty] of Object.entries(trade.needs.inventory)) {
      if ((state.data.garden.inventory[key] ?? 0) < qty) return false;
    }
  }
  if (trade.needs.pantry) {
    for (const [name, qty] of Object.entries(trade.needs.pantry)) {
      if ((state.data.pantry[name] ?? 0) < qty) return false;
    }
  }
  return true;
}

function completeTrade(char, trade) {
  if (!canAffordTrade(trade)) { toast("You don't have enough for this trade yet."); return; }

  if (trade.needs.inventory) {
    for (const [key, qty] of Object.entries(trade.needs.inventory)) {
      removeFromInventory(key, qty);
    }
  }
  if (trade.needs.pantry) {
    for (const [name, qty] of Object.entries(trade.needs.pantry)) {
      state.data.pantry[name] = Math.max(0, (state.data.pantry[name] ?? 0) - qty);
      if (state.data.pantry[name] === 0) delete state.data.pantry[name];
    }
  }

  const { reward } = trade;
  if (reward.type === 'crop') {
    if (!state.data.market.unlockedCrops.includes(reward.id)) {
      state.data.market.unlockedCrops.push(reward.id);
    }
    const crop = MARKET_CROPS[reward.id];
    toast(`🌱 ${char.name} gave you ${crop?.name ?? reward.id} seeds! Plant them in the garden.`);
  } else if (reward.type === 'fish') {
    const newFish = {
      id: `koi_${Date.now()}`,
      name: null,
      variety: reward.variety,
      happiness: 80,
      lastFedDate: null,
    };
    state.data.pond.fish.push(newFish);
    const variety = FISH_VARIETIES[reward.variety];
    toast(`🐟 ${char.name} added a ${variety?.name ?? reward.variety} to your pond! Visit the pond to name it.`);
  }

  addTokens(trade.bonus);
  state.data.market.completedTrades.push(trade.id);
  save();

  renderMarket();
  renderModalContent();
}

function renderGiftPicker(char, content) {
  const crops = allCrops(state.data.market);
  const inv = state.data.garden.inventory;
  const pantry = state.data.pantry;

  const invItems = Object.entries(inv)
    .filter(([, v]) => v > 0)
    .map(([key, qty]) => ({ source: 'inventory', key, qty, label: crops[key]?.name ?? key, emoji: crops[key]?.emoji ?? '🌿' }));

  const pantryItems = Object.entries(pantry)
    .filter(([, v]) => v > 0)
    .map(([name, qty]) => ({ source: 'pantry', key: name, qty, label: name, emoji: '🫙' }));

  const all = [...invItems, ...pantryItems];

  if (all.length === 0) {
    content.innerHTML = `
      <p class="tip-text">You don't have anything to give right now — head to the garden or kitchen first!</p>
      <button class="btn-secondary" id="gift-back-btn" style="margin-top:10px">← Back</button>
    `;
    content.querySelector('#gift-back-btn').addEventListener('click', () => { giftMode = false; renderModalContent(); });
    return;
  }

  content.innerHTML = `
    <div class="modal-char-header">
      <span class="modal-char-emoji">${char.emoji}</span>
      <div>
        <div class="modal-char-name">Give a gift to ${char.name}</div>
        <div class="modal-char-rel">They love: ${char.loves.join(', ')}</div>
      </div>
    </div>
    <div class="gift-grid">
      ${all.map(item => {
        const isLoved = char.loves.includes(item.key) || char.loves.includes(item.label);
        const tokens = isLoved ? 10 : 4;
        return `
          <button class="gift-item-btn${isLoved ? ' loved' : ''}" data-source="${item.source}" data-key="${item.key}">
            <span class="gift-emoji">${item.emoji}</span>
            <span class="gift-label">${item.label}</span>
            <span class="gift-qty">×${item.qty}</span>
            <span class="gift-tokens">+${tokens} tokens${isLoved ? ' ❤️' : ''}</span>
          </button>
        `;
      }).join('')}
    </div>
    <button class="btn-secondary" id="gift-back-btn" style="margin-top:10px">← Back</button>
  `;

  content.querySelector('#gift-back-btn').addEventListener('click', () => { giftMode = false; renderModalContent(); });
  content.querySelectorAll('.gift-item-btn').forEach(btn => {
    btn.addEventListener('click', () => giveGift(char, btn.dataset.source, btn.dataset.key));
  });
}

function giveGift(char, source, key) {
  const crops = allCrops(state.data.market);
  const isLoved = char.loves.includes(key);
  const tokens = isLoved ? 10 : 4;

  if (source === 'inventory') {
    removeFromInventory(key, 1);
  } else {
    state.data.pantry[key] = Math.max(0, (state.data.pantry[key] ?? 0) - 1);
    if (state.data.pantry[key] === 0) delete state.data.pantry[key];
  }

  if (!state.data.market.lastGiftDate) state.data.market.lastGiftDate = {};
  state.data.market.lastGiftDate[char.id] = todayStr();

  addTokens(tokens);
  save();

  const label = source === 'inventory' ? (crops[key]?.name ?? key) : key;
  const reaction = isLoved
    ? `${char.emoji} "${char.name.toUpperCase()} IS THRILLED!" They absolutely love ${label}.`
    : `${char.emoji} ${char.name} says thank you for the ${label}!`;
  toast(`${reaction} +${tokens} tokens.`);

  giftMode = false;
  renderMarket();
  renderModalContent();
}
