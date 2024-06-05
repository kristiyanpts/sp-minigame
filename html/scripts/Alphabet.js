let timeLeft = 10;
let totalTime = 10;
let totalLetters = 6;

window.addEventListener("message", function (NUI) {
  const data = NUI.data;
  switch (data.Type) {
    case "Alphabet":
      timeLeft = data.time;
      totalTime = data.time;
      totalLetters = data.amount > 18 ? 18 : data.amount;
      setupGame();
      break;
  }
});

const letters = "qwerasd";
let userInput = "";
let timer;
let keyIsPressed = false;

async function setupGame() {
  $("#Alphabet").show();

  resetAlphabetGame(); // Clear the previous game state
  generateLetters(); // Generate new letters
  updateDisplay(); // Update the display

  await StartCountDown(3, "Alphabet");

  alphabet_running = true;

  // Setup initial event listeners
  //document.getElementById('start-button').addEventListener('click', startGame);
  document.addEventListener("keypress", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp); // Added keyup event listener

  startGame();
}

function startGame() {
  //document.getElementById('start-button').disabled = true;

  //   resetAlphabetGame(); // Clear the previous game state
  //   generateLetters(); // Generate new letters
  //   updateDisplay(); // Update the display

  timer = setInterval(function () {
    timeLeft -= 0.1;
    document.getElementById("timer-fill").style.width =
      (timeLeft / totalTime) * 100 + "%";

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 100);

  // document.addEventListener("keydown", handleKeyDown);
}

function generateLetters() {
  document.getElementById("row1").innerHTML = "";
  document.getElementById("row2").innerHTML = "";
  document.getElementById("row3").innerHTML = "";

  for (let i = 0; i < totalLetters; i++) {
    let row = Math.floor(Number(i / 6));
    if (i == 0) row = 0;
    console.log(row, i / 6, i);
    document
      .getElementById(`row${row + 1}`)
      .appendChild(createCharacterContainer(getRandomLetter()));
    // document
    //   .getElementById("row2")
    //   .appendChild(createCharacterContainer(getRandomLetter()));
  }

  //   for (let i = 0; i < 6; i++) {
  //     document
  //       .getElementById("row1")
  //       .appendChild(createCharacterContainer(getRandomLetter()));
  //     document
  //       .getElementById("row2")
  //       .appendChild(createCharacterContainer(getRandomLetter()));
  //   }

  //   for (let i = 0; i < 3; i++) {
  //     document
  //       .getElementById("row3")
  //       .appendChild(createCharacterContainer(getRandomLetter()));
  //   }
}

function createCharacterContainer(character) {
  const container = document.createElement("div");
  container.classList.add("character-container");
  container.innerText = character.toUpperCase();
  return container;
}

function getRandomLetter() {
  return letters[Math.floor(Math.random() * letters.length)];
}

function updateDisplay() {
  document.getElementById("timer-fill").style.width = "100%";
}

function endGame(success) {
  clearInterval(timer);
  //   displayOutcome(success);

  EndMinigame(success, "Alphabet");

  alphabet_running = false;

  //   setTimeout(function () {
  //     document.body.style.display = "none";
  //   }, 2000);
  //   document.removeEventListener("keydown", handleKeyDown);
}

function resetAlphabetGame() {
  clearInterval(timer); // Clear the timer
  document.getElementById("timer-fill").style.width = "0%"; // Reset the timer bar width
  userInput = "";
}

function handleKeyDown(event) {
  if (alphabet_running == false) return;

  const pressedKey = event.key.toLowerCase();

  console.log(event.key);

  // Check if the key is already pressed
  if (keyIsPressed || !letters.includes(pressedKey)) {
    return;
  }

  keyIsPressed = true;

  userInput += pressedKey;
  checkInput();
}

function handleKeyUp(event) {
  if (alphabet_running == false) return;

  keyIsPressed = false;
}

function checkInput() {
  const characterContainers = document.querySelectorAll(".character-container");
  const lastTypedIndex = userInput.length - 1;

  if (
    characterContainers[lastTypedIndex].innerText.toLowerCase() ===
    userInput[lastTypedIndex]
  ) {
    characterContainers[lastTypedIndex].classList.add("correct");
  } else {
    characterContainers[lastTypedIndex].classList.add("incorrect");
    endGame(false);

    return;
  }

  if (userInput.length === totalLetters) {
    clearInterval(timer);
    endGame(true);
    //document.getElementById('start-button').disabled = false;
    // document.removeEventListener("keydown", handleKeyDown);
  }
}
