# 長研究室ホームページ — HOME (Three.js)

山口大学 長研究室のHOME試作です。HTML・CSS・JavaScriptを分離してあり、GitHub Pagesなどの静的ホスティングで公開できます。

## ファイル構成

```text
nagai-lab-homepage/
├── index.html              # HOME（構造）
├── css/
│   └── style.css           # HOMEデザイン / レスポンシブ表示
├── js/
│   ├── main.js             # スマホメニュー、2種類の錯視
│   └── illusion3d.js       # Three.js廊下CG、直方体、スライダー、PNG保存
└── README.md               # この説明書
```

## 動作確認

`index.html` をChrome/Edgeで開くか、より確実にはプロジェクト直下でローカルサーバーを起動してください。

```bash
python -m http.server 8000
```

その後 `http://localhost:8000/` を開きます。Three.js v0.180.0をCDNから取得するので、初回表示にはインターネット接続が必要です。

## GitHubに置く手順

1. GitHubの研究室用リポジトリのルートに、`index.html`、`css/`、`js/`、`README.md` をアップロードします。
2. GitHub Pages を使う場合は **Settings → Pages → Build and deployment → Deploy from a branch** を選び、ブランチ `main`、フォルダー `/(root)` を指定します。
3. 公開URLを開いてThree.jsとスマホ表示を確認します（Pagesの反映には時間がかかることがあります）。

## 共同開発時のルール

- `index.html` はA担当のHOMEです。各担当のHTMLは、ルート直下に配置する想定です。
- ナビゲーションのリンク先 `lab.html`、`members.html`、`seminar.html`、`events.html`、`access.html`、`students.html` は **未作成** です。各担当の完成後に配置します。
- 共通ヘッダー・フッターを全ページで統一する場合は、共通CSSを `css/common.css` に切り出すと管理しやすくなります。
- ゼミ別ページ、先生紹介、進路ページは担当間でパス名を決めてからナビゲーションを更新してください。
- 変更は担当ブランチで作業し、Pull Requestで確認してから `main` にマージする運用がおすすめです。

## 注意

- Three.jsの表示高さは、プログラム内部の1280×720の描画基準です。縮小表示された画面のCSSピクセルと必ずしも一致しません。
- 奥の直方体は同じ画面上の高さになるよう3D実寸を調整しています。大きさの恒常性の心理的効果を厳密に実証するものではありません。
- HTML/CSS/JSの静的検査を行っていますが、実ブラウザのGPUによる描画は環境により異なります。

## 今回の修正（明るい配色・正面CG）

- 元の白・青ベースのデザインと文言に戻しました。
- ロゴ・フッターの英語表記は `OSA LABORATORY` に統一しました。
- HOMEのCGカードと吹き出しの傾きを無くしました。
- Three.jsのキャンバスサイズを表示枠の実寸と同期し、正面から見た廊下のカメラを固定しました。
- HTMLだけでなく `css/` と `js/` を一緒にGitHubに配置してください。


## コードの書式・編集ルール

- HTML / CSS / JavaScript は **スペース4つ**でインデントを統一します（`.editorconfig` に設定済み）。
- CSS はセレクタの `{` を開いて、**プロパティごとに1行**で記述します。
- JavaScript は処理を1行に詰め込まず、**処理ブロック単位で改行**します。
- 共通の文字や配置は `css/style.css`、メニューや2D錯視は `js/main.js`、廊下CGは `js/illusion3d.js` を編集します。
- 表示内容の文言・リンクは `index.html` にあります。
- 既存の表示・動作は維持したまま書式を整えた版です。変更後はブラウザで動作を確認してください。
