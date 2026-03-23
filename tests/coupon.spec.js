import { test, expect } from '@playwright/test';

const credentials = {
  email: 'admin@acme.com',
  password: 'Admin@123',
};

const coupData = {
  couponCode:'PLAYWRIGHT25',
  couponName:'LEARNPLAYWRIGHT25%',
  type:'percentage',
  percent:'25',
  Scope:'Invoice',
  maxRedem:'',
  maxRPerCleint:'2',
  minAmnt:'',
  validfrom:'2026-03-21',
  validTo:'2026-03-31',
}

async function loginAndOpenCoupons(page) {
  await page.goto('https://test-billing.empcloud.com/login');
  await page.getByRole('textbox', { name: 'Email*' }).fill(credentials.email);
  await page.getByRole('textbox', { name: 'Password*' }).fill(credentials.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Coupons' }).click();
  await expect(page.getByRole('heading', { name: 'coupons' })).toBeVisible();
}

async function openNewcouponPage(page){
    await page.getByRole('button', { name: 'New Coupon' }).click();
    await expect(page.getByRole('heading',{ name: 'New Coupon' })).toBeVisible();
}

async function fillNewCoupon(page , overrides={}){
  const data={...coupData , ...overrides};
  if(data.couponCode!==undefined){
    await page.getByRole('textbox',{name:'SUMMER20'}).fill(data.couponCode);
  }
  if(data.couponName!==undefined){
    await page.getByRole('textbox',{ name: 'Name*' }).fill(data.couponName);
  }
  if(data.type!==undefined){
    await page.getByLabel('Type*').selectOption(data.type);
  }
  if(data.percent!==undefined){
    await page.getByRole('spinbutton', { name: 'Percentage (%)*' }).fill(data.percent);
  }
  if(data.Scope!==undefined){
    await page.getByLabel('Applies To').selectOption(data.Scope);
  }
  if(data.maxRedem!==undefined){
    await page.getByRole('spinbutton', { name: 'Max Redemptions' }).fill(data.maxRedem);
  }
  if(data.maxRPerCleint!==undefined){
    await page.locator('input[name="maxRedemptionsPerClient"]').fill(data.maxRPerCleint);
  }
  if(data.minAmnt!==undefined){
    await page.getByRole('spinbutton', { name: 'Minimum Amount' }).fill(data.minAmnt);
  }
  if(data.validfrom!==undefined){
    await page.getByRole('textbox', { name: 'Valid From' }).fill(data.validfrom);
  }
  if(data.validTo!==undefined){
    await page.getByRole('textbox', { name: 'Valid Until' }).fill(data.validTo);
  }
}

async function submitCouponForm(page){
  await page.getByRole('button', { name: 'Create Coupon' }).click();
}

async function getFirstCouponActionButtons(page) {
  const firstDataRow = page.locator('table tbody tr').first();
  await expect(firstDataRow).toBeVisible();
  return firstDataRow.getByRole('button');
}


test('coupon page opens', async({page})=>{
  await loginAndOpenCoupons(page);
});

test('open new coupons page', async({page})=>{
  await loginAndOpenCoupons(page);
  await openNewcouponPage(page);
});

test('adding new coupon data',async({page})=>{
  await loginAndOpenCoupons(page);
  await openNewcouponPage(page);
  await fillNewCoupon(page);
  await submitCouponForm(page);
});

test('edit coupon button opens edit page', async ({ page }) => {
  await loginAndOpenCoupons(page);

  const actionButtons = await getFirstCouponActionButtons(page);
  await actionButtons.nth(1).click();

  await expect(page).toHaveURL(/coupons/i);
  await expect(page.getByRole('heading', { name: /coupon/i })).toBeVisible();
});

test('deactivate coupon button deactivates coupon', async ({ page }) => {
  await loginAndOpenCoupons(page);

  const actionButtons = await getFirstCouponActionButtons(page);

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await actionButtons.nth(2).click();
  await expect(page.getByText(/coupon deactivated/i)).toBeVisible();
});





// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://test-billing.empcloud.com/login');
//   await page.getByRole('button').nth(4).click();
//   await page.goto('https://test-billing.empcloud.com/coupons');
//   await page.getByRole('button').nth(5).click();
//   await page.goto('https://test-billing.empcloud.com/coupons');
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.locator('tr:nth-child(2) > .px-6.py-3.text-right > .flex > .p-1\\.5.text-gray-400.hover\\:text-red-500').click();
//   await page.locator('div').filter({ hasText: 'Coupon deactivated' }).nth(3).click();
// });




// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://test-billing.empcloud.com/login');
//   await page.getByRole('textbox', { name: 'Email*' }).click();
//   await page.getByRole('textbox', { name: 'Email*' }).fill('admin@acme.com');
//   await page.getByRole('textbox', { name: 'Email*' }).press('Tab');
//   await page.getByRole('textbox', { name: 'Password*' }).fill('Admin@123');
//   await page.getByRole('button', { name: 'Sign in' }).click();
//   await page.getByRole('link', { name: 'Coupons' }).click();
//   await page.getByRole('button', { name: 'New Coupon' }).click();
//   await page.locator('div').filter({ hasText: /^Code \*$/ }).click();
//   await page.getByRole('textbox', { name: 'SUMMER20' }).fill('Play20');
//   await page.getByRole('textbox', { name: 'SUMMER20' }).press('Tab');
//   await page.getByRole('button', { name: 'Auto-generate code' }).press('Tab');
//   await page.getByRole('textbox', { name: 'Name*' }).fill('Automate20%OFF');
//   await page.getByLabel('Type*').selectOption('fixed_amount');
//   await page.getByLabel('Type*').selectOption('percentage');
//   await page.getByRole('spinbutton', { name: 'Percentage (%)*' }).click();
//   await page.getByRole('spinbutton', { name: 'Percentage (%)*' }).click();
//   await page.getByRole('spinbutton', { name: 'Percentage (%)*' }).fill('19');
//   await page.getByRole('spinbutton', { name: 'Max Redemptions' }).click();
//   await page.locator('input[name="maxRedemptionsPerClient"]').click();
//   await page.getByRole('spinbutton', { name: 'Minimum Amount' }).click();
//   await page.getByRole('textbox', { name: 'Valid Until' }).fill('2026-03-28');
//   await page.getByRole('button', { name: 'Create Coupon' }).click();
//   await page.locator('input[name="maxRedemptionsPerClient"]').click();
//   await page.locator('input[name="maxRedemptionsPerClient"]').fill('5');
//   await page.getByRole('button', { name: 'Create Coupon' }).click();
// });
