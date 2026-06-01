# 要求内容

## 概要

Claude Code AI駆動開発テンプレートの差分改善 v2。
2026-05-26 の改善（`.steering/20260526-template-improvement/`）を前提に、実務エンジニアリングで必要な作業規律を既存テンプレートへ差分追加する。

## 背景

前回改善でフローの基盤は完成している。今回は以下の作業規律を自然に反映する：
- 曖昧な要件の深掘り（`/plan-kaizen` 強化）
- 既存ドキュメント・ADR・用語集を踏まえた実装前確認（`/add-feature` 系強化）
- バグ修正の再現重視（新規 `/fix-bug` コマンド）
- 小さな red-green-refactor（`development-guidelines` + `testing` skill 強化）
- 大きな変更後の構造レビュー（`implementation-validator` 強化）
- 中断・再開時の handoff（`tasklist.md` テンプレート + `resume-work` + `steering/SKILL` 強化）
- 通常コマンドの安全停止ルール明確化（`add-feature-ui` への ルールC 追加）

## 実装対象

### 1. `add-feature-ui.md` の安全停止明確化
- frontmatter description を "controlled automation" 表現に変更
- ヘッダーの「完全自動実行モード」表現を修正
- 絶対禁止から「ユーザーに判断を仰ぐこと」を削除
- ルールC（安全停止）を追加

### 2. `auto-add-feature-ui-with-plan.md` フェーズ2.5 安全チェック追加
- `auto-add-feature-with-plan.md` の フェーズ2.5 と同一内容を追加

### 3. `plan-kaizen.md` 要件深掘り観点追加
- 壁打ちの観点に「誰の課題か」「MVPスコープ」「テスト可能な受け入れ条件」「glossary反映候補」を追加
- 「質問しすぎ禁止」注意書きを追加

### 4. `add-feature.md` / `add-feature-ui.md` のステップ2強化
- glossary.md・adr/ の確認手順を追加
- 矛盾検知時の対処（ユーザー確認またはADR化）を追加

### 5. `CLAUDE.md` の glossary 役割明確化
- ドキュメント役割テーブルに `docs/glossary.md` を追記
- 「共有言語は `docs/glossary.md` を使う」を明記

### 6. `development-guidelines.md` への glossary 整合追記
- 命名規則箇所に「glossary.md と整合させること」追記

### 7. `/fix-bug` コマンド新規作成
- `.claude/commands/fix-bug.md` を作成
- CLAUDE.md のコマンド一覧に追記

### 8. `development-guidelines.md` TDD/red-green-refactor 方針追加
- horizontal slicing 禁止を含む red-green-refactor 方針セクションを追加

### 9. `testing/SKILL.md` TDD 推奨場面の注記追加

### 10. `implementation-validator.md` 構造レビューセクション追加
- 責務境界・命名整合・ゴーストファイル・ADR候補確認を追加

### 11. `tasklist.md` テンプレートに Handoff セクション追加

### 12. `resume-work.md` に Handoff セクション読み込み追加

### 13. `steering/SKILL.md` に Handoff 記録指示追加

### 14. 誤字修正・表記統一
- "ステアリングフィル" → "ステアリングファイル"（`workflow-guardrails.md`, `CLAUDE.md`）
- `add-feature.md` / `add-feature-ui.md` description 表現修正

## 受け入れ条件

- `add-feature-ui.md` にルールCが存在する
- `auto-add-feature-ui-with-plan.md` にフェーズ2.5が存在する
- `plan-kaizen.md` に要件深掘り観点（誰の課題・MVP・glossary反映）が存在する
- 両コマンドのステップ2に glossary/ADR 確認が存在する
- `fix-bug.md` が存在し、CLAUDE.md に追記されている
- `development-guidelines.md` に red-green-refactor 方針が存在する
- `testing/SKILL.md` に TDD 推奨場面の注記が存在する
- `implementation-validator.md` に構造レビューセクションが存在する
- `tasklist.md` テンプレートに Handoff セクションが存在する
- `resume-work.md` が Handoff セクションを優先読み込みする
- `steering/SKILL.md` に Handoff 記録指示が存在する
- 誤字 "ステアリングフィル" が修正されている

## スコープ外

- mattpocock/skills 本体の導入
- 新規エージェントの追加
- hooks / settings の変更
- `.env`, credentials 類の変更
- `src/` 配下のコード作成（ドキュメントのみ変更）

## 参照

- `docs/ideas/20260601_template-improvement-v2-spec.md` — 詳細仕様書
- `docs/ideas/20260601_update-idea.md` — 原典アイデアメモ
