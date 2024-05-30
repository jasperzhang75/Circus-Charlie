let game; // added

const pressedKeys = new Set();
const startSound = new Audio("./audio/stage1-4.mp3");
const failureSound = new Audio("./audio/failure.mp3");
const winSound = new Audio("./audio/win.mp3");
const selectSound = new Audio("./audio/select.mp3");
const jumpSound = new Audio("./audio/jump.mp3");
startSound.loop = true;

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    selectSound.play()// Add blinking class
    const startText = document.querySelector("#game-intro p");
    startText.classList.add("blink"); 
    setTimeout(() => {
      if (!game) {
        startSound.play();
        startGame();
      } else if (game.gameIsOver) {
        game.restartGameover();
        game.winScreen.style.display = "none";
        game.startScreen.style.display = "none";
        game.gameScreen.style.display = "block";
        game.gameEndScreen.style.display = "none";
      }
      else if (game.gameIsWon) {
        game.restartGameover();
        game.winScreen.style.display = "none";
        game.startScreen.style.display = "none";
        game.gameScreen.style.display = "block";
        game.gameEndScreen.style.display = "none";
      }
    }, 900);
  }
});

function startGame() {
  console.log("start game");
  game = new Game(); // added

  game.start(); // added
}

function restartGame() {
  game = new Game(); // added

  game.restartGameover(); // added
}

function handleKeydown(event) {
  const key = event.key;
  pressedKeys.add(key);
  if (!game.player.isInvincible) {
    if (pressedKeys.has("ArrowRight")) {
      game.player.directionX = 0;
      game.lion.directionX = 0;
      game.backgroundScrollSpeed = -2.5;
      game.fireCircle.speed = -3.4;
      game.firePot.speed = -2.5;
      game.meters.forEach(meter => meter.speed = -2.5);
      game.winStage.speed = -2.5;
    } else if (pressedKeys.has("ArrowLeft")) {
      game.player.directionX = -0;
      game.lion.directionX = -0;
      game.backgroundScrollSpeed = 1.5;
      game.fireCircle.speed = 0.6;
      game.firePot.speed = 1.5;
      game.meters.forEach(meter => meter.speed = 1.5);
      game.winStage.speed = 1.5;
    } else {
      game.player.directionX = 0;
      game.lion.directionX = 0;
      game.backgroundScrollSpeed = 0;
      game.meters.forEach(meter => meter.speed = 0);
      game.winStage.speed = 0;
    }
  } else {
    game.player.directionX = 0;
    game.lion.directionX = 0;
    game.backgroundScrollSpeed = 0;
    game.meters.forEach(meter => meter.speed = 0);
    game.winStage.speed = 0;
  }

  if (pressedKeys.has("ArrowUp")) {
    if (!game.player.isJumping) {
      jumpSound.play();
      game.player.jump();
      game.player.directionX = 0;
      game.lion.directionX = 0;
    }
    if (!game.lion.isJumping) {
      game.lion.jump();
    }
  }
}

function handleKeyup(event) {
  const key = event.key;
  pressedKeys.delete(key);

  // Stop player's and lion's movement when the key is released
  if (!pressedKeys.has("ArrowRight") && !pressedKeys.has("ArrowLeft")) {
    game.player.directionX = 0;
    game.lion.directionX = 0;
    game.backgroundScrollSpeed = 0;
    game.fireCircle.speed = -1;
    game.firePot.speed = 0;
    game.meters.forEach(meter => meter.speed = 0);
    game.winStage.speed = 0;
  }
}

// Add the handleKeydown function as an event listener for the keydown event
window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);