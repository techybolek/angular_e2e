import { test, expect, Page, ElementHandle } from '@playwright/test';

let unfilteredData: {
  obligated: number,
  disbursed: number
} | undefined;

const globals = {
  disbursementWrapper: null,
  resetButton: null,
  page: null,
  overviewCards: null,
  //overlayContainer: null
}


test('Disbursement Dashboard Tests', async ({ page }) => {
  page.setViewportSize({ width: 1700, height: 1080 });

  //goto https://www.recovery.pr
  await page.goto('https://recovery.pr.gov/en/financial-analysis/disbursement-dashboard')

  //scroll down
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  //wait a second
  await page.waitForTimeout(1000);


  await init(page);

  await testOverviewSection(page);
})

async function resetFilters() {

  //close the overlay
  await currentPage().keyboard.press('Escape')

  //@ts-ignore
  await globals.resetButton?.click();
  await currentPage().waitForTimeout(500);
}

async function testOverviewSection(page: Page) {
  //find the element with the overview-cards class
  const overviewCards = await page.$('.overview-cards');
  expect(overviewCards).toBeTruthy();
  globals.overviewCards = overviewCards as any;

  //withini the overviewCards paent, find the element with class dount-section-1
  const doughnutSection1 = await overviewCards?.$('.donut-section-1');
  expect(doughnutSection1).toBeTruthy();

  await runValidation();

  await runSelectFilterTest('#ts-filter-disaster', 'Hurricane Maria (4339)');
  await runSelectFilterTest('#ts-filter-applicantType', 'Municipality');
  await runSelectFilterTest('#ts-filter-applicantName', 'Adjuntas');
  await runSelectFilterTest('#ts-filter-program', 'Public Assistance');
  await runSelectFilterTest('#ts-requestType', 'Reimbursement');
  await runSelectFilterTest('#ts-sector', 'Energy');

  await selectFilter('#ts-comparisonType', 'Custom Period');

  return


  async function runSelectFilterTest(filterId: string, filterText: string) {
    await selectFilter(filterId, filterText);
    await runValidation({ isFiltered: true });
    await resetFilters();
    await runValidation();
  }

  async function runValidation(args?: { isFiltered?: boolean }) {
    const isFiltered = args?.isFiltered || false;
    const obligatedValue = await getObligatedValue();
    const disbursedValue = await getDisbursedValue();

    expect(obligatedValue).toBeGreaterThan(0);
    expect(disbursedValue).toBeGreaterThan(0);
    expect(disbursedValue).toBeLessThan(obligatedValue);

    if (!unfilteredData) {
      unfilteredData = {
        obligated: obligatedValue,
        disbursed: disbursedValue
      }
    } else {
      if (isFiltered) {
        expect(unfilteredData.obligated).toBeGreaterThan(obligatedValue);
        expect(unfilteredData.disbursed).toBeGreaterThan(disbursedValue);
      } else {
        expect(obligatedValue).toBe(unfilteredData.obligated);
        expect(disbursedValue).toBe(unfilteredData.disbursed);
      }
    }
  }

  function numberConverterFunction(text: string): number {
    const cleanText = text.replace('$', '');
    if (cleanText.includes('B')) {
      return parseFloat(cleanText.replace('B', '')) * 1000000000;
    } else if (cleanText.includes('M')) {
      return parseFloat(cleanText.replace('M', '')) * 1000000;
    }
    return parseFloat(cleanText);
  }

  async function getObligatedValue() {
    const obligatedElement = await doughnutSection1?.$('.obligated');
    expect(obligatedElement).toBeTruthy();
    const text = await obligatedElement?.textContent();
    expect(text).toBeTruthy();
    const number = numberConverterFunction(text || '0');
    return number;
  }

  async function getDisbursedValue() {
    const disbursedElement = await overviewCards?.$('.disbursed');
    expect(disbursedElement).toBeTruthy();
    const text = await disbursedElement?.textContent();
    expect(text).toBeTruthy();
    const number = numberConverterFunction(text || '0');
    return number;
  }
}

async function selectFilter(id: string, optionText: string) {
  await currentPage().click(id);
  await currentPage().click(`${id}-panel :text("${optionText}")`);
  await currentPage().waitForTimeout(500);
}

async function init(page: Page) {
  globals.page = page as any;
  //find the element with id disbursement-wrapper
  globals.disbursementWrapper = await page.$('#disbursement-wrapper') as any;
  expect(globals.disbursementWrapper).toBeTruthy();

  //find the reset element
  const resetWrapper = await page.$('.reset-wrapper');
  expect(resetWrapper).toBeTruthy();
  //find the element with class 'link-style' inside resetWrapper
  //@ts-ignore
  globals.resetButton = await resetWrapper?.$('.link-style');
  //@ts-ignore
  expect(globals.resetButton).toBeTruthy();
}

function currentPage() : Page {
  return globals.page as unknown as Page;
}