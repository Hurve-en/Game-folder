// Game state
let board = [];
let score = 0;
let bestScore = localStorage.getItem("best2048") || 0;
let gameOver = false;
let won = false;
let history = [];

const GRID_SIZE = 4;

// Initialize game
document.getElementById("best").textContent = bestScore;
document.getElementById("newGameBtn").addEventListener("click", startNewGame);
document.getElementById("undoBtn").addEventListener("click", undo);

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(e) {
  if (!gameOver && !won) {
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

function initBoard() {
  board = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0));
  addNewTile();
  addNewTile();
  score = 0;
  gameOver = false;
  won = false;
  history = [];
  updateDisplay();
}

function addNewTile() {
  const emptyCells = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 0) {
        emptyCells.push({ x: i, y: j });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
  }
}

function saveHistory() {
  history.push({
    board: board.map((row) => [...row]),
    score: score,
  });
  if (history.length > 10) history.shift();
}

function undo() {
  if (history.length > 0) {
    const previous = history.pop();
    board = previous.board.map((row) => [...row]);
    score = previous.score;
    gameOver = false;
    won = false;
    updateDisplay();
  }
}

function moveLeft() {
  saveHistory();
  let moved = false;

  for (let i = 0; i < GRID_SIZE; i++) {
    board[i] = slideLeft(board[i]);
    board[i] = mergeLeft(board[i]);
    board[i] = slideLeft(board[i]);
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (history[history.length - 1].board[i][j] !== board[i][j]) {
        moved = true;
      }
    }
  }

  if (moved) {
    addNewTile();
    checkGameStatus();
    updateDisplay();
  } else {
    history.pop();
  }
}

function moveRight() {
  saveHistory();
  for (let i = 0; i < GRID_SIZE; i++) {
    board[i].reverse();
    board[i] = slideLeft(board[i]);
    board[i] = mergeLeft(board[i]);
    board[i] = slideLeft(board[i]);
    board[i].reverse();
  }

  let moved = false;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (history[history.length - 1].board[i][j] !== board[i][j]) {
        moved = true;
      }
    }
  }

  if (moved) {
    addNewTile();
    checkGameStatus();
    updateDisplay();
  } else {
    history.pop();
  }
}

function moveUp() {
  saveHistory();
  let moved = false;

  // Transpose
  const transposed = transpose(board);
  for (let i = 0; i < GRID_SIZE; i++) {
    transposed[i] = slideLeft(transposed[i]);
    transposed[i] = mergeLeft(transposed[i]);
    transposed[i] = slideLeft(transposed[i]);
  }
  board = transpose(transposed);

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (history[history.length - 1].board[i][j] !== board[i][j]) {
        moved = true;
      }
    }
  }

  if (moved) {
    addNewTile();
    checkGameStatus();
    updateDisplay();
  } else {
    history.pop();
  }
}

function moveDown() {
  saveHistory();
  let moved = false;

  // Transpose and reverse
  let transposed = transpose(board);
  for (let i = 0; i < GRID_SIZE; i++) {
    transposed[i].reverse();
    transposed[i] = slideLeft(transposed[i]);
    transposed[i] = mergeLeft(transposed[i]);
    transposed[i] = slideLeft(transposed[i]);
    transposed[i].reverse();
  }
  board = transpose(transposed);

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (history[history.length - 1].board[i][j] !== board[i][j]) {
        moved = true;
      }
    }
  }

  if (moved) {
    addNewTile();
    checkGameStatus();
    updateDisplay();
  } else {
    history.pop();
  }
}

function slideLeft(row) {
  return row
    .filter((val) => val !== 0)
    .concat(Array(GRID_SIZE).fill(0))
    .slice(0, GRID_SIZE);
}

function mergeLeft(row) {
  for (let i = 0; i < GRID_SIZE - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row.splice(i + 1, 1);
      row.push(0);
    }
  }
  return row;
}

function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

function checkGameStatus() {
  // Check for 2048
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 2048 && !won) {
        won = true;
        showWinModal();
        return;
      }
    }
  }

  // Check for possible moves
  let hasEmptyCell = false;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 0) {
        hasEmptyCell = true;
        return;
      }
    }
  }

  // Check if any merge is possible
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const current = board[i][j];
      if (i < GRID_SIZE - 1 && board[i + 1][j] === current) return;
      if (j < GRID_SIZE - 1 && board[i][j + 1] === current) return;
    }
  }

  // Game over
  gameOver = true;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("best2048", bestScore);
  }
  showGameOverModal();
}

function updateDisplay() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const value = board[i][j];
      const tile = document.createElement("div");
      tile.className = `tile`;
      if (value !== 0) {
        tile.textContent = value;
        tile.classList.add(`tile-${value}`);
      }
      gameBoard.appendChild(tile);
    }
  }

  document.getElementById("score").textContent = score;
  document.getElementById("best").textContent = bestScore;
}

function showGameOverModal() {
  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalBest").textContent = bestScore;
  document.getElementById("gameOverModal").classList.remove("hidden");
}

function showWinModal() {
  document.getElementById("winScore").textContent = score;
  document.getElementById("winModal").classList.remove("hidden");
}

function closeWinModal() {
  document.getElementById("winModal").classList.add("hidden");
}

function closeModal() {
  document.getElementById("gameOverModal").classList.add("hidden");
  document.getElementById("winModal").classList.add("hidden");
}

function startNewGame() {
  closeModal();
  initBoard();
}

// Start game
initBoard();
