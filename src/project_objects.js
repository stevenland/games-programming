// A module for storing and acting on "project" objects,
// which show info for projects in the course and link
// to the projects themselves.
import {screenToCartesian, cartesianToScreen} from "./helper_functions.js";
export {drawProject, processProjectInput};

// get the canvas and the 2d context
const ctx = document.getElementById('pane').getContext('2d');

export const projects = [
  {
    pos: {x: 1000, y: 600},
    type: "godot",
    name: "Scrolling Shooter",
    link: "http://mrLman.com",
    hover: false,
  },
  {
    pos: {x: 500, y: 65},
    type: "art",
    name: "Basic Pixel Art",
    link: "http://mrLman.com",
    hover: false,
  },
  {
    pos: {x: 270, y: 300},
    type: "scratch",
    name: "Pong",
    link: "http://mrLman.com",
    hover: false,
  }
]

function processProjectInput(s, Input, program) {
  // handle mouse hover
  if (checkInPath(s.pos, 40, screenToCartesian(Input.log.mousePosition, program.scroll))) {
    s.hover = true;
    ctx.canvas.style.cursor = 'pointer';
    // handle mouse click
    if (Input.isMouseJustClicked()) {
      window.open(s.link, "_blank");
    }
  } else {
    s.hover = false;
    ctx.canvas.style.cursor = 'default';
  }
}

function checkInPath(pos, size, mousePos) {
  let missLeft = mousePos.x < pos.x - size/2;
  let missRight = mousePos.x > pos.x + size/2;
  let missUp = mousePos.y > pos.y + size/2;
  let missDown = mousePos.y < pos.y - size/2;
  return (!(missLeft || missRight || missUp || missDown));
}

function drawProject(s, program, ctx) {
  ctx.save();

  let pos = cartesianToScreen(s.pos, program.scroll);
  ctx.drawImage(program.images[s.type], pos.x - 20, pos.y - 20, 40, 40);

  if (s.hover) {
    ctx.font = "20px px10";
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
    let pos = cartesianToScreen(s.pos, program.scroll);
    ctx.fillText(s.name, pos.x + 1, pos.y + 1 - 25);
    ctx.fillStyle = `rgba(${140 + program.colorShifter}, ${70 + program.colorShifter}, ${110 + program.colorShifter}, 1)`;
    ctx.fillText(s.name, pos.x, pos.y - 25);
  }


  ctx.restore();

}
