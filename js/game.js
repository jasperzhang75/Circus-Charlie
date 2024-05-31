class Game {
  constructor() {
    const pressedKeys = new Set();
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameEndScreen = document.getElementById("game-end");
    this.winScreen = document.getElementById("win");
    this.timerElement = document.getElementById("timer");
    this.player = new Player(
      this.gameScreen,
      200,
      440,
      55,
      80,
      "./images/clownStand.png"
    );
    this.lion = new Lion(
      this.gameScreen,
      180,
      505,
      100,
      60,
      "./images/lionWalk1.png"
    );
    this.firePot = new Obstacle(
      this.gameScreen,
      1050,
      480,
      61,
      89,
      "./images/firePot-2.gif"
    );
    this.fireCircle = new fireCircle(
      this.gameScreen,
      this.gameScreen.offsetWidth,
      180,
      68,
      280,
      "./images/fireCircle2.gif"
    );
    this.winStage = new WinStage(
      this.gameScreen,
      7500,
      485,
      100,
      83,
      "./images/finalStage.png"
    );
    this.meters = [];
    this.generateMeters();
    this.height = 552;
    this.width = 1024;
    this.lives = 3;
    this.generateScore();
    this.gameIsWon = false;
    this.gameIsOver = false;
    this.gameIntervalId;
    this.timerIntervalId= null;
    this.gameLoopFrequency = Math.round(1000 / 60); // 60fps
    this.backgroundPositionX = 0;
    this.backgroundScrollSpeed = 0;
    this.timeLeft = 60;
  }


  start() {
    // Set the height and width of the game screen
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    // Hide the start screen
    this.startScreen.style.display = "none";

    // Show the game screen
    this.gameScreen.style.display = "block";
    this.updateTimerDisplay(); // Add this line
    // Runs the gameLoop on a fequency of 60 times per second. Also stores the ID of the interval.
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
    this.timerIntervalId = setInterval(this.updateTimer.bind(this), 1000); // Add this line
    startSound.play();
  }


  gameLoop() {
    // console.log("in the game loop");

    this.update();

    // If "gameIsOver" is set to "true" clear the interval to stop the loop
    if (this.gameIsOver) {
      clearInterval(this.gameIntervalId);
      clearInterval(this.timerIntervalId); // Add this line

    }
  }

  updateTimer() {
    this.timeLeft -= 1;
    this.updateTimerDisplay();
    if (this.timeLeft <= 0) {
      this.handleTimeout();
    }
  }

  updateTimerDisplay() {
    this.timerElement.innerHTML = `Time left: ${this.timeLeft}s`;
  }

  handleTimeout() {
    this.gameIsOver = true;
    this.handleCollision(); // Trigger game over logic
  }
  moveBackground(speed) {
    this.backgroundPositionX += speed;
    this.gameScreen.style.backgroundPositionX = `${this.backgroundPositionX}px`;
  }

  update() {
    if (!this.player.isInvincible) {
      this.player.move();
      this.lion.move(this.backgroundScrollSpeed);
      this.moveBackground(this.backgroundScrollSpeed);
      this.firePot.move();
      this.checkCollisions();
      this.updateMeters();
      this.winStage.move();
      this.checkWin();
    }
    this.fireCircle.move();
  }


  updateMeters() {
    for (let meter of this.meters) {
      meter.move();
    }
  }


  checkWin() {
    const lionBox = this.lion.getBoundingBox();
    const winStageBox = this.winStage.getBoundingBox();

    if (this.isCollision(lionBox, winStageBox)) {
      console.log("Player collision detected!");
      this.handleWin();
    }
  }


  handleWin() {
    this.player.isInvincible = true;
    clearInterval(this.timerIntervalId); // Add this line

    setTimeout(() => {
      startSound.pause(); // Stop the start sound
      startSound.currentTime = 0; // Reset the start sound to the beginning
      winSound.play(); // Play the win sound
      this.gameIsWon = true;
      this.firePot.left = 0;
      this.firePot.stop();
      this.fireCircle.left = 0;
      this.fireCircle.stop();
      this.player.top = 365;
      this.lion.top = 435;
      this.lion.left = 7550;
      this.player.left = 7550;
      this.player.changeImage("./images/clownWin-2.gif");
      this.lion.changeImage("./images/lionWalk1.png");
      this.winScreen.style.display = "block";
      clearInterval(this.gameIntervalId);
    }, 100);
  }

  checkCollisions() {
    const playerBox = this.player.getBoundingBox();
    const lionBox = this.lion.getBoundingBox();
    const fireCircleBox = this.fireCircle.getBoundingBox();
    const firePotBox = this.firePot.getBoundingBox();

    // Check collision between player and fire pot
    if (
      this.isFirePotCollision(playerBox, firePotBox) ||
      this.isFireCircleCollision(playerBox, fireCircleBox)
    ) {
      console.log("Player collision detected!");
      this.handleCollision();
    }

    // Check collision between lion and fire pot
    if (
      this.isFirePotCollision(lionBox, firePotBox) ||
      this.isFireCircleCollision(lionBox, fireCircleBox)
    ) {
      console.log("Lion collision detected!");
      this.handleCollision();
    }
  }

  isCollision(rect1, rect2) {
    return !(
      rect1.top > rect2.bottom ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right ||
      rect1.right < rect2.left
    );
  }

  isFireCircleCollision(rect1, fireCircleBox) {
    const fireCircleTip = {
      left: fireCircleBox.left + fireCircleBox.width / 3,
      right: fireCircleBox.left + fireCircleBox.width / 3,
      top: fireCircleBox.bottom - 10,
      bottom: fireCircleBox.bottom,
    };

    return this.isCollision(rect1, fireCircleTip);
  }


  isFirePotCollision(rect1, firePotBox) {
    const firePotHalf = {
      left: firePotBox.left + firePotBox.width / 3,
      right: firePotBox.left + firePotBox.width / 3,
      top: firePotBox.bottom - 10,
      bottom: firePotBox.bottom,
    };
    return this.isCollision(rect1, firePotHalf);
  }


  handleCollision() {
    if (this.player.isInvincible) {
      return;
    }
    startSound.pause(); // Stop the start sound
    startSound.currentTime = 0; // Reset the start sound to the beginning
    failureSound.play(); // Play the failure sound
    this.player.isInvincible = true;
    this.lives -= 1;
    this.updateScore();
    this.player.changeImage("./images/clownDie-2.png");
    this.lion.changeImage("./images/lionDie-2.png");
    if (this.lives) {
      setTimeout(() => {
        this.player.isInvincible = false;
        this.player.changeImage("./images/clownStand.png");
        this.lion.changeImage("./images/lionWalk1.png");
        this.restartGame();
      }, 3200);
    } else {
      this.gameIsOver = true;
      clearInterval(this.timerIntervalId); // Add this line

      console.log("Game Over!");

      setTimeout(() => {
        this.startScreen.style.display = "none";
        this.gameScreen.style.display = "none";
        this.gameEndScreen.style.display = "block";
        // this.restartGameover();
      }, 3200);
    }
  }


  restartGame() {
    console.log("Restarting game...");
    clearInterval(this.gameIntervalId);
    clearInterval(this.timerIntervalId); // Add this line

    // Reset game state
    startSound.play();
    this.player.left = 200;
    this.player.top = 440;
    this.player.directionX = 0;
    this.player.velocityY = 0;
    this.player.isJumping = false;
    this.player.updatePosition();
    this.player.changeImage("./images/clownStand.png");
    this.timeLeft = 60; // Reset the timer
    this.updateTimerDisplay();
    this.lion.left = 180;
    this.lion.top = 505;
    this.lion.directionX = 0;
    this.lion.velocityY = 0;
    this.lion.isJumping = false;
    this.lion.updatePosition();
    this.lion.changeImage("./images/lionWalk1.png");

    this.fireCircle.left = this.gameScreen.offsetWidth;
    this.fireCircle.updatePosition();

    this.firePot.left = 1050;
    this.firePot.updatePosition();

    this.winStage.left = 7500;
    this.winStage.updatePosition();

    this.meters.forEach((meter, index) => {
      meter.left = 700 + index * 700;
      meter.updatePosition();
    });

    this.backgroundPositionX = 0;
    this.gameScreen.style.backgroundPositionX = `${this.backgroundPositionX}px`;

    this.gameIsOver = false;
    // this.lives -=1; // Reset lives

    // Restart game loop
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
    this.timerIntervalId = setInterval(this.updateTimer.bind(this), 1000); // Restart the timer

  }

  restartGameover() {
    console.log("Restarting game...");
    clearInterval(this.gameIntervalId);
    clearInterval(this.timerIntervalId); // Add this line

    // Reset game state
    startSound.play();
    this.player.isInvincible = false;
    this.player.left = 200;
    this.player.top = 440;
    this.player.directionX = 0;
    this.player.velocityY = 0;
    this.player.isJumping = false;
    this.player.updatePosition();
    this.player.changeImage("./images/clownStand.png");
    this.lives = 3; // Reset lives
    this.updateScore();
    this.lion.left = 180;
    this.lion.top = 505;
    this.lion.directionX = 0;
    this.lion.velocityY = 0;
    this.lion.isJumping = false;
    this.lion.updatePosition();
    this.lion.changeImage("./images/lionWalk1.png");
    this.timeLeft = 60; // Reset the timer
    this.updateTimerDisplay(); // Update the timer display
    this.fireCircle.left = this.gameScreen.offsetWidth;
    this.fireCircle.updatePosition();

    this.firePot.left = 1050;
    this.firePot.updatePosition();

    this.winStage.left = 7500;
    this.winStage.updatePosition();

    this.meters.forEach((meter, index) => {
      meter.left = 700 + index * 700;
      meter.updatePosition();
    });

    this.backgroundPositionX = 0;
    this.gameScreen.style.backgroundPositionX = `${this.backgroundPositionX}px`;

    this.gameIsOver = false;
    // Restart game loop
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
    this.timerIntervalId = setInterval(this.updateTimer.bind(this), 1000); // Restart the timer
  }
  
  generateMeters() {
    const meterSpacing = 700; // Adjust spacing between meters as needed
    let distance = 100;

    for (let i = 0; i < 10; i++) {
      const meter = new Meter(
        this.gameScreen,
        700 + i * meterSpacing,
        540,
        100,
        40,
        distance
      );
      distance -= 10;
      this.meters.push(meter);
    }
  }

  generateScore() {
    const scoreElement = document.createElement("div");
    scoreElement.id = "score";
    scoreElement.innerHTML = `Lives left: ${this.lives}`;
    scoreElement.style.position = "absolute";
    scoreElement.style.top = "10px";
    scoreElement.style.right = "10px";
    scoreElement.style.top = "43px";
    scoreElement.style.color = "white";
    scoreElement.style.fontSize = "30px";
    scoreElement.style.textAlign = "center";
    scoreElement.style.backgroundColor = "black";
    scoreElement.style.border = "5px solid lightblue";
    scoreElement.style.fontFamily = "ArcadeClassic";
    scoreElement.style.zIndex = "1000";
    scoreElement.style.padding = "5px";

    this.gameScreen.appendChild(scoreElement);
  }

  updateScore() {
    const scoreElement = document.getElementById("score");
    scoreElement.innerHTML = `Lives left: ${this.lives}`;
  }
}
