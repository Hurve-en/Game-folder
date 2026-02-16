// Sudoku puzzles - pre-made valid puzzles
const PUZZLES = [
  [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  [
    [3, 0, 0, 0, 0, 0, 0, 1, 2],
    [0, 0, 0, 3, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 3, 0, 0, 0],
    [2, 1, 0, 0, 0, 0, 0, 3, 4],
  ],
  [
    [4, 0, 0, 0, 0, 0, 0, 0, 9],
    [0, 5, 0, 0, 0, 0, 0, 6, 0],
    [0, 0, 6, 0, 0, 0, 7, 0, 0],
    [0, 0, 0, 7, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 8, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 9, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 2, 0, 0],
    [0, 2, 0, 0, 0, 0, 0, 3, 0],
    [3, 0, 0, 0, 0, 0, 0, 0, 1],
  ],
  [
    [1, 0, 3, 0, 0, 6, 0, 8, 0],
    [0, 5, 0, 0, 8, 0, 0, 0, 0],
    [0, 0, 9, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 7, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 8, 5, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 2, 0],
    [0, 3, 0, 2, 0, 0, 6, 0, 1],
  ],
  [
    [0, 0, 0, 7, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 4, 3, 0, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 8, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 3],
    [0, 0, 0, 0, 0, 5, 0, 0, 0],
  ],
];

// Game state
let currentPuzzle = [];
let board = [];
let solution = [];
let selectedCell = null;
let startTime = null;
let timerInterval = null;
let mistakes = 0;

function initGame() {
  // Load random puzzle
  const puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
  currentPuzzle = puzzle.map((row) => [...row]);
  board = puzzle.map((row) => [...row]);

  // Solve the puzzle to have the solution
  solution = puzzle.map((row) => [...row]);
  solveSudoku(solution);

  selectedCell = null;
  mistakes = 0;
  startTime = Date.now();

  clearInterval(timerInterval);
  startTimer();

  document.getElementById("mistakes").textContent = mistakes;
  document.getElementById("winModal").classList.add("hidden");

  renderBoard();
}

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(board, row, col, num) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

function renderBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;

      const value = board[row][col];
      if (value !== 0) {
        cell.textContent = value;
      }

      // Mark given cells
      if (currentPuzzle[row][col] !== 0) {
        cell.classList.add("given");
      } else {
        cell.style.cursor = "pointer";
      }

      // Highlight selected
      if (
        selectedCell &&
        selectedCell.row === row &&
        selectedCell.col === col
      ) {
        cell.classList.add("selected");
      }

      // Highlight related cells
      if (
        selectedCell &&
        (selectedCell.row === row ||
          selectedCell.col === col ||
          (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
            Math.floor(selectedCell.col / 3) === Math.floor(col / 3)))
      ) {
        if (!(selectedCell.row === row && selectedCell.col === col)) {
          cell.classList.add("related");
        }
      }

      cell.addEventListener("click", () => selectCell(row, col));
      boardEl.appendChild(cell);
    }
  }

  updateStats();
}

function selectCell(row, col) {
  if (currentPuzzle[row][col] !== 0) return;
  selectedCell = { row, col };
  renderBoard();
}

function inputNumber(num) {
  if (!selectedCell || currentPuzzle[selectedCell.row][selectedCell.col] !== 0)
    return;

  board[selectedCell.row][selectedCell.col] = num;

  // Check if valid
  if (!isValid(board, selectedCell.row, selectedCell.col, num)) {
    mistakes++;
    document.getElementById("mistakes").textContent = mistakes;
  }

  checkCompletion();
  renderBoard();
}

function deleteNumber() {
  if (!selectedCell || currentPuzzle[selectedCell.row][selectedCell.col] !== 0)
    return;
  board[selectedCell.row][selectedCell.col] = 0;
  renderBoard();
}

function updateStats() {
  let filled = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== 0) filled++;
    }
  }
  document.getElementById("solved").textContent = filled + "/81";
}

function checkCompletion() {
  // Check if all cells filled
  let filled = true;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        filled = false;
        break;
      }
    }
    if (!filled) break;
  }

  if (!filled) return;

  // Check if valid
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      board[row][col] = 0;
      if (!isValid(board, row, col, num)) {
        board[row][col] = num;
        return;
      }
      board[row][col] = num;
    }
  }

  // Puzzle complete!
  showWin();
}

function showWin() {
  clearInterval(timerInterval);
  const time = document.getElementById("timer").textContent;
  const msg = `Great job! Time: ${time} | Mistakes: ${mistakes}`;
  document.getElementById("winStats").textContent = msg;
  document.getElementById("winModal").classList.remove("hidden");
}

function resetPuzzle() {
  board = currentPuzzle.map((row) => [...row]);
  selectedCell = null;
  mistakes = 0;
  startTime = Date.now();
  clearInterval(timerInterval);
  startTimer();
  document.getElementById("mistakes").textContent = mistakes;
  renderBoard();
}

function newGame() {
  initGame();
}

function giveHint() {
  if (!selectedCell) {
    alert("Select a cell first!");
    return;
  }

  const { row, col } = selectedCell;
  if (currentPuzzle[row][col] !== 0) {
    alert("This cell is given!");
    return;
  }

  board[row][col] = solution[row][col];
  renderBoard();
}

function startTimer() {
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    document.getElementById("timer").textContent =
      `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, 1000);
}

// Start game on load
initGame();
