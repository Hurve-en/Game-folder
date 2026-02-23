// Game state
let gameMode = null; // '2player' or 'ai'
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let scores = { X: 0, O: 0 };

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Load scores
function loadScores() {
  const saved = localStorage.getItem("tictactoeScores");
  if (saved) {
    scores = JSON.parse(saved);
  }
  updateScores();
}
loadScores();

// Screen management
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const resultModal = document.getElementById("resultModal");

function selectMode(mode) {
  gameMode = mode;
  menuScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  if (mode === "2player") {
    document.getElementById("p2Title").textContent = "Player 2";
  } else {
    document.getElementById("p2Title").textContent = "Computer";
  }

  newGame();
}

function backToMenu() {
  gameActive = false;
  gameScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
  resultModal.classList.add("hidden");
}

function closeModal() {
  resultModal.classList.add("hidden");
}

// Cell click handler
document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

function handleCellClick(e) {
  if (!gameActive) return;

  const index = parseInt(e.target.dataset.index);

  // Check if cell is already taken
  if (board[index] !== "") return;

  // Make the move with current player
  makeMove(index, currentPlayer);

  if (!gameActive) return;

  // Switch player for next turn
  if (gameMode === "2player") {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
  } else {
    // AI mode
    setTimeout(() => {
      const aiMove = getBestMove();
      makeMove(aiMove, "O");
    }, 600);
  }
}

function makeMove(index, player) {
  // Place mark
  board[index] = player;
  const cell = document.querySelector(`[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add("taken");

  // Check for winner
  if (checkWinner(player)) {
    scores[player]++;
    localStorage.setItem("tictactoeScores", JSON.stringify(scores));
    updateScores();
    showResult(player);
    return;
  }

  // Check for draw
  if (board.every((cell) => cell !== "")) {
    showResult("draw");
    return;
  }
}

function checkWinner(player) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] === player && board[b] === player && board[c] === player) {
      highlightWinning(pattern);
      return true;
    }
  }
  return false;
}

function highlightWinning(pattern) {
  pattern.forEach((index) => {
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.classList.add("winner");
  });
}

function getBestMove() {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      if (checkWinnerQuick("O")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // Block player win
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      if (checkWinnerQuick("X")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // Take center
  if (board[4] === "") return 4;

  // Take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((i) => board[i] === "");
  if (availableCorners.length > 0) {
    return availableCorners[
      Math.floor(Math.random() * availableCorners.length)
    ];
  }

  // Take any available
  const available = board
    .map((cell, i) => (cell === "" ? i : null))
    .filter((i) => i !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function checkWinnerQuick(player) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
}

function updateStatus() {
  const statusText = document.getElementById("statusText");

  if (gameMode === "2player") {
    statusText.textContent =
      currentPlayer === "X" ? "Player 1's Turn" : "Player 2's Turn";
  } else {
    statusText.textContent =
      currentPlayer === "X" ? "Your Turn" : "AI Thinking...";
  }
}

function updateScores() {
  document.getElementById("p1Wins").textContent = scores.X;
  document.getElementById("p2Wins").textContent = scores.O;
}

function showResult(winner) {
  gameActive = false;
  const title = document.getElementById("resultTitle");
  const message = document.getElementById("resultMessage");
  const icon = document.getElementById("resultIcon");

  if (winner === "X") {
    if (gameMode === "2player") {
      title.textContent = "Player 1 Wins!";
    } else {
      title.textContent = "You Win!";
      icon.textContent = "✓";
    }
    message.textContent = "Well played!";
  } else if (winner === "O") {
    if (gameMode === "2player") {
      title.textContent = "Player 2 Wins!";
    } else {
      title.textContent = "AI Wins!";
      icon.textContent = "✗";
    }
    message.textContent = "Better luck next time!";
  } else {
    title.textContent = "It's a Draw!";
    icon.textContent = "−";
    message.textContent = "Well matched!";
  }

  resultModal.classList.remove("hidden");
}

function newGame() {
  currentPlayer = "X";
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;

  resultModal.classList.add("hidden");
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.className = "cell";
  });

  updateStatus();
  updateScores();
}

// Initialize
loadScores();
