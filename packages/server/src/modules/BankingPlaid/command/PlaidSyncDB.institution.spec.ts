import { PlaidSyncDb } from './PlaidSyncDB';

const buildSyncDb = (patch: jest.Mock, findOne: jest.Mock) =>
  new PlaidSyncDb(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    (() => ({})) as any,
    (() => ({ query: () => ({ findOne }) })) as any,
    (() => ({})) as any,
  );

const buildPlaidItem = (overrides: any = {}) => ({
  plaidItemId: 'item-1',
  plaidInstitutionName: 'Old Bank',
  plaidInstitutionLogo: 'old-logo',
  ...overrides,
});

describe('PlaidSyncDb', () => {
  describe('syncPlaidItemInstitution', () => {
    it('stores the institution metadata when it changed', async () => {
      const patch = jest.fn().mockResolvedValue(1);
      const findOne = jest.fn(() => ({ patch }));
      const syncDb = buildSyncDb(patch, findOne);

      await syncDb.syncPlaidItemInstitution(
        buildPlaidItem() as any,
        { name: 'New Bank', logo: 'new-logo' } as any,
      );

      expect(findOne).toHaveBeenCalledWith({
        plaidItemId: 'item-1',
      });
      expect(patch).toHaveBeenCalledWith({
        plaidInstitutionName: 'New Bank',
        plaidInstitutionLogo: 'new-logo',
      });
    });

    it('keeps the cached logo when Plaid returns none', async () => {
      const patch = jest.fn();
      const findOne = jest.fn(() => ({ patch }));
      const syncDb = buildSyncDb(patch, findOne);

      await syncDb.syncPlaidItemInstitution(
        buildPlaidItem() as any,
        { name: 'Old Bank', logo: null } as any,
      );

      expect(patch).not.toHaveBeenCalled();
    });
  });
});
