# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

### 必須ルール
- **全てのタスクを`[x]`にすること**
- 「時間の都合により別タスクとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- 未完了タスク（`[ ]`）を残したまま作業を終了しない

---

## フェーズ1: コマンドファイルの作成

> **チェックポイント CP-1**: 2つのコマンドファイルが正しく作成されていることを確認してから次へ進む。

- [x] `auto-add-feature-with-plan.md` を `.claude/commands/` に作成
  - [x] frontmatter に `description:` を記載
  - [x] 引数解析フェーズ（テキスト / ファイルパス / #123 / URL）を実装
  - [x] plan-kaizen 自動化フェーズ（省略判定 + 壁打ち最大2ターン）を実装
  - [x] 中間 git commit・push フェーズを実装
  - [x] Skill('add-feature') 着火フェーズを実装（push 確認スキップ指示含む）
  - [x] 最終 git commit・push フェーズを実装
  - **受け入れ条件**: ファイルが `.claude/commands/auto-add-feature-with-plan.md` として存在し、全フェーズが記述されていること

- [x] `auto-add-feature-ui-with-plan.md` を `.claude/commands/` に作成
  - [x] `auto-add-feature-with-plan.md` をベースに `add-feature` → `add-feature-ui` に変更
  - [x] frontmatter の description を UI テスト版に更新
  - **受け入れ条件**: ファイルが `.claude/commands/auto-add-feature-ui-with-plan.md` として存在し、add-feature-ui を使用していること

### CP-1 チェックポイント確認

- **完了日時**: 2026-04-03
- **Evidence（証拠）**: `.claude/commands/auto-add-feature-with-plan.md` および `.claude/commands/auto-add-feature-ui-with-plan.md` を作成。両ファイルに frontmatter・全5フェーズ（引数解析/仕様策定/中間コミット/実装着火/最終コミット）を実装。
- **Recovery（復旧メモ）**: 問題なし

---

## フェーズ2: CLAUDE.md の更新

> **チェックポイント CP-2**: CLAUDE.md に新コマンドの説明が追記されていることを確認してから次へ進む。

- [x] `CLAUDE.md` の基本的な開発ワークフローセクションに新コマンドの説明を追記
  - [x] `auto-add-feature-with-plan` の説明を追加
  - [x] `auto-add-feature-ui-with-plan` の説明を追加
  - **受け入れ条件**: CLAUDE.md に両コマンドへの言及が存在すること

### CP-2 チェックポイント確認

- **完了日時**: 2026-04-03
- **Evidence（証拠）**: CLAUDE.md の基本的な開発ワークフローセクションに `/auto-add-feature-with-plan` および `/auto-add-feature-ui-with-plan` の説明を追記。
- **Recovery（復旧メモ）**: 問題なし

---

## フェーズ3: E2E バリデーション spec の作成

> **チェックポイント CP-3**: バリデーション spec が作成されていることを確認してから次へ進む。

- [x] `tests/e2e/` ディレクトリを作成
- [x] `tests/e2e/auto-add-feature-commands.spec.js` を作成
  - [x] `auto-add-feature-with-plan.md` が存在することをバリデーション
  - [x] `auto-add-feature-ui-with-plan.md` が存在することをバリデーション
  - [x] 各ファイルに frontmatter の `description:` が含まれることをバリデーション
  - [x] 各ファイルに必須フェーズ（引数解析、仕様書生成、中間コミット、実装着火、最終コミット）が含まれることをバリデーション
  - **受け入れ条件**: spec ファイルが作成されており、24 件全テストパス（node で実行確認済み）

### CP-3 チェックポイント確認

- **完了日時**: 2026-04-03
- **Evidence（証拠）**: `node tests/e2e/auto-add-feature-commands.spec.js` を実行 → 24 件パス / 0 件失敗
- **Recovery（復旧メモ）**: 問題なし

---

## フェーズ4: 品質ゲート（DoD 準拠）

> **チェックポイント CP-FINAL**: このプロジェクトは npm プロジェクトではないため、Gate 1（lint/typecheck/test/build）は N/A。
> Gate 2（E2E）も playwright.config.ts がないため N/A。
> 品質ゲートは手動でのファイル内容バリデーションのみ。

### Gate 1: 静的解析（このリポジトリは npm プロジェクトなし → スキップ）

- [x] ~~lint が通ること~~ （理由: npm プロジェクトなし、package.json が存在しない）
- [x] ~~型チェックが通ること~~ （理由: 同上）
- [x] ~~全テストがパスすること~~ （理由: 同上）
- [x] ~~ビルドが成功すること~~ （理由: 同上）

### Gate 2: E2E テスト（playwright.config.ts が存在しない → スキップ）

- [x] ~~全 E2E シナリオがパスすること~~ （理由: playwright.config.ts なし）

### Gate 3〜5: スキップ（設定なし）

- [x] ~~VRT~~ （スキップ: tests/vrt/__screenshots__/ なし）
- [x] ~~a11y~~ （スキップ: tests/a11y/ なし）
- [x] ~~UI/UX 批評~~ （スキップ: 今回の成果物は Markdown コマンドファイルのため UI 検証対象なし）

### CP-FINAL チェックポイント確認

- **完了日時**: 2026-04-03
- **Gate 1 Evidence**: スキップ（npm プロジェクトなし。package.json が存在しない）
- **Gate 2 Evidence**: スキップ（playwright.config.ts なし。代わりに node 直接実行の spec で 25 件全バリデーション通過済み）
- **Gate 3 Evidence**: スキップ（基準画像なし）
- **Gate 4 Evidence**: スキップ（tests/a11y/ なし）
- **Gate 5 Evidence**: スキップ（今回の成果物は Markdown コマンドファイルのため UI 検証対象なし）
- **反復回数**: 0
- **Recovery（復旧メモ）**: 問題なし

---

## フェーズ5: ドキュメント更新

- [x] 影響する `docs/` ドキュメントを更新（今回は CLAUDE.md のみ、フェーズ2で対応済み）
- [x] 実装後の振り返り（このファイルの下部に記録）

---

## 実装後の振り返り

### 実装完了日
2026-04-03

### デモ手順
1. 任意のプロジェクトで `/auto-add-feature-with-plan "ログイン画面に remember me チェックボックスを追加"` を実行
2. 仕様書が `docs/ideas/` に自動生成されること確認
3. 中間コミットが行われること確認
4. add-feature が自動着火すること確認
5. 最終コミット・push が行われること確認

### チェックポイントサマリ

| CP | 完了日時 | 主な問題 | 反復回数 |
|----|---------|---------|---------|
| CP-1 | 2026-04-03 | なし | 0 |
| CP-2 | 2026-04-03 | なし | 0 |
| CP-3 | 2026-04-03 | なし | 0 |
| CP-FINAL | 2026-04-03 | npm なしのため Gate 1〜2 スキップ。node で 25 件全バリデーション通過 | 0 |

### 計画と実績の差分

**計画と異なった点**:
- E2E spec を `.spec.ts` で設計していたが、このリポジトリが npm プロジェクトでなく TypeScript コンパイル環境がないため `.spec.js`（Node.js 直接実行）に変更した。
- `implementation-validator` の指摘を受け、`ui-with-plan` 側の中間コミットメッセージに `auto-add-feature-ui-with-plan` のコマンド名を反映した（当初は `with-plan` と同一文字列だった）。
- バリデーション spec で `ui-with-plan` のセンシティブファイル除外チェックが欠落していたため修正・追加した。
- 壁打ち / 壁打き の表記ゆれを「壁打ち」に統一した。

**新たに必要になったタスク**:
- `implementation-validator` によるレビューと修正対応（元の計画には含まれていたが、具体的な修正箇所が事前には不明だった）

### 学んだこと

**技術的な学び**:
- Claude Code のカスタムコマンドはプロンプト指示書であるため、ロジックの「曖昧さ」が直接 AI の挙動に影響する。引数判定条件（150 字以上 + キーワード）のような具体的な閾値を明示することで再現性が上がる。
- `Skill('add-feature')` 内の `AskUserQuestion`（push 確認）はコマンドファイル側から「自動 YES」を指示することで回避できる。この方式（案A）は add-feature 自体を改修しないため既存コマンドへの影響がない。
- テンプレートリポジトリのバリデーション spec は Playwright ではなく Node.js スクリプトで十分。ファイルの存在・内容チェックなら軽量に書ける。

**プロセス上の改善点**:
- 2コマンド（with-plan / ui-with-plan）の差分管理は実装後に `implementation-validator` でレビューする方が漏れを防ぎやすい。今回も実際にコミットメッセージとセンシティブファイルチェックの非対称性を検出できた。
- コマンドファイルのバリデーション spec を先に書いてから実装すると、TDD 的に品質基準が明確になりよい。

### 次回への改善提案
- 将来的には `add-feature.md` のステップ9（push 確認）に「外部から呼ばれた場合は push をスキップする」フラグを追加し、`auto-add-feature-with-plan` 側で最終 push を一元管理する案B へ移行することを検討する。
- `auto-add-feature-with-plan` の壁打ち判定ロジック（150字閾値）は実際に使ってみて精度を測り、適宜調整するとよい。
- 複数 Issue の一括処理や PR 自動作成は将来の拡張候補（仕様書スコープ外に記載済み）。
