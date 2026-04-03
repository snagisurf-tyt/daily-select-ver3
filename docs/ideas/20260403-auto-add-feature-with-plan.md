# auto-add-feature-with-plan / auto-add-feature-ui-with-plan コマンド 仕様書

> 作成日: 2026-04-03
> ステータス: Draft
> 用途: /add-feature への入力

---

## 1. 背景・目的

現在の開発ワークフローでは、仕様策定（`/plan-kaizen`）と実装（`/add-feature` または `/add-feature-ui`）が別コマンドに分かれており、それぞれユーザーの手動着火と確認待ちが発生する。

**課題：**
- `plan-kaizen` は壁打ち完了後に仕様書を生成しても、ユーザーが手動で `/add-feature` を叩かなければ実装が始まらない。
- ちょっとした機能追加でも「plan-kaizen → 確認 → add-feature」という 2 ステップが常に必要。

**解決策：**
仕様策定から実装・コミット・pushまでを一本のコマンドで完走させる `auto-add-feature-with-plan` / `auto-add-feature-ui-with-plan` を新設する。

---

## 2. スコープ

### 今回含めるもの

- `auto-add-feature-with-plan` コマンドの新設（`.claude/commands/auto-add-feature-with-plan.md`）
- `auto-add-feature-ui-with-plan` コマンドの新設（`.claude/commands/auto-add-feature-ui-with-plan.md`）
- 引数のパターン対応：
  - テキスト（依頼内容を直接記述）
  - ファイルパス（`docs/ideas/xxx.md` 等）
  - GitHub Issue 番号（`#123`）
  - GitHub Issue URL（`https://github.com/owner/repo/issues/123`）
- 壁打ちの自動省略判定ロジック（情報量による判断）
- plan-kaizen 完了後の中間 git commit（全未コミット変更 + 仕様書）
- plan-kaizen 完了後の中間 git push（remote あり → 自動 push）
- add-feature / add-feature-ui の自動着火（ユーザー確認なし）
- 実装完了後の最終 git commit + push（remote あり → 自動 push）

### 今回含めないもの（将来対応）

- 複数 Issue の一括処理
- PR の自動作成（実装後に自動でPRを作る）
- 壁打ちターン数の設定（現在は最大 2 ターン固定）

---

## 3. ユーザーストーリー

- 開発者として、依頼内容を引数に渡すだけで仕様策定から実装・コミット・pushまでを自動完走させたい。
- 開発者として、GitHub Issue を参照するだけで実装を始めてほしい（`#123` または URL 形式で渡せる）。
- 開発者として、詳細な引数を渡したときは余計な壁打ちなしにすぐ実装してほしい。
- 開発者として、曖昧な引数を渡したときは壁打ちで不明点を解消してから実装してほしい。

---

## 4. 機能要件

### 引数解析フェーズ

- [ ] 引数が `#123` 形式（先頭が `#` + 数字）なら GitHub Issue として認識し、`gh issue view 123` で内容を取得する
- [ ] 引数が `https://github.com/.../issues/NNN` 形式の URL なら GitHub Issue として認識し、`gh issue view <URL>` で内容を取得する
- [ ] 引数がファイルパス（存在するファイル）なら Read して内容を取得する
- [ ] 上記以外はテキストとしてそのまま扱う

### plan-kaizen フェーズ（自動化版）

- [ ] コンテキスト読み込み（CLAUDE.md、docs/ 永続ドキュメント、ガイドライン）を行う
- [ ] 引数の情報量を AI が判断し、自動省略 or 壁打ちを決定する
  - **省略条件（以下のいずれかを満たす）：**
    - GitHub Issue から取得したテキストが含まれている
    - テキストが 150 字以上で機能要件・ユーザーストーリー・実装方針のいずれかを含む
    - 既存ファイルパスを引数として渡している
  - **壁打ち条件：**
    - テキストが概念のみ・短すぎる（上記条件を満たさない）
- [ ] 壁打ちを行う場合は最大 2 ターンまで AskUserQuestion で不明点を解消する
  - ただし「仕様書を生成しますか？」の最終確認は行わない
- [ ] 壁打ち完了後または省略後、仕様書を `docs/ideas/[YYYYMMDD]-[機能名].md` に自動生成する

### 中間 git コミット・push フェーズ

- [ ] `git rev-parse --is-inside-work-tree` で Git リポジトリの存在を確認する
- [ ] Git リポジトリが存在しない場合は git init → 初回コミットを行い、中間 push はスキップする
- [ ] Git リポジトリが存在する場合：
  - [ ] `git status` で変更確認
  - [ ] センシティブファイル（`.env`, `credentials`, `*.key`）を除外してすべてステージング
  - [ ] コミットメッセージ形式：`docs: [機能名] 仕様書追加（auto-add-feature による自動生成）`
  - [ ] `git remote -v` で remote の存在を確認
  - [ ] remote があれば自動 push（確認なし）
  - [ ] remote がなければスキップ

### add-feature / add-feature-ui フェーズ

- [ ] `Skill('add-feature')` または `Skill('add-feature-ui')` を着火する
  - 引数として生成した仕様書ファイルのパスを渡す
  - add-feature 内の「ステップ9: Git 操作」の **push 確認（AskUserQuestion）をスキップ**させる
    - 代替として、本コマンドのフローで自動 push を行う

### 最終 git コミット・push フェーズ

- [ ] add-feature / add-feature-ui 完了後、`git status` で変更確認
- [ ] 変更がある場合にコミット（コミットメッセージは add-feature が生成したものを流用）
- [ ] `git remote -v` で remote の存在を確認
- [ ] remote があれば自動 push（確認なし）
- [ ] remote がなければスキップ

---

## 5. 非機能要件

- **自律性**: ユーザー確認は壁打ち中の AskUserQuestion のみ。仕様書生成後・実装中・コミット後の確認は一切行わない。
- **安全性**: `.env`, `credentials`, `*.key` 等のセンシティブファイルは git add の対象外とする。
- **冪等性**: 同一引数で再実行した場合、既存の仕様書があればそれを再利用するかどうかを AI が判断する。
- **エラーハンドリング**: `gh` コマンドが利用不可の場合はエラーメッセージを表示し、テキストとして処理を継続する。

---

## 6. 技術的考慮事項（参考）

> このセクションは壁打ち時点のメモです。詳細設計は `/add-feature` 実行時に `steering/design.md` として生成されます。

### 実装アプローチ（案）

- コマンドファイルは `.claude/commands/` に MD ファイルとして配置（既存コマンドと同形式）
- `add-feature` 内の「ステップ9: Git 操作」の push 確認問題は以下の 2 案で解決：
  - **案A**: `auto-add-feature-with-plan` コマンド側で「add-feature が push 確認をしてきたら自動で YES と答える」旨の指示を入れる
  - **案B**: add-feature に「外部から呼ばれる場合は push をスキップするフラグ」を追加し、本コマンドで最終 push を担当する
  - → **推奨案B**: 責務を明確にするため、add-feature 内は commit まで、push は呼び出し元コマンドが担当する形に分離する。ただしこれは add-feature 自体の改修を伴うため、MVPでは案Aで進め、後で改善する。

### 既存コードへの影響（想定）

- 追加: `.claude/commands/auto-add-feature-with-plan.md`
- 追加: `.claude/commands/auto-add-feature-ui-with-plan.md`
- 変更なし: `.claude/commands/plan-kaizen.md`（独立性を保つ）
- 変更なし: `.claude/commands/add-feature.md`（独立性を保つ、MVPでは）

### 注意点・リスク

- **add-feature の push 確認との衝突**: add-feature 内の `AskUserQuestion`（push確認）が自動化の中断点になる可能性がある。プロンプト上で「push確認が来たら自動で進む」よう指示する。
- **壁打ちの情報量判断**: AIによる「詳細かどうか」の判断が曖昧になる可能性がある。判断基準を明示的にプロンプトに記述することで再現性を高める。
- **GitHub Issue 取得失敗**: `gh` コマンドが未インストール or 認証されていない場合はエラーになる。フォールバックとして引数をそのままテキストとして扱う。

---

## 7. 受け入れ条件

- [ ] `/auto-add-feature-with-plan "ログイン画面にremember meチェックボックスを追加"` を実行すると、仕様書生成→コミット→実装→コミット→pushが自動完走する
- [ ] `/auto-add-feature-with-plan #42` を実行すると、Issue #42 の内容を取得して同様に完走する
- [ ] `/auto-add-feature-with-plan https://github.com/owner/repo/issues/42` を実行すると、同様に完走する
- [ ] 曖昧な引数（例: `"ダッシュボードを改善したい"`）を渡すと壁打ちが発生する
- [ ] 詳細な引数を渡すと壁打ちがスキップされる
- [ ] 中間コミットのメッセージが `docs: [機能名] 仕様書追加（auto-add-feature による自動生成）` になっている
- [ ] remote が設定されている場合、push が自動で実行される
- [ ] `.env` 等センシティブファイルがコミットに含まれない

---

## 8. 参考・関連

- 関連コマンド: [.claude/commands/plan-kaizen.md](.claude/commands/plan-kaizen.md)
- 関連コマンド: [.claude/commands/add-feature.md](.claude/commands/add-feature.md)
- 関連コマンド: [.claude/commands/add-feature-ui.md](.claude/commands/add-feature-ui.md)
- 関連ルール: [.claude/rules/workflow-guardrails.md](.claude/rules/workflow-guardrails.md)
