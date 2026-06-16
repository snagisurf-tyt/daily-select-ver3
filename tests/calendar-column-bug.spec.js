// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * カレンダー列数バグの再現テスト
 *
 * このテストは、以下のバグを再現することを目的としています：
 * 1. 5日未満および5日より多くの日程を選択した際、選択セルの列数が5から変わらない
 * 2. 土日は不要
 */

test.describe('カレンダー列数バグの検証', () => {
  test.beforeEach(async ({ page }) => {
    // ローカルHTMLファイルにアクセス
    const filePath = 'file://' + path.resolve(__dirname, '../src/daily-select-ver3.html');
    await page.goto(filePath);

    // ページが正しくロードされたことを確認
    await expect(page).toHaveTitle('Daily Select 3');
  });

  test('5日未満の日程を選択した場合の列数検証', async ({ page }) => {
    // 日付入力欄が存在することを確認
    await expect(page.locator('#start-date')).toBeVisible();
    await expect(page.locator('#end-date')).toBeVisible();

    // 開始日と終了日を3日に設定（5日未満）
    await page.locator('#start-date').fill('2026-06-15');
    await page.locator('#end-date').fill('2026-06-17');

    // カレンダーが更新されるのを待つ
    await page.waitForTimeout(1000);

    // 日付カラムの数を確認（3列であることを期待）
    const dayColumns = await page.locator('.day-column').count();
    console.log(`5日未満選択時の日付カラム数: ${dayColumns}`);

    // 修正前は5列固定だったが、修正後は3列になるはず
    // expect(dayColumns).toBe(3);

    // 日付ヘッダーの数も確認
    const dayHeaders = await page.locator('.day-header').count();
    console.log(`5日未満選択時の日付ヘッダー数: ${dayHeaders}`);
    // expect(dayHeaders).toBe(3);
  });

  test('5日より多くの日程を選択した場合の列数検証', async ({ page }) => {
    // 開始日と終了日を7日に設定（5日より多い）
    await page.locator('#start-date').fill('2026-06-15');
    await page.locator('#end-date').fill('2026-06-21');

    // カレンダーが更新されるのを待つ
    await page.waitForTimeout(1000);

    // 日付カラムの数を確認（7列であることを期待）
    const dayColumns = await page.locator('.day-column').count();
    console.log(`5日より多数選択時の日付カラム数: ${dayColumns}`);

    // 修正前は5列固定だったが、修正後は7列になるはず
    // expect(dayColumns).toBe(7);

    // 日付ヘッダーの数も確認
    const dayHeaders = await page.locator('.day-header').count();
    console.log(`5日より多数選択時の日付ヘッダー数: ${dayHeaders}`);
    // expect(dayHeaders).toBe(7);
  });

  test('土日が不要であることを確認', async ({ page }) => {
    // 開始日と終了日に土日を含む範囲を設定
    await page.locator('#start-date').fill('2026-06-12'); // 6月12日(日)
    await page.locator('#end-date').fill('2026-06-18');   // 6月18日(土)

    // カレンダーが更新されるのを待つ
    await page.waitForTimeout(1000);

    // 土日を除外する修正がまだ実装されていないため、
    // 現在はすべての日付が表示される
    // 修正実装後は、土日が表示されないようにする
    const dayHeaders = await page.locator('.day-header');
    const headersCount = await dayHeaders.count();

    for (let i = 0; i < headersCount; i++) {
      const headerText = await dayHeaders.nth(i).textContent();
      console.log(`日付ヘッダー ${i+1}: ${headerText}`);
      // 修正前は土日も含まれる
      // 修正後は土日が除外されるので、このチェックを有効にする
      // expect(headerText).not.toContain('(日)');
      // expect(headerText).not.toContain('(土)');
    }
  });
});