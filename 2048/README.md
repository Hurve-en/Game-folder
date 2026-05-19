# 2048 Game - Modular File Structure

A well-organized 2048 puzzle game with a modular file structure for better maintainability.

## Directory Structure

```
2048/
├── index.html          # Main HTML file
├── css/
│   └── styles.css     # All styling (moved from root)
├── js/
│   ├── config.js      # Configuration and game state
│   ├── game-logic.js  # Core game mechanics
│   ├── ui.js          # Display and rendering functions
│   ├── input.js       # Keyboard input handling
│   └── main.js        # Initialization and event listeners
└── README.md          # This file
```

## File Descriptions

### `index.html`
Main HTML entry point. Contains all UI elements including the game board, score display, and modals. Script files are loaded in the correct order to ensure dependencies.

### `css/styles.css`
All stylesheet definitions including:
- Layout and grid system
- Tile styling and animations
- Button and modal styles
- Responsive design for mobile devices

### `js/config.js`
- Game constants (grid size, target score, etc.)
- Centralized `GameState` object containing board, score, and game status

### `js/game-logic.js`
Core game mechanics:
- `initBoard()` - Initialize new game
- `addNewTile()` - Spawn new tiles
- Movement functions: `moveLeft()`, `moveRight()`, `moveUp()`, `moveDown()`
- Utility functions: `slideLeft()`, `mergeLeft()`, `transpose()`
- `checkGameStatus()` - Determine win/lose conditions
- `undo()` - Revert last move

### `js/ui.js`
UI-related functions:
- `updateDisplay()` - Render the game board
- `showGameOverModal()` - Display game over screen
- `showWinModal()` - Display victory screen
- `startNewGame()` - Reset and start new game
- Modal management functions

### `js/input.js`
Input handling:
- `handleKeyPress()` - Process keyboard input (arrow keys and WASD)

### `js/main.js`
Initialization script:
- Sets up event listeners
- Loads best score from localStorage
- Starts the game

## How to Use

1. Open `index.html` in a web browser
2. Use **Arrow Keys** or **WASD** to move tiles
3. Combine tiles with the same number to create larger numbers
4. Reach **2048** to win!

## Features

✓ Modular, maintainable code structure  
✓ Separate concerns (logic, UI, input)  
✓ Persistent best score storage  
✓ Undo functionality  
✓ Responsive design for mobile  
✓ Game over and win modal screens  

## Script Load Order

Scripts must be loaded in this specific order:
1. `config.js` - Defines configuration and state
2. `game-logic.js` - Game mechanics (uses `GameState` from config)
3. `ui.js` - UI functions (uses game functions)
4. `input.js` - Input handler (calls movement functions)
5. `main.js` - Initialization (sets up all event listeners)

This ensures all dependencies are resolved before they're used.
