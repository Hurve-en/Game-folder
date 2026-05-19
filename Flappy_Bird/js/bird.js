/**
 * Bird Object and Properties
 * Handles bird state and physics
 */

const Bird = {
  x: 100,
  y: 250,
  width: 40,
  height: 40,
  velocityY: 0,
  gravity: GAME_CONFIG.GRAVITY,
  flap: GAME_CONFIG.FLAP_STRENGTH,
  color: "#FFD700",

  /**
   * Apply gravity to bird
   */
  applyGravity() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;
  },

  /**
   * Make bird flap (jump)
   */
  flap_action() {
    this.velocityY = this.flap;
  },

  /**
   * Reset bird to initial state
   */
  reset() {
    this.y = canvas.height / 2;
    this.velocityY = 0;
  },

  /**
   * Check if bird is out of bounds
   */
  isOutOfBounds() {
    return this.y < 0 || this.y + this.height > canvas.height;
  },
};
