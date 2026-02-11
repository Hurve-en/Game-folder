const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Fixed grid size
const GRID_SIZE = 20;
let TILE_SIZE = 0;

// Game state
let gameRunning = false;
let gamePaused = false;
let score = 0;
let bestScore = localStorage.getItem("snakeBest") || 0;
let gameSpeed = 100;

// Snake and food
let snake = [{ x: 10, y: 10 }];
let nextDirection = "RIGHT";
let currentDirection = "RIGHT";
let food = { x: 15, y: 15 };

// Initialize
document.getElementById("best").textContent = bestScore;

// Resize canvas to fill container
function setupCanvas() {
  const wrapper = document.querySelector(".game-wrapper");
  const topBar = document.querySelector(".top-bar");
  const controls = document.querySelector(".controls");
  const mobileControls = document.querySelector(".mobile-controls");
  const instructions = document.querySelector(".instructions");

  // Calculate available height
  let availableHeight =
    wrapper.clientHeight -
    topBar.offsetHeight -
    controls.offsetHeight -
    instructions.offsetHeight;

  if (mobileControls.style.display !== "none") {
    availableHeight -= mobileControls.offsetHeight;
  }

  // Set canvas size
  canvas.width = wrapper.clientWidth;
  canvas.height = availableHeight;

  // Calculate tile size
  TILE_SIZE = Math.floor(Math.min(canvas.width, canvas.height) / GRID_SIZE);

  draw();
}

window.addEventListener("resize", setupCanvas);
setupCanvas();

// Event listeners
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("resetBtn").addEventListener("click", resetGame);

// Keyboard controls
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (["arrowup", "w"].includes(key) && currentDirection !== "DOWN") {
    nextDirection = "UP";
    e.preventDefault();
  }
  if (["arrowdown", "s"].includes(key) && currentDirection !== "UP") {
    nextDirection = "DOWN";
    e.preventDefault();
  }
  if (["arrowleft", "a"].includes(key) && currentDirection !== "RIGHT") {
    nextDirection = "LEFT";
    e.preventDefault();
  }
  if (["arrowright", "d"].includes(key) && currentDirection !== "LEFT") {
    nextDirection = "RIGHT";
    e.preventDefault();
  }
});

// Mobile button controls
document.getElementById("upBtn").addEventListener("click", () => {
  if (currentDirection !== "DOWN") nextDirection = "UP";
});
document.getElementById("downBtn").addEventListener("click", () => {
  if (currentDirection !== "UP") nextDirection = "DOWN";
});
document.getElementById("leftBtn").addEventListener("click", () => {
  if (currentDirection !== "RIGHT") nextDirection = "LEFT";
});
document.getElementById("rightBtn").addEventListener("click", () => {
  if (currentDirection !== "LEFT") nextDirection = "RIGHT";
});

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  gamePaused = false;
  score = 0;
  gameSpeed = 100;
  snake = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
  nextDirection = "RIGHT";
  currentDirection = "RIGHT";
  spawnFood();

  document.getElementById("score").textContent = score;
  document.getElementById("startBtn").disabled = true;
  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("gameOverModal").classList.add("hidden");

  gameLoop();
}

function togglePause() {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  document.getElementById("pauseBtn").textContent = gamePaused
    ? "RESUME"
    : "PAUSE";
  if (!gamePaused) gameLoop();
}

function resetGame() {
  gameRunning = false;
  gamePaused = false;
  score = 0;
  snake = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
  nextDirection = "RIGHT";
  currentDirection = "RIGHT";

  document.getElementById("score").textContent = score;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;
  document.getElementById("pauseBtn").textContent = "PAUSE";
  document.getElementById("gameOverModal").classList.add("hidden");

  draw();
}

function spawnFood() {
  let newFood;
  let valid = false;
  while (!valid) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    valid = !snake.some((s) => s.x === newFood.x && s.y === newFood.y);
  }
  food = newFood;
}

function update() {
  currentDirection = nextDirection;
  const head = { ...snake[0] };

  if (currentDirection === "UP") head.y--;
  if (currentDirection === "DOWN") head.y++;
  if (currentDirection === "LEFT") head.x--;
  if (currentDirection === "RIGHT") head.x++;

  // Check collisions
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    gameOver();
    return;
  }
  if (snake.some((s) => s.x === head.x && s.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById("score").textContent = score;
    if (score % 50 === 0) gameSpeed = Math.max(50, 100 - (score / 50) * 5);
    spawnFood();
  } else {
    snake.pop();
  }
}

function draw() {
  // Clear canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Center the grid
  const gridWidth = GRID_SIZE * TILE_SIZE;
  const gridHeight = GRID_SIZE * TILE_SIZE;
  const offsetX = (canvas.width - gridWidth) / 2;
  const offsetY = (canvas.height - gridHeight) / 2;

  // Draw grid background
  ctx.fillStyle = "rgba(50, 50, 80, 0.3)";
  ctx.fillRect(offsetX, offsetY, gridWidth, gridHeight);

  // Draw grid lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i++) {
    const pos = i * TILE_SIZE;
    ctx.beginPath();
    ctx.moveTo(offsetX + pos, offsetY);
    ctx.lineTo(offsetX + pos, offsetY + gridHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY + pos);
    ctx.lineTo(offsetX + gridWidth, offsetY + pos);
    ctx.stroke();
  }

  // Draw food
  const fx = offsetX + food.x * TILE_SIZE;
  const fy = offsetY + food.y * TILE_SIZE;
  ctx.fillStyle = "#FF6B6B";
  ctx.fillRect(fx + 2, fy + 2, TILE_SIZE - 4, TILE_SIZE - 4);

  // Draw snake
  snake.forEach((seg, i) => {
    const sx = offsetX + seg.x * TILE_SIZE;
    const sy = offsetY + seg.y * TILE_SIZE;
    ctx.fillStyle = i === 0 ? "#4CAF50" : "#66BB6A";
    ctx.fillRect(sx + 2, sy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 2, sy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  });

  // Pause overlay
  if (gamePaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  if (!gameRunning || gamePaused) return;
  update();
  draw();
  setTimeout(gameLoop, gameSpeed);
}

function gameOver() {
  gameRunning = false;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("snakeBest", bestScore);
    document.getElementById("best").textContent = bestScore;
  }

  document.getElementById("finalScore").textContent = score;
  document.getElementById("bestScore").textContent = bestScore;
  document.getElementById("gameOverModal").classList.remove("hidden");
}

draw();
