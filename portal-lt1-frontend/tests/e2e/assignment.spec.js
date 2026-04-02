import { expect, test } from '@playwright/test';

test('landing page, auth pages and documents master-detail flow work', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'LICEUL TEHNOLOGIC NR. 1' })).toBeVisible();

  await page.getByRole('link', { name: 'Despre Noi' }).click();
  await expect(page.getByRole('heading', { name: 'CINE SUNTEM?' })).toBeVisible();

  await page.getByRole('link', { name: 'Contact' }).click();
  await expect(page.getByLabel('Nume și Prenume')).toBeVisible();

  await page.getByRole('link', { name: 'Calendar' }).click();
  await expect(page.getByText('Program de Munca')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generare Orar' })).toBeVisible();

  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await page.getByRole('link', { name: 'Acasa' }).click();

  await page.getByRole('link', { name: 'Documente' }).click();
  await expect(page.getByRole('heading', { name: 'DOCUMENTE SCOLARE' })).toBeVisible();
  await expect(page.getByText('Regulament intern 2026')).toBeVisible();

  await page.getByRole('button', { name: 'CARDURI' }).click();
  await expect(page.getByText('Regulament intern 2026')).toBeVisible();

  await page.getByRole('button', { name: 'Regulament intern 2026' }).click();
  await expect(page.getByRole('heading', { name: 'Regulament intern 2026' })).toBeVisible();
});

