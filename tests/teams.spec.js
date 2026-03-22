import { test, expect } from '@playwright/test';

const credentials = {
  email: 'admin@acme.com',
  password: 'Admin@123',
};

const teamMem={
    firstName:'Testing',
    lastName:'Singh',
    email:'testS@gmail.com',
    role:'Sales',
};


async function loginAndOpenTeam(page) {
  await page.goto('https://test-billing.empcloud.com/login');
  await page.getByRole('textbox', { name: 'Email*' }).fill(credentials.email);
  await page.getByRole('textbox', { name: 'Password*' }).fill(credentials.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Team' }).click();
  await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible();
}

async function inviteTeam(page){
    await page.getByRole('button', { name: 'Invite Member' }).click();
    await expect(page.getByRole('heading',{ name: 'Invite Team Member' })).toBeVisible();
}

async function memData(page,overrides={}){
    const data={...teamMem , ...overrides}
    if(data.firstName!==undefined){
        await page.getByRole('textbox', { name: 'First Name*' }).fill(data.firstName);
    }
    if(data.lastName!==undefined){
        await page.getByRole('textbox', { name: 'Last Name*' }).fill(data.lastName);
    }
    if(data.email!==undefined){
        await page.getByRole('textbox', { name: 'Email*' }).fill(data.email);
    }
    if(data.role!==undefined){
        await page.getByLabel('Role*').selectOption(data.role);
    }
}

async function submitDetails(page){
    await page.getByRole('button', { name: 'Send Invite' }).click();
    //await page.locator('div').filter({ hasText: 'Member invited' }).nth(3).toBeVisible();
}

async function removeMember(page){
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
    await page.getByRole('button', { name: 'Remove' }).nth(2).click();
    await page.locator('div').filter({ hasText: 'Member removed' }).nth(3).toBeVisible();
}


test('login and team open check', async({page})=>{
    await loginAndOpenTeam(page);
});

test('new team invite form', async({page})=>{
    await loginAndOpenTeam(page);
    await inviteTeam(page);
});

test('add team member details to form', async({page})=>{
    await loginAndOpenTeam(page);
    await inviteTeam(page);
    await memData(page);
    await submitDetails(page);
});

test('delete team member detail', async({page})=>{
    await loginAndOpenTeam(page);
    await removeMember(page);
});

























// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://test-billing.empcloud.com/login');
//   await page.getByRole('textbox', { name: 'Email*' }).click();
//   await page.getByRole('textbox', { name: 'Password*' }).click();
//   await page.getByRole('textbox', { name: 'Email*' }).click();
//   await page.getByRole('textbox', { name: 'Email*' }).fill('admin@acme.com');
//   await page.getByRole('textbox', { name: 'Password*' }).click();
//   await page.getByRole('textbox', { name: 'Password*' }).fill('Admin@123');
//   await page.getByRole('button', { name: 'Sign in' }).click();
//   await page.getByRole('link', { name: 'Team' }).click();
//   await page.getByRole('button', { name: 'Invite Member' }).click();
//   await page.getByRole('textbox', { name: 'First Name*' }).click();
//   await page.getByRole('textbox', { name: 'First Name*' }).fill('john');
//   await page.getByRole('textbox', { name: 'Last Name*' }).click();
//   await page.getByRole('textbox', { name: 'Last Name*' }).fill('Doe');
//   await page.getByRole('textbox', { name: 'Email*' }).click();
//   await page.getByRole('textbox', { name: 'Email*' }).fill('john@email.com');
//   await page.getByLabel('Role*').selectOption('admin');
//   await page.getByLabel('Role*').selectOption('accountant');
//   await page.getByRole('button', { name: 'Send Invite' }).click();
// });


// import { test, expect } from '@playwright/test';
// test('test', async ({ page }) => {
//   await page.goto('https://test-billing.empcloud.com/login');
//   page.once('dialog', dialog => {
//     console.log(Dialog message: ${dialog.message()});
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Remove' }).nth(2).click();
//   await page.locator('div').filter({ hasText: 'Member removed' }).nth(3).click();
//   page.once('dialog', dialog => {
//     console.log(Dialog message: ${dialog.message()});
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Remove' }).nth(1).click();
//   await page.getByRole('button', { name: 'Invite Member' }).click();
//   await page.getByRole('textbox', { name: 'First Name*' }).click();
//   await page.getByRole('textbox', { name: 'First Name*' }).fill('new ');
//   await page.getByRole('textbox', { name: 'First Name*' }).press('Tab');
//   await page.getByRole('textbox', { name: 'Last Name*' }).fill('n');
//   await page.getByRole('textbox', { name: 'Last Name*' }).press('Tab');
//   await page.getByRole('textbox', { name: 'Email*' }).fill('n@gmail.com');
//   await page.getByRole('textbox', { name: 'Email*' }).press('Tab');
//   await page.getByLabel('Role*').press('Tab');
//   await page.getByRole('button', { name: 'Cancel' }).press('Tab');
//   await page.getByRole('button', { name: 'Send Invite' }).press('Enter');
//   await page.getByRole('button', { name: 'Send Invite' }).click();
//   await page.locator('div').filter({ hasText: 'Member invited' }).nth(3).click();
// });