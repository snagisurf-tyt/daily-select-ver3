# プロジェクトメモリ

* 日本語で対話すること。
* `AskUserQuestion`ツールを使って、ユーザーに選択肢を示しながら対話すること。

## plan モードと plan-kaizen の使い分け

- **plan モード**（EnterPlanMode）: 実装方法の計画（How）に使う。plan ファイル自体は `.claude/plans/` に保存される（Claude Code 内部動作）が、plan 承認後に生成する仕様書・設計メモは `docs/ideas/` に保存すること。
- **`/plan-kaizen`**: 仕様の壁打ち・策定（What）に使う。成果物は `docs/ideas/` に保存する。plan モードとは併用しない。

## 基本的な開発ワークフロー

1. **ドキュメント作成**: 永続ドキュメント(`docs/`)で「何を作るか」を定義
2. **仕様策定** *(任意)*: アイデア段階から既存コード・ドキュメントを踏まえて壁打ちし、仕様書MDを仕上げる
3. **作業計画**: ステアリングファイル(`.steering/`)で「今回何をするか」を計画
4. **実装**: `tasklist.md`に従って実装し、進捗を随時更新。ソースコードは `src`配下に保存
5. **検証**: 品質ゲート・動作確認・リグレッションチェック
6. **更新**: 必要に応じてドキュメント更新
7. **機能追加・バグ修正**: 上記ステップ2からスタートする

- 1は`/setup-project`コマンド、2は`/plan-kaizen`コマンド、3-6は`/add-feature`コマンドで着火する想定。
- `/add-feature`コマンドの代わりに `/add-feature-ui`コマンドを使うとE2Eテストまでおこなう。
- `/auto-add-feature-with-plan`コマンドは、仕様策定（plan-kaizen）から実装・コミット・pushまでを一括自動実行する（ユーザー確認なし）。
- `/auto-add-feature-ui-with-plan`コマンドは、`/auto-add-feature-with-plan`のE2Eテストあり版。
- `/resume-work`コマンドは、途中で中断した作業の再開に使用する。
- `/generate-readme`コマンドは、アプリ用README.mdの自動生成・更新に使用する。
- スキルを直接呼び出して開発ワークフローを迂回することは禁止。詳細は `.claude/rules/workflow-guardrails.md` を参照。

## ガイドライン

- 技術スタック選定: `.claude/docs/guidelines/tech-stack-guidelines.md` を参照
- ディレクトリ構造: `.claude/docs/guidelines/repository-structure-guidelines.md` を参照

## スクリーンショット

- Playwright でスクリーンショットを撮る際は `artifacts/screenshots/` に保存すること
- ルート直下に png を保存しないこと（PostToolUse Hook が自動移動するが、最初から正しい場所に保存するのが望ましい）
- README 用スクリーンショットは `docs/screenshots/` に保存すること（移動対象外）

## 開発ガイドライン

- コーディング規約・AI生成コードのアンチパターン・ドキュメント管理戦略: `.claude/docs/guidelines/development-guidelines.md`
- アーキテクチャ意思決定の記録: `docs/adr/`
- フィードバック速度の階層とDoD: `.claude/docs/guidelines/definition-of-done.md`
