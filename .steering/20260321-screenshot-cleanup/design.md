# 設計: スクリーンショット散乱防止

## アーキテクチャ

### PostToolUse Hook
- 新規ファイル: `.claude/hooks/post-screenshot-cleanup.sh`
- マッチャー: `mcp__playwright__browser_take_screenshot`（MCP経由の撮影をカバー）
- `playwright-cli screenshot` は Bash ツール経由だが、フックはファイル検出ベースで動作するため安全（ルート直下に png がなければ即 exit 0）

### ファイル移動ロジック
1. `shopt -s nullglob` でルート直下の `*.png` をグロブ
2. ファイルがなければ exit 0
3. `mkdir -p artifacts/screenshots`
4. 各ファイルを `mv` で移動

### 変更対象ファイル
| ファイル | 変更種別 |
|---------|---------|
| `.gitignore` | 変更（ルール追加） |
| `.claude/hooks/post-screenshot-cleanup.sh` | 新規作成 |
| `.claude/settings.json` | 変更（PostToolUse にフック追加） |
| `.claude/skills/testing/SKILL.md` | 変更（ルール追記） |
| `CLAUDE.md` | 変更（ルール追記） |

## ADR生成判定
新しいライブラリ・フレームワーク導入なし。既存パターンの拡張のみ。→ ADR不要
