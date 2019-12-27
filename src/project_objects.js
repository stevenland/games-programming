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
    pos: {x: 530, y: 50},
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
    pos: {x: 615, y: 110},
    type: "scratch",
    name: "Cookie Clicker",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/822371",
    hover: false,
  },
  {
    pos: {x: 690, y: 42},
    type: "scratch",
    name: "Gradius",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/090335",
    hover: false,
  },
  {
    pos: {x: 703, y: 174},
    type: "scratch",
    name: "Asteroids",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/129234",
    hover: false,
  },
  {
    pos: {x: 825, y: 105},
    type: "scratch",
    name: "Tank",
    link: "https://sites.google.com/ed.act.edu.au/scratch-game-programming/384301",
    hover: false,
  },

  // Godot Tutorial Projects
  {
    pos: {x: 365, y: 180},
    type: "godot_tutorial",
    name: "Hidden Console",
    link: "",
    hover: false,
  },
  {
    pos: {x: 400, y: 245},
    type: "godot_tutorial",
    name: "Secret Keys",
    link: "",
    hover: false,
  },
  {
    pos: {x: 507, y: 283},
    type: "godot_tutorial",
    name: "_____ Launcher",
    link: "",
    hover: false,
  },
  {
    pos: {x: 346, y: 336},
    type: "godot_tutorial",
    name: "Excuse Generator",
    link: "",
    hover: false,
  },

  // Godot Projects
  {
    pos: {x: 449, y: 368},
    type: "godot",
    name: "Pong",
    link: "",
    hover: false,
  },
  {
    pos: {x: 643, y: 310},
    type: "godot",
    name: "Rocket League (2d)",
    link: "",
    hover: false,
  },
  {
    pos: {x: 570, y: 425},
    type: "godot",
    name: "1942",
    link: "",
    hover: false,
  },
  // third-party Godot tutorials
  {
    pos: {x: 520, y: 555},
    type: "godot_third_party",
    name: "Circle Jump",
    link: "https://www.youtube.com/playlist?list=PLsk-HSGFjnaHH6JyhJI2w8JI76v1F6B-X",
    hover: false,
  },
  {
    pos: {x: 828, y: 364},
    type: "godot_third_party",
    name: "Mobile RPG",
    link: "https://www.youtube.com/playlist?list=PL9FzW-m48fn1JgK_mavg7ym6nvchF9Yjb",
    hover: false,
  },
  {
    pos: {x: 805, y: 525},
    type: "godot_third_party",
    name: "3d Maze Game",
    link: "https://www.youtube.com/playlist?list=PLda3VoSoc_TSBBOBYwcmlamF1UrjVtccZ",
    hover: false,
  },


  // Art Projects
  {
    pos: {x: 245, y: 180},
    type: "art",
    name: "Finding Images",
    link: "",
    hover: false,
  },
  {
    pos: {x: 121, y: 198},
    type: "art",
    name: "Fonts & Sounds",
    link: "",
    hover: false,
  },
  {
    pos: {x: 177, y: 265},
    type: "art",
    name: "Vector Art",
    link: "",
    hover: false,
  },
  {
    pos: {x: 62, y: 283},
    type: "art",
    name: "Pixel Art",
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
