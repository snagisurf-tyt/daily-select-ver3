# 設計書

## アーキテクチャ概要

変更対象はすべてマークダウンファイル（スキル・コマンド定義）。コードの追加はなく、Claude が読む「手順書」の品質改善が目的。

変更ファイル:
- `.claude/skills/testing/SKILL.md` — 全面書き直し
- `.claude/commands/add-feature-ui.md` — ステップ4・ステップ7.5 を部分編集
- `.claude/commands/add-feature.md` — ステップ7.5 を部分編集

## コンポーネント設計

### 1. testing/SKILL.md（全面書き直し）

**責務**:
- アプリを実際に起動して操作確認するための手順を提供する
- 「操作 → エラー確認」の必須サイクルを Claude に強制する

**設計方針**:
- チェックリスト（`- [ ]`）を廃止し、番号付き手順書に変換
- 省略不可である旨を冒頭に強調表示
- 4つのステップ構成: 起動コマンド特定 → アプリ起動 → 操作確認サイクル → アプリ停止

**起動コマンド特定ロジック**（優先順位）:
1. `package.json` の `scripts.dev`
2. `package.json` の `scripts.start`
3. `Makefile` の `dev` / `start` / `run` ターゲット
4. `README.md` の起動手順セクション

**操作確認サイクル**（各インタラクションで繰り返す）:
1. 操作実行 (`playwright-cli click / fill / ...`)
2. `playwright-cli console error` → エラー 0 件確認（1件でもあれば中断）
3. `playwright-cli network` → 4xx/5xx 0 件確認（1件でもあれば中断）
4. 次の操作へ

**注意事項**:
- `playwright-cli console error` は error レベルのみ（warning は許容）
- E2E テスト実行中は webServer 設定でサーバーが起動済みの可能性があるため、その旨を注記
- OS 依存のプロセス停止コマンドを注記（Linux/Mac: `kill $(lsof -ti:[PORT])`）

### 2. add-feature-ui.md ステップ4 の変更

**責務**:
- E2E テスト生成タスクにアサーション要件を注記する

**変更箇所**:
ステップ4-2 の `tasklist.md` 生成指示にある E2E テスト関連のタスク記述に以下を追記:
- `page.on('console', ...)` によるコンソールエラー収集
- `page.on('response', ...)` によるネットワークエラー収集
- 各テスト末尾に `expect(consoleErrors).toHaveLength(0)` と `expect(networkErrors).toHaveLength(0)` のアサーション

### 3. add-feature-ui.md / add-feature.md ステップ7.5 の変更

**責務**:
- testing スキルへの委譲前に省略禁止を明記する

**変更内容**:
```
⚠️ 省略禁止: 各インタラクション後に必ず `playwright-cli console error` と `playwright-cli network` でエラー 0 件を確認すること。エラーが検出された場合は作業を中断し、tasklist.md に修正タスクを追加する。
```

## 実装の順序

1. `testing/SKILL.md` の全面書き直し（最も変更量が大きい）
2. `add-feature-ui.md` ステップ4 への E2E アサーション注記追加
3. `add-feature-ui.md` ステップ7.5 への省略禁止指示追加
4. `add-feature.md` ステップ7.5 への省略禁止指示追加

## セキュリティ考慮事項

- なし（マークダウンファイルの編集のみ）

## 将来の拡張性

- `playwright-cli console warning` の確認追加（今回は warning 許容）
- Python/FastAPI 等の起動コマンド対応（今回は主に npm ベース）
