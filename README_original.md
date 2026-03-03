<!-- README.mdと同じものです。 -->

# SDD Template

**Spec Driven Development (SDD)** のプロジェクトテンプレートです。
「仕様を先に書き、仕様に従って実装する」ワークフローを Claude Code で自動化します。

## 事前準備

1. このリポジトリをテンプレートとしてプロジェクトフォルダを作る。
   * プロジェクトフォルダに `.claude`フォルダ、`docs/guidelines`フォルダ、`CLAUDE.md`をコピーしても良いです。

2. アプリテストに使う Playwright CLI と Playwright MCP をインストールする。
   * インストール方法は[手順書](README_setup-playwright.md) を参照してください。


## 開発ワークフロー

[SDD-workflow.md](SDD-workflow.md) にフローチャートでまとめました。

### 1. アプリの仕様を固める

* アプリ構想を `docs/ideas/initial-requirements.md` に記述する。
* プロジェクトフォルダで Claude Code を起動する。
* `/plan-kaizen` コマンドを使って、Claude Codeとの対話を通じて内容をブラッシュアップする。
  * プロダクトの基本的なアイデア、解決したい課題、ターゲットユーザーの概要、実装したい主要機能、MVPの範囲 などを整理する。
  * このコマンドは`docs/guidelines`フォルダにあるガイドラインを参照します。アプリにつかう技術スタックを指定したい場合は、`tech-stack-guidelines.md`を編集してください。

### 2. アプリの仕様書を作る

* `/setup-project`コマンドを実行して、初回セットアップをおこなう。
  * 永続的ドキュメントが`docs/`に生成される。

### 3. アプリを実装する

* `/add-feature`コマンドあるいは`/add-feature-ui`コマンドでアプリ実装をする。
  * 例: `/add-feature-ui アプリMVPを作って`
  * `src/`にソースコードが、`tests/`にテストコードが生成される。

### 4. アプリの機能追加・バグ修正をする

* 簡単なものであれば、`/add-feature [依頼コメント]` で実装できます。
  * 例: `/add-feature ユーザープロフィール編集を追加して`
* 複雑な依頼の場合は、アイデアノートを`docs/ideas/`に作成し、その内容をClaude Codeと壁打ちして固める。
  * 例: `/plan-kaizen docs/ideas/memo1.md をブラッシュアップして`
  * 壁打ち結果は、`docs/ideas/[YYYYMMDD]-[機能名].md`として保存される。
  * 仕様が固まったら、`/add-feature`あるいは`/add-feature-ui`コマンドで実装する。
    * 例: `/add-feature [ファイル名]を実装して`


## 主要なコマンド

| コマンド | 用途 |
|---------|------|
| `/setup-project` | 初回のみ。6種のドキュメントを作成してプロジェクト基盤を確立する |
| `/plan-kaizen <アイデア>` | 既存コード・ドキュメントを踏まえて壁打ちし、仕様 MD を `docs/ideas/` に生成する |
| `/add-feature <機能名>` | 機能追加（計画→実装→検証→振り返りを自動実行） |
| `/add-feature-ui <機能名>` | 機能追加（E2Eテストを含む） |
| `/resume-work` | 中断した作業をチェックポイントから再開する |
| `/review-docs <パス>` | ドキュメントをサブエージェントで精査する |

## ディレクトリ構成

/add-feature および /add-feature-ui コマンドの実行により、以下のディレクトリ構成が自動生成される:

```
.claude/commands/   # /add-feature などのコマンド定義
.claude/agents/     # サブエージェント定義
.claude/skills/     # スキル定義
docs/               # プロジェクト永続ドキュメント（/setup-project で生成）
.steering/          # 作業単位のタスク管理（/add-feature で生成）
src/                # ソースコード（/add-feature で生成）
tests/              # テストコード（下記参照）
```

## tests/ ディレクトリについて

`tests/` 配下の `example.spec.ts` は**テンプレート参照用のサンプル**です。

実際のテストファイルは `/add-feature-ui` の実行時に自動生成されます。手動でファイルを削除・書き換える必要はありません。

### 品質ゲートとの関係

各ゲートは以下のファイル・ディレクトリの存在によって自動的に発動します。

| ディレクトリ / ファイル | 発動する Gate | 備考 |
|----------------------|-------------|------|
| `tests/a11y/` が存在する | Gate 4（a11y）が発動 | `/add-feature-ui` 実行時に実テストファイルが生成される |
| `tests/vrt/__screenshots__/` が存在する | Gate 3（VRT）が発動 | このディレクトリはテンプレートに含まれないため初期状態では発動しない |
| `playwright.config.ts` が存在する | Gate 2（E2E）が発動 | このファイルはテンプレートに含まれないため初期状態では発動しない |

<!-- > **Gate 4 を使用しない場合**: `tests/a11y/` ディレクトリごと削除してください（Gate 4 が不要なプロジェクトの場合のみ）。 -->

## 参考ドキュメント

- [SDD-workflow.md](SDD-workflow.md) — 全体ワークフロー図
- [docs/guidelines/definition-of-done.md](docs/guidelines/definition-of-done.md) — 品質ゲートの定義
- [docs/guidelines/repository-structure-guidelines.md](docs/guidelines/repository-structure-guidelines.md) — ディレクトリ構造
- [docs/guidelines/tech-stack-guidelines.md](docs/guidelines/tech-stack-guidelines.md) — 技術スタック選定ガイドライン
