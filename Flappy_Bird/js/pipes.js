/**
 * Pipes Management
 * Handles pipe generation and updates
 */

let pipes = [];
let pipeCounter = 0;

/**
 * Create a new pipe
 */
function createPipe() {
  const gapY =
    Math.random() * (canvas.height - GAME_CONFIG.PIPE_GAP - 100) + 50;
  pipes.push({
    x: canvas.width,
    gapStart: gapY,
    gapEnd: gapY + GAME_CONFIG.PIPE_GAP,
    passed: false,
  });
}

/**
 * Update all pipes (move and check collisions)
 */
function updatePipes() {
  pipeCounter++;

  // Generate new pipe
  if (pipeCounter > GAME_CONFIG.PIPE_SPACING) {
    createPipe();
    pipeCounter = 0;
  }

  // Update existing pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= GAME_CONFIG.PIPE_SPEED;

    // Check if bird passed pipe
    if (!pipes[i].passed && pipes[i].x + GAME_CONFIG.PIPE_WIDTH < Bird.x) {
      pipes[i].passed = true;
      GameState.score++;
      document.getElementById("score").textContent = GameState.score;
    }

    // Remove off-screen pipes
    if (pipes[i].x + GAME_CONFIG.PIPE_WIDTH < 0) {
      pipes.splice(i, 1);
    }
  }
}

/**
 * Check collision with pipes
 */
function checkPipeCollision() {
  for (let pipe of pipes) {
    // Check horizontal overlap
    if (
      Bird.x + Bird.width > pipe.x &&
      Bird.x < pipe.x + GAME_CONFIG.PIPE_WIDTH
    ) {
      // Check vertical collision
      if (Bird.y < pipe.gapStart || Bird.y + Bird.height > pipe.gapEnd) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Reset pipes
 */
function resetPipes() {
  pipes = [];
  pipeCounter = 0;
}
