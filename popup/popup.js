// キー入力イベントを実装
document.addEventListener('keypress', keypress_ivent);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace') {
        keyInput_history = keyInput_history.slice(0, -1);
    }
});

// 入力の履歴を保持する変数
let keyInput_history = "";

function keypress_ivent(input_obj) {
    keyInput_history += input_obj.key;

    // キー入力をリアルタイムで表示
    updateKeyInputDisplay();

    return false;
}

// <span id="keyInput_display">にキー入力履歴を表示
function updateKeyInputDisplay() {
    const displayElement = document.getElementById("keyInput_display");
    if (displayElement) {
        displayElement.textContent = keyInput_history;
    }
}


// フォルダの`title`(string)が与えられたとき、その配下の`BookmarkTreeNode`の`List`を返す関数
function get_ChildrenBookmark_titleList(parentBookmark_title) {
    var bookmarkList = [];
    // `bookmarks.BookmarkTreeNode`のリストが返ってくるので、`search_results`として取得
    chrome.bookmarks.search(
        { title: parentBookmark_title },
        (search_results) => {
            for (const search_result of search_results) {
                // `bookmarks.BookmarkTreeNode`のリストが返ってくるので、`getChildren_results`として取得
                chrome.bookmarks.getChildren(
                    search_result.id,
                    (getChildren_results) => {
                        for (let getChildren_result of getChildren_results) {
                            // リストの最後の行に追加
                            bookmarkList[bookmarkList.length] = getChildren_result
                        }
                    }
                );
            }
        }
    );
    return bookmarkList;
}

// "SiteLauncher_ver1"配下の`BookmarkTreeNode`を`List`で取得
bookmark_titleList = get_ChildrenBookmark_titleList("SiteLauncher_ver1");
// テスト
bookmark_titleList=["ym : youtube Music", "ypl : youtube playlists","yw : youtube WL"]

// bookmark_titleListの各要素を分割して、keyとlabelを取得
function parseBookmarkTitleList(bookmark_titleList) {
    return bookmark_titleList.map(title => {
        const [key, label] = title.split(/:\s(.+)/); // 「: 」で分割（前方のkey, 後方のlabel）
        return { key: key.trim(), label: label.trim() };
    });
}

// bookmark_titleListの各要素を分割して、keyとlabelを取得
bookmark_list = parseBookmarkTitleList(bookmark_titleList);

// メニューを更新する関数
function updateMenu(list) {
    const menu = document.querySelector('.menu');
    menu.innerHTML = ''; // 現在の内容をクリア

    list.forEach((item, index) => {
        const li = document.createElement('li');
        if (index === 0) li.classList.add('selected'); // 最初の要素を選択中にする

        const span = document.createElement('span');
        span.className = 'label';
        span.textContent = `${item.key} : ${item.label}`;

        li.appendChild(span);
        menu.appendChild(li);
    });
}

updateMenu(bookmark_list);
