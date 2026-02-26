const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Game state
let gameState = {
  gold: 300,
  health: 20,
  wave: 1,
  score: 0,
  gameActive: false,
  gameOver: false,
};

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

// Path for enemies
const ENEMY_PATH = [
  { x: 50, y: 250 },
  { x: 150, y: 250 },
  { x: 150, y: 100 },
  { x: 400, y: 100 },
  { x: 400, y: 400 },
  { x: 700, y: 400 },
];

// Enemy waves
const WAVES = {
  1: { count: 5, speed: 2, health: 1 },
  2: { count: 8, speed: 2.2, health: 1 },
  3: { count: 10, speed: 2.4, health: 2 },
  4: { count: 12, speed: 2.6, health: 2 },
  5: { count: 15, speed: 2.8, health: 3 },
};

// Event listeners
document.querySelectorAll(".tower-option").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    selectTower(btn.dataset.tower);
  });
});

document.getElementById("start-btn").addEventListener("click", startWave);
document.getElementById("reset-btn").addEventListener("click", resetGame);
canvas.addEventListener("click", placeTower);

function selectTower(type) {
  selectedTower = selectedTower === type ? null : type;

  document.querySelectorAll(".tower-option").forEach((btn) => {
    btn.classList.remove("selected");
  });

  if (selectedTower) {
    document.getElementById(`tower-${type}`).classList.add("selected");
    const towerDef = TOWER_TYPES[type];
    document.getElementById("info").innerHTML =
      `<p><strong>${type.toUpperCase()}</strong><br>Cost: ${towerDef.cost} gold<br>Range: ${towerDef.range} | Damage: ${towerDef.damage}<br>Click map to place</p>`;
  } else {
    document.getElementById("info").innerHTML =
      "<p>Click a tower, then click the map to place it</p>";
  }
}

function placeTower(e) {
  if (!selectedTower || gameState.gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);

  const cost = TOWER_TYPES[selectedTower].cost;

  if (gameState.gold >= cost) {
    const tower = {
      x: x,
      y: y,
      type: selectedTower,
      ...TOWER_TYPES[selectedTower],
      nextFire: 0,
    };

    towers.push(tower);
    gameState.gold -= cost;
    updateUI();
  }
}

function startWave() {
  if (gameState.gameActive || gameState.gameOver) return;

  gameState.gameActive = true;
  enemies = [];

  const wave = WAVES[Math.min(gameState.wave, 5)];
  let delay = 0;

  for (let i = 0; i < wave.count; i++) {
    setTimeout(() => {
      if (gameState.gameActive) {
        enemies.push({
          pathIndex: 0,
          progress: 0,
          speed: wave.speed,
          health: wave.health,
          maxHealth: wave.health,
          x: ENEMY_PATH[0].x,
          y: ENEMY_PATH[0].y,
        });
      }
    }, delay);
    delay += 400;
  }
}

function updateGame() {
  if (!gameState.gameActive) return;

  // Update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];

    enemy.progress += enemy.speed / 600;

    if (enemy.progress >= 1) {
      enemy.pathIndex++;
      enemy.progress = 0;
    }

    if (enemy.pathIndex >= ENEMY_PATH.length) {
      enemies.splice(i, 1);
      gameState.health--;

      if (gameState.health <= 0) {
        endGame();
      }
      continue;
    }

    // Position on path
    const current = ENEMY_PATH[enemy.pathIndex];
    const next = ENEMY_PATH[enemy.pathIndex + 1];

    enemy.x = current.x + (next.x - current.x) * enemy.progress;
    enemy.y = current.y + (next.y - current.y) * enemy.progress;
  }

  // Update towers and shoot
  for (let tower of towers) {
    tower.nextFire--;

    // Find closest target
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

    // Shoot closest enemy
    if (closestEnemy && tower.nextFire <= 0) {
      bullets.push({
        x: tower.x,
        y: tower.y,
        targetX: closestEnemy.x,
        targetY: closestEnemy.y,
        damage: tower.damage,
        speed: 8,
      });

      tower.nextFire = 60 / tower.fireRate;
    }
  }

  // Update bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    const dx = bullet.targetX - bullet.x;
    const dy = bullet.targetY - bullet.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 20) {
      // Hit - check all enemies near bullet
      let hit = false;
      for (let j = enemies.length - 1; j >= 0; j--) {
        const edx = enemies[j].x - bullet.x;
        const edy = enemies[j].y - bullet.y;
        const edist = Math.sqrt(edx * edx + edy * edy);

        if (edist < 15) {
          enemies[j].health -= bullet.damage;
          hit = true;

          if (enemies[j].health <= 0) {
            gameState.score += 10;
            gameState.gold += 5;
            enemies.splice(j, 1);
          }
          break;
        }
      }

      bullets.splice(i, 1);
    } else if (dist > 500) {
      // Bullet went too far
      bullets.splice(i, 1);
    } else {
      // Move bullet toward target
      const angle = Math.atan2(dy, dx);
      bullet.x += Math.cos(angle) * bullet.speed;
      bullet.y += Math.sin(angle) * bullet.speed;
    }
  }

  // Check wave complete
  if (gameState.gameActive && enemies.length === 0) {
    gameState.gameActive = false;
    gameState.wave++;
    gameState.gold += gameState.wave * 50;
    document.getElementById("info").innerHTML =
      `<p>Wave ${gameState.wave} ready!<br>Earn: ${gameState.wave * 50} gold</p>`;
  }
}

function draw() {
  // Clear
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw path
  ctx.strokeStyle = "rgba(52, 152, 219, 0.3)";
  ctx.lineWidth = 60;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(ENEMY_PATH[0].x, ENEMY_PATH[0].y);
  for (let p of ENEMY_PATH) {
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // Draw towers
  for (let tower of towers) {
    // Range
    ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
    ctx.stroke();

    // Tower
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
    // Enemy
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Health bar
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
  document.getElementById("gold").textContent = gameState.gold;
  document.getElementById("health").textContent = gameState.health;
  document.getElementById("wave").textContent = gameState.wave;
  document.getElementById("score").textContent = gameState.score;
}

function endGame() {
  gameState.gameOver = true;
  gameState.gameActive = false;

  document.getElementById("resultWave").textContent = gameState.wave;
  document.getElementById("resultScore").textContent = gameState.score;
  document.getElementById("resultKills").textContent = Math.floor(
    gameState.score / 10,
  );
  document.getElementById("gameOverModal").classList.remove("hidden");
}

function resetGame() {
  location.reload();
}

// Game loop
function gameLoop() {
  updateGame();
  draw();
  updateUI();
  requestAnimationFrame(gameLoop);
}

updateUI();
gameLoop();
