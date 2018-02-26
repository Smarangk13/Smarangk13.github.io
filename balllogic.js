function createBalls(numberOfBalls) {
  for (var i = 0; i < numberOfBalls; i++) {

    // Create a ball with random position and speed angle of movement
    // Use fixed size and have a toggle if ball is slected.
    var ball = new Ball(width * Math.random(),
      height * Math.random(),
      (2 * Math.PI) * Math.random(),
      0,
      10, 2);

    // We add it to the array
    //ballArray[i] = ball;
    ballArray.push(ball);
  }
}

function testCollisionWithWalls(ball) {
  var bounceOccured = 0;
  // left
  if (ball.x < ball.radius) {
    ball.x = ball.radius;
    ball.angle = -ball.angle + Math.PI;
    bounceOccured = 1;
  }
  // right
  if (ball.x > width - (ball.radius)) {
    ball.x = width - (ball.radius);
    ball.angle = -ball.angle + Math.PI;
    bounceOccured = 1;
  }
  // up
  if (ball.y < ball.radius) {
    ball.y = ball.radius;
    ball.angle = -ball.angle;
    bounceOccured = 1;
  }
  // down
  if (ball.y > height - (ball.radius)) {
    ball.y = height - (ball.radius);
    ball.angle = -ball.angle;
    bounceOccured = 1;
  }
  return bounceOccured;
}

function testCollisionWithCharacters(ball, character) {
  var cxr = character.x + character.sizex;
  var cyr = character.y + character.sizey;
  if ((cxr > ball.x - ball.radius && cxr < ball.x + ball.radius) ||
    (character.x < ball.x + ball.radius && character.x > ball.x - ball.radius)) {
    if (character.y < ball.y + ball.radius && cyr > ball.y - ball.radius) {
      //console.log("collision");
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

// constructor function for balls
// Ball states
/*
  0 - ok to pick up
  1 - selected by player
  2 - moving - dangerous to touch
  3- moving from player so ok
*/
function Ball(x, y, angle, v, diameter, state) {
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.v = v;
  this.radius = diameter / 2;
  this.state = state;
  this.thrownBy = -1;

  this.draw = function() {
    // Create gradient
    var r = this.radius;
    var r34 = 3 * r / 4
    var grd = ctx.createRadialGradient(this.x, this.y, r / 8, this.x, this.y, r);
    if (this.v < 0.5 && this.v > -0.5) {
      if (this.state === 2 || this.state === 3) {
        this.state = 0;
        this.thrownBy = -1;
      }
    }
    switch (this.state) {
      case 1:
        grd.addColorStop(0, "green");
        grd.addColorStop(1, "yellow")
        break;
      case 2:
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "blue");
        break;
      case 3:
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "blue");
        break;
      default:
        grd.addColorStop(0, "green");
        grd.addColorStop(1, "blue");
    }

    // Fill with gradient
    ctx.fillStyle = grd;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  this.move = function() {
    // add horizontal increment to the x pos
    // add vertical increment to the y pos
    this.v /= 1.05
    this.x += this.v * Math.cos(this.angle);
    this.y += this.v * Math.sin(this.angle);
  };
}

function moveWith2(character) {
  var ballNum=-1;
  var heldBall=0;
  // console.log(character.speedX);
  for (var j=0;j<character.ballsHeld.length;j++){
    ballNum=character.ballsHeld[j];
    heldBall=ballArray[ballNum]
    //too far
    if ((Math.abs(heldBall.x-character.x)+Math.abs(heldBall.y-character.y))>25) {
      character.ballsHeld[j]=0;
      midpop(character.ballsHeld);
      heldBall.state=0;
    }else {
    heldBall.x +=character.speedX;
    heldBall.y +=character.speedY;
  }
  }
}

function midpop(list){
  var flag=0;
  for (var j=0;j<list.length;j++){
    if (list[j]===0) {
      flag=1;
    }
    if (flag===1) {
      if (j+1<list.length) {
        list[j]=list[j+1]
      }else {
        list.pop();
      }
    }
  }
}

function moveWith(ball, character) {
  ball.x += character.speedX;
  ball.y += character.speedY;
}

function throwBall(character) {
  var xdiff, ydiff, dist;
  // var mx=inputStates.mousePos.x;
  // var my=inputStates.mousePos.y;
  for (var j = 0; j < ballArray.length; j++) {
    var ball = ballArray[j];
    if ((character.ballsHeld[character.ballsHeld.length-1]===j)&&ball.state === 1) {
      character.ballsHeld.pop();
      ball.state = 2;
      xdiff = inputStates.mousePos.x - ball.x;
      ydiff = inputStates.mousePos.y - ball.y;
      dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
      ball.angle = Math.asin(Math.abs(ydiff) / dist);
      if (xdiff < 0 && ydiff > 0) {
        ball.angle = Math.PI - ball.angle;
      } else if (xdiff < 0 && ydiff < 0) {
        ball.angle += Math.PI;
      } else if (xdiff > 0 && ydiff < 0) {
        ball.angle = 2 * Math.PI - ball.angle;
      }
      ball.thrownBy = 0;
      ball.v = 15;
      break;
    }
  }
}

function throwBallAi(character,enemyNum,opponentNum) {
  var xdiff, ydiff, dist;
  var mx,my;

  if(enemyNum===-1){
    mx=player.x;
    my=player.y;
  }else {
    mx=opponentArray[enemyNum].x;
    my=opponentArray[enemyNum].y;
  }
  for (var j = 0; j < ballArray.length; j++) {
    var ball = ballArray[j];
    if ((character.ballsHeld[character.ballsHeld.length-1]===j)&&ball.state === 1) {
      character.ballsHeld.pop();
      ball.state = 2;
      xdiff = mx - ball.x;
      ydiff = my - ball.y;
      dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
      ball.angle = Math.asin(Math.abs(ydiff) / dist);

      if (xdiff < 0 && ydiff > 0) {
        ball.angle = Math.PI - ball.angle;
      } else if (xdiff < 0 && ydiff < 0) {
        ball.angle += Math.PI;
      } else if (xdiff > 0 && ydiff < 0) {
        ball.angle = 2 * Math.PI - ball.angle;
      }
      ball.v = 15;
      ball.thrownBy = opponentNum+1;
      break;
    }
  }
}

function collisionReaction(character,ball,ballNum){
  var damage = 0;
  if (testCollisionWithCharacters(ball,character)){
    if (ball.state===0) {
      ball.state=1;
      character.ballsHeld.push(ballNum);
      character.stance = 2;
    }else if (ball.state===2) {
      //console.log("Game over");
      if (character===opponentArray[ball.thrownBy-1]) {
        //self throw
      }else if(ball.thrownBy===0){
        player.score += 10;
        character.score -= 5;
        ball.thrownBy =-1;
        damage = 1;
      }else if (ball.thrownBy>0) {
        opponentArray[ball.thrownBy-1].score +=10;
        character.score -= 5;
        ball.thrownBy = -1;
        damage = 1;
      }else {
        //score already counted
      }
    }
  }
  if(ball.state===1){
    //drag ball
    //moveWith(ball,character);
  }
  return damage;
}
