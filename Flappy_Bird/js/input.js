/**
 * Input Handling
 * Keyboard and mouse input processing
 */

/**
 * Handle keyboard input (Space to flap)
 */
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && GameState.isGameRunning) {
    e.preventDefault();
    Bird.flap_action();
  }
});

/**
 * Handle mouse click (Click canvas to flap)
 */
canvas.addEventListener("click", () => {
  if (GameState.isGameRunning) {
    Bird.flap_action();
  }
});
