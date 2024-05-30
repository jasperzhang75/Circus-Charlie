class Meter {
    constructor(gameScreen, left, top, width, height, distance) {
        this.gameScreen = gameScreen;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.distance = distance;
        this.element = document.createElement("p");

this.speed = 0; // Speed of the obstacle
        this.element.textContent = `${this.distance} M`;
        this.element.style.backgroundColor = "black";
        this.element.style.fontSize = "40px";
        this.element.style.textAlign = "center";
        this.element.style.fontFamily = "ArcadeClassic";
        this.element.style.color = "white";
        this.element.style.border = "5px solid red";
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

       
        this.updatePosition();
    }
}