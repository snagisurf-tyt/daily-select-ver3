# リポジトリ構造定義書 (Repository Structure Document)

## プロジェクト構造

```
daily-select-ver3.0/
├── docs/                  # プロジェクトドキュメント
│   ├── adr/               # アーキテクチャ意思決定記録
│   ├── ideas/             # アイデアメモ・仕様書
│   └── screenshots/       # README用スクリーンショット
├── src/                   # ソースコード（単一HTMLファイル）
├── tests/                 # テストコード
│   ├── unit/              # ユニットテスト
│   ├── integration/       # 統合テスト
│   └── e2e/               # E2Eテスト
├── artifacts/             # 開発中のアーティファクト
│   └── screenshots/       # Playwrightスクリーンショット
├── .claude/               # Claude Code設定
│   ├── skills/            # タスクモード別スキル
│   ├── agents/            # サブエージェント定義
│   ├── commands/          # カスタムコマンド
│   └── docs/              # Claude用ガイドライン
├── .steering/             # ステアリングファイル
└── README.md              # プロジェクトREADME
```

## ディレクトリ詳細

### src/ (ソースコードディレクトリ)

#### daily-select.html

**役割**: アプリケーションの唯一のエントリーポイントとなる単一HTMLファイル。すべてのHTML、CSS、JavaScriptを含む。

**配置ファイル**:
- `daily-select.html`: アプリケーションのすべてのコードを含む単一ファイル

**命名規則**:
- ファイル名: kebab-case
- ID・クラス名: BEM記法またはsemantic naming
- JavaScript変数・関数: camelCase
- 定数: UPPER_SNAKE_CASE

**依存関係**:
- 依存可能: なし（すべて自己完結）
- 依存禁止: 外部CDN、npmパッケージ

**例**:
```
src/
└── daily-select.html
```

### tests/ (テストディレクトリ)

#### unit/

**役割**: ユニットテストの配置（各機能モジュール単位）

**構造**:
```
tests/unit/
├── date-manager.test.js      # DateManagerのテスト
├── schedule-manager.test.js  # ScheduleManagerのテスト
└── ui-manager.test.js        # UIManagerのテスト
```

**命名規則**:
- パターン: `[テスト対象ファイル名].test.js`
- 例: `date-manager.js` → `date-manager.test.js`

#### integration/

**役割**: 統合テストの配置（UIとロジックの結合テスト）

**構造**:
```
tests/integration/
├── schedule-workflow.test.js    # スケジュール作成フロー
└── participant-workflow.test.js # 参加者登録フロー
```

#### e2e/

**役割**: E2Eテストの配置（ブラウザ上のユーザー操作フロー）

**構造**:
```
tests/e2e/
├── creator-workflow.test.js  # 作成者フロー（作成→共有）
└── participant-workflow.test.js # 参加者フロー（空き時間登録）
```

### docs/ (ドキュメントディレクトリ)

**配置ドキュメント**:
- `product-requirements.md`: プロダクト要求定義書
- `functional-design.md`: 機能設計書
- `architecture.md`: アーキテクチャ設計書
- `repository-structure.md`: リポジトリ構造定義書(本ドキュメント)
- `development-guidelines.md`: 開発ガイドライン
- `glossary.md`: 用語集
- `adr/`: アーキテクチャ意思決定記録
- `ideas/`: アイデアメモ・仕様書
- `screenshots/`: README用スクリーンショット

### artifacts/ (開発アーティファクトディレクトリ)

#### screenshots/

**役割**: Playwrightによる開発中のスクリーンショット保存場所

**構造**:
```
artifacts/screenshots/
├── test-case-1.png
└── test-case-2.png
```

## ファイル配置規則

### ソースファイル

| ファイル種別 | 配置先 | 命名規則 | 例 |
|------------|--------|---------|-----|
| アプリケーションファイル | src/ | kebab-case | daily-select.html |
| テストファイル | tests/配下の各ディレクトリ | [対象].test.js | date-manager.test.js |

### テストファイル

| テスト種別 | 配置先 | 命名規則 | 例 |
|-----------|--------|---------|-----|
| ユニットテスト | tests/unit/ | [対象].test.js | schedule-manager.test.js |
| 統合テスト | tests/integration/ | [機能].test.js | schedule-workflow.test.js |
| E2Eテスト | tests/e2e/ | [シナリオ].test.js | creator-workflow.test.js |

### ドキュメントファイル

| ファイル種別 | 配置先 | 命名規則 |
|------------|--------|---------|
| 要件定義書 | docs/ | kebab-case |
| 設計書 | docs/ | kebab-case |
| ADR | docs/adr/ | NNNN-title.md |
| 仕様書 | docs/ideas/ | YYYYMMDD-title.md |

## 命名規則

### ディレクトリ名

- **ルートディレクトリ**: kebab-case
  - 例: `daily-select-ver3.0/`
- **カテゴリディレクトリ**: 単数形、kebab-case
  - 例: `docs/`, `src/`, `tests/`

### ファイル名

- **HTMLファイル**: kebab-case
  - 例: `daily-select.html`
- **ドキュメントファイル**: kebab-case
  - 例: `product-requirements.md`
- **テストファイル**: [対象].test.js
  - 例: `schedule-manager.test.js`
- **ADRファイル**: NNNN-title.md
  - 例: `0001-vanilla-js-frontend.md`

### IDとクラス名（HTML内）

- **ID**: camelCase
  - 例: `scheduleCreator`
- **クラス**: BEM記法またはsemantic naming
  - 例: `calendar-view`, `time-slot--available`

## 依存関係のルール

### レイヤー間の依存

```
UIプレゼンテーション層
    ↓ (OK)
アプリケーションロジック層
    ↓ (OK)
データマネジメント層
```

**禁止される依存**:
- データマネジメント層 → アプリケーションロジック層 (❌)
- データマネジメント層 → UIプレゼンテーション層 (❌)
- アプリケーションロジック層 → UIプレゼンテーション層 (❌)

注: 実際には単一ファイル構成のため、レイヤー分離は論理的なものであり、実際の依存関係の制御は名前空間やモジュールパターンで実現する。

### 内部依存

**外部依存の禁止**:
```html
<!-- ❌ 悪い例: 外部CDNの使用 -->
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>

<!-- ✅ 良い例: すべて自己完結 -->
<script>
// すべてのJavaScriptコードがこのスクリプトタグ内にある
</script>
```

## スケーリング戦略

### 機能の追加

新しい機能を追加する際の配置方針:

1. **小規模機能**: 単一HTMLファイル内に追加
2. **中規模機能**: 名前空間またはモジュールパターンで整理
3. **大規模機能**: 単一ファイルの維持が困難な場合は、開発の一時的なマルチファイル構成を検討

**例**:
```javascript
// 小規模機能: そのまま追加
function newFeature() { /* ... */ }

// 中規模機能: 名前空間で整理
const ExportModule = {
  toCSV() { /* ... */ },
  toImage() { /* ... */ }
};
```

### ファイルサイズの管理

**ファイル分割の目安**:
- 1ファイル: 100KB以下を推奨
- 100-200KB: リファクタリングを検討
- 200KB以上: より細かなモジュール化を検討

**分割方法（単一ファイル制約下）**:
```javascript
// 良い例: 論理的なセパレーションとコメントで整理
/* ===============================
   Date Management Module
   =============================== */
class DateManager { /* ... */ }

/* ===============================
   Schedule Management Module
   =============================== */
class ScheduleManager { /* ... */ }

/* ===============================
   UI Management Module
   =============================== */
class UIManager { /* ... */ }
```

## 特殊ディレクトリ

### .steering/ (ステアリングファイル)

**役割**: 特定の開発作業における「今回何をするか」を定義

**構造**:
```
.steering/
└── YYYYMMDD-[task-name]/
    ├── requirements.md      # 今回の作業の要求内容
    ├── design.md            # 変更内容の設計
    └── tasklist.md          # タスクリスト
```

**命名規則**: `20260615-add-sharing-feature` 形式

### .claude/ (Claude Code設定)

**役割**: Claude Code設定とカスタマイズ

**構造**:
```
.claude/
├── skills/                  # タスクモード別スキル
├── agents/                  # サブエージェント定義
├── commands/                # カスタムコマンド
└── docs/                    # Claude用ガイドライン
```

### docs/ideas/ (アイデア・仕様書)

**役割**: 開発過程で作成されたアイデアメモや仕様書の保管場所

**構造**:
```
docs/ideas/
├── 20260615-initial-concept.md
└── 20260615-detailed-spec.md
```

## 除外設定

### .gitignore

プロジェクトで除外すべきファイル:
- `node_modules/`
- `.env`
- `.steering/` (タスク管理用の一時ファイル)
- `*.log`
- `.DS_Store`
- `artifacts/` (開発中のアーティファクト)
- `coverage/` (テストカバレッジレポート)

### .prettierignore, .eslintignore

ツールで除外すべきファイル:
- `.steering/`
- `artifacts/`
- `coverage/`