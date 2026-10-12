import { test, expect, type Page } from "@playwright/test";

/**
 * Critical launch flows. Needs a running stack seeded with `scripts.seed` and
 * `scripts.seed_rich` (store `mah-style`, seller sara@nisha.demo).
 *
 *   E2E_BASE_URL=http://localhost:3001 E2E_API_URL=http://localhost:9000 npx playwright test
 */

const STORE = process.env.E2E_STORE ?? "mah-style";
const SELLER_EMAIL = process.env.E2E_SELLER_EMAIL ?? "sara@nisha.demo";
const CUSTOMER_EMAIL = process.env.E2E_CUSTOMER_EMAIL ?? "maryam@nisha.demo";
const PASSWORD = process.env.E2E_PASSWORD ?? "demo123456";

// Valid 1x1 PNG.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

let invoiceCode = "";
let invoicePassword = "";

async function collectErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test.describe("purchase lifecycle", () => {
test.describe.configure({ mode: "serial" });

test("guest can buy, upload a receipt and track the order", async ({ page }) => {
  const errors = await collectErrors(page);

  await page.goto(`/store/${STORE}`);
  await page.getByRole("button", { name: /^افزودن .* به سبد$/ }).first().click();
  await page.getByText("ادامه خرید").first().click();
  await page.waitForURL(/\/checkout$/);

  await page.getByLabel("نام کامل").fill("خریدار تست خودکار");
  await page.getByLabel("تلفن").fill("09120000000");
  await page.getByLabel("آدرس تحویل").fill("تهران، خیابان تست، پلاک ۱");
  await page.locator("form button[type=submit]").last().click();

  await expect(page.getByRole("heading", { name: "سفارش با موفقیت ثبت شد" })).toBeVisible({ timeout: 30_000 });
  invoiceCode = (await page.getByText(/^NV-[0-9A-F]{8}$/).first().innerText()).trim();
  const codes = await page.locator("code, .font-mono").allInnerTexts();
  invoicePassword = codes.map((c) => c.trim()).find((c) => /^[A-Za-z0-9]{12}$/.test(c)) ?? "";
  expect(invoiceCode).toMatch(/^NV-/);
  expect(invoicePassword).toHaveLength(12);

  await page.locator("input[type=file]").first().setInputFiles({ name: "receipt.png", mimeType: "image/png", buffer: PNG });
  const pw = page.getByLabel("رمز فاکتور");
  if (await pw.isVisible() && !(await pw.inputValue())) await pw.fill(invoicePassword);
  await page.getByRole("button", { name: "بارگذاری رسید" }).click();
  await expect(page.getByText(/رسید.*(ثبت|بارگذاری) شد|پرداخت بارگذاری شد/).first()).toBeVisible({ timeout: 30_000 });

  await page.goto("/track-order");
  await page.getByLabel(/کد فاکتور/).fill(invoiceCode);
  await page.getByLabel(/رمز/).first().fill(invoicePassword);
  await page.locator("form button[type=submit]").first().click();
  await expect(page.getByText(invoiceCode).first()).toBeVisible({ timeout: 30_000 });

  expect(errors).toEqual([]);
});

test("seller sees the new order and confirms payment", async ({ page }) => {
  test.skip(!invoiceCode, "depends on the guest checkout test");
  const errors = await collectErrors(page);

  await page.goto("/seller/login");
  await page.getByLabel("ایمیل").fill(SELLER_EMAIL);
  await page.getByLabel("رمز عبور").fill(PASSWORD);
  await page.locator("form button[type=submit]").click();
  await page.waitForURL(/\/seller\/dashboard/);

  await page.goto("/seller/orders");
  await page.getByText(invoiceCode).first().click();
  await expect(page.getByRole("heading", { name: invoiceCode })).toBeVisible();
  await expect(page.getByText(/هزینه ارسال/)).toBeVisible();
  await expect(page.getByText("CARD_TO_CARD")).toHaveCount(0);

  await page.getByRole("button", { name: "تایید پرداخت" }).click();
  const confirm = page.getByRole("dialog").getByRole("button", { name: /تایید/ });
  if (await confirm.isVisible().catch(() => false)) await confirm.click();
  await expect(page.getByText("پرداخت تایید شد").first()).toBeVisible({ timeout: 30_000 });

  expect(errors).toEqual([]);
});

test("customer portal lists past orders", async ({ page }) => {
  await page.goto("/customer/login");
  await page.getByLabel(/ایمیل|موبایل/).first().fill(CUSTOMER_EMAIL);
  await page.getByLabel("رمز عبور").fill(PASSWORD);
  await page.locator("form button[type=submit]").click();
  await page.waitForURL(/\/customer(?!\/login)/);
  await page.goto("/customer/orders");
  await expect(page.getByText(/NV-[0-9A-F]{8}/).first()).toBeVisible();
});

});

const MOBILE_WIDTH = 375;

// On mobile, content wider than the device grows the layout viewport (innerWidth) itself,
// so compare against the device width rather than innerWidth.
async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    (w) => Math.max(document.documentElement.scrollWidth, window.innerWidth) - w,
    MOBILE_WIDTH,
  );
}

test.describe("mobile layout", () => {
  test.use({ viewport: { width: MOBILE_WIDTH, height: 812 }, isMobile: true, hasTouch: true });

  for (const path of ["/", "/pricing", "/about", "/track-order", `/store/${STORE}`, `/store/${STORE}/checkout`, "/seller/login", "/customer/login"]) {
    test(`no horizontal scroll on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  test("seller panel fits the screen", async ({ page }) => {
    await page.goto("/seller/login");
    await page.getByLabel("ایمیل").fill(SELLER_EMAIL);
    await page.getByLabel("رمز عبور").fill(PASSWORD);
    await page.locator("form button[type=submit]").click();
    await page.waitForURL(/\/seller\/dashboard/);
    for (const path of ["/seller/dashboard", "/seller/orders", "/seller/products", "/seller/analytics", "/seller/customers"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expect(await horizontalOverflow(page), path).toBeLessThanOrEqual(1);
    }
  });
});
