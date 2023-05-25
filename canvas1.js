/*
var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");

// Get the DPR and size of the canvas
const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();

// Set the "actual" size of the canvas
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

// Scale the context to ensure correct drawing operations
ctx.scale(dpr, dpr);

// Set the "drawn" size of the canvas
canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;

ctx.beginPath();
ctx.moveTo(0,0);
ctx.strokeStyle = "#00ff00";
ctx.lineWidth = 5;
ctx.lineTo(1280, 800);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(0,800);
ctx.strokeStyle = "#ff0000";
ctx.lineWidth = 5;
ctx.lineTo(1280,0);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(0,400);
ctx.strokeStyle = "#0000ff";
ctx.lineWidth = 5;
ctx.lineTo(1280,400);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(640,0);
ctx.strokeStyle = "#0000ff";
ctx.lineWidth = 5;
ctx.lineTo(640,800);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = "#ff00ff";
ctx.arc(320, 200, 50, 0, 2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = "#ff00ff";
ctx.arc(960, 200, 50, 0, 2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = "#ff00ff";
ctx.arc(320, 600, 50, 0, 2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = "#ff00ff";
ctx.arc(960, 600, 50, 0, 2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = "#ffff00";
ctx.arc(480, 200, 50, 0, 2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = "#ffff00";
ctx.arc(480, 600, 50, 0, 2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = "#ffff00";
ctx.arc(800, 600, 50, 0, 2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = "#ffff00";
ctx.arc(800, 200, 50, 0, 2*Math.PI);
ctx.stroke();
*/

var ui_layer = document.getElementById("ui-layer");
var game_layer = document.getElementById("game-layer");
var background_layer = document.getElementById("background-layer");

// Get the DPR and size of the canvas
const dpr = window.devicePixelRatio;
const rect_ui = ui_layer.getBoundingClientRect();
const rect_game = game_layer.getBoundingClientRect();
const rect_bg = background_layer.getBoundingClientRect();

// Set the "actual" size of the canvas
ui_layer.width = rect_ui.width * dpr;
ui_layer.height = rect_ui.height * dpr;

game_layer.width = rect_game.width * dpr;
game_layer.height = rect_game.height * dpr;

background_layer.width = rect_bg.width * dpr;
background_layer.height = rect_bg.height * dpr;

var ctx_ui = ui_layer.getContext("2d");
var ctx_game = game_layer.getContext("2d");
var ctx_bg = background_layer.getContext("2d");

// Scale the context to ensure correct drawing operations
ctx_ui.scale(dpr, dpr);
ctx_game.scale(dpr, dpr);
ctx_bg.scale(dpr, dpr);

// Set the "drawn" size of the canvas
ui_layer.style.width = `${rect_ui.width}px`;
ui_layer.style.height = `${rect_ui.height}px`;

game_layer.style.width = `${rect_game.width}px`;
game_layer.style.height = `${rect_game.height}px`;

background_layer.style.width = `${rect_bg.width}px`;
background_layer.style.height = `${rect_bg.height}px`;

function draw_shapes() {
    ctx_bg.fillStyle = "rgb(200,0,0)";
    ctx_bg.fillRect(180, 10, 50, 50);
    ctx_bg.fillStyle = "rgba(0,0,200,0.5)";
    ctx_bg.fillRect(200, 30, 50, 50);

    ctx_bg.fillRect(125, 125, 100, 100);
    ctx_bg.clearRect(145, 145, 60, 60);
    ctx_bg.strokeRect(150, 150, 50, 50);    

    ctx_bg.beginPath();
    ctx_bg.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    ctx_bg.moveTo(110, 75);
    ctx_bg.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
    ctx_bg.moveTo(65, 65);
    ctx_bg.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
    ctx_bg.moveTo(95, 65);
    ctx_bg.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
    ctx_bg.stroke();
    
    ctx_ui.font = "48px serif";
    ctx_ui.fillText("Hello world", 550, 250);
}

let raf;
let running = false;

const ball = {
    x: 250,
    y: 250,
    vx: 5,
    vy: 2,
    radius: 25,
    color: "blue",
    draw() {
        ctx_game.beginPath();
        ctx_game.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx_game.closePath();
        ctx_game.fillStyle = this.color;
        ctx_game.fill();
    },
};

function clear() {
    ctx_game.clearRect(0, 0, game_layer.width, game_layer.height);
    //ctx_game.fillStyle = "rgba(255, 255, 255, 0.3)";
    //ctx_game.fillRect(0, 0, game_layer.width, game_layer.height);
}

function draw() {
    clear();
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y + ball.vy > game_layer.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
    }

    if (ball.x + ball.vx > game_layer.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
    }

    raf = window.requestAnimationFrame(draw);
}

ui_layer.addEventListener("mousemove", (e) => {
    if (!running) {
      clear();
      ball.x = e.clientX;
      ball.y = e.clientY;
      ball.draw();
    }
});
  
ui_layer.addEventListener("click", (e) => {
    if (!running) {
      raf = window.requestAnimationFrame(draw);
      running = true;
    }
});
  
ui_layer.addEventListener("mouseout", (e) => {
    window.cancelAnimationFrame(raf);
    running = false;
});

ball.draw();
draw_shapes();
