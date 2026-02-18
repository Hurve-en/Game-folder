const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size responsively
function resizeCanvas() {
  const wrapper = document.querySelector(".game-wrapper");
  canvas.width = Math.min(800, wrapper.clientWidth - 20);
  canvas.height = (canvas.width / 800) * 500;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Game variables
let gameRunning = false;
let gamePaused = false;
let score = 0;
let level = 1;
let lives = 3;
let bestScore = localStorage.getItem("spaceShooterBest") || 0;

// Player
const player = {
  x: 0,
  y: 0,
  width: 30,
  height: 40,
  speed: 5,
  color: "#00d4ff",
};

// Bullets
let bullets = [];
const bulletSpeed = 8;
const bulletWidth = 4;
const bulletHeight = 12;

// Enemies
let enemies = [];
let enemyBaseSpeed = 1.5;
let enemySpawnRate = 60;
let spawnCounter = 0;

// Key states
const keys = {};

// Initialize
document.getElementById("best").textContent = bestScore;

// Event listeners
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("resetBtn").addEventListener("click", resetGame);

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === " " && gameRunning && !gamePaused) {
    e.preventDefault();
    shoot();
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
  spawnCounter = 0;
  enemyBaseSpeed = 1.5;

  // Set player position
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - 70;

  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  document.getElementById("lives").textContent = lives;
  document.getElementById("enemyCount").textContent = enemies.length;
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
  level = 1;
  lives = 3;
  bullets = [];
  enemies = [];
  spawnCounter = 0;

  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  document.getElementById("lives").textContent = lives;
  document.getElementById("enemyCount").textContent = 0;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;
  document.getElementById("pauseBtn").textContent = "PAUSE";
  document.getElementById("gameOverModal").classList.add("hidden");

  draw();
}

function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - bulletWidth / 2,
    y: player.y - bulletHeight,
    width: bulletWidth,
    height: bulletHeight,
    speed: bulletSpeed,
  });
}

function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 25),
    y: -25,
    width: 25,
    height: 25,
    speed: enemyBaseSpeed + level * 0.3,
    health: 1,
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

  // Spawn enemies periodically
  spawnCounter++;
  if (spawnCounter >= enemySpawnRate) {
    spawnEnemy();
    spawnCounter = 0;
  }

  // Move bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;

    // Remove bullets off screen
    if (bullets[i].y + bullets[i].height < 0) {
      bullets.splice(i, 1);
    }
  }

  // Move enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += enemies[i].speed;

    // Check collision with player
    if (isColliding(player, enemies[i])) {
      lives--;
      document.getElementById("lives").textContent = lives;
      enemies.splice(i, 1);

      if (lives <= 0) {
        endGame();
        return;
      }
      continue;
    }

    // Remove enemies off screen
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

  // Check if all enemies defeated (level up)
  if (enemies.length === 0 && spawnCounter > 30) {
    level++;
    document.getElementById("level").textContent = level;
    enemyBaseSpeed += 0.3;
    enemySpawnRate = Math.max(30, 60 - level * 5);
  }

  document.getElementById("enemyCount").textContent = enemies.length;
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
  // Clear canvas with gradient effect
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars background
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  for (let i = 0; i < 20; i++) {
    const x = (i * 40 + Math.sin(i) * 20) % canvas.width;
    const y = (i * 25) % canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }

  // Draw player ship
  ctx.fillStyle = player.color;

  // Ship body (triangle)
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.closePath();
  ctx.fill();

  // Ship glow
  ctx.strokeStyle = "rgba(0, 212, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.closePath();
  ctx.stroke();

  // Draw bullets
  ctx.fillStyle = "#00ff00";
  for (let bullet of bullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    // Bullet glow
    ctx.shadowColor = "#00ff00";
    ctx.shadowBlur = 8;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
  ctx.shadowColor = "transparent";

  // Draw enemies
  for (let enemy of enemies) {
    // Enemy body
    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Enemy eyes
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(enemy.x + 4, enemy.y + 4, 6, 6);
    ctx.fillRect(enemy.x + 15, enemy.y + 4, 6, 6);

    // Enemy glow
    ctx.strokeStyle = "rgba(255, 107, 107, 0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(enemy.x - 1, enemy.y - 1, enemy.width + 2, enemy.height + 2);
  }

  // Draw pause overlay
  if (gamePaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00d4ff";
    ctx.font = "bold 32px Arial";
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
