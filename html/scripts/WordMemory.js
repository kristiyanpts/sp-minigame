let click = false;
let time = 0;
let totalTimeWord = 0;
let seenWords = [];
let wordsList = [
  "Happy",
  "Joyful",
  "Cheerful",
  "Content",
  "Delighted",
  "Pleased",
  "Glad",
  "Blissful",
  "Merry",
  "Jubilant",
  "Elated",
  "Ecstatic",
  "Satisfied",
  "Thrilled",
  "Gleeful",
  "Exuberant",
  "Radiant",
  "Buoyant",
  "Grateful",
  "Chipper",
  "Bliss",
  "Serenity",
  "Tranquil",
  "Calm",
  "Peaceful",
  "Restful",
  "Relaxed",
  "Placid",
  "Untroubled",
  "Easygoing",
  "Carefree",
  "Laid-back",
  "Unworried",
  "Careless",
  "Unconcerned",
  "Sanguine",
  "Upbeat",
  "Optimistic",
  "Hopeful",
  "Positive",
  "Confident",
  "Assured",
  "Bright",
  "Encouraged",
  "Sunny",
  "Enthusiastic",
  "Passionate",
  "Zealous",
  "Fervent",
  "Ardent",
  "Excited",
  "Animated",
  "Spirited",
  "Lively",
  "Energetic",
  "Vigorous",
  "Dynamic",
  "Robust",
  "Active",
  "Vital",
  "Alert",
  "Attentive",
  "Watchful",
  "Observant",
  "Perceptive",
  "Aware",
  "Cognizant",
  "Mindful",
  "Conscientious",
  "Considerate",
  "Thoughtful",
  "Reflective",
  "Contemplative",
  "Meditative",
  "Pensive",
  "Introspective",
  "Insightful",
  "Wise",
  "Judicious",
  "Prudent",
  "Shrewd",
  "Astute",
  "Sagacious",
  "Intelligent",
  "Clever",
  "Smart",
  "Sharp",
  "Quick-witted",
  "Resourceful",
  "Inventive",
  "Creative",
  "Imaginative",
  "Innovative",
  "Ingenious",
  "Original",
  "Unique",
  "Distinctive",
  "Unconventional",
  "Eccentric",
  "Quirky",
];

let words = [];
let interval = null;
let currentWord = "";

function getRandomElements(arr, n) {
  // If n is 0 or less, or if the array is empty, return an empty array
  if (n <= 0 || arr.length === 0) {
    return [];
  }

  // If n is greater than the array length, shuffle and return the entire array
  if (n >= arr.length) {
    return shuffleArray(arr.slice()); // Use a copy to avoid modifying the original array
  }

  // Shuffle array and pick the first n elements
  let shuffled = shuffleArray(arr.slice());
  return shuffled.slice(0, n);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Random index from 0 to i
    let j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

window.addEventListener("message", function (NUI) {
  const data = NUI.data;
  switch (data.Type) {
    case "WordMemory":
      time = data.timeLimit;
      totalTimeWord = data.timeLimit;
      words = getRandomElements(wordsList, data.words);
      startWordMemory();
      break;
  }
});

async function startWordMemory() {
  $("#WordMemory").show();
  $("#WordMemory").css("display", "flex");

  await StartCountDown(3, "WordMemory");

  let worddd = getRandomWord();

  $(".center-text").text(worddd);
  seenWords.length = 0;
  $(".score-text").text(seenWords.length + "/" + words.length);
  seenWords = [];
  click = false;
  clearInterval(interval);

  startTimer();
}

async function endWordMemory(didWin) {
  EndMinigame(didWin, "WordMemory");
  seenWords = [];
  time = 0;
  totalTimeWord = 0;
  click = false;
  currentWord = "";
  clearInterval(interval);
}

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex];
  return words[randomIndex];
}

function startTimer() {
  interval = setInterval(async () => {
    time -= 0.1;
    $(".timer-word-fill").css("width", `${(time / totalTimeWord) * 100}%`);

    if (time <= 0) {
      endWordMemory(false);
    }
  }, 100);
}

$(document).on("click", "#new", async function (e) {
  if (seenWords.length == 0) {
    $(".score-text").text(seenWords.length + 1 + "/" + words.length);
    seenWords.push(currentWord);
  } else {
    if (seenWords.includes(currentWord)) {
      endWordMemory(false);
      return;
    }

    $(".score-text").text(seenWords.length + 1 + "/" + words.length);
    seenWords.push(currentWord);
  }

  if (seenWords.length === words.length) {
    endWordMemory(true);
    return;
  }

  let randomWord = getRandomWord();
  $(".center-text").text(randomWord);
});

$(document).on("click", "#seen", async function (e) {
  if (!seenWords.includes(currentWord)) {
    endWordMemory(false);
    return;
  }

  $(".score-text").text(seenWords.length + 1 + "/" + words.length);
  seenWords.push("random-word-123");

  if (seenWords.length === words.length) {
    endWordMemory(true);
    return;
  }

  let newWord = getRandomWord();
  $(".center-text").text(newWord);
});
