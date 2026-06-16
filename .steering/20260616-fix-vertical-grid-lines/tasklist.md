# バグ修正タスクリスト: 17時以降の縦の罫線が消えている

## タスク一覧

### 1. CSSのセレクタ優先順位の修正
- [x] `.days-container .day-column` セレクタの追加
- [x] `border-right: 1px solid var(--border) !important;` の適用
- [x] `.days-container .day-column:last-child` セレクタの追加
- [x] `border-right: none !important;` の適用
- [x] 冗長なCSSセレクタと`!important`宣言の削除

### 2. 修正内容の検証
- [x] すべての時間帯で縦の罫線が表示されていることを確認
- [x] 特に17時以降の時間帯で罫線が表示されていることを確認
- [ ] 異なるブラウザでの表示を確認

### 3. テストの実行
- [x] Playwrightテスト環境のセットアップ
- [x] 既存のテストがすべて通ることを確認
- [ ] 新しいVisual Regressionテストの作成（必要に応じて）

### 4. ドキュメントの更新
- [ ] CHANGELOGの更新（必要に応じて）

### 5. コミットとプッシュ
- [ ] 変更内容のコミット
- [ ] リモートリポジトリへのプッシュ