const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Game state
let gold = 300;
let health = 20;
let wave = 1;
let score = 0;
let gameActive = false;
let gameOver = false;

let selectedTower = null;
let towers = [];
let enemies = [];
let bullets = [];

// Tower definitions
const TOWER_TYPES = {
  gun: {
    cost: 75,
    range: 120,
    damage: 1,
    fireRate: 2,
    radius: 8,
    color: "#e74c3c",
  },
  cannon: {
    cost: 150,
    range: 160,
    damage: 3,
    fireRate: 0.8,
    radius: 12,
    color: "#3498db",
  },
  laser: {
    cost: 200,
    range: 140,
    damage: 2,
    fireRate: 3,
    radius: 10,
    color: "#f39c12",
  },
};

// Enemy path
const PATH = [
  { x: 50, y: 250 },
  { x: 150, y: 250 },
  { x: 150, y: 100 },
  { x: 400, y: 100 },
  { x: 400, y: 400 },
  { x: 700, y: 400 },
];

// Waves config
const WAVE_CONFIG = [
  { count: 5, speed: 2, health: 1 },
  { count: 8, speed: 2.2, health: 1 },
  { count: 10, speed: 2.4, health: 2 },
  { count: 12, speed: 2.6, health: 2 },
  { count: 15, speed: 2.8, health: 3 },
];

// Event listeners
document.querySelectorAll(".tower-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.tower;
    selectedTower = selectedTower === type ? null : type;

    document
      .querySelectorAll(".tower-option")
      .forEach((b) => b.classList.remove("selected"));
    if (selectedTower) {
      document
        .querySelector(`[data-tower="${selectedTower}"]`)
        .classList.add("selected");
      const def = TOWER_TYPES[selectedTower];
      document.getElementById("info").innerHTML =
        `<p><strong>${selectedTower.toUpperCase()}</strong><br>Cost: ${def.cost} gold<br>Range: ${def.range} | Damage: ${def.damage}<br>Click map to place</p>`;
    } else {
      document.getElementById("info").innerHTML =
        "<p>Click a tower, then click the map to place it</p>";
    }
  });
});

document.getElementById("start-btn").addEventListener("click", () => {
  if (!gameActive && !gameOver) {
    startWave();
  }
});

document.getElementById("reset-btn").addEventListener("click", () => {
  location.reload();
});

canvas.addEventListener("click", (e) => {
  if (selectedTower && !gameOver) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cost = TOWER_TYPES[selectedTower].cost;

    if (gold >= cost) {
      const def = TOWER_TYPES[selectedTower];
      towers.push({
        x: x,
        y: y,
        type: selectedTower,
        ...def,
        cooldown: 0,
      });
      gold -= cost;
      updateUI();
    }
  }
});

function startWave() {
  console.log("Starting wave:", wave);
  gameActive = true;
  enemies = [];
  bullets = [];

  const config = WAVE_CONFIG[Math.min(wave - 1, 4)];

  for (let i = 0; i < config.count; i++) {
    setTimeout(() => {
      enemies.push({
        x: PATH[0].x,
        y: PATH[0].y,
        pathIndex: 0,
        progress: 0,
        speed: config.speed,
        health: config.health,
        maxHealth: config.health,
      });
    }, i * 300);
  }
}

function update() {
  if (!gameActive) return;

  // Update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];

    enemy.progress += enemy.speed / 600;

    if (enemy.progress >= 1) {
      enemy.pathIndex++;
      enemy.progress = 0;
    }

    if (enemy.pathIndex >= PATH.length) {
      enemies.splice(i, 1);
      health--;

      if (health <= 0) {
        endGame();
      }
      continue;
    }

    const current = PATH[enemy.pathIndex];
    const next = PATH[enemy.pathIndex + 1];

    enemy.x = current.x + (next.x - current.x) * enemy.progress;
    enemy.y = current.y + (next.y - current.y) * enemy.progress;
  }

  // Update towers
  for (let tower of towers) {
    tower.cooldown--;

    let closestEnemy = null;
    let closestDist = tower.range;

    for (let enemy of enemies) {
      const dx = enemy.x - tower.x;
      const dy = enemy.y - tower.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closestDist = dist;
        closestEnemy = enemy;
      }
    }

    if (closestEnemy && tower.cooldown <= 0) {
      bullets.push({
        x: tower.x,
        y: tower.y,
        targetX: closestEnemy.x,
        targetY: closestEnemy.y,
        damage: tower.damage,
        speed: 8,
      });
      tower.cooldown = 60 / tower.fireRate;
    }
  }

  // Update bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    const dx = bullet.targetX - bullet.x;
    const dy = bullet.targetY - bullet.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 20) {
      // Check hit
      for (let j = enemies.length - 1; j >= 0; j--) {
        const edx = enemies[j].x - bullet.x;
        const edy = enemies[j].y - bullet.y;
        const edist = Math.sqrt(edx * edx + edy * edy);

        if (edist < 15) {
          enemies[j].health -= bullet.damage;

          if (enemies[j].health <= 0) {
            score += 10;
            gold += 5;
            enemies.splice(j, 1);
          }
          break;
        }
      }
      bullets.splice(i, 1);
    } else {
      const angle = Math.atan2(dy, dx);
      bullet.x += Math.cos(angle) * bullet.speed;
      bullet.y += Math.sin(angle) * bullet.speed;
    }
  }

  // Check wave complete
  if (gameActive && enemies.length === 0) {
    gameActive = false;
    wave++;
    gold += wave * 50;
    document.getElementById("info").innerHTML =
      `<p>Wave ${wave} ready!<br>Earn: ${wave * 50} gold</p>`;
  }
}

function draw() {
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw path
  ctx.strokeStyle = "rgba(52, 152, 219, 0.3)";
  ctx.lineWidth = 60;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(PATH[0].x, PATH[0].y);
  for (let p of PATH) {
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // Draw towers
  for (let tower of towers) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = tower.color;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, tower.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw bullets
  for (let bullet of bullets) {
    ctx.fillStyle = "#ffdd00";
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw enemies
  for (let enemy of enemies) {
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
    ctx.fill();

    const healthPercent = enemy.health / enemy.maxHealth;
    ctx.fillStyle =
      healthPercent > 0.6
        ? "#2ecc71"
        : healthPercent > 0.3
          ? "#f39c12"
          : "#e74c3c";
    ctx.fillRect(enemy.x - 12, enemy.y - 18, 24 * healthPercent, 4);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(enemy.x - 12, enemy.y - 18, 24, 4);
  }
}

function updateUI() {
  document.getElementById("gold").textContent = gold;
  document.getElementById("health").textContent = health;
  document.getElementById("wave").textContent = wave;
  document.getElementById("score").textContent = score;
}

function endGame() {
  gameActive = false;
  gameOver = true;

  document.getElementById("resultWave").textContent = wave;
  document.getElementById("resultScore").textContent = score;
  document.getElementById("resultKills").textContent = Math.floor(score / 10);
  document.getElementById("gameOverModal").classList.remove("hidden");
}

function gameLoop() {
  update();
  draw();
  updateUI();
  requestAnimationFrame(gameLoop);
}

updateUI();
gameLoop();
