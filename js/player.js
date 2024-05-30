class Player {
  constructor(gameScreen, left, top, width, height, imgSrc) {
    this.gameScreen = gameScreen;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.directionX = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.gravity = 0.5;
    this.jumpStrength = 15;
    this.element = document.createElement("img");
    this.element.src = imgSrc;
    this.element.style.position = "absolute";
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;

    this.gameScreen.appendChild(this.element);
    this.isInvincible = false;
  }

  jump() {
    this.isJumping = true;
    this.velocityY = -this.jumpStrength;
  }

  move() {
    // Update player's car position based on directionX and directionY
    this.left += this.directionX;
    this.top += this.velocityY;

    // Ensure the player's car stays within the game screen

    if (this.isJumping) {
      this.element.src = "./images/clownJump.png";
      this.velocityY += this.gravity; // Apply gravity to velocityY
    }
    if (this.isJumping && this.top >= 440) {
      this.isJumping = false;
      this.velocityY = 0;
      this.top = 440;
      this.element.src = "./images/clownStand.png"; // Reset position after jump
    }
    if (this.left < 10) {
      this.left = 10;
    }
    if (this.top < 10) {
      this.top = 10;
    }
    if (this.left > this.gameScreen.offsetWidth - this.width - 10) {
      this.left = this.gameScreen.offsetWidth - this.width - 10;
    }
    if (this.top > this.gameScreen.offsetHeight - this.height - 10) {
      this.top = this.gameScreen.offsetHeight - this.height - 10;
    }

    // Update the player's car position on the screen
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  getBoundingBox() {
    return this.element.getBoundingClientRect();
  }

  changeImage(imgSrc) {
    this.element.src = imgSrc;
  }
}

class Lion {
  constructor(gameScreen, left, top, width, height, imgSrc) {
    this.gameScreen = gameScreen;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.directionX = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.element = document.createElement("img");
    this.gravity = 0.5;
    this.jumpStrength = 15;
    this.originalSource = imgSrc;
    this.element.src = imgSrc;
    this.element.style.position = "absolute";
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;

    this.counter = 0;
    this.gameScreen.appendChild(this.element);
    
  }

  move(backgroundScrollSpeed) {
    // Update player's car position based on directionX and directionY
    this.left += this.directionX;
    this.top += this.velocityY;
    if (backgroundScrollSpeed !== 0) {
      if (this.counter < 5) {
        this.element.src = "./images/lionWalk1.png";
      } else {
        this.element.src = "./images/lionWalk2.png";
      }
      this.counter++;
      this.counter %= 10;
    } else {
      this.element.src = this.originalSource;
      this.counter = 0;
    }

    // Ensure the player's car stays within the game screen
    if (this.isJumping) {
      this.element.src = "./images/lionJump-2.png";
      this.velocityY += this.gravity; // Apply gravity to velocityY
    }

    if (this.isJumping && this.top >= 500) {
      this.isJumping = false;
      this.velocityY = 0;
      this.top = 505; // Reset position after jump
    }
    if (this.left < 10) {
      this.left = 10;
    }
    if (this.top < 10) {
      this.top = 10;
    }
    if (this.left > this.gameScreen.offsetWidth - this.width - 10) {
      this.left = this.gameScreen.offsetWidth - this.width - 10;
    }
    if (this.top > this.gameScreen.offsetHeight - this.height - 10) {
      this.top = this.gameScreen.offsetHeight - this.height - 10;
    }

    // Update the player's car position on the screen
    this.updatePosition();
  }

  jump() {
    this.isJumping = true;
    this.velocityY = -this.jumpStrength;
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  getBoundingBox() {
    return this.element.getBoundingClientRect();
  }
  changeImage(imgSrc) {
    this.element.src = imgSrc;
  }
}
