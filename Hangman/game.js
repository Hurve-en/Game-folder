// Word list with categories
const wordList = [
  { word: "ELEPHANT", category: "Animals" },
  { word: "PYTHON", category: "Programming Languages" },
  { word: "JAVASCRIPT", category: "Programming Languages" },
  { word: "BASKETBALL", category: "Sports" },
  { word: "MOUNTAIN", category: "Nature" },
  { word: "RAINBOW", category: "Nature" },
  { word: "COMPUTER", category: "Technology" },
  { word: "DINOSAUR", category: "Animals" },
  { word: "PLANET", category: "Space" },
  { word: "GUITAR", category: "Instruments" },
  { word: "BUTTERFLY", category: "Animals" },
  { word: "VOLCANO", category: "Nature" },
  { word: "LIBRARY", category: "Places" },
  { word: "TELESCOPE", category: "Instruments" },
  { word: "WATERFALL", category: "Nature" },
  { word: "PENGUIN", category: "Animals" },
  { word: "KEYBOARD", category: "Technology" },
  { word: "SUNRISE", category: "Nature" },
  { word: "TREASURE", category: "Objects" },
  { word: "CRYSTAL", category: "Objects" },
];

// Game variables
let currentWord = "";
let currentCategory = "";
let guessedLetters = [];
let wrongGuesses = [];
let wins = 0;
let gameOver = false;

// Load wins from localStorage
function loadWins() {
  wins = parseInt(localStorage.getItem("hangmanWins")) || 0;
  document.getElementById("wins").textContent = wins;
}
loadWins();

// Start new game
function newGame() {
  const wordData = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = wordData.word;
  currentCategory = wordData.category;
  guessedLetters = [];
  wrongGuesses = [];
  gameOver = false;

  document.getElementById("resultModal").classList.add("hidden");

  // Reset letter buttons
  document.querySelectorAll(".letter-btn").forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");
  });

  // Reset hangman parts
  document.querySelectorAll(".hangman-drawing .hidden").forEach((part) => {
    part.classList.add("hidden");
  });

  updateDisplay();
}

function guessLetter(letter) {
  if (
    gameOver ||
    guessedLetters.includes(letter) ||
    wrongGuesses.includes(letter)
  )
    return;

  if (currentWord.includes(letter)) {
    guessedLetters.push(letter);
    document
      .querySelector(`[data-letter="${letter}"]`)
      .classList.add("correct");
    document.querySelector(`[data-letter="${letter}"]`).disabled = true;
  } else {
    wrongGuesses.push(letter);
    document.querySelector(`[data-letter="${letter}"]`).classList.add("wrong");
    document.querySelector(`[data-letter="${letter}"]`).disabled = true;
    showHangmanPart();
  }

  updateDisplay();
  checkGameStatus();
}

function showHangmanPart() {
  const parts = ["head", "body", "leftArm", "rightArm", "leftLeg", "rightLeg"];
  const part = parts[wrongGuesses.length - 1];
  if (part) {
    const element = document.getElementById(part);
    if (element) element.classList.remove("hidden");
  }
}

function updateDisplay() {
  // Update word display
  const wordDisplay = currentWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
  document.getElementById("wordDisplay").textContent = wordDisplay;

  // Update category
  document.getElementById("category").textContent =
    `Category: ${currentCategory}`;

  // Update guesses left
  const guessesLeft = 6 - wrongGuesses.length;
  document.getElementById("guessesLeft").textContent = guessesLeft;

  // Update guessed letters display
  const guessedContainer = document.getElementById("guessedLetters");
  guessedContainer.innerHTML = "";

  guessedLetters.forEach((letter) => {
    const span = document.createElement("span");
    span.className = "guessed-letter";
    span.textContent = letter;
    guessedContainer.appendChild(span);
  });

  wrongGuesses.forEach((letter) => {
    const span = document.createElement("span");
    span.className = "guessed-letter wrong";
    span.textContent = letter;
    guessedContainer.appendChild(span);
  });
}

function checkGameStatus() {
  const wordComplete = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const guessesLeft = 6 - wrongGuesses.length;

  if (wordComplete) {
    gameOver = true;
    wins++;
    localStorage.setItem("hangmanWins", wins);
    document.getElementById("wins").textContent = wins;
    showResult(true);
  } else if (guessesLeft === 0) {
    gameOver = true;
    showResult(false);
  }
}

function showResult(won) {
  const modal = document.getElementById("resultModal");
  const title = document.getElementById("resultTitle");
  const message = document.getElementById("resultMessage");
  const revealed = document.getElementById("revealedWord");
  const totalWins = document.getElementById("totalWins");

  if (won) {
    title.textContent = "You Won!";
    title.style.color = "#27ae60";
    message.textContent = "Great job! You guessed the word correctly.";
    revealed.textContent = currentWord;
  } else {
    title.textContent = "Game Over!";
    title.style.color = "#c0392b";
    message.textContent = "Sorry! You ran out of guesses.";
    revealed.textContent = `The word was: ${currentWord}`;
  }

  totalWins.textContent = wins;
  modal.classList.remove("hidden");
}

// Event listeners
document.querySelectorAll(".letter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    guessLetter(e.target.dataset.letter);
  });
});

document.getElementById("newGameBtn").addEventListener("click", newGame);

document.getElementById("hintBtn").addEventListener("click", () => {
  const hints = {
    ELEPHANT: "A large gray animal with a trunk",
    PYTHON: "A programming language named after a comedy group",
    JAVASCRIPT: "The language of the web",
    BASKETBALL: "A sport played with a ball and hoops",
    MOUNTAIN: "A very tall landform",
    RAINBOW: "Appears after rain with multiple colors",
    COMPUTER: "Electronic device for computing",
    DINOSAUR: "Extinct prehistoric animal",
    PLANET: "A celestial body orbiting the sun",
    GUITAR: "Musical instrument with strings",
    BUTTERFLY: "Colorful flying insect",
    VOLCANO: "Mountain that erupts with lava",
    LIBRARY: "Building filled with books",
    TELESCOPE: "Device for viewing distant stars",
    WATERFALL: "Flowing water from a height",
    PENGUIN: "Black and white flightless bird",
    KEYBOARD: "Input device with letters and numbers",
    SUNRISE: "When the sun rises in the morning",
    TREASURE: "Valuable hidden items",
    CRYSTAL: "Hard shiny mineral",
  };

  alert(`Hint: ${hints[currentWord] || "No hint available"}`);
});

// Start first game
newGame();
