/**
 *
 *  Basic messaging system for returning messages to main
 *
 */

export {postMessage, checkMessage, checkMessageInstances, refreshMessageSystem};

// state
export let messageBoard = [];
export let messageQueue = [];

// functions
function postMessage(spec) {
  let message = spec;
  if (!('type' in message)) {message.type = "generic"}
  if (!('data' in message)) {message.data = {}}
  if (!('delay' in message)) {message.delay = 0}  // time delay in milliseconds
  if (!('queuePost' in message)) {message.queuePost = true} // post next frame
  // check for immediate posting
  if (message.queuePost || message.delay > 0) {
    messageQueue.push(message);
  }
  else {
    messageBoard.push(message);
  }
}

function checkMessage(type) {
  for (let i = 0; i < messageBoard.length; i++) {
    let message = messageBoard[i];

    if (message.type === type) {
      return message;
    }
  }
  return false;
}

function checkMessageInstances(type) {
  let messagesFound = [];
  for (let i = 0; i < messageBoard.length; i++) {
    let message = messageBoard[i];
    if (message.type === type) {
    messagesFound.push(message);
    }
  }
  return messagesFound;
}

function refreshMessageSystem(loop) {
  //console.log(messageQueue, messageBoard)
  let newMessageQueue = [];
  let newMessageBoard = [];
  for (let i = 0; i < messageQueue.length; i++) {
    let message = messageQueue[i];
    if (message.delay > 1) { // milliseconds - account for common rounding error
      message.delay -= loop.timestep;
      newMessageQueue.push(message);
    }
    else {
      newMessageBoard.push(message);
    }
  }
  messageQueue = newMessageQueue;
  messageBoard = newMessageBoard;
}
