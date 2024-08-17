import { expect } from '@playwright/test';

export async function logIn(page: any) {
    const email = await page.$('#inputEmail');
    if (email) {
        expect(email).toBeTruthy();
        const password = await page.$('#inputPassword');
        expect(password).toBeTruthy();
        await email?.fill('pradmin@cgi.com')
        //await password?.fill('j#ieJ%lrI3');
        await password?.fill('Pdq9pR5!y4')
        await page.click('#loginSubmit');
        await page.waitForTimeout(2000);
    }
}

export async function gotoMenu(page: any, menuOptionText: string) {
    const header = await page.$('.admin-header-bar');
    expect(header).toBeTruthy();
    // Select the element with class 'ng-fa-icon' that is a descendant of the element with class 'admin-header-bar'
    const icon = await header?.$('.ng-fa-icon');
    expect(icon).toBeTruthy();
    await icon?.click();
    //select first element with class item-option-2
    //const item = await page?.$('.item-option-2');
    //select first element with text Custom Pages
    const item = await page?.$(`.item-option-2 :text("${menuOptionText}")`)
    expect(item).toBeTruthy();
    await item?.click();
}

export async function stdInitMenu(page: any, menuOptionText: string) {
    page.setViewportSize({ width: 1920, height: 1080 });
    expect(true).toBeTruthy();

    //await page.goto('https://dev.recovery.pr.gov/admin/');
    await page.goto('http://172.31.64.1:4201/en/');
    await logIn(page);
    await page.waitForTimeout(600);
    await gotoMenu(page, menuOptionText)
    await page.waitForTimeout(600);
}