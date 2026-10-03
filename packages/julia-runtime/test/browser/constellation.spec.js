import { expect, test } from '@playwright/test';

async function assignUniqueWindowIdentity(page) {
  const ip = `192.0.2.${Math.floor(Math.random() * 200) + 20}`;
  await page.route('**/api/julia-window', (route) => route.continue({
    headers: { ...route.request().headers(), 'x-forwarded-for': ip },
  }));
}

test('homepage is mobile-safe and exposes route-specific semantic metadata', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    window.__primeVitals = { cls: 0, lcp: null };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput && entry.entryType === 'layout-shift') window.__primeVitals.cls += entry.value;
        if (entry.entryType === 'largest-contentful-paint') window.__primeVitals.lcp = entry.startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__primeVitals.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.goto('/');
  await expect(page).toHaveTitle(/PRIME-AI — Sovereign Cognitive Infrastructure/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://prime-ai.fr/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /models, memory/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your intelligence. Your infrastructure. Your control.');
  await expect(page.getByRole('heading', { name: /One governed path from models to execution/ })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__primeVitals.lcp)).not.toBeNull();
  const layout = await page.evaluate(() => {
    return {
      width: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
      cls: window.__primeVitals.cls,
      lcp: window.__primeVitals.lcp,
    };
  });
  expect(layout.width).toBeLessThanOrEqual(layout.viewport);
  expect(layout.cls).toBeLessThanOrEqual(0.1);
  expect(layout.lcp).not.toBeNull();
  expect(layout.lcp).toBeLessThan(5000);
  expect(consoleErrors).toEqual([]);
  const screenshotPath = testInfo.project.name === 'mobile-iphone15'
    ? 'public/julia/prime-ai-mobile.png'
    : 'public/julia/prime-ai-desktop.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
});

test('constellation exposes all three sites and LinkedIn with the current-site indicator', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /ONE ECOSYSTEM/ });
  await toggle.click();
  const drawer = page.getByRole('navigation', { name: 'Sovereign Constellation' });
  await expect(drawer.getByRole('link', { name: 'YACE19AI' })).toBeVisible();
  const sites = drawer.locator('.constellation-site');
  await expect(sites.nth(1).locator('summary')).toContainText('PRIME-AI');
  await expect(sites.nth(2).locator('summary')).toContainText('AMLAZR');
  await expect(sites.nth(3).locator('summary')).toContainText('LinkedIn');
  await expect(drawer.getByText('Current site')).toBeVisible();
  await sites.nth(0).locator('summary').click();
  await expect(drawer.getByRole('link', { name: 'Research' })).toHaveAttribute('href', 'https://yace19ai.com/research');
  await sites.nth(2).locator('summary').click();
  await expect(drawer.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', 'https://amlazr.com/');
});

test('infrastructure pages explain deployment boundaries with route-specific metadata', async ({ page }) => {
  const pages = [
    ['/technologie', /Connect intelligence to the environments you govern/],
    ['/ecosysteme', /Three complementary roles/],
    ['/sovereign-ai', /Sovereignty is defined by four deployment choices/],
    ['/multi-agent-systems', /Give each agent a defined role/],
    ['/enterprise-ai-orchestration', /Connect workflows without handing over control/],
  ];
  for (const [path, heading] of pages) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content', '');
    const metadata = JSON.parse(await page.locator('#prime-ai-structured-data').textContent());
    expect(metadata['@graph'].some((node) => node['@type'] === 'WebPage')).toBe(true);
    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.viewport);
  }
});

test('legacy public routes redirect and country pages disclose unverified deployments', async ({ page }) => {
  for (const path of ['/credentials', '/revenue']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/(?:\?lang=en)?$/);
  }
  await page.goto('/fleet-command');
  await expect(page).toHaveURL(/\/orchestration(?:\?lang=en)?$/);
  await page.goto('/uk');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Plan a deployment in United Kingdom');
  await expect(page.getByText(/does not confirm an active regional node/)).toBeVisible();
  await expect(page.getByText(/TODO — Confirm regions/)).toBeVisible();
  const countryWidth = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(countryWidth.scroll).toBeLessThanOrEqual(countryWidth.viewport);
});

test('Cyber Surveyor identifies its sample panels as non-live and unmeasured', async ({ page }) => {
  await page.goto('/surveyor');
  await expect(page.getByText(/Operator preview only. No live production scans/)).toBeVisible();
  await expect(page.getByText(/PREVIEW · NO LIVE DATA/)).toBeVisible();
  await expect(page.getByText('Not measured').first()).toBeVisible();
  await expect(page.getByText('Not run').first()).toBeVisible();
});

test('Julia portal opens, runs the scripted state sequence, and ends at the issuer expiry', async ({ page }) => {
  await assignUniqueWindowIdentity(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Talk with Julia' }).click();
  const dialog = page.getByRole('dialog', { name: 'Julia assistant' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Start free 5-minute session' }).click();
  await expect(dialog.locator('.julia-status .state')).toHaveText(/listening|thinking|speaking/);
  await expect(dialog.getByText(/Our five-minute window has ended/)).toBeVisible({ timeout: 8000 });
  await expect(dialog.locator('.julia-countdown')).toHaveText('0:00');
  await expect(dialog.getByRole('link', { name: 'Discuss a private deployment' })).toBeVisible();
});

test('Agent Mode runs the approved page highlight tool and provides an always-visible stop control', async ({ page }, testInfo) => {
  await assignUniqueWindowIdentity(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Talk with Julia' }).click();
  const dialog = page.getByRole('dialog', { name: 'Julia assistant' });
  await dialog.getByRole('button', { name: 'Start free 5-minute session' }).click();
  await expect(dialog.locator('.julia-countdown')).not.toHaveText('');
  await dialog.getByRole('button', { name: 'Enter Agent Mode' }).click();
  await expect(page.getByRole('region', { name: 'Julia Agent Mode' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stop Agent Mode' })).toBeVisible();
  await expect(page.frameLocator('.julia-deck iframe').getByRole('heading', { level: 1 })).toBeVisible();
  const screenshotPath = testInfo.project.name === 'mobile-iphone15'
    ? 'public/julia/julia-agent-mode-mobile.png'
    : 'public/julia/julia-agent-mode-desktop.png';
  await page.screenshot({ path: screenshotPath });
  await page.getByRole('button', { name: 'Stop Agent Mode' }).click();
  await expect(page.getByRole('region', { name: 'Julia Agent Mode' })).toBeHidden();
});
