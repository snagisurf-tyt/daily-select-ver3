# 要件定義: スクリーンショット散乱防止

## 背景
Playwright（playwright-cli / MCP）がスクリーンショットを撮影する際、filename未指定時に `page-{timestamp}.png` がプロジェクトルート直下に保存され放置される。

## 要件
1. `.gitignore` にルート直下 png（`/*.png`）と `artifacts/` を追加
2. PostToolUse Hook で `browser_take_screenshot` 後にルート直下の png を `artifacts/screenshots/` に自動移動
3. `testing` スキルにスクリーンショット保存先ルールとクリーンアップ手順を追記
4. `CLAUDE.md` にスクリーンショット保存先ルールを追記

## 制約
- `docs/screenshots/` 配下は移動対象外（README用）
- Hook の実行はミリ秒レベル
- 既存の PostToolUse Hook（post-lint.sh）と競合しないこと
