const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Set canvas to fullscreen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Game state
let gameMode = null;
let gameRunning = false;
let gamePaused = false;
let p1Score = 0;
let p2Score = 0;

// Paddle dimensions
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 6;

// Ball
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  speedX: 5,
  speedY: 5,
  maxSpeed: 8,
};

// Paddles
let p1 = {
  x: 20,
  y: canvas.height / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  speed: 0,
};

let p2 = {
  x: canvas.width - 20 - PADDLE_WIDTH,
  y: canvas.height / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  speed: 0,
};

// Keys pressed
const keys = {};

// Event listeners
window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  if (e.key === " ") {
    e.preventDefault();
    if (gameRunning) {
      togglePause();
    }
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    backToMenu();
  }
});

function startGame(mode) {
  gameMode = mode;
  gameRunning = false;
  gamePaused = false;
  p1Score = 0;
  p2Score = 0;

  if (mode === "ai") {
    document.getElementById("p2Name").textContent = "AI";
  } else {
    document.getElementById("p2Name").textContent = "PLAYER 2";
  }

  document.getElementById("overlay").classList.add("hidden");
  resetBall();
  gameLoop();
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
  ball.speedY = (Math.random() - 0.5) * 5;

  p1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
  p2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;

  gameRunning = false;
  document.getElementById("gameStatus").textContent = "Press SPACE to serve";
}

function togglePause() {
  gamePaused = !gamePaused;
  document.getElementById("gameStatus").textContent = gamePaused
    ? "PAUSED - Press SPACE"
    : "Playing";
}

function backToMenu() {
  gameRunning = false;
  gamePaused = false;
  document.getElementById("overlay").classList.remove("hidden");
}

function update() {
  if (!gameRunning) {
    if (keys[" "]) {
      gameRunning = true;
      document.getElementById("gameStatus").textContent = "Playing";
    }
    return;
  }

  if (gamePaused) return;

  // Player 1 controls (W and S)
  if (keys["w"]) {
    p1.y = Math.max(0, p1.y - PADDLE_SPEED);
  }
  if (keys["s"]) {
    p1.y = Math.min(canvas.height - PADDLE_HEIGHT, p1.y + PADDLE_SPEED);
  }

  // Player 2 controls
  if (gameMode === "2player") {
    // Player 2 uses Arrow Keys
    if (keys["arrowup"]) {
      p2.y = Math.max(0, p2.y - PADDLE_SPEED);
    }
    if (keys["arrowdown"]) {
      p2.y = Math.min(canvas.height - PADDLE_HEIGHT, p2.y + PADDLE_SPEED);
    }
  } else {
    // AI controls
    const paddleCenter = p2.y + PADDLE_HEIGHT / 2;
    const ballCenter = ball.y;

    if (ballCenter < paddleCenter - 35) {
      p2.y = Math.max(0, p2.y - PADDLE_SPEED * 0.9);
    } else if (ballCenter > paddleCenter + 35) {
      p2.y = Math.min(canvas.height - PADDLE_HEIGHT, p2.y + PADDLE_SPEED * 0.9);
    }
  }

  // Ball movement
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Ball collision with top/bottom
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.speedY = -ball.speedY;
    ball.y =
      ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
  }

  // Ball collision with paddles
  if (
    ball.x - ball.radius < p1.x + p1.width &&
    ball.y > p1.y &&
    ball.y < p1.y + p1.height
  ) {
    if (ball.speedX < 0) {
      ball.speedX = -ball.speedX;
      ball.x = p1.x + p1.width + ball.radius;

      const hitPos =
        (ball.y - (p1.y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
      ball.speedY = hitPos * ball.maxSpeed;

      if (Math.abs(ball.speedX) < ball.maxSpeed) {
        ball.speedX *= 1.05;
      }
    }
  }

  if (
    ball.x + ball.radius > p2.x &&
    ball.y > p2.y &&
    ball.y < p2.y + p2.height
  ) {
    if (ball.speedX > 0) {
      ball.speedX = -ball.speedX;
      ball.x = p2.x - ball.radius;

      const hitPos =
        (ball.y - (p2.y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
      ball.speedY = hitPos * ball.maxSpeed;

      if (Math.abs(ball.speedX) < ball.maxSpeed) {
        ball.speedX *= 1.05;
      }
    }
  }

  // Score points
  if (ball.x - ball.radius < 0) {
    p2Score++;
    updateUI();
    resetBall();
  }

  if (ball.x + ball.radius > canvas.width) {
    p1Score++;
    updateUI();
    resetBall();
  }
}

function draw() {
  // Clear canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw center line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
  ctx.fillRect(p2.x, p2.y, p2.width, p2.height);

  // Draw paddles glow
  ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
  ctx.shadowBlur = 15;
  ctx.fillStyle = "#fff";
  ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
  ctx.fillRect(p2.x, p2.y, p2.width, p2.height);
  ctx.shadowColor = "transparent";

  // Draw ball
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw ball glow
  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
}

function updateUI() {
  document.getElementById("p1Score").textContent = p1Score;
  document.getElementById("p2Score").textContent = p2Score;
}

function gameLoop() {
  update();
  draw();

  if (gameMode) {
    requestAnimationFrame(gameLoop);
  }
}

updateUI();
