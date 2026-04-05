---
name: testing
description: 実装した機能の動作確認とリグレッションチェックを行うスキル。品質ゲート（lint/test/build）通過後に、実際に機能が動くか・既存機能が壊れていないかを確認する。/add-feature の品質ゲート通過後に呼び出される。
allowed-tools: Bash, Read, Write, Edit
caller: /add-feature, /add-feature-ui
---

# Testing スキル（動作確認・リグレッションチェック）

このスキルは、**静的解析では検出できない問題**を確認するためのものです。

> **「テストが全パス」≠「機能が動く」≠「既存機能が壊れていない」**
>
> ビルドが通っても、実際に画面を操作してみるまで実装完了とは言えない。

---

## ⚠️ 重要: 以下は「チェックリスト」ではなく必須手順です

**各ステップを順番に実行してください。省略・スキップは禁止です。**

コンソールエラーまたはネットワークエラーが 1 件でも検出された場合は、その時点で作業を中断し、
`tasklist.md` に修正タスクを追加してから実装フェーズに戻ること。

---

## 動作確認

Playwright を使う場合は、以下の優先順位で実行すること。

1. `Skill('playwright-cli')` を使用する（第一優先）
2. `playwright-cli` が利用できない場合は Playwright MCP を使用する
3. どちらも利用できない場合はインストールするか、開発サーバーを起動して手動確認する

### ステップ1: 起動コマンドの特定

以下の優先順位でアプリの起動コマンドを特定する:

1. `package.json` の `scripts.dev` または `scripts.start`
2. `Makefile` の `dev` / `start` / `run` ターゲット
3. `README.md` の起動手順セクション

```bash
# 確認例
cat package.json | grep -A 10 '"scripts"'
```

### ステップ2: アプリの起動

バックグラウンドで起動し、ポートが開くまで待機する。

```bash
# 例: npm プロジェクトの場合（[PORT] は実際のポート番号に置き換える）
npm run dev &
DEV_PID=$!

# ポートが開くまで待機（wait-on がある場合）
npx wait-on http://localhost:[PORT]

# wait-on がない場合のフォールバック（Linux/macOS のみ）
# Windows では nc が使えないため wait-on の使用を推奨
until nc -z localhost [PORT] 2>/dev/null; do sleep 1; done
```

> **注意**: E2E テスト（`npm run test:e2e`）が既に `playwright.config.ts` の `webServer` 設定でサーバーを起動している場合、このステップは不要。その場合は playwright-cli で直接アクセスすること。

### ステップ3: playwright-cli での操作確認（省略禁止）

**以下のサイクルを各インタラクションごとに繰り返す。**

```
[操作] → [console error 確認] → [network 確認] → [次の操作へ]
```

#### サイクルの具体的な手順

1. アプリにアクセスする:
   ```bash
   playwright-cli open http://localhost:[PORT]  # [PORT] は実際のポート番号
   playwright-cli snapshot
   ```

2. 操作を実行する（例）:
   ```bash
   playwright-cli click e5
   # または
   playwright-cli fill e3 "テスト入力"
   playwright-cli click e7
   ```

3. **即座に** コンソールエラーを確認する（省略禁止）:
   ```bash
   playwright-cli console error
   ```
   - **エラーが 0 件** → 次の確認へ進む
   - **エラーが 1 件以上** → 作業を中断し、エラー内容を `tasklist.md` に修正タスクとして追加する

4. **即座に** ネットワークエラーを確認する（省略禁止）:
   ```bash
   playwright-cli network
   ```
   - **4xx/5xx レスポンスが 0 件** → 次の操作へ進む
   - **4xx/5xx が 1 件以上** → 作業を中断し、エンドポイント名とステータスコードを `tasklist.md` に修正タスクとして追加する

5. 次の操作へ進む（2 に戻る）

#### 確認対象の操作フロー

- **実装した機能のメイン操作フロー**（例: フォーム送信、ボタン押下、一覧表示）
- **エラーケース**（例: 不正入力、空欄送信）
- **実装に関連する既存機能の操作**（リグレッション確認）

#### スクリーンショット

確認の証拠として主要な操作後にスクリーンショットを撮ること:
```bash
playwright-cli screenshot --filename=artifacts/screenshots/[機能名]-after-[操作名].png
```

### ステップ4: アプリの停止

```bash
# ステップ2でバックグラウンド起動した場合のみ実行
kill $DEV_PID 2>/dev/null || kill $(lsof -ti:[PORT]) 2>/dev/null
```

> **スクリーンショットの保存先ルール**: Playwright でスクリーンショットを撮る際は `--filename=artifacts/screenshots/{名前}.png` を指定すること。指定し忘れても PostToolUse Hook がルート直下の png を `artifacts/screenshots/` に自動移動する。

---

## リグレッションチェック

実装した変更が影響しうる **既存機能** を確認する。
「自分が触ったファイルに依存している機能は何か？」を意識すること。

確認の優先順位：

1. **直接変更したコンポーネント・関数** を使っている既存機能
2. **変更したAPIエンドポイント** を呼び出している既存画面
3. **共通ユーティリティ・スタイル** を変更した場合は全体を目視確認

上記の既存機能についても「ステップ3: 操作確認サイクル」と同様に、操作ごとにコンソールエラーとネットワークエラーを確認すること。

問題が見つかった場合は、`tasklist.md` に修正タスクを追加して作業計画に戻ること。
