import { state, save, addTokens, removeFromInventory, canAffordRecipe, allCrops, RECIPES } from './state.js';
import { onEnter, toast } from './nav.js';

export function initKitchen() {
  onEnter('kitchen', renderKitchen);
}

function renderKitchen() {
  renderRecipes();
  renderPantry();
}

function renderRecipes() {
  const list = document.getElementById('recipe-list');
  list.innerHTML = '';

  RECIPES.forEach(recipe => {
    const available = canAffordRecipe(recipe);
    const card = document.createElement('div');
    card.className = `recipe-card${available ? ' available' : ''}`;

    const ingredientHtml = recipe.alwaysAvailable
      ? '<span class="recipe-ingredient have">No garden ingredients needed</span>'
      : Object.entries(recipe.ingredients).map(([key, qty]) => {
          const have = (state.data.garden.inventory[key] ?? 0) >= qty;
          const crop = allCrops(state.data.market)[key];
          return `<span class="recipe-ingredient ${have ? 'have' : 'need'}">${crop?.emoji ?? ''} ${qty}× ${crop?.name ?? key}</span>`;
        }).join(' ');

    card.innerHTML = `
      <span class="recipe-emoji">${recipe.emoji}</span>
      <div class="recipe-info">
        <div class="recipe-name">${recipe.name}</div>
        <div class="recipe-desc">${recipe.desc}</div>
        <div class="recipe-ingredients">${ingredientHtml}</div>
        <button class="recipe-cook-btn" ${available ? '' : 'disabled'} data-id="${recipe.id}">
          ${available ? `Cook · +${recipe.tokens} tokens` : 'Not enough ingredients'}
        </button>
      </div>
    `;

    card.querySelector('.recipe-cook-btn').addEventListener('click', () => {
      if (available) cookRecipe(recipe);
    });

    list.appendChild(card);
  });
}

function cookRecipe(recipe) {
  if (!canAffordRecipe(recipe)) { toast("You don't have enough ingredients."); return; }

  for (const [key, qty] of Object.entries(recipe.ingredients)) {
    removeFromInventory(key, qty);
  }

  const pantry = state.data.pantry;
  pantry[recipe.result] = (pantry[recipe.result] ?? 0) + 1;

  addTokens(recipe.tokens);
  save();

  toast(`${recipe.emoji} Made ${recipe.name}! +${recipe.tokens} workshop tokens. It's in the pantry.`);
  renderKitchen();
}

function renderPantry() {
  const pantry = state.data.pantry;
  const list = document.getElementById('pantry-list');
  const empty = document.getElementById('pantry-empty');
  list.innerHTML = '';

  const entries = Object.entries(pantry).filter(([, v]) => v > 0);
  if (entries.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  entries.forEach(([name, qty]) => {
    const recipe = RECIPES.find(r => r.result === name);
    const row = document.createElement('div');
    row.className = 'pantry-row';
    row.innerHTML = `
      <span>${recipe?.emoji ?? '🫙'} ${name}</span>
      <span class="pantry-count">×${qty}</span>
    `;
    list.appendChild(row);
  });
}
