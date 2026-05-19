/**
 * Input Handling
 * Keyboard input processing
 */

/**
 * Handle keyboard input for game controls
 */
function handleKeyPress(e) {
  if (!GameState.gameOver && !GameState.won) {
    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        e.preventDefault();
        moveUp();
        break;
      case "ArrowDown":
      case "s":
      case "S":
        e.preventDefault();
        moveDown();
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        e.preventDefault();
        moveLeft();
        break;
      case "ArrowRight":
      case "d":
      case "D":
        e.preventDefault();
        moveRight();
        break;
    }
  }
}
