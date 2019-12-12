/**
  *  Module for capturing input events, storing them and providing input lookup capability.
  *
  * It is expected that most keyboard/gamepad input will be handled via alias strings.
  *
  */

// TODO: test, add mouse functionality, remove commented out code at bottom and put into menu, etc.

import * as Help from "./helper_functions.js";

// functions
export {isHeld, isJustPressed, isJustRepeated, isJustReleased, endCollectionPeriod, readLog,
          readRawLog, isMouseJustClicked, getMousePosition, isMouseOnCanvas, isMouseMoving, pollGamepads};

// state
export {log, rawLog}


// get the canvas and the 2d context
const ctx = document.getElementById('pane').getContext('2d');

// bindings    TODO - add gamepad?
const keyBindings = {
  scroll_up: ["ArrowUp", "w"],
  scroll_down: ["ArrowDown", "s"],
  scroll_left: ["ArrowLeft", "a"],
  scroll_right: ["ArrowRight", "d"]

}

// axes can be accessed in the form "left stick left"
const gamepadBindings = {
  scroll_up: ["left stick up"],
  scroll_down: ["left stick down"],
  scroll_left: ["left stick left"],
  scroll_right: ["left stick right"]
}

// module properties ()

// module state
const rawLog = {
  // keep whole event objects here for export if needed
  keysJustPressed: [],        // cleared with "endCollectionPeriod()"
  keysJustReleased: [],       // cleared with "endCollectionPeriod()"
  keyBindings: keyBindings
}

const log = {
  // event.key only
  keysJustPressed: new Set([]),
  keysJustRepeated: new Set([]),
  keysJustReleased: new Set([]),
  // boolean values
  mouseMoving: false,
  mouseJustClicked: false,

  // persistant even when "endCollectionperiod() is called"
  keysHeld: new Set([]),
  mousePosition: {x: undefined, y: undefined},
  mouseOnCanvas: true,
}

// access functions
function isHeld(alias) {
  return searchForAlias(alias, "keysHeld")
}

function isJustPressed(alias) {
  return searchForAlias(alias, "keysJustPressed")
}

function isJustRepeated(alias) {
  return searchForAlias(alias, "keysJustRepeated")
}

function isJustReleased(alias) {
  return searchForAlias(alias, "keysJustReleased")
}

function isMouseJustClicked() {
  return log.mouseJustClicked;
}

function getMousePosition() {
  return log.mousePosition;
}

function isMouseOnCanvas() {
  return log.mouseOnCanvas
}

function isMouseMoving() {
  return log.mouseMoving
}

function readRawLog() {
  return rawLog;
}

function readLog() {
  return log; // passed by reference for performance reasons
}

function endCollectionPeriod() {
  rawLog.keysJustPressed = [];
  rawLog.keysJustReleased = [];
  log.keysJustPressed.clear();
  log.keysJustRepeated.clear();
  log.keysJustReleased.clear();
  log.mouseMoving = false;
  log.mouseJustClicked = false;
}

// helper functions
function searchForAlias(alias, set) {
  let acceptableKeys = keyBindings[alias];
  for (const key of acceptableKeys) {
    if (log[set].has(key)) {
      return true;
    }
  }
  if (gamepad) {
    let acceptableButtons = gamepadBindings[alias];
    for (const button of acceptableButtons) {
      if (typeof button === "number") {
        if (buttonState && buttonStateLastFrame && buttonState[button].pressed) {
          if (!(buttonStateLastFrame[button].pressed) || set === "keysHeld") {
            return true;
          }
        }
      }
      else if (typeof button === "string") {
        if (axisState && axisStateLastFrame) {
          return matchAxisInput(button, true);
        }
      }
    }
  }
  // if loop completes without finding a match
  return false;
}

function matchAxisInput(string, held) {
  const arr = string.split(" ")
  const stick = arr[0];
  const direction = arr[2];

  if (stick === "left") {
    if (direction === "left") {
      if (axisState[0] < -deadzone && (axisStateLastFrame[0] >= -deadzone || held)) {
        return true;
      }
    }
    if (direction === "right") {
      if (axisState[0] > deadzone && (axisStateLastFrame[0] <= deadzone || held)) {
        return true;
      }
    }
    if (direction === "up") {
      if (axisState[1] < -deadzone && (axisStateLastFrame[1] >= -deadzone || held)) {
        return true;
      }
    }
    if (direction === "down") {
      if (axisState[1] > deadzone && (axisStateLastFrame[1] <= deadzone || held)) {
        return true;
      }
    }
  }

  return false
}

// input event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
ctx.canvas.addEventListener('mousedown', mouseDown, true);
ctx.canvas.addEventListener('mousemove', mouseMove, true);
ctx.canvas.addEventListener('mouseleave', mouseLeave, true);

// event handlers
function keyDown(e) {
  // allow default for crtl + shift + i (devtools on Chrome)
  if (!(log.keysHeld.has('Control') && log.keysHeld.has('Shift'))) {
    e.preventDefault();
  }

  log.keysHeld.add(e.key); // automatically ignores duplicates
  if (e.repeat) {
    log.keysJustRepeated.add(e.key);

  } else {
    log.keysJustPressed.add(e.key);
  }
}

function keyUp(e) {
  e.preventDefault();
  // update held keys
  log.keysHeld.delete(e.key);
  log.keysJustReleased.add(e.key);
}

function mouseDown(e) {
	e.preventDefault();
  if (e.button === 0) {
    log.mouseJustClicked = "main";
  }
  else if (e.button === 2) {
    log.mouseJustClicked = "secondary";
  }
  else {
    log.mouseJustClicked = "other";
  }


	log.mousePosition = Help.pageToCanvasCoord({x: e.clientX, y: e.clientY}, ctx.canvas, 2);

}


function mouseMove(e) {
  e.preventDefault(e); // does this even do anything for onmove???
  log.mouseMoving = true;
	log.mousePosition = Help.pageToCanvasCoord({x: e.clientX, y: e.clientY}, ctx.canvas, 2);
  log.mouseOnCanvas = true;
	// ctx.canvas.style.cursor = 'default';
}

function mouseLeave(e) {
  log.mouseOnCanvas = false;
}


/**
 *
 *  Gamepad code. - Doesn't do much. Work more on later.
 *
 *
 */

 // state
 let gamepad;
 let buttonState; // set???
 let buttonStateLastFrame;

 const deadzone = 0.5;
 let axisState;
 let axisStateLastFrame;


/*
// Event Listeners
window.addEventListener("gamepadconnected", connectGamepad, false); // what does the false do?
window.addEventListener("gamepaddisconnected", disconnectGamepad, false);

// Event Handlers
function connectGamepad(e) {
  let gamepad = e.gamepad;
  gamepads[gamepad.index] = gamepad;
  console.log(`Gamepad connected at index ${gamepad.index}: ${gamepad.id}. ${gamepad.buttons.length} buttons, ${gamepad.axes.length} axes.`);
  // console.log("Gamepads currently connected: ", gamepads);
}

function disconnectGamepad(e) {
  let gamepad = e.gamepad;
  delete gamepads[gamepad.index];
  console.log(`Gamepad disconnected from index ${gamepad.index}: ${gamepad.id}`);
  // console.log("Gamepads currently connected: ", gamepads);
}
*/

function pollGamepads() {
  // update everything - just focus on slot 1
  gamepad = navigator.getGamepads()[0];

  if (gamepad) {
    buttonStateLastFrame = buttonState;
    buttonState = gamepad.buttons;
    axisStateLastFrame = axisState;
    axisState = gamepad.axes;
  }
}
