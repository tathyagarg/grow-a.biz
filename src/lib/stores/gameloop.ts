import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const INTERVAL_MS = 10_000;
const STORAGE_KEY = 'game-last-tick';

function createGameClock() {
  const { subscribe, set, update } = writable<number>(0);

  let interval: ReturnType<typeof setInterval>;

  if (browser) {
    let lastTick = parseInt(localStorage.getItem(STORAGE_KEY) || Date.now().toString());

    set(lastTick);

    interval = setInterval(() => {
      console.log('Game tick');

      const now = Date.now();
      update(() => now);
      localStorage.setItem(STORAGE_KEY, now.toString());

    }, INTERVAL_MS);
  }

  return {
    subscribe,
    stop: () => {
      if (interval) clearInterval(interval);
    }
  };
}

export const gameClock = createGameClock();

