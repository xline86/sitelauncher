# SiteLauncher

Chrome拡張機能です。

拡張機能を実行するとpopupを展開し、ユーザーの入力待ち状態になります。
キーボード入力をもとに、登録済みのブックマークから指定されたWebサイトを即座に開きます。

## ブックマークの登録方法

SiteLauncherで開きたいサイトは、Chromeのブックマーク内に `SiteLauncher_ver1` という名前のフォルダを作成し、そのフォルダ内に登録してください。

ブックマーク名は以下の形式で登録します。

```text
key:label
```

- `key`: popupで入力する起動キー
- `label`: popupの検索結果に表示する名前

例:

```text
g:Google
gh:GitHub
yt:YouTube
```

上記の例では、SiteLauncherのpopupで `g` と入力するとGoogleを開けます。

`SiteLauncher_ver1` フォルダ以外に登録されたブックマークは、SiteLauncherの検索対象にはなりません。

## 使い方

1. Chromeで `SiteLauncher_ver1` フォルダを作成する
2. フォルダ内に `key:label` 形式でブックマークを登録する
3. 拡張機能のpopupを開く
4. 起動キーを入力して対象サイトを開く

入力中は候補が表示されます。
完全一致した場合は自動で開き、候補を選ぶ場合は矢印キーとEnterキーで開けます。

## ストア登録用ZIPの作成

Chromeウェブストアへ登録するためのZIPファイルは、以下のPowerShellスクリプトで作成できます。

```powershell
.\script\build-zip.ps1
```

実行すると、必要なファイルをまとめたZIPファイルが `dist/SiteLauncher-v1.0.zip` に作成されます。

スクリプトは以下のファイルが存在することを確認してからZIPを作成します。

- `manifest.json`
- `popup.html`
- `popup.css`
- `popup.js`
- `icons/icon16.png`
- `icons/icon32.png`
- `icons/icon48.png`
- `icons/icon128.png`
