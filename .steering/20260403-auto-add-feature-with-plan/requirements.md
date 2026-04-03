# 要求内容

## 概要

`/plan-kaizen` と `/add-feature` (または `/add-feature-ui`) を一本化した完全自動コマンド `auto-add-feature-with-plan` / `auto-add-feature-ui-with-plan` を新設する。

## 背景

現在の開発ワークフローでは、仕様策定（`/plan-kaizen`）と実装（`/add-feature`）が別コマンドに分かれており、ユーザーが手動で2回コマンドを叩く必要がある。
引数一つで「仕様策定 → 中間コミット → 実装 → 最終コミット・push」まで完走させるコマンドを作る。

## 実装対象の機能

### 1. auto-add-feature-with-plan コマンド

- 引数解析（テキスト / ファイルパス / `#123` / GitHub Issue URL）
- plan-kaizen フェーズの自動化（情報量による壁打ち省略判定）
- 中間 git commit・push（全未コミット変更 + 仕様書）
- `Skill('add-feature')` の自動着火（ユーザー確認なし）
- 最終 git commit・push（remote あれば自動 push）

### 2. auto-add-feature-ui-with-plan コマンド

- `auto-add-feature-with-plan` と同一だが、`Skill('add-feature-ui')` を使用する点のみ異なる
- E2Eテスト（Gate 2）が品質ゲートに追加される

## 受け入れ条件

### 引数解析

- [ ] `#123` 形式で GitHub Issue を取得できる（`gh issue view 123`）
- [ ] `https://github.com/.../issues/NNN` 形式の URL を認識できる
- [ ] ファイルパス引数を Read して内容を取得できる
- [ ] 上記以外はテキストとしてそのまま扱える
- [ ] `gh` コマンドが利用不可の場合はフォールバックしてテキスト扱いになる

### plan-kaizen フェーズ（自動化版）

- [ ] 詳細な引数（150字以上 / Issue / ファイルパス）なら壁打きをスキップして仕様書を自動生成する
- [ ] 曖昧な引数では最大 2 ターンの壁打ちを行う（最終確認なしで自動進行）
- [ ] 仕様書を `docs/ideas/[YYYYMMDD]-[機能名].md` に生成する

### 中間コミット・push

- [ ] 全未コミット変更 + 仕様書をまとめてコミットする
- [ ] コミットメッセージ形式: `docs: [機能名] 仕様書追加（auto-add-feature による自動生成）`
- [ ] remote があれば確認なしで自動 push する
- [ ] `.env` 等センシティブファイルはコミット対象外

### 実装フェーズ

- [ ] `Skill('add-feature')` または `Skill('add-feature-ui')` が自動着火する
- [ ] add-feature の push 確認が来ても自動で進む（ユーザー介入なし）

### 最終コミット・push

- [ ] 実装完了後に自動でコミット・push が行われる

## 成功指標

- ユーザーが 1 回コマンドを叩くだけで仕様策定から push まで完走する
- 曖昧な要件でも壁打き（最大 2 ターン）を経て適切な仕様書が生成される

## スコープ外

以下はこのフェーズでは実装しません:

- 複数 Issue の一括処理
- PR の自動作成
- 壁打ちターン数のユーザー設定

## 参照ドキュメント

- `docs/ideas/20260403-auto-add-feature-with-plan.md` - 仕様書（今回の実装元）
- `.claude/commands/plan-kaizen.md` - 仕様策定コマンド
- `.claude/commands/add-feature.md` - 実装コマンド
- `.claude/commands/add-feature-ui.md` - 実装コマンド（E2Eあり）
