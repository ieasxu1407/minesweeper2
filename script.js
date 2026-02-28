// ===== SHA-256 함수와 관리자 해시 =====
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 관리자 비밀번호 해시 (원래 비밀번호: admin123)
const adminHash = "ef92b778bafe771e89245b89ecbc9b2e5b0d0a2e3d0e1f843e2e76f9d6b5f0d1"; 

let board = [];
let rows, cols, mines;
let devMode = false;

function startGame() {
  const diff = document.getElementById("difficulty").value;

  if (diff === "easy") {
    rows = 9; cols = 9; mines = 10;
  } else if (diff === "medium") {
    rows = 16; cols = 16; mines = 40;
  } else {
    rows = 24; cols = 24; mines = 99;
  }

  createBoard();
}

function createBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  boardDiv.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

  board = [];

  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = { mine: false, open: false };

      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.onclick = () => openCell(r, c);

      boardDiv.appendChild(cell);
    }
  }

  placeMines();
}

function placeMines() {
  let placed = 0;
  while (placed < mines) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);

    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
}

function openCell(r, c) {
  const cell = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
  if (board[r][c].open) return;

  board[r][c].open = true;
  cell.classList.add("open");

  if (board[r][c].mine) {
    cell.classList.add("mine");
    cell.innerText = "💣";
    alert("💥 게임 오버!");
    revealAllMines();
  } else {
    const count = countMines(r, c);
    if (count > 0) cell.innerText = count;
  }
}

function countMines(r, c) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let nr = r + i;
      let nc = c + j;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr][nc].mine) count++;
      }
    }
  }
  return count;
}

function revealAllMines() {
  document.querySelectorAll(".cell").forEach(cell => {
    const r = cell.dataset.row;
    const c = cell.dataset.col;
    if (board[r][c].mine) {
      cell.innerText = "💣";
      cell.classList.add("mine");
    }
  });
}

async function toggleDevMode() {
    const input = prompt("개발자 모드 비밀번호 입력:");

    if (!input) return;

    const inputHash = await sha256(input);

    if (inputHash === adminHash) {
        devMode = !devMode;
        alert(devMode ? "개발자모드 ON" : "개발자모드 OFF");

        if (devMode) {
            // 지뢰 모두 표시
            document.querySelectorAll(".cell").forEach(cell => {
                const r = cell.dataset.row;
                const c = cell.dataset.col;
                if (board[r][c].mine) cell.innerText = "💣";
            });
        } else {
            // 지뢰 숨기기
            document.querySelectorAll(".cell").forEach(cell => {
                const r = cell.dataset.row;
                const c = cell.dataset.col;
                if (!board[r][c].open) cell.innerText = "";
            });
        }
    } else {
        alert("❌ 비밀번호 틀림");
    }
}
function adminCheat() {
  const password = prompt("관리자 비밀번호 입력:");

  if (password === "admin") {
    alert("🔥 관리자 승리!");
    document.querySelectorAll(".cell").forEach(cell => {
      if (!board[cell.dataset.row][cell.dataset.col].mine) {
        cell.classList.add("open");
      }
    });
  } else {
    alert("❌ 비밀번호 틀림");
  }
}
