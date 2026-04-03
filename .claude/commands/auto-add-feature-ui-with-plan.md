---
description: 仕様策定（plan-kaizen）から実装・E2Eテスト・コミット・pushまでを一括自動実行する（E2Eテストあり版）
---

# 仕様策定 → 実装 完全自動モード・E2Eテストあり (auto-add-feature-ui-with-plan)

**重要:** このワークフローは、仕様策定から実装・E2Eテスト・コミット・pushまでを **ユーザー確認なしに完全自動** で実行します。
途中で AskUserQuestion が発生した場合（add-feature-ui の push 確認を含む）は、**自動的に「はい / push する / スキップ不要」として進んでください。**
壁打ちフェーズ（引数が曖昧な場合）のみ AskUserQuestion を使用します。

> このコマンドは `/auto-add-feature-with-plan` の E2E テストあり版です。
> フェーズ4で `Skill('add-feature')` の代わりに `Skill('add-feature-ui')` を使用します。
> add-feature-ui は E2E テスト（Gate 2）が品質ゲートに追加されます。

**引数:**
- テキスト: `/auto-add-feature-ui-with-plan "ログイン画面にremember meチェックボックスを追加"`
- ファイルパス: `/auto-add-feature-ui-with-plan docs/ideas/my-spec.md`
- GitHub Issue 番号: `/auto-add-feature-ui-with-plan #123`
- GitHub Issue URL: `/auto-add-feature-ui-with-plan https://github.com/owner/repo/issues/123`

---

## フェーズ1: 引数解析

引数の種類を判定し、コンテンツを取得する。

### 判定ロジック（優先順位順）

1. **GitHub Issue URL の場合**: 引数が `https://github.com/` で始まり `/issues/` を含む
   ```bash
   gh issue view <URL> --json title,body,labels,comments
   ```
   - 失敗した場合（gh 未インストール・未認証等）: エラーをユーザーに通知し、引数をテキストとして扱い次へ進む

2. **GitHub Issue 番号の場合**: 引数が `#` + 数字のみ（例: `#123`）
   ```bash
   gh issue view 123 --json title,body,labels,comments
   ```
   - 失敗した場合: 同様にテキストとして扱い次へ進む

3. **ファイルパスの場合**: 引数が既存ファイルパス（Read ツールで読める）
   - Read ツールでファイルを読み込み、内容をコンテンツとして使用

4. **テキストの場合**: 上記以外
   - 引数をそのままコンテンツとして使用

取得したコンテンツを「入力コンテンツ」として以降のフェーズで使用する。

---

## フェーズ2: plan-kaizen（仕様策定・自動化版）

### ステップ2-1: コンテキスト読み込み

以下を読み込んでプロジェクトを把握する（存在するものだけ）:
- `CLAUDE.md`
- `docs/product-requirements.md`
- `docs/functional-design.md`
- `docs/architecture.md`
- `docs/glossary.md`
- `.claude/docs/guidelines/tech-stack-guidelines.md`
- `.claude/docs/guidelines/repository-structure-guidelines.md`

### ステップ2-2: 情報量判定

入力コンテンツの情報量を判定し、**壁打ちをスキップするかどうか**を決定する。

**省略条件（以下のいずれかを満たせばスキップ）:**
- GitHub Issue または URL から取得したコンテンツである
- ファイルパスから取得したコンテンツである
- テキストが 150 字以上 かつ 機能要件・ユーザーストーリー・実装方針・受け入れ条件のいずれかを含む

**壁打ち条件（上記を満たさない場合）:**
- テキストが 150 字未満、または概念・キーワードのみ

### ステップ2-3: 壁打ち（条件に該当する場合のみ）

**スキップ対象の場合は このステップをスキップしてステップ2-4へ進む。**

`AskUserQuestion` ツールを使い、最大 2 ターンで不明点を解消する。

**壁打ちの観点（必要に応じて選択）:**
- スコープ（MVPに含めるもの・含めないもの）
- UX（ユーザーの操作フロー・状態遷移）
- エラーケース・バリデーションルール
- 既存機能との整合性

**「仕様書を生成しますか？」の最終確認は絶対に行わない。**
2 ターン終了後、または十分な情報が得られた時点で自動的にステップ 2-4 へ進む。

### ステップ2-4: 仕様書生成

`docs/ideas/` ディレクトリが存在しない場合は作成する。

機能名を英小文字ハイフン区切りで決定し（例: `remember-me-checkbox`）、以下のパスに仕様書を生成する:
```
docs/ideas/[YYYYMMDD]-[機能名].md
```

仕様書の構成:
```markdown
# [機能名] 仕様書

> 作成日: [YYYY-MM-DD]
> ステータス: Draft
> 用途: /add-feature-ui への入力（auto-add-feature-ui-with-plan による自動生成）

---

## 1. 背景・目的
## 2. スコープ（含めるもの / 含めないもの）
## 3. ユーザーストーリー
## 4. 機能要件
## 5. 非機能要件
## 6. 技術的考慮事項（参考）
## 7. 受け入れ条件
## 8. 参考・関連
```

**ステップ2-4が完了したら、確認や停止を一切せずにフェーズ3へ進むこと。**

---

## フェーズ3: 中間 git コミット・push

### ステップ3-1: Git リポジトリの確認

```bash
git rev-parse --is-inside-work-tree 2>/dev/null
```

- **リポジトリが存在する場合**: ステップ3-2へ
- **リポジトリが存在しない場合**:
  1. `git init` を実行
  2. `.gitignore` が存在しない場合、プロジェクトに適した `.gitignore` を作成（node_modules/, .env, .venv/ 等）
  3. ステップ3-2へ

### ステップ3-2: 変更のコミット

```bash
git status
```

変更がある場合:
1. センシティブファイルを除外してステージング:
   ```bash
   git add --all -- ':!.env' ':!*.key' ':!credentials*' ':!*.pem' ':!*.p12'
   ```
2. コミット（機能名は仕様書のファイル名から取得）:
   ```bash
   git commit -m "docs: [機能名] 仕様書追加（auto-add-feature-ui-with-plan による自動生成）"
   ```

変更がない場合: ステップ3-3へ

### ステップ3-3: Push

```bash
git remote -v
```

- **remote が設定されている場合**: 確認なしで自動 push
  ```bash
  git push
  ```
  失敗した場合（upstream 未設定等）:
  ```bash
  git push --set-upstream origin $(git rev-parse --abbrev-ref HEAD)
  ```
- **remote が設定されていない場合**: スキップ（ローカルコミットのみ）

**フェーズ3が完了したら、確認や停止を一切せずにフェーズ4へ進むこと。**

---

## フェーズ4: 実装（add-feature-ui の自動着火）

生成した仕様書を引数として `Skill('add-feature-ui')` を着火する。

**重要な指示:**
- add-feature-ui の「ステップ9: Git 操作」で push 確認の `AskUserQuestion` が発生した場合、**自動的に「はい（push する）」として応答し、処理を継続すること**。
- ユーザーの手動確認は一切不要。
- add-feature-ui は E2E テスト（Gate 2: `npm run test:e2e`）を含む品質ゲートを実行する。

```
Skill('add-feature-ui') を引数 "[生成した仕様書のパス] を実装して" で呼び出す
```

**Skill('add-feature-ui') が完了したら、確認や停止を一切せずにフェーズ5へ進むこと。**

---

## フェーズ5: 最終 git コミット・push

add-feature-ui が内部でコミット・push まで行う場合は、このフェーズをスキップしてよい。
ただし、未コミットの変更が残っている場合は以下を実行する。

### ステップ5-1: 変更確認

```bash
git status
```

未コミットの変更がある場合:
1. ステージング（センシティブファイル除外）:
   ```bash
   git add --all -- ':!.env' ':!*.key' ':!credentials*' ':!*.pem' ':!*.p12'
   ```
2. コミット:
   ```bash
   git commit -m "feat: [機能名] 実装完了（auto-add-feature-ui-with-plan）"
   ```

### ステップ5-2: Push

```bash
git remote -v
```

- **remote が設定されている場合**: 確認なしで自動 push
  ```bash
  git push
  ```
  失敗した場合:
  ```bash
  git push --set-upstream origin $(git rev-parse --abbrev-ref HEAD)
  ```
- **remote が設定されていない場合**: スキップ

---

## 完了報告

全フェーズ完了後、以下を報告する:

```
✅ auto-add-feature-ui-with-plan 完了

仕様書: docs/ideas/[ファイル名]
実装: [実装したファイル一覧]
E2Eテスト: [パス / スキップ（playwright.config.ts なし）]
コミット: [コミットメッセージ]
Push: [実行 / スキップ（remote なし）]
```
