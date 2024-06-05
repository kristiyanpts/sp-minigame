let timer_start_untangle,
  timer_finish_untangle,
  timer_hide_untangle,
  timer_time_untangle,
  speed_untangle,
  timerStart_untangle;
let game_started = false;
let dot_size = 10;
let canvas = document.getElementById("untangle-canvas");
let ctx = canvas.getContext("2d");

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Set the canvas size
canvas.width = 500;
canvas.height = 500;

let amountOfDots;
let selectedDot = null; // Keeps track of the selected dot, if any.
let offset = { x: 0, y: 0 }; // Keeps track of the offset between the mouse position and the selected dot.

let dots = [];
let lines = [];

let intersections = [];

function createDots() {
  let radius = 200;
  let centerX = 250;
  let centerY = 250;
  dots = [];

  for (let i = 0; i < amountOfDots; i++) {
    dots.push({
      x: Math.floor(
        centerX + radius * Math.cos((2 * Math.PI * i) / amountOfDots)
      ),
      y: Math.floor(
        centerY + radius * Math.sin((2 * Math.PI * i) / amountOfDots)
      ),
    });
  }
}

function createLines() {
  lines = [];
  let limit = new Array(dots.length).fill(0);
  let max_connects = 4;
  let finish = false;
  let tries = 0;
  while (finish === false) {
    tries += 1;

    if (tries > 100) {
      limit = new Array(dots.length).fill(0);
      lines = [];
      tries = 0;
    }

    let from = random(0, dots.length);
    let to = random(0, dots.length);
    if (from === to) {
      continue;
    }
    if (limit[from] === max_connects || limit[to] === max_connects) {
      continue;
    }
    if (lines.filter((el) => el.start === from && el.end === to).length > 0) {
      continue;
    }
    if (lines.filter((el) => el.start === to && el.end === from).length > 0) {
      continue;
    }
    limit[from] += 1;
    limit[to] += 1;

    lines.push({
      start: from,
      end: to,
    });

    finish = true;
    limit.forEach((num) => {
      if (num < 2) finish = false;
    });
  }
}

function drawDots() {
  ctx.fillStyle = "#38a2e5";
  dots.forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot_size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function redraw() {
  // Clear the canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Redraw the lines.
  drawLines();
  // Redraw the dots.
  drawDots();
}
function getLineDot(index) {
  return dots[index];
}

function detectIntersects() {
  intersections = [];
  lines.forEach((line) => (line.intersecting = null));
  // Detect intersecting lines
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const line1 = lines[i];
      const line2 = lines[j];

      // Calculate intersection point (if it exists)
      let intersection = getIntersection(
        getLineDot(line1.start).x,
        getLineDot(line1.start).y,
        getLineDot(line1.end).x,
        getLineDot(line1.end).y,
        getLineDot(line2.start).x,
        getLineDot(line2.start).y,
        getLineDot(line2.end).x,
        getLineDot(line2.end).y
      );
      const linepoints = [
        getLineDot(line1.start),
        getLineDot(line1.end),
        getLineDot(line2.start),
        getLineDot(line2.end),
      ];
      if (
        intersection != null &&
        linepoints.some(
          (item) => item.x === intersection.x && item.y === intersection.y
        )
      ) {
        intersection = null;
      }
      if (intersection) {
        intersections.push(intersection);
      }
      // if (intersection) {
      //     ctx.fillStyle = 'blue';
      //     ctx.beginPath();
      //     ctx.arc(intersection.x, intersection.y, 9, 0, Math.PI * 2);
      //     ctx.fill();

      // }

      // If there is an intersection, mark both lines as intersecting
      if (intersection != null) {
        line1.intersecting = true;
        line2.intersecting = true;
      }
    }
  }
}

function drawLines() {
  detectIntersects();
  // Draw lines
  ctx.strokeStyle = "#38a2e5";
  ctx.lineWidth = 2;
  lines.forEach((line) => {
    const { start, end } = line;
    ctx.beginPath();
    ctx.moveTo(getLineDot(start).x, getLineDot(start).y);
    ctx.lineTo(getLineDot(end).x, getLineDot(end).y);
    if (line.intersecting) {
      ctx.strokeStyle = "red";
    } else {
      ctx.strokeStyle = "#38a2e5";
    }
    ctx.stroke();
  });
}

// Helper function to calculate intersection point of two lines
function getIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  const det1 = (x1 - x2) * (y3 - y4);
  const det2 = (y1 - y2) * (x3 - x4);
  const det = det1 - det2;
  if (det === 0) {
    // Lines are parallel
    return null;
  }
  const x =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / det;
  const y =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / det;
  if (
    x < Math.min(x1, x2) ||
    x > Math.max(x1, x2) ||
    y < Math.min(y1, y2) ||
    y > Math.max(y1, y2)
  ) {
    return null;
  }
  if (
    x < Math.min(x3, x4) ||
    x > Math.max(x3, x4) ||
    y < Math.min(y3, y4) ||
    y > Math.max(y3, y4)
  ) {
    return null;
  }
  return { x: x, y: y };
}

const sleep = (ms, fn) => {
  return setTimeout(fn, ms);
};

function addListeners() {
  // Options
  // Options
  // document.querySelector('#showIntersections').addEventListener('input', function(){
  //     resetUntangle();
  // });
  // Resets
  canvas.addEventListener("mousedown", (e) => {
    // Loop through all the dots to see if the mouse is inside one of them.
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const dx = e.offsetX - dot.x;
      const dy = e.offsetY - dot.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= dot_size) {
        selectedDot = dot;
        offset.x = dx;
        offset.y = dy;
        break;
      }
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    // If a dot is currently selected, move it to the new mouse position.
    if (selectedDot !== null) {
      selectedDot.x = e.offsetX - offset.x;
      selectedDot.y = e.offsetY - offset.y;
      redraw(); // Redraw the dots and lines.
    }
  });

  canvas.addEventListener("mouseup", () => {
    // Deselect the dot when the mouse button is released.
    selectedDot = null;
    check();
  });
}

async function check(timeout) {
  if (intersections.length === 0) {
    if (!timeout) {
      await EndMinigame(true, "Untangle");
      canvas = document.getElementById("untangle-canvas");
      ctx = canvas.getContext("2d");
      resetUntangle();
      document.querySelector(".minigame-untangle").classList.add("hidden");
      document.querySelector(".untanglecanvas").classList.add("hidden");
    }
  } else if (timeout) {
    await EndMinigame(false, "Untangle");
    canvas = document.getElementById("untangle-canvas");
    ctx = canvas.getContext("2d");
    resetUntangle();
    document.querySelector(".minigame-untangle").classList.add("hidden");
    document.querySelector(".untanglecanvas").classList.add("hidden");
  }
}

function resetUntangle() {
  $(".minigame-untangle").fadeOut();
  game_started = false;
  stopTimer();
  clearTimeout(timer_start_untangle);
  clearTimeout(timer_hide_untangle);
  clearTimeout(timer_finish_untangle);

  document.querySelector(".untanglecanvas").classList.add("hidden");
}

async function startUntangle() {
  // showIntersections = document.querySelector('#showIntersections').checked;

  $("#Untangle").show();
  $(".minigame-untangle").fadeIn();
  document.querySelector(".untanglecanvas").classList.remove("hidden");

  await StartCountDown(3, "Untangle");
  canvas = document.getElementById("untangle-canvas");
  ctx = canvas.getContext("2d");

  // Clear the canvas.

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  intersections = [];

  addListeners();

  while (intersections < 1) {
    createDots();
    createLines();
    drawLines();
    drawDots();
  }

  game_started = true;
  startTimerUntangle();
  timer_finish_untangle = sleep(speed_untangle * 1000, function () {
    check(true);
  });
}

function startTimerUntangle() {
  timerStart_untangle = new Date();
  timer_time_untangle = setInterval(timerUntangle, 1);
}

function timerUntangle() {
  let timerNow = new Date();
  let timerDiff = new Date();
  timerDiff.setTime(timerNow - timerStart_untangle);
  let ms = timerDiff.getMilliseconds();
  let sec = timerDiff.getSeconds();

  $(".timer-untangle-fill").css(
    "width",
    `${(100 - ((sec * 1000 + ms) / (speed_untangle * 1000)) * 100).toFixed(2)}%`
  );
}

function stopTimer() {
  clearInterval(timer_time_untangle);
}

function resetTimer() {
  clearInterval(timer_time_untangle);
}

window.addEventListener("message", function (NUI) {
  const data = NUI.data;
  switch (data.Type) {
    case "Untangle":
      amountOfDots = 7;
      if (data.dots != null) {
        amountOfDots = data.dots;
      }
      speed_untangle = 15;
      if (data.timeLimit != null) {
        speed_untangle = data.timeLimit;
      }

      startUntangle();
      break;
  }
});
