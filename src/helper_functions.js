/*
 * This game operates three systems of position:
 * 1. A 'place' in form (column, row) - where rows are counted bottom (front row) to top
 * 2. Plane on an x scale of -1 to 1 (left to right) and a y scale of 0 to 1 (bottem to top)
 * 3. Position ('pos') on the screen using the canvas coordinate system
 *
 * In summary: place => plane => pos  ||  pos => plane => place
 *
 * Number 3 above creates a pseudo-3D/perspective effect using sqrt/squared maths.
 * This is a simple and possibly sub-optimal solution, but works fine in this case.
 *
 * The following functions provide ways of converting between the three,
 * according to various parameters held in a 'grid' object.
 *
 * Future performace gains could be made by re-writing the Math.sqrt() functions
 * using Math.pow(y, 2), counting from top to bottom instead of bottom to top.
 * Note: I just tested this and it doesn't seem to make much difference.
 */


export function screenToCartesian(pos, scroll) {
  let x = pos.x + scroll.x;
  let y = 600 - pos.y + scroll.y;
  return {x: x, y: y};
}

export function cartesianToScreen(pos, scroll) {
  let x = pos.x - scroll.x;
  let y = 600 - pos.y + scroll.y;
  return {x: x, y: y};
}

export function variation(width) {
    return Math.random() * width - 0.5 * width;
}

export function placeToPlane(place, grid) {
    let xPlane = ((place.x - 0.5) / grid.columns) * 2 - 1;
    let yPlane = (place.y - 0.5) / grid.rows;
    return {x: xPlane, y: yPlane};
}

export function planeToPos(plane, grid) {
    // calculate the y-position
    let adjustedY = (Math.sqrt(3 * plane.y + 1) - 1);
    let yPos = grid.origin.y - adjustedY * grid.height;
    //calculate x-scale and x-position (depends on y)
    let xScale = (1 - 0.35 * adjustedY);
    let xPos = grid.origin.x + plane.x * (xScale * grid.halfWidth);
    // note, returns an xScale which can be used for rough image size scaling
    return {x: xPos, y: yPos, scale: xScale};
}

export function placeToPos(place, grid) {
	return planeToPos(placeToPlane(place, grid), grid);
}

export function posToPlane(pos, grid) {
    // calculate the y-coord
    let adjustedY = (grid.origin.y - pos.y) / grid.height;
    let yPlane = (Math.pow(adjustedY, 2) + 2 * adjustedY) / 3;
    //calculate x-Plane (depends on y)
    let xScale = (1 - 0.35 * adjustedY);
    let xPlane = (pos.x - grid.origin.x) / (xScale * grid.halfWidth);
    // doesn't return xScale, but could in future if needed
    return {x: xPlane, y: yPlane};
}

export function planeToPlace(plane, grid, exact = false) {
    let xPlace = ((plane.x + 1) / 2) * grid.columns + 0.5;
    let yPlace = plane.y * grid.rows + 0.5;
    // round out to whole numbers
    if (!exact) {
    	xPlace = Math.round(xPlace);
    	yPlace = Math.round(yPlace);
    }
    return {x: xPlace, y: yPlace};
}

export function posToPlace(pos, grid, exact = false) {
	let place = planeToPlace(posToPlane(pos, grid), grid, exact);
	if (exact) {
		return place;
	}
	else if (place.x > 0 && place.x <= grid.columns && place.y > 0 && place.y <= grid.rows) {
		return place;
	}
	else {
		return false;
	}
}


// A utility export function to draw a rectangle with rounded corners
// Thanks to Mozilla docs
export function roundedRect(ctx, x, y, width, height, radius, stroke = true, fill = true) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.lineTo(x + width - radius, y + height);
    ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
    ctx.lineTo(x + width, y + radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.lineTo(x + radius, y);
    ctx.arcTo(x, y, x, y + radius, radius);
    if (fill) {ctx.fill()}
    if (stroke) {ctx.stroke()}
}

export function pageToCanvasCoord(coord, canvas, canvasBorder) {
	// adjust for canvas position on screen
    let x = coord.x - canvas.offsetLeft + window.scrollX - canvasBorder;
    let y = coord.y - canvas.offsetTop + window.scrollY - canvasBorder;
    // handle canvas resizing
    if (canvas.clientWidth !== canvas.width) {
    	x = x / (canvas.clientWidth / canvas.width);
    }
    if (canvas.clientHeight !== canvas.height) {
    	y = y / (canvas.clientHeight / canvas.height);
    }
    return {x: Math.ceil(x), y: Math.ceil(y)};
}
