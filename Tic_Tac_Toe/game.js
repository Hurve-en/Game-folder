// Game State
let gameMode = null; // 'ai' or '2player'
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let playerStats = { wins: 0, losses: 0, draws: 0 };
let opponent = "AI"; // AI or Player 2

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

// Load stats
function loadStats() {
  const saved = localStorage.getItem("tictactoeStats");
  if (saved) {
    playerStats = JSON.parse(saved);
    updateStatsDisplay();
  }
}
loadStats();

// Event Listeners
document
  .getElementById("vsAiBtn")
  .addEventListener("click", () => startMode("ai"));
document
  .getElementById("vsPcBtn")
  .addEventListener("click", () => startMode("2player"));
document.getElementById("newGameBtn").addEventListener("click", newGame);
document.getElementById("backBtn").addEventListener("click", backToMenu);

document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", (e) => handleCellClick(e.target));
});

function startMode(mode) {
  gameMode = mode;
  opponent = mode === "ai" ? "AI" : "Player 2";
  document.getElementById("opponentIcon").textContent =
    mode === "ai" ? "🤖" : "👥";
  document.getElementById("modeSelector").style.display = "none";
  document.getElementById("statsContainer").style.display = "flex";
  document.getElementById("gameBoard").style.display = "grid";
  document.getElementById("statusDisplay").style.display = "block";
  document.getElementById("controls").style.display = "flex";
  newGame();
}

function backToMenu() {
  document.getElementById("modeSelector").style.display = "flex";
  document.getElementById("statsContainer").style.display = "none";
  document.getElementById("gameBoard").style.display = "none";
  document.getElementById("statusDisplay").style.display = "none";
  document.getElementById("controls").style.display = "none";
  gameMode = null;
}

function handleCellClick(cell) {
  if (!gameActive || gameMode === null) return;

  const index = parseInt(cell.getAttribute("data-index"));

  // Check if cell is taken
  if (board[index] !== "") return;

  // Player move
  makeMove(index, "X");

  if (!gameActive) return;

  // AI or Player 2 move
  if (gameMode === "ai") {
    setTimeout(() => {
      const aiMove = getBestMove();
      makeMove(aiMove, "O");
    }, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelector(`[data-index="${index}"]`);
  cell.textContent = player === "X" ? "❌" : "⭕";
  cell.classList.add("taken", "active");

  // Play sound
  playMoveSound();

  // Check for winner
  if (checkWinner(player)) {
    endGame(player);
    return;
  }

  // Check for draw
  if (board.every((c) => c !== "")) {
    endGame("draw");
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function checkWinner(player) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      highlightWinningCells(condition);
      return true;
    }
  }
  return false;
}

function highlightWinningCells(condition) {
  condition.forEach((index) => {
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.classList.add("win");
  });
}

function getBestMove() {
  // Minimax algorithm with depth limit
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false, 6);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove || board.findIndex((c) => c === "");
}

function minimax(tempBoard, depth, isMaximizing, maxDepth) {
  if (depth >= maxDepth) {
    return evaluateBoard(tempBoard);
  }

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
    let bestScore = -Infinity;
    for (let i = 0; i < tempBoard.length; i++) {
      if (tempBoard[i] === "") {
        tempBoard[i] = "O";
        let score = minimax(tempBoard, depth + 1, false, maxDepth);
        tempBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < tempBoard.length; i++) {
      if (tempBoard[i] === "") {
        tempBoard[i] = "X";
        let score = minimax(tempBoard, depth + 1, true, maxDepth);
        tempBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function evaluateBoard(tempBoard) {
  let score = 0;
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    const cells = [tempBoard[a], tempBoard[b], tempBoard[c]];

    if (cells.filter((c) => c === "O").length === 2) score += 5;
    if (cells.filter((c) => c === "X").length === 2) score -= 5;
    if (cells.filter((c) => c === "O").length === 1) score += 1;
    if (cells.filter((c) => c === "X").length === 1) score -= 1;
  }
  return score;
}

function endGame(winner) {
  gameActive = false;

  if (winner === "X") {
    playerStats.wins++;
    showWinner("You Win!", "🎉", "Excellent play!");
    playWinSound();
  } else if (winner === "O") {
    playerStats.losses++;
    showWinner(`${opponent} Wins!`, "😢", "Better luck next time!");
    playLoseSound();
  } else {
    playerStats.draws++;
    showWinner("Draw!", "🤝", "Well played!");
    playDrawSound();
  }

  localStorage.setItem("tictactoeStats", JSON.stringify(playerStats));
  updateStatsDisplay();
}

function updateStatus() {
  const statusText = document.getElementById("statusText");
  if (currentPlayer === "X") {
    statusText.textContent = "Your Turn";
  } else {
    statusText.textContent = `${opponent} Turn`;
  }
}

function updateStatsDisplay() {
  document.getElementById("playerStats").textContent =
    `You: ${playerStats.wins}`;
  document.getElementById("opponentStats").textContent =
    `${opponent}: ${playerStats.losses}`;
  document.getElementById("drawStats").textContent =
    `Draw: ${playerStats.draws}`;
}

function showWinner(title, emoji, message) {
  document.getElementById("winnerTitle").textContent = title;
  document.getElementById("winnerAnimation").textContent = emoji;
  document.getElementById("winnerMessage").textContent = message;
  document.getElementById("winnerModal").classList.remove("hidden");
}

function newGame() {
  currentPlayer = "X";
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  document.getElementById("winnerModal").classList.add("hidden");

  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.className = "cell";
  });

  updateStatus();
}

// Sound Effects
function playMoveSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 600;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}

function playWinSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const start = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.2);
      osc.start(start);
      osc.stop(start + 0.2);
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
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.4);
    osc.type = "sine";
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

function playDrawSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 500;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}
