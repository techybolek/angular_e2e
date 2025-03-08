import { test, expect, Page } from '@playwright/test';

interface FinancialAmounts {
  allocated: number;
  obligated: number;
  disbursed: number;
}

class FinancialTestHelper {
  constructor(private page: Page) {}

  private toNumber(str: string | null): number {
    return Number(str?.replace(/[^0-9.-]+/g, ''));
  }

  async getHomePageAmounts(startIndex: number): Promise<FinancialAmounts> {
    const allocated = await this.page.$eval(`#ts-rh-total-${startIndex}`, (el) => el.textContent);
    const obligated = await this.page.$eval(`#ts-rh-total-${startIndex + 1}`, (el) => el.textContent);
    const disbursed = await this.page.$eval(`#ts-rh-total-${startIndex + 2}`, (el) => el.textContent);

    expect(allocated).toBeTruthy();
    expect(obligated).toBeTruthy();
    expect(disbursed).toBeTruthy();

    return {
      allocated: this.toNumber(allocated),
      obligated: this.toNumber(obligated),
      disbursed: this.toNumber(disbursed)
    };
  }

  async getFinancialSummaryAmounts(): Promise<FinancialAmounts> {
    const allocated = await this.page.$eval('#ts-total-allocated-amt', (el) => el.textContent);
    const obligated = await this.page.$eval('#ts-total-obligated-amt', (el) => el.textContent);
    const disbursed = await this.page.$eval('#ts-total-disbursed-amt', (el) => el.textContent);

    expect(allocated).toBeTruthy();
    expect(obligated).toBeTruthy();
    expect(disbursed).toBeTruthy();

    return {
      allocated: this.toNumber(allocated),
      obligated: this.toNumber(obligated),
      disbursed: this.toNumber(disbursed)
    };
  }

  async navigateToFinancialSummary() {
    await this.page.keyboard.press('Escape');
    await this.page.hover('#ts-nav-4');
    await this.page.click('#ts-nav-4-1');
    await this.page.waitForTimeout(1000);
  }

  async selectAgency(agencyName: string) {
    await this.page.locator('#ts-filter-managingAgency').click();
    await this.page.click(`#ts-filter-managingAgency-panel :text("${agencyName}")`);
    await this.page.waitForTimeout(1000);
  }

  async getDisasterOptions(): Promise<string[]> {
    await this.page.locator('#ts-filter-disaster').nth(0).click();
    const options = await this.page.$$eval('#ts-filter-disaster-panel .mat-option', 
      elements => elements.map(el => el.textContent?.trim()));
    await this.page.keyboard.press('Escape');
    return options.filter(d => d && d !== 'All') as string[];
  }

  async selectDisaster(disaster: string, index: number|undefined = undefined) {
    if(index)
      await this.page.locator('#ts-filter-disaster').nth(index-1).click();
    else
      await this.page.locator('#ts-filter-disaster').click();
    await this.page.click(`#ts-filter-disaster-panel :text("${disaster}")`);
    await this.page.waitForTimeout(1000);
  }

  async resetFilters() {
    await this.page.click('.link-style:text("Reset")');
    await this.page.waitForTimeout(1000);
  }

  async compareAmounts(actual: FinancialAmounts, expected: FinancialAmounts) {
    expect(actual.allocated).toBe(expected.allocated);
    expect(actual.obligated).toBe(expected.obligated);
    expect(actual.disbursed).toBe(expected.disbursed);
  }

  async navigateToHome() {
    await this.page.keyboard.press('Escape');
    await this.page.click('.inactive-home');
    await this.page.waitForTimeout(1000); // Wait for navigation and content to load
  }
}

test('Reconcile disaster allocations between Home Page and Financial Summary', async ({ page }) => {
  const helper = new FinancialTestHelper(page);
  
  // Setup
  page.setViewportSize({ width: 1700, height: 1080 });
  await page.goto('https://www.recovery.pr/en');
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(1000);

  // Get COR3 amounts from home page (indices 0-2)
  const homepageAmounts = await helper.getHomePageAmounts(0);
  console.log('Home page totals:', homepageAmounts);

  // Navigate and select COR3
  await helper.navigateToFinancialSummary();
  await helper.selectAgency('COR3');

  // Get and compare financial summary amounts
  const summaryAmounts = await helper.getFinancialSummaryAmounts();
  console.log('Financial summary totals:', summaryAmounts);
  await helper.compareAmounts(summaryAmounts, homepageAmounts);

  // Get list of disasters first
  const disasters = await helper.getDisasterOptions();
  
  // For each disaster
  for (const disaster of disasters) {
    console.log('Checking disaster:', disaster);
    
    // Get amounts from home page with disaster filter
    await helper.navigateToHome();
    await helper.selectDisaster(disaster, 1);
    const homeDisasterAmounts = await helper.getHomePageAmounts(0);
    console.log(`Home page ${disaster} amounts:`, homeDisasterAmounts);

    // Get amounts from financial summary with same disaster filter
    await helper.navigateToFinancialSummary();
    await helper.selectAgency('COR3');
    await helper.selectDisaster(disaster, 1);
    const summaryDisasterAmounts = await helper.getFinancialSummaryAmounts();
    console.log(`Financial summary ${disaster} amounts:`, summaryDisasterAmounts);

    // Compare the amounts
    await helper.compareAmounts(summaryDisasterAmounts, homeDisasterAmounts);

    // Reset filters before next iteration
    await helper.resetFilters();
  }
});
