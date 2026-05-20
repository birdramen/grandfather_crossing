import { initState } from './state.js';
import { initNav, goTo } from './nav.js';
import { initHome } from './home.js';
import { initGarden } from './garden.js';
import { initPond } from './pond.js';
import { initTrain } from './train.js';
import { initKitchen } from './kitchen.js';
import { initMarket } from './market.js';

async function boot() {
  try {
    await initState();
  } catch {
    const { defaultState, state } = await import('./state.js');
    state.data = defaultState();
  }
  try {
    initNav();
    initHome();
    initGarden();
    initPond();
    initTrain();
    initKitchen();
    initMarket();
  } catch (e) {
    console.error('Init error:', e);
  }
  goTo('home');
}

boot();
