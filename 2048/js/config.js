/**
 * Configuration and Constants
 * Centralized configuration for the 2048 game
 */

const CONFIG = {
  GRID_SIZE: 4,
  NEW_TILE_PROBABILITY: 0.9, // 90% chance for 2, 10% for 4
  MAX_HISTORY: 10,
  TARGET_SCORE: 2048,
  LOCAL_STORAGE_KEY: "best2048",
};

// Game State
const GameState = {
  board: [],
  score: 0,
  bestScore: localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY) || 0,
  gameOver: false,
  won: false,
  history: [],
};
