# 設計内容

## 実装方針

全ての変更は既存 `.md` ファイルの Edit ツールによる編集のみ。
新規ファイルは `.claude/commands/fix-bug.md` の1ファイルのみ（Write ツールで作成）。
ソースコード変更なし。ドキュメント・コマンド定義のみ。

## 変更ファイル一覧

| ファイル | 変更種別 | 変更概要 |
|---------|---------|---------|
| `.claude/commands/add-feature-ui.md` | 編集 | ルールC追加・"完全無停止"表現修正・ステップ2強化 |
| `.claude/commands/auto-add-feature-ui-with-plan.md` | 編集 | フェーズ2.5（安全チェック）追加 |
| `.claude/commands/plan-kaizen.md` | 編集 | 壁打ち観点拡充（深掘り・glossary連携） |
| `.claude/commands/add-feature.md` | 編集 | ステップ2にglossary/ADR確認追加 |
| `.claude/commands/fix-bug.md` | 新規作成 | バグ修正フロー（再現→仮説→修正→回帰） |
| `CLAUDE.md` | 編集 | /fix-bug追記・glossary役割明記・誤字修正 |
| `.claude/rules/workflow-guardrails.md` | 編集 | 誤字修正（ステアリングフィル→ファイル） |
| `.claude/docs/guidelines/development-guidelines.md` | 編集 | TDD/red-green-refactor方針追加・glossary整合追記 |
| `.claude/skills/testing/SKILL.md` | 編集 | TDD推奨場面の注記追加 |
| `.claude/agents/implementation-validator.md` | 編集 | 構造レビューセクション追加 |
| `.claude/skills/steering/templates/tasklist.md` | 編集 | Handoffセクション追加 |
| `.claude/skills/steering/SKILL.md` | 編集 | Handoff記録指示追加 |
| `.claude/commands/resume-work.md` | 編集 | Handoffセクション優先読み込み追加 |

## 各ファイルの変更詳細

### add-feature-ui.md

1. frontmatter `description` を「新機能を既存パターンに従って実装する（高リスク変更では停止して確認）」に変更
2. ヘッダー「完全自動実行モード」→「自律実行モード（高リスク変更では確認あり）」に変更
3. 冒頭の「ユーザーの介入なしに、開始から完了まで完全に自動で実行」→「基本は自律的に進むが、高リスク変更・仕様不明点・破壊的変更では停止してユーザーに確認する」に変更
4. 「絶対禁止の行為」から「ユーザーに判断を仰ぐこと」を削除
5. ルールC（安全停止）を add-feature.md と同一内容で追加
6. ステップ2に glossary/ADR 確認サブステップを追加（add-feature.md と同一内容）

### auto-add-feature-ui-with-plan.md

- フェーズ2.5として以下を追加（auto-add-feature-with-plan.md のフェーズ2.5と同一）:
  - 高リスク変更の判定基準（DBスキーマ・認証・外部API・ファイル削除・大量変更・破壊的変更）
  - 高リスク検知時は AskUserQuestion で「自動実行を続けるか /add-feature-ui で手動確認するか」を提示
  - 低リスク判定時は確認なしでフェーズ3へ

### plan-kaizen.md

ステップ4の「壁打ちの観点」に以下を追加：
- **課題の明確化**: 誰の課題か・現状の困りごと・何ができれば成功か
- **スコープ確定**: MVPの最小範囲・今回やらないこと
- **既存との関係**: 既存業務・アプリ・データとの関係
- **受け入れ条件**: テスト可能か（「○○の場合△△になる」形式か）
- **用語**: 曖昧な用語は `docs/glossary.md` への反映候補としてメモ
- 「AskUserQuestion は一度に1〜3問まで」注意書きを強調

### add-feature.md（ステップ2強化）

ステップ2の永続ドキュメント確認に以下を追加（存在する場合のみ）：
- `docs/glossary.md` — 用語が今回の実装と整合しているか
- `docs/adr/` — 既存ADRに反する設計をしていないか
- `.steering/` 既存類似変更 — 命名・責務・重複の確認
- 矛盀検知時の対処：ユーザー確認 or ADR化

### fix-bug.md（新規）

フロー：
1. 事象の整理（いつ・どこで・どんな状態）
2. 再現手順の確立（再現不可なら停止して報告）
3. 最小再現の作成
4. 失敗するテストまたは確認手順（修正前に失敗を確認）
5. 仮説の列挙（3〜5個、falsifiable 形式）
6. ログ・計測追加（タグ付き）
7. 最小修正
8. 回帰テストまたは `/verify` で確認
9. `.steering/` または `docs/adr/` に記録

禁止事項：再現なし修正、テストなし完了、虚偽報告

### development-guidelines.md

**追加セクション: TDD / red-green-refactor 方針**
- 全タスクで必須にはしない（ロジック明確な場面で推奨）
- horizontal slicing 禁止（テスト一括作成→実装一括は禁止）
- 1振る舞いごとに赤→緑→リファクタリング
- 公開インターフェース越しの振る舞いを確認
- UIだけの変更は Playwright 確認 / `/verify` を優先

**既存セクションへの追記: 命名規則**
- 「用語は `docs/glossary.md` と整合させること（存在する場合）」を追記

### testing/SKILL.md

「動作確認」セクションの先頭付近に以下を追加：
- ロジック・API・データ変換・バグ修正のタスクでは、先に「失敗するテスト」を作成する（red-green-refactor）ことを検討すること

### implementation-validator.md

「検証観点」の末尾に「6. 構造レビュー（大きな変更後）」セクションを追加：
- 責務境界が崩れていないか
- 命名が `docs/glossary.md` と整合しているか（存在する場合）
- 重複実装・ゴーストファイルが増えていないか
- 不自然な依存関係（循環依存・レイヤー越え）がないか
- 一時的な実装・デバッグコードが残っていないか
- ADR化すべき設計判断がないか
- 対象：5ファイル以上の変更、または新規コンポーネント・レイヤーの追加時

### tasklist.md テンプレート

「実装後の振り返り」セクションの後に「Handoff」セクションを追加（詳細は仕様書参照）

### steering/SKILL.md

モード3（振り返り）に「Handoff 記録」の指示を追加：
- フェーズ完了時・セッション終了前に Handoff セクションを更新
- 最小記録項目：次に実行するタスク・品質ゲート状態

### resume-work.md

ステップ3（コンテキスト復元）に Handoff セクション優先読み込みを追加：
- `tasklist.md` の Handoff セクションが存在する場合はそれを優先
- 存在しない場合は従来通り `[ ]` タスクから判定

## 後方互換性

- 既存コマンド名変更なし
- 既存スキル名変更なし
- 既存エージェント名変更なし
- hooks/settings 変更なし
- `docs/glossary.md` が存在しない状態でも全コマンドが動作する（スキップ条件あり）
