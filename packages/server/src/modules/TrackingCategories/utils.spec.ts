import {
  TRACKING_CATEGORY_MODULES,
  TrackingCategoryModule,
} from './types/TrackingCategory.types';
import {
  getAssignedTrackingCategoryIds,
  isTrackingCategoryAvailableForModule,
  normalizeTrackingCategoryModules,
} from './utils';

describe('tracking category modules utils', () => {
  it('falls back to all modules when modules are missing', () => {
    expect(normalizeTrackingCategoryModules()).toEqual(
      TRACKING_CATEGORY_MODULES,
    );
    expect(normalizeTrackingCategoryModules(null)).toEqual(
      TRACKING_CATEGORY_MODULES,
    );
  });

  it('keeps an explicit empty modules list empty', () => {
    expect(normalizeTrackingCategoryModules([])).toEqual([]);
    expect(
      isTrackingCategoryAvailableForModule(
        { modules: [] },
        TrackingCategoryModule.ManualJournals,
      ),
    ).toBe(false);
  });

  it('normalizes modules to the supported list and canonical order', () => {
    expect(
      normalizeTrackingCategoryModules([
        TrackingCategoryModule.SaleEstimates,
        TrackingCategoryModule.SaleInvoices,
      ]),
    ).toEqual([
      TrackingCategoryModule.SaleInvoices,
      TrackingCategoryModule.SaleEstimates,
    ]);
  });

  it('checks the category availability for the given module', () => {
    const category = {
      modules: [TrackingCategoryModule.SaleInvoices],
    };

    expect(
      isTrackingCategoryAvailableForModule(
        category,
        TrackingCategoryModule.SaleInvoices,
      ),
    ).toBe(true);
    expect(
      isTrackingCategoryAvailableForModule(
        category,
        TrackingCategoryModule.ManualJournals,
      ),
    ).toBe(false);
  });

  it('treats legacy categories as available for all modules', () => {
    expect(
      isTrackingCategoryAvailableForModule(
        { modules: null },
        TrackingCategoryModule.ManualJournals,
      ),
    ).toBe(true);
  });
});

describe('tracking category assignments utils', () => {
  it('returns unique category ids from the given entries', () => {
    expect(
      getAssignedTrackingCategoryIds([
        { trackingCategories: [{ categoryId: 1, optionId: 10 }] },
        {
          trackingCategories: [
            { categoryId: 1, optionId: 11 },
            { categoryId: 2, optionId: 20 },
          ],
        },
      ]),
    ).toEqual([1, 2]);
  });

  it('returns an empty list when entries have no assignments', () => {
    expect(getAssignedTrackingCategoryIds()).toEqual([]);
    expect(
      getAssignedTrackingCategoryIds([{}, { trackingCategories: [] }]),
    ).toEqual([]);
  });
});
