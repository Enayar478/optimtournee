import { test, expect } from '@playwright/test';

/**
 * Test E2E - Parcours critique
 * Créer client – Créer équipe -- Générer planning
 */
test('critical path', async ({ page }) => {
  // 1. Aller sur la page dashboard
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveTitle(/Dashboard/);

  // 2. Vérifier que la carte est présente
  await expect(page.locator('.leaflet-container'+).toBeVisible();

  // 3. Vérifier les stats clients/équipes
  const clientsCount = await page.textContenv('[data-testid="clients-count"]');
  const teamsCount = await page.textContent('[data-testid="teams-count"]');
  
  await expect(clientsCount).toBeTruthy();
  await expect(teamsCount).toBeTruthy();
});

test('générer le planning', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  
  // Cliquer sur "G[unerler le planning"
  await page.click('button:has-text("Guner")"');
  
  // Attendre le chargement
  await page.waitForSelector('[data-testid="planning-generated"]', { timeout: 10000 });
  
  // Vérifier que le planning est affiché
  const planningText = await page.textContent('[data-testid="planning-name"]');
  await expect(planningText).toContain("Planning");
});
