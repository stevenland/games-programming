import * as MainLoop from "./main_loop.js";
import * as Help from "./helper_functions.js";
import * as OutcomeGrid from "./outcome_grid.js";
import * as Input from "./input.js";
import {checkMessage, checkMessageInstances, refreshMessageSystem} from "./message_system.js";

// get the canvas and the 2d context
const ctx = document.getElementById('pane').getContext('2d');

// init game state
const program = {
	images: {},
	audio: {},
	scrollSpeed: 4,
	scroll: {x: 0, y: 0},
};

// assets - move into preloader later?

program.images.island = new Image();
program.images.island.src = 'assets/images/island_map.png';


function processInput(loop) {
	refreshMessageSystem(loop);
	Input.pollGamepads();
	// check messages here
	if (Input.isHeld("scroll_left")) {
		program.scroll.x -= program.scrollSpeed;
		if (program.scroll.x < 0) {
			program.scroll.x = 0;
		}
	}
	if (Input.isHeld("scroll_right")) {
		program.scroll.x += program.scrollSpeed;
		if (program.scroll.x > 200) {
			program.scroll.x = 200;
		}
	}
	if (Input.isHeld("scroll_down")) {
		program.scroll.y -= program.scrollSpeed;
		if (program.scroll.y < 0) {
			program.scroll.y = 0;
		}
	}
	if (Input.isHeld("scroll_up")) {
		program.scroll.y += program.scrollSpeed;
		if (program.scroll.y > 200) {
			program.scroll.y = 200;
		}
	}
	// clear logs for collection heading into next frame
	Input.endCollectionPeriod();
}



function update(loop) {
	program.timestamp = loop.timestamp;
}


function draw() {
  // clear the screen
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(program.images.island, 0 - program.scroll.x, -300 + program.scroll.y, 1200, 900);
	drawStartText();
};

// Helper functions
function drawStartText() {
	let shiftAmount = 60
	let colorShifter = Math.pow((Math.cos(program.timestamp * 0.003)), 2) * shiftAmount;
	ctx.save();

	ctx.font = "30px px10";
	//ctx.lineWidth=5;
	ctx.textAlign = "left";
	ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
	ctx.fillText("Start Here", 181 - program.scroll.x, 521 + program.scroll.y);
	ctx.fillStyle = `rgba(${140 + colorShifter}, ${70 + colorShifter}, ${110 + colorShifter}, 1)`;
	ctx.fillText("Start Here", 180 - program.scroll.x, 520 + program.scroll.y);

	ctx.restore();
}

// set main loop functions
MainLoop.setProcessInput(processInput);
MainLoop.setUpdate(update);
MainLoop.setDraw(draw);

// start the main loop after page has loaded
// put preloader in here?

MainLoop.start();
