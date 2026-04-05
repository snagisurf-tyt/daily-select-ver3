# testing スキル動作確認強化 仕様書

> 作成日: 2026-04-05
> ステータス: Done
> 用途: /add-feature または /add-feature-ui への入力

---

## 1. 背景・目的

`/add-feature-ui` で実装した機能について、ステップ7.5「動作確認・リグレッションチェック」が不十分なケースが発生している。具体的には、playwright-cli を使って画面操作は行われているものの、**各インタラクション後のコンソールエラー確認**が省略されていることが原因で、ボタン押下などの操作時に発生するランタイムエラーを見落とす。

本改善は `testing` スキルに「操作 → `playwright-cli console error` でエラー 0 件確認」のサイクルを必須化し、動作確認の品質を底上げする。

---

## 2. スコープ

### 今回含めるもの
- `.claude/skills/testing/SKILL.md` に以下を追加:
  - アプリ起動コマンドの自動検出・起動フロー（手順書形式）
  - 「操作ごとのコンソールエラー確認」必須サイクル
  - 「操作ごとのネットワークエラー（4xx/5xx）確認」
- `.claude/commands/add-feature-ui.md` のステップ7.5に補足指示を追加
- `.claude/commands/add-feature.md` のステップ7.5に同様の補足指示を追加
- `/add-feature-ui` の実装ループ（ステップ5）で E2E テストコード作成時にコンソールエラーのアサーションを含める指示を追加

---

## 3. ユーザーストーリー

- テンプレート利用者として、`/add-feature-ui` 完了後に「画面操作でコンソールエラーが出ていない」ことが保証されていてほしい。
- テンプレート利用者として、playwright-cli による動作確認が「操作 → エラー確認」のサイクルで行われることで、目視では気づけないランタイムエラーを自動的に検出してほしい。
- テンプレート利用者として、`/add-feature-ui` がアプリを自律的に起動して確認できるため、自分でサーバーを立ち上げなくてよい。
- テンプレート利用者として、E2E テストコードにコンソールエラーとネットワークエラーのアサーションが含まれており、CI でも継続的に検出されてほしい。

---

## 4. 機能要件

### testing スキルの改善
- [ ] チェックリスト形式から**手順書（必須ステップ）形式**に全面書き直す
- [ ] **起動フロー**: `package.json` の `scripts`、`Makefile`、`README.md` から起動コマンドを特定し、バックグラウンドで起動する手順を追加する
  - ポートが開くまで待機する（`wait-on` / `nc -z localhost PORT` などを利用）
  - テスト終了後にサーバーを停止する手順も追加する
- [ ] **コンソールエラー確認（省略不可）**: 各インタラクション後に `playwright-cli console error` を実行し、エラー 0 件であることを確認する必須サイクルを追加する
  - エラーが 1 件でもある場合は作業を中断し、`tasklist.md` に修正タスクを追加する
- [ ] **ネットワークエラー確認**: 各インタラクション後（または主要操作のフロー終了後）に `playwright-cli network` を実行し、4xx/5xx エラーが 0 件であることを確認する手順を追加する

### add-feature-ui / add-feature ステップ7.5 の改善
- [ ] `Skill('testing')` の呼び出し前に「コンソールエラー確認・ネットワークエラー確認は省略禁止」という明示的な指示を追加する

### E2E テストコードへのアサーション追加
- [ ] `/add-feature-ui` のステップ4（計画フェーズ）で `tasklist.md` を生成する際、E2E テストのタスクに「コンソールエラーアサーションを含めること」という注記を追加する
- [ ] E2E テスト実装時の具体的なコード例（`page.on('console', ...)` によるエラー収集と `expect(errors).toHaveLength(0)` アサーション）をステップ5の指示に追加する

---

## 5. 非機能要件

- パフォーマンス: なし（スキル/コマンドファイルの編集のみ）
- セキュリティ: なし
- アクセシビリティ: なし

---

## 6. 技術的考慮事項（参考）

> このセクションは壁打ち時点のメモです。詳細設計は `/add-feature` 実行時に `steering/design.md` として生成されます。

### 実装アプローチ（案）

**testing スキル改善後の全体フロー:**

```markdown
## 動作確認（必須手順 — スキップ禁止）

### ステップ1: 起動コマンドの特定
以下の優先順位でアプリの起動コマンドを特定する:
1. `package.json` の `scripts.dev` または `scripts.start`
2. `Makefile` の `dev` / `start` / `run` ターゲット
3. `README.md` の起動手順セクション

### ステップ2: アプリの起動
```bash
# バックグラウンドで起動し、ポートが開くまで待機
npm run dev &
npx wait-on http://localhost:[PORT]
```
または `wait-on` がない場合:
```bash
until nc -z localhost [PORT]; do sleep 1; done
```

### ステップ3: playwright-cli でアクセス・操作確認
以下の**サイクルを各インタラクションごと**に繰り返す（省略禁止）:
1. 操作を実行 (例: `playwright-cli click e5`)
2. `playwright-cli console error` → エラー 0 件を確認
   - エラーあり → 即座に作業中断・`tasklist.md` に修正タスク追加
3. `playwright-cli network` → 4xx/5xx レスポンスが 0 件を確認
   - エラーあり → 即座に作業中断・`tasklist.md` に修正タスク追加
4. 次の操作へ進む

確認対象:
- 実装した機能のメイン操作フロー
- エラーケース（不正入力・空欄送信など）
- 実装に関連する既存機能

### ステップ4: アプリの停止
```bash
kill $(lsof -ti:[PORT])
```
```

**E2E テストコードへのコンソールエラーアサーション例:**

```typescript
test('実装機能のメインフロー', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // テスト操作...
  await page.getByRole('button', { name: '送信' }).click();

  // コンソールエラーが 0 件であることを確認
  expect(consoleErrors).toHaveLength(0);
});
```

**ネットワークエラーアサーション例:**

```typescript
test('実装機能のメインフロー', async ({ page }) => {
  const networkErrors: string[] = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      networkErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  // テスト操作...

  expect(networkErrors).toHaveLength(0);
});
```

### 既存コードへの影響（想定）
- 変更: `.claude/skills/testing/SKILL.md` — 全面書き直し（チェックリスト → 手順書）
- 変更: `.claude/commands/add-feature-ui.md` ステップ4・ステップ7.5 — E2E テスト指示・省略禁止指示の追加
- 変更: `.claude/commands/add-feature.md` ステップ7.5 — 省略禁止指示の追加

### 注意点・リスク
- `playwright-cli console error` はエラーレベルのみ取得（warning は許容）。これは意図的。
- バックグラウンド起動のプロセス管理は OS・環境によって異なる。`wait-on` がない場合のフォールバックを記述する。
- `npm run test:e2e` が webServer オプションでアプリを自動起動する場合、ステップ2の手動起動と衝突する可能性がある。testing スキル内で「E2E テスト実行中はサーバー起動済み」の旨を注記する。

---

## 7. 受け入れ条件

- [ ] `testing` スキルを読んだ Claude が、`package.json` 等からアプリ起動コマンドを特定してバックグラウンドで起動する
- [ ] `testing` スキルを読んだ Claude が、各インタラクション後に `playwright-cli console error` を実行し、エラーが 0 件であることを確認する
- [ ] `testing` スキルを読んだ Claude が、各インタラクション後に `playwright-cli network` を実行し、4xx/5xx が 0 件であることを確認する
- [ ] コンソールエラー・ネットワークエラーが検出された場合、Claude が修正タスクを追加して作業を中断する（スルーしない）
- [ ] add-feature-ui / add-feature のステップ7.5に「コンソールエラー確認・ネットワークエラー確認は省略禁止」と明記されている
- [ ] add-feature-ui でE2Eテストコードを生成する際、コンソールエラーアサーション（`page.on('console', ...)`）とネットワークエラーアサーション（`page.on('response', ...)`）が含まれる

---

## 8. 参考・関連

- 関連スキル: `.claude/skills/testing/SKILL.md`
- 関連コマンド: `.claude/commands/add-feature-ui.md`, `.claude/commands/add-feature.md`
- playwright-cli コマンドリファレンス: `.claude/skills/playwright-cli/SKILL.md`
