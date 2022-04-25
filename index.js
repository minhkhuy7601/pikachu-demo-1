let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
//SETUP CANVAS
canvas.width = window.innerWidth;
canvas.height = window.innerHeight ;
// console.log(window.innerWidth, window.innerHeight)

let audioBG = new Audio("./audio/audio-bg.mp3");
let sound1 = new Audio("./audio/sound1.mp3");
let sound2 = new Audio("./audio/sound2.mp3")
let sound3 = new Audio("./audio/sound4.mp3")

let width = canvas.width;
let height = canvas.height;

//ROWS AND COLUMNS
let rows = 10;
let cols = 20;

let matrix = [];
let items = [];
let lines = [];
let itemsSelected = [];
let track = [];

let n = rows * cols;
let size = Math.floor(height / 10);
let gap = 0;

//CANVAS IN CENTER SCREEN
let pointBeginDrawX = width / 2 - (size * cols) / 2;
let pointBeginDrawY = height / 2 - (size * rows) / 2;

// INIT NODE LIST
function initMatrix() {
  let random = [];
  let x = (rows * cols - 2 * cols - 2 * rows + 4) / 4;
  for (let i = 0; i < x; i++) {
    random.push(0);
  }

  for (let i = 0; i < rows; i++) {
    let newRow = new Array();
    for (let j = 0; j < cols; j++) {
      let image1 = new Image();
      let item;
      let value;
      if (i > 0 && i < rows - 1 && j > 0 && j < cols - 1) {
        newRow.push(1);
        let rd = Math.floor(Math.random() * x);
        while (random[rd] >= 4) {
          rd = Math.floor(Math.random() * x);
        }
        value = rd;
        random[rd]++;
        image1.src = `./images/${rd}.png`;
        item = new Item(i, j, false, image1, value);
      } else {
        newRow.push(0);
        image1.src = `./images/0.png`;
        value = -1;
        item = new Item(i, j, true, image1, value);
      }
      image1.addEventListener("load", () => {
        items.push(item);
      });
    }
    matrix.push(newRow);
  }

}




//OBJECT ITEM CARD
function Item(i, j, flag, img, value) {
  this.x = j * size + j * gap + pointBeginDrawX;
  this.y = i * size + i * gap + pointBeginDrawY;
  this.i = i;
  this.j = j;
  this.flag = flag;
  this.isSelect = false;
  this.value = value;
  this.wrong = false;
  this.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    if (!this.flag) {
      ctx.fillStyle = "#c7ecee";
      ctx.fillRect(this.x, this.y, size, size);
      if (this.isSelect) {
        ctx.fillStyle = "#f6e58d";
        ctx.fillRect(this.x, this.y, size, size);
      }
      if(this.wrong){
        ctx.fillStyle = "#ff7675";
        ctx.fillRect(this.x, this.y, size, size);
      }
      ctx.strokeStyle = "#053742";
      ctx.drawImage(img, this.x + 5, this.y + 5, size - 10, size - 10);
      ctx.strokeRect(this.x, this.y, size, size);
      ctx.strokeStyle = "#dff9fb";
      ctx.lineWidth = 4;
      ctx.strokeRect(this.x + 3, this.y + 3, size - 6, size - 6);
    } 
  };
}

//OBJECT ITEM LINE
function Line(begin, end) {
  this.yBegin =
    begin.i * size +
    size / 2 +
    begin.i * gap +
    pointBeginDrawY;
  this.xBegin =
    begin.j * size + size / 2 + begin.j * gap + pointBeginDrawX;
  this.yEnd =
    end.i * size +
    size / 2 +
    end.i * gap +
    pointBeginDrawY;
  this.xEnd =
    end.j * size + size / 2 + end.j * gap + pointBeginDrawX;
  this.draw = function () {
    //draw line background
    ctx.beginPath();
    ctx.moveTo(this.xBegin, this.yBegin);
    ctx.lineTo(this.xEnd, this.yEnd);
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#0984e3";
    ctx.stroke();
    //draw line main
    ctx.beginPath();
    ctx.moveTo(this.xBegin, this.yBegin);
    ctx.lineTo(this.xEnd, this.yEnd);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#74b9ff";
    ctx.stroke();
  };
}


//DRAW GRAPHIC GAME
function displayItems() {
  audioBG.volume = 0.1;
  audioBG.play();
  audioBG.loop = true;
  
  let interval = setInterval(() => {
    if (items.length == n) {
      console.log(items);
      drawGame();
      gamePlay();
      clearInterval(interval);
    }
  }, 100);
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < lines.length; i++) {
    lines[i].draw();
  }
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines = [];
    if(itemsSelected.length == 2){
      for(let k=0;k<itemsSelected.length;k++){
        itemsSelected[k].wrong = false;
        itemsSelected[k].isSelect = false;
      }
      itemsSelected = [];
    }
    
    for (let i = 0; i < items.length; i++) {
      items[i].draw();
    }
  }, 300);

  for (let i = 0; i < items.length; i++) {
    items[i].draw();
  }
}

// EVENT PLAY GAME
function gamePlay() {
  canvas.addEventListener("click", (e) => {
    let corX = e.offsetX;
    let corY = e.offsetY;
    // ctx.strokeRect(corX, corY, 10, 10);
    for (let i = 0; i < items.length; i++) {
      if (
        items[i].x <= corX &&
        corX <= items[i].x + size &&
        items[i].y <= corY &&
        corY <= items[i].y + size &&
        !items[i].flag
      ) {
        sound2.play();
        let isExist = false;
        for (let j = 0; j < itemsSelected.length; j++) {
          if (JSON.stringify(itemsSelected[j]) == JSON.stringify(items[i])) {
            items[i].isSelect = false;
            itemsSelected.splice(j, 1);
            isExist = true;
          }
        }
        if (!isExist) {
          items[i].isSelect = true;
          itemsSelected.push(items[i]);
        }
        if (itemsSelected.length == 2) {
          let point1 = itemsSelected[0];
          let point2 = itemsSelected[1];
          if (point1.value == point2.value) {
            let p1 = { i: point1.i, j: point1.j };
            let p2 = { i: point2.i, j: point2.j };
            matrix[p1.i][p1.j] = 0;
            matrix[p2.i][p2.j] = 0;
            if (checkTwoPoint(p1, p2)) {
              sound3.play();
              point1.flag = true;
              point2.flag = true;
              for (let k = 0; k < track.length-1; k++) {
                let newLine = new Line(track[k], track[k+1]);
                lines.push(newLine);
              }

            } else {
              sound1.play();
              for (let k = 0; k < itemsSelected.length; k++) {
                itemsSelected[k].wrong = true;
                itemsSelected[k].isSelect = false;
              }
              matrix[p1.i][p1.j] = 1;
              matrix[p2.i][p2.j] = 1;
            }
          } else {
            sound1.play();
            sound1.volume = 1;
            for (let k = 0; k < itemsSelected.length; k++) {
              itemsSelected[k].wrong = true;
              itemsSelected[k].isSelect = false;
            }
          }
        }
        break;
      }

     
    }
    drawGame();
  });
}

function checkSameCor(point) {
  for (let i = 0; i < track.length; i++) {
    if (track[i].i == point.i && track[i].j == point.j) {
      return true;
    }
  }
  return false;
}

function checkLineX(j1, j2, i) {
  let dir = "L-R";
  if (j1 > j2) {
    dir = "R-L";
  }
  if (dir == "L-R") {
    for (let j = j1; j <= j2; j++) {
      if (matrix[i][j] == 1) {
        track = [];
        return false;
      }
      if(!checkSameCor({i,j})){
        track.push({ i, j });
      }
      
      
    }
  } else {
    for (let j = j1; j >= j2; j--) {
      if (matrix[i][j] == 1) {
        track = [];
        return false;
      }
      if(!checkSameCor({i,j})){
        track.push({ i, j });
      }
    }
  }
  return true;
}

function checkLineY(i1, i2, j) {
  let dir = "T-B";
  if (i1 > i2) {
    dir = "B-T";
  }
  if (dir == "T-B") {
    for (let i = i1; i <= i2; i++) {
      if (matrix[i][j] == 1) {
        track = [];
        return false;
      }
      if(!checkSameCor({i,j})){
        track.push({ i, j });
      }
    }
  } else {
    for (let i = i1;i >= i2; i--) {
      if (matrix[i][j] == 1) {
        track = [];
        return false;
      }
      if(!checkSameCor({i,j})){
        track.push({ i, j });
      }
    }
  }
  return true;
}

function checkL(p1, p2) {
  let pMinY = p1;
  let pMaxY = p2;
  if (p1.i > p2.i) {
    pMinY = p2;
    pMaxY = p1;
  }
  let pTop = { i: pMinY.i, j: pMaxY.j };
  let pBottom = { i: pMaxY.i, j: pMinY.j };
  let flag = false;
  if (
    checkLineX(pMinY.j, pTop.j, pTop.i) &&
    checkLineY(pMaxY.i, pTop.i, pTop.j)
  ) {
    // console.log("top");
    return true;
  }
  if (
    checkLineX(pMaxY.j, pBottom.j, pBottom.i) &&
    checkLineY(pMinY.i, pBottom.i, pBottom.j)
  ) {
    // console.log("bottom");

    return true;
  }
  return false;
}

function checkRectX(p1, p2) {
  // find point have y min and max
  let pMinY = p1,
    pMaxY = p2;
  if (p1.i > p2.i) {
    pMinY = p2;
    pMaxY = p1;
  }
  for (let i = pMinY.i + 1; i < pMaxY.i; i++) {
    if (
      checkLineY(pMinY.i, i, pMinY.j) &&
      checkLineX(pMinY.j, pMaxY.j, i) &&
      checkLineY(i, pMaxY.i, pMaxY.j)
    ) {
      return true;
    }
  }
  return false;
}

function checkRectY(p1, p2) {
  let pMinX = p1,
    pMaxX = p2;
  if (p1.j > p2.j) {
    pMinX = p2;
    pMaxX = p1;
  }
  for (let j = pMinX.j + 1; j < pMaxX.j; j++) {
    // check three line
    if (
      checkLineX(pMinX.j, j, pMinX.i) &&
      checkLineY(pMinX.i, pMaxX.i, j) &&
      checkLineX(j, pMaxX.j, pMaxX.i)
    ) {
      return true;
    }
  }
  return false;
}

function checkYShapeU(p1, p2) {
  let pMinX = p1,
    pMaxX = p2;
  if (p1.j > p2.j) {
    pMinX = p2;
    pMaxX = p1;
  }

  //check left direction
  for (let j = pMinX.j - 1; j >= 0; j--) {
    if (
      checkLineX(pMinX.j, j, pMinX.i) &&
      checkLineY(pMinX.i, pMaxX.i, j) &&
      checkLineX(pMaxX.j, j, pMaxX.i)
    ) {
      return true;
    }
  }

  //check right direction
  for (let j = pMaxX.j + 1; j < cols; j++) {
    if (
      checkLineX(pMinX.j, j, pMinX.i) &&
      checkLineY(pMinX.i, pMaxX.i, j) &&
      checkLineX(pMaxX.j, j, pMaxX.i)
    ) {
      return true;
    }
  }
  return false;
}

function checkXShapeU(p1, p2) {
  let pMinY = p1,
    pMaxY = p2;
  if (p1.i > p2.i) {
    pMinY = p2;
    pMaxY = p1;
  }

  //check top direction
  for (let i = pMinY.i - 1; i >= 0; i--) {
    if (
      checkLineY(pMinY.i, i, pMinY.j) &&
      checkLineX(pMinY.j, pMaxY.j, i) &&
      checkLineY(pMaxY.i, i, pMaxY.j)
    ) {
      return true;
    }
  }

  //check bottom direction
  for (let i = pMaxY.i + 1; i < rows; i++) {
    if (
      checkLineY(pMinY.i, i, pMinY.j) &&
      checkLineX(pMinY.j, pMaxY.j, i) &&
      checkLineY(pMaxY.i, i, pMaxY.j)
    ) {
      return true;
    }
  }
  return false;
}

function checkTwoPoint(p1, p2) {
  track = [];
  if (p1.i == p2.i) {
    if (checkLineX(p1.j, p2.j, p1.i)) {
      console.log("Line X");
      return true;
    }
  }
  if (p1.j == p2.j) {
    if (checkLineY(p1.i, p2.i, p1.j)) {
      console.log("Line Y");
      return true;
    }
  }
  if (checkL(p1, p2)) {
    console.log("L");
    return true;
  }
  if (checkRectX(p1, p2)) {
    console.log("Z-X");
    return true;
  }
  if (checkRectY(p1, p2)) {
    console.log("Z-Y");
    return true;
  }
  if (checkXShapeU(p1, p2)) {
    console.log("U-X");
    return true;
  }
  if (checkYShapeU(p1, p2)) {
    console.log("U-Y");
    return true;
  }
  return false;
}
initMatrix();
displayItems();
