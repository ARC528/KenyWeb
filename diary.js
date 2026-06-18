const listEl = document.getElementById('entryList');
const articleDate = document.getElementById('articleDate');
const articleTitle = document.getElementById('articleTitle');
const articleBody = document.getElementById('articleBody');
const articleImageWrap = document.getElementById('articleImageWrap');
const articleImage = document.getElementById('articleImage');

let entries = [];

async function loadEntries() {
  try {
    const res = await fetch('./diary/entries.json');
    if (!res.ok) throw new Error('entries.json が見つかりません');
    entries = await res.json();
    renderList();

    const idFromUrl = new URLSearchParams(location.search).get('id');
    const firstEntry = entries.find(entry => entry.id === idFromUrl) || entries[0];
    if (firstEntry) selectEntry(firstEntry.id, false);
  } catch (error) {
    listEl.innerHTML = '<p>日記データを読み込めませんでした。</p>';
    articleTitle.textContent = '日記データを読み込めませんでした';
    articleBody.textContent = 'diary/entries.json の配置を確認してください。';
  }
}

function renderList() {
  listEl.innerHTML = entries.map(entry => `
    <button class="entry-button" type="button" data-id="${entry.id}">
      <span>
        <span class="entry-date">${entry.date}</span>
        <span class="entry-title">${entry.title}</span>
      </span>
      <span class="entry-arrow">›</span>
    </button>
  `).join('');

  listEl.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => selectEntry(button.dataset.id, true));
  });
}

async function selectEntry(id, updateUrl = true) {
  const entry = entries.find(item => item.id === id);
  if (!entry) return;

  document.querySelectorAll('.entry-button').forEach(button => {
    button.classList.toggle('active', button.dataset.id === id);
  });

  articleDate.textContent = entry.date;
  articleTitle.textContent = entry.title;
  articleBody.textContent = '読み込み中...';

  if (entry.image) {
    articleImage.src = entry.image;
    articleImage.alt = entry.title;
    articleImageWrap.hidden = false;
  } else {
    articleImageWrap.hidden = true;
  }

  try {
    const res = await fetch(entry.file);
    if (!res.ok) throw new Error(`${entry.file} が見つかりません`);
    articleBody.textContent = await res.text();
  } catch (error) {
    articleBody.textContent = '本文ファイルを読み込めませんでした。entries.json の file パスを確認してください。';
  }

  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('id', id);
    history.replaceState(null, '', url);
  }
}

loadEntries();
