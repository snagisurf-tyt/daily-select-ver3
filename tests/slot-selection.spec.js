// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * 選択セルの表示確認テスト
 *
 * このテストは、カレンダーのスロットが正しく表示されていること、
 * およびスロットを選択した際に選択状態が正しく反映されることを確認します。
 */

test.describe('選択セルの表示確認', () => {
  test.beforeEach(async ({ page }) => {
    // ローカルHTMLファイルにアクセス
    const filePath = 'file://' + path.resolve(__dirname, '../src/daily-select-ver3.html');
    await page.goto(filePath);

    // ページが正しくロードされたことを確認
    await expect(page).toHaveTitle('Daily Select 3');
  });

  test('カレンダーのスロットが正しく表示されていること', async ({ page }) => {
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
  });

  test('スロットを選択した際に選択状態が正しく反映されること', async ({ page }) => {
    // 最初のスロットを選択
    const firstSlot = page.locator('.slot').first();
    await firstSlot.click();

    // 選択状態になっていることを確認
    await expect(firstSlot).toHaveClass(/selected/);

    // selectedクラスを持っていることを明示的に確認
    const className = await firstSlot.getAttribute('class');
    console.log(`最初のスロットのクラス: ${className}`);
    expect(className).toContain('selected');

    // 選択解除
    await firstSlot.click();

    // 選択状態が解除されていることを確認
    await expect(firstSlot).not.toHaveClass(/selected/);

    // selectedクラスがなくなったことを明示的に確認
    const classNameAfter = await firstSlot.getAttribute('class');
    console.log(`選択解除後の最初のスロットのクラス: ${classNameAfter}`);
    expect(classNameAfter).not.toContain('selected');
  });

  test('複数のスロットを選択できること', async ({ page }) => {
    // 複数のスロットを選択
    const slots = page.locator('.slot');
    const slotCount = await slots.count();

    // 最大3つのスロットを選択（パフォーマンスのため）
    const selectCount = Math.min(3, slotCount);
    for (let i = 0; i < selectCount; i++) {
      const slot = slots.nth(i);
      await slot.click();

      // 選択状態になっていることを確認
      await expect(slot).toHaveClass(/selected/);
    }

    // 選択されたスロット数を確認
    const selectedSlots = page.locator('.slot.selected');
    const selectedCount = await selectedSlots.count();
    console.log(`選択されたスロット数: ${selectedCount}`);
    expect(selectedCount).toBe(selectCount);
  });
});