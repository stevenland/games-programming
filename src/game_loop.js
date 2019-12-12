/*
 * API
 */

export {reportInfo, setProcessInput, setUpdate, setDraw, start, stop};

/*
 * State (maintained in module)
 */

// object passed to loop functions
const loop = {
    timestep: 1000/60, // 60 updates per second, regardless of frame rate
    timestamp: 0 // exact moment of the current frame - measured from the start of the program
};

// Other internal game loop variables
let lastFrameTimeMs = 0; // last time loop ran
let delta = 0; // amount of time waiting to be simulated
let frameID = 0; // used for cancelling requestAnimationFrames if needed
let running = false;
let started = false;

// default empty function values
let processInput = () => {};
let update = () => {};
let draw = () => {};

/*
 * Logic
 */
// report info
function reportInfo() {
	return Object.freeze({
		timestamp: loop.timestamp,
	});
}


// Game loop functions (internal)
function panic() {
    // discard unsimulated time
    delta = 0;
    // log to the console
    console.log("Game panicked!");
}

function stop() {
    running = false;
    started = false;
    cancelAnimationFrame(frameID);
}

function start() {
    if (!started) { // don't request multiple frames
        started = true;
        running = true;
        // Dummy frame to get our timestamps and initial drawing right.
        // Track the frame ID so we can cancel it if we stop quickly.
        frameID = requestAnimationFrame((timestamp) => {
            draw(loop); // initial draw
            // reset some tracking variables
            lastFrameTimeMs = timestamp;
            // actually start the main loop
            frameID = requestAnimationFrame(mainLoop);
        });
    }
    // Alert if attempted to start running loop.
    else {
        console.log('Game loop is already running!');
    }
}

function mainLoop(timestamp) {
    // log the timestamp for other method access
    loop.timestamp = timestamp;
    // Track the accumulated time that hasn't been simulated yet
    delta += timestamp - lastFrameTimeMs;
    // keep track of the current timestamp for reference
    lastFrameTimeMs = timestamp;

    // Run update for the scene
    let numUpdateSteps = 0;
    while (delta >= loop.timestep) { // usually runs once per mainloop, but may be more
        processInput(loop);
        update(loop);
        delta -= loop.timestep;
        // sanity check
        numUpdateSteps += 1;
        if (numUpdateSteps >= 60){
          panic(); // fix things
          break; // bail out
        }
    }
    // run draw for the scene - once
    draw(loop);
    // request the next frame and store the frame ID
    frameID = requestAnimationFrame(mainLoop);
}

function setProcessInput(func) {
    processInput = func;
}

function setUpdate(func){
    update = func;
}

function setDraw(func) {
    draw = func;
}
