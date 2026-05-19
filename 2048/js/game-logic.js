/**
 * Core Game Logic
 * Board operations, movements, and game status checks
 */

/**
 * Initialize a new game board
 */
function initBoard() {
  GameState.board = Array(CONFIG.GRID_SIZE)
    .fill(null)
    .map(() => Array(CONFIG.GRID_SIZE).fill(0));
  addNewTile();
  addNewTile();
  GameState.score = 0;
  GameState.gameOver = false;
  GameState.won = false;
  GameState.history = [];
  updateDisplay();
}

/**
 * Add a new tile (2 or 4) to a random empty cell
 */
function addNewTile() {
  const emptyCells = [];
  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    for (let j = 0; j < CONFIG.GRID_SIZE; j++) {
      if (GameState.board[i][j] === 0) {
        emptyCells.push({ x: i, y: j });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    GameState.board[randomCell.x][randomCell.y] =
      Math.random() < CONFIG.NEW_TILE_PROBABILITY ? 2 : 4;
  }
}

/**
 * Save current board state and score to history
 */
function saveHistory() {
  GameState.history.push({
    board: GameState.board.map((row) => [...row]),
    score: GameState.score,
  });
  if (GameState.history.length > CONFIG.MAX_HISTORY) GameState.history.shift();
}

/**
 * Undo the last move
 */
function undo() {
  if (GameState.history.length > 0) {
    const previous = GameState.history.pop();
    GameState.board = previous.board.map((row) => [...row]);
    GameState.score = previous.score;
    GameState.gameOver = false;
    GameState.won = false;
    updateDisplay();
  }
}

/**
 * Move tiles left
 */
function moveLeft() {
  saveHistory();
  let moved = false;

  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    GameState.board[i] = slideLeft(GameState.board[i]);
    GameState.board[i] = mergeLeft(GameState.board[i]);
    GameState.board[i] = slideLeft(GameState.board[i]);
  }

  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    for (let j = 0; j < CONFIG.GRID_SIZE; j++) {
      if (
        GameState.history[GameState.history.length - 1].board[i][j] !==
        GameState.board[i][j]
      ) {
        moved = true;
      }
    }
  }

  if (moved) {
    addNewTile();
    checkGameStatus();
    updateDisplay();
  } else {
    GameState.history.pop();
  }
}

/**
 * Move tiles right
 */
function moveRight() {
  saveHistory();
  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    GameState.board[i].reverse();
    GameState.board[i] = slideLeft(GameState.board[i]);
    GameState.board[i] = mergeLeft(GameState.board[i]);
    GameState.board[i] = slideLeft(GameState.board[i]);
    GameState.board[i].reverse();
  }

  let moved = false;
  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    for (let j = 0; j < CONFIG.GRID_SIZE; j++) {
      if (
        GameState.history[GameState.history.length - 1].board[i][j] !==
        GameState.board[i][j]
      ) {
        moved = true;
      }
    }
  }

  if (moved) {
    addNewTile();
    checkGameStatus();
    updateDisplay();
  } else {
    GameState.history.pop();
  }
}

/**
 * Move tiles up
 */
function moveUp() {
  saveHistory();
  let moved = false;

  // Transpose
  const transposed = transpose(GameState.board);
  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    transposed[i] = slideLeft(transposed[i]);
    transposed[i] = mergeLeft(transposed[i]);
    transposed[i] = slideLeft(transposed[i]);
  }
  GameState.board = transpose(transposed);

  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    for (let j = 0; j < CONFIG.GRID_SIZE; j++) {
      if (
        GameState.history[GameState.history.length - 1].board[i][j] !==
        GameState.board[i][j]
      ) {
        moved = true;
      }
    }
  }

  if (moved) {
    addNewTile();
    checkGameStatus();
    updateDisplay();
  } else {
    GameState.history.pop();
  }
}

/**
 * Move tiles down
 */
function moveDown() {
  saveHistory();
  let moved = false;

  // Transpose and reverse
  let transposed = transpose(GameState.board);
  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    transposed[i].reverse();
    transposed[i] = slideLeft(transposed[i]);
    transposed[i] = mergeLeft(transposed[i]);
    transposed[i] = slideLeft(transposed[i]);
    transposed[i].reverse();
  }
  GameState.board = transpose(transposed);

  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    for (let j = 0; j < CONFIG.GRID_SIZE; j++) {
      if (
        GameState.history[GameState.history.length - 1].board[i][j] !==
        GameState.board[i][j]
      ) {
        moved = true;
      }
    }
  }

  if (moved) {
    addNewTile();
    checkGameStatus();
    updateDisplay();
  } else {
    GameState.history.pop();
  }
}

/**
 * Slide row left (remove zeros)
 */
function slideLeft(row) {
  return row
    .filter((val) => val !== 0)
    .concat(Array(CONFIG.GRID_SIZE).fill(0))
    .slice(0, CONFIG.GRID_SIZE);
}

/**
 * Merge row left (combine adjacent tiles with same value)
 */
function mergeLeft(row) {
  for (let i = 0; i < CONFIG.GRID_SIZE - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      GameState.score += row[i];
      row.splice(i + 1, 1);
      row.push(0);
    }
  }
  return row;
}

/**
 * Transpose matrix (flip rows and columns)
 */
function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

/**
 * Check game status (win, lose, or continue)
 */
function checkGameStatus() {
  // Check for 2048
  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    for (let j = 0; j < CONFIG.GRID_SIZE; j++) {
      if (GameState.board[i][j] === CONFIG.TARGET_SCORE && !GameState.won) {
        GameState.won = true;
        showWinModal();
        return;
      }
    }
  }

  // Check for possible moves
  let hasEmptyCell = false;
  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    for (let j = 0; j < CONFIG.GRID_SIZE; j++) {
      if (GameState.board[i][j] === 0) {
        hasEmptyCell = true;
        return;
      }
    }
  }

  // Check if any merge is possible
  for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
    for (let j = 0; j < CONFIG.GRID_SIZE; j++) {
      const current = GameState.board[i][j];
      if (i < CONFIG.GRID_SIZE - 1 && GameState.board[i + 1][j] === current)
        return;
      if (j < CONFIG.GRID_SIZE - 1 && GameState.board[i][j + 1] === current)
        return;
    }
  }

  // Game over
  GameState.gameOver = true;
  if (GameState.score > GameState.bestScore) {
    GameState.bestScore = GameState.score;
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, GameState.bestScore);
  }
  showGameOverModal();
}
