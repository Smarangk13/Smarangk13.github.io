function createOpponents(numberOfopponents) {
  //opponent (posx posy sizex sizey speed team stance)
  // var o1=new Opponent(width*Math.random(), height*Math.random(),10, 10,2,1,1);
  // var o2=new Opponent(width*Math.random(), height*Math.random(),10, 10,2,2,1);
  //opponentArray={o1,o2};
  for (var i = 0; i < numberOfopponents; i++) {
    var opponent = new Opponent(width * Math.random(),
      height * Math.random(),
      10, 10,
      0.7, (i + 1) % 3, 1);
    opponentArray.push(opponent);
  }
}

function testCharacterWallCollision(character) {
  if (character.x < 0) {
    character.x = 0;
  }
  if (character.y < 0) {
    character.y = 0;
  }
  if (character.x + character.sizex > width) {
    character.x = width - character.sizex;
  }
  if (character.y + character.sizey > height) {
    character.y = height - character.sizey;
  }
}

function testCharacterOpponentCollision(character, playerNumber) {
  var cxr = character.x + character.sizex;
  var cyr = character.y + character.sizey;

  for (var j = 0; j < opponentArray.length; j++) {
    if (j === playerNumber) {
      continue;
    }
    if (cxr > opponentArray[j].x && cxr < opponentArray[j].x + opponentArray[j].sizex) {
      if (character.y < opponentArray[j].y + opponentArray[j].sizey && cyr > opponentArray[j].y) {
        character.x -= collisionConstant;
        opponentArray.x += collisionConstant;
        return 1;
      } else {
        return 0;
      }
    } else if (character.x < opponentArray[j].x + opponentArray[j].sizex && character.x > opponentArray[j].x) {
      if (character.y < opponentArray[j].y + opponentArray[j].sizey && cyr > opponentArray[j].y) {
        character.x += collisionConstant;
        opponentArray.x -= collisionConstant;
        return 1;
      } else {
        return 0;
      }
    }
  }
}

function testCharacterObstacleCollision(character) {
  for (var i = 0; i < obstacles.length; i++) {
    wallx = obstacles[i];
    charRect = [character.x,character.y,character.sizex,character.sizey]
    collides = rectangleCollision(charRect,wallx);
    // console.log(collides);

    // Collision handling
    if (collides > 0) {
      // console.log(collides);
      // left
      if (collides == 1) {
        character.x = wallx[0]  - character.sizex;
      }
      // Right
      else if (collides == 2) {
        character.x = wallx[0]  + wallx[2];
      }
      // Top
      else if (collides == 3) {
        character.y = wallx[1] - character.sizey;
      }
      // Bottom
      else if (collides == 4) {
        character.y = wallx[1] + wallx[3];
      }
    }

    // If ball inside wall place it outside
    else if (collides < 0) {
      // ball.x = wallx[0] - ballDiameter;
      // ball.y = wallx[1] - ballDiameter;
    }
  }
}

function getDistance(x1, y1, x2, y2) {
  var distance, xdiff, ydiff;
  xdiff = x2 - x1;
  ydiff = y2 - y1;
  distance = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
  return distance;
}

function getCloseFreeBall(character) {
  var min = width * width + height * height;
  var dist, mnum = 0;
  for (var j = 0; j < ballArray.length; j++) {
    dist = getDistance(character.x, character.y, ballArray[j].x, ballArray[j].y);
    if ((ballArray[j].state === 0) && (dist < min)) {
      min = dist;
      mnum = j;
    }
  }
  return mnum;
}

// returns -1 if closest distance is player not other enemy
function getCloseEnemy(character) {
  var min = getDistance(character.x, character.y, player.x, player.y);
  var dist = 0;
  var mnum = -1;
  for (var j = 0; j < opponentArray.length; j++) {
    if (character === opponentArray[j]) {
      continue;
    }
    dist = getDistance(character.x, character.y, opponentArray[j].x, opponentArray[j].y);
    if ((opponentArray[j].team != character.team) && (dist < min)) {
      min = dist;
      mnum = j;
    }
  }
  return [mnum,min];
}

function getBallDistances(character) {
  var bdists = new Array();
  var dist = 0;
  for (var j = 0; j < ballArray.length; j++) {
    dist = getDistance(character.x, character.y, ballArray[j].x, ballArray[j].y);
    bdists.push(dist);
  }
  return bdists;
}

function getOpponentDistances(character) {
  var odists = []
  var pDist = getDistance(character.x, character.y, opponentArray[0].x, opponentArray[0].y);
  var dist = 0;
  odists.push(pDist);
  for (var j = 0; j < ballArray.length; j++) {
    dist = getDistance(character.x, character.y, opponentArray[j].x, opponentArray[j].y);
    odists.push(dist);
  }
  return odists;
}

function getFar(list) {
  for (var j = 0; j < list.length; j++) {
    if (list[j] === 0) {
      continue;
    }
  }
}

function sign(num) {
  return num / Math.abs(num);
}

// Use p1 p2 as objects with x and y defined
function clearPath(p1,p2){
  // Find line parameters
  // route 0 - clear 1+ - collision code
  var route = 0;
  var block = -1; // Id of first blocking obstacle
  var xn = p1.x;
  var yn = p1.y;
  var dir = 1;
  if (xn > p2.x) {
    dir = -1;
  }else if (xn === p2.x) {
    dir = 0;
  }

  // Slope of line, make sure not infitity
  var m = 0
  if (p2.x != p1.x) {
      m = (p2.y - p1.y)/(p2.x - p1.x);
  }
  var c = p1.y - m*p1.x;
  // y = m(x-x1) + y1

  // xn!=p2.x && yn!=p2.y
  // get close to target
  var dist = getDistance(p1.x, p1.y, p2.x, p2.y)
  while (dist > 70) {
    dist = getDistance(xn,yn, p2.x, p2.y)
    if (xn == p2.x) {
      if (yn < yn) {
        yn += 1;
      }else {
        yn -= 1;
      }
    }else {
      xn += dir;
      yn = m*(xn - p1.x) + p1.y;
      yn = Math.floor(yn);
    }

    var virtMove = [xn,yn,10,10];
    for (var i = 0; i<obstacles.length; i++){
      wallx = obstacles[i];
      collision = rectangleCollision(virtMove,wallx);
      if (collision != 0){
        route = 1;
        block = i;
        break;
      }
    }
    if (route == 1) {
      break;
    }
  }

  return [route,block,m,c,dir];
}


// constructor function for Oppponents
/* stance
0 - Do nothing
1 - Seek ball
2 - Ready to throwBall
3- Only dodge
*/
function Opponent(x, y, sizex, sizey, speed, team, stance) {
  this.x = x;
  this.y = y;
  this.sizex = sizex;
  this.sizey = sizey;
  this.speed = speed;
  this.speedX = speed;
  this.speedY = speed;
  this.team = team;
  this.stance = stance;
  this.score = 0;
  this.ballsHeld = new Array();
  this.throwDistance = 70;

  this.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.team === 1) {
      ctx.fillStyle = "red";
    } else if (this.team === 2) {
      ctx.fillStyle = "purple";
    } else if (this.team === 3) {
      ctx.fillStyle = "green;";
    }
    ctx.fillRect(0, 0, this.sizex, this.sizey);
    ctx.restore();
    //ctx.fill();
  };

  // Finding path via heuristic
  // takes source [x,y] and dest [x,y] and returns where to move based on obstacles
  this.path = function(destination){
    var p1 = {
      x : this.x,
      y : this.y
    }
    var p2 = {
      x : destination[0],
      y : destination[1]
    }

    routeData = clearPath(p1,p2);
    var route = routeData[0];
    var block = routeData[1];
    var m = routeData[2];
    var c = routeData[3];
    var dir = routeData[4];

  // Determine position to move towards
    targetx = p2.x;
    targety = p2.y;

    if (route > 0) {
      // Find close corner
      var dists = [];
      dists[0] = getDistance(p1.x, p1.y,
        obstacles[block][0], obstacles[block][1]);

      dists[1] = getDistance(p1.x, p1.y,
        obstacles[block][0] + obstacles[block][2], obstacles[block][1]);

      dists[2] = getDistance(p1.x, p1.y,
        obstacles[block][0], obstacles[block][1] + obstacles[block][3]);

      dists[3] = getDistance(p1.x, p1.y,
        obstacles[block][0] + obstacles[block][2],
        obstacles[block][1] + obstacles[block][3]);

      min = dists[0];
      minDist = 0
      var p3 = {
        x : obstacles[block][0],
        y : obstacles[block][1]
      }
      for (var i = 1; i < dists.length; i++) {
        if (dists[i] < min) {
          min = dists[i];
          minDist = i;
        }
      }
      switch (minDist) {
        case 1:
          p3.x = obstacles[block][0] + obstacles[block][2];
          p3.y = obstacles[block][1];
          break;
        case 2:
          p3.x = obstacles[block][0];
          p3.y = obstacles[block][1] + obstacles[block][3];
          break;
        default:
          p3.x = obstacles[block][0] + obstacles[block][2];
          p3.y = obstacles[block][1] + obstacles[block][3];
      }

      // Now using p3 get new line
      if (p1.x != p3.x) {
          m = (p1.y - p3.y)/(p1.x - p3.x);
      }else {
        m = 0;
      }
      c = p1.y - m * p1.x;
    }

    // get new x y based on m c
    var xn = p1.x + dir*this.speed;
    var yn = m*xn + c;
    if (m == 0) {
      yn = p1.y + this.speed;
    }

    this.x = xn;
    this.y = yn;
    // console.log(route);
    // console.log(targetx,targety);
    // this.x -= this.speed * sign(this.x - targetx);
    // this.y -= this.speed * sign(this.y - targety);
  };

  // move opponent based on stance
  this.move = function(opponentNum) {
    // When enemy has no ball it has 2 options dodge or get a ball
    // After it gets a ball it can position itself or throw or get another ball
    var odists = [];
    var bdists = [];
    var closeBall = 0;
    var closeEnemy = 0;
    var phide = 0.5;
    var pget = 0.5;

    // odists=getOpponentDistances(this);
    // bdists=getBallDistances(this);
    if (this.stance === 0) {
      return 0;
    }
    // Search for closest ball or hide
    else if (this.stance === 1) {
      closeBall = getCloseFreeBall(this);
      // this.x -= this.speed * sign(this.x - ballArray[closeBall].x);
      // this.y -= this.speed * sign(this.y - ballArray[closeBall].y);
      this.path([ballArray[closeBall].x,ballArray[closeBall].y])
    }
    // Chase opponent and throw
    else if (this.stance === 2) {
      closeEnemy = getCloseEnemy(this);
      closeEnemyIndex = closeEnemy[0]
      closeEnemyDist = closeEnemy[1];

      if (closeEnemyIndex === -1) {
        closeEnemyx = player.x;
        closeEnemyy = player.y;
      }
      else {
        closeEnemyx = opponentArray[closeEnemyIndex].x;
        closeEnemyy = opponentArray[closeEnemyIndex].y;
      }

      var closeEnemyPos = [closeEnemyx, closeEnemyy]

      if(closeEnemyDist > 70){
        //chase
        this.path(closeEnemyPos)
      }
      else {
        throwBallAi(this, closeEnemy[0], opponentNum);
        this.stance = 1;
      }
    }

  };
}
