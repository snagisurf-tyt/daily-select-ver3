# 設計: Hooks強化 & プリコミットフック導入

## 変更対象ファイル

| ファイル | 操作 | 内容 |
|---------|------|------|
| `.claude/settings.json` | 変更 | PreToolUse Hook追加、PostToolUse Hook更新 |
| `.claude/hooks/post-lint.sh` | 新規 | 言語自動検出 + additionalContext JSON出力 |
| `lefthook.yml` | 新規 | プリコミットフック設定テンプレート |
| `.claude/docs/guidelines/definition-of-done.md` | 変更 | L2フィードバック層の記載追加 |

## 設計詳細

### PreToolUse Hook設計

3つのPreToolUse Hookを追加:

1. **設定ファイル保護** (matcher: `Write|Edit`)
   - `tool_input.file_path` / `tool_input.path` をjqで取得
   - 保護対象ファイル名リストと照合
   - 一致した場合: stderr + exit 2

2. **機密ファイル保護** (matcher: `Write|Edit`)
   - `.env*`, `credentials*`, `*.key` パターンと照合
   - 一致した場合: stderr + exit 2

3. **--no-verify禁止** (matcher: `Bash`)
   - `tool_input.command` に `--no-verify` が含まれるか検査
   - 含まれる場合: stderr + exit 2

### PostToolUse Hook設計

`.claude/hooks/post-lint.sh`:
1. stdinからJSON入力を読み取り、`tool_input.file_path`を取得
2. 拡張子で言語を判定
3. 該当するリンターを実行（未インストール時はスキップ）
4. 違反がある場合、`hookSpecificOutput.additionalContext` JSON形式で出力

### Lefthook設計

テンプレート的な `lefthook.yml`:
- pre-commit で lint + typecheck を実行
- 条件付き実行（package.json / pyproject.toml の存在チェック）

## アーキテクチャ意思決定

このタスクは既存のsettings.json設定の拡張であり、新しいライブラリ導入やアーキテクチャ変更は含まない。ADR生成は不要。
