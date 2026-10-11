# 見学ガイドにPDFを追加する

現在はPDF未登録です。見学ガイドの「配布資料（PDF）」に準備中の枠を表示します。

| コース | PDFを置くフォルダ | 登録する設定ファイル |
| --- | --- | --- |
| 電子 | `public/pdfs/i/` | `src/data/i/guide.json` |
| 国際 | `public/pdfs/k/` | `src/data/k/guide.json` |

## 追加手順

1. PDFを上のフォルダに置きます。半角英数字のファイル名を推奨します。
2. 対応する `guide.json` の末尾にある `documents` を編集します。`file` の空文字を次のように変更します。**設定のパスには `public/` を付けません。**

```json
"documents": [
  { "id": "rooms", "title": "部屋割り", "file": "pdfs/i/rooms.pdf" },
  { "id": "groups", "title": "グループ分け", "file": "pdfs/i/groups.pdf" },
  { "id": "seats", "title": "新幹線・バス等の座席表", "file": "pdfs/i/seats.pdf" }
]
```

国際は `pdfs/k/rooms.pdf` と `pdfs/k/groups.pdf` を指定します。国際には座席表の枠を設けていません。1つのPDFに複数の内容をまとめる場合は同じファイルを複数の枠に指定できます。

3. `npm run docs:sync` → `npm run test:content` → `npm run build` を実行します。設定したPDFの存在と拡張子も検査します。
4. PDF・設定JSON・生成された日英MarkdownをまとめてGitHubにコミットします。Actions成功後にアプリの更新を適用してください。

登録すると「PDFを開く」「PDFをダウンロード」「このページで表示」が出ます。スマートフォンなどで埋め込み表示に対応していない場合は「PDFを開く」を利用します。PDFはオフライン保存の対象に含めていないため、オンラインで開くか、事前にダウンロードしてください。PDFの本文は自動翻訳されません。

未登録に戻すには `file` を `""` にします。枠自体を消す場合は対応する項目を `documents` 配列から削除します。

## 公開範囲

GitHub Pagesに置いたPDFはURLを知っていれば閲覧できます。アプリの簡易パスワードではPDFへの直接アクセスを保護できません。氏名入りの部屋割りなど、限定公開が必要な資料はこの公開フォルダへ置かず、学校指定の認証付き共有方法を利用してください。

## English

Place Electronics PDFs in `public/pdfs/i/` and International PDFs in `public/pdfs/k/`. Set each document's `file` in the corresponding `src/data/i/guide.json` or `src/data/k/guide.json`, without the `public/` prefix. Empty paths show Coming soon. Run `npm run docs:sync`, `npm run test:content` and `npm run build`, then commit the PDFs, JSON and generated documents. PDFs require internet access or a prior download; their contents are not translated. Files hosted on GitHub Pages are publicly accessible and are not protected by the app's password gate.
