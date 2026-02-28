let rows, cols, mines;
let board = [];
let devMode = false;
let timer = 0;
let interval;

function startGame() {
  clearInterval(interval);
  timer = 0;
  document.getElementById("timer").textContent = 0;

  const diff = document.getElementById("difficulty").value;

  if (diff === "easy") { rows=8; cols=8; mines=10; }
  if (diff === "medium") { rows=12; cols=12; mines=20; }
  if (diff === "hard") { rows=16; cols=16; mines=40; }

  createBoard();
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = timer;
  }, 1000);
}

function createBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  boardDiv.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

  board = [];

  for (let r=0; r<rows; r++) {
    board[r] = [];
    for (let c=0; c<cols; c++) {
      board[r][c] = { mine:false, revealed:false };
    }
  }

  // 지뢰 심기
  let placed = 0;
  while (placed < mines) {
    let r = Math.floor(Math.random()*rows);
    let c = Math.floor(Math.random()*cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }

  // 화면 생성
  for (let r=0; r<rows; r++) {
    for (let c=0; c<cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.onclick = () => reveal(r,c);
      cell.id = `cell-${r}-${c}`;
      boardDiv.appendChild(cell);
    }
  }

  updateDevView();
}

function reveal(r,c) {
  if (board[r][c].revealed) return;

  board[r][c].revealed = true;
  const cell = document.getElementById(`cell-${r}-${c}`);
  cell.classList.add("revealed");

  if (board[r][c].mine) {
    cell.classList.add("mine");
    alert("💥 게임 오버!");
    clearInterval(interval);
    return;
  }

  let count = countMines(r,c);
  if (count > 0) cell.textContent = count;

  checkWin();
}

function countMines(r,c) {
  let count=0;
  for (let i=-1;i<=1;i++){
    for (let j=-1;j<=1;j++){
      let nr=r+i, nc=c+j;
      if (nr>=0 && nr<rows && nc>=0 && nc<cols){
        if (board[nr][nc].mine) count++;
      }
    }
  }
  return count;
}

function checkWin() {
  let safeCells = rows*cols - mines;
  let revealedCount = 0;

  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      if (board[r][c].revealed && !board[r][c].mine)
        revealedCount++;
    }
  }

  if (revealedCount === safeCells) {
    clearInterval(interval);
    let score = Math.max(1000 - timer*10, 0);
    document.getElementById("score").textContent = score;
    alert("🎉 승리!");
  }
}

function toggleDevMode() {
  devMode = !devMode;
  updateDevView();
}

function updateDevView() {
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      const cell = document.getElementById(`cell-${r}-${c}`);
      if (devMode && board[r][c].mine && !board[r][c].revealed){
        cell.style.background = "pink";
      } else if (!board[r][c].revealed){
        cell.style.background = "#ccc";
      }
    }
  }
}