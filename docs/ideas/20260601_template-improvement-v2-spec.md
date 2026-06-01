# Claude Code テンプレート差分改善 v2 仕様書

> 作成日: 2026-06-01
> ステータス: Draft
> 用途: /add-feature への入力

---

## 1. 背景・目的

2026-05-26 の改善（`.steering/20260526-template-improvement/`）を前提に、
実務エンジニアリングで必要になる作業規律を既存テンプレートへ差分追加する。

今回の改善で Claude Code に持たせたい作業規律：

- 曖昧な要件を深掘りする
- 既存ドキュメント・用語集・ADR を読んでから設計する
- 通常コマンドと auto 系コマンドを明確に分ける
- バグ修正は再現から始める
- テスト可能な変更は小さく red-green-refactor する
- 大きな変更後は構造を見直す
- 中断時は handoff を残す
- 実装後は `/verify` で実動作確認する

参考にした考え方：mattpocock/skills の `grill-me`・`grill-with-docs`・`diagnose`・`tdd`・`zoom-out`・`handoff`  
ただし、それらのファイル自体は導入しない。既存テンプレートの構成を優先する。

---

## 2. スコープ

### 今回含めるもの

- `add-feature-ui.md` の安全停止明確化（ルールC追加、"完全無停止"表現修正）
- `auto-add-feature-ui-with-plan.md` へのフェーズ2.5（安全チェック）追加
- `plan-kaizen.md` への要件深掘り観点追加
- `add-feature.md` / `add-feature-ui.md` のステップ2に glossary・ADR 確認を追加
- `docs/glossary.md` の「プロジェクト共有言語」としての役割を CLAUDE.md 等に明記
- `/fix-bug` コマンド新規作成（`.claude/commands/fix-bug.md`）＋ CLAUDE.md への追記
- TDD / red-green-refactor 方針を `development-guidelines.md` と `testing/SKILL.md` に追加
- 大きな変更後の構造レビュー観点を `implementation-validator.md` に追加
- 中断・再開 handoff セクションを `tasklist.md` テンプレート・`resume-work.md`・`steering/SKILL.md` に追加
- 誤字修正（"ステアリングフィル" → "ステアリングファイル"）

### 今回含めないもの

- mattpocock/skills 本体の導入
- Agent OS・Spec Kit・BMAD 等の外部フレームワーク導入
- `CONTEXT.md` の追加
- 新規エージェントの追加
- `.steering/` 運用の変更
- hooks / settings の変更
- `.env`, credentials 類の変更

---

## 3. ユーザーストーリー

- Claude Code ユーザーとして、要件が曖昧な段階でも `/plan-kaizen` が「誰の課題か」「MVPの範囲はどこか」を深掘りしてくれるので、仕様書の品質が上がる。
- 実装エンジニアとして、`/add-feature` が `docs/glossary.md` と `docs/adr/` を確認してから実装するので、用語ゆれや ADR 違反を未然に防げる。
- バグ対応エンジニアとして、`/fix-bug` コマンドが再現手順・最小再現・仮説・最小修正・回帰確認の順で進めてくれるので、推測修正を防げる。
- チームリーダーとして、大きな変更後に `implementation-validator` が構造レビューを行い、責務境界・命名ゆれ・ゴーストファイルを検出してくれる。
- 長期プロジェクトのエンジニアとして、セッション中断時に `tasklist.md` の handoff セクションにコンテキストが記録されるので、`/resume-work` で正確に再開できる。

---

## 4. 機能要件

### 4-1. `add-feature-ui.md` の安全停止明確化

- [ ] frontmatter の `description` を「完全に無停止で」から「controlled automation で」に変更
- [ ] ヘッダー冒頭の「ユーザーの介入なしに…完全に自動」という表現を削除し、
      「基本は自律的に進むが、高リスク変更・仕様不明点・破壊的変更では停止して確認する」に置き換える
- [ ] 実装ループの「絶対禁止の行為」から「ユーザーに判断を仰ぐこと」を削除
- [ ] ルールC（安全停止）を追加する（`add-feature.md` のルールC と同一内容）:
  - DBスキーマ変更・認証変更・外部API追加・ファイル削除・大量変更・破壊的変更で `AskUserQuestion` を使い停止
- [ ] CLAUDE.md の `/add-feature-ui` コマンド説明文も合わせて修正（"完全に無停止で" → 削除）

### 4-2. `auto-add-feature-ui-with-plan.md` フェーズ2.5 安全チェック追加

- [ ] `auto-add-feature-with-plan.md` のフェーズ2.5と同一内容のセクションを追加する
      （`ステップ2-4が完了したら` の直後、フェーズ3の前）
- [ ] 判定基準：DBスキーマ変更・認証変更・外部API・ファイル削除・大量変更・破壊的変更
- [ ] 高リスク検知時は `AskUserQuestion` で「自動実行を続けるか、`/add-feature-ui` で手動確認するか」を提示
- [ ] 冒頭の「壁打ちフェーズと安全チェックのみ AskUserQuestion」に安全チェックが明記されていることを確認（なければ追記）

### 4-3. `plan-kaizen.md` 要件深掘り観点の追加

- [ ] ステップ4（壁打ちループ）の「壁打ちの観点」リストに以下を追加：
  - **課題の明確化**: 誰の課題か・現状の困りごとは何か・何ができれば成功か
  - **スコープ確定**: MVPの最小範囲・今回やらないことは何か
  - **既存との関係**: 既存業務・既存アプリ・既存データとの関係
  - **受け入れ条件**: 受け入れ条件はテスト可能か（「動く」でなく「○○の場合△△になる」形式か）
  - **用語**: 曖昧な用語が出てきた場合は `docs/glossary.md` への反映候補として扱い、メモしておく
- [ ] 「質問しすぎて進まない状態にしない」という注意書きを追加
      （AskUserQuestion は一度に1〜3問まで、最低限の意思決定ができたら `docs/ideas/` に整理する）

### 4-4. `add-feature.md` / `add-feature-ui.md` のステップ2強化

両ファイルのステップ2（プロジェクト理解）を以下のとおり変更する。

- [ ] 既存の「docs/ ディレクトリ内の永続ドキュメントを確認し」を以下に置き換える：
  - 存在する場合のみ以下を確認：
    - `docs/glossary.md` — 用語が一致しているか
    - `docs/adr/` — 既存ADRに反する設計をしていないか
    - `docs/product-requirements.md` / `docs/functional-design.md` / `docs/architecture.md`
    - `.steering/` の既存類似変更（命名・責務・重複の確認）
- [ ] 確認後の判断ルール追加：
  - 用語が `docs/glossary.md` と一致しない場合は、ADR化または仕様書で用語を統一する
  - 既存ADRに反する設計が必要な場合は、`AskUserQuestion` でユーザーに確認し、必要なら新ADRを生成する
  - `docs/glossary.md` が存在しない場合はこのサブステップをスキップ

### 4-5. `docs/glossary.md` の役割明確化

- [ ] `CLAUDE.md` の「ドキュメント・ファイルの役割」テーブルに `docs/glossary.md` の行を追加：
  - `docs/glossary.md` | プロジェクト共有言語（ドメイン用語・命名規則・禁止語） | `/setup-project` 実行時に生成
- [ ] `CLAUDE.md` のガイドラインセクションに「共有言語は `docs/glossary.md` を使う」を明記
- [ ] `development-guidelines.md` の命名規則箇所に「用語は `docs/glossary.md` と整合させること（存在する場合）」を追記

### 4-6. `/fix-bug` コマンド新規作成

`.claude/commands/fix-bug.md` を新規作成する。内容：

1. 事象の整理（いつ・どこで・どんな状態で起きるか）
2. 再現手順の確立（再現できない場合は停止して報告する）
3. 最小再現の作成（不要な要素を削ぎ落とす）
4. 失敗するテスト or 確認手順の作成（修正前に「失敗する状態」を確認する）
5. 仮説の列挙（3〜5個、それぞれ falsifiable な形式で）
6. 必要なログ・計測の追加（タグ付きで、後でまとめて削除できる形式）
7. 最小修正（仮説を検証する最小の変更）
8. 回帰テストまたは `/verify` で確認
9. 必要に応じて `.steering/` または `docs/adr/` に記録

禁止事項：
- 再現手順なしに推測で修正しない
- テストまたは確認手順なしに完了扱いしない
- 実行できなかった検証を実行済みのように報告しない

ルールC（安全停止）と同じ高リスク変更では `AskUserQuestion` で確認する。

- [ ] CLAUDE.md のコマンド一覧に `/fix-bug` を追記
- [ ] `fix-bug.md` の frontmatter: `description: バグを再現→最小化→仮説→修正→回帰確認の順で修正する`

### 4-7. TDD / red-green-refactor 方針

- [ ] `development-guidelines.md` に「TDD・red-green-refactor 方針」セクションを追加：
  - TDD を全タスクで必須にはしない
  - ロジックが明確な機能・API・データ変換・バグ修正では小さな red-green-refactor を推奨
  - テストを一気に大量作成してから実装しない（horizontal slicing 禁止）
  - 1つの振る舞いごとに「失敗するテスト → 最小実装 → リファクタリング」の順で進める
  - 実装詳細ではなく、公開インターフェース越しの振る舞いを確認する
  - UIだけの変更では Playwright 確認や `/verify` を優先してよい
- [ ] `testing/SKILL.md` に「TDD 推奨場面」の注記を追加（バグ修正・API・データ変換では red-green-refactor を先に検討すること）

### 4-8. 大きな変更後の構造レビュー観点追加

- [ ] `implementation-validator.md` の検証観点に「構造レビュー（大きな変更後）」セクションを追加：
  - 責務境界が崩れていないか
  - 命名が `docs/glossary.md` と整合しているか（存在する場合）
  - 重複実装が増えていないか（ゴーストファイルの確認）
  - 不自然な依存関係がないか（循環依存・レイヤー越え）
  - 一時的な実装・デバッグ用コードが残っていないか
  - ADR化すべき設計判断がないか
- [ ] 「大きな変更」の目安を明記：5ファイル以上の変更、または新規コンポーネント・レイヤーの追加

### 4-9. 中断・再開 handoff 支援

**`tasklist.md` テンプレート（`.claude/skills/steering/templates/tasklist.md`）**

- [ ] 「実装後の振り返り」セクションの後に「handoff セクション」を追加：
  ```markdown
  ## Handoff（中断・再開時の申し送り）
  
  > セッション終了前または長時間の中断前に記録すること。/resume-work はこのセクションを優先読み込みする。
  
  ### 現在のステアリングディレクトリ
  `.steering/[日付]-[機能名]/`
  
  ### 完了済みタスク
  - [x] の数: {N}
  
  ### 未完了タスク（再開ポイント）
  - 次に実行するタスク: {タスク名}
  - 理由・注意点: {あれば記述}
  
  ### 直近で変更したファイル
  - {ファイルパス}: {変更概要}
  
  ### 重要な判断
  - {判断内容と理由}
  
  ### 未解決の懸念
  - {懸念事項}
  
  ### 次に実行すべきコマンド
  `/resume-work [ステアリングディレクトリ名]`
  
  ### 品質ゲート状態
  - Gate 1: {未実施 / パス / 失敗}
  - /verify: {未実施 / 実施済み / 失敗}
  ```

**`resume-work.md`**

- [ ] ステップ3（コンテキスト復元）に「handoff セクションの読み込み」を追加：
  - `tasklist.md` の「Handoff」セクションを優先的に読み込む
  - handoff セクションが存在する場合、再開ポイント・未解決の懸念・次のコマンドを把握する
  - handoff セクションが存在しない場合は、従来通り `[ ]` タスクから判定する
- [ ] ステップ2の再開ポイント特定で handoff セクションの情報を優先する旨を追記

**`steering/SKILL.md`**

- [ ] モード2（実装）の振り返りセクションに「セッション中断前の handoff 記録」指示を追加：
  - セッション終了またはフェーズ完了時に、`tasklist.md` の Handoff セクションを更新すること
  - 記録する最小項目：次に実行するタスク・品質ゲート状態

### 4-10. 誤字修正・表記統一

- [ ] `workflow-guardrails.md`：「ステアリングフィル」→「ステアリングファイル」
- [ ] `CLAUDE.md`：同様の誤字があれば修正（workflow-guardrails.md 参照ルールの記述確認）
- [ ] `add-feature.md` frontmatter description：「完全に無停止で実装する」→「controlled automation で実装する（高リスク変更では停止して確認）」
- [ ] `add-feature-ui.md` frontmatter description：同様に修正
- [ ] CLAUDE.md 内の `/add-feature`・`/add-feature-ui` の説明文も同様に修正

---

## 5. 非機能要件

- **後方互換性**: 既存コマンド名・スキル名・エージェント名は変更しない
- **ファイル数の最小化**: 新規ファイルは `/fix-bug` コマンドの1ファイルのみ。その他は既存ファイルの編集のみ
- **docs/glossary.md 非存在での安全性**: `glossary.md` が存在しない状態でも全コマンドが正常に動作すること（存在チェック後スキップ）
- **hooks / settings の維持**: `.claude/settings.json` と `.claude/hooks/` は変更しない
- **credentials の保護**: `.env`・`*.key`・`credentials*` 類は一切編集しない

---

## 6. 技術的考慮事項（参考）

### 実装アプローチ（案）

全変更は既存 `.md` ファイルの `Edit` ツールによる編集のみ（ただし `/fix-bug` は `Write` ツールで新規作成）。
コード変更なし。ドキュメント・コマンド定義のみの変更。

### 既存コードへの影響（想定）

| ファイル | 変更種別 | 変更概要 |
|---------|---------|---------|
| `.claude/commands/add-feature.md` | 編集 | ステップ2にglossary/ADR確認追加 |
| `.claude/commands/add-feature-ui.md` | 編集 | ルールC追加・"完全無停止"表現修正・ステップ2強化 |
| `.claude/commands/auto-add-feature-ui-with-plan.md` | 編集 | フェーズ2.5（安全チェック）追加 |
| `.claude/commands/plan-kaizen.md` | 編集 | 要件深掘り観点追加 |
| `.claude/commands/fix-bug.md` | 新規作成 | バグ修正フロー |
| `CLAUDE.md` | 編集 | /fix-bug追記・glossary役割明記・誤字修正 |
| `.claude/rules/workflow-guardrails.md` | 編集 | 誤字修正 |
| `.claude/docs/guidelines/development-guidelines.md` | 編集 | TDD/red-green-refactor方針追加・glossary整合追記 |
| `.claude/skills/testing/SKILL.md` | 編集 | TDD推奨場面の注記追加 |
| `.claude/agents/implementation-validator.md` | 編集 | 構造レビューセクション追加 |
| `.claude/skills/steering/templates/tasklist.md` | 編集 | Handoffセクション追加 |
| `.claude/skills/steering/SKILL.md` | 編集 | Handoff記録指示追加 |
| `.claude/commands/resume-work.md` | 編集 | Handoffセクション読み込み追加 |

### 注意点・リスク

- `add-feature-ui.md` の「絶対禁止: ユーザーに判断を仰ぐこと」の削除は `add-feature.md` と整合させること
- `plan-kaizen.md` の質問追加で「質問しすぎ」にならないよう観点として提示し、AskUserQuestion は1〜3問に絞る制約を維持すること
- `auto-add-feature-ui-with-plan.md` の安全チェックは `auto-add-feature-with-plan.md` と完全に同一内容にする（ドリフト防止）
- `tasklist.md` テンプレートへの Handoff セクション追加は既存のステアリングファイルに影響しない（新規作成時のテンプレートのみ変更）

---

## 7. 受け入れ条件

### add-feature-ui.md の安全停止
- [ ] ルールC（DBスキーマ変更・認証変更・外部API・ファイル削除・大量変更・破壊的変更で停止）が追加されている
- [ ] 「ユーザーに判断を仰ぐこと」が絶対禁止から削除されている
- [ ] description が controlled automation を示す表現になっている

### auto-add-feature-ui-with-plan.md の安全チェック
- [ ] フェーズ2.5の内容が `auto-add-feature-with-plan.md` と同一である
- [ ] 冒頭に安全チェック時の AskUserQuestion が例外として明記されている

### plan-kaizen.md の要件深掘り
- [ ] 「誰の課題か」「MVPの最小範囲」「受け入れ条件のテスト可能性」「glossary 反映候補」の観点が追加されている
- [ ] 「一度に 1〜3 問まで」の制約が維持されている

### add-feature 系の glossary/ADR 確認
- [ ] 両コマンドのステップ2に glossary・ADR 確認手順が追加されている
- [ ] glossary.md が存在しない場合はスキップすることが明記されている
- [ ] 矛盾検知時の対処（ユーザー確認またはADR化）が明記されている

### /fix-bug コマンド
- [ ] `.claude/commands/fix-bug.md` が存在する
- [ ] 再現→最小化→仮説→修正→回帰確認の順が明記されている
- [ ] 禁止事項（再現なし修正・検証なし完了・虚偽報告）が明記されている
- [ ] CLAUDE.md のコマンド一覧に `/fix-bug` が追記されている

### TDD/red-green-refactor 方針
- [ ] `development-guidelines.md` に red-green-refactor 方針セクションが追加されている
- [ ] horizontal slicing 禁止が明記されている
- [ ] `testing/SKILL.md` に TDD 推奨場面の注記がある

### 構造レビュー観点
- [ ] `implementation-validator.md` に構造レビューセクションが追加されている
- [ ] ゴーストファイル・命名整合・ADR候補の確認が含まれている

### Handoff 支援
- [ ] `tasklist.md` テンプレートに Handoff セクションが追加されている
- [ ] `resume-work.md` が Handoff セクションを優先読み込みする手順になっている
- [ ] `steering/SKILL.md` に Handoff 記録の指示がある

### 誤字・表記統一
- [ ] "ステアリングフィル" が全ファイルで "ステアリングファイル" に修正されている
- [ ] `add-feature.md` / `add-feature-ui.md` の description が controlled automation を示す表現になっている

---

## 8. 参考・関連

- 関連ドキュメント:
  - `.steering/20260526-template-improvement/requirements.md` — 前回改善（完了済み）
  - `.steering/20260526-template-improvement/tasklist.md` — 前回完了タスク一覧
  - `docs/ideas/20260601_update-idea.md` — 原典アイデアメモ
  - `docs/references/mattpocock-skills/skills/productivity/grill-me/SKILL.md` — 要件深掘りの参考
  - `docs/references/mattpocock-skills/skills/engineering/diagnose/SKILL.md` — バグ修正フローの参考
  - `docs/references/mattpocock-skills/skills/engineering/tdd/SKILL.md` — TDD方針の参考
  - `docs/references/mattpocock-skills/skills/engineering/zoom-out/SKILL.md` — 構造レビューの参考
  - `docs/references/mattpocock-skills/skills/productivity/handoff/SKILL.md` — Handoffの参考
- 関連コード（変更対象ファイル）:
  - `.claude/commands/` — 各コマンドファイル
  - `.claude/skills/` — テスト・ステアリングスキル
  - `.claude/agents/implementation-validator.md`
  - `.claude/docs/guidelines/development-guidelines.md`
