// ⚠️ 난독화 + SHA-256 비밀번호 검증
(async()=>{

let a=[],b,c,d=!1;

const e="ef92b778bafe771e89245b89ecbc9b2e5b0d0a2e3d0e1f843e2e76f9d6b5f0d1";

async function f(g){const h=new TextEncoder().encode(g),i=await crypto.subtle.digest("SHA-256",h),j=Array.from(new Uint8Array(i));return j.map(k=>k.toString(16).padStart(2,"0")).join("")}

sha256("admin").then(console.log);    
window.startGame=function(){
    const l=document.getElementById("difficulty").value;
    if(l==="easy"){b=9;c=9;d=10;}
    else if(l==="medium"){b=16;c=16;d=40;}
    else{b=24;c=24;d=99;}
    createBoard();
}

function createBoard(){
    const m=document.getElementById("board");
    m.innerHTML="";
    m.style.gridTemplateColumns=`repeat(${c},30px)`;
    a=[];
    for(let n=0;n<b;n++){
        a[n]=[];
        for(let o=0;o<c;o++){
            a[n][o]={mine:!1,open:!1};
            const p=document.createElement("div");
            p.classList.add("cell");
            p.dataset.row=n;
            p.dataset.col=o;
            p.onclick=(()=>openCell(n,o));
            m.appendChild(p);
        }
    }
    placeMines();
}

function placeMines(){
    let q=0;
    while(q<d){
        let r=Math.floor(Math.random()*b),s=Math.floor(Math.random()*c);
        if(!a[r][s].mine){a[r][s].mine=!0;q++;}
    }
}

function openCell(r,s){
    const t=document.querySelector(`[data-row='${r}'][data-col='${s}']`);
    if(a[r][s].open)return;
    a[r][s].open=!0;
    t.classList.add("open");
    if(a[r][s].mine){t.classList.add("mine");t.innerText="💣";alert("💥 게임 오버!");revealAllMines();}
    else{const u=countMines(r,s);if(u>0)t.innerText=u;}
}

function countMines(r,s){
    let v=0;
    for(let w=-1;w<=1;w++){
        for(let x=-1;x<=1;x++){
            let y=r+w,z=s+x;
            if(y>=0&&y<b&&z>=0&&z<c){if(a[y][z].mine)v++;}
        }
    }
    return v;
}

function revealAllMines(){
    document.querySelectorAll(".cell").forEach(u=>{
        const r=u.dataset.row,s=u.dataset.col;
        if(a[r][s].mine){u.innerText="💣";u.classList.add("mine");}
    });
}

window.toggleDevMode=async function(){
    const input=prompt("개발자 모드 비밀번호 입력:");
    if(!input)return;
    const inputHash=await f(input);
    if(inputHash===e){
        d=!d;
        alert(d?"개발자모드 ON":"개발자모드 OFF");
        if(d){document.querySelectorAll(".cell").forEach(u=>{const r=u.dataset.row,s=u.dataset.col;if(a[r][s].mine)u.innerText="💣";});}
        else{document.querySelectorAll(".cell").forEach(u=>{const r=u.dataset.row,s=u.dataset.col;if(!a[r][s].open)u.innerText="";});}
    }else{alert("❌ 비밀번호 틀림");}
}

window.adminCheat=async function(){
    const input=prompt("관리자 비밀번호 입력:");
    if(!input)return;
    const inputHash=await f(input);
    if(inputHash===e){
        alert("🔥 관리자 승리!");
        document.querySelectorAll(".cell").forEach(u=>{
            const r=u.dataset.row,s=u.dataset.col;
            if(!a[r][s].mine)u.classList.add("open");
        });
    }else{alert("❌ 비밀번호 틀림");}
}

})();
