const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Make sure the canvas is a square
const size = Math.min(window.innerWidth, window.innerHeight);
var width = canvas.width = size;
var height = canvas.height = size;

const rowCount = 20;
const colCount = 20;
const cellSize = Math.floor(size / rowCount);

width = canvas.width = cellSize * colCount;
height = canvas.height = cellSize * rowCount;

const createGrid = () => {
  var grid = [];
  const halfColCount = Math.floor(colCount / 2); // Calculate the half here
  for (var i = 0; i < rowCount; i++) {
    grid[i] = [];
    for (var j = 0; j < colCount; j++) {
      if (j < halfColCount) {
        grid[i][j] = 0; // Left half
      } else {
        grid[i][j] = 1; // Right half
      }
    }
  }
  return grid;
}
var grid = createGrid();


// Function to draw a grid on a canvas
function drawGrid(ctx, grid, cellSize) {
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == 1) {
        ctx.fillStyle = 'rgb(200, 225, 245)';
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
      else if(grid[i][j] == 0){
        ctx.fillStyle = 'rgb(30, 065, 085)';
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }
}

setInterval(() => {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillRect(0, 0, width, height);

  drawGrid(ctx, grid, cellSize);
}, 1000 / 60);
