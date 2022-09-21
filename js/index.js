// GAME CONSTANTS & VARIABLES
let inputDir = {
  x: 0,
  y: 0
};
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");
const speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{
  x: 13,
  y: 15
}];
let food = {
  x: 6,
  y: 7
};

// GAME FUNCTIONS (loop)
function main(currentTime) {
  window.requestAnimationFrame(main);
  // this refreshes frame every ms

  // to control fps
  if ((currentTime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = currentTime;

  gameEngine();
}

function gameEngine() {
  onCollision();
  onEating();
  snakeMove();

  // Display the snake
  board.innerHTML = "";
  snakeArr.forEach((element, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = element.y;
    snakeElement.style.gridColumnStart = element.x;
    if (index === 0) {
      snakeElement.classList.add("snake-head");
    } else {
      snakeElement.classList.add("snake-body");
    }
    board.appendChild(snakeElement);
  });


  // Display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

function isCollide(snake) {
  // if snake bumps into itself
  // start from i=0, coz head at 0 can only collide into i=1 onwards
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // if snake bumps into walls
  // we have a grid from 0-18, so check to see if snake head ever goes beyond 0 or 18 on x or y axis
  if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
    return true;
  }
}

function onCollision() {
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = {
      x: 0,
      y: 0
    };
    alert("Game Over! Press OK to restart.");

    snakeArr = [{
      x: 13,
      y: 15
    }]; //reset snakeArr(initial position of snake) after user presses OK to restart
    score = 0;
    scoreCard.innerHTML = "Score: " + score;
  }
}

function onEating() {
  // if you have eaten the food, increment the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score++;
    scoreCard.innerHTML = "Score: " + score;
    if (score > hiScoreVal) {
      hiScoreVal = score;
      // can only set value as string so used json.stringify
      localStorage.setItem("hiScore", JSON.stringify(hiScoreVal));
      hiScoreCard.innerHTML = "High Score: " + hiScoreVal;
    }

    // unshift adds one or more elements to beginning of an array, so
    // this adds another segment to snake body, after the head element, i.e after index 0
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y
    });

    // to generate random location for food after it was eaten
    let a = 2;
    let b = 16;
    food = {
      x: Math.floor(Math.random() * (b - a) + a),
      y: Math.floor(Math.random() * (b - a) + a)
    }
  }
}

function snakeMove() {
  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    // new object using destructuring created for new position of snake
    snakeArr[i + 1] = {
      ...snakeArr[i]
    };
  }

  // to move the element(head) that was at index 0
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;
}

// MAIN LOGIC STARTS HERE
let hiScore = localStorage.getItem("hiScore");
if (hiScore === null) {
  hiScoreVal = 0;
  // can only set value as string so used json.stringify
  localStorage.setItem("hiScore", JSON.stringify(hiScoreVal));
} else {
  hiScoreVal = JSON.parse(hiScore);
  hiScoreCard.innerHTML = "High Score: " + hiScore;
}

window.requestAnimationFrame(main);
// this function accepts another function that takes the timestamp in the parameter


window.addEventListener("keydown", e => {
  musicSound.play();

  // Game starts on key press
  inputDir = {
    x: 0,
    y: 1
  }; //snake starts moving downwards, i.e in y direction
  moveSound.play();

  switch (e.key) {
    case "ArrowUp":
      console.log("ArrowUp");
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowDown":
      console.log("ArrowDown");
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case "ArrowLeft":
      console.log("ArrowLeft");
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    case "ArrowRight":
      console.log("ArrowRight");
      inputDir.x = 1;
      inputDir.y = 0;
      break;
    default:

  }
});

// can run localStorage.clear method in console to clear values stored in it
