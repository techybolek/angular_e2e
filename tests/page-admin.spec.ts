import { test, expect } from '@playwright/test';
import { log } from 'console';

const PW_TEST_PAGE = 'PW Test Page';

test('Page Create Test', async ({ page }) => {
  page.setViewportSize({ width: 1920, height: 1080 });
  expect(true).toBeTruthy();

  await page.goto('https://dev.recovery.pr.gov/admin/');
  await logIn(page);
  await gotoPages(page)

  //Click Add New Page
  const createButton = await page?.$('.admin-pages-container .page-actions-row button');
  expect(createButton).toBeTruthy();
  await createButton?.click();

  //Populate page names
  const contentContainer = await page?.$('.content-container');
  expect(contentContainer).toBeTruthy();
  await page.fill('#page_name_en', PW_TEST_PAGE);
  await page.fill('[formControlName=display_name_en]', 'PW Test Page- English');
  await page.click('.content-container .ce-page-info :text("Spanish *")');
  await page.fill('[formControlName=display_name_es]', 'PW Test Page- Spanish');

  //Add Text Block
  await page.click('.fp-admin-add');
  await page.click('.ct-selector-container :text("Text Block")');

  //Fill up the text editor
  const editorEN = await page.$('#content-block-0 .text-editor-wrapper textarea');
  expect(editorEN).toBeTruthy();
  await editorEN?.fill('This is a test page created by Playwright - English');
  await page.click('#content-block-0 :text("Spanish")');
  await page.waitForTimeout(600);
  const editorES = await page.$('#content-block-0 .text-editor-wrapper textarea');
  await editorES?.fill('This is a test page created by Playwright - Spanish');

  //Save as Draft
  const saveElem = await page.$('.status-indicator:text(" Save as Draft ")');
  expect(saveElem).toBeTruthy();
  saveElem?.click();

  await page.waitForTimeout(2000);
})

test('Page Delete Test', async ({ page }) => {
  page.setViewportSize({ width: 1920, height: 1080 });
  expect(true).toBeTruthy();

  await page.goto('https://dev.recovery.pr.gov/admin/');
  await logIn(page);
  await page.waitForTimeout(600);
  await gotoPages(page)
  await page.waitForTimeout(600);

  //Ensure the first row is the page we want to delete
  const firstTDD = await page?.$('table tr td');
  expect(firstTDD).toBeTruthy();
  const pageTitle = await firstTDD?.textContent();
  console.log("Text: ", pageTitle);
  //page title string should be equal to the test page
  expect(pageTitle).toBe(PW_TEST_PAGE);

  //Click the row menu on the right side
  const rowMenu = await page?.$('table tr .admin-list-options .mat-mdc-menu-trigger')
  expect(rowMenu).toBeTruthy();
  await rowMenu?.click();

  //click #mat-menu-panel-1 .admin-pages-option with text Delete
  const deleteOption = await page?.$('#mat-menu-panel-1 .admin-pages-option :text("Delete")');
  expect(deleteOption).toBeTruthy();
  await deleteOption?.click();

  //confirm the delete
  const yesButton = await page?.$('mat-dialog-container button :text("Yes")');
  expect(yesButton).toBeTruthy();
  await yesButton?.click();

  //Validate
  await page.waitForTimeout(600);
  const firstTD2 = await page?.$('table tr td');
  expect(firstTD2).toBeTruthy();
  const pageTitle2 = await firstTD2?.textContent();
  expect(pageTitle2).not.toBe(PW_TEST_PAGE);

  await page.waitForTimeout(1000);
})

async function logIn(page: any) {
  const email = await page.$('#inputEmail');
  if (email) {
    expect(email).toBeTruthy();
    const password = await page.$('#inputPassword');
    expect(password).toBeTruthy();
    await email?.fill('')
    await password?.fill('');
    await page.click('#loginSubmit');
    await page.waitForTimeout(2000);
  }
}


async function gotoPages(page: any) {
  const header = await page.$('.admin-header-bar');
  expect(header).toBeTruthy();
  // Select the element with class 'ng-fa-icon' that is a descendant of the element with class 'admin-header-bar'
  const icon = await header?.$('.ng-fa-icon');
  expect(icon).toBeTruthy();
  await icon?.click();
  //select first element with class item-option-2
  const item = await page?.$('.item-option-2');
  expect(item).toBeTruthy();
  await item?.click();
}