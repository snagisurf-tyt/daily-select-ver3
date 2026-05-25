# 設計内容

## 実装方針

全ての変更は既存 `.md` ファイルの Edit ツールによる編集のみ。新規ファイルは作成しない。
コード変更なし。ドキュメント・コマンド定義のみの変更。

## 変更ファイル一覧

| ファイル | 変更種別 | 変更概要 |
|---------|---------|---------|
| `CLAUDE.md` | 編集 | .steering/定義追加、ビルトインコマンドセクション追加 |
| `README.md` | 編集 | docs比較表、ビルトインコマンド追加、auto系注意点 |
| `.claude/commands/auto-add-feature-with-plan.md` | 編集 | 安全チェックステップ追加 |
| `.claude/commands/add-feature.md` | 編集 | ステップ7.5注記、ルールC追加 |
| `.claude/agents/implementation-validator.md` | 編集 | description改善 |
| `.claude/agents/ui-ux-validator.md` | 編集 | description改善 |
| `.claude/agents/doc-reviewer.md` | 編集 | description改善 |
| `.claude/agents/screenshot-capture.md` | 編集 | description改善 |
| `.claude/docs/guidelines/development-guidelines.md` | 編集 | テスト方針・セキュリティセクション追加 |

## 各ファイルの変更詳細

### CLAUDE.md

**追加内容1: `.steering/` の定義明文化**
- 「基本的な開発ワークフロー」セクションの`.steering/`説明を拡充
- docs/ / docs/ideas/ / .steering/ の役割差分を箇条書きで追記

**追加内容2: ビルトインコマンドの活用セクション（新規セクション）**
- /run-skill-generator: 新規プロジェクト開始後または起動方法変更時に実行
- /run: アプリ起動・基本動作確認
- /verify: 実装後の動作確認（必須）、単体テスト合格だけで完了扱いにしない

**追加内容3: testing skill と /verify の役割分担**
- 1行の役割明記を検証セクション付近に追加

### README.md

**追加内容1: ディレクトリ構成セクションへのdocs比較表**
```
| docs/ | プロダクト全体の長期ドキュメント | /setup-project 実行時 |
| docs/ideas/ | アイデアメモ・壁打ち結果・仕様書 | /plan-kaizen 実行時 |
| .steering/ | 変更単位の実行仕様（変更ごと） | /add-feature 実行時 |
```

**追加内容2: ビルトインコマンドテーブルの追加**
- コマンド一覧テーブルの後に「Claude Code ビルトインコマンド（活用推奨）」として3コマンドを追加

**追加内容3: auto系コマンドの注意点**
- auto系コマンドセクションに「⚠️ 注意」として安全な使い方と禁止パターンを追加

### auto-add-feature-with-plan.md

**追加ステップ: 安全チェック（フェーズ2の後に挿入）**
- 以下のいずれかを検知したら自動継続を止めユーザーに確認:
  - DBスキーマ変更・マイグレーション
  - 認証・認可ロジックの変更
  - 外部API連携の追加・変更
  - ファイル・ディレクトリの削除
  - 大量ファイル変更（10ファイル以上目安）
  - 破壊的な後方互換性破壊
- 未確認項目がある場合は完了報告に明記

### add-feature.md

**変更1: ステップ7.5への注記追加**
- 「このステップは /verify コマンドと同等の処理です」と注記
- 「ユーザーは実装後に直接 /verify を呼ぶこともできます」を追記

**変更2: 実装ループ例外処理にルールC追加**
```
- ルールC: 設計判断が必要な場合
  - 条件: DBスキーマ変更・認証変更・外部API追加など、設計上の重要判断が必要な変更が発生した場合
  - 対処法: 作業を一時停止し、AskUserQuestion でユーザーに状況と選択肢を提示する
```

### サブエージェント4ファイル

frontmatter の `description` フィールドを1行で書き直す：
- implementation-validator: 実装差分と仕様書の適合性・コード品質・テストカバレッジ・セキュリティを検証。/add-feature の品質ゲート前に呼ばれる
- ui-ux-validator: 機械的テストで検出できないUI/UX問題をレビュー。Gate5として /add-feature-ui から呼ばれる
- doc-reviewer: README・設計書・tasklist・仕様書の整合性・完結性・誤記をレビュー。/review-docs から呼ばれる
- screenshot-capture: アプリ画面をPlaywright CLIで自動撮影しdocs/screenshots/に保存。/generate-readme から呼ばれる

### development-guidelines.md

**追加セクション1: テスト方針**
- 単体テスト合格だけで完了扱いにしない
- /verify（または testing skill）による動作確認が必須
- コンソールエラー・ネットワークエラー 0 件を確認すること

**追加セクション2: セキュリティ・データ管理**
- .env・secrets のハードコード禁止（既存内容の整理）
- 入力バリデーションは API 境界で必ず行う
- ログ・エラーメッセージに機密情報を含めない

## 後方互換性

- 既存コマンド名変更なし
- 既存スキル名変更なし
- 既存エージェント名変更なし
- hooks/settings 変更なし
- 新規ファイル作成なし
