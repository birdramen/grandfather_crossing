import { initState } from './state.js';
import { initNav, goTo } from './nav.js';
import { initHome } from './home.js';
import { initGarden } from './garden.js';
import { initPond } from './pond.js';
import { initTrain } from './train.js';
import { initKitchen } from './kitchen.js';

async function boot() {
  try {
    await initState();
  } catch {
    // Start fresh if save file is corrupt
    const { defaultState, state } = await import('./state.js');
    state.data = defaultState();
  }
  initNav();
  initHome();
  initGarden();
  initPond();
  initTrain();
  initKitchen();
  goTo('home');
}

boot();
