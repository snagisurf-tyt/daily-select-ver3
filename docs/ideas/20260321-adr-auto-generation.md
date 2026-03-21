# ADR自動生成の組み込み 仕様書

> 作成日: 2026-03-21
> ステータス: Draft
> 用途: /add-feature への入力

---

## 1. 背景・目的

`docs/adr/` ディレクトリにはテンプレート(`_template.md`)と運用ルール(`README.md`)が用意されているが、ADRを自動生成する仕組みがない。アーキテクチャ上の意思決定（技術スタック選定、設計パターン選択など）は `/setup-project` や `/add-feature` の実行中に発生するが、現状ではADRとして記録されない。

ADRの原則:
- **不変**: 一度書いたADRは書き換えない（Superseded で新ADRを作る）
- **意思決定の記録**: 「なぜその技術を選んだか」をAIエージェントが参照できる
- **自動採番**: `NNNN-タイトル.md` 形式

## 2. スコープ

### 今回含めるもの
- `/setup-project` でのADR自動生成（アーキテクチャ設計後）
- `/add-feature` および `/add-feature-ui` でのADR生成判定（計画フェーズ内）
- 既存の `docs/adr/_template.md` 形式の活用
- ADRの自動採番ロジック

### 今回含めないもの（将来対応）
- ADR一覧の自動更新（README.mdへのリンク追記）
- Superseded時の旧ADR自動更新
- ADRの検索・参照スキル

## 3. ユーザーストーリー

- 開発者として、`/setup-project` 実行時にアーキテクチャ設計の決定事項がADRとして自動記録されてほしい。
- 開発者として、`/add-feature` 実行時に新たなアーキテクチャ意思決定があればADRとして自動記録されてほしい。
- AIエージェントとして、過去のADRを参照して「なぜこの技術を選んだか」を理解したい。

## 4. 機能要件

### `/setup-project` へのADR生成ステップ追加
- [ ] ステップ3（アーキテクチャ設計書の作成）の直後に「ステップ3.5: ADRの自動生成」を挿入
- [ ] `docs/architecture.md` を読み、主要なアーキテクチャ意思決定を抽出する
- [ ] 各決定について `docs/adr/_template.md` の形式でADRを生成する
- [ ] `docs/adr/` 内の既存ADR番号を確認し、次の番号を採番する
- [ ] 完了条件・完了メッセージにADR生成を追加する

### `/add-feature` および `/add-feature-ui` へのADR生成判定追加
- [ ] ステップ4（計画フェーズ）の末尾にADR生成判定を追加
- [ ] `design.md` の内容からアーキテクチャ意思決定の有無を判定する
- [ ] 該当する場合のみADRを生成（該当しなければスキップ）

## 5. 非機能要件

- ADR生成は既存ワークフローの中断を発生させないこと
- 既存ADRとの番号衝突を避けること

## 6. 技術的考慮事項（参考）

### 実装アプローチ

**setup-project.md のステップ3.5:**
```
### ステップ3.5: ADRの自動生成

1. `docs/architecture.md` を読み、主要なアーキテクチャ意思決定を抽出する。
2. 各決定について `docs/adr/_template.md` の形式でADRを生成する:
   - `docs/adr/` 内の既存ADR番号を確認し、次の番号を採番する
   - ファイル名: `NNNN-[決定の英語要約].md`（例: `0001-react-nextjs-frontend.md`）
   - ステータス: `Accepted`
   - コンテキスト: architecture.md から該当箇所を要約
   - 検討した選択肢: architecture.md に記載があれば抽出、なければ代表的な選択肢を補完
   - 決定内容: 選択した技術・パターンとその理由
3. 一般的に生成されるADRの例:
   - フロントエンドフレームワーク選定
   - バックエンドフレームワーク選定
   - データベース選定
   - 状態管理方式
   - CSS/スタイリング方式
   （architecture.md に記載された決定事項に応じて動的に決まる）
```

**add-feature.md / add-feature-ui.md のステップ4追加:**
```
3. **ADR生成判定**: `design.md` の内容を確認し、以下に該当するアーキテクチャ意思決定が含まれる場合、ADRを自動生成する:
   - 新しいライブラリ・フレームワークの導入
   - 既存のアーキテクチャパターンからの逸脱
   - データモデルの大幅な変更
   - 外部サービス・APIとの新規連携
   該当する場合、`docs/adr/_template.md` の形式で `docs/adr/NNNN-[タイトル].md` を生成する（採番は既存ADR番号の続き）。
   該当しない場合、このサブステップはスキップする。
```

### 既存コードへの影響（想定）
- 変更: `.claude/commands/setup-project.md` — ステップ3.5追加 + 完了条件・メッセージ更新
- 変更: `.claude/commands/add-feature.md` — ステップ4にADR生成判定追加
- 変更: `.claude/commands/add-feature-ui.md` — ステップ4にADR生成判定追加

### 注意点・リスク
- `architecture.md` の記述粒度によってADRの品質が変わる
- ADR生成はアーキテクチャ設計の直後に行うため、setup-project のフローが若干長くなる

## 7. 受け入れ条件

- [ ] `setup-project.md` にステップ3.5が正しく記述されている
- [ ] `add-feature.md` と `add-feature-ui.md` のステップ4にADR生成判定が追加されている
- [ ] ADRテンプレートの形式（コンテキスト・選択肢・決定・結果）が守られている
- [ ] 既存ADR番号との衝突を避ける採番ロジックが記述されている

## 8. 参考・関連

- 関連ドキュメント: `docs/adr/README.md`, `docs/adr/_template.md`
- 関連コマンド: `.claude/commands/setup-project.md`, `.claude/commands/add-feature.md`, `.claude/commands/add-feature-ui.md`
- 参考資料: `docs/ideas/Harness Engineering best practice.md`（ADRのベストプラクティス）
