# Claude Code AI駆動開発テンプレート改善 仕様書

> 作成日: 2026-05-25
> ステータス: Draft
> 用途: /add-feature への入力
> 原典: docs/ideas/20260525_update-idea.md

---

## 1. 背景・目的

現行テンプレートは「仕様駆動→`.steering/`管理→品質ゲート」のフローが確立されており、
/plan-kaizen・/add-feature・testing skill などの連携は十分に機能している。

今回の改善は、以下の3つを主軸とした**最小変更での実用性向上**を目的とする。

1. `.steering/` を「変更単位spec管理領域」として正式に位置づけ、docs/ / docs/ideas/ との役割を明文化する
2. Claude Code ビルトインコマンド `/run-skill-generator` / `/run` / `/verify` の運用方針をテンプレートに組み込む
3. 自動実行モードの安全境界を明確化し、高リスク変更で意図せず自動継続しない保証を加える

**制約:**
- 既存ファイルを大きく壊さない / 既存コマンド名は原則維持
- Agent OS・Spec Kit・BMAD 等の外部フレームワークは導入しない
- `.env`, credentials, key, secret 類は絶対に編集しない
- hooks/settings の安全機構を弱めない
- 新規ファイルを増やしすぎない
- 参照切れを作らない

---

## 2. スコープ

### 今回含めるもの

- `CLAUDE.md` の整理と`.steering/` 定義追加、新ビルトインコマンドの位置づけ追記
- `README.md` の改善（新コマンド追加、ディレクトリ役割比較、auto系注意点）
- `.claude/commands/auto-add-feature-with-plan.md` の安全条件追加
- `.claude/commands/add-feature.md` の `/verify` との役割明確化・安全停止条件追加
- `.claude/agents/*.md` 4ファイルの説明文改善
- `.claude/docs/guidelines/development-guidelines.md` へのテスト・セキュリティ方針統合
- 参照整合性確認・hooks/settings 安全性確認

### 今回含めないもの（将来対応）

- `/run-skill-generator`, `/run`, `/verify` のカスタムコマンドファイル新規作成（ビルトインのため不要）
- subagent の新規追加（architect, backend/frontend-engineer 等）
- `.claude/docs/guidelines/` への新規ファイル追加
- 既存コマンドの大幅リファクタ

---

## 3. ユーザーストーリー

- **テンプレート利用者**として、`.steering/` と `docs/` の役割の違いを迷わず理解できるようにしたい
- **テンプレート利用者**として、新プロジェクト開始後に `/run-skill-generator` を使えばよいと分かる説明が欲しい
- **テンプレート利用者**として、実装後に `/verify` を使えば動作確認が完了すると分かりたい
- **テンプレート利用者**として、auto系コマンドの安全な使い方（どんな変更に向いているか）を知りたい

---

## 4. 機能要件

### 4-A: CLAUDE.md の整理

- [ ] `.steering/` の定義を以下の通り明文化する（既存の「作業管理」という説明に置き換える）:
  - `docs/` はプロダクト全体の長期ドキュメント
  - `docs/ideas/` は仕様化前のアイデア・壁打ち結果
  - `.steering/` は変更単位の実行仕様（requirements.md / design.md / tasklist.md）
  - 軽微な修正では `.steering/` を作らずタスクで管理してよい旨も記載
- [ ] Claude Code ビルトインコマンドの位置づけを追記する（新規セクション「ビルトインコマンドの活用」）:
  - `/run-skill-generator`: 新規プロジェクト作成後または起動方法が変わったときに実行。プロジェクト固有の起動・検証手順を `.claude/skills/run-<project>/` に生成する。secrets・.envの実値は記録しない
  - `/run`: アプリを起動し基本的な動作を確認する
  - `/verify`: 実装後に変更が本当に動くか確認する。実装完了時は単体テスト合格だけで完了扱いにしない
- [ ] `testing` skill と `/verify` の役割分担を1行で明記する:
  - `/verify` = ビルトインの動作確認コマンド
  - `testing` skill = `/add-feature` から呼ばれる詳細確認基準・補助手順
- [ ] CLAUDE.md が長くなりすぎないよう、詳細は guidelines へのポインタに留める

### 4-B: README.md の改善

- [ ] 「ディレクトリ構成」セクションに、docs/ / docs/ideas/ / .steering/ の役割を比較する表または説明を追加する:

  | ディレクトリ | 役割 | 作成タイミング |
  |---|---|---|
  | `docs/` | プロダクト全体の長期ドキュメント | /setup-project 実行時 |
  | `docs/ideas/` | アイデアメモ・壁打ち結果・仕様書 | /plan-kaizen 実行時 |
  | `.steering/` | 変更単位の実行仕様（変更ごと） | /add-feature 実行時 |

- [ ] コマンド一覧テーブルに以下3コマンドを追加する（ビルトインコマンドとして分類する）:
  - `/run-skill-generator` : プロジェクト固有の起動・検証スキル生成（新規プロジェクト作成後 or 起動方法変更時）
  - `/run` : アプリ起動と基本動作確認
  - `/verify` : 実装後の動作確認（実装完了の必須条件）

- [ ] 「auto系コマンドの注意点」セクションを追加する:
  - auto系（`/auto-add-feature-with-plan`, `/auto-add-feature-ui-with-plan`）は小規模・低リスク変更に限定
  - DB スキーマ変更・認証・外部API・ファイル削除・大量変更・破壊的変更では使わないことを明記

- [ ] READMEは長くなりすぎないよう、詳細はCLAUDE.mdやguidelinesに委ねる

### 4-C: `auto-add-feature-with-plan.md` の安全条件追加

- [ ] フェーズ1（引数解析）またはフェーズ2（plan-kaizen実行）の後に「自動実行安全チェック」ステップを追加する:
  - 以下に該当する変更が含まれる場合は**自動継続を停止し、ユーザーに確認を求める**:
    - DBスキーマ変更・マイグレーション
    - 認証・認可ロジックの変更
    - 外部API連携の追加・変更
    - ファイル・ディレクトリの削除
    - 大量ファイル変更（10ファイル以上が目安）
    - 破壊的な後方互換性破壊
  - 不明点がある場合、勝手に仕様を確定せずユーザーに確認する
- [ ] 完了前に `/verify` または同等の動作確認を行う旨を追記する
- [ ] 未確認項目がある場合は完了報告に明記する旨を追記する

### 4-D: `add-feature.md` の改善

- [ ] ステップ7.5（動作確認・リグレッションチェック）に、`/verify` との関係を明記する:
  - このステップが `/verify` コマンドに相当する処理であることを注記する
  - ユーザーは実装後に直接 `/verify` を呼ぶこともできる旨を追記する
- [ ] 実装ループ（ステップ5）の例外処理ルールに「安全停止条件」を追加する:
  - DB スキーマ変更・認証変更・外部API追加など、設計上の重要判断が必要な変更が発生した場合は「ルールC: 設計判断が必要な場合」として停止しユーザー確認する

### 4-E: サブエージェント説明文の改善

以下4ファイルの `description` フィールドをより具体的に書き直す:

- [ ] `implementation-validator.md`:
  - 現状: 「実装コードの品質を検証し、スペックとの整合性を確認するサブエージェント」
  - 改善: 「実装差分と仕様書（requirements.md / design.md）の適合性・コード品質・テストカバレッジ・セキュリティを検証するサブエージェント。/add-feature の品質ゲート前に呼ばれる。」

- [ ] `ui-ux-validator.md`:
  - 現状: 「UI/UX品質を検証し、機械的テストでは担保できない観点をレビューするサブエージェント」
  - 改善: 「画面表示・操作フロー・デザイン一貫性など機械的テストで検出できないUI/UX問題をレビューするサブエージェント。Gate5として /add-feature-ui から呼ばれる。」

- [ ] `doc-reviewer.md`:
  - 現状: 「ドキュメントの品質をレビューし、改善提案を行うサブエージェント」
  - 改善: 「README・設計書・tasklist・仕様書の整合性・完結性・誤記をレビューし改善提案するサブエージェント。/review-docs から呼ばれる。」

- [ ] `screenshot-capture.md`:
  - 現状: 「アプリのスクリーンショットを自動撮影し、docs/screenshots/ に保存するサブエージェント」
  - 改善: 「アプリの画面をPlaywright CLIで自動撮影し docs/screenshots/ に保存するサブエージェント。README向けスクリーンショット収集を担当。/generate-readme から呼ばれる。」

### 4-F: `development-guidelines.md` へのテスト・セキュリティ方針統合

- [ ] 「テスト方針」セクションを追加する（既存 definition-of-done.md の補足として）:
  - 単体テストだけで完了扱いにしない（/verify または同等の確認が必須）
  - コンソールエラー・ネットワークエラー 0 件を確認すること
  - testing skill が詳細手順を提供している旨をリンク
- [ ] 「セキュリティ・データ管理」セクションを追加する（既存の注意点を整理・補強）:
  - `.env`・secrets のハードコード禁止（既存）を整理
  - 入力バリデーションは API境界で必ず行う
  - ログ・エラーメッセージに機密情報を含めない

### 4-G: 参照整合性確認（実装後チェック）

- [ ] CLAUDE.md から参照しているファイルが全て存在することを確認する
- [ ] README に書いたファイル構成と実ファイル構成が一致することを確認する
- [ ] コマンドから参照しているスキルが存在することを確認する
- [ ] 既存コマンド名が変更されていないことを確認する
- [ ] testing skill と /verify の役割説明が矛盾していないことを確認する

### 4-H: hooks / settings 安全性確認（実装後チェック）

- [ ] `.claude/settings.json` の安全機構が弱まっていないことを確認する
- [ ] `.claude/hooks/` の挙動が壊れていないことを確認する
- [ ] `.env`, credentials, key, secret 類を編集していないことを確認する
- [ ] `--no-verify` 禁止ルールが維持されていることを確認する

---

## 5. 非機能要件

- **後方互換性**: 既存コマンド名・スキル名・エージェント名は変更しない
- **ファイル増加抑制**: 新規ファイルは作成しない（既存ファイルの編集のみ）
- **可読性**: CLAUDE.md は過度に長くしない。詳細は guidelines へのポインタに留める

---

## 6. 技術的考慮事項（参考）

> このセクションは壁打ち時点のメモです。詳細設計は `/add-feature` 実行時に `steering/design.md` として生成されます。

### 実装アプローチ（案）

- 変更対象は全て `.md` ファイルの編集のみ（コードなし）
- 各ファイルを順番に Edit ツールで変更する
- CLAUDE.md の「基本的な開発ワークフロー」セクションに`.steering/`定義と新コマンドを追記
- README の「コマンド一覧」テーブルを拡張し「ビルトインコマンド」を別区分で追加

### 既存コードへの影響（想定）

- 変更: `CLAUDE.md` — `.steering/` 定義追加、新コマンドセクション追加
- 変更: `README.md` — コマンド表拡張、docs比較表追加、auto系注意点追加
- 変更: `.claude/commands/auto-add-feature-with-plan.md` — 安全チェックステップ追加
- 変更: `.claude/commands/add-feature.md` — ステップ7.5に注記追加、安全停止ルール追加
- 変更: `.claude/agents/implementation-validator.md` — description改善
- 変更: `.claude/agents/ui-ux-validator.md` — description改善
- 変更: `.claude/agents/doc-reviewer.md` — description改善
- 変更: `.claude/agents/screenshot-capture.md` — description改善
- 変更: `.claude/docs/guidelines/development-guidelines.md` — テスト方針・セキュリティセクション追加

### 注意点・リスク

- CLAUDE.md が長くなりすぎないよう、追記は要約レベルに留める
- `/verify` はビルトインコマンドのため、説明は「使い方の方針」に留め実装詳細は書かない
- auto-add-feature-with-plan.md の安全チェックは、ユーザー体験を損なわない範囲で追加する（小さな変更で毎回停止しないよう条件を明確にする）

---

## 7. 受け入れ条件

- [ ] `docs/` / `docs/ideas/` / `.steering/` の役割の違いが CLAUDE.md または README で一目で分かる
- [ ] `/run-skill-generator` をいつ・なぜ使うかが CLAUDE.md に記載されている
- [ ] `/verify` が実装完了の必須条件として CLAUDE.md に記載されている
- [ ] `testing` skill と `/verify` の役割分担が矛盾なく記述されている
- [ ] `auto-add-feature-with-plan.md` に安全停止条件（DB/auth/外部API/大量変更等）が明記されている
- [ ] README のコマンドテーブルに `/run-skill-generator`, `/run`, `/verify` が追加されている
- [ ] 4つのサブエージェントの description が呼び出し元コマンドを含む明確な説明になっている
- [ ] `development-guidelines.md` にテスト方針とセキュリティ・データ管理セクションが追加されている
- [ ] 変更後も CLAUDE.md・README・commands・skills のクロス参照が全て有効である
- [ ] `.claude/settings.json` の安全機構が変更されていない

---

## 8. 参考・関連

- 原典アイデアメモ: [docs/ideas/20260525_update-idea.md](docs/ideas/20260525_update-idea.md)
- 関連コマンド: [.claude/commands/add-feature.md](.claude/commands/add-feature.md), [.claude/commands/auto-add-feature-with-plan.md](.claude/commands/auto-add-feature-with-plan.md)
- 関連スキル: [.claude/skills/testing/SKILL.md](.claude/skills/testing/SKILL.md)
- 関連ガイドライン: [.claude/docs/guidelines/development-guidelines.md](.claude/docs/guidelines/development-guidelines.md), [.claude/docs/guidelines/definition-of-done.md](.claude/docs/guidelines/definition-of-done.md)
