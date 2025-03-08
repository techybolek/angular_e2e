import { test, expect, Page } from '@playwright/test';


//const theUrl = "https://rpt01.cor3.pr/#/views/ApplicantandMunicipalitiesStatusReport/ApplicantStatusReport?:iid=1"
const theUrl = "https://rpt01.cor3.pr/#/views/ApplicantandMunicipalitiesStatusReport/ApplicantStatusReport?:iid=4&DisasterID=4339&Swap=Applicant"

test('should navigate to URL and find Next Page element', async ({ page }) => {
    //make screen larger
    await page.setViewportSize({ width: 1920, height: 1080 });
    await logIn(page);
    await page.waitForTimeout(500);
    await page.goto(theUrl);
    //wait for 500ms
    await page.waitForTimeout(5500);
    let table = null;
    const tableSelector = '#tabZoneId16 > div > div > div > div.tab-clip > div.tab-tvTLSpacer.tvimagesNS > img'
    for (const frame of page.frames()) {
        console.log('Frame URL:', frame.url());
        table = await frame.locator(tableSelector);
        const isVisible = await table.isVisible();
        if (isVisible) {
            console.log('Found table in frame:', frame.url());
            break;
        }
    }
    //@ts-ignore
    await expect(table).toBeVisible();
    //click the table
    await table?.click();



    // Check if button is in an iframe
    const frames = page.frames();
    let theFrame = null;
    let theButton = null;


    for (const frame of frames) {
        console.log('Frame URL:', frame.url());
        theButton = frame.locator('[data-tb-test-id="viz-viewer-toolbar-button-download"]');
        const isVisible = await theButton.isVisible();
        if (isVisible) {
            console.log('Found button in frame:', frame.url());
            theFrame = frame;
            break;
        }
    }

    await theButton?.click({ force: true });
    await page.waitForTimeout(1000);
    //select eleent #viz-viewer-toolbar-download-menu
    const downloadMenu = theFrame?.locator('#viz-viewer-toolbar-download-menu');
    if (downloadMenu) {
        await expect(downloadMenu).toBeVisible();
        //click the element with <label>Data</label>
        const dataButton = downloadMenu?.locator('label:has-text("Data")');


        await expect(dataButton).toBeVisible();

        // Get the browser context from the page
        const context = page.context();

        // Wait for new page to open when clicking the data button
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            dataButton.click()
        ]);

        // Wait for the new page to load
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(3000);

        // Process the data
        await processTableData(newPage);

        // Close the new page when done
        await newPage.close();

    } else {
        await expect(false).toBe(true);
    }


});


async function logIn(page: any) {
    const loginUrl = "https://rpt01.cor3.pr/#/signin?isDefaultIdentityPoolLogin=true"
    await page.goto(loginUrl);
    //get element with an attribute data-tb-test-id="username-TextInput"

    const usernameInput = await page.locator('[data-tb-test-id="username-TextInput"]');
    await expect(usernameInput).toBeVisible();
    //fill the username input with the value "test"
    await usernameInput.fill("tromanowski");
    //get element with an attribute data-tb-test-id="password-TextInput"
    const passwordInput = await page.locator('[data-tb-test-id="password-TextInput"]');
    await expect(passwordInput).toBeVisible();
    //fill the password input with the value "test"
    await passwordInput.fill("kRze$laki124");

    //get element with an attribute data-tb-test-id="login-Button"
    const loginButton = await page.locator('[tb-test-id="button-signin"]');
    await expect(loginButton).toBeVisible();
    //click the login button
    await loginButton.click();
}

async function processTableData(newPage: Page) {
    //find element with id tabs-body-id
    const tabsBody = await newPage.locator('#tabs-body-id');
    await expect(tabsBody).toBeVisible();
    //click child element with title="MeasureNames". Not with text "MeasureNames", but with title "MeasureNames"
    const measureNames = await tabsBody.locator('div[title="MeasureNames"]');
    await expect(measureNames).toBeVisible();
    await measureNames.click();
    //wait for 500ms
    await newPage.waitForTimeout(500);
    //now click the child element with title "Summary"
    const summary = await tabsBody.locator('div[title="Summary"]');
    await expect(summary).toBeVisible();
    await summary.click();
    //wait for 500ms
    await newPage.waitForTimeout(500);
    


    // Get all cells with data-tb-test-id="DataTabDataGridCell" 
    const cells = await newPage.locator('[data-tb-test-id="DataTabDataGridCell"]').all();
    //wait for 500ms
    await newPage.waitForTimeout(2000);


    // Extract data from cells
    const tableData = [];
    for (const cell of cells) {
        const value = await cell.getAttribute('title');
        tableData.push(value);
    }
    console.log('Table data:', tableData);

    // Group data into rows (assuming 6 columns per row)
    const rows = [];
    for (let i = 0; i < tableData.length; i += 6) {
        rows.push(tableData.slice(i, i + 6));
    }

    console.log('Extracted table data:', rows);
    const uniqueCategories = [...new Set(rows.map(row => row[0]))];
    console.log('Unique categories:', uniqueCategories);
    for (const category of uniqueCategories) {
        const categoryRows = rows.filter(row => row[0] === category);
        console.log('Values for Category:', category);
        categoryRows.forEach(row => {
            const displayData = [row[1]]
            const theRest = row.slice(2)
            theRest.forEach(item => {
                if (item && item !== 'Null') {
                    displayData.push(item)
                }
            });
            console.log(displayData);
        });
    }


    return [];

}
