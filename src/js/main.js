import { initState } from './state.js';
import { initNav, goTo } from './nav.js';
import { initHome } from './home.js';
import { initGarden } from './garden.js';
import { initPond } from './pond.js';
import { initTrain } from './train.js';
import { initKitchen } from './kitchen.js';

async function boot() {
  await initState();
  initNav();
  initHome();
  initGarden();
  initPond();
  initTrain();
  initKitchen();
  goTo('home');
}

boot();
