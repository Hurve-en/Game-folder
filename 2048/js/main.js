/**
 * Main Entry Point
 * Initialization and event listener setup
 */

// Initialize the best score display
document.getElementById("best").textContent = GameState.bestScore;

// Setup event listeners
document.getElementById("newGameBtn").addEventListener("click", startNewGame);
document.getElementById("undoBtn").addEventListener("click", undo);
document.addEventListener("keydown", handleKeyPress);

// Start the game
initBoard();
