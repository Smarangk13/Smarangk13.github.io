//var canvas = document.querySelector("#myCanvas");

var windowSize={
  x1 : 0,
  x2 : 300,
  y1 : 0,
  y2 : 200
};

var title={
  x : 20,
  y : 20
};

var startBox = {
  x1 : 5,
  x2 : 120,
  y1 : 5,
  y2 : 70
};

var instructionBox = {
  x1 : 5,
  x2 : 120,
  y1 : 90,
  y2 : 150
};

var playAgainBox = {
  x1 : 70,
  x2 : 220,
  y1 : 80,
  y2 : 100
};

function mouseinbox(box, mx, my) {
  if (mx > box.x1 && mx < box.x2 && my > box.y1 && my < box.y2) {
    return 1;
  } else {
    return 0;
  }

}

function drawBox(box) {
  ctx.save();
  ctx.translate(box.x1, box.y1);
  ctx.strokeRect(0, 0, box.x2 - box.x1, box.y2 - box.y1);
  ctx.restore();
}

function drawImage(box,image) {
  ctx.save();
  ctx.translate(box.x1, box.y1);
  ctx.drawImage(image,0,0, box.x2-box.x1 ,box.y2 - box.y1);
  ctx.restore();
}

function welcomeScreen() {
  var startVal, mx, my;
  var startButton = new Image();
  startButton.src = "./assets/startButton.png";
  var instructionButton = new Image();
  instructionButton.src = "./assets/instructions.png";
  var startBackground = new Image();
  startBackground.src = "./assets/startBackground.png";
  // You win
  //img=
  ctx.save();
  ctx.fillStyle = 'Black';
  ctx.font = "25px Georgia";
  //ctx.fillText("Dodge Ball Game", w / 2 - 75, height / 2);
  ctx.fillStyle = 'Blue';
  drawImage(windowSize,startBackground);
  //drawBox(startBox);
  drawImage(startBox,startButton);
  drawImage(instructionBox,instructionButton);
  //drawBox(instructionBox);
  //ctx.fillText("Start", 20, 20);
  ctx.restore();

  if (inputStates.mousePos) {
    ctx.font = "10px Georgia";
    mx = inputStates.mousePos.x;
    my = inputStates.mousePos.y;
    startVal = mouseinbox(startBox, mx, my);
    if (startVal) {
      if (inputStates.clicked) {
        gameState = 10;
      }
    }
  }
  ctx.restore();
}


function displayScore() {
  var scorePositionx = width - 100;
  var scorePositiony = 10;
  ctx.save();
  ctx.fillStyle = 'Black';
  ctx.font = "10px Georgia";
  ctx.fillText("----Scores----", scorePositionx, scorePositiony);
  ctx.fillStyle = 'Blue';
  ctx.fillText("Player: " + player.score, scorePositionx, 2 * scorePositiony);
  ctx.fillStyle = 'Red';
  for (var i = 0; i < opponentArray.length; i++) {
    if (opponentArray[i].team === 1) {
      ctx.fillStyle = "red";
      ctx.fillText("Red : " + opponentArray[i].score, scorePositionx, (i + 3) * scorePositiony);
    } else if (opponentArray[i].team === 2) {
      ctx.fillStyle = "purple";
      ctx.fillText("Purple : " + opponentArray[i].score, scorePositionx, (i + 3) * scorePositiony);
    } else if (opponentArray[i].team === 0) {
      ctx.fillStyle = "green;";
      ctx.fillText("Gren: " + opponentArray[i].score, scorePositionx, (i + 3) * scorePositiony);
    }
  }

  ctx.restore();
}

function gameOverWin() {
  var startVal, mx, my;

  // You win
  ctx.save();
  ctx.fillStyle = 'Black';
  ctx.font = "25px Georgia";
  ctx.fillText("Congrats! You win!", width / 2 - 75, height / 2);
  ctx.translate(playAgainBox.x1, playAgainBox.y1);
  ctx.strokeRect(0, 0, playAgainBox.x2 - playAgainBox.x1, playAgainBox.y2 - playAgainBox.y1);
  ctx.fillStyle = 'Blue';
  ctx.fillText("Play Again", 10, 20);
  ctx.restore();

  if (inputStates.mousePos) {
    ctx.font = "10px Georgia";
    mx = inputStates.mousePos.x;
    my = inputStates.mousePos.y;
    startVal = mouseinbox(playAgainBox, mx, my);
    if (startVal) {
      if (inputStates.mousedown) {
        gameState = 11;
      }
    }
  }
  ctx.restore();
}

function winnerFiner(win) {
  if (win === 0) {
    return "Red"
  } else if (win == 1) {
    return "Purple"
  } else {
    return "you"
  }
}

function gameOverLose() {
  var startVal, mx, my;

  // You win
  ctx.save();
  ctx.fillStyle = 'Black';
  ctx.font = "25px Georgia";
  ctx.fillText("Sorry!" + winnerFiner(winner) + " Wins!", width / 2 - 95, height / 2);
  ctx.translate(playAgainBox.x1, playAgainBox.y1);
  ctx.strokeRect(0, 0, playAgainBox.x2 - playAgainBox.x1, playAgainBox.y2 - playAgainBox.y1);
  ctx.fillStyle = 'Blue';
  ctx.fillText("Play Again", 20, 20);
  ctx.restore();

  if (inputStates.mousePos) {
    ctx.font = "10px Georgia";
    mx = inputStates.mousePos.x;
    my = inputStates.mousePos.y;
    startVal = mouseinbox(playAgainBox, mx, my);
    if (startVal) {
      if (inputStates.clicked) {
        gameState = 11;
      }
    }
  }
  ctx.restore();
}
