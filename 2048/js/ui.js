/**
 * UI Rendering and Display
 * Handle all display updates and modal interactions
 */

/**
 * Update the game board display
 */
function updateDisplay() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    for (let j = 0; j < CONFIG.GRID_SIZE; j++) {
      const value = GameState.board[i][j];
      const tile = document.createElement("div");
      tile.className = `tile`;
      if (value !== 0) {
        tile.textContent = value;
        tile.classList.add(`tile-${value}`);
      }
      gameBoard.appendChild(tile);
    }
  }

  document.getElementById("score").textContent = GameState.score;
  document.getElementById("best").textContent = GameState.bestScore;
}

/**
 * Show game over modal
 */
function showGameOverModal() {
  document.getElementById("finalScore").textContent = GameState.score;
  document.getElementById("finalBest").textContent = GameState.bestScore;
  document.getElementById("gameOverModal").classList.remove("hidden");
}

/**
 * Show win modal
 */
function showWinModal() {
  document.getElementById("winScore").textContent = GameState.score;
  document.getElementById("winModal").classList.remove("hidden");
}

/**
 * Close win modal
 */
function closeWinModal() {
  document.getElementById("winModal").classList.add("hidden");
}

/**
 * Close any open modal
 */
function closeModal() {
  document.getElementById("gameOverModal").classList.add("hidden");
  document.getElementById("winModal").classList.add("hidden");
}

/**
 * Start a new game
 */
function startNewGame() {
  closeModal();
  initBoard();
}
