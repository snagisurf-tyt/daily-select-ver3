# タスクリスト: Hooks強化 & プリコミットフック導入

## フェーズ1: 実装

- [x] `.claude/hooks/post-lint.sh` を新規作成（言語自動検出 + additionalContext JSON出力）
- [x] `.claude/settings.json` にPreToolUse Hook（設定ファイル保護 + 機密ファイル保護 + --no-verify禁止）を追加
- [x] `.claude/settings.json` のPostToolUse Hookを `post-lint.sh` 呼び出しに更新
- [x] `lefthook.yml` テンプレートをプロジェクトルートに作成
- [x] `.claude/docs/guidelines/definition-of-done.md` にL2フィードバック層（プリコミット）の記載を追加

## フェーズ2: 検証

- [x] 最終確認: 全ファイルの整合性チェック

---

## フェーズ3: バグ修正（implementation-validator指摘）

- [x] `post-lint.sh` の jq パイプライン修正（`$(cat)` → `--arg msg "$diag"`）
- [x] `lefthook.yml` の `|| true` パターン修正（`skip:` 機能に置換）
- [x] `definition-of-done.md` のフィードバック速度テーブルに L0 行追加
- [x] `definition-of-done.md` の L2 コード例に `ruff-format` 追加

---

## CP-FINAL Evidence

| Gate | 結果 | 備考 |
|------|------|------|
| 静的解析 (Gate 1) | N/A | テンプレートプロジェクト（package.json不在）のため適用外 |
| E2E (Gate 2) | N/A | playwright.config.ts 不在のため適用外 |
| VRT (Gate 3) | N/A | tests/vrt/__screenshots__/ 不在のため適用外 |
| a11y (Gate 4) | N/A | tests/a11y/ 不在のため適用外 |
| UI/UX (Gate 5) | N/A | UI変更なし（設定ファイル・スクリプト・ドキュメントのみ） |
| implementation-validator | PASS | 指摘2件（Critical）+ 2件（Recommended）→ 全件修正済み |

---

## 申し送り事項

### 実装完了日
2026-03-21

### 計画と実績の差分
- 計画通り5ファイルの作成・変更を実施
- implementation-validator が2件のCriticalバグを検出し、フェーズ3として追加修正を実施

### 学んだこと
- `|| true` パターンはシェルの演算子優先度により、前段のコマンドが失敗しても常に exit 0 になる。Lefthook の `skip:` 機能を使うべき
- PostToolUse Hook の JSON 出力で `$(cat)` を使うと stdin が既に消費されている場合に空文字列になる。変数を `--arg` で渡す方が安全

### 次回への改善提案
- Lefthook の `skip:` 構文はドキュメント上の例と実際の動作が異なる場合がある。テンプレート利用者がインストール後に `lefthook run pre-commit` で動作確認することを推奨

### デモ手順
1. `.claude/settings.json` の PreToolUse Hook: `.eslintrc` や `.env` を編集しようとすると BLOCKED メッセージが出力される
2. `.claude/hooks/post-lint.sh`: `.py` ファイルを編集すると ruff が自動実行され、違反があれば additionalContext として注入される
3. `lefthook.yml`: `npx lefthook install` 後、`git commit` 時に lint/typecheck/ruff が自動実行される
