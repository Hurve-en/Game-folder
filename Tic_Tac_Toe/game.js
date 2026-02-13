// Game State
let gameMode = null;
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let scores = { x: 0, o: 0 };

const winningConditions = [
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
  if (saved) scores = JSON.parse(saved);
  updateScores();
}
loadScores();

// Screen management
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

function showScreen(screen) {
  menuScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  screen.classList.add("active");
}

// Menu buttons
document
  .getElementById("aiBtn")
  .addEventListener("click", () => startGame("ai"));
document
  .getElementById("playerBtn")
  .addEventListener("click", () => startGame("2p"));

// Game controls
document.getElementById("newGameBtn").addEventListener("click", newGame);
document.getElementById("backBtn").addEventListener("click", backToMenu);
document.getElementById("playAgainBtn").addEventListener("click", newGame);
document.getElementById("menuBtn").addEventListener("click", backToMenu);

// Cell clicks
const cells = document.querySelectorAll(".cell");
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (!gameActive || board[index] !== "") return;

    playerMove(index);

    if (!gameActive) return;

    if (gameMode === "ai") {
      setTimeout(() => {
        const aiMove = findBestMove();
        aiPlayMove(aiMove);
      }, 600);
    }
  });
});

function startGame(mode) {
  gameMode = mode;
  document.getElementById("p2Label").textContent =
    mode === "ai" ? "COMPUTER" : "PLAYER 2";
  showScreen(gameScreen);
  newGame();
}

function newGame() {
  currentPlayer = "X";
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.className = "cell";
  });

  updateStatus();
}

function playerMove(index) {
  makeMove(index, "X");

  if (gameActive) {
    currentPlayer = "O";
    updateStatus();
  }
}

function aiPlayMove(index) {
  makeMove(index, "O");

  if (gameActive) {
    currentPlayer = "X";
    updateStatus();
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = cells[index];
  cell.textContent = player;
  cell.classList.add("taken", player === "X" ? "x-mark" : "o-mark");

  playSound(300, 80);

  if (checkWinner(player)) {
    endGame(player);
    return;
  }

  if (board.every((c) => c !== "")) {
    endGame("draw");
  }
}

function checkWinner(player) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      highlightWinner(condition);
      return true;
    }
  }
  return false;
}

function highlightWinner(condition) {
  condition.forEach((i) => {
    cells[i].classList.add("winner");
  });
}

function findBestMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      const score = minimax(board, 0, false);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove !== null ? bestMove : board.findIndex((c) => c === "");
}

function minimax(tempBoard, depth, isMaximizing) {
  // Check terminal states
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (tempBoard[a] === "O" && tempBoard[b] === "O" && tempBoard[c] === "O")
      return 10 - depth;
    if (tempBoard[a] === "X" && tempBoard[b] === "X" && tempBoard[c] === "X")
      return depth - 10;
  }

  if (tempBoard.every((c) => c !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (tempBoard[i] === "") {
        tempBoard[i] = "O";
        best = Math.max(best, minimax(tempBoard, depth + 1, false));
        tempBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (tempBoard[i] === "") {
        tempBoard[i] = "X";
        best = Math.min(best, minimax(tempBoard, depth + 1, true));
        tempBoard[i] = "";
      }
    }
    return best;
  }
}

function endGame(result) {
  gameActive = false;

  if (result === "X") {
    scores.x++;
    showResult("You Win!", "Well played!", "✓");
    playWinSound();
  } else if (result === "O") {
    scores.o++;
    showResult("Computer Wins!", "Try again!", "✗");
    playLoseSound();
  } else {
    showResult("Draw!", "Well matched!", "-");
    playDrawSound();
  }

  localStorage.setItem("tictactoeScores", JSON.stringify(scores));
  updateScores();
}

function showResult(title, subtitle, icon) {
  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultSubtitle").textContent = subtitle;
  document.getElementById("resultIcon").textContent = icon;
  document.getElementById("finalP1").textContent = scores.x;
  document.getElementById("finalP2").textContent = scores.o;
  showScreen(resultScreen);
}

function updateStatus() {
  const status = document.getElementById("statusText");
  if (currentPlayer === "X") {
    status.textContent = "Your Turn";
  } else {
    status.textContent =
      gameMode === "ai" ? "Computer Thinking..." : "Player 2 Turn";
  }
}

function updateScores() {
  document.getElementById("p1Score").textContent = scores.x;
  document.getElementById("p2Score").textContent = scores.o;
}

function backToMenu() {
  gameActive = false;
  showScreen(menuScreen);
}

// Sound effects
function playSound(freq, duration) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration / 1000,
    );
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) {}
}

function playWinSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [400, 500, 600];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const start = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
      osc.start(start);
      osc.stop(start + 0.15);
    });
  } catch (e) {}
}

function playLoseSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);
    osc.type = "sine";
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

function playDrawSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 350;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
}
