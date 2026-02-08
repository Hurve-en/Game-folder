// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let gameRunning = false;
let gamePaused = false;
let score = 0;
let bestScore = localStorage.getItem("flappyBirdBest") || 0;

// Bird object
const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 40,
  height: 30,
  velocityY: 0,
  gravity: 0.5,
  flapPower: -12,
  maxVelocity: 8,
  color: "#00d9ff",
};

// Pipe variables
let pipes = [];
const pipeWidth = 60;
const pipeGap = 140;
const pipeDistance = 200;
let pipeCounter = 0;

// Colors
const colors = {
  bg: "#0a0e27",
  pipe: "#175aeb",
  bird: "#00d9ff",
  accent: "#4ade80",
};

// DOM elements
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreDisplay = document.getElementById("finalScore");
const bestMessageDisplay = document.getElementById("bestMessage");

// Initialize best score
bestScoreDisplay.textContent = bestScore;

// Event listeners
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", togglePause);
resetBtn.addEventListener("click", resetGame);
document.addEventListener("keydown", handleKeyPress);
canvas.addEventListener("click", handleCanvasClick);

function startGame() {
  gameRunning = true;
  gamePaused = false;
  score = 0;
  pipes = [];
  pipeCounter = 0;
  bird.y = canvas.height / 2;
  bird.velocityY = 0;

  scoreDisplay.textContent = score;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  gameOverScreen.classList.remove("show");

  gameLoop();
}

function togglePause() {
  if (gameRunning) {
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? "RESUME" : "PAUSE";

    if (!gamePaused) {
      gameLoop();
    }
  }
}

function resetGame() {
  gameRunning = false;
  gamePaused = false;
  score = 0;
  pipes = [];
  bird.y = canvas.height / 2;
  bird.velocityY = 0;

  scoreDisplay.textContent = score;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = "PAUSE";
  gameOverScreen.classList.remove("show");

  drawGame();
}

function handleKeyPress(e) {
  if (e.code === "Space" || e.key === " ") {
    e.preventDefault();
    if (gameRunning && !gamePaused) {
      flap();
    }
  }
}

function handleCanvasClick() {
  if (gameRunning && !gamePaused) {
    flap();
  }
}

function flap() {
  bird.velocityY = bird.flapPower;
}

function updateGame() {
  // Update bird physics
  bird.velocityY += bird.gravity;
  bird.velocityY = Math.min(bird.velocityY, bird.maxVelocity);
  bird.y += bird.velocityY;

  // Create pipes
  if (pipeCounter % 100 === 0) {
    const gapStart = Math.random() * (canvas.height - pipeGap - 80) + 40;
    pipes.push({
      x: canvas.width,
      gapStart: gapStart,
      gapEnd: gapStart + pipeGap,
      scored: false,
    });
  }
  pipeCounter++;

  // Update pipes
  pipes.forEach((pipe) => {
    pipe.x -= 4;

    // Check scoring
    if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
      pipe.scored = true;
      score++;
      scoreDisplay.textContent = score;
      playScoreSound();
    }
  });

  // Remove off-screen pipes
  pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);

  // Collision detection
  if (checkCollision()) {
    endGame();
  }

  // Ground/ceiling collision
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    endGame();
  }
}

function checkCollision() {
  for (let pipe of pipes) {
    // Check if bird overlaps with pipe horizontally
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
      // Check vertical collision
      if (bird.y < pipe.gapStart || bird.y + bird.height > pipe.gapEnd) {
        return true;
      }
    }
  }
  return false;
}

function drawGame() {
  // Clear canvas
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid background
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

  // Draw pipes
  pipes.forEach((pipe) => {
    // Top pipe
    ctx.fillStyle = colors.pipe;
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapStart);

    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.gapEnd, pipeWidth, canvas.height - pipe.gapEnd);

    // Pipe highlights
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(pipe.x, 0, 3, pipe.gapStart);
    ctx.fillRect(pipe.x, pipe.gapEnd, 3, canvas.height - pipe.gapEnd);
  });

  // Draw bird with glow effect
  ctx.shadowColor = "rgba(0, 217, 255, 0.8)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = colors.bird;

  // Bird body
  ctx.beginPath();
  ctx.ellipse(
    bird.x + bird.width / 2,
    bird.y + bird.height / 2,
    bird.width / 2,
    bird.height / 2,
    bird.velocityY * 0.05,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Bird eye
  ctx.fillStyle = "#0a0e27";
  ctx.beginPath();
  ctx.arc(bird.x + bird.width - 8, bird.y + 8, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(bird.x + bird.width - 8, bird.y + 8, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = "transparent";

  // Draw pause overlay
  if (gamePaused) {
    ctx.fillStyle = "rgba(10, 14, 39, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00d9ff";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  if (gameRunning && !gamePaused) {
    updateGame();
  }

  drawGame();

  if (gameRunning && !gamePaused) {
    requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  gameRunning = false;
  gamePaused = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = "PAUSE";

  // Update best score
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("flappyBirdBest", bestScore);
    bestScoreDisplay.textContent = bestScore;
  }

  // Show game over screen
  finalScoreDisplay.textContent = score;
  bestMessageDisplay.textContent = bestScore;
  gameOverScreen.classList.add("show");

  playGameOverSound();
}

// Simple sound effects (using Web Audio API)
function playScoreSound() {
  try {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    // Audio not supported
  }
}

function playGameOverSound() {
  try {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(
      200,
      audioContext.currentTime + 0.3,
    );
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    // Audio not supported
  }
}

// Initial draw
drawGame();
