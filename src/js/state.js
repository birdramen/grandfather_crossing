// ─── Game data definitions ───────────────────────────────────────────────────

export const CROPS = {
  courgette:  { name: 'Courgette',   emoji: '🥒', growHours: 0.083, perennial: false, yield: 3, tokenReward: 2 }, // 5 min
  tomato:     { name: 'Tomato',      emoji: '🍅', growHours: 0.083, perennial: false, yield: 2, tokenReward: 2 }, // 5 min
  carrot:     { name: 'Carrot',      emoji: '🥕', growHours: 0.05,  perennial: false, yield: 3, tokenReward: 1 }, // 3 min
  aubergine:  { name: 'Aubergine',   emoji: '🍆', growHours: 0.1,   perennial: false, yield: 2, tokenReward: 2 }, // 6 min
  cabbage:    { name: 'Cabbage',     emoji: '🥬', growHours: 0.133, perennial: false, yield: 2, tokenReward: 2 }, // 8 min
  grape:      { name: 'Grape Vine',  emoji: '🍇', growHours: 0.2,   perennial: true,  yield: 5, tokenReward: 3 }, // 12 min
  fig:        { name: 'Fig Tree',    emoji: '🌿', growHours: 0.25,  perennial: true,  yield: 4, tokenReward: 3 }, // 15 min
  rose:       { name: 'Rose',        emoji: '🌹', growHours: 0.083, perennial: false, yield: 1, tokenReward: 1 }, // 5 min
  sunflower:  { name: 'Sunflower',   emoji: '🌻', growHours: 0.1,   perennial: false, yield: 1, tokenReward: 1 }, // 6 min
  daisy:      { name: 'Daisy',       emoji: '🌼', growHours: 0.033, perennial: false, yield: 2, tokenReward: 1 }, // 2 min
};

export const RECIPES = [
  {
    id: 'courgette_chutney',
    name: 'Courgette Chutney',
    emoji: '🫙',
    desc: "A classic. Lovely with a ploughman's.",
    ingredients: { courgette: 4, tomato: 1 },
    result: 'Courgette Chutney',
    tokens: 6,
  },
  {
    id: 'tomato_chutney',
    name: 'Tomato Chutney',
    emoji: '🫙',
    desc: 'Perfect with a bit of aged cheddar.',
    ingredients: { tomato: 4 },
    result: 'Tomato Chutney',
    tokens: 5,
  },
  {
    id: 'ratatouille',
    name: 'Ratatouille',
    emoji: '🫕',
    desc: 'A summer classic from the garden.',
    ingredients: { courgette: 2, tomato: 2, aubergine: 1 },
    result: 'Ratatouille',
    tokens: 7,
  },
  {
    id: 'fig_preserve',
    name: 'Fig Preserve',
    emoji: '🫙',
    desc: 'Wonderfully sweet. Lovely on toast.',
    ingredients: { fig: 4 },
    result: 'Fig Preserve',
    tokens: 8,
  },
  {
    id: 'grape_juice',
    name: 'Pressed Grape Juice',
    emoji: '🧃',
    desc: 'Freshly squeezed. Simply delicious.',
    ingredients: { grape: 5 },
    result: 'Pressed Grape Juice',
    tokens: 7,
  },
  {
    id: 'courgette_cake',
    name: 'Courgette Cake',
    emoji: '🎂',
    desc: "People are always surprised how good it is!",
    ingredients: { courgette: 3 },
    result: 'Courgette Cake',
    tokens: 7,
  },
  {
    id: 'carrot_soup',
    name: 'Carrot & Coriander Soup',
    emoji: '🍲',
    desc: 'Warming and hearty.',
    ingredients: { carrot: 3 },
    result: 'Carrot Soup',
    tokens: 4,
  },
  {
    id: 'custard_tarts',
    name: 'Custard Tarts',
    emoji: '🥧',
    desc: 'Made from scratch, as it should be.',
    ingredients: {},
    result: 'Custard Tarts',
    tokens: 5,
    alwaysAvailable: true,
  },
  {
    id: 'flower_bouquet',
    name: 'Flower Bouquet',
    emoji: '💐',
    desc: 'A lovely arrangement to brighten the house.',
    ingredients: { rose: 2, daisy: 2 },
    result: 'Flower Bouquet',
    tokens: 5,
  },
  {
    id: 'pickled_cabbage',
    name: 'Pickled Cabbage',
    emoji: '🫙',
    desc: 'A satisfying crunch. Keeps for months.',
    ingredients: { cabbage: 3 },
    result: 'Pickled Cabbage',
    tokens: 4,
  },
];

export const FISH_VARIETIES = {
  kohaku:       { name: 'Kohaku',       emoji: '🐟', colour: '#e8783a', desc: 'White with red-orange markings.' },
  kumonryu:     { name: 'Kumonryu',     emoji: '🐟', colour: '#3a3a4a', desc: 'Black and white, like ink clouds.' },
  shiro_utsuri: { name: 'Shiro Utsuri', emoji: '🐟', colour: '#e8e0c8', desc: 'Pale white with soft markings.' },
  yamabuki:     { name: 'Yamabuki',     emoji: '🐟', colour: '#d4a020', desc: 'Golden yellow — brings good luck!' },
  tancho:       { name: 'Tancho',       emoji: '🐟', colour: '#f0f0e8', desc: 'Pure white with one red spot.' },
};

export const TRAIN_PIECES = [
  { id: 'steam_engine',       name: 'Steam Engine',       emoji: '🚂', cost: 0,  category: 'Train',    starter: true },
  { id: 'coal_tender',        name: 'Coal Tender',        emoji: '🚃', cost: 10, category: 'Train' },
  { id: 'passenger_carriage', name: 'Passenger Carriage', emoji: '🚃', cost: 15, category: 'Train' },
  { id: 'goods_wagon',        name: 'Goods Wagon',        emoji: '📦', cost: 15, category: 'Train' },
  { id: 'oak_tree',           name: 'Oak Tree',           emoji: '🌳', cost: 8,  category: 'Scenery' },
  { id: 'pine_tree',          name: 'Pine Tree',          emoji: '🌲', cost: 8,  category: 'Scenery' },
  { id: 'mountain',           name: 'Mountain',           emoji: '⛰️', cost: 20, category: 'Scenery' },
  { id: 'sheep',              name: 'Sheep',              emoji: '🐑', cost: 12, category: 'Animals' },
  { id: 'cow',                name: 'Cow',                emoji: '🐄', cost: 12, category: 'Animals' },
  { id: 'horse',              name: 'Horse',              emoji: '🐴', cost: 15, category: 'Animals' },
  { id: 'village_house',      name: 'Village House',      emoji: '🏡', cost: 25, category: 'Buildings' },
  { id: 'station',            name: 'Station',            emoji: '🚉', cost: 30, category: 'Buildings' },
  { id: 'signal_box',         name: 'Signal Box',         emoji: '🏠', cost: 20, category: 'Buildings' },
  { id: 'footbridge',         name: 'Footbridge',         emoji: '🌉', cost: 25, category: 'Buildings' },
  // Track pieces — rendered as styled track segments, not emoji
  { id: 'track_straight',     name: 'Straight Track',     emoji: '━', cost: 5,  category: 'Track', isTrack: true, trackType: 'straight' },
  { id: 'track_curve',        name: 'Curved Track',       emoji: '╮', cost: 5,  category: 'Track', isTrack: true, trackType: 'curve-br' },
  { id: 'track_curve_bl',     name: 'Curved Track',       emoji: '╭', cost: 5,  category: 'Track', isTrack: true, trackType: 'curve-bl' },
  { id: 'track_tunnel',       name: 'Tunnel Mouth',       emoji: '🕳️', cost: 18, category: 'Track' },
  { id: 'track_buffer',       name: 'Buffer Stop',        emoji: '🛑', cost: 8,  category: 'Track' },
  { id: 'track_signal',       name: 'Semaphore Signal',   emoji: '🚦', cost: 10, category: 'Track' },
  { id: 'track_level',        name: 'Level Crossing',     emoji: '⛏️', cost: 12, category: 'Track' },
  { id: 'track_viaduct',      name: 'Viaduct Section',    emoji: '🏗️', cost: 22, category: 'Track' },
];

// ─── Default save state ──────────────────────────────────────────────────────

function blankPlot(id) {
  return { id, crop: null, plantedAt: null, lastWatered: null, withered: false, harvestedAt: null };
}

export function defaultState() {
  return {
    version: 1,
    tokens: 0,
    garden: {
      plots: Array.from({ length: 16 }, (_, i) => blankPlot(i)),
      inventory: {},
    },
    pond: {
      fish: [
        { id: 'koi1', name: null, variety: 'kohaku',       happiness: 80, lastFedDate: null },
        { id: 'koi2', name: null, variety: 'kumonryu',     happiness: 80, lastFedDate: null },
        { id: 'koi3', name: null, variety: 'shiro_utsuri', happiness: 80, lastFedDate: null },
      ],
      consecutiveDays: 0,
      lastFeedDate: null,
    },
    train: {
      ownedPieces: ['steam_engine'],
      layout: [],
    },
    pantry: {},
  };
}

// ─── Live state object (loaded from disk or fresh) ────────────────────────────

export const state = { data: null };

export async function initState() {
  try {
    const saved = window.gameAPI
      ? await window.gameAPI.loadGame()
      : JSON.parse(localStorage.getItem('philips-garden') ?? 'null');
    state.data = saved ?? defaultState();
  } catch {
    state.data = defaultState();
  }
}

export function save() {
  try {
    if (window.gameAPI) {
      window.gameAPI.saveGame(state.data);
    } else {
      localStorage.setItem('philips-garden', JSON.stringify(state.data));
    }
  } catch { /* ignore save errors */ }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function now() { return Date.now(); }

export function hoursElapsed(timestamp) {
  return (now() - timestamp) / 3_600_000;
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function addTokens(n) {
  state.data.tokens += n;
  save();
}

export function addToInventory(cropKey, qty) {
  const inv = state.data.garden.inventory;
  inv[cropKey] = (inv[cropKey] ?? 0) + qty;
}

export function removeFromInventory(cropKey, qty) {
  const inv = state.data.garden.inventory;
  inv[cropKey] = Math.max(0, (inv[cropKey] ?? 0) - qty);
  if (inv[cropKey] === 0) delete inv[cropKey];
}

export function canAffordRecipe(recipe) {
  if (recipe.alwaysAvailable) return true;
  for (const [key, qty] of Object.entries(recipe.ingredients)) {
    if ((state.data.garden.inventory[key] ?? 0) < qty) return false;
  }
  return true;
}
