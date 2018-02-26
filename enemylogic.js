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

function getCloseEnemy(character) {
  var min = getDistance(character.x, character.y, player.x, player.y);
  var dist, mnum = -1;
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
  return mnum;
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

  this.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.team === 1) {
      ctx.fillStyle = "red";
    } else if (this.team === 2) {
      ctx.fillStyle = "purple";
    } else if (this.team === 0) {
      ctx.fillStyle = "green;";
    }
    ctx.fillRect(0, 0, this.sizex, this.sizey);
    ctx.restore();
    //ctx.fill();
  };
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
    } else if (this.stance === 1) {
      closeBall = getCloseFreeBall(this);
      // console.log(closeBall);
      this.x -= this.speed * sign(this.x - ballArray[closeBall].x);
      this.y -= this.speed * sign(this.y - ballArray[closeBall].y);

    } else if (this.stance === 2) {
      closeEnemy = getCloseEnemy(this);
      throwBallAi(this, closeEnemy, opponentNum);
      this.stance = 1;
    }

  }
}
