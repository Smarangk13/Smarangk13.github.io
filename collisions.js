// Return Codes
/*
  0 - No collision
  1 - rect1 left side collision rect2
  2 - rect1 right side collision rect2
  3- rect1 top side collision rect2
  4- rect1 bottom side collision rect2
*/
function rectangleCollision(rect1,rect2) {
  // Rects defined as [x,y,width,height]
  var r1 = {
    x1: rect1[0],
    y1: rect1[1],
    w: rect1[2],
    h: rect1[3],
    x2: rect1[0] + rect1[2],
    y2: rect1[1] + rect1[3]
  };
  var r2 = {
    x1: rect2[0],
    y1: rect2[1],
    w: rect2[2],
    h: rect2[3],
    x2: rect2[0] + rect2[2],
    y2: rect2[1] + rect2[3]
  };

  // Inside degrees assumind r2 bigger
  /*
    0 - Full left/top
    1 - part left/top
    2 - inside
    3- part right
    4- full right/down
  */
  var horizontalIn = 0;
  var verticalIn = 0;

  if (r1.x2 < r2.x1) {
    horizontalIn = 0
  }else if ((r1.x2 > r2.x1) && (r1.x1 < r2.x1)) {
    horizontalIn = 1;
  }else if ((r1.x2 < r2.x2) && (r1.x1 > r2.x1)) {
    horizontalIn = 2;
  }else if ((r1.x2 > r2.x2) && (r1.x1 < r2.x2)) {
    horizontalIn = 3;
  }else if (r1.x1 > r2.x2) {
    horizontalIn = 4;
  }

  if (r1.y2 < r2.y1) {
    verticalIn = 0
  }else if ((r1.y2 > r2.y1) && (r1.y1 < r2.y1)) {
    verticalIn = 1;
  }else if ((r1.y2 < r2.y2) && (r1.y1 > r2.y1)) {
    verticalIn = 2;
  }else if ((r1.y2 > r2.y2) && (r1.y1 < r2.y2)) {
    verticalIn = 3;
  }else if (r1.y1 > r2.y2) {
    verticalIn = 4;
  }

  // If neither then not in
  if (horizontalIn == 0 || verticalIn == 0 || horizontalIn == 4 || verticalIn == 4) {
    return 0;
  }
  // Fully in
  else if(horizontalIn == 2 && verticalIn==2){
    return -1;
  }
  // Priority to horizontalIn
  else if(horizontalIn == 1){
    return 1;
  }
  else if (horizontalIn == 3) {
    return 2;
  }
  // horizontalIn as 2 for full in
  else {
    if (verticalIn == 1) {
      return 3;
    }else if (verticalIn == 3) {
      return 4;
    }

  }
}
