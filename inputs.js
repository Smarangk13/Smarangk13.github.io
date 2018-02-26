//add the listener to the main, window object, and update the states
window.addEventListener('keydown', function(event) {
  key = event.key;
  if (event.key === 'ArrowLeft') {
    inputStates.left = true;
  } else if (event.key === 'ArrowUp') {
    inputStates.up = true;
  } else if (event.key === 'ArrowRight') {
    inputStates.right = true;
  } else if (event.key === 'ArrowDown') {
    inputStates.down = true;
  } else if (event.key === 'Space') {
    inputStates.space = true;
  } else if (event.key === 'Shift') {
    inputStates.shift = true;
  } else if (key === 'w' || key === 'W') {
    inputStates.up = true;
  } else if (key === 'a' || key === 'A') {
    inputStates.left = true;
  } else if (key === 's' || key === 'S') {
    inputStates.down = true;
  } else if (key === 'd' || key === 'D') {
    inputStates.right = true;
  }

}, false);

//if the key will be released, change the states object
window.addEventListener('keyup', function(event) {
  //console.log(event.key)
  key = event.key;
  if (event.key === 'ArrowLeft') {
    inputStates.left = false;
  } else if (event.key === 'ArrowUp') {
    inputStates.up = false;
  } else if (event.key === 'ArrowRight') {
    inputStates.right = false;
  } else if (event.key === 'ArrowDown') {
    inputStates.down = false;
  } else if (event.key === 'Space') {
    inputStates.space = false;
  } else if (event.key === 'Shift') {
    inputStates.shift = false;
  } else if (key === 'w' || key === 'W') {
    inputStates.up = false;
  } else if (key === 'a' || key === 'A') {
    inputStates.left = false;
  } else if (key === 's' || key === 'S') {
    inputStates.down = false;
  } else if (key === 'd' || key === 'D') {
    inputStates.right = false;
  }
}, false);

// Mouse event listeners
window.addEventListener('mousemove', function(evt) {
  inputStates.mousePos = getMousePos(evt);
}, false);

window.addEventListener('mousedown', function(evt) {
  inputStates.mousedown = true;
  inputStates.mouseButton = evt.button;
}, false);

window.addEventListener('mouseup', function(evt) {
  inputStates.mousedown = false;
  inputStates.clicked = true;
}, false);

function getMousePos(evt) {
  // necessary to take into account CSS boudaries
  var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

// function motion(event){
//   inputStates.xMotion = event.accelerationIncludingGravity.x;
//   inputStates.yMotion = event.accelerationIncludingGravity.x;
//   // 
//   // console.log("Accelerometer: "
//   //   + event.accelerationIncludingGravity.x + ", "
//   //   + event.accelerationIncludingGravity.y + ", "
//   //   + event.accelerationIncludingGravity.z
//   // );
// }
