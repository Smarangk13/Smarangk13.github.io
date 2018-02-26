// The player !
var player = {
  x: 10,
  y: 10,
  sizex: 10,
  sizey: 10,
  speed: 1,
  ballsHeld: new Array(),
  score: 0,
  stance: 0
};

function updateplayerPosition() {
  player.speedX = player.speedY = 0;
  // console.log(inputStates.mousePos);
  // check inputStates
  if (inputStates.left) {
    //ctx.fillText("left", 150, 20);
    player.speedX = -player.speed;
  }
  if (inputStates.up) {
    //ctx.fillText("up", 150, 40);
    player.speedY = -player.speed / 1.5;
  }
  if (inputStates.right) {
    //ctx.fillText("right", 150, 60);
    player.speedX = player.speed;
  }
  if (inputStates.down) {
    //ctx.fillText("down", 150, 80);
    player.speedY = player.speed / 1.5;
  }
  if (inputStates.space) {
    //ctx.fillText("space bar", 140, 100);
  }
  if (inputStates.shift) {
    player.speed = 5;
  } else if (!inputStates.shift) {
    player.speed = 1;
  }

  if (inputStates.mousePos) {
    //ctx.fillText("x = " + inputStates.mousePos.x + " y = " + inputStates.mousePos.y, 5, 150);
  }
  if (inputStates.clicked) {
    throwBall(player);
    inputStates.clicked = false;
  }

  if (inputStates.xMotion) {
    //ctx.fillText("right", 150, 60);
    player.speedX = player.speed;
  }

  player.x += player.speedX;
  player.y += player.speedY;

}

// Functions for drawing the player and maybe other objects
function drawMyplayer(x, y) {
  // save the context
  ctx.save();

  // translate the coordinate system, draw relative to it
  ctx.translate(x, y);

  // (0, 0) is the top left corner of the player.
  ctx.strokeRect(0, 0, player.sizex, player.sizey);

  // eyes
  ctx.fillRect(2, 2, 1, 1);
  ctx.fillRect(6.5, 2, 1, 1);

  // nose
  ctx.strokeRect(4.5, 4, 1, 4);

  // mouth
  ctx.strokeRect(3.5, 8.4, 3.0, 1.0);

  // teeth
  ctx.fillRect(3.8, 8.4, 1, 1);
  ctx.fillRect(5.2, 8.4, 1, 1);

  // restore the context
  ctx.restore();
}
