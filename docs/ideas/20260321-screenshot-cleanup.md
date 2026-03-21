# スクリーンショット散乱防止 仕様書

> 作成日: 2026-03-21
> ステータス: Draft
> 用途: /add-feature への入力

---

## 1. 背景・目的

`/add-feature` や `/add-feature-ui` の実行中に Playwright（playwright-cli / Playwright MCP）がスクリーンショットを撮影する場合がある。ファイル名が明示されないと `page-{timestamp}.png` がプロジェクトルート直下に保存され、そのまま放置されることが多い。

これにより:
- ルート直下が png ファイルで汚染される
- 意図せず git に追跡される可能性がある
- どのテスト・確認作業で生成されたか不明になる

## 2. スコープ

### 今回含めるもの
- `.gitignore` にルート直下 png / `artifacts/` の除外ルールを追加
- PostToolUse Hook でスクリーンショット撮影後にルート直下の png を `artifacts/screenshots/` へ自動移動
- `testing` スキルにクリーンアップ手順を追加
- `CLAUDE.md` にスクリーンショット保存先ルールを追記

### 今回含めないもの（将来対応）
- `test-results/` や `playwright-report/` の `.gitignore` 追加（別タスク）
- CI 上でのアーティファクト管理

## 3. ユーザーストーリー

- テンプレート利用者として、スクリーンショットがルート直下に散乱しないために、自動で専用ディレクトリに整理されてほしい。
- テンプレート利用者として、テスト中のスクリーンショットが git に追跡されないために、.gitignore で除外されていてほしい。

## 4. 機能要件

### 4.1 `.gitignore` の更新
- [ ] ルート直下の png ファイルを除外: `/*.png`
- [ ] `artifacts/` ディレクトリを除外: `artifacts/`

### 4.2 PostToolUse Hook（スクリーンショット自動移動）
- [ ] `.claude/hooks/post-lint.sh` を拡張するか、新規 `.claude/hooks/post-screenshot-cleanup.sh` を作成
- [ ] `browser_take_screenshot` ツール使用後に発火
- [ ] プロジェクトルート直下の `*.png` ファイルを検出
- [ ] `artifacts/screenshots/` ディレクトリを自動作成（なければ）
- [ ] 検出した png を `artifacts/screenshots/` に移動
- [ ] `docs/screenshots/` 配下の png は移動対象外（README用スクリーンショットは意図的に配置されているため）

### 4.3 `testing` スキルの更新
- [ ] 動作確認セクションに「スクリーンショットは `artifacts/screenshots/` に保存すること」のルールを追記
- [ ] テスト完了後のクリーンアップ手順を追記

### 4.4 `CLAUDE.md` の更新
- [ ] 「スクリーンショットは `artifacts/screenshots/` に保存する」ルールを追記

## 5. 非機能要件

- パフォーマンス: Hook の実行はミリ秒レベルで完了すること（ファイル移動のみ）
- 安全性: `docs/screenshots/` 配下は移動対象外にし、README用画像を壊さない

## 6. 技術的考慮事項（参考）

### 実装アプローチ（案）

**PostToolUse Hook**: `.claude/settings.json` の PostToolUse に `browser_take_screenshot` マッチャーで新規フックを追加。既存の `Edit|Write` マッチャー（post-lint.sh）とは独立。

```bash
# post-screenshot-cleanup.sh の骨格
#!/usr/bin/env bash
set -euo pipefail

# プロジェクトルート直下の *.png を検出
shopt -s nullglob
files=(*.png)
[ ${#files[@]} -eq 0 ] && exit 0

# 移動先を作成
mkdir -p artifacts/screenshots

# 移動
for f in "${files[@]}"; do
  mv "$f" "artifacts/screenshots/"
done
```

**settings.json への追加**:
```json
{
  "matcher": "mcp__playwright__browser_take_screenshot",
  "hooks": [{"type": "command", "command": "bash .claude/hooks/post-screenshot-cleanup.sh"}]
}
```

### 既存コードへの影響（想定）
- 変更: `.gitignore` — png / artifacts/ 除外ルール追加
- 変更: `.claude/settings.json` — PostToolUse にフック追加
- 変更: `.claude/skills/testing/SKILL.md` — クリーンアップ手順追記
- 変更: `CLAUDE.md` — スクリーンショット保存先ルール追記
- 追加: `.claude/hooks/post-screenshot-cleanup.sh` — 新規フック

### 注意点・リスク
- PostToolUse のマッチャーは `mcp__playwright__browser_take_screenshot` でMCP経由の撮影をカバーするが、`playwright-cli screenshot` は Bash ツール経由なので別のマッチャーが必要になる可能性がある → Bash マッチャーでは過剰にフックが発火するため、ファイル検出ベースのアプローチ（ルート直下の png があるときだけ移動）が安全

## 7. 受け入れ条件

- [ ] プロジェクトルート直下に png ファイルが残らない（`artifacts/screenshots/` に移動される）
- [ ] `.gitignore` に `/*.png` と `artifacts/` が含まれている
- [ ] `docs/screenshots/` 配下の png は影響を受けない
- [ ] PostToolUse Hook がスクリーンショット撮影後に正しく発火する

## 8. 参考・関連

- 関連ドキュメント: `.claude/docs/guidelines/definition-of-done.md`（フィードバック速度階層）
- 関連コード: `.claude/hooks/post-lint.sh`（既存PostToolUseフック）
- 関連コード: `.claude/skills/testing/SKILL.md`（テストスキル）
- 関連コード: `.claude/agents/screenshot-capture.md`（README用スクリーンショット → `docs/screenshots/` に保存済み）
