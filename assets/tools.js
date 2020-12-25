/*   
     Name: David Nguyen (891362089)
     Email: vietcloudx@csu.fullerton.edu
     Class: CPSC 335-05
     Completion date: 9/25/19
     Project: Cella Ant 12
     Project #: 1
     Module Details: This file contains the following functions:
         draw_grid() - draws line on the canvas so that it looks like a grid.
         draw_triangle() - draws the triangle on the canvas depending on its direction.
         draw_rect() - draws the block on the canvas after triangle traversed on it.
         cella_ant() - traversal algorithm for the triangle (LLRR).
*/
// ===============================  draw_grid ===============================
// draws the grid for the cella ant traversal.
function draw_grid(rctx, rminor, rmajor, rstroke, rfill) {
  rctx.save();
  rctx.strokeStyle = rstroke;
  rctx.fillStyle = rfill;
  let width = rctx.canvas.width;
  let height = rctx.canvas.height;
  for (var ix = 0; ix < width; ix += rminor) {
    rctx.beginPath();
    rctx.moveTo(ix, 0);
    rctx.lineTo(ix, height);
    rctx.lineWidth = (ix % rmajor == 0) ? 0.5 : 0.25;
    rctx.stroke();
    if (ix % rmajor == 0) {
      rctx.fillText(ix / 10, ix, 10);
    }
  }
  for (var iy = 0; iy < height; iy += rminor) {
    rctx.beginPath();
    rctx.moveTo(0, iy);
    rctx.lineTo(width, iy);
    rctx.lineWidth = (iy % rmajor == 0) ? 0.5 : 0.25;
    rctx.stroke();
    if (iy % rmajor == 0) {
      rctx.fillText(iy / 10, 0, iy + 10);
    }
  }
  rctx.restore();
}
// ===============================  draw_triangle ===============================
// draws the triangle as a marker on the grid.
function draw_triangle(ctx, d, rx, ry) {
  ctx.save();
  // BL Triangle.
  ctx.fillStyle = 'white';
  ctx.beginPath();

  //West
  if (d === 0) {
    ctx.moveTo(rx, ry + 10);
    ctx.lineTo(rx + 20, ry);
    ctx.lineTo(rx + 20, ry + 20);
  }
  //South 
  else if (d === 1) {
    ctx.moveTo(rx + 10, ry + 20);
    ctx.lineTo(rx, ry);
    ctx.lineTo(rx + 20, ry);
  }
  //East 
  else if (d === 2) {
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + 20, ry + 10);
    ctx.lineTo(rx, ry + 20);
  }
  //North 
  else if (d === 3) {
    ctx.moveTo(rx + 10, ry);
    ctx.lineTo(rx, ry + 20);
    ctx.lineTo(rx + 20, ry + 20);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
// ===============================  draw_grid ===============================
// draws the rectangle each time the triangle traversed a cell.
function draw_rect(ctx, color_val, ax, ay) {
  ctx.save();
  ctx.beginPath();

  //Black
  if (color_val == 0) {
    ctx.fillStyle = 'green';
    ctx.rect(ax, ay, 20, 20);
    ctx.fill();
  }
  //Red 
  else if (color_val === 1) {
    ctx.fillStyle = 'red';
    ctx.rect(ax, ay, 20, 20);
    ctx.fill();
  }
  //Yellow 
  else if (color_val === 2) {
    ctx.fillStyle = 'yellow';
    ctx.rect(ax, ay, 20, 20);
    ctx.fill();
  }
  //Blue 
  else if (color_val === 3) {
    ctx.fillStyle = 'blue';
    ctx.rect(ax, ay, 20, 20);
    ctx.fill();
  }
  ctx.closePath();
  ctx.restore();
}


// ===============================  draw_grid ===============================
// LLRR traversal algorithm
function cella_ant(rctx) {

  //the number will represent where the marker is pointing to.
  // 0 (West), 1 (South), 2 (East), 3 (North)
  let dir = 0;
  //triangle location
  let x = 21;
  let y = 21;
  //initialing the color box
  let rpx = 400;
  let rpy = 400;
  //initializing the table's elements to unvisited (-1).
  let table = [[], []];
  //controls the environment.
  let playback = null;
  //moves the cell 1s.
  let rate = 1000;
  //inital = 0, play = 1, pause = 2
  let mode = 0;
  //stops at a specific index.
  let stopping = 100;
  let idx = 0;
  //initialize environment.
  initState();

  //event handler
  document.body.querySelector("#rates").addEventListener('click', e => changeRates(e));
  document.body.querySelector(".play-btn").addEventListener('click', play);
  document.body.querySelector(".step-btn").addEventListener('click', step);
  document.body.querySelector(".pause-btn").addEventListener('click', pause);
  document.body.querySelector(".reset-btn").addEventListener('click', reset);
  
  function initState() {
    //resets the environment.
    dir = 0;
    x = 21;
    y = 21;
    rpx = 400;
    rpy = 400;
    table = [[], []];
    playback = null;
    rate = 1000;
    mode = 0;
    stopping = 999999999;
    idx = 0;
    for (let i = 0; i < 41; i++) {
      table[i] = [];
      for (let j = 0; j < 41; j++) {
        table[i][j] = -1;
      }
    }
    table[x][y] = 0;
    draw_rect(rctx, table[x][y], rpx, rpy);
    draw_triangle(rctx, dir, rpx, rpy);

  }

  function reset() {
    //pause the timer.
    clearInterval(playback);
    let canvas = document.querySelector("#grid");
    //clears the grid
    rctx.clearRect(0, 0, canvas.width, canvas.height);
    //redraws the grid
    draw_grid(rctx, 20, 50, 'white', 'yellow');
    initState();
  }

  function pause() {
    //pause the timer
    clearInterval(playback);
    mode = 2;
  }

  function play() {
    //don't repeat the play.
    if (mode !== 1) {
      mode = 1;
      //iteratively draws each cell.
      playback = setInterval(() => {
        if (idx === stopping) {
          mode = 0;
          clearInterval(playback);
        }
        traverse();
      }, rate);
    }
  }
  function step() {
    //don't step when on play mode.
    if (mode !== 1) {
      mode = 3;
      traverse();
      mode = 2;
    }
  }
  function changeRates(e) {
    if (e.target.value != rate) {
      reset();
      rate = e.target.value;
    }
  }

  function traverse() {
    //if current state is greater than blue (3) reset it to black (0).
    if (table[x][y] > 3) {
      table[x][y] = 0;
    }

    draw_rect(rctx, table[x][y], rpx, rpy);

    //Turn right if current state is black or red.
    if (table[x][y] == 0 || table[x][y] == 1) {
      if (dir == 0) {
        dir = 3;
        y++;
        rpy -= 20;
      } else if (dir == 1) {
        dir = 0;
        x++;
        rpx -= 20;
      } else if (dir == 2) {
        dir = 1;
        y--;
        rpy += 20;
      } else if (dir == 3) {
        dir = 2;
        x--;
        rpx += 20;
      }
    }
    //Turn left if current state state is yellow or blue. 
    else {
      if (dir == 0) {
        dir = 1;
        y--;
        rpy += 20;
      } else if (dir == 1) {
        dir = 2;
        x--;
        rpx += 20;
      } else if (dir == 2) {
        dir = 3;
        y++;
        rpy -= 20;
      } else if (dir == 3) {
        dir = 0;
        x++;
        rpx -= 20;
      }
    }
    table[x][y]++;
    draw_triangle(rctx, dir, rpx, rpy);
    idx++;
  }

}


