/**
 * Main Entry Point
 * Initialization and event listener setup
 */

// Initialize best score display
document.getElementById("best").textContent = GameState.bestScore;

// Setup button event listeners
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);

// Initial draw
draw();
