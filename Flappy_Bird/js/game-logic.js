/**
 * Core Game Logic
 * Game state management and collision detection
 */

/**
 * Start a new game
 */
function startGame() {
  if (GameState.isGameRunning) return;

  GameState.isGameRunning = true;
  GameState.score = 0;
  Bird.reset();
  resetPipes();

  document.getElementById("score").textContent = GameState.score;
  document.getElementById("startBtn").disabled = true;

  gameLoop();
}

/**
 * Reset the game
 */
function resetGame() {
  GameState.isGameRunning = false;
  GameState.score = 0;
  Bird.reset();
  resetPipes();

  document.getElementById("score").textContent = GameState.score;
  document.getElementById("startBtn").disabled = false;

  draw();
}

/**
 * Update game state
 */
function update() {
  // Update bird physics
  Bird.applyGravity();

  // Update pipes
  updatePipes();

  // Check collisions
  if (checkPipeCollision() || Bird.isOutOfBounds()) {
    gameOver();
  }
}

/**
 * Game over handler
 */
function gameOver() {
  GameState.isGameRunning = false;
  document.getElementById("startBtn").disabled = false;

  // Update best score
  if (GameState.score > GameState.bestScore) {
    GameState.bestScore = GameState.score;
    localStorage.setItem(GAME_CONFIG.LOCAL_STORAGE_KEY, GameState.bestScore);
    document.getElementById("best").textContent = GameState.bestScore;
  }

  // Show alert
  setTimeout(() => {
    alert(
      `Game Over!\nScore: ${GameState.score}\nBest: ${GameState.bestScore}`,
    );
  }, 100);
}

/**
 * Main game loop
 */
function gameLoop() {
  update();
  draw();

  if (GameState.isGameRunning) {
    requestAnimationFrame(gameLoop);
  }
}
