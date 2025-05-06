
function bbbbb() {
    // let p_1_element = document.createElement('p');
    // p_1_element.textContent = bookmarkTreeNodes[0].node.title
    // textbox.appendChild(p_1_element);

    // let p_2_element = document.createElement('p');
    // p_2_element.textContent = "オラオラ";
    // textbox.appendChild(p_2_element);



    chrome.bookmarks.create(
        {
            title: "bookmarks.create() on MDN",
            url: "https://developer.mozilla.org/Add-ons/WebExtensions/API/bookmarks/create",
        }
    );
}

// bbbbb();

// chrome.bookmarks.search({ title: "SiteLauncher_ver1" }, (results) => {
//     for (const result of results) {
//         chrome.bookmarks.create(
//             {
//                 title: "aaaaaaaaaaaaaaaaaaaaa" + result.id,
//                 url: result.url
//             }
//         );
//     }
// });

function createChild(parentBookmark) {
    chrome.bookmarks.getChildren(
        parentBookmark.id,
        (results) => {
            // alert(result_);
            for (const result_ in results) {
                alert(result_)
                // chrome.bookmarks.create(
                //     {
                //         title: result_,
                //         // url: result_.url,
                //         url: "https://www.tohoho-web.com/js/statement.htm#stFor",
                //     }
                // );
            }
        }
    );
}

function cccc() {
    chrome.bookmarks.search(
        { title: "SiteLauncher_ver1" },
        (results) => {
            // alert("aaaaaaaaaaaa")

            for (const result of results) {
                createChild(result)
                // alert(result.title)
            }
        }
    );
}

function addItem(bookmark_a) {
    // ul要素を作成
    let ul_element = document.createElement('ul');
    for (let i = 1; i <= 5; i++) {
        var li_element = document.createElement('li');
        li_element.textContent = 'テキスト' + bookmark_a.title;
        ul_element.appendChild(li_element);
    }

    // 作成したHTML要素をarticle要素に追加する
    let textbox = document.getElementById('bookmark');
    textbox.appendChild(ul_element);
}

// cccc();

function dddd(bookmarkid) {
    // a要素を作成
    chrome.bookmarks.getChildren(
        bookmarkid,
        (results) => {
            for (let result of results) {
                let a_element = document.createElement("a");
                a_element.textContent = result.title;
                a_element.href = result.url;

                let textbox = document.getElementById('bookmark');
                textbox.appendChild(a_element);
            }
        }
    );


    // for (let i = 1; i <= 5; i++) {
    //     let a_element = document.createElement("a");
    //     a_element.textContent = 'Top page' + i;
    //     a_element.href = "https://developer.chrome.com/docs/extensions/reference/bookmarks/";
    //     let textbox = document.getElementById('bookmark');
    //     textbox.appendChild(a_element);

    // }

}

chrome.bookmarks.search(
    { title: "SiteLauncher_ver1" },
    (results) => {
        for (const result of results) {
            dddd(result.id)
        }
    }
);
