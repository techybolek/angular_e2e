import { test, expect, Page } from '@playwright/test';

const timesheetUrl = "https://psa-fs.ent.cgi.com/psp/fsprda/?cmd=login&languageCd=ENG&";

test('should navigate to timesheet and perform basic operations', async ({ page }) => {
    // Set viewport size for better visibility
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Navigate to the timesheet URL
    await page.goto(timesheetUrl);
    
    // Wait for page load
    await page.waitForTimeout(2000);
    
    // Login (you'll need to implement this with actual credentials)
    await logIn(page);
   
    //click element id="PS_REPORT_TIME_L_FL$0"
    await page.locator('#PS_REPORT_TIME_L_FL\\$0').click();

    // Wait for the main content iframe to be available
    await page.waitForTimeout(2000);

    // Get the main content iframe
    const mainFrame = page.frameLocator('iframe[title="Main Content"]');
    
    // Wait for and click the Add button in the main frame
    try {
        //<input type="button" name="PTS_CFG_CL_WRK_PTS_ADD_BTN" id="PTS_CFG_CL_WRK_PTS_ADD_BTN" tabindex="47" value="Add" class="PSPUSHBUTTON" style="width:53px; " onclick="submitAction_win0(document.win0,this.id,event);" accesskey="1">
        await mainFrame.locator('#PTS_CFG_CL_WRK_PTS_ADD_BTN').click({
            timeout: 10000
        });
    } catch (e) {
        console.error('Failed to find Add button:', e);
        // Log the error and take a screenshot for debugging
        await page.screenshot({ path: 'debug-add-button-fail.png', fullPage: true });
        throw e;
    }

    // Wait for any frame transitions
    await page.waitForTimeout(2000);

    // Click the copy button in the main frame
    try {
        await mainFrame.locator('#EX_TIME_HDR_WRK_COPY_TIME_RPT').click({
            timeout: 10000
        });
    } catch (e) {
        console.error('Failed to find Copy button:', e);
        await page.screenshot({ path: 'debug-copy-button-fail.png', fullPage: true });
        throw e;
    }
    //wait 3000
    await page.waitForTimeout(2000);
    //click iframe element <input type="button" name="COPY_TIME_REPORT$0" id="COPY_TIME_REPORT$0" tabindex="50" value="Select" class="PSPUSHBUTTON" style="width:71px; " onclick="submitAction_win0(document.win0,this.id,event);" title="Copy Document">
    await mainFrame.locator('#COPY_TIME_REPORT\\$0').click({
        timeout: 10000
    });
    //wait 3000
    await page.waitForTimeout(2000);
    
    //fill out elements id="TIME2$0" through id="TIME7$0" with value 8
    for (let i = 2; i < 8; i++) {
        await mainFrame.locator(`#TIME${i}\\$0`).fill('8');
        //wait 1500
        await page.waitForTimeout(1500);
    }
    //wait 3000
    await page.waitForTimeout(3000);
    
});

async function logIn(page: Page) {
    // Wait for login form to be visible
    const usernameInput = await page.locator('#userid');
    await expect(usernameInput).toBeVisible();
    
    const passwordInput = await page.locator('#pwd');
    await expect(passwordInput).toBeVisible();
    
    // Fill in login credentials (replace with actual test credentials)
    await usernameInput.fill("tomasz.romanowski");
    await passwordInput.fill("");
    
    // Click login button
    const loginButton = await page.locator('[name="Submit"]');
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    
    // Wait for login to complete
    await page.waitForTimeout(2000);
}