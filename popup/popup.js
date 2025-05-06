// https://mebee.info/2021/12/30/post-40182/

function makebox() {
    // ボタン'btn'が押されたとき'h1'要素の文字を変更する
    document.getElementById('btn').addEventListener('click', () => {
        document.querySelector('h1').textContent = "CHANGED !!";
    })
}

function aaaaa() {
    // a要素を作成
    let a_element = document.createElement('a');
    a_element.textContent = 'Top page';
    a_element.id = 'link_to_top';
    a_element.href = "https://developer.chrome.com/docs/extensions/reference/bookmarks/";

    // ul要素を作成
    let ul_element = document.createElement('ul');
    for (let i = 1; i <= 5; i++) {
        var li_element = document.createElement('li');
        li_element.textContent = 'テキストa' + i;
        ul_element.appendChild(li_element);
    }

    // 作成したHTML要素をarticle要素に追加する
    let textbox = document.getElementById('textbox');
    textbox.appendChild(ul_element);
    textbox.appendChild(a_element);

    // 以下のような`html`が追加される
    // <ul>
    //     <li>テキスト1</li>
    //     <li>テキスト2</li>
    //     <li>テキスト3</li>
    //     <li>テキスト4</li>
    //     <li>テキスト5</li>
    // </ul>
    // <a id="link_to_top" href="/" rel="nofollow nooppener">Top page</a>
}

aaaaa();

// フォルダの`title`(string)が与えられたとき、その配下の`BookmarkTreeNode`の`List`を返す関数
function getChildrenBookmarkList(parentBookmark_title) {
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
bookmarkList = getChildrenBookmarkList("SiteLauncher_ver1");

// Key入力を保存する文字列
keyInput_history = ""

document.addEventListener('keypress', keypress_ivent);
function keypress_ivent(input_obj) {
    keyInput_history += input_obj.key;
    // keyInput_history += input_obj.key;

    for (const bookmark_laucher of bookmarkList) {
        if (keyInput_history == getHotKey(bookmark_laucher.title)) {
            chrome.tabs.create(
                { url: bookmark_laucher.url }
            );
        }
    }

    showKeyInput_history()

    if (input_obj.key == "Backspace") {
        chrome.tabs.create(
            { url: "https://ja.javascript.info/keyboard-events" }
        );

    }
    return false;
}

function getHotKey(s) {
    return s.slice(0, s.indexOf(":"));
}

function showKeyInput_history() {
    let p_element = document.createElement("p");
    p_element.textContent = keyInput_history

    let textbox = document.getElementById("keyInput_history");
    textbox.appendChild(p_element);
}
