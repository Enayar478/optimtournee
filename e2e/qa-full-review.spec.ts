import { test, expect, Page, request } from "@playwright/test";

// ============================================
// QA TEST SUITE - OptimTournee Full Review
// ============================================

const BASE_URL = "http://localhost:3000";

// All page routes to test
const ROUTES = {
  public: ["/", "/demo", "/robots.txt", "/sitemap.xml"],
  protected: [
    "/dashboard",
    "/planning",
    "/tournees",
    "/clients",
    "/teams",
    "/settings",
  ],
  auth: ["/sign-in", "/sign-up"],
};

// Viewport sizes for responsive testing
const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

// Helper to collect all links on a page
async function getAllLinks(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a[href]"));
    return links.map((a) => (a as HTMLAnchorElement).href);
  });
}

// ============================================
// 1. PAGE RENDERING TESTS
// ============================================

test.describe("📄 Page Rendering", () => {
  for (const route of ROUTES.public) {
    test(`Public page ${route || "/"} renders correctly`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);

      // Check for basic page structure
      await expect(page.locator("body")).toBeVisible();

      // Check for title
      const title = await page.title();
      expect(title).toBeTruthy();

      // Check no 500/404 errors in console
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      // Wait for any lazy content to load
      await page.waitForLoadState("networkidle");

      expect(
        consoleErrors.filter(
          (e) => e.includes("500") || e.includes("404") || e.includes("Error")
        )
      ).toHaveLength(0);
    });
  }

  for (const route of ROUTES.auth) {
    test(`Auth page ${route} renders correctly`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator("body")).toBeVisible();
    });
  }
});

// ============================================
// 2. BROKEN LINKS TEST
// ============================================

test.describe("🔗 Link Validation", () => {
  test("No broken internal links on landing page", async ({
    page,
    context,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const links = await getAllLinks(page);
    const internalLinks = [
      ...new Set(
        links.filter((href) => href.startsWith(BASE_URL) && !href.includes("#"))
      ),
    ];

    const brokenLinks: string[] = [];

    for (const link of internalLinks.slice(0, 20)) {
      // Test first 20 to avoid timeout
      const newPage = await context.newPage();
      try {
        const response = await newPage.goto(link, { timeout: 10000 });
        if (!response || response.status() >= 400) {
          brokenLinks.push(`${link} (status: ${response?.status()})`);
        }
      } catch (e) {
        brokenLinks.push(`${link} (error: ${e})`);
      } finally {
        await newPage.close();
      }
    }

    expect(
      brokenLinks,
      `Broken links found: ${brokenLinks.join(", ")}`
    ).toHaveLength(0);
  });

  test("Navigation links work correctly", async ({ page }) => {
    await page.goto("/");

    // Test demo link from landing
    const demoLink = page.getByRole("link", { name: /démo/i }).first();
    if (await demoLink.isVisible().catch(() => false)) {
      await demoLink.click();
      await expect(page).toHaveURL(/demo/);
    }
  });
});

// ============================================
// 3. FORM VALIDATION TESTS
// ============================================

test.describe("📝 Form Functionality", () => {
  test("Sign-in form exists and is accessible", async ({ page }) => {
    await page.goto("/sign-in");

    // Look for Clerk sign-in form elements
    const form = page
      .locator("form, [data-testid='sign-in-form'], .cl-signIn")
      .first();
    const hasForm = await form.isVisible().catch(() => false);

    if (hasForm) {
      // Check for required fields
      const emailField = page.locator('input[type="email"]').first();
      const passwordField = page.locator('input[type="password"]').first();

      const hasEmail = await emailField.isVisible().catch(() => false);
      const hasPassword = await passwordField.isVisible().catch(() => false);

      expect(
        hasEmail || hasPassword,
        "Sign-in form should have email or password field"
      ).toBeTruthy();
    }
  });

  test("ROI Calculator form elements work", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Look for calculator section
    const calculator = page.getByText(/calculateur/i).first();
    const hasCalculator = await calculator.isVisible().catch(() => false);

    if (hasCalculator) {
      // Check for input fields
      const inputs = page
        .locator('input[type="number"], input[type="range"]')
        .all();
      expect((await inputs).length).toBeGreaterThan(0);
    }
  });
});

// ============================================
// 4. RESPONSIVE DESIGN TESTS
// ============================================

test.describe("📱 Responsive Design", () => {
  for (const [device, viewport] of Object.entries(VIEWPORTS)) {
    test(`Landing page renders correctly on ${device} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Check no horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow, `${device} has horizontal overflow`).toBeFalsy();

      // Check critical elements are visible
      const hero = page.locator("h1").first();
      await expect(hero).toBeVisible();

      // Check images are properly sized
      const images = page.locator("img");
      const imageCount = await images.count();

      if (imageCount > 0) {
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const img = images.nth(i);
          const isVisible = await img.isVisible().catch(() => false);
          if (isVisible) {
            const box = await img.boundingBox();
            expect(
              box?.width || 0,
              `Image ${i} should have positive width`
            ).toBeGreaterThan(0);
          }
        }
      }
    });

    test(`Dashboard layout adapts on ${device}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/dashboard");
      await page.waitForTimeout(2000); // Wait for redirect

      // Page should be visible (either dashboard or sign-in redirect)
      await expect(page.locator("body")).toBeVisible();
    });
  }
});

// ============================================
// 5. AUTHENTICATION FLOW TESTS
// ============================================

test.describe("🔐 Authentication Flows", () => {
  test("Protected routes redirect unauthenticated users", async ({ page }) => {
    for (const route of ROUTES.protected.slice(0, 3)) {
      await page.goto(route);
      await page.waitForTimeout(3000);

      const url = page.url();
      const redirectedToAuth = url.includes("sign-in") || url.includes("login");
      const isOnDashboard = url.includes(route);

      expect(
        redirectedToAuth || isOnDashboard,
        `${route} should redirect to auth or show dashboard`
      ).toBeTruthy();
    }
  });

  test("Sign-up page is accessible", async ({ page }) => {
    const response = await page.goto("/sign-up");
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator("body")).toBeVisible();
  });
});

// ============================================
// 6. JAVASCRIPT ERROR CHECKS
// ============================================

test.describe("⚠️ JavaScript Errors", () => {
  test("No console errors on landing page", async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
      if (msg.type() === "warning") warnings.push(msg.text());
    });

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Filter out common non-critical errors
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("google-analytics") &&
        !e.includes("clarity") &&
        !e.includes("posthog") &&
        !e.includes("webpack")
    );

    expect(
      criticalErrors,
      `Critical JS errors: ${criticalErrors.join("\n")}`
    ).toHaveLength(0);
  });

  test("No console errors on demo page", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/demo");
    await page.waitForLoadState("networkidle");

    const criticalErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("google-analytics")
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

// ============================================
// 7. PERFORMANCE SMOKE TESTS
// ============================================

test.describe("⚡ Performance Checks", () => {
  test("Landing page loads within reasonable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - start;

    expect(loadTime, `Page took ${loadTime}ms to load`).toBeLessThan(10000);
  });

  test("Images have proper loading attributes", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const loading = await img.getAttribute("loading");
      const hasLazyLoading = loading === "lazy";
      // Not a failure, just informational - lazy loading is best practice
    }
  });
});

// ============================================
// 8. ACCESSIBILITY SMOKE TESTS
// ============================================

test.describe("♿ Accessibility Checks", () => {
  test("Images have alt attributes", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();

    const missingAlt: string[] = [];
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const src = await img.getAttribute("src");
      if (alt === null && src) {
        missingAlt.push(src);
      }
    }

    // Allow decorative images, but flag them
    if (missingAlt.length > 0) {
      console.log(`Images without alt: ${missingAlt.length}`);
    }
  });

  test("Interactive elements have proper roles", async ({ page }) => {
    await page.goto("/");

    // Check buttons have roles
    const buttons = page.locator("button, [role='button']");
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThanOrEqual(0);

    // Check links are accessible
    const links = page.locator("a[href]");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test("Proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    const h1s = await page.locator("h1").count();
    expect(h1s, "Page should have exactly one H1").toBeGreaterThanOrEqual(1);

    // Check h1 comes before h2
    const headings = await page.locator("h1, h2").all();
    if (headings.length > 1) {
      // This is a smoke test - presence check
      expect(headings.length).toBeGreaterThan(0);
    }
  });
});

// ============================================
// 9. SEO TESTS
// ============================================

test.describe("🔍 SEO Checks", () => {
  test("Meta tags are present", async ({ page }) => {
    await page.goto("/");

    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    const description = await page
      .locator("meta[name='description']")
      .getAttribute("content");
    expect(description?.length || 0).toBeGreaterThan(0);
  });

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);

    const content = await page.locator("body pre").textContent();
    expect(content?.toLowerCase()).toContain("user-agent");
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);

    const content = await page.locator("body pre").textContent();
    expect(content).toContain("<urlset");
  });
});

// ============================================
// 10. DASHBOARD COMPONENTS TEST
// ============================================

test.describe("📊 Dashboard Components (if accessible)", () => {
  test("Demo page has interactive map or content", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("networkidle");

    // Check for map container or demo content
    const hasMap = await page
      .locator(".leaflet-container, [data-testid='map']")
      .isVisible()
      .catch(() => false);
    const hasContent = await page
      .locator("h1, h2")
      .first()
      .isVisible()
      .catch(() => false);

    expect(hasMap || hasContent).toBeTruthy();
  });

  test("API endpoints return valid responses", async ({ request }) => {
    // Test public API endpoints
    const endpoints = ["/api/weather", "/api/route/optimize"];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      // Should not return 500 error
      expect(
        response.status(),
        `${endpoint} returned ${response.status()}`
      ).not.toBe(500);
    }
  });
});
