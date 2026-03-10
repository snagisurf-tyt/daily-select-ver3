# ワークフロー迂回防止ガードレール追加プラン

> 作成日: 2026-03-06
> ステータス: Draft
---

- [ワークフロー迂回防止ガードレール追加プラン](#ワークフロー迂回防止ガードレール追加プラン)
  - [1. 背景・課題](#1-背景課題)
  - [2. アプローチ選定](#2-アプローチ選定)
    - [比較検討した選択肢](#比較検討した選択肢)
    - [採用：A案（軽量防衛）](#採用a案軽量防衛)
  - [3. 実装内容](#3-実装内容)
    - [3-1. `.claude/rules/workflow-guardrails.md`（新規作成）★核心](#3-1-clauderulesworkflow-guardrailsmd新規作成核心)
    - [3-2. 既存スキルの SKILL.md に `caller:` メタデータを追加](#3-2-既存スキルの-skillmd-に-caller-メタデータを追加)
    - [3-3. `CLAUDE.md` への参照追加（最小限）](#3-3-claudemd-への参照追加最小限)
  - [4. 対象ファイル一覧](#4-対象ファイル一覧)
  - [5. 検証方法](#5-検証方法)
  - [6. スコープ外（将来対応）](#6-スコープ外将来対応)


## 1. 背景・課題

このテンプレートはカスタムコマンド（`/add-feature`、`/plan-kaizen` など）を通じてSDD（仕様駆動開発）ワークフローを保証している。しかし**新しいスキルを直接呼び出すと**、以下の正規フローを迂回できてしまう：

- `.steering/[日付]-[機能名]/` の計画ファイル3点セット作成
- `tasklist.md` によるタスク管理
- 品質ゲート（lint / test / 実装検証 / UI検証）
- 振り返りの記録

**迂回リスクの主な経路:**
1. 「コードを書いて」と直接指示 → `.steering/` 計画ファイルなしで実装開始
2. 新規スキルを `Skill('xxx')` と直接呼ぶ → tasklist.md 管理・品質ゲートをスキップ
3. `src/` へ直接 Write → ステアリングファイルなし

---

## 2. アプローチ選定

### 比較検討した選択肢

| 選択肢 | 実現容易性 | 強制力 | テンプレート適合性 |
|--------|-----------|--------|-----------------|
| `.claude/rules/` へMD追加 | 高 | LLM依存 | 高（ポータブル） |
| `settings.json` hooks | 低 | シェル強制 | 低（環境依存） |
| スキルにメタデータ追加 | 高 | LLM依存 | 高 |
| CLAUDE.md 強化 | 高 | LLM依存 | 高 |

### 採用：A案（軽量防衛）

シェルhooksは環境依存（Windows/Linux差）・メンテコスト高のためテンプレートには不適。LLMへの命令設計で「計画立案段階で早期ブロック」するほうが実効性が高い。

- **`rules/`** ファイルは全会話に自動注入されるため、カスタムコマンドを使わないケースも含めて常時有効
- 主な脅威は「悪意ある迂回」ではなく「無知による迂回」であり、LLMが案内するだけで大半は防げる

---

## 3. 実装内容

### 3-1. `.claude/rules/workflow-guardrails.md`（新規作成）★核心

全会話にシステムプロンプトとして自動注入される常時有効なガードレールファイル。

**ルールA - 実装前の必須条件:**
- `src/` 以下にファイルを作成・編集する前に `.steering/[日付]-[機能名]/` ディレクトリと `requirements.md`、`design.md`、`tasklist.md` の3ファイルの存在を確認すること
- 存在しない場合は実装を開始せず、ユーザーに `/add-feature [機能名]` の実行を案内すること

**ルールB - スキルの直接呼び出し禁止:**
- 以下のスキルは対応コマンド経由でのみ呼び出すこと

  | スキル | 呼び出し元 |
  |--------|-----------|
  | `steering` | `/add-feature`, `/add-feature-ui`, `/resume-work` |
  | `testing` | `/add-feature`, `/add-feature-ui` |
  | `prd-writing`, `functional-design`, `architecture-design`, `repository-structure`, `development-guidelines`, `glossary-creation` | `/setup-project` |
  | `plan-kaizen` | `/plan-kaizen` コマンド |

- 例外（直接呼び出し可）: `playwright-cli`（汎用ブラウザ操作）

**ルールC - 新規スキル追加時のメタデータ義務:**
- 新しいスキルを追加する際は、`SKILL.md` の front matter に `caller:` フィールドで呼び出し元コマンドを記載すること
- 例: `caller: /add-feature` または `caller: 直接呼び出し可`

---

### 3-2. 既存スキルの SKILL.md に `caller:` メタデータを追加

各スキルの front matter（`---` で囲まれた YAML 部分）に以下を追加：

```yaml
caller: /add-feature, /add-feature-ui, /resume-work
context: 計画・実装・振り返りの各モードで /add-feature 内部から呼ばれる。直接呼び出し禁止。
```

対象スキル：

| スキル | SKILL.md パス | caller の値 |
|--------|--------------|------------|
| steering | `.claude/skills/steering/SKILL.md` | `/add-feature, /add-feature-ui, /resume-work` |
| testing | `.claude/skills/testing/SKILL.md` | `/add-feature, /add-feature-ui` |
| prd-writing | `.claude/skills/prd-writing/SKILL.md` | `/setup-project` |
| functional-design | `.claude/skills/functional-design/SKILL.md` | `/setup-project` |
| architecture-design | `.claude/skills/architecture-design/SKILL.md` | `/setup-project` |
| repository-structure | `.claude/skills/repository-structure/SKILL.md` | `/setup-project` |
| development-guidelines | `.claude/skills/development-guidelines/SKILL.md` | `/setup-project` |
| glossary-creation | `.claude/skills/glossary-creation/SKILL.md` | `/setup-project` |
| playwright-cli | `.claude/skills/playwright-cli/SKILL.md` | 直接呼び出し可（汎用ブラウザ操作） |
| plan-kaizen | `.claude/skills/plan-kaizen/SKILL.md` | `/plan-kaizen` |
| add-feature | `.claude/skills/add-feature/SKILL.md` | `/add-feature` |
| add-feature-ui | `.claude/skills/add-feature-ui/SKILL.md` | `/add-feature-ui` |
| resume-work | `.claude/skills/resume-work/SKILL.md` | `/resume-work` |
| review-docs | `.claude/skills/review-docs/SKILL.md` | `/review-docs` |

---

### 3-3. `CLAUDE.md` への参照追加（最小限）

「開発時の注意点」セクションに1行追加：

```
- スキルを直接呼び出してワークフローを迂回することは禁止。詳細は `.claude/rules/workflow-guardrails.md` を参照。
```

---

## 4. 対象ファイル一覧

| 操作 | ファイルパス |
|------|------------|
| 新規作成 | `.claude/rules/workflow-guardrails.md` |
| 編集 | `.claude/skills/steering/SKILL.md` |
| 編集 | `.claude/skills/testing/SKILL.md` |
| 編集 | `.claude/skills/prd-writing/SKILL.md` |
| 編集 | `.claude/skills/functional-design/SKILL.md` |
| 編集 | `.claude/skills/architecture-design/SKILL.md` |
| 編集 | `.claude/skills/repository-structure/SKILL.md` |
| 編集 | `.claude/skills/development-guidelines/SKILL.md` |
| 編集 | `.claude/skills/glossary-creation/SKILL.md` |
| 編集 | `.claude/skills/playwright-cli/SKILL.md` |
| 編集 | `CLAUDE.md` |

---

## 5. 検証方法

1. `.claude/rules/workflow-guardrails.md` が存在することを確認
2. 各 `SKILL.md` の front matter に `caller:` フィールドが追加されていることを確認
3. `CLAUDE.md` に参照行が追加されていることを確認
4. （動作確認）新しいセッションで「コードを書いて」と直接指示したとき、Claude が `.steering/` の存在確認を促すかどうかを確認

---

## 6. スコープ外（将来対応）

- `settings.json` の hooks によるシェルベースの物理的ブロック（環境が Unix 統一されている場合に検討）
- ワークフロー状態の可視化ダッシュボード
