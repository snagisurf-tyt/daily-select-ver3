# 設計書

## アーキテクチャ概要

Claude Code のカスタムコマンド（`.claude/commands/*.md`）として実装する。
`auto-add-feature-with-plan` と `auto-add-feature-ui-with-plan` は構造がほぼ同一で、着火するスキルが `add-feature` か `add-feature-ui` かだけ異なる。

```
引数
  │
  ▼
[引数解析フェーズ]
  - #123 → gh issue view 123
  - https://.../issues/NNN → gh issue view <URL>
  - ファイルパス → Read
  - テキスト → そのまま
  │
  ▼
[plan-kaizen フェーズ（自動化版）]
  - コンテキスト読み込み
  - 情報量判定 → 省略 or 壁打ち（最大2ターン）
  - 仕様書生成 → docs/ideas/[YYYYMMDD]-[機能名].md
  │
  ▼
[中間 git commit・push]
  - git status
  - git add（センシティブ除外）
  - git commit "docs: ..."
  - git remote -v → あれば自動 push
  │
  ▼
[Skill('add-feature') or Skill('add-feature-ui')]
  - 仕様書パスを引数として渡す
  - push 確認が来ても自動で YES を応答
  │
  ▼
[最終 git commit・push]
  - 実装完了後の変更をコミット
  - remote があれば自動 push
```

## コンポーネント設計

### 1. auto-add-feature-with-plan.md

**責務**:
- 引数解析からはじまり add-feature の着火・最終 push まで一本のフローを定義する
- add-feature の push 確認（AskUserQuestion）に対して自動で YES を応答するよう指示する

**実装の要点**:
- コマンドファイルの先頭 frontmatter に `description:` を記載（スキル一覧に表示）
- 引数パターン判定ロジックを明示的に記述（AIが迷わないように具体的な条件を書く）
- 情報量判定の閾値を具体的に記述（150字以上 + キーワード）
- push 前の AskUserQuestion が来ても自動で応答する旨を冒頭に明記

### 2. auto-add-feature-ui-with-plan.md

**責務**:
- `auto-add-feature-with-plan.md` と同一だが、着火するスキルが `add-feature-ui`

**実装の要点**:
- `auto-add-feature-with-plan.md` の内容を流用し、`add-feature` → `add-feature-ui` に変更するだけ

## データフロー

### テキスト引数のケース（壁打きなし）
```
1. 引数を受け取る: "ログイン画面に remember me チェックボックスを追加"
2. 情報量を判定 → 詳細なのでスキップ
3. 仕様書を docs/ideas/20260403-remember-me.md に生成
4. git add & commit "docs: remember-me チェックボックス 仕様書追加"
5. git push（remote あれば）
6. Skill('add-feature') を着火（仕様書パス渡し）
7. 実装完了後、git commit & push
```

### GitHub Issue 引数のケース
```
1. 引数を受け取る: "#42"
2. gh issue view 42 で Issue 内容を取得
3. Issue 内容を情報量判定 → 十分ならスキップ
4. 仕様書を docs/ideas/20260403-[issue-title].md に生成
5. 以下同じ
```

### 曖昧テキストのケース（壁打きあり）
```
1. 引数を受け取る: "ダッシュボードを改善したい"
2. 情報量を判定 → 不十分なので壁打きへ
3. AskUserQuestion（最大2ターン）
4. 仕様書生成
5. 以下同じ
```

## エラーハンドリング戦略

### gh コマンド失敗
- `gh issue view` が失敗した場合（未インストール・未認証など）
- 対処: エラーをユーザーに通知し、引数をテキストとして処理継続

### git リポジトリなし
- `git rev-parse` が失敗した場合
- 対処: `git init` → 初回コミット → 中間 push スキップ

## テスト戦略

このコマンドファイルは Markdown 形式のプロンプト指示書のため、従来の unit/E2E テストは適用不可。
代わりに以下でバリデーションを行う:

### ファイル構造バリデーション（E2E spec）
- 2つのコマンドファイルが存在すること
- frontmatter に `description:` が含まれること
- CLAUDE.md にコマンド説明が追記されること

## 依存ライブラリ

追加ライブラリなし（既存の Claude Code カスタムコマンドの仕組みのみ使用）

## ディレクトリ構造

```
.claude/
└── commands/
    ├── auto-add-feature-with-plan.md     ← 新規追加
    └── auto-add-feature-ui-with-plan.md  ← 新規追加
CLAUDE.md                                  ← コマンド説明を追記
tests/
└── e2e/
    └── auto-add-feature-commands.spec.ts  ← 新規追加（バリデーション用）
```

## 実装の順序

1. `auto-add-feature-with-plan.md` の作成
2. `auto-add-feature-ui-with-plan.md` の作成（1 をベースに add-feature-ui 用に変更）
3. `CLAUDE.md` へのコマンド説明追記
4. E2E バリデーション spec の作成

## セキュリティ考慮事項

- git add 時に `.env`, `credentials`, `*.key` を必ず除外
- GitHub Issue URL や Issue 番号は `gh` CLI 経由でのみ取得（URL を直接 fetch しない）

## パフォーマンス考慮事項

- 壁打きターン数を最大 2 ターンに固定し、無限ループを防止

## 将来の拡張性

- `--no-push` フラグを引数に追加して push をスキップできるようにする
- `--dry-run` フラグで仕様書生成だけ行うモードを追加
- これらは将来の拡張として仕様書のスコープ外に記載済み
