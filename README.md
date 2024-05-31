
# Circus Charlie Game

Circus Charlie is a simple, fun, and nostalgic game where you control a clown and a lion performing circus tricks. The goal is to navigate through obstacles and reach the end stage while avoiding collisions. The game includes several features such as jumping, moving left and right, and varying obstacles.

[Try the game](https://jasperzhang75.github.io/circus-charlie/) 

## Table of Contents

Features
Installation
Usage
Game Controls
File Structure
Credits
License

## Features
- Time Constraint: Finish the game in pre-set time frame.
- Obstacle Interaction: Avoid fire pots and jump through fire circles.
- Win and Game Over Screens: Dedicated screens for game over and winning scenarios.
- Sound Effects: Includes background music and sound effects for jumping, winning, and failing.

## Installation

1. Clone the repository:
``` git clone https://github.com/your-username/circus-charlie.git ```

2. Navigate to the project directory:

     ``` cd circus-charlie ```
## Usage

Open index.html in your browser to start the game.

## Game Controls

- Start Game: Press Enter
- Move Left: Press ⬅️ (Left Arrow)
- Move Right: Press ➡️ (Right Arrow)
- Jump: Press ⬆️ (Up Arrow)

## File Structure

```
circus-charlie/
├── audio/
│   ├── failure.mp3
│   ├── jump.mp3
│   ├── select.mp3
│   ├── stage1-4.mp3
│   └── win.mp3
├── css/
│   └── style.css
├── images/
│   ├── CircusCharlie_logo.png
│   ├── clownDie-2.png
│   ├── clownJump.png
│   ├── clownStand.png
│   ├── clownWin-2.gif
│   ├── fireCircle2.gif
│   ├── firePot-2.gif
│   ├── finalStage.png
│   ├── lionDie-2.png
│   ├── lionJump-2.png
│   ├── lionWalk1.png
│   ├── lionWalk2.png
│   ├── stage01.png
│   └── win.gif
├── js/
│   ├── game.js
│   ├── main.js
│   ├── meter.js
│   ├── obstacle.js
│   ├── player.js
│   └── winstage.js
└── index.html
```
### File Descriptions
- index.html: The main HTML file that includes the game layout and references to the CSS and JS files.
- css/style.css: Contains the styles for the game.
- js/: Contains all the JavaScript files for the game logic:
 - game.js: Main game class handling the game loop and core functionality.
- main.js: Initializes and starts the game, and handles key events.
- meter.js: Handles the meter elements in the game.
- obstacle.js: Defines the Obstacle and fireCircle classes.
- player.js: Defines the Player and Lion classes.
- winstage.js: Handles the win stage functionality.
- images/: Contains all the image assets for the game.
- audio/: Contains all the audio assets for the game.
## Credits

- Game Development: Jasper Zhang
- Sound Effects and Music: Various sources

## License

This project is licensed under the MIT License. See the LICENSE file for details.