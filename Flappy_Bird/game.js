const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let gameRunning = false;
let gamePaused = false;
let score = 0;
let bestScore = localStorage.getItem("blockGameBest") || 0;

// Keys pressed
const keys = {
  left: false,
  right: false,
  up: false,
};

// Player
const player = {
  x: 250,
  y: 300,
  width: 30,
  height: 30,
  velocityY: 0,
  velocityX: 0,
  speed: 5,
  jumpPower: 15,
  gravity: 0.6,
  isJumping: false,
};

// Platforms
let platforms = [];
const platformWidth = 80;
const platformHeight = 20;

// Colors (Minecraft style)
const colors = {
  sky: "#87CEEB",
  ground: "#90EE90",
  grass: "#4CAF50",
  wood: "#8B4513",
  stone: "#A9A9A9",
  player: "#FF6B6B",
  playerOutline: "#CC5555",
};

// Initialize
document.getElementById("best").textContent = bestScore;

// Event listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
    keys.right = true;
  if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
    e.preventDefault();
    keys.up = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
    keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
    keys.right = false;
  if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = false;
});

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("resetBtn").addEventListener("click", resetGame);

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  gamePaused = false;
  score = 0;
  platforms = [];
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - 150;
  player.velocityY = 0;
  player.velocityX = 0;
  player.isJumping = false;

  document.getElementById("score").textContent = score;
  document.getElementById("startBtn").disabled = true;
  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("gameOver").classList.add("hidden");

  createInitialPlatforms();
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
  platforms = [];
  player.y = canvas.height - 150;
  player.velocityY = 0;
  player.velocityX = 0;
  player.isJumping = false;

  document.getElementById("score").textContent = score;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;
  document.getElementById("pauseBtn").textContent = "PAUSE";
  document.getElementById("gameOver").classList.add("hidden");

  draw();
}

function createInitialPlatforms() {
  platforms = [];
  for (let i = 0; i < 8; i++) {
    const platformX = Math.random() * (canvas.width - platformWidth);
    const platformY = canvas.height - 100 - i * 60;
    platforms.push({
      x: platformX,
      y: platformY,
      width: platformWidth,
      height: platformHeight,
      color: i % 2 === 0 ? colors.grass : colors.stone,
    });
  }
}

function update() {
  // Player movement
  player.velocityX = 0;

  if (keys.left && player.x > 0) {
    player.velocityX = -player.speed;
  }
  if (keys.right && player.x < canvas.width - player.width) {
    player.velocityX = player.speed;
  }

  player.x += player.velocityX;

  // Wrap around screen
  if (player.x < 0) player.x = canvas.width;
  if (player.x > canvas.width) player.x = 0;

  // Gravity
  if (!player.isJumping || player.velocityY > 0) {
    player.velocityY += player.gravity;
  }

  player.y += player.velocityY;

  // Jump
  if (keys.up && !player.isJumping) {
    player.velocityY = -player.jumpPower;
    player.isJumping = true;
  }

  // Platform collision
  let onPlatform = false;
  platforms.forEach((platform) => {
    // Check if player is above platform and falling
    if (
      player.velocityY >= 0 &&
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + 15 &&
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width
    ) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.isJumping = false;
      onPlatform = true;
    }
  });

  // Create new platforms when player is high enough
  if (player.y < canvas.height / 2) {
    const minPlatformY = Math.min(...platforms.map((p) => p.y));

    while (minPlatformY > 0) {
      const newPlatformX = Math.random() * (canvas.width - platformWidth);
      const newPlatformY = Math.min(...platforms.map((p) => p.y)) - 60;

      platforms.push({
        x: newPlatformX,
        y: newPlatformY,
        width: platformWidth,
        height: platformHeight,
        color: Math.random() > 0.5 ? colors.grass : colors.stone,
      });

      score++;
      document.getElementById("score").textContent = score;
      break;
    }
  }

  // Remove platforms below screen
  platforms = platforms.filter((p) => p.y < canvas.height + 50);

  // Game over
  if (player.y > canvas.height) {
    endGame();
  }
}

function draw() {
  // Background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#87CEEB");
  gradient.addColorStop(1, "#E0F6FF");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw platforms
  platforms.forEach((platform) => {
    // Platform block
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Border
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

    // Highlight effect
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      platform.x + 2,
      platform.y + 2,
      platform.width - 4,
      platform.height - 4,
    );
  });

  // Draw player (red block with face)
  ctx.fillStyle = colors.player;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Player outline
  ctx.strokeStyle = colors.playerOutline;
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x, player.y, player.width, player.height);

  // Player eyes
  ctx.fillStyle = "#000";
  const eyeSize = 4;
  ctx.fillRect(player.x + 8, player.y + 8, eyeSize, eyeSize);
  ctx.fillRect(player.x + 18, player.y + 8, eyeSize, eyeSize);

  // Player mouth
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(player.x + 10, player.y + 20);
  ctx.lineTo(player.x + 20, player.y + 20);
  ctx.stroke();

  // Pause overlay
  if (gamePaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFF";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  if (gameRunning && !gamePaused) {
    update();
  }

  draw();

  if (gameRunning && !gamePaused) {
    requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  gameRunning = false;
  gamePaused = false;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;

  // Update best score
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("blockGameBest", bestScore);
    document.getElementById("best").textContent = bestScore;
  }

  // Show game over
  document.getElementById("gameOverScore").textContent = score;
  document.getElementById("gameOverBest").textContent = bestScore;
  document.getElementById("gameOver").classList.remove("hidden");
}

// Initial draw
draw();
