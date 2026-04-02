import { expect, test } from '@playwright/test';

test('feature 1: presentation pages and key navigation work', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'LICEUL TEHNOLOGIC NR. 1' })).toBeVisible();

  await page.getByRole('link', { name: 'Despre Noi' }).click();
  await expect(page.getByRole('heading', { name: 'CINE SUNTEM?' })).toBeVisible();

  await page.getByRole('link', { name: 'Contact' }).click();
  await expect(page.getByLabel('Nume și Prenume')).toBeVisible();

  await page.getByRole('link', { name: 'Calendar' }).click();
  await expect(page.getByText('Program de Munca')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generare Orar' })).toBeVisible();
});

test('feature 2: login flow redirects to home and updates greeting', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('Email/Username')).toBeVisible();
  await page.getByLabel('Email/Username').fill('elev@test.ro');
  await page.getByLabel('Parola').fill('parola123');
  await page.getByRole('button', { name: 'Autentificare' }).click();

  await expect(page).toHaveURL(/\/$/);

  const cookies = await page.context().cookies();
  expect(cookies.some((cookie) => cookie.name === 'portal_user' && cookie.value === 'elev%40test.ro')).toBeTruthy();

  const banner = page.locator('.cookie-banner');
  if ((await banner.count()) > 0) {
    await expect(banner).toContainText('elev@test.ro');
  }
});

test('feature 3: documents CRUD flow (create, update, delete) works end-to-end', async ({ page }) => {
  const title = 'Document E2E Assignment';

  await page.goto('/documente');
  await expect(page.getByRole('heading', { name: 'DOCUMENTE SCOLARE' })).toBeVisible();

  await page.getByRole('link', { name: 'ADAUGARE' }).click();
  await page.getByLabel('Titlu').fill(title);
  await page.getByLabel('Categorie').fill('QA');
  await page.getByLabel('Emitent').fill('Echipa Testare');
  await page.getByLabel('Data emiterii').fill('2026-04-02');
  await page.getByLabel('Status').selectOption('Activ');
  await page.getByLabel('Descriere').fill('Descriere pentru scenariul end-to-end Assignment 1.');
  await page.getByRole('button', { name: 'Creeaza document' }).click();

  await expect(page.getByRole('heading', { name: title })).toBeVisible();

  await page.getByRole('link', { name: 'Editeaza' }).click();
  await page.getByLabel('Status').selectOption('Arhivat');
  await page.getByRole('button', { name: 'Salveaza modificarile' }).click();
  await expect(page.getByText('Arhivat')).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Sterge' }).click();

  await expect(page).toHaveURL(/\/documente$/);
  await expect(page.getByRole('heading', { name: 'DOCUMENTE SCOLARE' })).toBeVisible();
  await expect(page.getByRole('button', { name: title })).toHaveCount(0);

});

