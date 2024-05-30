class Obstacle {
    constructor(gameScreen, left, top, width, height, imgSrc) {
        this.gameScreen = gameScreen;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.element = document.createElement("img");
        this.speed = 0; // Speed of the obstacle
        this.element.src = imgSrc;
        this.element.style.position = "absolute";
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;

      this.gameScreen.appendChild(this.element);
    }
  
    updatePosition() {
      // Update the obstacle's position based on the properties left and top
      this.element.style.left = `${this.left}px`;
      this.element.style.top = `${this.top}px`;
    }
  
    move() {
        this.left += this.speed;
        if (this.left < -this.width ) { 
            this.left = this.gameScreen.offsetWidth; // Reset position when it goes off screen
        }
        // Update the obstacle's position on the screen
        this.updatePosition();
    }

 stop(){
  this.left += -90;

  this.updatePosition();
 }
  
      getBoundingBox() {
        return this.element.getBoundingClientRect();
    }
   
  }

  class fireCircle {
    constructor(gameScreen, left, top, width, height, imgSrc) {
        this.gameScreen = gameScreen;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.speed = -1; // Speed of the fire circle
        this.element = document.createElement("img");

        this.element.src = imgSrc;
        this.element.style.position = "absolute";
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
      this.gameScreen.appendChild(this.element);
    }
  
    move() {
      // Move the obstacle down by 3px
      this.left += this.speed;
      if (this.left < -this.width ) {
          this.left = this.gameScreen.offsetWidth; // Reset position when it goes off screen
      }
      // Update the obstacle's position on the screen
      this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
    }

    stop(){
      this.left += -90;
    this.speed = 0;
      this.updatePosition();
     }

    getBoundingBox() {
        return this.element.getBoundingClientRect();
    }
    
  }