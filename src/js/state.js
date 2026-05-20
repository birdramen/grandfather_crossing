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
  // Market-unlocked crop recipes (only visible once crop is grown)
  {
    id: 'strawberry_jam',
    name: 'Strawberry Jam',
    emoji: '🍓',
    desc: 'Impossibly good on a scone.',
    ingredients: { strawberry: 4 },
    result: 'Strawberry Jam',
    tokens: 8,
  },
  {
    id: 'apple_crumble',
    name: 'Apple Crumble',
    emoji: '🥧',
    desc: 'Served warm with custard, naturally.',
    ingredients: { apple: 3 },
    result: 'Apple Crumble',
    tokens: 9,
  },
  {
    id: 'sweetcorn_relish',
    name: 'Sweetcorn Relish',
    emoji: '🫙',
    desc: 'Lovely with cold meats.',
    ingredients: { sweetcorn: 3, tomato: 1 },
    result: 'Sweetcorn Relish',
    tokens: 7,
  },
  {
    id: 'blueberry_muffins',
    name: 'Blueberry Muffins',
    emoji: '🧁',
    desc: "Rosie's absolute favourite.",
    ingredients: { blueberry: 3 },
    result: 'Blueberry Muffins',
    tokens: 8,
  },
  {
    id: 'pear_chutney',
    name: 'Pear Chutney',
    emoji: '🫙',
    desc: 'A touch of ginger makes all the difference.',
    ingredients: { pear: 4 },
    result: 'Pear Chutney',
    tokens: 7,
  },
];

export const FISH_VARIETIES = {
  kohaku:       { name: 'Kohaku',       emoji: '🐟', colour: '#e8783a', desc: 'White with red-orange markings.' },
  kumonryu:     { name: 'Kumonryu',     emoji: '🐟', colour: '#3a3a4a', desc: 'Black and white, like ink clouds.' },
  shiro_utsuri: { name: 'Shiro Utsuri', emoji: '🐟', colour: '#e8e0c8', desc: 'Pale white with soft markings.' },
  yamabuki:     { name: 'Yamabuki',     emoji: '🐟', colour: '#d4a020', desc: 'Golden yellow — brings good luck!' },
  tancho:       { name: 'Tancho',       emoji: '🐟', colour: '#f8f0f0', desc: 'Pure white with one red spot — very rare.' },
};

// Helper: all available crops (base + market-unlocked)
export function allCrops(marketState) {
  const unlocked = marketState?.unlockedCrops ?? [];
  const extra = Object.fromEntries(unlocked.map(k => [k, MARKET_CROPS[k]]).filter(([, v]) => v));
  return { ...CROPS, ...extra };
}

// isRollingStock → runs on the track, can buy multiple
// isTrack        → extends the oval, can buy multiple
// isAccessory    → appears around the track, one of each
// isScenery      → dragged into the oval interior, one of each
export const TRAIN_PIECES = [
  // ── Rolling stock (runs on the track) ──
  { id: 'steam_engine',       name: 'Steam Engine',       emoji: '🚂', cost: 0,  isRollingStock: true, starter: true },
  { id: 'coal_tender',        name: 'Coal Tender',        emoji: '🟫', cost: 10, isRollingStock: true },
  { id: 'passenger_carriage', name: 'Passenger Coach',    emoji: '🚃', cost: 15, isRollingStock: true },
  { id: 'goods_wagon',        name: 'Goods Wagon',        emoji: '🚋', cost: 15, isRollingStock: true },
  { id: 'dining_car',         name: 'Dining Car',         emoji: '🍽️', cost: 20, isRollingStock: true },
  { id: 'brake_van',          name: 'Brake Van',          emoji: '🔴', cost: 12, isRollingStock: true },
  // ── Track extensions (each piece widens the oval) ──
  { id: 'track_straight',     name: 'Straight Section',   emoji: '━━', cost: 5,  isTrack: true },
  { id: 'track_curve',        name: 'Curved Section',     emoji: '╰╮', cost: 5,  isTrack: true },
  // ── Track accessories (auto-placed around the track) ──
  { id: 'tunnel',             name: 'Tunnel Mouth',       emoji: '🕳️', cost: 18, isAccessory: true },
  { id: 'signal',             name: 'Semaphore Signal',   emoji: '🚦', cost: 10, isAccessory: true },
  { id: 'level_crossing',     name: 'Level Crossing',     emoji: '⛓️', cost: 12, isAccessory: true },
  { id: 'water_tower',        name: 'Water Tower',        emoji: '🏗️', cost: 15, isAccessory: true },
  { id: 'buffer_stop',        name: 'Buffer Stop',        emoji: '🛑', cost: 8,  isAccessory: true },
  // ── Scenery (dragged into the oval interior) ──
  { id: 'oak_tree',           name: 'Oak Tree',           emoji: '🌳', cost: 8,  isScenery: true },
  { id: 'pine_tree',          name: 'Pine Tree',          emoji: '🌲', cost: 8,  isScenery: true },
  { id: 'mountain',           name: 'Mountain',           emoji: '⛰️', cost: 20, isScenery: true },
  { id: 'sheep',              name: 'Sheep',              emoji: '🐑', cost: 12, isScenery: true },
  { id: 'cow',                name: 'Cow',                emoji: '🐄', cost: 12, isScenery: true },
  { id: 'horse',              name: 'Horse',              emoji: '🐴', cost: 15, isScenery: true },
  { id: 'village_house',      name: 'Village House',      emoji: '🏡', cost: 25, isScenery: true },
  { id: 'station',            name: 'Station',            emoji: '🚉', cost: 30, isScenery: true },
  { id: 'signal_box',         name: 'Signal Box',         emoji: '🏠', cost: 20, isScenery: true },
  { id: 'footbridge',         name: 'Footbridge',         emoji: '🌉', cost: 25, isScenery: true },
];

// ─── Market: crops unlockable via trading ────────────────────────────────────

export const MARKET_CROPS = {
  strawberry: { name: 'Strawberry',     emoji: '🍓', growHours: 0.067, perennial: true,  yield: 4, tokenReward: 2 },
  sweetcorn:  { name: 'Sweetcorn',      emoji: '🌽', growHours: 0.12,  perennial: false, yield: 2, tokenReward: 2 },
  blueberry:  { name: 'Blueberry Bush', emoji: '🫐', growHours: 0.2,   perennial: true,  yield: 5, tokenReward: 3 },
  apple:      { name: 'Apple Tree',     emoji: '🍎', growHours: 0.3,   perennial: true,  yield: 3, tokenReward: 3 },
  pear:       { name: 'Pear Tree',      emoji: '🍐', growHours: 0.3,   perennial: true,  yield: 3, tokenReward: 3 },
};

// ─── Market: characters & trades ─────────────────────────────────────────────

export const MARKET_CHARACTERS = [
  {
    id: 'margaret',
    name: 'Margaret',
    relation: 'your daughter',
    emoji: '👩‍🦱',
    flavour: '"Oh Dad, these are just gorgeous — you spoil us!"',
    loves: ['rose', 'sunflower', 'daisy', 'Flower Bouquet', 'Custard Tarts'],
    trades: [
      {
        id: 'trade_strawberry',
        label: 'Strawberry Plants',
        desc: "She brought a cutting from her own allotment — lovely of her.",
        needs: { pantry: { 'Flower Bouquet': 2 } },
        reward: { type: 'crop', id: 'strawberry' },
        bonus: 15,
      },
      {
        id: 'trade_yamabuki',
        label: 'A Yamabuki Koi',
        desc: "Golden all over — she spotted it at the garden centre and thought of you.",
        needs: { pantry: { 'Pressed Grape Juice': 3 } },
        reward: { type: 'fish', variety: 'yamabuki' },
        bonus: 10,
      },
    ],
  },
  {
    id: 'george',
    name: 'George',
    relation: 'son-in-law',
    emoji: '👨',
    flavour: '"Absolute corker, Philip. Best chutney I\'ve ever had."',
    loves: ['courgette', 'tomato', 'aubergine', 'Courgette Chutney', 'Tomato Chutney', 'Ratatouille'],
    trades: [
      {
        id: 'trade_sweetcorn',
        label: 'Sweetcorn Seeds',
        desc: "His own variety — been saving the seeds for thirty years.",
        needs: { inventory: { courgette: 4, tomato: 2 } },
        reward: { type: 'crop', id: 'sweetcorn' },
        bonus: 12,
      },
      {
        id: 'trade_tancho',
        label: 'A Tancho Koi',
        desc: "Pure white with one red spot. Apparently terribly rare.",
        needs: { pantry: { 'Ratatouille': 1 } },
        reward: { type: 'fish', variety: 'tancho' },
        bonus: 10,
      },
    ],
  },
  {
    id: 'rosie',
    name: 'Rosie',
    relation: 'granddaughter',
    emoji: '👧',
    flavour: '"Grandpa these are the BEST custard tarts in the whole world."',
    loves: ['daisy', 'rose', 'Custard Tarts', 'Courgette Cake', 'grape'],
    trades: [
      {
        id: 'trade_blueberry',
        label: 'Blueberry Bush',
        desc: "She bought it as a surprise — delighted with the tarts, she was.",
        needs: { pantry: { 'Custard Tarts': 2, 'Courgette Cake': 1 } },
        reward: { type: 'crop', id: 'blueberry' },
        bonus: 15,
      },
      {
        id: 'trade_apple',
        label: 'Apple Tree Sapling',
        desc: "She found it at the nursery and thought of Grandpa straight away.",
        needs: { inventory: { grape: 5 } },
        reward: { type: 'crop', id: 'apple' },
        bonus: 12,
      },
    ],
  },
  {
    id: 'ted',
    name: 'Ted',
    relation: 'old friend from the allotment',
    emoji: '🧓',
    flavour: '"Now THAT\'s a proper chutney. You\'ve still got it, Philip."',
    loves: ['Fig Preserve', 'Pickled Cabbage', 'Carrot Soup', 'fig', 'cabbage'],
    trades: [
      {
        id: 'trade_pear',
        label: 'Williams Pear Cutting',
        desc: "From his old Williams pear — been in his garden over forty years.",
        needs: { pantry: { 'Fig Preserve': 1, 'Pickled Cabbage': 1 } },
        reward: { type: 'crop', id: 'pear' },
        bonus: 15,
      },
    ],
  },
];

// Token reward for gifting based on whether they love/like it
export function giftTokenValue(char, itemKey) {
  return char.loves.includes(itemKey) ? 10 : 4;
}

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
      // Rolling stock + track pieces stored as array (duplicates allowed for multiples)
      ownedPieces: ['steam_engine'],
      // Unlocked scenery/accessory type IDs (set semantics — one of each)
      unlockedScenery: [],
      // Placed scenery: { pieceId, x, y } — positions inside the oval (%)
      sceneryLayout: [],
    },
    pantry: {},
    market: {
      completedTrades: [],
      lastGiftDate: {},   // { characterId: 'YYYY-MM-DD' }
      unlockedCrops: [],  // MARKET_CROPS keys unlocked via trades
    },
  };
}

// ─── Live state object (loaded from disk or fresh) ────────────────────────────

export const state = { data: null };

function loadWithTimeout(ms) {
  return Promise.race([
    window.gameAPI.loadGame(),
    new Promise(resolve => setTimeout(() => resolve(null), ms)),
  ]);
}

export async function initState() {
  try {
    const saved = window.gameAPI
      ? await loadWithTimeout(3000)
      : JSON.parse(localStorage.getItem('philips-garden') ?? 'null');
    if (saved) {
      const fresh = defaultState();
      // Patch any top-level keys added after the save was created
      if (!saved.pantry)  saved.pantry  = fresh.pantry;
      if (!saved.market)  saved.market  = fresh.market;
      if (!saved.market.completedTrades) saved.market.completedTrades = [];
      if (!saved.market.lastGiftDate)    saved.market.lastGiftDate    = {};
      if (!saved.market.unlockedCrops)   saved.market.unlockedCrops   = [];
      state.data = saved;
    } else {
      state.data = defaultState();
    }
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
