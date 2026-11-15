/* =========================================================
   정휘의 실험실 — script.js
   ========================================================= */

/* ---------------------------------------------------------
   1) 저장소 목록
   새 결과물을 올리면 아래 배열에 한 줄만 추가하세요.
   - owner: GitHub 아이디 / name: 저장소 이름
   - desc : 직접 쓸 설명(비워 두면 GitHub에 적힌 설명을 자동으로 가져옴)
   --------------------------------------------------------- */
const REPOS = [
  { owner: "5c4scttz92-maker", name: "tul-letter", desc: "" },
  // { owner: "5c4scttz92-maker", name: "다음-프로젝트", desc: "한 줄 설명" },
];

/* ---------------------------------------------------------
   2) 목록 그리기
   --------------------------------------------------------- */
const list = document.getElementById("repo-list");

REPOS.forEach((repo) => {
  const url = `https://github.com/${repo.owner}/${repo.name}`;

  const li = document.createElement("li");
  li.innerHTML = `
    <a class="repo" href="${url}" target="_blank" rel="noopener">
      <span class="repo__name"></span>
      <span class="repo__desc"></span>
      <span class="repo__meta"></span>
      <span class="repo__cta">GitHub에서 열기</span>
    </a>
  `;

  // textContent로 넣어야 이름·설명에 특수문자가 있어도 안전합니다
  li.querySelector(".repo__name").textContent = repo.name;
  li.querySelector(".repo__desc").textContent = repo.desc;
  list.appendChild(li);

  loadRepoInfo(repo, li);
});

/* ---------------------------------------------------------
   3) GitHub에서 설명·언어·최근 업데이트 날짜 가져오기
   저장소가 비공개이거나 요청이 막히면 조용히 넘어갑니다
   (이름과 링크는 그대로 보임).
   --------------------------------------------------------- */
async function loadRepoInfo(repo, li) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}`);
    if (!res.ok) return;
    const data = await res.json();

    const desc = li.querySelector(".repo__desc");
    if (!repo.desc && data.description) desc.textContent = data.description;

    const meta = li.querySelector(".repo__meta");
    if (data.language) addMeta(meta, data.language);
    if (data.pushed_at) addMeta(meta, `${formatDate(data.pushed_at)} 업데이트`);
  } catch (err) {
    // 네트워크 문제 등 — 기본 정보만 보여 줌
  }
}

function addMeta(parent, text) {
  const span = document.createElement("span");
  span.textContent = text;
  parent.appendChild(span);
}

function formatDate(iso) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}.${mm}.${dd}`;
}

/* ---------------------------------------------------------
   4) 스크롤하면 타이틀바 바탕 채우기
   --------------------------------------------------------- */
const titlebar = document.getElementById("titlebar");

function updateTitlebar() {
  titlebar.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateTitlebar();
window.addEventListener("scroll", updateTitlebar, { passive: true });

/* ---------------------------------------------------------
   5) 푸터 연도 자동 갱신
   --------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();
