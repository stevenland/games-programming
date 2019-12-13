import * as MainLoop from "./main_loop.js";
import * as Help from "./helper_functions.js";
import * as OutcomeGrid from "./outcome_grid.js";
import * as Input from "./input.js";
import {checkMessage, checkMessageInstances, refreshMessageSystem} from "./message_system.js";
import {projects, drawProject, processProjectInput} from "./project_objects.js"

// get the canvas and the 2d context
const ctx = document.getElementById('pane').getContext('2d');

// init game state
const program = {
	images: {},
	audio: {},
	scrollSpeed: 4,
	scroll: {x: 0, y: 0},
	shiftAmount: 60,
	colorShifter: 0
};

// assets - move into preloader later?

program.images.island = new Image();
program.images.island.src = 'assets/images/island_map.png';

program.images.art = new Image();
program.images.art.src = 'assets/images/brush.png';

program.images.scratch = new Image();
program.images.scratch.src = 'assets/images/scratch.png';

program.images.godot = new Image();
program.images.godot.src = 'assets/images/godot.png';

function processInput(loop) {
	refreshMessageSystem(loop);
	Input.pollGamepads();
	// check messages here


	// log clicked co-ordinates
	if (Input.isMouseJustClicked()) {
		let pos = Help.screenToCartesian(Input.log.mousePosition, program.scroll);
		console.log(pos);
	}

	// click detection on projects
	for (let i = 0; i < projects.length; i++) {
		processProjectInput(projects[i], Input, program);
	}

	// scrolling
	// let scrollThisFrame = {x: 0, y: 0};
	let mouseScrollRange = 50;
	let moc = Input.log.mouseHasBeenOnCanvas;
	if (Input.isHeld("scroll_left") || (Input.log.mousePosition.x < mouseScrollRange && moc)) {
		program.scroll.x -= program.scrollSpeed;
		if (program.scroll.x < 0) {
			program.scroll.x = 0;
		}
	}
	if (Input.isHeld("scroll_right") || (Input.log.mousePosition.x > 1000 - mouseScrollRange && moc)) {
		program.scroll.x += program.scrollSpeed;
		if (program.scroll.x > 200) {
			program.scroll.x = 200;
		}
	}
	if (Input.isHeld("scroll_down") || (Input.log.mousePosition.y > 600 - mouseScrollRange && moc)) {
		program.scroll.y -= program.scrollSpeed;
		if (program.scroll.y < 0) {
			program.scroll.y = 0;
		}
	}
	if (Input.isHeld("scroll_up") || (Input.log.mousePosition.y < mouseScrollRange && moc)) {
		program.scroll.y += program.scrollSpeed;
		if (program.scroll.y > 200) {
			program.scroll.y = 200;
		}
	}
	// clear logs for collection heading into next frame
	Input.endCollectionPeriod();
}



function update(loop) {
	program.colorShifter = Math.pow((Math.cos(loop.timestamp * 0.003)), 2) * program.shiftAmount;
}


function draw() {
  // clear the screen
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(program.images.island, 0 - program.scroll.x, -300 + program.scroll.y, 1200, 900);
	drawStartText();

	for (let i = 0; i < projects.length; i++) {
		drawProject(projects[i], program, ctx);
	}
};

// Helper functions
function drawStartText() {
	ctx.save();

	ctx.font = "30px px10";
	ctx.textAlign = "left";
	ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
	ctx.fillText("Start Here", 181 - program.scroll.x, 521 + program.scroll.y);
	ctx.fillStyle = `rgba(${140 + program.colorShifter}, ${70 + program.colorShifter}, ${110 + program.colorShifter}, 1)`;
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
