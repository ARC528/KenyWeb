const list = document.querySelector('#songList');
const template = document.querySelector('#songTemplate');

const fallbackSongs = [
  ['diary', '雨の匂い', 'https://www.youtube.com/', '28', '21'],
  ['prayer', '夜の港で', 'https://www.youtube.com/', '60', '28'],
  ['night', '窓辺のギター', 'https://www.youtube.com/', '78', '41']
];

function parseSongs(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('|').map(item => item.trim()))
    .filter(parts => parts.length >= 3);
}

function renderSongs(songs) {
  list.innerHTML = '';

  songs.forEach(([type, title, url, x = '50', y = '50']) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.href = url;
    node.classList.add(`type-${type}`);
    node.style.left = `${x}%`;
    node.style.top = `${y}%`;
    node.querySelector('strong').textContent = title;
    list.appendChild(node);
  });
}

fetch('./songs/songs.txt', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) throw new Error('songs.txt を読み込めませんでした');
    return response.text();
  })
  .then(text => renderSongs(parseSongs(text)))
  .catch(() => renderSongs(fallbackSongs));
