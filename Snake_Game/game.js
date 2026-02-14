// Game constants and variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
let TILE_WIDTH = canvas.width / GRID_WIDTH;
let TILE_HEIGHT = canvas.height / GRID_HEIGHT;

let gameRunning = false;
let gamePaused = false;
let score = 0;
let level = 1;
let bestScore = localStorage.getItem("enhancedSnakeBest") || 0;
let gameSpeed = 120;

// Snake
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };

// Food
let food = { x: 15, y: 15, value: 5 };
let powerUps = [];

// Initialize UI
document.getElementById("best").textContent = bestScore;

// Button events
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("resetBtn").addEventListener("click", resetGame);

// Keyboard controls
document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  const key = e.key.toLowerCase();

  if (["arrowup", "w"].includes(key)) {
    if (direction.y === 0) {
      nextDirection = { x: 0, y: -1 };
      e.preventDefault();
    }
  }
  if (["arrowdown", "s"].includes(key)) {
    if (direction.y === 0) {
      nextDirection = { x: 0, y: 1 };
      e.preventDefault();
    }
  }
  if (["arrowleft", "a"].includes(key)) {
    if (direction.x === 0) {
      nextDirection = { x: -1, y: 0 };
      e.preventDefault();
    }
  }
  if (["arrowright", "d"].includes(key)) {
    if (direction.x === 0) {
      nextDirection = { x: 1, y: 0 };
      e.preventDefault();
    }
  }
}

function startGame() {
  gameRunning = true;
  gamePaused = false;
  score = 0;
  level = 1;
  gameSpeed = 120;
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  powerUps = [];

  spawnFood();

  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  document.getElementById("startBtn").disabled = true;
  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("gameOverModal").classList.add("hidden");

  update();
}

function togglePause() {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  document.getElementById("pauseBtn").textContent = gamePaused
    ? "RESUME"
    : "PAUSE";
  if (!gamePaused) update();
}

function resetGame() {
  gameRunning = false;
  gamePaused = false;
  score = 0;
  level = 1;
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
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
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT),
      value: Math.random() > 0.8 ? 10 : 5,
    };
    valid = !snake.some((s) => s.x === newFood.x && s.y === newFood.y);
  }
  food = newFood;
}

function spawnPowerUp() {
  if (powerUps.length >= 2) return;

  let newPowerUp;
  let valid = false;

  while (!valid) {
    newPowerUp = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT),
      spawnTime: Date.now(),
    };
    valid =
      !snake.some((s) => s.x === newPowerUp.x && s.y === newPowerUp.y) &&
      !(newPowerUp.x === food.x && newPowerUp.y === food.y);
  }
  powerUps.push(newPowerUp);
}

function update() {
  if (!gameRunning || gamePaused) {
    draw();
    return;
  }

  direction = { ...nextDirection };

  // Move snake head
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  // Wrap around
  head.x = (head.x + GRID_WIDTH) % GRID_WIDTH;
  head.y = (head.y + GRID_HEIGHT) % GRID_HEIGHT;

  // Check self collision
  if (snake.some((s) => s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    score += food.value;
    document.getElementById("score").textContent = score;

    if (score % 50 === 0) {
      level++;
      gameSpeed = Math.max(60, 120 - level * 8);
      document.getElementById("level").textContent = level;
    }

    if (Math.random() > 0.7) {
      spawnPowerUp();
    }

    spawnFood();
  } else {
    snake.pop();
  }

  // Check power-up collision
  for (let i = powerUps.length - 1; i >= 0; i--) {
    if (head.x === powerUps[i].x && head.y === powerUps[i].y) {
      score += 25;
      document.getElementById("score").textContent = score;
      powerUps.splice(i, 1);
    }
  }

  // Remove expired power-ups
  powerUps = powerUps.filter((p) => Date.now() - p.spawnTime < 8000);

  draw();
  setTimeout(update, gameSpeed);
}

function draw() {
  // Clear canvas
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "#e8eef5";
  ctx.lineWidth = 1;

  for (let i = 0; i <= GRID_WIDTH; i++) {
    const x = i * TILE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let i = 0; i <= GRID_HEIGHT; i++) {
    const y = i * TILE_HEIGHT;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw food
  const fx = food.x * TILE_WIDTH;
  const fy = food.y * TILE_HEIGHT;
  ctx.fillStyle = food.value === 10 ? "#f39c12" : "#e74c3c";
  ctx.fillRect(fx + 2, fy + 2, TILE_WIDTH - 4, TILE_HEIGHT - 4);

  // Draw power-ups
  powerUps.forEach((p) => {
    const px = p.x * TILE_WIDTH;
    const py = p.y * TILE_HEIGHT;
    ctx.fillStyle = "#3498db";
    ctx.fillRect(px + 3, py + 3, TILE_WIDTH - 6, TILE_HEIGHT - 6);
  });

  // Draw snake
  snake.forEach((segment, index) => {
    const sx = segment.x * TILE_WIDTH;
    const sy = segment.y * TILE_HEIGHT;

    if (index === 0) {
      ctx.fillStyle = "#27ae60";
    } else {
      ctx.fillStyle = "#2ecc71";
    }

    ctx.fillRect(sx + 2, sy + 2, TILE_WIDTH - 4, TILE_HEIGHT - 4);

    ctx.strokeStyle = index === 0 ? "#1e8449" : "#229954";
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 2, sy + 2, TILE_WIDTH - 4, TILE_HEIGHT - 4);
  });

  // Pause overlay
  if (gamePaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  }
}

function endGame() {
  gameRunning = false;
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

// Initial draw
draw();
