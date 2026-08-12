import { test, expect, type Locator, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

const warehouseName = () =>
  `${faker.company.name()} ${faker.string.alphanumeric(4)}`;

const warehouseCode = () => faker.string.alphanumeric(5).toUpperCase();

/**
 * Closes the TanStack Query devtools panel.
 *
 * The devtools panel is opened by default in the dev webapp and overlays the
 * bottom of the viewport, which can cover the dialog's floating actions bar.
 */
async function closeQueryDevtools(page: Page) {
  const closeButton = page
    .getByRole("button", { name: "Close tanstack query devtools" })
    .first();
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }
}

/**
 * Waits until the warehouses preferences page is loaded.
 */
async function waitForWarehousesPage(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Warehouses", exact: true }),
  ).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * Waits until the warehouses page settles into either the "not activated"
 * (empty status with activate button) or "activated" (grid with the new
 * warehouse button) state and returns whether the feature still needs to be
 * activated. Keeps the activation test re-runnable against an org that has
 * already activated the feature.
 */
async function waitForWarehousesState(page: Page): Promise<boolean> {
  const activateButton = page.getByRole("button", {
    name: "Activate Warehouses",
  });
  const newWarehouseButton = page.getByRole("button", {
    name: "New Warehouse",
  });

  await Promise.race([
    activateButton.waitFor({ state: "visible", timeout: 30_000 }),
    newWarehouseButton.waitFor({ state: "visible", timeout: 30_000 }),
  ]);

  return activateButton.isVisible().catch(() => false);
}

/**
 * Opens the new warehouse dialog.
 */
async function openNewWarehouseDialog(page: Page): Promise<Locator> {
  await closeQueryDevtools(page);
  await page.getByRole("button", { name: "New Warehouse" }).click();

  const dialog = page.getByTestId("warehouse-form-dialog");
  await expect(dialog).toBeVisible({ timeout: 30_000 });
  await expect(dialog.locator('input[name="name"]')).toBeVisible({
    timeout: 30_000,
  });

  return dialog;
}

/**
 * Creates a warehouse through the UI and expects the success toast.
 */
async function createWarehouse(
  page: Page,
  { name, code }: { name: string; code: string },
) {
  const dialog = await openNewWarehouseDialog(page);

  await dialog.locator('input[name="name"]').fill(name);
  await dialog.locator('input[name="code"]').fill(code);

  await closeQueryDevtools(page);
  await dialog.getByRole("button", { name: "Save" }).click();

  await expect(
    page.getByText("The warehouse has been created successfully."),
  ).toBeVisible({ timeout: 15_000 });
}

/**
 * Locates the warehouse grid item matching the given warehouse name.
 */
async function findWarehouseItem(page: Page, name: string): Promise<Locator> {
  const item = page
    .getByTestId("warehouse-item")
    .filter({ hasText: name })
    .first();
  await expect(item).toBeVisible({ timeout: 15_000 });
  return item;
}

/**
 * Deletes the given warehouse grid item through the context menu and expects
 * the success toast.
 */
async function deleteWarehouseViaItem(page: Page, item: Locator) {
  await item.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Delete Warehouse" }).click();

  await expect(page.getByTestId("warehouse-delete-alert")).toBeVisible();
  await page
    .getByRole("dialog")
    .filter({ has: page.getByTestId("warehouse-delete-alert") })
    .getByRole("button", { name: "Delete" })
    .click();

  await expect(
    page.getByText("The warehouse has been deleted successfully"),
  ).toBeVisible({ timeout: 15_000 });
}

test.describe("warehouses", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/preferences/warehouses");
    await waitForWarehousesPage(page);
  });

  test("should activate the warehouses feature.", async ({ page }) => {
    const needsActivation = await waitForWarehousesState(page);

    if (needsActivation) {
      await closeQueryDevtools(page);
      await page.getByRole("button", { name: "Activate Warehouses" }).click();

      const dialog = page.getByRole("dialog");
      await expect(dialog).toContainText(
        "The current organization will be considered as the Head Office or Primary warehouse.",
        { timeout: 30_000 },
      );
      await dialog.getByRole("button", { name: "Activate Warehouses" }).click();

      await expect(
        page.getByText(
          "Multi-branches feature has been activated successfully.",
        ),
      ).toBeVisible({ timeout: 15_000 });
    }

    // The primary warehouse is created as part of the activation.
    await expect(
      page
        .getByTestId("warehouse-item")
        .filter({ hasText: "Primary Warehouse" }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("button", { name: "New Warehouse" }),
    ).toBeVisible();
  });

  test("should show the warehouses page.", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "New Warehouse" }),
    ).toBeVisible();

    await expect(
      page
        .getByTestId("warehouse-item")
        .filter({ hasText: "Primary Warehouse" }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("should validate the required fields of the new warehouse dialog.", async ({
    page,
  }) => {
    const dialog = await openNewWarehouseDialog(page);

    await dialog.getByRole("button", { name: "Save" }).click();

    await expect(dialog).toContainText(/required field/i, {
      timeout: 15_000,
    });
  });

  test("should create a warehouse successfully.", async ({ page }) => {
    const name = warehouseName();
    const code = warehouseCode();

    await createWarehouse(page, { name, code });

    const item = await findWarehouseItem(page, name);
    await expect(item).toContainText(code, { timeout: 15_000 });
  });

  test("should edit a warehouse successfully.", async ({ page }) => {
    const name = warehouseName();
    const newName = warehouseName();

    await createWarehouse(page, { name, code: warehouseCode() });

    const item = await findWarehouseItem(page, name);
    await item.click({ button: "right" });
    await page.getByRole("menuitem", { name: "Edit Warehouse" }).click();

    const dialog = page.getByTestId("warehouse-form-dialog");
    await expect(dialog).toBeVisible({ timeout: 30_000 });
    await expect(dialog.locator('input[name="name"]')).toHaveValue(name, {
      timeout: 30_000,
    });

    await dialog.locator('input[name="name"]').fill(newName);

    await closeQueryDevtools(page);
    await dialog.getByRole("button", { name: "Save" }).click();

    // The edit mutation shares the same success toast as create, so the
    // reliable signal is the dialog closing and the row reflecting the change.
    await expect(dialog).toBeHidden({ timeout: 15_000 });

    await findWarehouseItem(page, newName);
  });

  test("should delete a warehouse successfully.", async ({ page }) => {
    const name = warehouseName();

    await createWarehouse(page, { name, code: warehouseCode() });

    const item = await findWarehouseItem(page, name);
    await deleteWarehouseViaItem(page, item);

    await expect(
      page.getByTestId("warehouse-item").filter({ hasText: name }),
    ).toHaveCount(0, { timeout: 15_000 });
  });

  test("should mark a warehouse as primary.", async ({ page }) => {
    const name = warehouseName();

    await createWarehouse(page, { name, code: warehouseCode() });

    const item = await findWarehouseItem(page, name);
    await item.click({ button: "right" });
    await page.getByRole("menuitem", { name: "Mark as Primary" }).click();

    await expect(
      page.getByText("The given warehouse has been marked as primary."),
    ).toBeVisible({ timeout: 15_000 });
  });
});
