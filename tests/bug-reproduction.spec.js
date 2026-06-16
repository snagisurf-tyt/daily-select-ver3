// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * バグ「17時以降の縦の罫線が消えている」を再現確認するテストスクリプト
 *
 * このスクリプトは以下の手順でバグを確認します:
 * 1. ページにアクセスする
 * 2. 表示時間を日本の現地時間に合わせる（JST）
 * 3. 特定の時間（例：17:00以降）になっても縦の罫線が表示されているか確認する
 * 4. 罫線が消えていたらコンソールにエラーメッセージを出す
 */

test('バグ「17時以降の縦の罫線が消えている」の再現確認', async ({ page }) => {
  // 1. ページにアクセスする
  await page.goto('daily-select-ver3.html');

  // 2. 表示時間を日本の現地時間に合わせる（JST）
  // Playwrightではブラウザのタイムゾーンを直接設定することができませんが、
  // アプリケーション側でタイムゾーンを考慮していない場合、実行環境のタイムゾーンが使用されます。
  // 日本の環境で実行する前提です。

  // 3. 特定の時間（例：17:00以降）になっても縦の罫線が表示されているか確認する

  // カレンダーのスナップショットを取得
  const calendar = await page.locator('.calendar');
  await expect(calendar).toBeVisible();

  // 各時間帯の罫線（border）を確認
  const timeSlots = await page.locator('.slot').all();

  // 17:00以降のスロットを特定
  let hasMissingBorderAfter17 = false;

  // 時間ラベルを取得して17:00以降のスロットを確認
  const timeLabels = await page.locator('.time-label').all();

  for (let i = 0; i < timeLabels.length; i++) {
    const labelText = await timeLabels[i].textContent();

    // 17:00以降の場合
    if (labelText && (labelText.startsWith('17:') || labelText.startsWith('18:') || labelText.startsWith('19:') || labelText.startsWith('20:') || labelText.startsWith('21:'))) {
      // 各日の対応する時間スロットを確認
      const days = await page.locator('.day-column').all();

      for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        const slot = await days[dayIndex].locator('.slot').nth(i);

        // スロットが存在するか確認
        if (await slot.isVisible()) {
          // 罫線のスタイルを取得
          const borderBottom = await slot.evaluate(el => getComputedStyle(el).borderBottom);
          const borderTop = await slot.evaluate(el => getComputedStyle(el).borderTop);

          console.log(`時間 ${labelText}, 曜日 ${dayIndex+1}: 下罫線=${borderBottom}, 上罫線=${borderTop}`);

          // 罫線がない場合を検出（noneまたはtransparentなど）
          // ただし、21:00の最終スロットは例外として許可する
          if ((borderBottom.includes('0px') || borderBottom.includes('none') || borderBottom.includes('transparent')) && !labelText.startsWith('21:')) {
            console.error(`警告: 時間 ${labelText} のスロットに下罫線がありません`);
            hasMissingBorderAfter17 = true;
          }
        }
      }
    }
  }

  // 4. 罫線が消えていたらコンソールにエラーメッセージを出す
  if (hasMissingBorderAfter17) {
    console.error('エラー: バグを検出しました - 17時以降の縦の罫線が消えています');
    throw new Error('バグを検出しました - 17時以降の縦の罫線が消えています');
  } else {
    console.log('確認: 17時以降の罫線は正常に表示されています');
  }

  // ページ全体のスクリーンショットを取得して目視確認用に保存
  await page.screenshot({ path: 'artifacts/screenshots/calendar-full-view.png', fullPage: true });

  // 時間部分の詳細なスクリーンショットも取得
  await page.locator('.slots-container').screenshot({ path: 'artifacts/screenshots/time-slots-detail.png' });
});

/**
 * 追加のテスト: CSSグリッドの確認
 * 罫線がCSSのgrid-template-columnsなどで実装されている可能性があるため、その確認も行う
 */
test('CSSグリッド構造の確認', async ({ page }) => {
  await page.goto('daily-select-ver3.html');

  // カレンダーのグリッド構造を確認
  const daysContainer = await page.locator('.days-container');
  const displayStyle = await daysContainer.evaluate(el => getComputedStyle(el).display);
  const gridTemplateColumns = await daysContainer.evaluate(el => getComputedStyle(el).gridTemplateColumns);

  console.log(`days-containerのdisplayプロパティ: ${displayStyle}`);
  console.log(`days-containerのgrid-template-columns: ${gridTemplateColumns}`);

  // flexレイアウトであることを確認
  expect(displayStyle).toBe('flex');

  // 各日付カラムの確認
  const dayColumns = await page.locator('.day-column').all();
  console.log(`日付カラム数: ${dayColumns.length}`);

  for (let i = 0; i < dayColumns.length; i++) {
    const flexProperty = await dayColumns[i].evaluate(el => getComputedStyle(el).flex);
    const borderRight = await dayColumns[i].evaluate(el => getComputedStyle(el).borderRight);

    console.log(`日付カラム ${i+1} のflexプロパティ: ${flexProperty}`);
    console.log(`日付カラム ${i+1} の右罫線: ${borderRight}`);
  }
});