import * as Help from "./helper_functions.js";
import {postMessage} from "./message_system.js";


export {create, processInput, update, draw, drawLabels};

// get the canvas and the 2d context
const ctx = document.getElementById('pane').getContext('2d');

// module constants
const lineColor = 'rgba(0, 0, 100, 0.3)';
const blockColors = ['rgba(100, 100, 255, 0.25)', 'rgba(255, 90, 110, 0.25)']; // matches up with player numbers
const lineWidth = 1;

function create(labels) {
	const s = {}; // state
	s.labels = labels;
  s.active = true;
  s.highlightPlace = {x: 1, y: 1};
  s.origin = {x: 500, y: 590}; // tweak later
  s.rows = labels.length;
  s.columns = labels[0].length;
  s.halfWidth = 400;
  s.height = 350;

  return s;
}

function processInput(grid, Input) {
	// mouse move
	if (Input.log.mouseMoving) {
		let newHighlightPlace = Help.posToPlace(Input.log.mousePosition, grid);

		if (newHighlightPlace) {
			grid.highlightPlace = newHighlightPlace;
			ctx.canvas.style.cursor = 'pointer';
		}
		else {
			ctx.canvas.style.cursor = 'default';
		}
	}
	// mouse click - use simple messaging system to contact fuzzies
	if (Input.log.mouseJustClicked) {
		const gridClick = Help.posToPlace(Input.log.mousePosition, grid);
		if (gridClick) {
			if (Input.log.mouseJustClicked === "main") {
				postMessage({type: "fuzzy_requested", data: {place: gridClick}});
			}
			else {
				postMessage({type: "fuzzy_removal_requested", data: {place: gridClick}});
			}
		}
	}
	// key input
	if (Input.isJustPressed("ui_left")) {
		if (grid.highlightPlace.x > 1) {
			grid.highlightPlace.x--;
		}
	}
	if (Input.isJustPressed("ui_right")) {
		if (grid.highlightPlace.x < grid.columns) {
			grid.highlightPlace.x++;
		}
	}
	if (Input.isJustPressed("ui_down")) {
		if (grid.highlightPlace.y > 1) {
			grid.highlightPlace.y--;
		}
	}
	if (Input.isJustPressed("ui_up")) {
		if (grid.highlightPlace.y < grid.rows) {
			grid.highlightPlace.y++;
		}
	}
	if (Input.isJustPressed("deploy_fuzzy")) {
		postMessage({type: "fuzzy_requested", data: {place: grid.highlightPlace}});
	}
	if (Input.isJustPressed("remove_fuzzy")) {
		postMessage({type: "fuzzy_removal_requested", data: {place: grid.highlightPlace}});
	}
}


function processKeyInput(grid, key) {
	if (grid.active) {
	  // process arrow key input
	  if (key.key === 'ArrowRight') {
	    if (grid.highlightPlace.x < grid.columns) {grid.highlightPlace.x++}
	  }
	  else if (key.key === 'ArrowLeft') {
	    if (grid.highlightPlace.x > 1) {grid.highlightPlace.x--}
	  }
	  else if (key.key === 'ArrowDown') {
	    if (grid.highlightPlace.y > 1) {grid.highlightPlace.y--}
	  }
	  else if (key.key === 'ArrowUp') {
	    if (grid.highlightPlace.y < grid.rows) {grid.highlightPlace.y++}
	  }
	}
}

function update(loop, game) {

}


function draw(grid, playerNo) {
	if (grid.active) {
    let xInterval = 2 / grid.columns;
    let yInterval = 1 / grid.rows;

    // draw the highlight
    ctx.save();
    ctx.fillStyle = blockColors[playerNo];

    // find the coordinates of the four corners of the shape
    let h = {x: grid.highlightPlace.x - 0.5, y: grid.highlightPlace.y - 0.5};
    let h2 = {x: grid.highlightPlace.x - 0.5, y: grid.highlightPlace.y + 0.5};
    let h3 = {x: grid.highlightPlace.x + 0.5, y: grid.highlightPlace.y + 0.5};
    let h4 = {x: grid.highlightPlace.x + 0.5, y: grid.highlightPlace.y - 0.5};

    let pointA = Help.planeToPos(Help.placeToPlane(h, grid), grid);
    let pointB = Help.planeToPos(Help.placeToPlane(h2, grid), grid);
    let pointC = Help.planeToPos(Help.placeToPlane(h3, grid), grid);
    let pointD = Help.planeToPos(Help.placeToPlane(h4, grid), grid);

    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.lineTo(pointC.x, pointC.y);
    ctx.lineTo(pointD.x, pointD.y);
    ctx.closePath();
    ctx.fill();

    ctx.restore();


    // draw the grid
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;

    // draw columns
    for (let x = -1.0; x <= 1.0001; x += xInterval) { // fix floating point
      let point1 = Help.planeToPos({x: x, y: 1}, grid);
      let point2 = Help.planeToPos({x: x, y: 0}, grid);

      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);
      ctx.stroke();
    }
    for (let y = 0; y <= 1.0001; y += yInterval) {
      let point1 = Help.planeToPos({x: -1, y: y}, grid);
      let point2 = Help.planeToPos({x: 1, y: y}, grid);

      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);
      ctx.stroke();
    }
	  ctx.restore();
  }
}

function drawLabels(grid) {
	if (grid.active) {
		ctx.save();
		function drawTextElement(text, place, fontSize) {
			let pos = Help.planeToPos(Help.placeToPlane(place, grid), grid);
			ctx.font = fontSize.toString() + "px Merienda";
			ctx.textAlign = 'center';
			ctx.shadowBlur = 10;
			ctx.shadowOffsetX = -2;
			ctx.shadowOffsetY = 2;
			ctx.shadowColor = "rgb(255, 255, 255)"
			// ctx.fillStyle = "rgba(80, 60, 60, 1)";
			//ctx.fillText(text, pos.x - 1, pos.y + 1);
			ctx.fillStyle = "rgba(135, 70, 160, 1)";
			ctx.fillText(text, pos.x, pos.y);
		}

		// so this could probably be re-written in a clearer way!
		let textOffset = 0.4 //the proportion off center towards the bottom - 0.5 is all the way
		for (let r = 0; r < grid.labels.length; r++) {
			for (let c = 0; c < grid.labels[r].length; c++) {
				drawTextElement(grid.labels[r][c], {x: c + 1, y: r + 1 - textOffset}, 28 - (2 * grid.columns));
			}
		}

		ctx.restore();
	}
}
