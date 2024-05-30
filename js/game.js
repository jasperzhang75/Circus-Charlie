class Game {
  constructor() {
    const pressedKeys = new Set();
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameEndScreen = document.getElementById("game-end");
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
    //   this.fireCircle=[]
    this.fireCircle = new fireCircle(
      this.gameScreen,
      this.gameScreen.offsetWidth,
      180,
      68,
      280,
      "./images/fireCircle2.gif"
    );
    this.winStage = new WinStage(this.gameScreen,
      7500,
      485,
      100,
      83,
      "./images/finalStage.png")
    // this.meter = new Meter(this.gameScreen, 400, 540, 100, 40, 100);
    this.meters = [];
    this.generateMeters();

    this.obstacles = [this.firePot, this.fireCircle];
    this.height = 552;
    this.width = 1024;
    
    this.lives = 3;
    this.generateScore()
    this.gameIsOver = false;
    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60); // 60fps
    this.backgroundPositionX = 0;
    this.backgroundScrollSpeed = 0;
  }
  start() {
    // Set the height and width of the game screen
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    // Hide the start screen
    this.startScreen.style.display = "none";

    // Show the game screen
    this.gameScreen.style.display = "block";

    // Runs the gameLoop on a fequency of 60 times per second. Also stores the ID of the interval.
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);

  }


  gameLoop() {
    console.log("in the game loop");

    this.update();

    // If "gameIsOver" is set to "true" clear the interval to stop the loop
    if (this.gameIsOver) {
      clearInterval(this.gameIntervalId);
    }
  }


  moveBackground(speed) {
    this.backgroundPositionX += speed;
    this.gameScreen.style.backgroundPositionX = `${this.backgroundPositionX}px`;
  }
  update() {
    console.log("in the update");
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

checkWin(){
  const lionBox = this.lion.getBoundingBox();
  const winStageBox = this.winStage.getBoundingBox();

  if (this.isCollision(lionBox, winStageBox)) {
    console.log("Player collision detected!");
    this.handleWin();
  }
}

handleWin() { 
  // this.player.changeImage("./images/clownWin-2.gif");
  // this.lion.changeImage("./images/lionWalk1.png");
  this.player.isInvincible = true;
  
  setTimeout(() => {
    startSound.pause(); // Stop the start sound
    startSound.currentTime = 0; // Reset the start sound to the beginning
    winSound.play(); // Play the win sound
    this.firePot.left = 0;
    this.firePot.stop();
    this.fireCircle.left = 0;
    this.fireCircle.stop();
    this.player.top= 365
    this.lion.top= 435
    this.lion.left= 7550
    this.player.left= 7550
    this.player.changeImage("./images/clownWin-2.gif");
    this.lion.changeImage("./images/lionWalk1.png");
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
    setTimeout(() => {
      this.player.isInvincible = false;
      this.player.changeImage("./images/clownStand.png");
      this.lion.changeImage("./images/lionWalk1.png");
      this.restartGame();
    }, 3200);

    if (this.lives === 0) {
      this.gameIsOver = true;
      console.log("Game Over!");
      
      setTimeout(() => {
        this.startScreen.style.display = "none";
        this.gameScreen.style.display = "none";
        this.gameEndScreen.style.display = "block";
        this.restartGameover();
      }, 3200);
    }
   
  }

  restartGame() {
    console.log("Restarting game...");
    clearInterval(this.gameIntervalId);

    // Reset game state
    startSound.play();
    this.player.left = 200;
    this.player.top = 440;
    this.player.directionX = 0;
    this.player.velocityY = 0;
    this.player.isJumping = false;
    this.player.updatePosition();
    this.player.changeImage("./images/clownStand.png");

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

      
    })

    this.backgroundPositionX = 0;
    this.gameScreen.style.backgroundPositionX = `${this.backgroundPositionX}px`;

    this.gameIsOver = false;
    // this.lives -=1; // Reset lives
    
    // Restart game loop
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }


  restartGameover() {
    console.log("Restarting game...");
    clearInterval(this.gameIntervalId);

    // Reset game state
    startSound.play();
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


    this.fireCircle.left = this.gameScreen.offsetWidth;
    this.fireCircle.updatePosition();

    this.firePot.left = 1050;
    this.firePot.updatePosition();

    this.winStage.left = 7500;
    this.winStage.updatePosition();

    this.meters.forEach((meter, index) => {
      meter.left = 700 + index * 700;
      meter.updatePosition();

      
    })

    this.backgroundPositionX = 0;
    this.gameScreen.style.backgroundPositionX = `${this.backgroundPositionX}px`;

    this.gameIsOver = false;
    // this.lives -=1; // Reset lives
    
    // Restart game loop
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
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

  generateScore(){
    const scoreElement = document.createElement("div");
    scoreElement.id = "score";
    scoreElement.innerHTML = `Lives left: ${this.lives}`
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
