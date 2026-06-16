# 開発ガイドライン (Development Guidelines)

## コーディング規約

### 命名規則

#### 変数・関数

**JavaScript (Daily Selectアプリケーション)**:
```javascript
// ✅ 良い例
const userProfileData = fetchUserProfile();
function calculateTotalPrice(items) { }

// ❌ 悪い例
const data = fetch();
function calc(arr) { }
```

**原則**:
- 変数: camelCase、名詞または名詞句
- 関数: camelCase、動詞で始める
- 定数: UPPER_SNAKE_CASE
- Boolean: `is`, `has`, `should`で始める

#### クラス・オブジェクト

```javascript
// クラス/コンストラクタ関数: PascalCase、名詞
class TaskManager { }
function UserAuthenticationService() { }

// オブジェクト: camelCase、名詞
const taskRepository = {
  save() { },
  findById() { }
};

// 型エイリアス/定数: UPPER_SNAKE_CASE
const TASK_STATUS = ['todo', 'in_progress', 'completed'];
```

### コードフォーマット

**インデント**: 2スペース

**行の長さ**: 最大100文字

**例**:
```javascript
// JavaScript コードフォーマット例
function processScheduleData(scheduleData, options = {}) {
  if (!scheduleData || scheduleData.length === 0) {
    console.warn('スケジュールデータが空です');
    return [];
  }

  return scheduleData.map(item => ({
    id: item.id,
    title: item.title,
    dateRange: {
      start: new Date(item.startDate),
      end: new Date(item.endDate)
    }
  })).filter(item => item.dateRange.start <= item.dateRange.end);
}
```

### コメント規約

**関数・クラスのドキュメント**:
```javascript
/**
 * スケジュールの合計数を計算する
 *
 * @param {Array} schedules - 計算対象のスケジュール配列
 * @param {Object} [filter] - フィルター条件(オプション)
 * @returns {number} スケジュールの合計数
 * @throws {ValidationError} スケジュール配列が不正な場合
 */
function countSchedules(schedules, filter) {
  // 実装
}
```

**インラインコメント**:
```javascript
// ✅ 良い例: なぜそうするかを説明
// キャッシュを無効化して、最新データを取得
cache.clear();

// ❌ 悪い例: 何をしているか(コードを見れば分かる)
// キャッシュをクリアする
cache.clear();
```

### エラーハンドリング

**原則**:
- 予期されるエラー: 適切なエラーメッセージを定義
- 予期しないエラー: 上位に伝播
- エラーを無視しない

**例**:
```javascript
// エラーメッセージ定義
const ERROR_MESSAGES = {
  VALIDATION_ERROR: '入力値が不正です',
  NOT_FOUND: 'データが見つかりません',
  STORAGE_LIMIT: 'ストレージ容量が不足しています'
};

// エラーハンドリング
try {
  const schedule = await scheduleService.create(data);
} catch (error) {
  if (error.type === 'VALIDATION_ERROR') {
    console.error(`検証エラー: ${error.message}`);
    // ユーザーにフィードバック
  } else {
    console.error('予期しないエラー:', error);
    throw error; // 上位に伝播
  }
}
```

## Git運用ルール

### ブランチ戦略

**ブランチ種別**:
- `main`: 本番環境にデプロイ可能な状態
- `develop`: 開発の最新状態
- `feature/[機能名]`: 新機能開発
- `fix/[修正内容]`: バグ修正
- `refactor/[対象]`: リファクタリング

**フロー**:
```
main
  └─ develop
      ├─ feature/schedule-management
      ├─ feature/user-interface
      └─ fix/schedule-validation
```

### コミットメッセージ規約

**フォーマット**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: コードフォーマット
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルド、補助ツール等

**例**:
```
feat(schedule): スケジュールの優先度設定機能を追加

ユーザーがスケジュールに優先度(高/中/低)を設定できるようにしました。
- Scheduleモデルにpriorityフィールドを追加
- UIに優先度選択を追加
- 優先度によるソート機能を実装

Closes #123
```

### プルリクエストプロセス

**作成前のチェック**:
- [ ] 全てのテストがパス
- [ ] 手動テスト実施
- [ ] 競合が解決されている

**PRテンプレート**:
```markdown
## 概要
[変更内容の簡潔な説明]

## 変更理由
[なぜこの変更が必要か]

## 変更内容
- [変更点1]
- [変更点2]

## テスト
- [ ] ユニットテスト追加
- [ ] 手動テスト実施

## スクリーンショット(該当する場合)
[画像]

## 関連Issue
Closes #[Issue番号]
```

**レビュープロセス**:
1. セルフレビュー
2. 自動テスト実行
3. レビュアーアサイン
4. レビューフィードバック対応
5. 承認後マージ

## テスト戦略

### テストの種類

#### ユニットテスト

**対象**: 個別の関数・クラス

**カバレッジ目標**: 80%

**例**:
```javascript
describe('ScheduleService', () => {
  describe('create', () => {
    it('正常なデータでスケジュールを作成できる', async () => {
      const service = new ScheduleService(mockRepository);
      const schedule = await service.create({
        title: 'テストスケジュール',
        description: '説明',
      });

      expect(schedule.id).toBeDefined();
      expect(schedule.title).toBe('テストスケジュール');
    });

    it('タイトルが空の場合ValidationErrorをスローする', async () => {
      const service = new ScheduleService(mockRepository);

      await expect(
        service.create({ title: '' })
      ).rejects.toThrow(Error);
    });
  });
});
```

#### 統合テスト

**対象**: 複数コンポーネントの連携

**例**:
```javascript
describe('Schedule CRUD', () => {
  it('スケジュールの作成・取得・更新・削除ができる', async () => {
    // 作成
    const created = await scheduleService.create({ title: 'テスト' });

    // 取得
    const found = await scheduleService.findById(created.id);
    expect(found?.title).toBe('テスト');

    // 更新
    await scheduleService.update(created.id, { title: '更新後' });
    const updated = await scheduleService.findById(created.id);
    expect(updated?.title).toBe('更新後');

    // 削除
    await scheduleService.delete(created.id);
    const deleted = await scheduleService.findById(created.id);
    expect(deleted).toBeNull();
  });
});
```

#### E2Eテスト

**対象**: ユーザーシナリオ全体

**例**:
```javascript
describe('スケジュール管理フロー', () => {
  it('ユーザーがスケジュールを追加して共有できる', async () => {
    // スケジュール追加
    await page.fill('#schedule-title', '新しいスケジュール');
    await page.click('#add-schedule-button');
    expect(await page.textContent('.success-message')).toContain('スケジュールを追加しました');

    // スケジュール一覧表示
    await page.click('#list-tab');
    expect(await page.textContent('.schedule-list')).toContain('新しいスケジュール');

    // 共有リンク生成
    await page.click('#share-button');
    expect(await page.inputValue('#share-link')).toBeTruthy();
  });
});
```

### テスト命名規則

**パターン**: `[対象]_[条件]_[期待結果]`

**例**:
```javascript
// ✅ 良い例
it('create_emptyTitle_throwsValidationError', () => { });
it('findById_existingId_returnsSchedule', () => { });
it('delete_nonExistentId_throwsNotFoundError', () => { });

// ❌ 悪い例
it('test1', () => { });
it('works', () => { });
it('should work correctly', () => { });
```

### モック・スタブの使用

**原則**:
- 外部依存(LocalStorage、Clipboard API)はモック化
- ビジネスロジックは実装を使用

**例**:
```javascript
// LocalStorageをモック化
const mockLocalStorage = {
  storage: {},
  getItem: jest.fn(function(key) { return this.storage[key] || null; }),
  setItem: jest.fn(function(key, value) { this.storage[key] = value; }),
  removeItem: jest.fn(function(key) { delete this.storage[key]; }),
  clear: jest.fn(function() { this.storage = {}; })
};

// サービスは実際の実装を使用
const service = new ScheduleService(mockLocalStorage);
```

## コードレビュー基準

### レビューポイント

**機能性**:
- [ ] 要件を満たしているか
- [ ] エッジケースが考慮されているか
- [ ] エラーハンドリングが適切か

**可読性**:
- [ ] 命名が明確か
- [ ] コメントが適切か
- [ ] 複雑なロジックが説明されているか

**保守性**:
- [ ] 重複コードがないか
- [ ] 責務が明確に分離されているか
- [ ] 変更の影響範囲が限定的か

**パフォーマンス**:
- [ ] 不要な計算がないか
- [ ] メモリリークの可能性がないか
- [ ] LocalStorageアクセスが最適化されているか

**セキュリティ**:
- [ ] 入力検証が適切か
- [ ] 機密情報がハードコードされていないか
- [ ] XSS対策が実装されているか

### レビューコメントの書き方

**建設的なフィードバック**:
```markdown
## ✅ 良い例
この実装だと、スケジュール数が増えた時にパフォーマンスが劣化する可能性があります。
代わりに、インデックスを使った検索を検討してはどうでしょうか？

## ❌ 悪い例
この書き方は良くないです。
```

**優先度の明示**:
- `[必須]`: 修正必須
- `[推奨]`: 修正推奨
- `[提案]`: 検討してほしい
- `[質問]`: 理解のための質問

## 開発環境セットアップ

### 必要なツール

| ツール | バージョン | インストール方法 |
|--------|-----------|-----------------|
| Node.js | 24.x LTS | https://nodejs.org からインストール |
| npm | 10.x以上 | Node.js同梱 |
| Git | 最新版 | https://git-scm.com からインストール |

### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone [URL]
cd daily-select-ver3.0

# 2. 依存関係のインストール
npm install

# 3. 開発サーバーの起動
npm run dev
```

### 推奨開発ツール

- **Visual Studio Code**: 拡張機能(TypeScript、ESLint、Prettier)で快適な開発環境
- **Chrome DevTools**: JavaScriptデバッグとパフォーマンス分析
- **Lighthouse**: アクセシビリティとパフォーマンスの評価