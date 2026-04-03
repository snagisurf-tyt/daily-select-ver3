/**
 * auto-add-feature-with-plan / auto-add-feature-ui-with-plan コマンドファイルの構造バリデーション
 *
 * このスペックは Claude Code テンプレートリポジトリ用のファイル構造検証スクリプトです。
 * 実行: node tests/e2e/auto-add-feature-commands.spec.js
 *
 * ブラウザ E2E テストではなく、コマンドファイルの構造をプログラムで検証します。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const COMMANDS_DIR = path.join(ROOT, '.claude', 'commands');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ ${message}`);
    failed++;
  }
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

// --- テスト: auto-add-feature-with-plan.md ---

console.log('\n📋 auto-add-feature-with-plan.md の検証');

const withPlanPath = path.join(COMMANDS_DIR, 'auto-add-feature-with-plan.md');
const withPlanContent = readFileSafe(withPlanPath);

assert(withPlanContent !== null, 'ファイルが存在すること');

if (withPlanContent) {
  assert(
    withPlanContent.includes('description:'),
    'frontmatter に description: が含まれていること'
  );

  assert(
    withPlanContent.includes('フェーズ1') || withPlanContent.includes('Phase 1'),
    '引数解析フェーズが含まれていること'
  );

  assert(
    withPlanContent.includes('plan-kaizen') || withPlanContent.includes('仕様策定'),
    '仕様策定フェーズが含まれていること'
  );

  assert(
    withPlanContent.includes('中間 git') || withPlanContent.includes('git commit'),
    '中間 git コミットフェーズが含まれていること'
  );

  assert(
    withPlanContent.includes("Skill('add-feature')"),
    "Skill('add-feature') の着火が含まれていること"
  );

  assert(
    withPlanContent.includes('Skill(\'add-feature-ui\')') === false,
    'add-feature-ui を使用していないこと（add-feature のみ使用）'
  );

  assert(
    withPlanContent.includes('git push') || withPlanContent.includes('Push'),
    '最終 push フェーズが含まれていること'
  );

  assert(
    withPlanContent.includes('#123') || withPlanContent.includes('Issue 番号'),
    'GitHub Issue 番号形式の説明が含まれていること'
  );

  assert(
    withPlanContent.includes('https://github.com') || withPlanContent.includes('Issue URL'),
    'GitHub Issue URL 形式の説明が含まれていること'
  );

  assert(
    withPlanContent.includes('.env') || withPlanContent.includes('センシティブ'),
    'センシティブファイル除外の記述が含まれていること'
  );
}

// --- テスト: auto-add-feature-ui-with-plan.md ---

console.log('\n📋 auto-add-feature-ui-with-plan.md の検証');

const withPlanUiPath = path.join(COMMANDS_DIR, 'auto-add-feature-ui-with-plan.md');
const withPlanUiContent = readFileSafe(withPlanUiPath);

assert(withPlanUiContent !== null, 'ファイルが存在すること');

if (withPlanUiContent) {
  assert(
    withPlanUiContent.includes('description:'),
    'frontmatter に description: が含まれていること'
  );

  assert(
    withPlanUiContent.includes('フェーズ1') || withPlanUiContent.includes('Phase 1'),
    '引数解析フェーズが含まれていること'
  );

  assert(
    withPlanUiContent.includes('plan-kaizen') || withPlanUiContent.includes('仕様策定'),
    '仕様策定フェーズが含まれていること'
  );

  assert(
    withPlanUiContent.includes('中間 git') || withPlanUiContent.includes('git commit'),
    '中間 git コミットフェーズが含まれていること'
  );

  assert(
    withPlanUiContent.includes("Skill('add-feature-ui')"),
    "Skill('add-feature-ui') の着火が含まれていること"
  );

  assert(
    withPlanUiContent.includes('E2E') || withPlanUiContent.includes('e2e'),
    'E2E テストへの言及が含まれていること'
  );

  assert(
    withPlanUiContent.includes('git push') || withPlanUiContent.includes('Push'),
    '最終 push フェーズが含まれていること'
  );

  assert(
    withPlanUiContent.includes('#123') || withPlanUiContent.includes('Issue 番号'),
    'GitHub Issue 番号形式の説明が含まれていること'
  );

  assert(
    withPlanUiContent.includes('https://github.com') || withPlanUiContent.includes('Issue URL'),
    'GitHub Issue URL 形式の説明が含まれていること'
  );

  assert(
    withPlanUiContent.includes('.env') || withPlanUiContent.includes('センシティブ'),
    'センシティブファイル除外の記述が含まれていること'
  );
}

// --- テスト: CLAUDE.md への追記 ---

console.log('\n📋 CLAUDE.md の検証');

const claudeMdPath = path.join(ROOT, 'CLAUDE.md');
const claudeMdContent = readFileSafe(claudeMdPath);

assert(claudeMdContent !== null, 'CLAUDE.md が存在すること');

if (claudeMdContent) {
  assert(
    claudeMdContent.includes('auto-add-feature-with-plan'),
    'CLAUDE.md に auto-add-feature-with-plan の記述があること'
  );

  assert(
    claudeMdContent.includes('auto-add-feature-ui-with-plan'),
    'CLAUDE.md に auto-add-feature-ui-with-plan の記述があること'
  );
}

// --- 結果サマリー ---

console.log(`\n${'='.repeat(50)}`);
console.log(`結果: ${passed} 件パス / ${failed} 件失敗 / 合計 ${passed + failed} 件`);

if (failed > 0) {
  console.error('❌ バリデーション失敗');
  process.exit(1);
} else {
  console.log('✅ 全バリデーション通過');
  process.exit(0);
}
