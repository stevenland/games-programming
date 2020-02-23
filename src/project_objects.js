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
    pos: {x: 442, y: 120},
    type: "scratch",
    name: "Fruit Ninja",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/198347",
    hover: false,
  },
  {
    pos: {x: 530, y: 35},
    type: "scratch",
    name: "World's Hardest Game",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/045389",
    hover: false,
  },
  {
    pos: {x: 525, y: 160},
    type: "scratch",
    name: "Tamagotchi",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/523980",
    hover: false,
  },
  {
    pos: {x: 605, y: 100},
    type: "scratch",
    name: "Cookie Clicker",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/822371",
    hover: false,
  },
  {
    pos: {x: 680, y: 42},
    type: "scratch",
    name: "Gradius",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/090335",
    hover: false,
  },
  {
    pos: {x: 695, y: 174},
    type: "scratch",
    name: "Asteroids",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/129234",
    hover: false,
  },
  {
    pos: {x: 810, y: 100},
    type: "scratch",
    name: "Tank",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/384301",
    hover: false,
  },

  // Godot Tutorial Projects
  {
    pos: {x: 365, y: 175},
    type: "godot_tutorial",
    name: "Coding Basics",
    link: "https://sites.google.com/ed.act.edu.au/godot-game-programming/288605",
    hover: false,
  },
  {
    pos: {x: 360, y: 235},
    type: "godot_tutorial",
    name: "Excuse Generator",
    link: "https://sites.google.com/ed.act.edu.au/godot-game-programming/011098",
    hover: false,
  },
  {
    pos: {x: 300, y: 310},
    type: "godot_tutorial",
    name: "Typing Game",
    link: "https://sites.google.com/ed.act.edu.au/godot-game-programming/294423",
    hover: false,
  },
  {
    pos: {x: 460, y: 245},
    type: "godot_tutorial",
    name: "Launcher",
    link: "https://sites.google.com/ed.act.edu.au/godot-game-programming/249510",
    hover: false,
  },

  // Godot Projects
  {
    pos: {x: 445, y: 325},
    type: "godot",
    name: "Frogger",
    link: "https://sites.google.com/ed.act.edu.au/godot-game-programming/510283",
    hover: false,
  },
  {
    pos: {x: 400, y: 410},
    type: "godot",
    name: "Pong",
    link: "https://sites.google.com/ed.act.edu.au/godot-game-programming/328566",
    hover: false,
  },
  {
    pos: {x: 625, y: 315},
    type: "godot",
    name: "Rocket League (2d)",
    link: "https://sites.google.com/ed.act.edu.au/godot-game-programming/252019",
    hover: false,
  },
  {
    pos: {x: 545, y: 445},
    type: "godot",
    name: "1942",
    link: "https://sites.google.com/ed.act.edu.au/godot-game-programming/894734",
    hover: false,
  },
  // third-party Godot tutorials
  {
    pos: {x: 670, y: 410},
    type: "godot_third_party",
    name: "Pixel Platformer",
    link: "https://youtu.be/0713nlQxU7I",
    hover: false,
  },
  {
    pos: {x: 575, y: 555},
    type: "godot_third_party",
    name: "Circle Jump",
    link: "https://www.youtube.com/playlist?list=PLsk-HSGFjnaHH6JyhJI2w8JI76v1F6B-X",
    hover: false,
  },
  {
    pos: {x: 820, y: 330},
    type: "godot_third_party",
    name: "Pokemon-Style Battle",
    link: "https://www.youtube.com/playlist?list=PL9FzW-m48fn1JgK_mavg7ym6nvchF9Yjb",
    hover: false,
  },
  {
    pos: {x: 700, y: 500},
    type: "godot_third_party",
    name: "2D Platformer",
    link: "https://youtu.be/Mc13Z2gboEk",
    hover: false,
  },
  {
    pos: {x: 775, y: 415},
    type: "godot_third_party",
    name: "Intro to 3D",
    link: "https://www.youtube.com/playlist?list=PLsk-HSGFjnaFwmOFrfD4gQQqvgvEUielY",
    hover: false,
  },
  {
    pos: {x: 880, y: 525},
    type: "godot_third_party",
    name: "3d Monkeyball-Style Game",
    link: "https://www.youtube.com/playlist?list=PLda3VoSoc_TSBBOBYwcmlamF1UrjVtccZ",
    hover: false,
  },

  // Art Projects
  {
    pos: {x: 225, y: 180},
    type: "art",
    name: "Finding Assets Online",
    link: "https://sites.google.com/ed.act.edu.au/game-asset-development/623550",
    hover: false,
  },
  {
    pos: {x: 175, y: 245},
    type: "art",
    name: "Vector Art",
    link: "",
    hover: false,
  },
  {
    pos: {x: 70, y: 265},
    type: "art",
    name: "Pixel Art",
    link: "https://www.youtube.com/playlist?list=PLO3K3VFvlU6Akj3W29_nMLZFnwNOVbAzI",
    hover: false,
  },
]

function processProjectInput(s, Input, program) {
  // handle mouse hover
  if (checkInPath(s.pos, 40, screenToCartesian(Input.log.mousePosition, program.scroll))) {
    s.hover = true;
    ctx.canvas.style.cursor = 'pointer';
    // handle mouse click
    if (Input.isMouseJustClicked() && s.link != "") {
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
  // draw icon
  let pos = cartesianToScreen(s.pos, program.scroll);
  if (!s.hover || s.link === "") {
    ctx.globalAlpha = 0.6;
  }
  ctx.drawImage(program.images[s.type], pos.x - 20, pos.y - 20, 40, 40);
  // draw text
  if (s.hover) {
    ctx.font = "20px px10";
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
    let pos = cartesianToScreen(s.pos, program.scroll);
    ctx.fillText(s.name, pos.x + 1, pos.y + 1 - 25);
    if (s.link === "") {
      ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
    }
    else {
      ctx.fillStyle = `rgba(${140 + program.colorShifter}, ${70 + program.colorShifter}, ${110 + program.colorShifter}, 1)`;
    }
    ctx.fillText(s.name, pos.x, pos.y - 25);
  }


  ctx.restore();

}
