window.addEventListener("message", function (NUI) {
  const data = NUI.data;
  switch (data.Type) {
    case "Math":
      mathSettings.timer = data.timeLimit;
      startMathGame({
        timeLimit: data.timeLimit,
      });
      break;
  }
});

const mathNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  x: (a, b) => a * b,
};

const mathSettings = {
  timer: 300000,
  currentOps: null,
  currentResults: null,
};

function calcLineResult(nums, ops) {
  let result;
  if (ops[1] == "x") {
    result = operators[ops[0]](nums[0], operators[ops[1]](nums[1], nums[2]));
  } else {
    result = operators[ops[1]](operators[ops[0]](nums[0], nums[1]), nums[2]);
  }
  return result;
}

function createMathBoard() {
  let mathEl = "";
  let [inputNum, opNum, answerNum] = Array(3).fill(0);
  $("#math-grid").empty();
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (i == 0 || i == 6) {
        mathEl +=
          j % 2
            ? `<div class="math-grid-item math-answer" data-answer="A${answerNum++}"></div>`
            : `<div class="math-grid-item math-empty"></div>`;
      } else if (i % 2) {
        if (j == 0 || j == 6) {
          mathEl += `<div class="math-grid-item math-answer" data-answer="A${answerNum++}"></div>`;
        } else if (j % 2) {
          mathEl += `<input class="math-grid-item math-input" type="number" data-input="${inputNum++}">`;
        } else {
          mathEl += `<div class="math-grid-item math-op" data-op="${opNum++}"></div>`;
        }
      } else {
        mathEl +=
          j % 2
            ? `<div class="math-grid-item math-op" data-op="${opNum++}"></div>`
            : `<div class="math-grid-item math-empty"></div>`;
      }
    }
  }

  $("#math-grid").append(mathEl);
}

function shuffleNums() {
  let i = mathNumbers.length,
    j,
    temp;

  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    temp = mathNumbers[j];
    mathNumbers[j] = mathNumbers[i];
    mathNumbers[i] = temp;
  }
  return mathNumbers;
}

function randomOps() {
  const ops = Object.keys(operators);
  const opsArr = [];
  for (let i = 0; i < 12; i++) {
    let randomOp = ops[Math.floor(Math.random() * ops.length)];
    opsArr.push(randomOp);
    $(`[data-op="${i}"]`).text(randomOp);
  }

  mathSettings.currentOps = opsArr;
  return opsArr;
}

function calcAllResults(nums, ops, display) {
  // Horizontal Line Calc
  const resultArr = [];
  let answerIndex = 3;
  let opChunk = 0;
  for (let i = 0; i < nums.length; i += 3) {
    let currentAns = calcLineResult(
      nums.slice(i, i + 3),
      ops.slice(opChunk, opChunk + 2)
    );
    if (display) {
      $(`[data-answer="A${answerIndex++}"]`).text(currentAns);
      $(`[data-answer="A${answerIndex++}"]`).text(currentAns);
    }
    resultArr.push(currentAns);
    opChunk += 5;
  }

  // Vertical Line Calc
  answerIndex = 0;
  let chunkIndex = 2;
  for (let i = 0; i < 3; i++) {
    let numArr = nums.filter((_, index) => (index - i) % 3 == 0);
    let currentAns = calcLineResult(numArr, [
      ops[chunkIndex],
      ops[chunkIndex + 5],
    ]);
    if (display) {
      $(`[data-answer="A${answerIndex}"]`).text(currentAns);
      $(`[data-answer="A${answerIndex + 9}"]`).text(currentAns);
    }
    chunkIndex++;
    answerIndex++;
    resultArr.push(currentAns);
  }
  if (display) {
    mathSettings.currentResults = resultArr;
  }
  return resultArr;
}

$(document).on("click", "#MathSubmit", function () {
  const mathInputs = $(".math-input");
  const answerArr = [];
  let win = true;

  mathInputs.each((i, input) => {
    if (input.value != "") {
      answerArr.push(parseInt(input.value));
    }

    if (mathNumbers[i] != input.value) {
      win = false;
    }
  });

  if (!win && answerArr.length == 9) {
    win = true;
    const calculatedResults = calcAllResults(
      answerArr,
      mathSettings.currentOps,
      false
    );

    calculatedResults.every((num, i) => {
      if (num != mathSettings.currentResults[i]) {
        win = false;
        return false;
      } else {
        return true;
      }
    });
  }

  endMathGame(win, "completed");
});

$(document).on("click", "#MathClear", function () {
  const mathInputs = $(".math-input");
  mathInputs.each((i, input) => {
    input.value = "";
  });
});

async function startMathGame(settings) {
  createMathBoard();

  $("#math-timer-bar-inner").css("width", "100%");

  $("#Math").show();

  calcAllResults(shuffleNums(), randomOps(), true);

  await StartCountDown(3, "Math");

  math_running = true;

  $("#math-timer-bar-inner").animate(
    {
      width: "0%",
    },
    {
      duration: settings.timeLimit,
      complete: () => {
        endMathGame(false, "time");
      },
    }
  );

  // startTimeout = setTimeout(() => {
  //   if (activeGame == "math") {
  //     hideScreen();
  //     $("#Math").show();
  //     $("#math-timer-bar-inner").animate(
  //       {
  //         width: "0%",
  //       },
  //       {
  //         duration: settings.timeLimit,
  //         complete: () => {
  //           endMathGame(false, "time");
  //         },
  //       }
  //     );
  //   }
  // }, 4000);
}

function endMathGame(win, reason) {
  if (math_running == false) return;

  $("#math-timer-bar-inner").stop();

  EndMinigame(win, "Math");

  math_running = false;
  mathSettings.currentOps = null;
  mathSettings.currentResults = null;
}

function resetMath() {
  hideScreen();
  $("#math-timer-bar-inner").stop();
  $("#Math").hide();
  mathSettings.currentOps = null;
  mathSettings.currentResults = null;
}
