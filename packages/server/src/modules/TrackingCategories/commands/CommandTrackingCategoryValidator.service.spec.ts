import { TrackingCategoryModule } from '../types/TrackingCategory.types';
import { CommandTrackingCategoryValidator } from './CommandTrackingCategoryValidator.service';

const buildCategory = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  name: 'Location',
  active: true,
  modules: [TrackingCategoryModule.ManualJournals],
  options: [{ id: 2, name: 'North Store', active: true }],
  ...overrides,
});

const buildValidator = (categories: Record<string, unknown>[]) => {
  const queryBuilder = {
    whereIn: jest.fn().mockReturnThis(),
    withGraphFetched: jest.fn().mockResolvedValue(categories),
  };
  const trackingCategoryModel = jest.fn(() => ({
    query: () => queryBuilder,
  }));

  return new CommandTrackingCategoryValidator(
    trackingCategoryModel as any,
    jest.fn() as any,
    jest.fn() as any,
    jest.fn() as any,
  );
};

const buildEntry = () => ({
  index: 1,
  trackingCategories: [{ categoryId: 1, optionId: 2 }],
});

describe('CommandTrackingCategoryValidator', () => {
  describe('validateEntries', () => {
    it('rejects a category that is not available for manual journals', async () => {
      const validator = buildValidator([
        buildCategory({
          modules: [TrackingCategoryModule.SaleInvoices],
        }),
      ]);

      await expect(
        validator.validateEntries([buildEntry()]),
      ).rejects.toMatchObject({
        errorType: 'TRACKING_CATEGORY_MODULE_NOT_ALLOWED',
      });
    });

    it('rejects a category with no modules assigned', async () => {
      const validator = buildValidator([buildCategory({ modules: [] })]);

      await expect(
        validator.validateEntries([buildEntry()]),
      ).rejects.toMatchObject({
        errorType: 'TRACKING_CATEGORY_MODULE_NOT_ALLOWED',
      });
    });

    it('allows a category already used by the journal', async () => {
      const validator = buildValidator([
        buildCategory({
          modules: [TrackingCategoryModule.SaleInvoices],
        }),
      ]);

      await expect(
        validator.validateEntries([buildEntry()], {
          previousCategoryIds: [1],
        }),
      ).resolves.toBeUndefined();
    });

    it('allows a category available for manual journals', async () => {
      const validator = buildValidator([buildCategory()]);

      await expect(
        validator.validateEntries([buildEntry()]),
      ).resolves.toBeUndefined();
    });

    it('treats legacy categories without modules as available', async () => {
      const validator = buildValidator([buildCategory({ modules: null })]);

      await expect(
        validator.validateEntries([buildEntry()]),
      ).resolves.toBeUndefined();
    });
  });
});
