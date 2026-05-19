/**
 * Configuration and Constants
 * Canvas setup and game configuration
 */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Constants
const GAME_CONFIG = {
  PIPE_WIDTH: 80,
  PIPE_GAP: 150,
  PIPE_SPACING: 200,
  PIPE_SPEED: 2,
  GRAVITY: 0.25,
  FLAP_STRENGTH: -7,
  LOCAL_STORAGE_KEY: "flappyBirdBest",
};

// Game State
const GameState = {
  isGameRunning: false,
  score: 0,
  bestScore: localStorage.getItem(GAME_CONFIG.LOCAL_STORAGE_KEY) || 0,
};
