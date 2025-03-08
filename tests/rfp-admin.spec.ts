import { test, expect } from '@playwright/test';
import { log } from 'console';
import { logIn, stdInitMenu } from './util/admin_util';

const DOC_TEST_TITLE = 'TRO TEST - PW';

test('RFP Create Test', async ({ page }) => {
  await stdInitMenu(page, 'Inventory');

  //Click Add Document
  const createButton = await page?.$('#table-outer-container .admin-primary-button :text("Add New COR3 Document")');
  expect(createButton).toBeTruthy();
  /*
  await createButton?.click();
  //wait for 500ms
  await page.waitForTimeout(500);
  //click id=dnd-btn
  const dndButton = await page?.$('#dnd-btn');
  expect(dndButton).toBeTruthy();

  const linkToggle = await page?.$('.linkToggle .mat-mdc-slide-toggle');
  expect(linkToggle).toBeTruthy();
  await linkToggle?.click();

  const linkInput = await page?.$('.link input');
  expect(linkInput).toBeTruthy();
  //populate linkInput with http://cor3.pr
  await page.fill('.link input', 'http://tro-test.com')

  const titleInput = await page?.$('.title input');
  expect(titleInput).toBeTruthy();
  await page.fill('.title input', DOC_TEST_TITLE);

  const categorySelect = await page?.$('.category  .mat-mdc-select');
  //expect to be truthy
  expect(categorySelect).toBeTruthy();
  await categorySelect?.click();
  await page.waitForTimeout(100);

  await page.click('.tp-select :text("Coronavirus Relief Fund (CRF)")');

  const subcategorySelect = await page?.$('.subcategory  .mat-mdc-select');
  expect(subcategorySelect).toBeTruthy();
  await subcategorySelect?.click();
  await page.waitForTimeout(100);
  await page.click('.tp-select :text("FAQs")');

  const addToFeaturedToggle = await page?.$('.addToFeatured .mat-mdc-slide-toggle')
  expect(addToFeaturedToggle).toBeTruthy();
  await addToFeaturedToggle?.click();

  const disasterSelect = await page?.$('.disaster .mat-mdc-select')
  expect(disasterSelect).toBeTruthy();
  await disasterSelect?.click();
  await page.click('.tp-select :text("Hurricane Maria (4339)")');
  await page.click('.tp-select :text("Hurricane Irma (4336)")');
  await page.keyboard.press('Escape');

  const publishDate = await page?.$('.publishDate .mat-datepicker-input');
  expect(publishDate).toBeTruthy();
  await page.fill('.publishDate .mat-datepicker-input', '07/20/2024');

  const languageDropdown = await page?.$('.language .mat-mdc-select');
  expect(languageDropdown).toBeTruthy();
  await languageDropdown?.click();
  await page.waitForTimeout(100);
  await page.click('.tp-select :text("English")');
  //wait for 500ms
  await page.waitForTimeout(500);
  const submitButton = await page?.$('.admin-primary-button :text("Submit")')
  expect(submitButton).toBeTruthy();
  await submitButton?.click();
  */

  await page.waitForTimeout(3000);
})

/*
test('Doc Edit Test', async ({ page }) => {
  await stdInitMenu(page, 'Document Library');

  //const docRow = await page?.$(`table tr :text("TRO TEST - PW")`);
  //expect(docRow).toBeTruthy();
  //within docRow find the element with class name mat-mdc-menu-trigger


  //const rowMenu = await page?.$('table tr .admin-list-options .mat-mdc-menu-trigger')

  //const rowMenu = await docRow?.$('.mat-mdc-menu-trigger');
  //expect(rowMenu).toBeTruthy();
  //console.log("ROWMENU: ", rowMenu);

  const docRow = await page.evaluateHandle(() => {
    const DOC_TEST_TITLE = 'TRO TEST - PW';
    const xpathExpression = `//*[contains(text(), "${DOC_TEST_TITLE}")]/..`;
    const result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
  });

  if (docRow) {
    console.log('Parent element found');
    const rowMenu = await docRow.evaluate(row => {
      if(row instanceof HTMLElement) {
        return row.querySelector('.mat-mdc-menu-trigger')
      }
      return null
    })
    if (rowMenu) {
      console.log('Child element found');
      //await rowMenu.click();
      //wait for 500ms
      
      //await page.waitForTimeout(500);
      //const editOption = await page?.$('.mat-mdc-menu-panel .admin-pages-option :text("Edit")');
      //expect(editOption).toBeTruthy();
      //await editOption?.click();

      //const titleInput = await page?.$('.title input');
      //expect(titleInput).toBeTruthy();
      //await page.fill('.title input', ' - EDITED');

      //const submitButton = await page?.$('.admin-primary-button :text("Submit")')
      //expect(submitButton).toBeTruthy();
      //await submitButton?.click();
    } else {
      console.log('Child element not found')
    }
  } else {
    console.log('Parent element not found');
  }

  await page.waitForTimeout(1500);
})
*/
