import { test, expect } from '@playwright/test';

test('Candidate Full Flow Submission', async ({ page }) => {
  // --- PART 1: LOGIN ---
  await page.goto('http://127.0.0.1:5500/');
  await page.getByRole('button', { name: 'Candidate' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // --- PART 2: FILL THE CANDIDATE FORM ---
  
  // Wait for the form to load
  await page.waitForSelector('#candidate-name');

  // Fill the Name (Using ID)
  await page.locator('#candidate-name').fill('Auto Test User');

  // Fill the Email (Using ID)
  await page.locator('#candidate-email').fill('auto@test.com');

  // Fill the Phone (Using ID)
  await page.locator('#candidate-phone').fill('9876543210');

  // Fill the ID (Using ID)
  await page.locator('#candidate-id').fill('ID-999');

  // Fill the Company (Using ID)
  await page.locator('#candidate-company').fill('Test Automation Inc');

  // Handle the Alert (Popup) automatically
  // We accept the dialog, which confirms the submit action happened
  const dialogPromise = page.waitForEvent('dialog');
  await page.locator('#submit-application-btn').click(); // <--- CLICKED ONLY ONCE
  const dialog = await dialogPromise;
  console.log(`Dialog message: ${dialog.message()}`);
  await dialog.accept();

  // After accepting the alert, manually click the "Back to Login" link
  // This ensures we definitely leave the page
  await page.locator('text=Back to Login').click();
  
  // Now wait for the Login page to appear
  await page.waitForURL('**/index.html');

});