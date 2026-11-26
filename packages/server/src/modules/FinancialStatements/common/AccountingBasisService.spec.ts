import { AccountingBasis } from '@/common/types/AccountingBasis';
import { AccountingBasisService } from './AccountingBasisService';

describe('AccountingBasisService.resolveQuery', () => {
  it.each([AccountingBasis.Cash, AccountingBasis.Accrual])(
    'returns a new query with the %s organization preference',
    async (basis) => {
      const service = new AccountingBasisService(jest.fn());
      const preference = jest.spyOn(service, 'getOrganizationBasis');
      preference.mockResolvedValue(basis);
      const query = Object.freeze({ fromDate: '2026-01-01' });

      const filter = await service.resolveQuery(query);

      expect(filter).toEqual({ ...query, basis });
      expect(query).not.toHaveProperty('basis');
      expect(preference).toHaveBeenCalledTimes(1);
    },
  );

  it('keeps an explicit basis without reading organization settings', async () => {
    const settingsStore = jest.fn();
    const service = new AccountingBasisService(settingsStore);
    const query = Object.freeze({ basis: AccountingBasis.Accrual });

    const filter = await service.resolveQuery(query);

    expect(filter).toEqual(query);
    expect(filter).not.toBe(query);
    expect(settingsStore).not.toHaveBeenCalled();
  });
});
