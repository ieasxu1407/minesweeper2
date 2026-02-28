// =====================
// 설정
// =====================
const rows = 10;
const cols = 10;
const mineCount = 15;

const allowedDevUser = "ieasxu1407";

let board = [];
let isLoggedIn = false;
let devMode = false;

// =====================
// 보드 생성
// =====================
function createBoard() {
  const boardEl = document.getElementById("board");
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 35px)`;
  boardEl.innerHTML = "";
  board = [];

  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = { mine: false, revealed: false };

      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `cell-${r}-${c}`;
      cell.onclick = () => revealCell(r, c);

      boardEl.appendChild(cell);
    }
  }

  placeMines();
}

function placeMines() {
  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
}

function revealCell(r, c) {
  const cell = document.getElementById(`cell-${r}-${c}`);
  if (board[r][c].revealed) return;

  board[r][c].revealed = true;
  cell.classList.add("revealed");

  if (board[r][c].mine) {
    cell.textContent = "💣";
    alert("Game Over");
  }
}

// =====================
// GitHub 로그인
// =====================
async function githubLogin() {
  const username = document.getElementById("githubInput").value.trim();
  if (!username) return alert("ieasxu1407");

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    document.getElementById("user").textContent = data.login;

    if (data.login === allowedDevUser) {
      isLoggedIn = true;
      document.getElementById("devBtn").disabled = false;
      alert("✅ 개발자 인증 성공");
    } else {
      alert("❌ 허용되지 않은 사용자");
    }

  } catch {
    alert("❌ GitHub 조회 실패");
  }
}

// =====================
// Dev Mode
// =====================
function toggleDevMode() {
  if (!isLoggedIn) {
    alert("🔐 로그인 필요");
    return;
  }

  devMode = !devMode;
  document.body.classList.toggle("dev-active", devMode);
}

// =====================
// 시작
// =====================
createBoard();
