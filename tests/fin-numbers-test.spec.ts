import { test, expect } from '@playwright/test';

  '#ts-rh-total-0'
  '#ts-nav-4'
  '#ts-nav-4-1'
  '#ts-filter-managingAgency'
  '#ts-filter-managingAgency-panel :text("COR3")'
  '#ts-total-allocated-amt'


test('Reconcile Home Page with Financial Summary', async ({ page }) => {
  page.setViewportSize({ width: 1700, height: 1080 });

  //goto https://www.recovery.pr
  await page.goto('https://www.recovery.pr/');

  //scroll down
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  //wait a second
  await page.waitForTimeout(1000);

  //grab the value of the element #ts-rh-total-0
  const tsRhTotal0 = await page.$('#ts-rh-total-0');
  expect(tsRhTotal0).toBeTruthy();
  //get the text content of the element
  const tsRhTotal0Text = await tsRhTotal0?.textContent();
  console.log('Home page allocated:', tsRhTotal0Text)

  //hover over #ts-nav-4
  await page.hover('#ts-nav-4');
  //click #ts-nav-4-1
  await page.click('#ts-nav-4-1');

  //click #ts-filter-managingAgency
  await page.click('#ts-filter-managingAgency');

  //click #ts-filter-managingAgency-panel :text("COR3")
  await page.click('#ts-filter-managingAgency-panel :text("COR3")');
  //wait 0.5 seconds
  await page.waitForTimeout(500);

  //grab the value of the element #ts-total-allocated-amt
  const tsTotalAllocatedAmt = await page.$('#ts-total-allocated-amt');
  expect(tsTotalAllocatedAmt).toBeTruthy();

  //get the text content of the element
  const tsTotalAllocatedAmtText = await tsTotalAllocatedAmt?.textContent();
  console.log('FS allocated:', tsTotalAllocatedAmtText)
  expect(tsTotalAllocatedAmtText).toBe(tsRhTotal0Text);


  //wait 2 seconds
  await page.waitForTimeout(2000);
})