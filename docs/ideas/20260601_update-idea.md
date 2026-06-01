# 2026-06-01 Claude Code AI駆動開発テンプレート追加改善アイデア

## 目的

現在のClaude Codeテンプレートに対して、追加の差分改善を行う。

今回の目的は、既存テンプレートを全面刷新することではない。
すでに実施済みのテンプレート改善を前提に、実務エンジニアリングで必要になる作業規律を追加する。

特に、以下の観点を既存の command / skill / guideline / agent に自然に反映したい。

* 要件が曖昧な段階での深掘り
* 既存ドキュメント・ADR・用語集を踏まえた実装前確認
* バグ修正時の再現重視
* 小さな単位でのTDD的な実装
* 大きな変更後の構造レビュー
* 中断・再開時のhandoff

## 前提

直近のテンプレート改善は、以下のステアリングで実施済み。

* `.steering/20260526-template-improvement/requirements.md`
* `.steering/20260526-template-improvement/design.md`
* `.steering/20260526-template-improvement/tasklist.md`

まず上記3ファイルを読み、何がすでに改善済みかを把握すること。

今回は、この既存改善を再実行しない。
全面刷新もしない。
既存の改善内容を前提に、追加の差分改善だけを行う。

## 参考にした考え方

[mattpocock/skills](docs\references\mattpocock-skills) の考え方を参考にする。

ただし、mattpocock/skills 本体は導入しない。
外部フレームワークとして扱わない。
既存テンプレートの構成を優先する。

参考にするのは、以下のような作業規律である。

* `grill-me` 的な要件深掘り
* `grill-with-docs` 的な既存ドキュメント確認
* `diagnose` 的なバグ修正フロー
* `tdd` 的な小さな red-green-refactor
* `zoom-out` 的な構造レビュー
* `handoff` 的な中断・再開支援

## 重要な制約

* 既存テンプレートを大きく作り替えない
* 既存の `.steering/` 運用を維持する
* 既存の command / skill / agent / guideline を優先する
* 新規ファイルを増やしすぎない
* mattpocock/skills 本体を導入しない
* Agent OS、Spec Kit、BMADなどの外部フレームワーク本体も導入しない
* `CONTEXT.md` は原則追加しない
* 共有言語は `docs/glossary.md` を使う
* 設計判断は `docs/adr/` を使う
* 変更単位specは `.steering/` を使う
* 起動・検証レシピは `/run-skill-generator` と `.claude/skills/run-<project>/` を使う
* `/run` `/verify` の既存説明を壊さない
* testing skill と Playwright確認の役割を壊さない
* hooks / settings の安全機構を弱めない
* `.env`, credentials, key, secret 類は絶対に編集しない
* 変更前に必ず現状構成を読み、改善planを提示してから修正する

## まず確認するファイル

以下を確認してから改善planを作る。

* `CLAUDE.md`
* `.steering/20260526-template-improvement/requirements.md`
* `.steering/20260526-template-improvement/design.md`
* `.steering/20260526-template-improvement/tasklist.md`
* `.claude/rules/workflow-guardrails.md`
* `.claude/commands/plan-kaizen.md`
* `.claude/commands/add-feature.md`
* `.claude/commands/add-feature-ui.md`
* `.claude/commands/auto-add-feature-with-plan.md`
* `.claude/commands/auto-add-feature-ui-with-plan.md`
* `.claude/commands/resume-work.md`
* `.claude/commands/setup-project.md`
* `.claude/skills/testing/SKILL.md`
* `.claude/skills/steering/SKILL.md`
* `.claude/docs/guidelines/development-guidelines.md`
* `.claude/docs/guidelines/definition-of-done.md`
* `.claude/agents/implementation-validator.md`
* `.claude/agents/doc-reviewer.md`
* `.claude/agents/ui-ux-validator.md`
* `docs/adr/README.md`
* `docs/adr/_template.md`

## 改善方針

### 1. 既存改善内容の確認

まず、`.steering/20260526-template-improvement/` の内容を読み、前回改善で何が完了しているかを整理する。

確認したい観点は以下。

* `.steering/` の変更単位spec運用
* `/run-skill-generator`, `/run`, `/verify` の説明
* testing skill と Playwright確認
* `docs/adr/` の運用
* `/setup-project` による `docs/glossary.md` 生成
* hooks / settings の安全機構
* auto系コマンドの存在
* `workflow-guardrails.md` の存在
* 通常コマンドとauto系コマンドの役割分担

そのうえで、今回変更する対象と、変更しない対象を分けた改善planを提示する。

### 2. `/add-feature` と `/add-feature-ui` の安全停止ルールを明確化する

`/add-feature` と `/add-feature-ui` に「完全無停止」「ユーザー確認しない」「完全自動実行」といった表現が残っている場合は修正する。

方針は以下。

* `/add-feature` と `/add-feature-ui` は通常の機能追加コマンドとする
* 基本は自律的に進める
* ただし、高リスク変更・仕様不明点・破壊的変更では必ず停止してユーザー確認する
* 完全自動・確認なしで進めるのは auto系コマンドだけに限定する
* auto系コマンドも小規模・低リスク変更に限定する
* DBスキーマ変更、認証・認可、外部API、ファイル削除、大量変更、破壊的変更では auto系でも停止または実行不可とする

修正対象候補。

* `.claude/commands/add-feature.md`
* `.claude/commands/add-feature-ui.md`
* `.claude/commands/auto-add-feature-with-plan.md`
* `.claude/commands/auto-add-feature-ui-with-plan.md`
* `CLAUDE.md`
* `.claude/rules/workflow-guardrails.md`

表現としては、以下の整理にする。

* 通常コマンド = controlled automation
* auto系コマンド = low-risk only automation

### 3. `/plan-kaizen` に要件深掘りの観点を追加する

`/plan-kaizen` はすでに壁打ち機能を持っている。
そこに、要件が曖昧な場合の深掘り観点を追加する。

追加したい観点。

* 誰の課題か
* 現状の困りごとは何か
* 何ができれば成功か
* MVPの最小範囲はどこか
* 今回やらないことは何か
* 既存業務・既存アプリ・既存データとの関係は何か
* 受け入れ条件はテスト可能か
* 用語が曖昧な場合、`docs/glossary.md` への反映候補として扱う

注意点。

* 質問しすぎて進まない状態にしない
* AskUserQuestion は一度に1〜3問まで
* 最低限の意思決定ができたら `docs/ideas/` に整理する

### 4. `/add-feature` 系に既存文書確認を追加する

`/add-feature` と `/add-feature-ui` のプロジェクト理解ステップを強化する。

実装前に、存在する場合のみ以下を確認する。

* `docs/glossary.md`
* `docs/adr/`
* `docs/product-requirements.md`
* `docs/functional-design.md`
* `docs/architecture.md`
* `docs/development-guidelines.md`
* `.steering/` の既存類似変更

確認観点。

* 用語が `docs/glossary.md` と一致しているか
* 既存ADRに反する設計をしていないか
* 既存architectureと矛盾していないか
* 既存機能・既存命名・既存責務と重複していないか
* 矛盾がある場合は、勝手に進めず、ADR化またはユーザー確認する

注意点。

* `docs/glossary.md` は `/setup-project` 後に生成されるファイルなので、存在しない場合はスキップする
* 存在しない場合は、必要に応じて生成候補として報告する
* `CONTEXT.md` は追加しない

### 5. `docs/glossary.md` の役割を明確化する

`CONTEXT.md` は追加しない。
代わりに、`docs/glossary.md` をプロジェクト共有言語の置き場として扱う。

`docs/glossary.md` に置くもの。

* ドメイン用語
* 業務用語
* 略語
* 画面名
* 操作名
* データ項目名
* コード上の命名に使う代表語
* 使ってはいけない曖昧語
* 表記ゆれ

反映先候補。

* `.claude/commands/setup-project.md`
* `.claude/commands/plan-kaizen.md`
* `.claude/commands/add-feature.md`
* `.claude/commands/add-feature-ui.md`
* `.claude/docs/guidelines/development-guidelines.md`
* 必要なら `CLAUDE.md`

### 6. バグ修正フローを追加する

バグ修正用の運用を追加する。

推奨は、`.claude/commands/fix-bug.md` の新規追加。
ただし、新規追加が過剰だと判断した場合は、`CLAUDE.md` と `development-guidelines.md` に運用として追記するだけでもよい。

`/fix-bug` を追加する場合の内容。

1. 事象を整理する
2. 再現手順を作る
3. 最小再現を作る
4. 失敗するテストまたは確認手順を作る
5. 仮説を立てる
6. 必要なログ・計測を追加する
7. 最小修正する
8. 回帰テストまたは `/verify` で確認する
9. 必要に応じて `.steering/` または `docs/adr/` に記録する

禁止事項。

* 再現手順なしに推測で修正しない
* テストまたは確認手順なしに完了扱いしない
* 実行できなかった検証を実行済みのように報告しない

追加した場合は、`CLAUDE.md` のコマンド一覧にも `/fix-bug` を追記する。

### 7. 小さな red-green-refactor 方針を追加する

TDDを全タスクで必須にはしない。
ただし、ロジックが明確な機能、API、データ変換、バグ修正では、小さな red-green-refactor を推奨する。

追加したい観点。

* テストを一気に大量作成してから実装しない
* 1つの振る舞いごとに、失敗するテスト、最小実装、リファクタリングの順で進める
* 実装詳細ではなく、公開インターフェース越しの振る舞いを確認する
* UIだけの変更では Playwright確認や `/verify` を優先してよい

反映先候補。

* `.claude/docs/guidelines/development-guidelines.md`
* `.claude/skills/testing/SKILL.md`
* 必要なら `.claude/docs/guidelines/definition-of-done.md`

### 8. 大きな変更後の構造レビューを追加する

大きな機能追加後、または複数ファイルにまたがる変更後に、構造レビューを行う方針を追加する。

確認観点。

* 責務境界が崩れていないか
* 命名が `docs/glossary.md` と整合しているか
* 重複実装が増えていないか
* ゴーストファイルが増えていないか
* 不自然な依存関係がないか
* 一時的な実装が残っていないか
* ADR化すべき設計判断がないか

反映先。

* `.claude/agents/implementation-validator.md` を優先
* 必要なら `.claude/docs/guidelines/development-guidelines.md`
* 新しいagentは原則追加しない

### 9. 中断・再開支援を追加する

長い作業、中断、別セッション移行に備えて、handoff 的な記録を残す方針を追加する。

記録する内容。

* 現在のステアリングディレクトリ
* 完了済みタスク
* 未完了タスク
* 直近で変更したファイル
* 重要な判断
* 未解決の懸念
* 次に実行すべきコマンド
* `/verify` の実行状況
* 品質ゲートの状態

反映先。

* `.claude/commands/resume-work.md`
* `.claude/skills/steering/templates/tasklist.md`
* `.claude/skills/steering/SKILL.md`

`/resume-work` では、git log と git status に加えて、直近の `.steering/*/tasklist.md` の handoff セクションを読むようにする。

### 10. 参照切れ・パス誤り・表記ゆれを修正する

以下を確認して修正する。

* `CLAUDE.md` から参照しているファイルが存在するか
* command から参照している skill が存在するか
* skill から参照している guideline が存在するか
* `docs/adr/README.md` への相対リンクが正しいか
* `docs/glossary.md` はテンプレートZIPに存在しない場合があるため、存在前提で破綻しない記述になっているか
* 「ステアリングフィル」などの誤字があれば修正する
* `/run`, `/verify`, `/run-skill-generator` を「ビルトインコマンド」と呼ぶ表現が不正確なら、Claude Code公式の表現に合わせて自然に修正する

### 11. READMEの扱い

今回のテンプレートに `README.md` が存在しない場合は、無理にREADMEを更新対象にしない。

ただし、README.md が存在するプロジェクトで使われる前提の説明は、以下のどちらかで整理する。

* `CLAUDE.md` に「/generate-readme でアプリ用 README.md を生成・更新する」と書く
* `/generate-readme.md` の説明を必要に応じて更新する

README.md を新規作成する必要があると判断した場合は、作成理由をplanで説明してから実行する。

## 最終確認

変更後、以下を確認する。

* `CONTEXT.md` を追加していない、または追加した場合は理由が明確で `docs/glossary.md` と役割が重複していない
* `.steering/` 運用を壊していない
* `/run`, `/verify`, `/run-skill-generator` の説明を壊していない
* testing skill と Playwright確認の役割を壊していない
* hooks / settings の安全機構を弱めていない
* command / skill / guideline / agent の参照切れがない
* `docs/glossary.md` が存在しない初期状態でも破綻しない
* `.env` や secret 類を編集していない
* auto系コマンドと通常コマンドの役割が明確に分かれている
* 高リスク変更ではユーザー確認する方針が明文化されている

## 最終出力

最後に、以下の形式で報告する。

1. 変更したファイル
2. 変更しなかったが確認したファイル
3. mattpocock/skills 由来で反映した考え方
4. 追加しなかった考え方と理由
5. 通常コマンドとauto系コマンドの役割整理
6. 安全性確認結果
7. 参照整合性確認結果
8. 未対応・保留事項
9. 次にやるとよい改善

## 補足

今回の改善は、テンプレートの再設計ではない。
既存のテンプレートを前提にした差分改善である。

最終的な狙いは、Claude Codeに以下の作業規律を持たせること。

* 曖昧な要件は深掘りする
* 既存ドキュメント・用語集・ADRを読んでから設計する
* 通常コマンドとauto系コマンドを分ける
* 高リスク変更では停止して確認する
* バグ修正は再現から始める
* テスト可能な変更は小さくred-green-refactorする
* 大きな変更後は構造を見直す
* 中断時はhandoffを残す
* 実装後は `/verify` で実動作確認する
