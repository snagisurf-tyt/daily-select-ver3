## 2026-05-25 Claude Code AI駆動開発テンプレート改善アイデア

### 目的:
現行テンプレートの良い部分を維持しながら、Claude Code向けの実用テンプレートとして改善してください。
全面刷新は禁止です。既存の思想・構成・コマンドを尊重し、最小変更で実用性を高めてください。

この改善では、Agent OS、Spec Kit、BMADなどの外部フレームワーク本体は導入しません。
ただし、以下の考え方は参考にしてください。

- Spec Kit的な「変更単位spec」
- Agent OS的な「AIが参照しやすい開発標準」
- BMAD的な「役割分担」

### 前提:
Claude Codeを使った仕様駆動開発テンプレートとして、現在の構成は以下のようになっています。

- CLAUDE.md
- README.md
- .claude/commands/
- .claude/skills/
- .claude/agents/
- .claude/docs/guidelines/
- .claude/hooks/
- .claude/settings.json
- .steering/

### 現行テンプレートの強み:
- /plan-kaizen によるアイデア整理
- /setup-project による初期ドキュメント生成
- /add-feature, /add-feature-ui による機能追加フロー
- .steering/YYYYMMDD-feature-name/ による requirements.md / design.md / tasklist.md 管理
- tasklist.md を中心にした実装管理
- Playwright CLI / Testing skill によるUI確認
- implementation-validator, ui-ux-validator, doc-reviewer などの検証agent
- hooksによる保護ファイル制御
- Definition of Done、技術スタック、開発ガイドラインの整備

### 改善方針:
1. 現行の .steering/ を「変更単位spec」として正式に位置づける
2. Claude Code公式の /run, /verify, /run-skill-generator を運用フローに組み込む
3. 現行の testing skill と /verify の役割を整理する
4. 既存の .claude/docs/guidelines/ を活かし、開発標準をClaude Codeが参照しやすい形に整理する
5. 完全自動実行と、人間確認が必要な実行を分ける
6. README と CLAUDE.md を更新し、利用者が迷わないテンプレートにする

### 重要な制約:
- 既存ファイルを大きく壊さない
- 既存コマンド名は原則維持する
- 既存の .steering/ 運用は維持する
- Agent OS、Spec Kit、BMADなどの外部フレームワーク本体は導入しない
- .env, credentials, key, secret などの機密ファイルは絶対に編集しない
- hooksやsettingsの安全機構を弱めない
- 変更前に必ず現状構成を読み込む
- 実装前に必ず改善planを提示する
- 変更後は、READMEまたはCLAUDE.mdに利用方法を反映する
- 参照切れを作らない
- 新規ファイルを増やしすぎない

### 実施してほしいこと:

#### Step 1. 現状把握

まず以下を読み、現在のテンプレート構造を把握してください。

- CLAUDE.md
- README.md
- .claude/commands/
- .claude/skills/
- .claude/agents/
- .claude/docs/guidelines/
- .claude/settings.json

そのうえで、現在のテンプレートのワークフローを簡潔に整理してください。

整理観点:
- 新規プロジェクト開始時の流れ
- アイデア整理の流れ
- 機能追加の流れ
- UI機能追加の流れ
- 検証・レビューの流れ
- .steering/ の使われ方
- skills / agents / commands の責務分担

#### Step 2. 改善plan作成

次の観点で改善planを作成してください。

- .steering/ の位置づけ整理
- /run-skill-generator の導入方針
- /run /verify の導入方針
- 既存 testing skill との役割分担
- .claude/docs/guidelines/ の整理方針
- subagent構成の改善要否
- README / CLAUDE.md の更新方針
- 後方互換性への配慮
- 参照切れ防止方針
- hooks/settings の安全性維持方針

改善planを提示してから、実際の修正に進んでください。

#### Step 3. .steering/ の定義を明確化

.steering/ を、変更単位のspec管理領域として明文化してください。

定義:
- docs/ はプロダクト全体の長期ドキュメント
- docs/ideas/ は仕様化前のアイデア・壁打ち結果
- .steering/ は変更単位の実行仕様
- .steering/YYYYMMDD-feature-name/ に requirements.md, design.md, tasklist.md を置く
- requirements.md は「何を作るか」を定義する
- design.md は「どう作るか」を定義する
- tasklist.md は「どう実装を進めるか」を定義する
- 軽微な修正では .steering/ を作らず、tasks または既存tasklistで管理してよい

必要に応じて、CLAUDE.md、README.md、関連commandの説明を更新してください。

#### Step 4. /run-skill-generator の導入

新規プロジェクト作成後、または起動方法が変わった時に /run-skill-generator を使う方針を追加してください。

追加したい運用:
- 新規プロジェクトでは、最初に /run-skill-generator を実行する
- プロジェクト固有の起動・検証手順を .claude/skills/run-<project>/ に保存する
- 生成されたSKILL.mdはレビュー対象とする
- secretsや.envの実値は記録しない
- 記録するのは、起動方法、環境変数名、テストコマンド、確認URL、主要操作、失敗しやすい点までにする
- 起動方法、依存関係、環境変数、ポート、DB、外部サービス接続が変わったら /run-skill-generator を再実行する

READMEまたはCLAUDE.mdに、この方針を追記してください。

#### Step 5. /run /verify の導入

実装完了時に /verify を使う方針を追加してください。

追加したい運用:
- 実装完了時は、単体テストだけで完了扱いにしない
- 必ず /verify または同等の検証を行う
- /verify では、アプリ起動、主要画面表示、主要操作、console error、network error、ログエラーを確認する
- Webアプリでは、Playwright CLI または Chrome DevTools MCP が使える場合は優先する
- Playwright CLI / Chrome DevTools MCP が使えない場合は、代替確認方法を明記する
- 確認結果は「確認済み / 未確認 / 失敗」に分けて報告する
- 未確認項目がある場合は、完了報告に明記する
- 実行できなかった検証を、実行したかのように報告しない

既存の testing skill は削除しないでください。
testing skill は、/verify の詳細基準・補助手順として位置づけてください。

役割分担の例:
- /run-skill-generator: プロジェクト固有の起動・検証レシピを作る
- /run: アプリを起動し、基本的な動作を見る
- /verify: 実装後に、変更が本当に動くか確認する
- testing skill: UI確認、Playwright確認、console/network確認などの詳細基準を提供する

#### Step 6. 開発標準の整理

現行の .claude/docs/guidelines/ を活かし、Claude Codeが参照しやすい標準管理にしてください。

方針:
- CLAUDE.md に全ルールを詰め込まない
- CLAUDE.md は最上位方針と参照先に絞る
- 技術スタック、開発ガイドライン、リポジトリ構造、DoD、テスト方針は guidelines 側に集約する
- 既存guidelinesを極力活かす
- 新規ファイルを増やしすぎない
- 参照切れを作らない
- 移動による混乱が大きい場合は、既存構成を維持し、README上で役割を明記するだけでもよい

必要に応じて、以下の標準カテゴリを整理してください。

- tech-stack
- architecture
- coding-style
- testing
- ui-policy
- security
- data-handling
- definition-of-done

ただし、これらは固定された外部フレームワークの用語ではありません。
一般的な開発標準をClaude Codeが参照しやすくするための分類です。

既存ファイルを活かす例:
- tech-stack-guidelines.md
- development-guidelines.md
- repository-structure-guidelines.md
- definition-of-done.md

不足している場合のみ、以下のようなファイル追加を検討してください。
ただし、ファイルを増やしすぎないでください。

- testing-guidelines.md
- ui-guidelines.md
- security-and-data-guidelines.md

#### Step 7. 自動実行モードの安全性を見直す

既存の /add-feature, /add-feature-ui, /auto-add-feature-with-plan, /auto-add-feature-ui-with-plan の役割を確認し、以下を明確化してください。

- 通常コマンドは、重要判断が必要な場合に停止してユーザー確認する
- auto系コマンドは、小規模・低リスク変更に限定する
- DBスキーマ変更、認証、権限、外部API、ファイル削除、大量変更、破壊的変更では自動継続しない
- 不明点がある場合に勝手に仕様を確定しない
- 完了前には必ず /verify または同等の検証を行う
- 未確認項目がある場合は、完了報告に明記する

必要に応じて command の説明文を修正してください。

#### Step 8. subagent構成の改善

既存agentを確認し、役割が曖昧なものがあれば説明を改善してください。

最低限、次の役割が分かるようにしてください。

- implementation-validator: 実装差分と仕様適合性の確認
- ui-ux-validator: UI/UX、画面表示、操作性の確認
- doc-reviewer: README、設計書、tasklist、仕様書の整合確認
- screenshot-capture: UI確認用スクリーンショット取得

必要なら、以下のagent追加を提案してください。
ただし、不要なら追加しなくてよいです。
追加する場合は、既存agentとの重複を避けてください。

- architect
- backend-engineer
- frontend-engineer
- test-engineer
- reviewer

原則:
- 既存agentを優先する
- agentを増やしすぎない
- 実装担当agentを追加する場合は、誰が最終統合判断をするかを明記する
- main Claude がオーケストレーターであることを明記する

#### Step 9. READMEの改善

READMEを、初めて使う人でも分かるように更新してください。

最低限、以下を含めてください。

- このテンプレートの目的
- 基本ワークフロー
- 新規プロジェクト開始時の手順
- アイデア整理時の手順
- 機能追加時の手順
- UI機能追加時の手順
- /run-skill-generator の使い方
- /run /verify の使い方
- .steering/ の役割
- docs/ と docs/ideas/ と .steering/ の違い
- auto系コマンドの注意点
- よくある使い方
- 変更後に見るべきファイル

READMEは長くしすぎないでください。
詳細は CLAUDE.md や guidelines に逃がし、READMEは入口として読みやすくしてください。

#### Step 10. CLAUDE.mdの改善

CLAUDE.mdを、最上位の運用ルールとして整理してください。

方針:
- CLAUDE.md は長すぎないようにする
- 詳細ルールは .claude/docs/guidelines/ に逃がす
- 作業開始時にどのcommandを使うべきか分かるようにする
- /run-skill-generator, /run, /verify の位置づけを明記する
- .steering/ の位置づけを明記する
- 安全上の禁止事項を維持する
- 参照先ファイルが存在することを確認する

#### Step 11. command / skill の参照整合性確認

変更後、以下を確認してください。

- commandから参照しているskillが存在している
- skillから参照しているguidelineが存在している
- CLAUDE.mdから参照しているファイルが存在している
- READMEに書いたファイル構成と実ファイル構成が一致している
- 既存のcommand名を壊していない
- .steering/ の運用とcommandの説明が矛盾していない
- testing skill と /verify の役割が矛盾していない

#### Step 12. hooks / settings の安全性確認

変更後、以下を確認してください。

- .claude/settings.json の安全機構を弱めていない
- .claude/hooks/ の挙動を壊していない
- .env, credentials, key, secret などの機密ファイルを編集していない
- --no-verify 禁止などの安全ルールを緩めていない
- 保護ファイルの編集禁止ルールを弱めていない

#### Step 13. 最終確認

変更後、以下を確認してください。

- READMEの説明と実ファイル構成が一致している
- CLAUDE.mdの参照先が存在している
- commandから参照しているskillが存在している
- skillから参照しているguidelineが存在している
- 既存hooksやsettingsの安全機構が壊れていない
- .envやsecret類を編集していない
- 変更内容を簡潔に要約する

最終出力:
最後に、以下の形式で報告してください。

1. 変更したファイル
2. 変更しなかったが確認したファイル
3. 改善内容の要約
4. 既存テンプレートからの互換性
5. 安全性確認結果
6. 未対応・保留事項
7. 次にやるとよい改善

補足:
この改善の狙いは、外部フレームワークを追加することではありません。
既存テンプレートを、Claude CodeネイティブなAI駆動開発テンプレートとして整えることです。

最終的な思想は以下です。

- 先に仕様を固める
- 実装前に計画する
- 変更単位で .steering/ を作る
- tasklist.md で実装を管理する
- 繰り返し作業は skill 化する
- 専門検証は agent に任せる
- 実装後は /verify で動作確認する
- 学びと失敗をテンプレートに蓄積する