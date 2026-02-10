const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size to window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Game constants
const GRID_SIZE = 20;
let TILE_SIZE = canvas.width / GRID_SIZE;

// Game variables
let gameRunning = false;
let gamePaused = false;
let score = 0;
let level = 1;
let bestScore = localStorage.getItem("snakeBest") || 0;
let gameSpeed = 100;

// Snake
let snake = [{ x: 10, y: 10 }];
let nextDirection = "RIGHT";
let currentDirection = "RIGHT";

// Food
let food = {
  x: 15,
  y: 15,
};

// Initialize
document.getElementById("best").textContent = bestScore;
document.getElementById("score").textContent = score;
document.getElementById("level").textContent = level;

// Event listeners
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("resetBtn").addEventListener("click", resetGame);

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(e) {
  const key = e.key.toLowerCase();

  if (["arrowup", "w"].includes(key)) {
    if (currentDirection !== "DOWN") nextDirection = "UP";
    e.preventDefault();
  }
  if (["arrowdown", "s"].includes(key)) {
    if (currentDirection !== "UP") nextDirection = "DOWN";
    e.preventDefault();
  }
  if (["arrowleft", "a"].includes(key)) {
    if (currentDirection !== "RIGHT") nextDirection = "LEFT";
    e.preventDefault();
  }
  if (["arrowright", "d"].includes(key)) {
    if (currentDirection !== "LEFT") nextDirection = "RIGHT";
    e.preventDefault();
  }
}

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  gamePaused = false;
  score = 0;
  level = 1;
  gameSpeed = 100;
  snake = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
  nextDirection = "RIGHT";
  currentDirection = "RIGHT";
  spawnFood();

  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
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

  if (!gamePaused) {
    gameLoop();
  }
}

function resetGame() {
  gameRunning = false;
  gamePaused = false;
  score = 0;
  level = 1;
  snake = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
  nextDirection = "RIGHT";
  currentDirection = "RIGHT";

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
  let validPosition = false;

  while (!validPosition) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    validPosition = !snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y,
    );
  }

  food = newFood;
}

function update() {
  currentDirection = nextDirection;

  const head = { ...snake[0] };

  switch (currentDirection) {
    case "UP":
      head.y--;
      break;
    case "DOWN":
      head.y++;
      break;
    case "LEFT":
      head.x--;
      break;
    case "RIGHT":
      head.x++;
      break;
  }

  // Wall collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    gameOver();
    return;
  }

  // Self collision
  if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById("score").textContent = score;

    if (score % 50 === 0) {
      level++;
      gameSpeed = Math.max(50, 100 - level * 5);
      document.getElementById("level").textContent = level;
    }

    spawnFood();
  } else {
    snake.pop();
  }
}

function draw() {
  // Update tile size based on canvas size
  TILE_SIZE = canvas.width / GRID_SIZE;

  // Clear canvas
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0a0a0a");
  gradient.addColorStop(1, "#1a1a2a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
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
  ctx.fillStyle = "#FF6B6B";
  ctx.fillRect(
    food.x * TILE_SIZE + 2,
    food.y * TILE_SIZE + 2,
    TILE_SIZE - 4,
    TILE_SIZE - 4,
  );
  ctx.shadowColor = "#FF6B6B";
  ctx.shadowBlur = 10;
  ctx.strokeStyle = "#CC5555";
  ctx.lineWidth = 2;
  ctx.strokeRect(
    food.x * TILE_SIZE + 2,
    food.y * TILE_SIZE + 2,
    TILE_SIZE - 4,
    TILE_SIZE - 4,
  );
  ctx.shadowColor = "transparent";

  // Draw snake
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.fillStyle = "#4CAF50";
      ctx.shadowColor = "#4CAF50";
      ctx.shadowBlur = 15;
    } else {
      ctx.fillStyle = "#66BB6A";
      ctx.shadowColor = "transparent";
    }

    ctx.fillRect(
      segment.x * TILE_SIZE + 2,
      segment.y * TILE_SIZE + 2,
      TILE_SIZE - 4,
      TILE_SIZE - 4,
    );

    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      segment.x * TILE_SIZE + 2,
      segment.y * TILE_SIZE + 2,
      TILE_SIZE - 4,
      TILE_SIZE - 4,
    );
  });

  ctx.shadowColor = "transparent";

  // Pause overlay
  if (gamePaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 80px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.textShadow = "4px 4px 0px #000";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  if (!gameRunning || gamePaused) {
    draw();
    return;
  }

  update();
  draw();

  setTimeout(gameLoop, gameSpeed);
}

function gameOver() {
  gameRunning = false;
  gamePaused = false;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;
  document.getElementById("pauseBtn").textContent = "PAUSE";

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("snakeBest", bestScore);
    document.getElementById("best").textContent = bestScore;
  }

  document.getElementById("finalScore").textContent = score;
  document.getElementById("bestScore").textContent = bestScore;
  document.getElementById("finalLevel").textContent = level;
  document.getElementById("gameOverModal").classList.remove("hidden");
}

// Initial draw
draw();
