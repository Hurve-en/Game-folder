const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let resizeTimer;
function setupCanvas() {
  const container = document.querySelector(".game-container");
  const topSection = document.querySelector(".top-section");
  const bottomSection = document.querySelector(".bottom-section");

  const availableHeight =
    container.clientHeight -
    topSection.offsetHeight -
    bottomSection.offsetHeight -
    60;
  canvas.width = container.clientWidth - 40;
  canvas.height = availableHeight;

  GRID_SIZE = 20;
  TILE_SIZE = Math.floor(Math.min(canvas.width, canvas.height) / GRID_SIZE);

  if (!gameActive) draw();
}

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(setupCanvas, 100);
});

setupCanvas();

// Game Constants
const GRID_SIZE = 20;
let TILE_SIZE = 0;

// Game State
let gameActive = false;
let gamePaused = false;
let score = 0;
let level = 1;
let bestScore = localStorage.getItem("enhancedSnakeBest") || 0;
let gameSpeed = 120;

// Snake
let snake = [{ x: 10, y: 10 }];
let direction = "RIGHT";
let nextDirection = "RIGHT";

// Food
let food = { x: 15, y: 15, type: "normal" };
let powerUps = [];

// Event Listeners
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("resetBtn").addEventListener("click", resetGame);

// Keyboard
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (["arrowup", "w"].includes(key) && direction !== "DOWN") {
    nextDirection = "UP";
    e.preventDefault();
  }
  if (["arrowdown", "s"].includes(key) && direction !== "UP") {
    nextDirection = "DOWN";
    e.preventDefault();
  }
  if (["arrowleft", "a"].includes(key) && direction !== "RIGHT") {
    nextDirection = "LEFT";
    e.preventDefault();
  }
  if (["arrowright", "d"].includes(key) && direction !== "LEFT") {
    nextDirection = "RIGHT";
    e.preventDefault();
  }
});

// Mobile buttons
document.getElementById("upBtn").addEventListener("click", () => {
  if (direction !== "DOWN") nextDirection = "UP";
});
document.getElementById("downBtn").addEventListener("click", () => {
  if (direction !== "UP") nextDirection = "DOWN";
});
document.getElementById("leftBtn").addEventListener("click", () => {
  if (direction !== "RIGHT") nextDirection = "LEFT";
});
document.getElementById("rightBtn").addEventListener("click", () => {
  if (direction !== "LEFT") nextDirection = "RIGHT";
});

document.getElementById("best").textContent = bestScore;

function startGame() {
  gameActive = true;
  gamePaused = false;
  score = 0;
  level = 1;
  gameSpeed = 120;
  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  nextDirection = "RIGHT";
  powerUps = [];
  spawnFood();

  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  document.getElementById("startBtn").disabled = true;
  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("gameOverModal").classList.add("hidden");

  gameLoop();
}

function togglePause() {
  if (!gameActive) return;
  gamePaused = !gamePaused;
  document.getElementById("pauseBtn").textContent = gamePaused
    ? "RESUME"
    : "PAUSE";
  if (!gamePaused) gameLoop();
}

function resetGame() {
  gameActive = false;
  gamePaused = false;
  score = 0;
  level = 1;
  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  nextDirection = "RIGHT";
  powerUps = [];

  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
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
      type: Math.random() > 0.8 ? "power" : "normal",
    };
    valid = !snake.some((s) => s.x === newFood.x && s.y === newFood.y);
  }
  food = newFood;
}

function update() {
  direction = nextDirection;
  const head = { ...snake[0] };

  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;
  if (direction === "LEFT") head.x--;
  if (direction === "RIGHT") head.x++;

  // Wrap around
  if (head.x < 0) head.x = GRID_SIZE - 1;
  if (head.x >= GRID_SIZE) head.x = 0;
  if (head.y < 0) head.y = GRID_SIZE - 1;
  if (head.y >= GRID_SIZE) head.y = 0;

  // Self collision
  if (snake.some((s) => s.x === head.x && s.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Food collision
  if (head.x === food.x && head.y === food.y) {
    const points = food.type === "power" ? 10 : 5;
    score += points;
    document.getElementById("score").textContent = score;

    if (score % 50 === 0) {
      level++;
      gameSpeed = Math.max(60, 120 - level * 8);
      document.getElementById("level").textContent = level;
    }

    // Chance to spawn power-up
    if (Math.random() > 0.7 && powerUps.length < 3) {
      spawnPowerUp();
    }

    spawnFood();
  } else {
    snake.pop();
  }

  // Power-up collision
  for (let i = powerUps.length - 1; i >= 0; i--) {
    if (head.x === powerUps[i].x && head.y === powerUps[i].y) {
      score += 25;
      document.getElementById("score").textContent = score;
      powerUps.splice(i, 1);
    }
  }

  // Remove expired power-ups
  powerUps = powerUps.filter((p) => Date.now() - p.spawnTime < 8000);
}

function spawnPowerUp() {
  let newPowerUp;
  let valid = false;
  while (!valid) {
    newPowerUp = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      spawnTime: Date.now(),
    };
    valid =
      !snake.some((s) => s.x === newPowerUp.x && s.y === newPowerUp.y) &&
      !(newPowerUp.x === food.x && newPowerUp.y === food.y);
  }
  powerUps.push(newPowerUp);
}

function draw() {
  // Clear
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "#e8eef5";
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i++) {
    const pos = i * TILE_SIZE;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(canvas.width, pos);
    ctx.stroke();
  }

  // Draw food
  const fx = food.x * TILE_SIZE;
  const fy = food.y * TILE_SIZE;
  ctx.fillStyle = food.type === "power" ? "#f39c12" : "#e74c3c";
  ctx.fillRect(fx + 2, fy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  ctx.strokeStyle = food.type === "power" ? "#d68910" : "#c0392b";
  ctx.lineWidth = 2;
  ctx.strokeRect(fx + 2, fy + 2, TILE_SIZE - 4, TILE_SIZE - 4);

  // Draw power-ups
  powerUps.forEach((p) => {
    const px = p.x * TILE_SIZE;
    const py = p.y * TILE_SIZE;
    ctx.fillStyle = "#3498db";
    ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
    ctx.strokeStyle = "#2980b9";
    ctx.lineWidth = 2;
    ctx.strokeRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
  });

  // Draw snake
  snake.forEach((seg, i) => {
    const sx = seg.x * TILE_SIZE;
    const sy = seg.y * TILE_SIZE;
    ctx.fillStyle = i === 0 ? "#27ae60" : "#2ecc71";
    ctx.fillRect(sx + 2, sy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    ctx.strokeStyle = i === 0 ? "#1e8449" : "#229954";
    ctx.lineWidth = 2;
    ctx.strokeRect(sx + 2, sy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  });

  // Pause overlay
  if (gamePaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  if (!gameActive || gamePaused) return;

  update();
  draw();

  setTimeout(gameLoop, gameSpeed);
}

function gameOver() {
  gameActive = false;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("enhancedSnakeBest", bestScore);
    document.getElementById("best").textContent = bestScore;
  }

  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalLevel").textContent = level;
  document.getElementById("finalBest").textContent = bestScore;
  document.getElementById("gameOverModal").classList.remove("hidden");
}

draw();
