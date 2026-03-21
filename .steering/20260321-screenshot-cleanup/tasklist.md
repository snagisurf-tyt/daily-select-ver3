# タスクリスト: スクリーンショット散乱防止

## フェーズ1: 実装

- [x] `.gitignore` に `/*.png` と `artifacts/` を追加
- [x] `.claude/hooks/post-screenshot-cleanup.sh` を新規作成
- [x] `.claude/settings.json` の PostToolUse に screenshot cleanup フックを追加
- [x] `.claude/skills/testing/SKILL.md` にスクリーンショット保存先ルールとクリーンアップ手順を追記
- [x] `CLAUDE.md` にスクリーンショット保存先ルールを追記

## フェーズ2: 検証

- [x] 全ファイルの整合性確認

---

## フェーズ3: Validator指摘対応

- [x] `.jpg` 拡張子をフックと .gitignore の両方に追加

---

## CP-FINAL Evidence

| Gate | 結果 | 備考 |
|------|------|------|
| 静的解析 (Gate 1) | N/A | テンプレートプロジェクト（package.json不在）のため適用外 |
| E2E (Gate 2) | N/A | playwright.config.ts 不在のため適用外 |
| VRT (Gate 3) | N/A | tests/vrt/__screenshots__/ 不在のため適用外 |
| a11y (Gate 4) | N/A | tests/a11y/ 不在のため適用外 |
| UI/UX (Gate 5) | N/A | UI変更なし |
| implementation-validator | PASS | 重大問題0件、推奨改善2件（jpg対応→修正済、同名衝突→許容） |

---

## 申し送り事項

### 実装完了日
2026-03-21

### 計画と実績の差分
- 計画通り5ファイルの変更を実施
- Validator指摘により `.jpg` 対応を追加（計画外だが妥当な改善）
- `Bash` マッチャーを設計段階では含めていたが、過剰発火を避けるため `mcp__playwright__browser_take_screenshot` のみに変更

### 学んだこと
- `/*.png` パターンはルート直下のみに限定される（サブディレクトリは影響しない）。`docs/screenshots/` 配下を守る目的に適合
- PostToolUse のマッチャーは `|` で OR 指定できるが、`Bash` のような汎用マッチャーは不要な発火が多すぎる

### 次回への改善提案
- `playwright-cli screenshot` は Bash ツール経由のため、PostToolUse Hook でマッチできない。ルート直下の png は `.gitignore` で git 追跡を防ぎ、MCP経由の撮影はフックで自動移動する「二重防御」設計になっている
- テンプレート利用者が `playwright-cli` を使う場合は、`--filename=artifacts/screenshots/xxx.png` を明示するよう CLAUDE.md で指示済み

### デモ手順
1. Playwright MCP で `browser_take_screenshot` を実行 → ルート直下の png が `artifacts/screenshots/` に自動移動されることを確認
2. `git status` でルート直下の png が追跡されないことを確認（`/*.png` による除外）
3. `docs/screenshots/` に png を配置 → git 追跡対象であることを確認
