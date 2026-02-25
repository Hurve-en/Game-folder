const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Game state
let gold = 500;
let health = 20;
let wave = 1;
let kills = 0;
let gameActive = false;
let gameOver = false;
let selectedTower = null;
let gameSpeed = 1;

// Game objects
let towers = [];
let enemies = [];
let projectiles = [];
let particles = [];

// Wave system
const waveConfig = {
  1: { count: 10, speed: 1.5, health: 1 },
  2: { count: 15, speed: 1.8, health: 1 },
  3: { count: 20, speed: 2, health: 2 },
  4: { count: 25, speed: 2.2, health: 2 },
  5: { count: 30, speed: 2.5, health: 3 },
};

// Tower definitions
const towerDefs = {
  gun: {
    cost: 100,
    range: 80,
    speed: 5,
    damage: 1,
    color: "#ff6b6b",
    emoji: "🔫",
  },
  laser: {
    cost: 200,
    range: 120,
    speed: 1,
    damage: 3,
    color: "#ffd700",
    emoji: "💥",
  },
  ice: {
    cost: 150,
    range: 100,
    speed: 3,
    damage: 0.5,
    color: "#00d4ff",
    emoji: "❄️",
  },
};

// Enemy path
const path = [
  { x: 0, y: 100 },
  { x: 150, y: 100 },
  { x: 150, y: 300 },
  { x: 400, y: 300 },
  { x: 400, y: 100 },
  { x: canvas.width, y: 100 },
];

// Event listeners
document.getElementById("startBtn").addEventListener("click", startWave);
document.getElementById("speedBtn").addEventListener("click", toggleSpeed);
document.getElementById("resetBtn").addEventListener("click", resetGame);

document.querySelectorAll(".tower-btn").forEach((btn) => {
  btn.addEventListener("click", () => selectTower(btn.dataset.tower));
});

canvas.addEventListener("click", placeTower);

function selectTower(type) {
  selectedTower = selectedTower === type ? null : type;

  document.querySelectorAll(".tower-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  if (selectedTower) {
    document
      .querySelector(`[data-tower="${selectedTower}"]`)
      .classList.add("selected");
    const def = towerDefs[selectedTower];
    document.getElementById("towerInfo").textContent =
      `Cost: ${def.cost} gold | Range: ${def.range}px`;
  } else {
    document.getElementById("towerInfo").textContent =
      "Click on a tower type, then click on the map to place it";
  }
}

function placeTower(e) {
  if (!selectedTower || gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);

  const cost = towerDefs[selectedTower].cost;

  if (gold >= cost) {
    towers.push({
      x: x,
      y: y,
      type: selectedTower,
      ...towerDefs[selectedTower],
      lastShot: 0,
    });
    gold -= cost;
    updateUI();
  }
}

function startWave() {
  if (gameActive || gameOver) return;

  gameActive = true;
  enemies = [];
  const config = waveConfig[Math.min(wave, 5)];

  for (let i = 0; i < config.count; i++) {
    setTimeout(() => {
      enemies.push({
        x: path[0].x,
        y: path[0].y,
        pathIndex: 0,
        pathProgress: 0,
        speed: config.speed,
        health: config.health,
        maxHealth: config.health,
      });
    }, i * 200);
  }
}

function toggleSpeed() {
  gameSpeed = gameSpeed === 1 ? 2 : 1;
  document.getElementById("speedBtn").textContent = `SPEED: ${gameSpeed}x`;
}

function update() {
  if (!gameActive) return;

  for (let i = 0; i < gameSpeed; i++) {
    // Update enemies
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      const targetPoint = path[Math.floor(enemy.pathIndex)];
      const nextPoint = path[Math.ceil(enemy.pathIndex)];

      if (!nextPoint) {
        enemies.splice(j, 1);
        health--;
        if (health <= 0) endGame();
        continue;
      }

      enemy.pathProgress += enemy.speed / 100;

      if (enemy.pathProgress >= 1) {
        enemy.pathIndex++;
        enemy.pathProgress = 0;
        if (enemy.pathIndex >= path.length) {
          enemies.splice(j, 1);
          health--;
          if (health <= 0) endGame();
        }
      } else {
        const current = path[Math.floor(enemy.pathIndex)];
        const next = path[Math.ceil(enemy.pathIndex)];
        enemy.x = current.x + (next.x - current.x) * enemy.pathProgress;
        enemy.y = current.y + (next.y - current.y) * enemy.pathProgress;
      }
    }

    // Update towers
    for (let tower of towers) {
      const targets = enemies.filter((e) => {
        const dx = e.x - tower.x;
        const dy = e.y - tower.y;
        return Math.sqrt(dx * dx + dy * dy) <= tower.range;
      });

      if (
        targets.length > 0 &&
        Date.now() - tower.lastShot > 1000 / tower.speed
      ) {
        const target = targets[0];
        projectiles.push({
          x: tower.x,
          y: tower.y,
          tx: target.x,
          ty: target.y,
          damage: tower.damage,
          type: tower.type,
          progress: 0,
        });
        tower.lastShot = Date.now();
      }
    }

    // Update projectiles
    for (let j = projectiles.length - 1; j >= 0; j--) {
      const proj = projectiles[j];
      proj.progress += 0.05;

      if (proj.progress >= 1) {
        // Hit target
        for (let k = enemies.length - 1; k >= 0; k--) {
          const dx = enemies[k].x - proj.tx;
          const dy = enemies[k].y - proj.ty;
          if (Math.sqrt(dx * dx + dy * dy) < 20) {
            enemies[k].health -= proj.damage;
            createParticles(proj.tx, proj.ty, proj.type);
            if (enemies[k].health <= 0) {
              gold += 10;
              kills++;
              enemies.splice(k, 1);
            }
            break;
          }
        }
        projectiles.splice(j, 1);
      }
    }

    // Update particles
    for (let j = particles.length - 1; j >= 0; j--) {
      particles[j].life--;
      if (particles[j].life <= 0) particles.splice(j, 1);
    }
  }

  // Check wave complete
  if (gameActive && enemies.length === 0 && !gameOver) {
    gameActive = false;
    wave++;
    gold += wave * 50;
    showWaveClearModal();
  }

  updateUI();
}

function createParticles(x, y, type) {
  const count = 8;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 2,
      life: 20,
      color: towerDefs[type].color,
    });
  }
}

function draw() {
  // Clear
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw path
  ctx.strokeStyle = "rgba(100, 200, 200, 0.3)";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let p of path) {
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // Draw towers
  for (let tower of towers) {
    ctx.fillStyle = tower.color;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Range circle (faded)
    ctx.strokeStyle = "rgba(" + hexToRgb(tower.color) + ", 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw enemies
  for (let enemy of enemies) {
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Health bar
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(
      enemy.x - 10,
      enemy.y - 15,
      (enemy.health / enemy.maxHealth) * 20,
      3,
    );
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(enemy.x - 10, enemy.y - 15, 20, 3);
  }

  // Draw projectiles
  for (let proj of projectiles) {
    const x = proj.x + (proj.tx - proj.x) * proj.progress;
    const y = proj.y + (proj.ty - proj.y) * proj.progress;

    ctx.fillStyle = towerDefs[proj.type].color;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw particles
  for (let p of particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 20;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
  }
  ctx.globalAlpha = 1;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "255, 255, 255";
}

function updateUI() {
  document.getElementById("gold").textContent = gold;
  document.getElementById("health").textContent = health;
  document.getElementById("wave").textContent = wave;
  document.getElementById("kills").textContent = kills;
}

function endGame() {
  gameOver = true;
  gameActive = false;
  document.getElementById("finalWave").textContent = wave;
  document.getElementById("finalKills").textContent = kills;
  document.getElementById("finalGold").textContent = 500 - gold;
  document.getElementById("gameOverModal").classList.remove("hidden");
}

function showWaveClearModal() {
  const reward = wave * 50;
  document.getElementById("waveGold").textContent = reward;
  document.getElementById("waveClearModal").classList.remove("hidden");
}

function closeWaveModal() {
  document.getElementById("waveClearModal").classList.add("hidden");
}

function closeModal() {
  document.getElementById("gameOverModal").classList.add("hidden");
}

function resetGame() {
  closeModal();
  gold = 500;
  health = 20;
  wave = 1;
  kills = 0;
  gameActive = false;
  gameOver = false;
  selectedTower = null;
  towers = [];
  enemies = [];
  projectiles = [];
  particles = [];
  updateUI();
  draw();
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

updateUI();
gameLoop();
