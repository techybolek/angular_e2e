import { test, expect, Page } from '@playwright/test';
import 'dotenv/config';


const BACKEND_URL = process.env['BACKEND_URL'] || 'http://localhost:3000';

test('should navigate to URL and find Next Page element', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await logIn(page);

    const disasterId = 4339;
    const uiData = await getUIDataForDisaster(page, disasterId);
    //skip header row
    const uiTable = uiData.slice(1);
    console.log('uiTable:', uiTable);

    const apiResponse = await page.request.get(BACKEND_URL + '/api/applicant-dashboard/' + disasterId);
    expect(apiResponse.ok()).toBeTruthy();
    const apiData = await apiResponse.json();

    reconcile(uiTable, apiData);
});

function reconcile(uiTable: string[][], apiData: any) {
    //for now just reconcile pw counts only
    uiTable.forEach(row => {
        const category = row[0];
        //parse to number, removing commas first
        const pwCountStr = row[1];
        const pwCount = parseInt(pwCountStr.replace(/,/g, ''));
        console.log('UI Count:', pwCount);
        const apiRow = apiData.find((r: any) => r.category === category);
        expect(apiRow).toBeDefined();
        console.log('API Count:', apiRow);
        expect(apiRow.pwCount).toEqual(pwCount);
    });
}


async function logIn(page: any) {
    const loginUrl = "https://rpt01.cor3.pr/#/signin?isDefaultIdentityPoolLogin=true"
    await page.goto(loginUrl);
    //get element with an attribute data-tb-test-id="username-TextInput"

    //wait for 500ms
    await page.waitForTimeout(500);
    const usernameInput = await page.locator('[data-tb-test-id="username-TextInput"]');
    await expect(usernameInput).toBeVisible();
    //fill the username input with the value "test"
    await usernameInput.fill("tromanowski");
    //get element with an attribute data-tb-test-id="password-TextInput"
    const passwordInput = await page.locator('[data-tb-test-id="password-TextInput"]');
    await expect(passwordInput).toBeVisible();
    //fill the password input with the value from environment variable
    await passwordInput.fill(process.env['TABLEAU_PASSWORD'] || '');

    //get element with an attribute data-tb-test-id="login-Button"
    const loginButton = await page.locator('[tb-test-id="button-signin"]');
    await expect(loginButton).toBeVisible();
    //click the login button
    await loginButton.click();
    await page.waitForTimeout(1200);
}

async function getUIDataForDisaster(page: Page, disasterId: number) {
    const theUrl = "https://rpt01.cor3.pr/#/views/ApplicantandMunicipalitiesStatusReport/ApplicantStatusReport?:iid=4&DisasterID=" + disasterId + "&Swap=Applicant"
    await page.goto(theUrl);
    await page.waitForTimeout(3000);

    // Get the specific iframe
    const visualizationFrame = page.frameLocator('iframe[title="Data Visualization"]');

    // Find table within the specific iframe
    const table = visualizationFrame.locator('#tabZoneId16 > div > div > div > div.tab-clip > div.tab-tvTLSpacer.tvimagesNS > img');
    await expect(table).toBeVisible();
    await table.click();

    // Find download button within the same iframe
    const downloadButton = visualizationFrame.locator('[data-tb-test-id="viz-viewer-toolbar-button-download"]');
    await expect(downloadButton).toBeVisible();
    await downloadButton.click({ force: true });
    await page.waitForTimeout(1000);

    // Find download menu within the same iframe
    const downloadMenu = visualizationFrame.locator('#viz-viewer-toolbar-download-menu');
    await expect(downloadMenu).toBeVisible();
    const dataButton = downloadMenu.locator('label:has-text("Data")');
    await expect(dataButton).toBeVisible();

    // Rest of the code for handling new page
    const context = page.context();
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        dataButton.click()
    ]);

    await newPage.waitForLoadState('networkidle');
    await newPage.waitForTimeout(2000);
    const uiResults = await processTableData(newPage);
    await newPage.close();
    return uiResults;
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

    const rawTableData1 = await extractDataFromCells();

    const dataGrids = await newPage.locator('.tb-react-dg-body').all();
    for (const grid of dataGrids) {
        await grid.evaluate(grid => {
            grid.scrollTo(0, grid.scrollHeight);
        });
    }
    await newPage.waitForTimeout(1000); // Wait for new data to load


    const rawTableData2 = await extractDataFromCells();
    const rawTableData = [...rawTableData1, ...rawTableData2];
    const transformedTable = await processRawData(rawTableData as string[]);
    return transformedTable;

    async function extractDataFromCells() {
        // Get all cells with data-tb-test-id="DataTabDataGridCell" 
        const cells = await newPage.locator('[data-tb-test-id="DataTabDataGridCell"]').all();
        //wait for 500ms
        await newPage.waitForTimeout(1000);
        // Extract data from cells
        const tableData = [];
        for (const cell of cells) {
            const value = await cell.getAttribute('title');
            tableData.push(value);
        }
        return tableData;
    }

    async function processRawData(tableData: string[]) {
        // Group data into rows (assuming 6 columns per row)
        const rows = [];
        for (let i = 0; i < tableData.length; i += 6) {
            rows.push(tableData.slice(i, i + 6));
        }

        const uniqueCategories = [...new Set(rows.map(row => row[0]))].sort();
        console.log('Unique categories:', uniqueCategories);

        //get unique measurements
        let uniqueMeasurements = [...new Set(rows.map(row => row[1]))];
        uniqueMeasurements = sortMeasurements(uniqueMeasurements);
        console.log('Sorted measurements:', uniqueMeasurements);

        //transform the table into the following format:
        //Columns: Category, measurement 1, measurement 2, measurement 3, etc.
        //Rows: value 1, value 2, value 3, etc.
        const headerRow = ['CATEGORY', ...uniqueMeasurements];
        const transformedTable = [headerRow];
        for (const category of uniqueCategories) {
            const categoryRows = rows.filter(row => row[0] === category);
            const outputRow = [category, ...uniqueMeasurements];
            categoryRows.forEach(row => {
                ///the measurement is in the row[1]
                const measurement = row[1];
                const measurementIndex = uniqueMeasurements.indexOf(measurement);
                const theRest = row.slice(2)
                //the value is one of the rest cells in the row, the only one that is not null
                const value: string = theRest.find(item => item !== null && item !== 'Null') as string;
                outputRow[measurementIndex + 1] = value;
            });
            transformedTable.push(outputRow);
        }
        return transformedTable;


        function sortMeasurements(measurements: string[]) {
            const sortedOrder = ['PW COUNT', 'TOTAL PROJECT AMOUNT', 'TOTAL FEDERAL SHARE OBLIGATED', 'DISBURSED', 'DISBURSED %']
            //first ensure that all measurements are present
            const missingMeasurements = sortedOrder.filter(measurement => !measurements.includes(measurement));
            expect(missingMeasurements.length, 'Missing measurements: ' + missingMeasurements.join(', ')).toBe(0);
            const unexpectedMeasurements = measurements.filter(measurement => !sortedOrder.includes(measurement));
            expect(unexpectedMeasurements.length, 'Unexpected measurements: ' + unexpectedMeasurements.join(', ')).toBe(0);
            //now sort the measurements by the sortedOrder
            const sortedMeasurements = sortedOrder.filter(measurement => measurements.includes(measurement));
            return sortedMeasurements;
        }
    }
}
