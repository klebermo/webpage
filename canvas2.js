var canvas = document.getElementById("canvas") ;
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

ctx.fillStyle = "#ff00ff";
ctx.fillRect(55, 55, 175, 175);
ctx.fillStyle = "rgba(0.25, 0.25, 0.25, 0.3)";
ctx.fillRect(95, 95, 175, 175);
