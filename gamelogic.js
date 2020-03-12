var canvas, ctx, width, height;
var totalBalls = 5;
var totalOpponents = 3;
// Game State
/* States
0 - Start Screen
1 - Help Overlay
3- Game Over win
4 - Game over Lose
10 - Game Mode
11 - reset scores
*/
var gameState = 1;

var scoreToWin = 50;
var backgroundImage= new Image();
backgroundImage.src ="./assets/checkeredbg.svg"
// vars for counting frames/s, used by the measureFPS function
var frameCount = 0;
var lastTime;
var fpsContainer;
var fps;
var winner = 0;

// vars for handling inputs
var inputStates = {};


// array of balls to animate
var ballArray = [];

//Sounds
var bounceSound;
var throwSound;
var hitSound;
var getHitSound;

//Array of enemies
var opponentArray = [];
var collisionConstant = 5;

// ObstacleMap
var obstacles = [
  [60,30,30,80],
  [220,30,30,80],
  [120,60,70,20]
];
// var obstacles = [
//   [120,60,70,20]
// ];

// Inits
window.onload = function init() {
  // Canvas, context etc.
  canvas = document.querySelector("#myCanvas");

  // often useful
  width = canvas.width;
  height = canvas.height;

  // important, we will draw with this object
  ctx = canvas.getContext('2d');
  // default police for text
  ctx.font = "20px Arial";

  // For motion Controls
  if(window.DeviceMotionEvent){
    window.addEventListener("devicemotion", motion, false);
  }else{
    console.log("DeviceMotionEvent is not supported");
  }

  bounceSound = document.getElementById("bounceSound");
  throwSound = document.getElementById("throwSound");
  hitSound = document.getElementById("hitSound");
  getHitSound = document.getElementById("getHitSound");

  var game = new GF();
  game.start();
};

function motion(event){
  inputStates.xMotion = event.accelerationIncludingGravity.x;
  inputStates.yMotion = event.accelerationIncludingGravity.x;
}

function measureFPS(newTime) {

  // test for the very first invocation
  if (lastTime === undefined) {
    lastTime = newTime;
    return;
  }

  //calculate the difference between last & current frame
  var diffTime = newTime - lastTime;

  if (diffTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = newTime;
  }

  //and display it in an element we appended to the
  // document in the start() function
  fpsContainer.innerHTML = 'FPS: ' + (fps - 1);
  frameCount++;
};

// clears the canvas content
function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

function drawObstacles(){
  ctx.fillStyle = 'black';
  for (var i = 0; i < obstacles.length; i++){
    wallx = obstacles[i];
    ctx.fillRect(wallx[0],wallx[1],wallx[2],wallx[3])
  }
  // ctx.restore();
}

function newGame() {
  player.score = 0;
  opponentArray = [];
  ballArray = [];
  createBalls(totalBalls);
  createOpponents(totalOpponents);
  gameState = 10;
}

// Function that is controls most functions in the game
function gamePlay() {
  // Check if the game is Over
  // if(player.score>50){
  //   requestAnimationFrame(gameOverWin);
  // }

  // Draw background
  ctx.globalAlpha = 0.1;
  ctx.drawImage(backgroundImage,0,0,width,height);
  ctx.globalAlpha =1;
  // draw the player
  drawMyplayer(player.x, player.y);

  // Draw obstacles
  drawObstacles();

  // Check inputs and move the player
  updateplayerPosition();
  moveWith2(player)
  testCharacterWallCollision(player);
  testCharacterOpponentCollision(player);
  testCharacterObstacleCollision(player);

  if (player.score >= scoreToWin) {
    gameState = 3;
    winner = -1;
  }

  //Checks movements of opponents
  for (var i = 0; i < opponentArray.length; i++) {
    var opponent = opponentArray[i];
    testCharacterWallCollision(opponent);
    testCharacterOpponentCollision(opponent);
    testCharacterObstacleCollision(opponent);
    // moveWith2(opponent);
    // if(opponent.score>50){
    //   requestAnimationFrame(gameOverLose);
    // }
    if (opponent.score >= scoreToWin) {
      gameState = 4;
      winner = i;
    }
    opponent.move(i);
    opponent.draw();
  }

  for (var i = 0; i < ballArray.length; i++) {
    var ball = ballArray[i];

    // 1) move the ball
    ball.move();

    // 2) test if the ball collides
    if(testCollisionWithWalls(ball)){
      bounceSound.play();
    }
    if(collisionReaction(player, ball, i)){
      getHitSound.play();
    }
    if(testCollisionWithObstacles(ball)){
      bounceSound.play();
    }

    for (var k = 0; k < opponentArray.length; k++) {
      var opponent = opponentArray[k];

     if(collisionReaction(opponent, ball, i)){
       hitSound.play();
     }
      // console.log(opponent.stance);
    }
    // 3) draw the ball
    ball.draw();
  }

}

// GAME FRAMEWORK STARTS HERE
var GF = function() {
  var mainLoop = function(time) {
    //main function, called each frame
    measureFPS(time);

    // Clear the canvas
    clearCanvas();

    switch (gameState) {
      case 1:
        welcomeScreen();
        break;
      case 3:
        gameOverWin();
        break;
      case 4:
        gameOverLose();
        break;
      case 10:
        gamePlay();
        displayScore();
        break;
      case 11:
        newGame();
        break;
      default:

    }

    // call the animation loop every 1/60th of second
    requestAnimationFrame(mainLoop);
  };


  var start = function() {
    // adds a div for displaying the fps value
    fpsContainer = document.createElement('div');
    document.body.appendChild(fpsContainer);
    createBalls(totalBalls);
    createOpponents(totalOpponents);
    // start the animation
    requestAnimationFrame(mainLoop);
  };

  //our GameFramework returns a public API visible from outside its scope
  return {
    start: start
  };
};
