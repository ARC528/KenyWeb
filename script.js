const listEl = document.getElementById('diaryList');
const detailEl = document.getElementById('diaryDetail');
let diaries = [];

function parseDiary(text, file){
  const lines = text.replace(/\r/g,'').split('\n');
  const meta = {file, date:'', title:'', image:''};
  let i = 0;
  for(; i < lines.length; i++){
    const line = lines[i];
    if(line.trim() === '') { i++; break; }
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if(m) meta[m[1].trim()] = m[2].trim();
  }
  meta.body = lines.slice(i).join('\n').trim();
  return meta;
}

async function loadDiaries(){
  const files = await fetch('data/diaries.json').then(r => r.json());
  diaries = await Promise.all(files.map(async file => {
    const text = await fetch('diaries/' + file).then(r => r.text());
    return parseDiary(text, file);
  }));
  renderList();
  showDiary(0);
}

function renderList(){
  listEl.innerHTML = diaries.map((d, i) => `
    <button class="diary-item" type="button" data-index="${i}">
      <time>${escapeHtml(d.date)}</time>
      <span>${escapeHtml(d.title)}</span>
    </button>
  `).join('');
  listEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => showDiary(Number(btn.dataset.index)));
  });
}

function showDiary(index){
  const d = diaries[index];
  listEl.querySelectorAll('.diary-item').forEach((b, i) => b.classList.toggle('active', i === index));
  detailEl.innerHTML = `
    <p class="detail-date">${escapeHtml(d.date)}</p>
    <div class="detail-line"></div>
    <h2 class="detail-title">${escapeHtml(d.title)}</h2>
    ${d.image ? `<img class="detail-image" src="${escapeAttr(d.image)}" alt="${escapeAttr(d.title)}">` : ''}
    <div class="detail-body">${escapeHtml(d.body)}</div>
    <a class="backlink" href="#diary">＜ 一覧に戻る</a>
  `;
}

function escapeHtml(str=''){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
function escapeAttr(str=''){ return escapeHtml(str); }

loadDiaries().catch(err => {
  detailEl.innerHTML = '<p>日記を読み込めませんでした。ローカルで直接開く場合は、VS Code の Live Server などで表示してください。</p>';
  console.error(err);
});
