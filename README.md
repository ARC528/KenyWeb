# 御心 DIARY サイト（GitHub Pages対応）

このフォルダをそのまま GitHub リポジトリにアップロードして、GitHub Pages を有効化すると表示できます。

## 公開方法

1. GitHubで新しいリポジトリを作成
2. このZIPの中身をすべてアップロード
3. GitHubの `Settings` → `Pages`
4. `Deploy from a branch` を選択
5. Branchを `main` / folderを `/root` にして保存
6. 数分後に表示URLが発行されます

## 日記の増やし方

GitHub Pagesではフォルダ内のtxtを自動検索できないため、日記を追加・削除したら `data/diaries.json` も編集します。

### 1. 日記ファイルを追加

`diaries/2024-06-18.txt` のように作成します。

```txt
date: 2024.06.18
title: 静かな夜
image: diary-images/sample.jpg

ここに本文を書きます。
改行もそのまま反映されます。
```

画像なしの場合はこうします。

```txt
date: 2024.06.18
title: 静かな夜
image:

ここに本文を書きます。
```

### 2. 一覧に追加

`data/diaries.json` にファイル名を追加します。
上に置いたものから順番に一覧へ表示されます。

```json
[
  "2024-06-18.txt",
  "2024-05-17.txt",
  "2024-05-10.txt"
]
```

### 3. 画像を追加

日記に画像を1枚入れる場合は `diary-images` フォルダに画像を入れて、txtの `image:` にパスを書きます。

例：

```txt
image: diary-images/rain-town.jpg
```

## 日記の削除方法

1. `diaries` フォルダから対象txtを削除
2. `data/diaries.json` から対象ファイル名を削除
3. 画像も不要なら `diary-images` から削除

## 右背景の差し替え

`assets/right-background.jpg` を同じ名前で差し替えるだけでOKです。
ファイル名を変える場合は `style.css` の以下を変更します。

```css
background-image: url('assets/right-background.jpg');
```

## ローカル確認の注意

このサイトは `fetch()` で日記txtを読み込むため、PC上で `index.html` を直接ダブルクリックすると日記が表示されない場合があります。
確認は GitHub Pages上、または VS Code の Live Server で行ってください。
