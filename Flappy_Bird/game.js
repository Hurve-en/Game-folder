const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
let isGameRunning = false;
let score = 0;
let bestScore = localStorage.getItem("flappyBirdBest") || 0;

// Bird properties - SLOWED DOWN
const bird = {
  x: 100,
  y: 250,
  width: 40,
  height: 40,
  velocityY: 0,
  gravity: 0.25, // REDUCED from 0.5 - much slower fall
  flap: -7, // REDUCED from -12 - gentler jump
  color: "#FFD700",
};

// Pipes array
let pipes = [];
let pipeCounter = 0;

const PIPE_WIDTH = 80;
const PIPE_GAP = 150;
const PIPE_SPACING = 200;
const PIPE_SPEED = 2; // REDUCED from 5 - much slower movement

// Update best score display
document.getElementById("best").textContent = bestScore;

// Event listeners
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && isGameRunning) {
    e.preventDefault();
    bird.velocityY = bird.flap;
  }
});

canvas.addEventListener("click", () => {
  if (isGameRunning) {
    bird.velocityY = bird.flap;
  }
});

function startGame() {
  if (isGameRunning) return;

  isGameRunning = true;
  score = 0;
  pipes = [];
  pipeCounter = 0;
  bird.y = canvas.height / 2;
  bird.velocityY = 0;

  document.getElementById("score").textContent = score;
  document.getElementById("startBtn").disabled = true;

  gameLoop();
}

function resetGame() {
  isGameRunning = false;
  score = 0;
  pipes = [];
  bird.y = canvas.height / 2;
  bird.velocityY = 0;

  document.getElementById("score").textContent = score;
  document.getElementById("startBtn").disabled = false;

  draw();
}

function update() {
  // Bird gravity - SLOW
  bird.velocityY += bird.gravity;
  bird.y += bird.velocityY;

  // Create pipes
  pipeCounter++;
  if (pipeCounter > PIPE_SPACING) {
    const gapY = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
    pipes.push({
      x: canvas.width,
      gapStart: gapY,
      gapEnd: gapY + PIPE_GAP,
      passed: false,
    });
    pipeCounter = 0;
  }

  // Update pipes - SLOW
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= PIPE_SPEED;

    // Check if bird passed pipe
    if (!pipes[i].passed && pipes[i].x + PIPE_WIDTH < bird.x) {
      pipes[i].passed = true;
      score++;
      document.getElementById("score").textContent = score;
    }

    // Remove off-screen pipes
    if (pipes[i].x + PIPE_WIDTH < 0) {
      pipes.splice(i, 1);
    }
  }

  // Check collisions with pipes
  for (let pipe of pipes) {
    // Check horizontal overlap
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + PIPE_WIDTH) {
      // Check vertical collision
      if (bird.y < pipe.gapStart || bird.y + bird.height > pipe.gapEnd) {
        gameOver();
        return;
      }
    }
  }

  // Check boundary collisions
  if (bird.y < 0 || bird.y + bird.height > canvas.height) {
    gameOver();
    return;
  }
}

function draw() {
  // Clear canvas with sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#87CEEB");
  gradient.addColorStop(1, "#E0F6FF");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = "#90EE90";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
  ctx.strokeStyle = "#228B22";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, canvas.height - 40, canvas.width, 40);

  // Draw pipes (Minecraft blocks style)
  for (let pipe of pipes) {
    // Top pipe
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapStart);
    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 2;
    ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.gapStart);

    // Bottom pipe
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(pipe.x, pipe.gapEnd, PIPE_WIDTH, canvas.height - pipe.gapEnd);
    ctx.strokeRect(
      pipe.x,
      pipe.gapEnd,
      PIPE_WIDTH,
      canvas.height - pipe.gapEnd,
    );

    // Add texture
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let y = 0; y < pipe.gapStart; y += 20) {
      ctx.fillRect(pipe.x, y, PIPE_WIDTH, 10);
    }
    for (let y = pipe.gapEnd; y < canvas.height; y += 20) {
      ctx.fillRect(pipe.x, y, PIPE_WIDTH, 10);
    }
  }

  // Draw bird (yellow block)
  ctx.fillStyle = bird.color;
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Bird outline
  ctx.strokeStyle = "#FF8C00";
  ctx.lineWidth = 3;
  ctx.strokeRect(bird.x, bird.y, bird.width, bird.height);

  // Bird eyes
  ctx.fillStyle = "#000";
  ctx.fillRect(bird.x + 10, bird.y + 10, 6, 6);
  ctx.fillRect(bird.x + 24, bird.y + 10, 6, 6);

  // Bird mouth
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bird.x + 12, bird.y + 28);
  ctx.lineTo(bird.x + 28, bird.y + 28);
  ctx.stroke();
}

function gameLoop() {
  update();
  draw();

  if (isGameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

function gameOver() {
  isGameRunning = false;
  document.getElementById("startBtn").disabled = false;

  // Update best score
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("flappyBirdBest", bestScore);
    document.getElementById("best").textContent = bestScore;
  }

  // Show alert
  setTimeout(() => {
    alert(`Game Over!\nScore: ${score}\nBest: ${bestScore}`);
  }, 100);
}

// Initial draw
draw();
