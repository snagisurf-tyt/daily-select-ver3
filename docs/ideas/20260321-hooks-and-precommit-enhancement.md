# Hooks強化 & プリコミットフック導入 仕様書

> 作成日: 2026-03-21
> ステータス: Draft
> 用途: /add-feature への入力

---

## 1. 背景・目的

Harness Engineeringベストプラクティス記事の分析から、現在のテンプレートに以下の未対応箇所がある:

- **Safety Gates（PreToolUse Hook）が未実装**: エージェントがリンター設定を改竄してエラーを消す、`.env`を編集する、破壊的コマンドを実行する、といった行為を防止できない
- **PostToolUse HookがJSON additionalContext形式でない**: 通常stdoutでのフィードバックは確実にエージェントのコンテキストに注入されない。また言語がnpm固定で多言語対応していない
- **プリコミットフック（L2フィードバック層）が未設定**: PostToolUse（L1）とCI（L3）の間のフィードバック層が欠落。`--no-verify`の禁止もない

参考: `docs/ideas/Harness Engineering best practice.md`

## 2. スコープ

### 今回含めるもの
- A: PreToolUse Hook（Safety Gates）の追加
- B: PostToolUse HookのJSON additionalContext形式への改善 + 言語自動検出
- F: Lefthookプリコミットフック設定テンプレートの追加
- G: `git commit --no-verify` 禁止の設定

### 今回含めないもの（将来対応）
- Stop Hook（Completion Gate）— 現行ワークフローのDoD品質ゲートで代替
- カスタムリンタールールの設計（archgateパターン等）
- Planktonパターン（高度なマルチリンター統合）

## 3. ユーザーストーリー

- テンプレート利用者として、エージェントがリンター設定を改竄できないようにしたい。
- テンプレート利用者として、PostToolUse Hookのフィードバックが確実にエージェントに届くようにしたい。
- テンプレート利用者として、コミット前にlint/typecheckが自動実行されてほしい。

## 4. 機能要件

### A: PreToolUse Hook（Safety Gates）

- [ ] `.claude/settings.json` に PreToolUse Hook を追加
- [ ] リンター設定ファイルの編集をブロック:
  - 対象: `.eslintrc*`, `eslint.config*`, `biome.json`, `.prettierrc*`, `tsconfig.json`, `pyproject.toml`(lint関連セクション), `.golangci.yml`, `lefthook.yml`, `.ruff.toml`, `ruff.toml`
  - エラーメッセージ: `BLOCKED: [ファイル名] is a protected config file. Fix the code, not the linter config.`
- [ ] `.env` / `.env.*` / `credentials*` / `*.key` ファイルの編集をブロック
  - エラーメッセージ: `BLOCKED: [ファイル名] is a sensitive file. Do not edit credentials or environment files directly.`

### B: PostToolUse Hook改善

- [ ] `.claude/hooks/post-lint.sh` スクリプトを新規作成
- [ ] 言語自動検出ロジック:
  - ファイル拡張子 `.ts|.tsx|.js|.jsx` → npm run lint（またはoxlint/biome）
  - ファイル拡張子 `.py` → ruff check + ruff format（インストール済みの場合）
  - ファイル拡張子 `.go` → golangci-lint run（インストール済みの場合）
  - 上記以外 → スキップ（exit 0）
- [ ] 出力を `hookSpecificOutput.additionalContext` を含むJSON形式にする
- [ ] `.claude/settings.json` のPostToolUse Hookを更新してシェルスクリプトを呼び出す形に変更

### F: Lefthookプリコミットフック設定テンプレート

- [ ] `lefthook.yml` テンプレートをプロジェクトルートに配置
- [ ] pre-commit:
  - lint: `npm run lint`（package.json存在時）
  - typecheck: `npm run typecheck`（package.json存在時）
  - Python: `ruff check`（pyproject.toml/ruff.toml存在時）
- [ ] `definition-of-done.md` にL2フィードバック層（プリコミット）の記載を追加
- [ ] インストール手順を記載

### G: `--no-verify` 禁止

- [ ] `.claude/settings.json` の PreToolUse Hook に、`git commit --no-verify` / `git push --no-verify` を含むBashコマンドをブロックするルールを追加
  - エラーメッセージ: `BLOCKED: --no-verify is not allowed. Fix the issues that pre-commit hooks detect.`

## 5. 非機能要件

- PostToolUse Hookは高速であること（秒以下で完了）
- PreToolUse Hookはブロック判定のみなので即座に完了すること
- ツールが未インストールの場合はエラーにならずスキップすること

## 6. 技術的考慮事項（参考）

### 実装アプローチ

**PostToolUse Hook（記事推奨のJSON形式）:**
```bash
#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"
file="$(jq -r '.tool_input.file_path // .tool_input.path // empty' <<< "$input")"

case "$file" in
  *.ts|*.tsx|*.js|*.jsx)
    [ -f package.json ] || exit 0
    diag="$(npm run lint --silent 2>&1 | head -20)" || true
    ;;
  *.py)
    command -v ruff >/dev/null 2>&1 || exit 0
    ruff check --fix "$file" >/dev/null 2>&1 || true
    diag="$(ruff check "$file" 2>&1 | head -20)" || true
    ;;
  *)
    exit 0
    ;;
esac

if [ -n "$diag" ]; then
  jq -Rn --arg msg "$diag" '{
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: $msg
    }
  }'
fi
```

**PreToolUse Hook（設定ファイル保護 + .env保護 + --no-verify禁止）:**
settings.jsonのPreToolUseセクションに3つのフックを追加。

### 既存コードへの影響（想定）
- 変更: `.claude/settings.json` — PreToolUse Hook追加、PostToolUse Hook更新
- 追加: `.claude/hooks/post-lint.sh` — 新規Hookスクリプト
- 追加: `lefthook.yml` — プリコミットフック設定テンプレート
- 変更: `.claude/docs/guidelines/definition-of-done.md` — L2フィードバック層の記載追加

### 注意点・リスク
- `jq` コマンドが環境にインストールされている必要がある（Windows環境では要確認）
- Lefthookはテンプレート配布時点ではインストール不要（利用者が初回セットアップで導入）
- リンター設定ファイル保護は、正当な設定変更もブロックするため、ユーザーが手動で変更する場合はHookを一時無効化する必要がある

## 7. 受け入れ条件

- [ ] PreToolUse Hookが `.eslintrc*` 等の編集をブロックすること
- [ ] PreToolUse Hookが `.env` の編集をブロックすること
- [ ] PreToolUse Hookが `git commit --no-verify` をブロックすること
- [ ] PostToolUse Hookが `hookSpecificOutput.additionalContext` 形式のJSONを返すこと
- [ ] PostToolUse Hookが `.py` ファイル編集時にRuff（インストール済みなら）を実行すること
- [ ] `lefthook.yml` テンプレートが存在すること
- [ ] `definition-of-done.md` にL2フィードバック層が記載されていること

## 8. 参考・関連

- 関連ドキュメント: `docs/ideas/Harness Engineering best practice.md`（原則2: 決定論的ツール）
- 関連ファイル: `.claude/settings.json`、`.claude/docs/guidelines/definition-of-done.md`
- 参考: [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
