/**
 * Rendering and Display
 * All canvas drawing functions
 */

/**
 * Draw the sky background
 */
function drawSky() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#87CEEB");
  gradient.addColorStop(1, "#E0F6FF");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw the ground
 */
function drawGround() {
  ctx.fillStyle = "#90EE90";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
  ctx.strokeStyle = "#228B22";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, canvas.height - 40, canvas.width, 40);
}

/**
 * Draw a single pipe
 */
function drawPipe(pipe) {
  // Top pipe
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(pipe.x, 0, GAME_CONFIG.PIPE_WIDTH, pipe.gapStart);
  ctx.strokeStyle = "#2E7D32";
  ctx.lineWidth = 2;
  ctx.strokeRect(pipe.x, 0, GAME_CONFIG.PIPE_WIDTH, pipe.gapStart);

  // Bottom pipe
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(
    pipe.x,
    pipe.gapEnd,
    GAME_CONFIG.PIPE_WIDTH,
    canvas.height - pipe.gapEnd,
  );
  ctx.strokeRect(
    pipe.x,
    pipe.gapEnd,
    GAME_CONFIG.PIPE_WIDTH,
    canvas.height - pipe.gapEnd,
  );

  // Add texture to pipes
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  for (let y = 0; y < pipe.gapStart; y += 20) {
    ctx.fillRect(pipe.x, y, GAME_CONFIG.PIPE_WIDTH, 10);
  }
  for (let y = pipe.gapEnd; y < canvas.height; y += 20) {
    ctx.fillRect(pipe.x, y, GAME_CONFIG.PIPE_WIDTH, 10);
  }
}

/**
 * Draw all pipes
 */
function drawPipes() {
  for (let pipe of pipes) {
    drawPipe(pipe);
  }
}

/**
 * Draw the bird
 */
function drawBird() {
  // Bird body
  ctx.fillStyle = Bird.color;
  ctx.fillRect(Bird.x, Bird.y, Bird.width, Bird.height);

  // Bird outline
  ctx.strokeStyle = "#FF8C00";
  ctx.lineWidth = 3;
  ctx.strokeRect(Bird.x, Bird.y, Bird.width, Bird.height);

  // Bird eyes
  ctx.fillStyle = "#000";
  ctx.fillRect(Bird.x + 10, Bird.y + 10, 6, 6);
  ctx.fillRect(Bird.x + 24, Bird.y + 10, 6, 6);

  // Bird mouth
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(Bird.x + 12, Bird.y + 28);
  ctx.lineTo(Bird.x + 28, Bird.y + 28);
  ctx.stroke();
}

/**
 * Main draw function
 */
function draw() {
  drawSky();
  drawGround();
  drawPipes();
  drawBird();
}
