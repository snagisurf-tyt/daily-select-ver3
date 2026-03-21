---
description: アプリ用README.mdを自動生成・更新する。shields.ioバッジ、スクリーンショット、技術スタック情報を含む。
---

# README.md 自動生成

**目的:** プロジェクトの永続ドキュメント（PRD、機能設計書、アーキテクチャ）と実装状況から、アプリ用の README.md を自動生成する。

**引数:** なし（プロジェクト内の情報から自動生成）

---

## ステップ1: 情報収集

以下のファイルを読み込み、README に必要な情報を収集する。

### 必須ファイル
1. `CLAUDE.md` — プロジェクトの全体像
2. `docs/product-requirements.md` — プロダクトの目的・スコープ（存在する場合）

### 任意ファイル（存在する場合のみ読み込み）
3. `docs/functional-design.md` — 主要機能の一覧
4. `docs/architecture.md` — 技術スタック・アーキテクチャ
5. `.claude/docs/guidelines/tech-stack-guidelines.md` — 技術スタックガイドライン
6. `package.json` — Node.js依存関係・スクリプト
7. `requirements.txt` / `pyproject.toml` — Python依存関係
8. `LICENSE` — ライセンス情報
9. `docs/screenshots/` — スクリーンショット画像

## ステップ2: スクリーンショット撮影の確認

`AskUserQuestion` で以下を確認する:

- 「スクリーンショットを撮影しますか？（アプリが起動可能な状態である必要があります）」
  - **はい**: `Agent` ツールで `screenshot-capture` サブエージェントを起動する
    - `subagent_type`: "screenshot-capture"
    - `description`: "App screenshot capture"
    - `prompt`: "アプリケーションのスクリーンショットを撮影してください。docs/functional-design.md があればその主要画面を、なければトップページを撮影してください。"
  - **いいえ**: スキップして次のステップへ

## ステップ3: バッジの生成

以下のルールで shields.io バッジを生成する:

### ライセンスバッジ
- `LICENSE` ファイルが存在する場合、内容からライセンス種別を検出:
  - MIT → `![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)`
  - Apache 2.0 → `![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)`
  - GPL → `![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)`
- 存在しない場合はバッジなし

### 技術スタックバッジ
`package.json` の dependencies、または `requirements.txt` / `pyproject.toml` から主要技術を検出:

| 検出キーワード | バッジ |
|-------------|-------|
| `react` | `![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)` |
| `next` | `![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)` |
| `vue` | `![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vuedotjs&logoColor=white)` |
| `express` | `![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)` |
| `fastapi` | `![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)` |
| `flask` | `![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)` |
| `django` | `![Django](https://img.shields.io/badge/Django-092E20?logo=django&logoColor=white)` |
| `typescript` | `![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)` |
| `python` | `![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)` |
| `tailwindcss` | `![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)` |
| `playwright` | `![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)` |

上記に該当しない技術でも、主要なものは `https://img.shields.io/badge/{名前}-{色}` 形式で生成する。

## ステップ4: README.md の生成

以下のテンプレートに沿って README.md を生成する。各セクションは収集した情報に基づいて埋める。情報が不足しているセクションはプレースホルダを残す。

```markdown
# {プロジェクト名}

{バッジ一覧（ライセンス + 技術スタック）}

## 概要

{product-requirements.md の「目的」「解決する課題」セクションから抽出。なければ CLAUDE.md から推定}

## スクリーンショット

{docs/screenshots/ 内の画像をテーブル形式で表示。なければ以下のプレースホルダ}
<!-- `/generate-readme` を実行してスクリーンショットを自動生成できます -->

## 主な機能

{functional-design.md から主要機能を箇条書き。なければ product-requirements.md から抽出}

- 機能1: 説明
- 機能2: 説明
- 機能3: 説明

## 技術スタック

{architecture.md または tech-stack-guidelines.md から抽出}

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | {検出した技術} |
| バックエンド | {検出した技術} |
| データベース | {検出した技術} |
| テスト | {検出した技術} |

## セットアップ

### 前提条件

{package.json の engines や requirements.txt から推定}

### インストール

\`\`\`bash
# リポジトリのクローン
git clone {リポジトリURL}
cd {プロジェクト名}

# 依存関係のインストール
{npm install / pip install -r requirements.txt / uv sync 等}
\`\`\`

### 起動

\`\`\`bash
{npm run dev / python src/main.py 等}
\`\`\`

## 使い方

{基本的な使い方を記載。functional-design.md のユースケースから推定}

## ライセンス

{LICENSE ファイルから検出。なければプレースホルダ}
```

## ステップ5: 既存README.mdの処理

- README.md が存在しない場合: そのまま生成
- README.md が存在する場合:
  - `AskUserQuestion` で「既存の README.md を上書きしますか？」と確認
  - **上書き**: 新しい内容で置換
  - **マージ**: 既存の内容を参考にしつつ、テンプレートに沿って再構成

## ステップ6: 完了報告

```
README.md を生成しました。

含まれるセクション:
- [x] バッジ（{N}個）
- [x/  ] スクリーンショット
- [x/  ] 主な機能
- [x/  ] 技術スタック
- [x/  ] セットアップ手順
- [x/  ] ライセンス

スクリーンショットを更新するには、アプリを起動可能な状態で再度 `/generate-readme` を実行してください。
```
