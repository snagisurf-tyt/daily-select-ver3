# 要件定義: Hooks強化 & プリコミットフック導入

## 出典
`docs/ideas/20260321-hooks-and-precommit-enhancement.md`

## 要件概要

Harness Engineeringベストプラクティスに基づき、テンプレートのHooks設定を強化する。

### A: PreToolUse Hook（Safety Gates）
- リンター設定ファイル（`.eslintrc*`, `eslint.config*`, `biome.json`, `.prettierrc*`, `tsconfig.json`, `pyproject.toml`, `.golangci.yml`, `lefthook.yml`, `.ruff.toml`, `ruff.toml`）の編集をブロック
- `.env` / `.env.*` / `credentials*` / `*.key` ファイルの編集をブロック
- ブロック時はexit 2でstderrにエラーメッセージを返す

### B: PostToolUse Hook改善
- 言語自動検出（`.ts/.tsx/.js/.jsx` → npm lint、`.py` → ruff、`.go` → golangci-lint）
- 出力を `hookSpecificOutput.additionalContext` を含むJSON形式にする
- `.claude/hooks/post-lint.sh` スクリプトを新規作成

### F: Lefthookプリコミットフック
- `lefthook.yml` テンプレートをプロジェクトルートに配置
- pre-commit: lint, typecheck, ruff check

### G: `--no-verify` 禁止
- PreToolUse Hookで `git commit --no-verify` / `git push --no-verify` を含むBashコマンドをブロック
