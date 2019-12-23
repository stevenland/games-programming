// A module for storing and acting on "project" objects,
// which show info for projects in the course and link
// to the projects themselves.
import {screenToCartesian, cartesianToScreen} from "./helper_functions.js";
export {drawProject, processProjectInput};

// get the canvas and the 2d context
const ctx = document.getElementById('pane').getContext('2d');

export const projects = [
  // Scratch Projects
  {
    pos: {x: 420, y: 140},
    type: "scratch",
    name: "Action Animation",
    link: "",
    hover: false,
  },
  {
    pos: {x: 473, y: 60},
    type: "scratch",
    name: "Survival Game",
    link: "",
    hover: false,
  },
  {
    pos: {x: 573, y: 90},
    type: "scratch",
    name: "Maze Race",
    link: "",
    hover: false,
  },
  {
    pos: {x: 700, y: 64},
    type: "scratch",
    name: "Horizontal Shooter",
    link: "",
    hover: false,
  },
  {
    pos: {x: 665, y: 200},
    type: "scratch",
    name: "Clicker Game",
    link: "",
    hover: false,
  },
  {
    pos: {x: 930, y: 137},
    type: "scratch",
    name: "Evasion Game",
    link: "",
    hover: false,
  },
  {
    pos: {x: 1110, y: 90},
    type: "scratch",
    name: "Extension",
    link: "",
    hover: false,
  },




  // Godot Projects
  {
    pos: {x: 350, y: 270},
    type: "godot",
    name: "Secret Console",
    link: "",
    hover: false,
  },
  {
    pos: {x: 470, y: 325},
    type: "godot",
    name: "Text Mini-Games",
    link: "",
    hover: false,
  },
  {
    pos: {x: 396, y: 428},
    type: "godot",
    name: "Pong",
    link: "",
    hover: false,
  },
  {
    pos: {x: 671, y: 366},
    type: "godot",
    name: "Car Polo",
    link: "",
    hover: false,
  },
  {
    pos: {x: 578, y: 527},
    type: "godot",
    name: "Vertical Shooter",
    link: "",
    hover: false,
  },
  {
    pos: {x: 772, y: 477},
    type: "godot",
    name: "Top Down Racer",
    link: "",
    hover: false,
  },
  {
    pos: {x: 534, y: 670},
    type: "godot",
    name: "Scrolling Platformer",
    link: "",
    hover: false,
  },
  {
    pos: {x: 923, y: 495},
    type: "godot",
    name: "Adventure RPG",
    link: "",
    hover: false,
  },
  {
    pos: {x: 1101, y: 550},
    type: "godot",
    name: "3D Ball Maze",
    link: "",
    hover: false,
  },
  {
    pos: {x: 978, y: 738},
    type: "godot",
    name: "First-Person Shooter",
    link: "",
    hover: false,
  },
  {
    pos: {x: 1140, y: 760},
    type: "godot",
    name: "3D Platformer",
    link: "",
    hover: false,
  },
  // Asset Development Projects
  {
    pos: {x: 209, y: 179},
    type: "art",
    name: "Basic Pixel Art",
    link: "",
    hover: false,
  },
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
  if (mousePos.x && mousePos.y) {
    let missLeft = mousePos.x < pos.x - size/2;
    let missRight = mousePos.x > pos.x + size/2;
    let missUp = mousePos.y > pos.y + size/2;
    let missDown = mousePos.y < pos.y - size/2;
    return (!(missLeft || missRight || missUp || missDown));
  }
  else {
    return false;
  }
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
