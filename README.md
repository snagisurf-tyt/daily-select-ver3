# densei-skills-template

電池製造技術部 デジタル支援グループが使用する、スペック駆動開発テンプレートです。

Claude Code (Anthropic) と Codex (OpenAI) の両方に対応しています。両社が公開しているスキルとオリジナルスキルを同梱しており、このテンプレートからプロジェクトを始めることで、仕様策定から実装まで一貫した開発フローで作業できます。

## 始め方

### 1. テンプレートからリポジトリを作成

GitHub の「Use this template」でリポジトリを作成し、クローンします。

```bash
git clone --recurse-submodules <作成したリポジトリURL>
cd <リポジトリ名>
```

既にクローン済みでスキルが読み込めない場合は、サブモジュールを初期化してください。

```bash
git submodule update --init --recursive
```

### 2. スキルのシンボリックリンクを作成

git hooks を有効化して、スキルのシンボリックリンクを作成します。

```bash
./scripts/enable-git-hooks.sh
./.githooks/sync-skill-symlinks.sh
```

以降はチェックアウト・マージ時に自動で同期されます。

### 3. 壁打ちでアイデアを固める

Claude Code や Codex を起動して、作りたいものについて会話します。成果物は `docs/ideas/` に保存されます。

### 4. 仕様ドキュメントを作成

アイデアが固まったら、スラッシュコマンドで正式な仕様ドキュメントを作成します。

```
/setup-project
```

対話形式で以下の 6 つのドキュメントが `docs/` に作成されます。

| ドキュメント | 内容 |
|---|---|
| product-requirements.md | プロダクト要求定義書 |
| functional-design.md | 機能設計書 |
| architecture.md | 技術仕様書 |
| repository-structure.md | リポジトリ構造定義書 |
| development-guidelines.md | 開発ガイドライン |
| glossary.md | ユビキタス言語定義 |

### 5. 機能を実装する

```
/add-feature ユーザー認証機能
```

仕様ドキュメントに基づいて、作業計画 → 実装 → 検証の流れで進みます。

## ディレクトリ構成

```
original-skills/  # オリジナルスキル（最優先で読み込まれる）
vendor/           # 外部スキル（git submodule）
docs/
  ideas/          # 壁打ち・ブレスト成果物
  *.md            # 正式な仕様ドキュメント（/setup-project で作成）
.steering/        # 作業単位の計画・タスク管理
.claude/
  skills/         # シンボリックリンク（Claude Code が参照）
  commands/       # スラッシュコマンド定義
  agents/         # サブエージェント定義
.agents/
  skills/         # シンボリックリンク（Codex が参照）
CLAUDE.md         # プロジェクトメモリ（Claude Code 用）
AGENTS.md         # プロジェクトメモリ（Codex 用）
```

## スキルの仕組み

スキルは 3 つのソースから読み込まれ、同名の場合は上のものが優先されます。

| 優先順位 | ソース | 説明 |
|---|---|---|
| 1 | `original-skills/` | このテンプレートのオリジナルスキル |
| 2 | `vendor/anthropics-skills/` | [Anthropic 公式スキル](https://github.com/anthropics/skills) |
| 3 | `vendor/openai-skills/` | [OpenAI 公式スキル](https://github.com/openai/skills) |

`.githooks/sync-skill-symlinks.sh` がシンボリックリンクを `.claude/skills/` と `.agents/skills/` の両方に作成するため、Claude Code と Codex のどちらからでも同じスキルを利用できます。

## 主なコマンド

| コマンド | 用途 |
|---|---|
| `/setup-project` | 初回セットアップ。仕様ドキュメントを対話的に作成 |
| `/add-feature [機能名]` | 仕様に基づいた機能実装 |
| `/review-docs [ファイルパス]` | ドキュメントの詳細レビュー |

普段の作業は自然な会話で依頼できます。コマンドは定型フローを実行したいときに使います。

## ライセンス

MIT
