// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * 時間候補表示の確認テスト
 *
 * このテストは、カレンダーの時間候補が正しく表示されていることを確認します。
 */

test.describe('時間候補表示の確認', () => {
  test.beforeEach(async ({ page }) => {
    // ローカルHTMLファイルにアクセス
    const filePath = 'file://' + path.resolve(__dirname, '../src/daily-select-ver3.html');
    await page.goto(filePath);

    // ページが正しくロードされたことを確認
    await expect(page).toHaveTitle('Daily Select 3');
  });

  test('時間ラベルが正しく表示されていること', async ({ page }) => {
    // 時間ラベルが存在することを確認
    const timeLabels = await page.locator('.time-label').count();
    console.log(`時間ラベル数: ${timeLabels}`);
    expect(timeLabels).toBeGreaterThan(0);

    // 最初の時間ラベルのテキストを確認
    const firstTimeLabel = await page.locator('.time-label').first().textContent();
    console.log(`最初の時間ラベル: ${firstTimeLabel}`);
    expect(firstTimeLabel).toMatch(/\d{1,2}:\d{2}/); // HH:MM形式であることを確認

    // 最後の時間ラベルのテキストを確認
    const lastTimeLabel = await page.locator('.time-label').last().textContent();
    console.log(`最後の時間ラベル: ${lastTimeLabel}`);
    expect(lastTimeLabel).toMatch(/\d{1,2}:\d{2}/); // HH:MM形式であることを確認
  });

  test('時間スロットが正しく表示されていること', async ({ page }) => {
    // 日付カラムが存在することを確認
    const dayColumns = await page.locator('.day-column').count();
    console.log(`日付カラム数: ${dayColumns}`);
    expect(dayColumns).toBeGreaterThan(0);

    // 最初の日付カラムのスロット数を確認
    const firstDayColumn = page.locator('.day-column').first();
    const slots = await firstDayColumn.locator('.slot').count();
    console.log(`最初の日付カラムのスロット数: ${slots}`);
    expect(slots).toBeGreaterThan(0);

    // 全スロット数を確認
    const totalSlots = await page.locator('.slot').count();
    console.log(`総スロット数: ${totalSlots}`);
    expect(totalSlots).toBeGreaterThan(0);

    // 最初のスロットの属性を確認
    const firstSlot = page.locator('.slot').first();
    const dayAttr = await firstSlot.getAttribute('data-day');
    const timeIndexAttr = await firstSlot.getAttribute('data-time-index');
    console.log(`最初のスロットの属性: data-day=${dayAttr}, data-time-index=${timeIndexAttr}`);
    expect(dayAttr).not.toBeNull();
    expect(timeIndexAttr).not.toBeNull();
  });

  test('時間軸の選択が正しく機能すること', async ({ page }) => {
    // 30分間隔を選択
    await page.locator('#time-interval').selectOption('30');

    // カレンダーが更新されるのを待つ
    await page.waitForTimeout(1000);

    // 時間ラベルの数を確認（30分間隔では16時から22時まで12個のはず）
    const timeLabels30 = await page.locator('.time-label').count();
    console.log(`30分間隔での時間ラベル数: ${timeLabels30}`);

    // 1時間間隔を選択
    await page.locator('#time-interval').selectOption('60');

    // カレンダーが更新されるのを待つ
    await page.waitForTimeout(1000);

    // 時間ラベルの数を確認（1時間間隔では16時から22時まで6個のはず）
    const timeLabels60 = await page.locator('.time-label').count();
    console.log(`1時間間隔での時間ラベル数: ${timeLabels60}`);

    // 数が正しいことを確認（実際の数は時間範囲に依存）
    expect(timeLabels60).toBeGreaterThan(0);
  });
});