import { expect, test } from '@playwright/test';

test.describe('Feature 1: public navigation and presentation', () => {
  test('home page and menu navigation work', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'LICEUL TEHNOLOGIC NR. 1' })).toBeVisible();

    await page.getByRole('link', { name: 'Despre Noi' }).click();
    await expect(page.getByRole('heading', { name: 'CINE SUNTEM?' })).toBeVisible();

    await page.getByRole('link', { name: 'Calendar' }).click();
    await expect(page.getByRole('button', { name: 'Generare Orar' })).toBeVisible();

    await page.getByRole('link', { name: 'Activitate' }).click();
    await expect(page.getByRole('heading', { name: 'Monitorizare activitate si preferinte' })).toBeVisible();
    await expect(page.getByText('Total navigari:')).toBeVisible();
  });

  test('contact form blocks invalid and accepts valid message', async ({ page }) => {
    await page.goto('/contact');

    await page.getByRole('button', { name: 'TRIMITE' }).click();
    await expect(page.getByText('Numele este obligatoriu.')).toBeVisible();
    await expect(page.getByText('Email-ul este obligatoriu.')).toBeVisible();
    await expect(page.getByText('Mesajul este obligatoriu.')).toBeVisible();

    await page.getByLabel('Nume și Prenume').fill('Profesor Test');
    await page.getByLabel('Adresă de Email').fill('prof@test.ro');
    await page.getByLabel('Mesajul Tău').fill('Mesaj valid pentru testarea formularului de contact.');
    await page.getByRole('button', { name: 'TRIMITE' }).click();
    await expect(page.getByText('Mesajul a fost trimis cu succes.')).toBeVisible();
  });
});

test.describe('Feature 2: authentication flows', () => {
  test('login validation and successful login flow work', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: 'Autentificare' }).click();
    await expect(page.getByText('Email-ul este obligatoriu.')).toBeVisible();
    await expect(page.getByText('Parola este obligatorie.')).toBeVisible();

    await page.getByLabel('Email/Username').fill('elev@test.ro');
    await page.getByLabel('Parola').fill('parola123');
    await page.getByRole('button', { name: 'Autentificare' }).click();

    await expect(page).toHaveURL(/\/$/);
    const cookies = await page.context().cookies();
    expect(cookies.some((cookie) => cookie.name === 'portal_user' && cookie.value === 'elev%40test.ro')).toBeTruthy();
  });

  test('register validation and successful register flow work', async ({ page }) => {
    await page.goto('/register');

    await page.getByRole('button', { name: 'Creare cont' }).click();
    await expect(page.getByText('Numele este obligatoriu.')).toBeVisible();
    await expect(page.getByText('Email-ul este obligatoriu.')).toBeVisible();

    await page.getByLabel('Nume').fill('Elev Nou');
    await page.getByLabel('Email/Username').fill('elevnou@test.ro');
    await page.locator('#register-password').fill('parola123');
    await page.locator('#register-confirm-password').fill('parola123');
    await page.getByRole('button', { name: 'Creare cont' }).click();

    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('Feature 3: documents CRUD', () => {
  test('create-update-delete document flow works end-to-end', async ({ page }) => {
    const title = `Document E2E ${Date.now()}`;

    await page.goto('/documente');
    await expect(page.getByRole('heading', { name: 'DOCUMENTE SCOLARE' })).toBeVisible();

    await page.getByRole('link', { name: 'ADAUGARE' }).click();
    await page.getByLabel('Titlu').fill(title);
    await page.getByLabel('Categorie').fill('Administrativ');
    await page.getByLabel('Emitent').fill('Secretariat');
    await page.getByLabel('Data emiterii').fill('2026-04-02');
    await page.getByLabel('Status').selectOption('Activ');
    await page.getByLabel('Descriere').fill('Descriere valida pentru scenariul complet de CRUD in Playwright.');
    await page.getByRole('button', { name: 'Creeaza document' }).click();

    await expect(page.getByRole('heading', { name: title })).toBeVisible();

    await page.getByRole('link', { name: 'Editeaza' }).click();
    await page.locator('#status').selectOption('Arhivat');
    await page.getByRole('button', { name: 'Salveaza modificarile' }).click();
    await expect(page.getByText('Arhivat')).toBeVisible();

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Sterge' }).click();

    await expect(page).toHaveURL(/\/documente$/);
    await expect(page.getByRole('button', { name: new RegExp(title, 'i') })).toHaveCount(0);
  });

  test('documents list filtering and view switch work', async ({ page }) => {
    await page.goto('/documente');

    await page.getByLabel('Cautare').fill('biblioteca');
    await expect(page.getByRole('button', { name: /Regulament biblioteca scolara/i })).toBeVisible();

    await page.locator('#status').selectOption('Arhivat');
    await expect(page.getByRole('button', { name: /Regulament biblioteca scolara/i })).toBeVisible();

    await page.getByRole('button', { name: 'CARDURI' }).click();
    await expect(page.getByRole('button', { name: 'TABEL' })).toBeVisible();
  });
});

