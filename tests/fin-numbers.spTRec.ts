import { test, expect } from '@playwright/test';

test('Reconcile Home Page with Financial Summary', async ({ page }) => {
  page.setViewportSize({ width: 1700, height: 1080 });
  await page.goto('https://www.recovery.pr/en');
  //scroll down to trigger the load of the rest of the page
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(1000);

  //Get the allocated amount from the home page
  const hpAllocated=await page.$eval('#ts-rh-total-0',(el)=>el.textContent);
  expect(hpAllocated).toBeTruthy();
  const hpAllocatedNum = toNumber(hpAllocated);
  console.log('Home page allocated:', hpAllocatedNum);

  //Now navigate to Financial summary
  await page.hover('#ts-nav-4');
  await page.click('#ts-nav-4-1');
  await page.waitForTimeout(1000);

  //select COR3 from the managing agency dropdown
  await page.locator('#ts-filter-managingAgency').click();
  await page.click('#ts-filter-managingAgency-panel :text("COR3")');
  await page.waitForTimeout(1000);
  const fsAllocated = await page.$eval('#ts-total-allocated-amt', (el) => el.textContent);
  expect(fsAllocated).toBeTruthy();
  const fsAllocatedNum = toNumber(fsAllocated);
  expect(fsAllocatedNum).toBe(hpAllocatedNum);

  function toNumber(str: string | null) {
    return Number(str?.replace(/[^0-9.-]+/g, ''));
  }

});
