import { EditTaxRateService } from './EditTaxRate.service';

describe('EditTaxRateService', () => {
  const oldTaxRate = {
    id: 1,
    name: 'VAT',
    code: 'VAT14',
    rate: 14,
    active: true,
  };

  const build = () => {
    const builder: any = {};
    ['modify', 'findById', 'patch', 'delete'].forEach((m) => {
      builder[m] = jest.fn(() => builder);
    });
    // `await query().modify().findById(id)` resolves to the old rate.
    builder.then = (resolve) => resolve(oldTaxRate);
    builder.insertAndFetch = jest.fn(async (data) => ({ ...data, id: 2 }));
    builder.patchAndFetchById = jest.fn(async (id, data) => ({
      ...oldTaxRate,
      ...data,
    }));
    const taxRateModel = () => ({ query: () => builder });

    const service = new EditTaxRateService(
      { emitAsync: jest.fn() } as any,
      { withTransaction: (work) => work({}) } as any,
      { validateTaxRateExistance: jest.fn() } as any,
      taxRateModel as any,
    );
    return { service, builder };
  };

  it('soft-deletes the old rate instead of hard-deleting it when the rate changes', async () => {
    const { service, builder } = build();

    const taxRate = await service.editTaxRate(1, {
      name: 'VAT 14%',
      code: 'VAT14',
      rate: 14,
    } as any);

    // A hard delete breaks the FK from accounts_transactions/items_entries.
    expect(builder.delete).not.toHaveBeenCalled();
    expect(builder.patch).toHaveBeenCalledWith({ deletedAt: expect.any(Date) });
    expect(builder.insertAndFetch).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'VAT 14%', rate: 14 }),
    );
    expect(taxRate.id).toBe(2);
  });

  it('patches in place when only non-identifying fields change', async () => {
    const { service, builder } = build();

    await service.editTaxRate(1, {
      ...oldTaxRate,
      description: 'Standard rate',
    } as any);

    expect(builder.patch).not.toHaveBeenCalled();
    expect(builder.insertAndFetch).not.toHaveBeenCalled();
    expect(builder.patchAndFetchById).toHaveBeenCalled();
  });
});
