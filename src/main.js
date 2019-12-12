import * as GameLoop from "./game_loop.js";
import * as Help from "./helper_functions.js";
import * as OutcomeGrid from "./outcome_grid.js";
import * as Input from "./input.js";
import {checkMessage, checkMessageInstances, refreshMessageSystem} from "./message_system.js";

// get the canvas and the 2d context
const ctx = document.getElementById('pane').getContext('2d');

// init game state
const game = {
	images: {},
	audio: {},
	scrollSpeed: 4,
	scroll: {x: 0, y: 0},
};

// Game assets - move into preloader later

game.images.island = new Image();
game.images.island.src = 'assets/images/island_map.png';


function processInput(loop) {
	refreshMessageSystem(loop);
	Input.pollGamepads();
	// check messages here
	if (Input.isHeld("scroll_left")) {
		game.scroll.x -= game.scrollSpeed;
		if (game.scroll.x < 0) {
			game.scroll.x = 0;
		}
	}
	if (Input.isHeld("scroll_right")) {
		game.scroll.x += game.scrollSpeed;
		if (game.scroll.x > 200) {
			game.scroll.x = 200;
		}
	}
	if (Input.isHeld("scroll_down")) {
		game.scroll.y -= game.scrollSpeed;
		if (game.scroll.y < 0) {
			game.scroll.y = 0;
		}
	}
	if (Input.isHeld("scroll_up")) {
		game.scroll.y += game.scrollSpeed;
		if (game.scroll.y > 200) {
			game.scroll.y = 200;
		}
	}
	// clear logs for collection heading into next frame
	Input.endCollectionPeriod();
}



function update(loop) {

}


function draw() {
  // clear the screen
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  //ctx.drawImage(game.images.island, 0, -600, 1600, 1200);
  ctx.drawImage(game.images.island, 0 - game.scroll.x, -300 + game.scroll.y, 1200, 900);

};



// set game loop functions
GameLoop.setProcessInput(processInput);
GameLoop.setUpdate(update);
GameLoop.setDraw(draw);

// start the game loop after page has loaded
// put preloader in here?

GameLoop.start();
