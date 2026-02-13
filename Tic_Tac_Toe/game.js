// Animated background canvas
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];
let time = 0;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.life = 1;
    this.size = Math.random() * 2 + 1;
    this.color = ["#ff006e", "#00d9ff", "#ffd700"][
      Math.floor(Math.random() * 3)
    ];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.01;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life * 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function animateBackground() {
  ctx.fillStyle = "#0a0e27";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "rgba(0, 217, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 50) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Update and draw particles
  if (particles.length < 50) {
    particles.push(new Particle());
  }

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animateBackground);
}
animateBackground();

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
  const saved = localStorage.getItem("neonClashScores");
  if (saved) scores = JSON.parse(saved);
  updateScoreDisplay();
}
loadScores();

// DOM Elements
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const winScreen = document.getElementById("winScreen");
const gameBoard = document.getElementById("gameBoard");
const statusText = document.getElementById("statusText");
const cells = document.querySelectorAll(".cell");

// Menu buttons
document
  .getElementById("aiMode")
  .addEventListener("click", () => startGame("ai"));
document
  .getElementById("playerMode")
  .addEventListener("click", () => startGame("2p"));

// Game buttons
document.getElementById("newGameBtn").addEventListener("click", newGame);
document.getElementById("menuBtn").addEventListener("click", backToMenu);
document.getElementById("playAgainBtn").addEventListener("click", newGame);
document.getElementById("backBtn").addEventListener("click", backToMenu);

// Cell clicks
cells.forEach((cell) => {
  cell.addEventListener("click", (e) => {
    if (!gameActive) return;
    const index = parseInt(e.target.getAttribute("data-index"));
    if (board[index] !== "") return;

    makeMove(index, "X");

    if (!gameActive) return;

    if (gameMode === "ai") {
      setTimeout(() => {
        const aiMove = getBestMove();
        makeMove(aiMove, "O");
      }, 500);
    }
  });
});

function startGame(mode) {
  gameMode = mode;
  menuScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  winScreen.classList.add("hidden");

  document.getElementById("p2Name").textContent =
    mode === "ai" ? "BOT" : "PLAYER 2";
  newGame();
}

function newGame() {
  currentPlayer = "X";
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  winScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.className = "cell";
  });

  updateStatus();
}

function makeMove(index, player) {
  board[index] = player;
  const cell = cells[index];
  cell.textContent = player;
  cell.classList.add("taken", `cell-${player.toLowerCase()}`);

  playSound(200, 100);

  if (checkWinner(player)) {
    endGame(player);
    return;
  }

  if (board.every((c) => c !== "")) {
    endGame("draw");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function checkWinner(player) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      highlightWinning(condition);
      return true;
    }
  }
  return false;
}

function highlightWinning(condition) {
  condition.forEach((i) => {
    cells[i].classList.add("win");
  });
}

function getBestMove() {
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

  return bestMove;
}

function minimax(tempBoard, depth, isMaximizing) {
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

function endGame(winner) {
  gameActive = false;

  if (winner === "X") {
    scores.x++;
    showWinner("YOU WIN!", "🎯", "PERFECT PLAY");
    playSound(600, 200);
  } else if (winner === "O") {
    scores.o++;
    showWinner("BOT WINS!", "🤖", "TRY AGAIN");
    playSound(300, 200);
  } else {
    showWinner("DRAW!", "⚔️", "WELL PLAYED");
    playSound(400, 150);
  }

  localStorage.setItem("neonClashScores", JSON.stringify(scores));
  updateScoreDisplay();
}

function showWinner(title, emoji, subtitle) {
  document.getElementById("winTitle").textContent = title;
  document.getElementById("winAnimation").textContent = emoji;
  document.getElementById("winSubtitle").textContent = subtitle;
  gameScreen.classList.add("hidden");
  winScreen.classList.remove("hidden");
}

function updateStatus() {
  statusText.textContent =
    currentPlayer === "X"
      ? "YOUR TURN"
      : gameMode === "ai"
        ? "BOT THINKING..."
        : "PLAYER 2 TURN";
}

function updateScoreDisplay() {
  document.getElementById("p1Score").textContent = scores.x;
  document.getElementById("p2Score").textContent = scores.o;
}

function backToMenu() {
  gameScreen.classList.add("hidden");
  winScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
  gameActive = false;
}

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
