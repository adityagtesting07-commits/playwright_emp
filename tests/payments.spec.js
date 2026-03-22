import { test, expect } from '@playwright/test';

const credentials = {
  email: 'admin@acme.com',
  password: 'Admin@123',
};

const paymentData = {
  clientId: '32792e53-9f0f-4d40-9471-a5b0076ca7a3',
  amount: '10000',
  date: '2026-03-21',
  method: 'gateway_stripe',
  reference: '3000010045678912',
  notes: 'Payment creation test',
};

async function loginAndOpenPayments(page) {
  await page.goto('https://test-billing.empcloud.com/login');
  await page.getByRole('textbox', { name: 'Email*' }).fill(credentials.email);
  await page.getByRole('textbox', { name: 'Password*' }).fill(credentials.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Payments' }).click();
  await expect(page.getByRole('heading', { name: 'Payments' })).toBeVisible();
}

async function openPaymentForm(page) {
  await page.getByRole('button', { name: 'Record Payment' }).first().click();
  await expect(page.getByRole('heading', { name: 'Record Payment' })).toBeVisible();
  await expect(page.getByLabel('Client*')).toBeVisible();
}

async function fillPaymentForm(page, overrides = {}) {
  const data = { ...paymentData, ...overrides };

  if (data.clientId !== undefined) {
    await page.getByLabel('Client*').selectOption(data.clientId);
  }

  if (data.amount !== undefined) {
    await page.getByRole('spinbutton', { name: 'Amount*' }).fill(data.amount);
  }

  if (data.date !== undefined) {
    await page.getByRole('textbox', { name: 'Date*' }).fill(data.date);
  }

  if (data.method !== undefined) {
    await page.getByLabel('Payment Method*').selectOption(data.method);
  }

  if (data.reference !== undefined) {
    await page.getByRole('textbox', { name: 'Reference' }).fill(data.reference);
  }

  if (data.notes !== undefined) {
    await page.getByRole('textbox', { name: 'Notes' }).fill(data.notes);
  }
}

async function submitPaymentForm(page) {
  await page.getByRole('button', { name: 'Record Payment' }).click();
}

async function getPaymentsRows(page) {
  return page.locator('table tbody tr');
}

test('creates a payment when all required data is filled', async ({ page }) => {
  await loginAndOpenPayments(page);
  await openPaymentForm(page);
  await fillPaymentForm(page);
  await submitPaymentForm(page);

  await expect(page.getByText('Payment recorded')).toBeVisible();
});

test('filters payments using the method dropdown', async ({ page }) => {
  await loginAndOpenPayments(page);

  const rows = await getPaymentsRows(page);
  await expect(rows.first()).toBeVisible();

  const firstRow = rows.first();
  const method = (await firstRow.locator('td').nth(3).textContent())?.trim();

  expect(method).toBeTruthy();

  await page.getByRole('combobox').first().selectOption({ label: method });
  await expect(rows.first()).toBeVisible();

  const filteredRows = await rows.count();
  for (let index = 0; index < filteredRows; index += 1) {
    await expect(rows.nth(index).locator('td').nth(3)).toHaveText(method);
  }
});

test('downloads receipt from payments list', async ({ page }) => {
  await loginAndOpenPayments(page);

  const rows = await getPaymentsRows(page);
  await expect(rows.first()).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    rows.first().getByRole('link', { name: 'Receipt' }).click(),
  ]);

  expect(await download.failure()).toBeNull();
  expect(await download.suggestedFilename()).toBeTruthy();
});

/*
async function expectNativeRequiredValidation(locator) {
  await expect(locator).toBeVisible();

  const validationState = await locator.evaluate((element) => ({
    isValid: element.checkValidity(),
    message: element.validationMessage,
  }));

  expect(validationState.isValid).toBeFalsy();
  expect(validationState.message).not.toBe('');
}

test.describe('Payments required field validations', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndOpenPayments(page);
    await openPaymentForm(page);
  });

  test('validates client is required', async ({ page }) => {
    await fillPaymentForm(page, { clientId: undefined });
    await submitPaymentForm(page);

    await expectNativeRequiredValidation(page.getByLabel('Client*'));
  });

  test('validates amount is required', async ({ page }) => {
    await fillPaymentForm(page, { amount: undefined });
    await submitPaymentForm(page);

    await expectNativeRequiredValidation(page.getByRole('spinbutton', { name: 'Amount*' }));
  });

  test('validates date is required', async ({ page }) => {
    await fillPaymentForm(page, { date: undefined });
    await submitPaymentForm(page);

    await expectNativeRequiredValidation(page.getByRole('textbox', { name: 'Date*' }));
  });

  test('validates payment method is required', async ({ page }) => {
    await fillPaymentForm(page, { method: undefined });
    await submitPaymentForm(page);

    await expectNativeRequiredValidation(page.getByLabel('Payment Method*'));
  });
});
*/
