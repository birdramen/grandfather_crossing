import { state, save, addTokens, FISH_VARIETIES, todayStr } from './state.js';
import { onEnter, toast } from './nav.js';

let namingFishId = null;

export function initPond() {
  onEnter('pond', renderPond);

  document.getElementById('feed-btn').addEventListener('click', feedFish);

  document.getElementById('confirm-name-btn').addEventListener('click', confirmName);
  document.getElementById('cancel-name-btn').addEventListener('click', () => {
    document.getElementById('name-modal').classList.add('hidden');
  });
  document.getElementById('fish-name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmName();
  });
  document.getElementById('name-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) document.getElementById('name-modal').classList.add('hidden');
  });
}

function renderPond() {
  renderFishInWater();
  renderFishList();
  renderFeedStatus();
  renderStreak();
}

// ─── Fish in water ────────────────────────────────────────────────────────────

function renderFishInWater() {
  const water = document.getElementById('pond-water');
  water.innerHTML = '';
  const today = todayStr();

  state.data.pond.fish.forEach((fish, i) => {
    const variety = FISH_VARIETIES[fish.variety] ?? FISH_VARIETIES['kohaku'];
    const el = document.createElement('div');
    el.className = 'fish-entity';
    el.dataset.fishId = fish.id;

    // Stagger positions around the pond
    const positions = [
      { left: '20%', top: '30%' },
      { left: '55%', top: '45%' },
      { left: '35%', top: '60%' },
      { left: '70%', top: '25%' },
      { left: '15%', top: '65%' },
    ];
    const pos = positions[i % positions.length];
    el.style.left = pos.left;
    el.style.top = pos.top;

    const fed = fish.lastFedDate === today;
    const mood = fed ? '😊' : '😐';

    el.innerHTML = `
      <div class="fish-body">
        <span class="fish-emoji" style="filter: drop-shadow(0 0 4px ${variety.colour})">🐟</span>
        ${fish.name ? `<span class="fish-name-tag">${fish.name}</span>` : ''}
        <span class="fish-happiness">${mood}</span>
      </div>
    `;

    // Animate fish swimming
    animateFish(el, i);

    el.addEventListener('click', () => openNameModal(fish.id));
    water.appendChild(el);
  });
}

function animateFish(el, index) {
  const pondWater = document.getElementById('pond-water');
  if (!pondWater) return;

  const duration = 4000 + index * 1200;
  const delay = index * 800;
  let phase = 0;

  const swim = () => {
    phase += 0.018;
    const baseLeft = 15 + (index * 20) % 60;
    const baseTop  = 25 + (index * 15) % 45;
    const x = baseLeft + Math.sin(phase + index) * 12;
    const y = baseTop  + Math.cos(phase * 0.7 + index * 0.5) * 8;
    el.style.left = `${x}%`;
    el.style.top  = `${y}%`;
    el.style.transform = Math.sin(phase) > 0 ? 'scaleX(1)' : 'scaleX(-1)';
    if (el.isConnected) requestAnimationFrame(swim);
  };

  setTimeout(() => requestAnimationFrame(swim), delay);
}

// ─── Fish list sidebar ────────────────────────────────────────────────────────

function renderFishList() {
  const today = todayStr();
  const list = document.getElementById('fish-list');
  list.innerHTML = '';
  state.data.pond.fish.forEach(fish => {
    const variety = FISH_VARIETIES[fish.variety];
    const fed = fish.lastFedDate === today;
    const row = document.createElement('div');
    row.className = 'fish-row';
    row.innerHTML = `
      <span class="fish-row-emoji" style="filter:drop-shadow(0 0 4px ${variety?.colour ?? '#888'})">🐟</span>
      <div class="fish-row-info">
        <div class="fish-row-name">${fish.name ?? 'Unnamed'}</div>
        <div class="fish-row-variety">${variety?.name ?? fish.variety}</div>
      </div>
      <span class="fish-row-mood" title="${fed ? 'Fed today' : 'Hungry'}">${fed ? '😊' : '😐'}</span>
    `;
    row.addEventListener('click', () => openNameModal(fish.id));
    list.appendChild(row);
  });
}

// ─── Feeding ──────────────────────────────────────────────────────────────────

function feedFish() {
  const today = todayStr();
  const { pond } = state.data;

  const alreadyFedAll = pond.fish.every(f => f.lastFedDate === today);
  if (alreadyFedAll) {
    toast("The fish are all well-fed — come back tomorrow!");
    return;
  }

  let newlyFed = 0;
  pond.fish.forEach(f => {
    if (f.lastFedDate !== today) {
      f.lastFedDate = today;
      f.happiness = Math.min(100, f.happiness + 20);
      newlyFed++;
    }
  });

  const tokensEarned = newlyFed * 3;

  // Update streak
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  if (pond.lastFeedDate === yesterday) {
    pond.consecutiveDays += 1;
  } else if (pond.lastFeedDate !== today) {
    pond.consecutiveDays = 1;
  }
  pond.lastFeedDate = today;

  addTokens(tokensEarned);
  save();

  toast(`🐡 Fed all the fish! +${tokensEarned} workshop tokens.`);
  renderPond();
}

// ─── Feed status ──────────────────────────────────────────────────────────────

function renderFeedStatus() {
  const today = todayStr();
  const { fish } = state.data.pond;
  const fedCount = fish.filter(f => f.lastFedDate === today).length;
  const status = document.getElementById('feed-status');
  if (fedCount === fish.length) {
    status.textContent = "All fish fed today — they're happy!";
  } else {
    status.textContent = `${fish.length - fedCount} fish waiting to be fed.`;
  }
}

function renderStreak() {
  const { consecutiveDays } = state.data.pond;
  const el = document.getElementById('streak-display');
  el.textContent = `${consecutiveDays} day${consecutiveDays !== 1 ? 's' : ''}`;
  if (consecutiveDays >= 7) el.title = "Excellent! The fish adore you.";
}

// ─── Naming ───────────────────────────────────────────────────────────────────

function openNameModal(fishId) {
  namingFishId = fishId;
  const fish = state.data.pond.fish.find(f => f.id === fishId);
  const input = document.getElementById('fish-name-input');
  input.value = fish?.name ?? '';
  document.getElementById('name-modal').classList.remove('hidden');
  setTimeout(() => input.focus(), 50);
}

function confirmName() {
  const input = document.getElementById('fish-name-input');
  const name = input.value.trim();
  if (!name) { toast("Please enter a name."); return; }
  const fish = state.data.pond.fish.find(f => f.id === namingFishId);
  if (fish) {
    fish.name = name;
    save();
    toast(`Named your fish "${name}"!`);
  }
  document.getElementById('name-modal').classList.add('hidden');
  renderPond();
}
