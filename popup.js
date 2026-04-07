// グローバル変数
let inputText = '';
let bookmarks = [];
let filteredBookmarks = [];
let currentSelectionIndex = -1; // 選択中の項目のインデックス（-1は未選択）

// DOM要素
const inputDisplay = document.getElementById('inputDisplay');
const resultsDiv = document.getElementById('results');

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
  // ブックマークを取得
  await loadBookmarks();

  // キーボードイベントをリッスン
  document.addEventListener('keydown', handleKeyPress);

  // 初期表示更新
  updateDisplay();
});

// ブックマークの読み込み
async function loadBookmarks() {
  try {
    const tree = await chrome.bookmarks.getTree();
    bookmarks = findBookmarksInFolder(tree, 'SiteLauncher_ver1');
    console.log('Loaded bookmarks:', bookmarks);
  } catch (error) {
    console.error('Error loading bookmarks:', error);
  }
}

// 特定フォルダ内のブックマークを再帰的に検索
function findBookmarksInFolder(nodes, folderName) {
  let results = [];

  for (const node of nodes) {
    if (node.title === folderName && node.children) {
      // 目的のフォルダを発見
      results = extractBookmarks(node.children);
      break;
    } else if (node.children) {
      // 子ノードを再帰的に検索
      const childResults = findBookmarksInFolder(node.children, folderName);
      results = results.concat(childResults);
    }
  }

  return results;
}

// ブックマークを抽出してkey/label形式にパース
function extractBookmarks(nodes) {
  const results = [];

  for (const node of nodes) {
    if (node.url) {
      // タイトルから key:label を抽出
      const match = node.title.match(/^([^:]+):(.+)$/);
      if (match) {
        results.push({
          key: match[1].trim(),
          label: match[2].trim(),
          url: node.url,
          title: node.title
        });
      } else {
        // key:label形式でない場合はタイトル全体をkey/labelとする
        results.push({
          key: node.title,
          label: node.title,
          url: node.url,
          title: node.title
        });
      }
    }
  }

  return results;
}

// キー入力処理
function handleKeyPress(e) {
  e.preventDefault();

  if (e.key === 'Escape') {
    // Escでポップアップを閉じる
    window.close();
    return;
  }

  if (e.key === 'Backspace') {
    // 1文字削除
    if (inputText.length > 0) {
      inputText = inputText.slice(0, -1);
      updateDisplay();
    }
    return;
  }

  if (e.key === 'ArrowUp') {
    // 上矢印: より上位のブックマークを選択
    if (filteredBookmarks.length > 0 && currentSelectionIndex > 0) {
      currentSelectionIndex--;
      displayResults();
    }
    return;
  }

  if (e.key === 'ArrowDown') {
    // 下矢印: より下位のブックマークを選択
    if (filteredBookmarks.length > 0 && currentSelectionIndex < filteredBookmarks.length - 1) {
      currentSelectionIndex++;
      displayResults();
    }
    return;
  }

  if (e.key === 'Enter') {
    // 現在の選択対象のブックマークを開く
    if (filteredBookmarks.length > 0) {
      const selectedIndex = currentSelectionIndex >= 0 ? currentSelectionIndex : 0;
      openUrl(filteredBookmarks[selectedIndex].url);
    }
    return;
  }

  // 通常の文字入力
  if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
    inputText += e.key;
    updateDisplay();

    // 完全一致チェック
    checkExactMatch();
  }
}

// 完全一致チェック
function checkExactMatch() {
  const exactMatch = bookmarks.find(b => b.key.toLowerCase() === inputText.toLowerCase());
  if (exactMatch) {
    openUrl(exactMatch.url);
  }
}

// 表示更新
function updateDisplay() {
  // 入力文字列を表示
  inputDisplay.textContent = inputText;

  // フィルタリングと類似検索
  if (inputText.length === 0) {
    filteredBookmarks = [];
    currentSelectionIndex = -1; // 選択をリセット
  } else {
    filteredBookmarks = searchBookmarks(inputText);
    // 文字入力時は最も類似度が高いものを初期選択
    currentSelectionIndex = filteredBookmarks.length > 0 ? 0 : -1;
  }

  // 結果を表示
  displayResults();
}

// ブックマーク検索（類似度スコアリング）
function searchBookmarks(query) {
  const queryLower = query.toLowerCase();

  // 各ブックマークにスコアを付ける
  const scored = bookmarks.map(bookmark => {
    let score = 0;
    const keyLower = bookmark.key.toLowerCase();
    const labelLower = bookmark.label.toLowerCase();
    const urlLower = bookmark.url.toLowerCase();

    // 完全一致（最高スコア）
    if (keyLower === queryLower) {
      score = 1000;
    }
    // keyの前方一致
    else if (keyLower.startsWith(queryLower)) {
      score = 500;
    }
    // keyの部分一致
    else if (keyLower.includes(queryLower)) {
      score = 300;
    }
    // labelの部分一致
    else if (labelLower.includes(queryLower)) {
      score = 200;
    }
    // URLの部分一致
    else if (urlLower.includes(queryLower)) {
      score = 100;
    }

    // Levenshtein距離による類似度（補助的）
    if (score > 0) {
      const distance = levenshteinDistance(queryLower, keyLower);
      score -= distance;
    }

    return { bookmark, score };
  });

  // スコアでソートしてフィルタリング
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .map(item => item.bookmark);
}

// Levenshtein距離の計算
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// 結果表示
function displayResults() {
  if (filteredBookmarks.length === 0) {
    resultsDiv.innerHTML = '';
    return;
  }

  const html = filteredBookmarks.map((bookmark, index) => {
    // 現在選択中の項目にactiveクラスを付与
    const className = index === currentSelectionIndex ? 'result-item active' : 'result-item';
    return `
      <div class="${className}">
        <div class="result-key">${bookmark.key}</div>
        <div class="result-label">${bookmark.label}</div>
        <div class="result-url">${bookmark.url}</div>
      </div>
    `;
  }).join('');

  resultsDiv.innerHTML = html;

  // 選択中の項目を画面内にスクロール
  scrollToSelectedItem();
}

// 選択中の項目を画面内にスクロール
function scrollToSelectedItem() {
  if (currentSelectionIndex >= 0 && currentSelectionIndex < filteredBookmarks.length) {
    const selectedElement = resultsDiv.children[currentSelectionIndex];
    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }
}

// URLを開く
async function openUrl(url) {
  try {
    // 現在のタブを取得
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 新しいタブ（chrome://newtab/）の場合は再利用
    if (currentTab && (currentTab.url === 'chrome://newtab/' || currentTab.url === 'about:blank')) {
      await chrome.tabs.update(currentTab.id, { url: url });
    } else {
      // 新規タブで開く
      await chrome.tabs.create({ url: url });
    }

    // ポップアップを閉じる
    window.close();
  } catch (error) {
    console.error('Error opening URL:', error);
  }
}
