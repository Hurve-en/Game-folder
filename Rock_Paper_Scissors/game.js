// Game state
let playerWins = 0;
let aiWins = 0;
let draws = 0;

const choices = {
  rock: { emoji: "🪨", beats: "scissors" },
  paper: { emoji: "📄", beats: "rock" },
  scissors: { emoji: "✂️", beats: "paper" },
};

function play(playerChoice) {
  // AI makes random choice
  const aiChoices = ["rock", "paper", "scissors"];
  const aiChoice = aiChoices[Math.floor(Math.random() * aiChoices.length)];

  // Determine winner
  let result = "";
  let resultClass = "";

  if (playerChoice === aiChoice) {
    result = "It's a Draw!";
    resultClass = "draw";
    draws++;
  } else if (choices[playerChoice].beats === aiChoice) {
    result = "You Win! 🎉";
    resultClass = "win";
    playerWins++;
  } else {
    result = "AI Wins! 🤖";
    resultClass = "lose";
    aiWins++;
  }

  // Display results
  displayResult(playerChoice, aiChoice, result, resultClass);
  updateStats();
}

function displayResult(playerChoice, aiChoice, result, resultClass) {
  const resultBox = document.getElementById("resultBox");
  const aiChoiceEl = document.getElementById("aiChoice");

  // Update result box
  resultBox.classList.remove("win", "lose", "draw");
  resultBox.classList.add(resultClass);
  resultBox.innerHTML = `<p class="result-text">${result}</p>`;

  // Update AI choice display
  aiChoiceEl.innerHTML = `
        <span class="emoji">${choices[aiChoice].emoji}</span>
        <span class="label">${aiChoice.toUpperCase()}</span>
    `;

  // Add animation
  resultBox.style.animation = "none";
  setTimeout(() => {
    resultBox.style.animation = "pulse 0.5s ease-in-out";
  }, 10);
}

function updateStats() {
  document.getElementById("playerWins").textContent = playerWins;
  document.getElementById("aiWins").textContent = aiWins;
  document.getElementById("draws").textContent = draws;
}

function resetScore() {
  playerWins = 0;
  aiWins = 0;
  draws = 0;

  document.getElementById("resultBox").classList.remove("win", "lose", "draw");
  document.getElementById("resultBox").innerHTML =
    '<p class="result-text">Make your move!</p>';
  document.getElementById("aiChoice").innerHTML = `
        <span class="emoji">❓</span>
        <span class="label">Waiting...</span>
    `;

  updateStats();
}

// Add CSS animation
const style = document.createElement("style");
style.textContent = `
    @keyframes pulse {
        0% {
            transform: scale(0.95);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Initialize
updateStats();
