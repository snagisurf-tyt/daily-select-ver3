# 要求内容

## 概要

Claude Code AI駆動開発テンプレートを最小変更で改善する。`.steering/` の正式定義追加、Claude Code ビルトインコマンド（/run-skill-generator / /run / /verify）の運用方針組み込み、自動実行モードの安全境界明確化が主軸。

## 背景

現行テンプレートは「仕様駆動→.steering/管理→品質ゲート」のフローが確立されており基本的な連携は機能している。しかし以下が未整備：
- `.steering/` / `docs/` / `docs/ideas/` の役割の違いが明文化されていない
- Claude Code ビルトインコマンド `/run-skill-generator`, `/run`, `/verify` が運用フローに組み込まれていない
- auto系コマンドの使用範囲（高リスク変更での停止条件）が明確でない

## 実装対象の機能

### 1. CLAUDE.md の整理・拡充
- `.steering/` を「変更単位spec管理領域」として正式定義
- docs/ / docs/ideas/ / .steering/ の役割比較を明記
- ビルトインコマンド（/run-skill-generator, /run, /verify）の位置づけ追記
- testing skill と /verify の役割分担を1行で明記

### 2. README.md の改善
- docs/ 比較表の追加（ディレクトリ構成セクション）
- コマンド一覧にビルトインコマンド3つを追加
- auto系コマンドの注意点セクション追加

### 3. auto-add-feature-with-plan.md の安全条件追加
- DB スキーマ変更・認証・外部API・ファイル削除・大量変更・破壊的変更で自動停止するチェックステップを追加

### 4. add-feature.md の改善
- ステップ7.5（動作確認）に /verify との関係注記追加
- 実装ループの例外処理に「ルールC: 設計判断が必要な場合」の安全停止条件追加

### 5. サブエージェント説明文の改善
- 4つのエージェント（implementation-validator / ui-ux-validator / doc-reviewer / screenshot-capture）の description を呼び出し元コマンドを含む明確な文に改善

### 6. development-guidelines.md へのテスト・セキュリティ方針統合
- 「テスト方針」セクション追加
- 「セキュリティ・データ管理」セクション追加・補強

## 受け入れ条件

### CLAUDE.md 整理
- [ ] docs/ / docs/ideas/ / .steering/ の役割比較が分かる
- [ ] /run-skill-generator の使うタイミングが記載されている
- [ ] /verify が実装完了の必須条件として記載されている
- [ ] testing skill と /verify の役割分担が1行で明記されている

### README 改善
- [ ] ディレクトリ構成セクションに docs 比較表がある
- [ ] コマンド一覧に /run-skill-generator, /run, /verify が追加されている
- [ ] auto系コマンドの注意点セクションがある

### auto-add-feature-with-plan 安全条件
- [ ] DB/auth/外部API/大量変更で自動停止する条件が明記されている

### add-feature 改善
- [ ] ステップ7.5に /verify との関係注記がある
- [ ] 実装ループにルールC（設計判断が必要な場合）がある

### サブエージェント説明改善
- [ ] 4つのエージェント全ての description が更新されている

### development-guidelines 拡充
- [ ] テスト方針セクションが追加されている
- [ ] セキュリティ・データ管理セクションが追加/補強されている

## 成功指標

- 新しくテンプレートを使い始めた人が docs/ / .steering/ の使い分けを迷わない
- auto系コマンドを安全に使える範囲が明確になる
- /verify の存在と使いどころが分かる

## スコープ外

- /run-skill-generator, /run, /verify のカスタムコマンドファイル新規作成（ビルトインのため不要）
- subagent の新規追加
- .claude/docs/guidelines/ への新規ファイル追加
- 既存コマンドの大幅リファクタ

## 参照ドキュメント

- `docs/ideas/20260525_template-improvement-spec.md` - 詳細仕様書
- `docs/ideas/20260525_update-idea.md` - 原典アイデアメモ
