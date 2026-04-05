# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

---

## フェーズ1: testing スキルの全面書き直し

> **チェックポイント CP-1**: testing/SKILL.md が手順書形式に書き直され、起動確認・コンソールエラー確認・ネットワークエラー確認の必須サイクルが含まれていること。

- [x] `.claude/skills/testing/SKILL.md` を全面書き直す
  - [x] チェックリスト形式を廃止し、番号付き手順書形式に変換
  - [x] ステップ1: 起動コマンド特定（package.json / Makefile / README の優先順位）
  - [x] ステップ2: バックグラウンド起動 + ポート待機
  - [x] ステップ3: playwright-cli でのアクセス + 操作確認サイクル（操作 → console error → network の繰り返し）
  - [x] ステップ4: アプリ停止
  - **受け入れ条件**: 手順書として読んだ Claude が、各インタラクション後に `playwright-cli console error` と `playwright-cli network` を実行する

### CP-1 チェックポイント確認

- **完了日時**: 2026-04-05 完了
- **Evidence（証拠）**: `.claude/skills/testing/SKILL.md` を手順書形式に全面書き直し。起動・操作サイクル・エラー確認・停止の4ステップ構成。
- **Recovery（復旧メモ）**: 問題なし

---

## フェーズ2: add-feature-ui.md の修正

> **チェックポイント CP-2**: E2E テストアサーション指示とステップ7.5 の省略禁止指示が追加されていること。

- [x] `add-feature-ui.md` ステップ4-2 に E2E テストコードのアサーション注記を追加
  - [x] `page.on('console', ...)` によるコンソールエラー収集パターン
  - [x] `page.on('response', ...)` によるネットワークエラー収集パターン
  - [x] `expect(consoleErrors).toHaveLength(0)` アサーション例
  - **受け入れ条件**: 計画フェーズで E2E テストタスクを作成する際、アサーションが含まれる指示が明記されている

- [x] `add-feature-ui.md` ステップ7.5 に省略禁止指示を追加
  - **受け入れ条件**: `Skill('testing')` 呼び出し前に「各インタラクション後に必ず console error / network を確認すること（省略禁止）」が明記されている

### CP-2 チェックポイント確認

- **完了日時**: 2026-04-05 完了
- **Evidence（証拠）**: ステップ4-2 に E2E アサーションコード例追加・ステップ7.5 に省略禁止注記追加
- **Recovery（復旧メモ）**: 問題なし

---

## フェーズ3: add-feature.md の修正

> **チェックポイント CP-3**: ステップ7.5 の省略禁止指示が追加されていること。

- [x] `add-feature.md` ステップ7.5 に省略禁止指示を追加
  - **受け入れ条件**: `Skill('testing')` 呼び出し前に「各インタラクション後に必ず console error / network を確認すること（省略禁止）」が明記されている

### CP-3 チェックポイント確認

- **完了日時**: 2026-04-05 完了
- **Evidence（証拠）**: ステップ7.5 に省略禁止注記追加
- **Recovery（復旧メモ）**: 問題なし

---

## フェーズ4: 品質ゲート（DoD 準拠）

> **チェックポイント CP-FINAL**: 変更対象はすべてマークダウンファイルのため、lint/typecheck/test は N/A。手動レビューで品質確認。

### Gate 1: 静的解析（必須）

- [x] ~~lint が通ること~~ (理由: package.json が存在しない。マークダウンファイルのみの変更のため N/A)

### CP-FINAL チェックポイント確認

- **完了日時**: 2026-04-05 完了
- **Gate 1 Evidence**: N/A（package.json なし・マークダウンファイルのみの変更）
- **Gate 2 Evidence**: スキップ（playwright.config.ts なし）
- **Gate 3 Evidence**: スキップ（tests/vrt/__screenshots__/ なし）
- **Gate 4 Evidence**: スキップ（tests/a11y/ なし）
- **Gate 5 Evidence**: スキップ（ui-ux-validator.md なし）
- **反復回数**: 0
- **Recovery（復旧メモ）**: 問題なし

---

## フェーズ5: ドキュメント更新

- [x] 仕様書 `docs/ideas/20260405-testing-skill-console-error-check.md` のステータスを `Draft` から `Done` に更新
- [x] 実装後の振り返りをこのファイルの下部に記録

---

## 実装後の振り返り

### 実装完了日
2026-04-05

### デモ手順
1. `.claude/skills/testing/SKILL.md` を開いて手順書形式（ステップ1〜4）になっていることを確認
2. `.claude/commands/add-feature-ui.md` ステップ4・7.5 を開いてアサーション指示・省略禁止指示を確認
3. `.claude/commands/add-feature.md` ステップ7.5 を開いて省略禁止指示を確認
4. 次回 `/add-feature-ui` を実行したとき、ステップ7.5 で playwright-cli が console error / network を操作ごとに確認することを検証する

### チェックポイントサマリ

| CP | 完了日時 | 主な問題 | 反復回数 |
|----|---------|---------|---------|
| CP-1 | 2026-04-05 | なし | 0 |
| CP-2 | 2026-04-05 | なし | 0 |
| CP-3 | 2026-04-05 | なし | 0 |
| CP-FINAL | 2026-04-05 | なし（マークダウンのみ・lint N/A） | 0 |

### 計画と実績の差分

**計画と異なった点**:
- implementation-validator による推奨修正3件を追加で適用した（Windows 非対応の `nc` コマンドへの警告、ポートのプレースホルダー化、add-feature.md への Gate 2 非対象注記）

**新たに必要になったタスク**:
- なし

### 学んだこと

**技術的な学び**:
- `testing` スキルのようなチェックリスト形式の指示は、Claude が省略しやすい。番号付き手順書形式 + 「省略禁止」明記が有効。
- コマンドファイル側（add-feature-ui.md）の Blockquote 注記と SKILL.md 側の冒頭注記を二重に入れることで、省略防止の冗長性を確保できる。

**プロセス上の改善点**:
- implementation-validator が Windows 環境依存の問題を検出してくれた。環境依存コマンドは最初からプレースホルダーや代替案を記述しておくとよい。

### 次回への改善提案
- `testing/SKILL.md` の起動コマンド特定ロジックを Python / Go / Docker 環境にも対応させる（現状は主に npm を想定）
- `playwright-cli console warning` の任意確認フローも将来的に追加を検討
