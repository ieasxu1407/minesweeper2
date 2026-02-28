// =====================
// 기본 설정
// =====================
let rows = 8, cols = 8, mines = 10;
let board = [];
let devMode = false;
let timer = 0;
let interval = null;
let isLoggedIn = false;
let clientId = "Iv23liOaal9kcve7zqjP"; //
let allowedUser = "ieasxu1407"; //

// =====================
// 게임 시작
// =====================
function startGame() {
  clearInterval(interval);
  timer = 0;
  document.getElementById("timer").textContent = 0;
  document.getElementById("score").textContent = 0;

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

// =====================
// 보드 생성
// =====================
function createBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  boardDiv.style.gridTemplateColumns = `repeat(${cols}, 32px)`;

  board = [];

  for (let r=0; r<rows; r++) {
    board[r] = [];
    for (let c=0; c<cols; c++) {
      board[r][c] = { mine:false, revealed:false };
    }
  }

  // 지뢰 배치
  let placed = 0;
  while (placed < mines) {
    let r = Math.floor(Math.random()*rows);
    let c = Math.floor(Math.random()*cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }

  // 셀 생성
  for (let r=0; r<rows; r++) {
    for (let c=0; c<cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${r}-${c}`;
      cell.onclick = () => reveal(r,c);
      boardDiv.appendChild(cell);
    }
  }

  updateDevView();
}

// =====================
// 셀 열기
// =====================
function reveal(r,c) {
  if (board[r][c].revealed) return;

  board[r][c].revealed = true;
  const cell = document.getElementById(`cell-${r}-${c}`);
  cell.classList.add("revealed");

  if (board[r][c].mine) {
    cell.classList.add("mine");
    clearInterval(interval);
    alert("💥 GAME OVER");
    return;
  }

  let count = countMines(r,c);
  if (count > 0) cell.textContent = count;

  checkWin();
}

// =====================
// 주변 지뢰 개수
// =====================
function countMines(r,c) {
  let count = 0;
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

// =====================
// 승리 체크 + 점수 계산
// =====================
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

    let score = Math.max(2000 - timer*15, 0);
    document.getElementById("score").textContent = score;

    alert("🎉 YOU WIN!");
  }
}

// =====================
// 개발자 로그인 (GitHub 사용자 확인)
// =====================
async function githubLogin() {
  let username = prompt("GitHub 아이디를 입력하세요:");

  if (!username) return;

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
    alert("❌ GitHub 사용자 조회 실패");
  }
}

// =====================
// 개발자 모드
// =====================
function toggleDevMode() {
  if (!isLoggedIn) {
    alert("🔐 로그인 필요");
    return;
  }

  devMode = !devMode;
  updateDevView();
}

function updateDevView() {
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      const cell = document.getElementById(`cell-${r}-${c}`);
      if (!cell) continue;

      if (devMode && board[r][c].mine && !board[r][c].revealed){
        cell.style.background = "#ff4d6d";
      } else if (!board[r][c].revealed){
        cell.style.background = "#1e293b";
      }
    }
  }
}


function sendMessage() {
  let text = document.getElementById("chatInput").value;
  if (!text) return;

  db.collection("rooms")
    .doc(roomId)
    .collection("chat")
    .add({
      user: currentUser.email,
      text: text,
      time: Date.now()
    });

  document.getElementById("chatInput").value = "";
}

function listenChat() {
  db.collection("rooms")
    .doc(roomId)
    .collection("chat")
    .orderBy("time")
    .onSnapshot(snapshot => {
      const messages = document.getElementById("messages");
      messages.innerHTML = "";
      snapshot.forEach(doc => {
        let data = doc.data();
        messages.innerHTML += `<div><b>${data.user}</b>: ${data.text}</div>`;
      });
    });
}

// =====================
window.onload = startGame;








