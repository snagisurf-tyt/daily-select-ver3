// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * ローカルファイルアクセスのテスト
 *
 * このテストは、Playwrightがfile://プロトコルを通じてローカルHTMLファイルに正しくアクセスできることを確認します。
 */

test('ローカルHTMLファイルにアクセスできること', async ({ page }) => {
  // ローカルHTMLファイルにアクセス
  const filePath = 'file://' + path.resolve(__dirname, '../src/daily-select-ver3.html');
  await page.goto(filePath);

  // ページが正しくロードされたことを確認
  await expect(page).toHaveTitle('Daily Select 3');

  // カレンダーエレメントが存在することを確認
  const calendar = await page.locator('.calendar');
  await expect(calendar).toBeVisible();

  console.log('ローカルファイルへのアクセス成功');
});

test('カレンダーの基本要素が正しく表示されること', async ({ page }) => {
  // ローカルHTMLファイルにアクセス
  const filePath = 'file://' + path.resolve(__dirname, '../src/daily-select-ver3.html');
  await page.goto(filePath);

  // 時間ラベルが存在することを確認
  const timeLabels = await page.locator('.time-label').count();
  expect(timeLabels).toBeGreaterThan(0);

  // 日付カラムが存在することを確認
  const dayColumns = await page.locator('.day-column').count();
  expect(dayColumns).toBeGreaterThan(0);

  // スロットが存在することを確認
  const slots = await page.locator('.slot').count();
  expect(slots).toBeGreaterThan(0);

  console.log('カレンダーの基本要素が正しく表示されました');
});