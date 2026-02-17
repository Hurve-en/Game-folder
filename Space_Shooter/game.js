const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let gameRunning = false;
let gamePaused = false;
let score = 0;
let level = 1;
let lives = 3;
let bestScore = localStorage.getItem("spaceShooterBest") || 0;

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 30,
  height: 40,
  speed: 5,
  color: "#00d4ff",
};

// Bullets
let bullets = [];
const bulletSpeed = 7;
const bulletWidth = 5;
const bulletHeight = 15;

// Enemies
let enemies = [];
const enemySpeed = 2;
const enemyWidth = 25;
const enemyHeight = 25;

// Key states
const keys = {};

// Initialize UI
document.getElementById("best").textContent = bestScore;

// Event listeners
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("resetBtn").addEventListener("click", resetGame);

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === " ") {
    e.preventDefault();
    if (gameRunning && !gamePaused) shoot();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function startGame() {
  gameRunning = true;
  gamePaused = false;
  score = 0;
  level = 1;
  lives = 3;
  bullets = [];
  enemies = [];

  player.x = canvas.width / 2;

  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  document.getElementById("lives").textContent = lives;
  document.getElementById("startBtn").disabled = true;
  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("gameOverModal").classList.add("hidden");

  spawnEnemies();
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
  level = 1;
  lives = 3;
  bullets = [];
  enemies = [];

  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  document.getElementById("lives").textContent = lives;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;
  document.getElementById("pauseBtn").textContent = "PAUSE";
  document.getElementById("gameOverModal").classList.add("hidden");

  draw();
}

function spawnEnemies() {
  enemies = [];
  const enemyCount = 3 + level;

  for (let i = 0; i < enemyCount; i++) {
    enemies.push({
      x: Math.random() * (canvas.width - enemyWidth),
      y: Math.random() * (canvas.height / 2) - 50,
      width: enemyWidth,
      height: enemyHeight,
      speed: enemySpeed + level * 0.5,
      color: "#ff6b6b",
    });
  }
}

function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - bulletWidth / 2,
    y: player.y,
    width: bulletWidth,
    height: bulletHeight,
    speed: bulletSpeed,
  });
}

function update() {
  if (!gameRunning || gamePaused) return;

  // Move player
  if (keys["arrowleft"] || keys["a"]) {
    player.x -= player.speed;
  }
  if (keys["arrowright"] || keys["d"]) {
    player.x += player.speed;
  }

  // Keep player in bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;

  // Move bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;

    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }

  // Move enemies
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += enemies[i].speed;

    // Enemy hit player
    if (isColliding(player, enemies[i])) {
      lives--;
      document.getElementById("lives").textContent = lives;
      enemies.splice(i, 1);

      if (lives <= 0) {
        endGame();
        return;
      }
    }

    // Enemy off screen
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
    }
  }

  // Check bullet-enemy collisions
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (isColliding(bullets[i], enemies[j])) {
        score += 10;
        document.getElementById("score").textContent = score;
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        break;
      }
    }
  }

  // Level up when all enemies destroyed
  if (enemies.length === 0) {
    level++;
    document.getElementById("level").textContent = level;
    spawnEnemies();
  }
}

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function draw() {
  // Clear canvas
  ctx.fillStyle = "rgba(10, 10, 20, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "rgba(0, 212, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw player glow
  ctx.strokeStyle = "rgba(0, 212, 255, 0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(
    player.x - 2,
    player.y - 2,
    player.width + 4,
    player.height + 4,
  );

  // Draw bullets
  ctx.fillStyle = "#00ff00";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    // Bullet glow
    ctx.shadowColor = "#00ff00";
    ctx.shadowBlur = 10;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    ctx.shadowColor = "transparent";
  });

  // Draw enemies
  ctx.fillStyle = "#ff6b6b";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Enemy eyes
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(enemy.x + 5, enemy.y + 5, 5, 5);
    ctx.fillRect(enemy.x + 15, enemy.y + 5, 5, 5);

    // Enemy color back
    ctx.fillStyle = "#ff6b6b";

    // Enemy glow
    ctx.strokeStyle = "rgba(255, 107, 107, 0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(enemy.x - 1, enemy.y - 1, enemy.width + 2, enemy.height + 2);
  });

  // Draw pause overlay
  if (gamePaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00d4ff";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();

  if (gameRunning && !gamePaused) {
    requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  gameRunning = false;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("spaceShooterBest", bestScore);
    document.getElementById("best").textContent = bestScore;
  }

  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalLevel").textContent = level;
  document.getElementById("finalBest").textContent = bestScore;
  document.getElementById("gameOverModal").classList.remove("hidden");

  draw();
}

// Initial draw
draw();
