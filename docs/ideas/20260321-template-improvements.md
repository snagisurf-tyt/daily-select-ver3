# テンプレート改善（3提案） 仕様書

> 作成日: 2026-03-21
> ステータス: Draft
> 用途: /add-feature への入力

---

## 1. 背景・目的

SDDテンプレートの `docs/` フォルダにはテンプレート基盤のドキュメント（guidelines, sdd-workflow）とアプリ開発成果物が混在している。また、git操作の自動化やアプリ用README生成の仕組みがない。これらを整理・追加して、テンプレートを使ったアプリ開発の体験を向上させる。

## 2. スコープ

### 今回含めるもの
- (1) `docs/guidelines/` と `docs/sdd-workflow/` を `.claude/docs/` 配下へ移動
- (2) `/add-feature` `/add-feature-ui` 完了時の自動git commit + push
- (3) `/generate-readme` コマンド + `/setup-project` での雛形生成
- (3-b) screenshot-capture サブエージェント

### 今回含めないもの（将来対応）
- CI/CD パイプラインとの連携
- GitHub Actions での自動バッジ更新

## 3. ユーザーストーリー

- テンプレート利用者として、`docs/` にアプリ成果物だけを保持するために、テンプレート関連ドキュメントを `.claude/` に分離したい
- 開発者として、作業完了後にgitコミットを忘れないために、自動コミット・プッシュ機能が欲しい
- 開発者として、アプリのREADME.mdをプロフェッショナルに見せるために、バッジやスクリーンショット付きのREADMEを自動生成したい

## 4. 機能要件

### (1) フォルダ整理
- [ ] `docs/guidelines/` → `.claude/docs/guidelines/` に移動
- [ ] `docs/sdd-workflow/` → `.claude/docs/sdd-workflow/` に移動
- [ ] 全ファイルのパス参照を更新（CLAUDE.md, commands, skills, README.md 等）

### (2) Git自動化
- [ ] add-feature.md にステップ9「Git操作」を追加
- [ ] add-feature-ui.md にステップ9「Git操作」を追加
- [ ] git init未済の場合の初期化処理
- [ ] auto commit（コミットメッセージ自動生成）
- [ ] push確認（remote設定済み: 確認→push / 未設定: URL聞いて設定→push）

### (3) README生成
- [ ] `/generate-readme` コマンド定義を作成
- [ ] `/setup-project` の最終ステップにREADME雛形生成を追加
- [ ] shields.io バッジ自動生成
- [ ] docs/screenshots/ からのスクリーンショット自動挿入

### (3-b) スクリーンショット撮影
- [ ] screenshot-capture サブエージェント定義を作成
- [ ] Playwright MCPによるアプリ画面撮影
- [ ] デスクトップ/モバイル2サイズ対応

## 5. 非機能要件

- 既存のワークフロー（/add-feature, /setup-project）を壊さないこと
- パス参照の更新漏れがないこと

## 6. 技術的考慮事項（参考）

### 実装アプローチ（案）
- フォルダ移動は `git mv` で実施
- Git自動化はコマンドMDへのステップ追加で実現
- README生成は新規コマンドMDとサブエージェントで実現

### 既存コードへの影響（想定）
- 変更: CLAUDE.md, 全コマンドMD, 一部スキルMD — パス参照の更新
- 追加: `.claude/commands/generate-readme.md`, `.claude/agents/screenshot-capture.md`

### 注意点・リスク
- パス参照の更新漏れ → grep で網羅的に検証
- sdd-workflow内の相互参照リンクも更新が必要

## 7. 受け入れ条件

- [ ] `docs/guidelines` や `docs/sdd-workflow` への旧パス参照がプロジェクト内に残っていないこと
- [ ] `/generate-readme` コマンドが正しく定義されていること
- [ ] `/setup-project` の最終ステップにREADME生成が含まれていること
- [ ] `add-feature.md` と `add-feature-ui.md` にGit操作ステップが追加されていること
- [ ] `screenshot-capture.md` サブエージェントが定義されていること

## 8. 参考・関連

- 関連ドキュメント: `CLAUDE.md`, `docs/guidelines/`, `docs/sdd-workflow/`
- 関連コード: `.claude/commands/`, `.claude/agents/`, `.claude/skills/`
