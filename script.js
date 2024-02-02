const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const indexColorMap = {
  0: 'rgb(30, 065, 085)',
  1: 'rgb(200, 225, 245)',
  2: 'rgb(10, 105, 100)',
  3: 'rgb(100, 225, 200)'
}

// Make sure the canvas is a square
const size = Math.min(window.innerWidth, window.innerHeight);
var width = canvas.width = size;
var height = canvas.height = size;

const rowCount = 20;
const colCount = 20;
const cellSize = Math.floor(size / rowCount);

width = canvas.width = cellSize * colCount;
height = canvas.height = cellSize * rowCount;

var divisons = 4

var grid = createGrid(divisons);
var balls = [];

function createGrid(divisions) {
  var grid = [];
  const halfColCount = Math.floor(colCount / 2);
  const halfRowCount = Math.floor(rowCount / 2);
  for (var i = 0; i < rowCount; i++) {
    grid[i] = [];
    for (var j = 0; j < colCount; j++) {
      let index;
      if (divisions === 2) { // 2 divisions
        if (j < halfColCount) {
          index = 0; // Left
        } else {
          index = 1; // Right
        }
      } else if (divisions === 4) { // 4 divisions
        if (j < halfColCount) {
          if (i < halfRowCount) {
            index = 0; // Top left
          } else {
            index = 3; // Bottom left
          }
        } else {
          if (i < halfRowCount) {
            index = 1; // Top right
          } else {
            index = 2; // Bottom right
          }
        }
      }
      grid[i][j] = {x: j, y: i, index: index};
    }
  }
  return grid;
}


function drawGrid() {
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      const color = indexColorMap[grid[i][j].index];
      ctx.fillStyle = color;
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}


class Ball {
  constructor(x, y, radius, index, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.index = index;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = indexColorMap[this.index];
    ctx.fill();
  }

  update() {
    this.draw();

    this.x += this.dx;
    this.y += this.dy;

    this.checkBounds();
  }

  checkBounds() {
    if (this.x + this.radius > width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
  }

  checkCellCollision(cell) {
    const dx = this.x - Math.max(cell.x * cellSize, Math.min(this.x, (cell.x + 1) * cellSize));
    const dy = this.y - Math.max(cell.y * cellSize, Math.min(this.y, (cell.y + 1) * cellSize));
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    if(this.index === cell.index){
      if (distance < this.radius) {
        if (Math.abs(dx) > Math.abs(dy)) {
          this.dx = -this.dx; // collision was horizontal
        } 
        if (Math.abs(dx) < Math.abs(dy)){
          this.dy = -this.dy; // collision was vertical
        }
        cell.index = (cell.index + 1) % divisons;
      }
    }
  }
  
}

if (divisons == 2) {
  balls.push(new Ball(0 + cellSize, 0 + cellSize, cellSize/3, 1, 1, 2));
  balls.push(new Ball(width - cellSize, height - cellSize, cellSize/3, 0, -2, -1  ));
}
if (divisons == 4) {
  balls.push(new Ball(0 + cellSize, 0 + cellSize, cellSize/2, 2, 1, 4));
  balls.push(new Ball(width - cellSize, height - cellSize, cellSize/2, 3, -1, 4));
  balls.push(new Ball(0 + cellSize, height - cellSize, cellSize/2, 1, 1, -4));
  balls.push(new Ball(width - cellSize, 0 + cellSize, cellSize/2, 0, -1, -4));
}

setInterval(() => {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillRect(0, 0, width, height);

  drawGrid();

  balls.forEach(ball => {
    grid.forEach(row => {
      row.forEach(cell => {
        ball.checkCellCollision(cell);
      });
    });

    ball.update();
  });

}, 1000 / 500);
