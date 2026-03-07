// Word list
const WORDS = [
  "ABOUT",
  "ABOVE",
  "ABUSE",
  "ACTOR",
  "ACUTE",
  "ADMIT",
  "ADOPT",
  "ADULT",
  "AFTER",
  "AGAIN",
  "AGENT",
  "AGREE",
  "AHEAD",
  "ALARM",
  "ALBUM",
  "ALERT",
  "ALIGN",
  "ALIKE",
  "ALIVE",
  "ALLOW",
  "ALONE",
  "ALONG",
  "ALTER",
  "ANGEL",
  "ANGER",
  "ANGLE",
  "ANGRY",
  "APART",
  "APPLE",
  "APPLY",
  "ARENA",
  "ARGUE",
  "ARISE",
  "ARRAY",
  "ARROW",
  "ASIDE",
  "ASSET",
  "AUDIO",
  "AUDIT",
  "AVOID",
  "AWAKE",
  "AWARD",
  "AWARE",
  "BADLY",
  "BAKER",
  "BASES",
  "BASIC",
  "BASIS",
  "BEACH",
  "BEGAN",
  "BEGIN",
  "BEING",
  "BELOW",
  "BENCH",
  "BILLY",
  "BIRTH",
  "BLACK",
  "BLADE",
  "BLAME",
  "BLANK",
  "BLAST",
  "BLEAK",
  "BLEND",
  "BLESS",
  "BLIND",
  "BLOCK",
  "BLOOD",
  "BOARD",
  "BOOST",
  "BOOTH",
  "BOUND",
  "BRAIN",
  "BRAND",
  "BRAVE",
  "BREAD",
  "BREAK",
  "BREED",
  "BRICK",
  "BRIDE",
  "BRIEF",
  "BRING",
  "BROAD",
  "BROKE",
  "BROWN",
  "BUILD",
  "BUILT",
  "BUYER",
  "CABLE",
  "CALIF",
  "CALLS",
  "CANAL",
  "CANDY",
  "CANON",
  "CARRY",
  "CARVE",
  "CATCH",
  "CAUSE",
  "CHAIN",
  "CHAIR",
  "CHAOS",
  "CHARM",
  "CHART",
  "CHASE",
  "CHEAP",
  "CHEAT",
  "CHECK",
  "CHESS",
  "CHEST",
  "CHIEF",
  "CHILD",
  "CHINA",
  "CHOICE",
  "CHOSE",
  "CIVIL",
  "CLAIM",
  "CLASS",
  "CLEAN",
  "CLEAR",
  "CLICK",
  "CLIFF",
  "CLIMB",
  "CLOCK",
  "CLOSE",
  "CLOUD",
  "COACH",
  "COAST",
  "COBRA",
  "COLON",
  "COLOR",
  "COMES",
  "COMET",
  "COMIC",
  "CORAL",
  "COUCH",
  "COULD",
  "COUNT",
  "COURT",
  "COVER",
  "CRACK",
  "CRAFT",
  "CRASH",
  "CRAZY",
  "CREAM",
  "CREED",
  "CREEK",
  "CRIME",
  "CRISP",
  "CROPS",
  "CROSS",
  "CROWD",
  "CROWN",
  "CRUDE",
  "CRUSH",
  "CUBIC",
  "CURVE",
  "CYCLE",
  "DAILY",
  "DAIRY",
  "DANCE",
  "DATED",
  "DEALT",
  "DEATH",
  "DEBUT",
  "DECAY",
  "DECKS",
  "DECOR",
  "DEEDS",
  "DEMON",
  "DENSE",
  "DEPTH",
  "DERBY",
  "DEVIL",
  "DIARY",
  "DINED",
  "DINER",
  "DIVES",
  "DOCKS",
  "DODGE",
  "DOING",
  "DOORS",
  "DOUBT",
  "DOUGH",
  "DOZEN",
  "DRAFT",
  "DRAIN",
  "DRANK",
  "DRAWN",
  "DRAWS",
  "DREAD",
  "DREAM",
  "DRESS",
  "DRIED",
  "DRIER",
  "DRIFT",
  "DRILL",
  "DRINK",
  "DRIVE",
  "DROWN",
  "DRUGS",
  "DRUMS",
  "DRUNK",
  "DUCKS",
  "DUMMY",
  "DUMPS",
  "DUNES",
  "DUNKS",
  "DUSKS",
  "DUSTS",
  "DUSTY",
  "DWARF",
  "DWELL",
  "DYING",
  "EAGER",
  "EAGLE",
  "EARLY",
  "EARTH",
  "EASEL",
  "EASED",
  "EASES",
  "EASTS",
  "EATEN",
  "EATER",
  "EDGES",
  "EDITS",
  "EGGED",
  "EIGHT",
  "EJECT",
  "ELBOW",
  "ELEGY",
  "ELITE",
  "EMAIL",
  "EMBED",
  "EMBER",
  "EMCEE",
  "EMERY",
  "EMPTY",
  "ENACT",
  "ENDED",
  "ENDER",
  "ENEMY",
  "ENJOY",
  "ENTER",
  "ENTRY",
  "EQUAL",
  "EQUIP",
  "ERASE",
  "ERECT",
  "ERROR",
  "ERUPT",
  "ESSAY",
  "ETHER",
  "ETHIC",
  "EVADE",
  "EVENS",
  "EVENT",
  "EVERY",
  "EVICT",
  "EVOKE",
  "EXACT",
  "EXALT",
  "EXAMS",
  "EXCEL",
  "EXERT",
  "EXILE",
  "EXIST",
  "EXPAT",
  "EXPEL",
  "EXTOL",
  "EXTRA",
  "EXUDE",
  "EXULT",
  "FABLE",
  "FACED",
  "FACET",
  "FACTS",
  "FADED",
  "FADES",
  "FAILS",
  "FAINT",
  "FAIRY",
  "FAITH",
  "FALLS",
  "FALSE",
  "FAMED",
  "FANCY",
  "FANGS",
  "FARCE",
  "FARED",
  "FARES",
  "FARMS",
  "FATAL",
  "FATED",
  "FATTY",
  "FAULT",
  "FAUNA",
  "FAVOR",
  "FEAST",
  "FEATS",
  "FEEDS",
  "FEELS",
  "FEIGN",
  "FEINT",
  "FENCE",
  "FERNS",
  "FERRY",
  "FEVER",
  "FEWER",
  "FIBER",
  "FIELD",
  "FIEND",
  "FIERY",
  "FIFES",
  "FIFTH",
  "FIFTY",
  "FIGHT",
  "FILED",
  "FILER",
  "FILES",
  "FILLS",
  "FILMS",
  "FILMY",
  "FILTH",
  "FINAL",
  "FINCH",
  "FINED",
  "FINER",
  "FINES",
  "FIRED",
  "FIRES",
  "FIRMS",
  "FIRST",
  "FISHY",
  "FISTS",
  "FIXED",
  "FIXER",
  "FIXES",
  "FLAGS",
  "FLAIL",
  "FLAKE",
  "FLAKY",
  "FLAME",
  "FLANK",
  "FLAPS",
  "FLARE",
  "FLASH",
  "FLASK",
  "FLATS",
  "FLAWS",
  "FLEAS",
  "FLECK",
  "FLEES",
  "FLEET",
  "FLESH",
  "FLICK",
  "FLIER",
  "FLIES",
  "FLING",
  "FLINT",
  "FLIPS",
  "FLIRT",
  "FLOAT",
  "FLOCK",
  "FLOOD",
  "FLOOR",
  "FLOPS",
  "FLOUR",
  "FLOWS",
  "FLUID",
  "FLUKE",
  "FLUNG",
  "FLUSH",
  "FLUTE",
  "FOAMS",
  "FOAMY",
  "FOCAL",
  "FOCUS",
  "FOGGY",
  "FOILS",
  "FOLDS",
  "FOLLY",
  "FONTS",
  "FOODS",
  "FOOLS",
  "FOOTS",
  "FORAY",
  "FORCE",
  "FORGE",
  "FORGO",
  "FORKS",
  "FORMS",
  "FORTE",
  "FORTH",
  "FORTY",
  "FORUM",
  "FOULS",
  "FOUND",
  "FOUNT",
  "FOURS",
  "FOWLS",
  "FOYER",
  "FRAIL",
  "FRAME",
  "FRANK",
  "FRAUD",
  "FREAK",
  "FREED",
  "FREER",
  "FRESH",
  "FRIAR",
  "FRIED",
  "FRIES",
  "FRILL",
  "FRISK",
  "FRIZZ",
  "FROCK",
  "FROGS",
  "FRONT",
  "FROST",
  "FROTH",
  "FROWN",
  "FROZE",
  "FRUIT",
  "FRYER",
  "FUELS",
  "FULLY",
  "FUMES",
  "FUNKY",
  "FUNNY",
  "FUROR",
  "FURRY",
  "FUSES",
  "FUZZY",
  "GABLE",
  "GAILY",
  "GAINS",
  "GAITS",
  "GALES",
  "GALLS",
  "GAMES",
  "GANGS",
  "GAMER",
  "GAPED",
  "GAPES",
  "GARBS",
  "GATES",
  "GATOR",
  "GAUGE",
  "GAUNT",
  "GAUZE",
  "GAVEL",
  "GAWKS",
  "GEARS",
  "GEESE",
  "GENRE",
  "GENTS",
  "GENUS",
  "GERMS",
  "GHOST",
  "GIANT",
  "GIDDY",
  "GIFTS",
  "GILLS",
  "GIRLS",
  "GIRTH",
  "GIVEN",
  "GIVER",
  "GIVES",
  "GLAND",
  "GLARE",
  "GLASS",
  "GLAZE",
  "GLEAM",
  "GLEAN",
  "GLIDE",
  "GLINT",
  "GLOOM",
  "GLORY",
  "GLOSS",
  "GLOVE",
  "GLUED",
  "GLUES",
  "GNASH",
  "GNATS",
  "GNOME",
  "GOALS",
  "GOATS",
  "GODLY",
  "GOING",
  "GOLDS",
  "GOLFS",
  "GONER",
  "GONGS",
  "GOODS",
  "GOODY",
  "GOOEY",
  "GOOFY",
  "GOONS",
  "GOOSE",
  "GORES",
  "GORGE",
  "GORSE",
  "GOUGE",
  "GOURD",
  "GOUTS",
  "GOWNS",
  "GRABS",
  "GRACE",
  "GRADE",
  "GRAFT",
  "GRAIL",
  "GRAIN",
  "GRAND",
  "GRANT",
  "GRAPE",
  "GRAPH",
  "GRASP",
  "GRASS",
  "GRATE",
  "GRAVE",
  "GRAVY",
  "GRAZE",
  "GREAT",
  "GREED",
  "GREEN",
  "GREET",
  "GRIEF",
  "GRILL",
  "GRIME",
  "GRIMY",
  "GRIND",
  "GRINS",
  "GRIPE",
  "GRIST",
  "GRITS",
  "GROAN",
  "GROOM",
  "GROPE",
  "GROSS",
  "GROUP",
  "GROUT",
  "GROVE",
  "GROWL",
  "GROWN",
  "GROWS",
  "GRUBS",
  "GRUEL",
  "GRUFF",
  "GRUNT",
  "GUARD",
  "GUAVA",
  "GUESS",
  "GUEST",
  "GUIDE",
  "GUILD",
  "GUILE",
  "GUILT",
  "GUISE",
  "GULCH",
  "GULFS",
  "GULLS",
  "GULPS",
  "GUMBO",
  "GUMMY",
  "GUNKY",
  "GURUS",
  "GUSHY",
  "GUSTS",
  "GUSTY",
  "GUTSY",
  "GYPSY",
  "HABIT",
  "HACKS",
  "HAIRY",
  "HALED",
  "HALER",
  "HALES",
  "HALLS",
  "HALOS",
  "HALTS",
  "HALVE",
  "HANDS",
  "HANDY",
  "HANGS",
  "HANKY",
  "HAPPY",
  "HARDY",
  "HAREM",
  "HARES",
  "HARKS",
  "HARMS",
  "HARPS",
  "HARSH",
  "HARTS",
  "HASPS",
  "HASTE",
  "HASTY",
  "HATCH",
  "HATED",
  "HATER",
  "HATES",
  "HAULS",
  "HAUNT",
  "HAVEN",
  "HAVOC",
  "HAWKS",
  "HAZEL",
  "HAZES",
  "HAZED",
  "HAZER",
  "HEADS",
  "HEADY",
  "HEALS",
  "HEAPS",
  "HEARD",
  "HEARS",
  "HEART",
  "HEATH",
  "HEATS",
  "HEAVE",
  "HEAVY",
  "HEDGE",
  "HEEDS",
  "HEELS",
  "HEFTY",
  "HEIRS",
  "HEIST",
  "HELLS",
  "HELMS",
  "HELPS",
  "HENCE",
  "HENNA",
  "HENRY",
  "HERDS",
  "HERON",
  "HEROS",
  "HEXED",
  "HEXES",
  "HIDES",
  "HIGHS",
  "HIKED",
  "HIKER",
  "HIKES",
  "HILLS",
  "HILTS",
  "HINDS",
  "HINGE",
  "HINTS",
  "HIPPO",
  "HIRED",
  "HIRES",
  "HISSY",
  "HITCH",
  "HIVES",
  "HOARD",
  "HOARS",
  "HOARY",
  "HOBBY",
  "HOCKS",
  "HOCKEY",
  "HOKEY",
  "HOKUM",
  "HOLDS",
  "HOLED",
  "HOLES",
  "HOMES",
  "HOMEY",
  "HOMED",
  "HOMER",
  "HONED",
  "HONER",
  "HONES",
  "HONEY",
  "HONKS",
  "HONOR",
  "HOOCH",
  "HOODS",
  "HOOFS",
  "HOOKS",
  "HOOKY",
  "HOOPS",
  "HOOTS",
  "HOPED",
  "HOPER",
  "HOPES",
  "HOPPY",
  "HORDE",
  "HORNS",
  "HORNY",
  "HORSE",
  "HOSED",
  "HOSES",
  "HOTLY",
  "HOUND",
  "HOURS",
  "HOUSE",
  "HOVEL",
  "HOVER",
  "HOWDY",
  "HOWLS",
  "HUBBY",
  "HUFFS",
  "HUFFY",
  "HULKS",
  "HULKY",
  "HULLS",
  "HUMAN",
  "HUMID",
  "HUMOR",
  "HUMPS",
  "HUMUS",
  "HUNCH",
  "HUNKS",
  "HUNKY",
  "HUNTS",
  "HURLS",
  "HURRY",
  "HURTS",
  "HUSKS",
  "HUSKY",
  "HUTCH",
  "HYDRA",
  "HYMNS",
  "HYPED",
  "HYPER",
  "HYPES",
  "ICING",
  "IDEAL",
  "IDEAS",
  "IDIOM",
  "IDIOT",
  "IDLED",
  "IDLER",
  "IDLES",
  "IDOLS",
  "IGLOO",
];

// Game state
let secretWord = "";
let guesses = [];
let currentGuess = "";
let guessNumber = 0;
let wins = 0;
let gameOver = false;

// Initialize game
function initGame() {
  secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  guesses = [];
  currentGuess = "";
  guessNumber = 0;
  gameOver = false;

  renderBoard();
  renderKeyboard();
  document.getElementById("message").textContent = "";
  document.getElementById("message").className = "";
}

// Render board
function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  // Draw past guesses
  for (let row = 0; row < guesses.length; row++) {
    for (let col = 0; col < 5; col++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      const letter = guesses[row][col];
      tile.textContent = letter;

      const status = getLetterStatus(letter, col, guesses[row]);
      tile.classList.add(status);

      board.appendChild(tile);
    }
  }

  // Draw current guess
  for (let col = 0; col < 5; col++) {
    const tile = document.createElement("div");
    tile.className = "tile";

    if (col < currentGuess.length) {
      tile.textContent = currentGuess[col];
      tile.classList.add("active");
    }

    board.appendChild(tile);
  }

  // Draw empty tiles for remaining rows
  const remainingRows = 6 - guessNumber - (currentGuess.length > 0 ? 1 : 0);
  for (let row = 0; row < remainingRows; row++) {
    for (let col = 0; col < 5; col++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      board.appendChild(tile);
    }
  }
}

// Get letter status
function getLetterStatus(letter, position, guess) {
  if (secretWord[position] === letter) {
    return "correct";
  } else if (secretWord.includes(letter)) {
    return "present";
  } else {
    return "absent";
  }
}

// Render keyboard
function renderKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  alphabet.forEach((letter) => {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.textContent = letter;

    // Check if letter was guessed
    let letterStatus = null;
    guesses.forEach((guess) => {
      for (let i = 0; i < 5; i++) {
        if (guess[i] === letter) {
          const status = getLetterStatus(letter, i, guess);
          if (status === "correct" || letterStatus !== "correct") {
            letterStatus = status;
          }
        }
      }
    });

    if (letterStatus) {
      btn.classList.add(letterStatus);
      btn.disabled = true;
    }

    if (!gameOver) {
      btn.addEventListener("click", () => addLetter(letter));
    }

    keyboard.appendChild(btn);
  });
}

// Add letter to current guess
function addLetter(letter) {
  if (currentGuess.length < 5 && !gameOver) {
    currentGuess += letter;
    renderBoard();
  }
}

// Remove last letter
function deleteLetter() {
  if (currentGuess.length > 0) {
    currentGuess = currentGuess.slice(0, -1);
    renderBoard();
  }
}

// Submit guess
function submitGuess() {
  if (currentGuess.length !== 5) return;

  if (!WORDS.includes(currentGuess)) {
    document.getElementById("message").textContent = "Not in word list";
    return;
  }

  guesses.push(currentGuess);
  guessNumber++;

  if (currentGuess === secretWord) {
    gameOver = true;
    wins++;
    document.getElementById("wins").textContent = wins;
    document.getElementById("message").textContent = "YOU WIN!";
    document.getElementById("message").className = "win";
  } else if (guessNumber === 6) {
    gameOver = true;
    document.getElementById("message").textContent =
      `Game Over. Word: ${secretWord}`;
    document.getElementById("message").className = "lose";
  }

  currentGuess = "";
  renderBoard();
  renderKeyboard();
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  const key = e.key.toUpperCase();

  if (/^[A-Z]$/.test(key)) {
    addLetter(key);
  } else if (key === "BACKSPACE") {
    deleteLetter();
  } else if (key === "ENTER") {
    submitGuess();
  }
});

// New Game button
function newGame() {
  initGame();
}

// Start game
initGame();
