// Import everythign
import * as Menu from "./menu.js";
import * as ParticleEmitter from "./particle_emitter.js";
import * as GameLoop from "./game_loop.js";
import * as Help from "./helper_functions.js";
import * as Fuzzy from "./fuzzy.js";
import * as Probability from "./probability.js";
import * as OutcomeGrid from "./outcome_grid.js";
import * as Input from "./input.js";
import {createMenu, drawMenu, updateMenu, processMenuInput, resetMenu} from "./menu.js";
import {ddConsole} from "./drop_down.js";
import {checkMessage, checkMessageInstances, refreshMessageSystem} from "./message_system.js";
import {createProblem, drawProblem, processProblemInput} from "./problem_sets.js";

// get the canvas and the 2d context
const ctx = document.getElementById('pane').getContext('2d');

// game mode enum
const Game_Mode = Object.freeze({
	MENU: 'menu',
	PLAY: 'play',
});

// init game state
const game = {
	mode: Game_Mode.MENU,
	playerTurn: 0, // player '1' and player '2'
	images: {},
	audio: {},
	mouseHover: {x: 0, y: 0}, // tracks mouse move
};
game.menu = createMenu();
game.currentProblem = createProblem(["I will choose two gems,", "one from each bag.",
																			"This is some extra text,", "and so is this."]);
game.grid = OutcomeGrid.create([["both the same colour", "one red, one blue.", "lksdjf"], ["two red", "two blue", "kdsjf"]]);



// Game assets - move into preloader later

game.images.menu_background = new Image();
game.images.menu_background.src = 'images/menu_background.png';

game.images.wizard = new Image();
game.images.wizard.src = 'images/wizard.png';

game.images.bag = new Image();
game.images.bag.src = 'images/bag.png';

game.images.fuzzies = new Image();
game.images.fuzzies.src = 'images/fuzzies.png';
//console.log(game.images)

game.backgroundNum = 1;
for (let i = 1; i <= 7; i++) {
	game.images[`background${i}`] = new Image();
	game.images[`background${i}`].src = `images/background${i}.png`;

}

game.audio.main_theme = new Audio();
game.audio.main_theme.src = "audio/main_theme.m4a";
game.audio.main_theme.loop = true;

let snow = ParticleEmitter.createEffect("rgba(230, 230, 255, 0.3)", 2, 50000, 0.01, 300);



game.fuzzies = [];
for (let i = 0; i < 20; i++) {
    game.fuzzies.push(Fuzzy.create(game, 0));
}
for (let i = 0; i < 20; i++) {
    game.fuzzies.push(Fuzzy.create(game, 1));
}
//console.log(game.fuzzies)

function processInput(loop) {
	Input.pollGamepads();
	refreshMessageSystem(loop);

	processMessageBoard();

	if (Input.isJustPressed("toggle_menu")) {
		toggleMenu(game);
	}
	if (Input.isJustPressed("toggle_player")) {
		togglePlayer(game);
	}

	if (game.mode === Game_Mode.MENU) {
		processMenuInput(game.menu, Input, game);
	}

	else if (game.mode === Game_Mode.PLAY) {
		processProblemInput(game.currentProblem);
		// cycle backgrounds
		if (Input.isJustPressed("next_background")) {
			game.backgroundNum >= 7? game.backgroundNum = 1 : game.backgroundNum++;
		}
		OutcomeGrid.processInput(game.grid, Input);
	}

	// drop down console
	if (Input.isJustPressed("dd_console")) {
		ddConsole.toggle();
	}
	if (ddConsole.isActive()) {
		ddConsole.processInput(Input);
	}

	// clear logs for collection heading into next frame
	Input.endCollectionPeriod();
}



function update(loop) {

	ddConsole.update(loop, game);

	if (game.mode === Game_Mode.MENU) {
		updateMenu(game.menu, loop);
		ParticleEmitter.updateEffect(snow, loop);
	}
	else if (game.mode === Game_Mode.PLAY) {
		for (let i = 0; i < game.fuzzies.length; i++) {
			Fuzzy.update(game.fuzzies[i], loop, game.grid);
		}
	}
	// sort fuzzies
	function compare(a, b) {
	  if (a.exactPlace.y < b.exactPlace.y){
	    return 1;
	  }
	  if (a.exactPlace.y > b.exactPlace.y){
	    return -1;
	  }
	  return 0;
	}
	game.fuzzies.sort(compare);
}

function processMessageBoard() {

	if (checkMessage("start_game")) {
		game.mode = Game_Mode.PLAY;
		// game.audio.main_theme.play();
	}

	let gridAdd = checkMessage("fuzzy_requested");
	if (gridAdd) {
		dispatchFuzzy(gridAdd.data.place);
	}
	let gridRemove = checkMessage("fuzzy_removal_requested");
	if (gridRemove) {
		undispatchFuzzy(gridRemove.data.place);
	}

	if (checkMessage("experiment_run")) {
		// do stuff
		console.log("Experiment run!!!")
	}
}

// move to fuzzies module
function dispatchFuzzy(place) {
	for (let i = 0; i < game.fuzzies.length; i++) {
		let fuzzy = game.fuzzies[i];
		if (fuzzy.player === game.playerTurn && fuzzy.place.x === 0 && fuzzy.place.y === 1) {
			if (!(fuzzy.migrating.x || fuzzy.migrating.y)) {
				Fuzzy.migrate(fuzzy, place, game.grid);
				return;
			}
		}
	}
	console.log("All fuzzies deployed!")
}
function undispatchFuzzy(place) {
	for (let i = 0; i < game.fuzzies.length; i++) {
		let fuzzy = game.fuzzies[i];
		if (fuzzy.player === game.playerTurn && fuzzy.place.x === place.x && fuzzy.place.y === place.y) {
			if (!(fuzzy.migrating.x || fuzzy.migrating.y)) {
				Fuzzy.migrate(fuzzy, {x: 0, y: 1}, game.grid);
				return;
			}
		}
	}
	console.log("No fuzzies to return!")
}

function draw() {
  // clear the screen
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (game.mode === Game_Mode.MENU) {
  	ctx.drawImage(game.images.menu_background, 0, 0, 1000, 600);
  	ParticleEmitter.drawEffect(snow, ctx);
  	drawMenu(game.menu, ctx);
	}
	else if (game.mode === Game_Mode.PLAY) {
  	ctx.drawImage(game.images[`background${game.backgroundNum}`], 0, 0, 1000, 600);

  	OutcomeGrid.draw(game.grid, game.playerTurn);
		// draw the fuzzy shadows (if used on level)
		if ([1, 3, 4, 5, 6, 7].includes(game.backgroundNum)) {
    	for (let i = 0; i < game.fuzzies.length; i++) {
    		Fuzzy.drawShadow(game.fuzzies[i], ctx, 1);
			}
		}
		// draw fuzzies
  	for (let i = 0; i < game.fuzzies.length; i++) {
  		Fuzzy.draw(game.fuzzies[i], ctx, 0.7); // change alpha back to 0.4 after testing?
		}
		// draw grid labels
		OutcomeGrid.drawLabels(game.grid);
		// draw current problem
		drawProblem(game);
	}

	ddConsole.draw(ctx);
};

// helper functions
function toggleMenu(game) {
	if (game.mode === Game_Mode.MENU) {
		game.mode = Game_Mode.PLAY;
	}
	else if (game.mode === Game_Mode.PLAY) {
		game.mode = Game_Mode.MENU
	}
}

function togglePlayer(game) {
	game.playerTurn === 0? game.playerTurn = 1 : game.playerTurn = 0;
}

// set game loop functions
GameLoop.setProcessInput(processInput);
GameLoop.setUpdate(update);
GameLoop.setDraw(draw);

// start the game loop after page has loaded
// put preloader in here?

GameLoop.start();
