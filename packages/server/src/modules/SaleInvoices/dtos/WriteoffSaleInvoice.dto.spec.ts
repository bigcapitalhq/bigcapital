import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { WriteoffSaleInvoiceDto } from './WriteoffSaleInvoice.dto';

const invalidProperties = async (body: Record<string, unknown>) => {
  const errors = await validate(plainToInstance(WriteoffSaleInvoiceDto, body));
  return errors.map((error) => error.property);
};

describe('WriteoffSaleInvoiceDto', () => {
  it('accepts a body with only the expense account', async () => {
    await expect(
      invalidProperties({ expenseAccountId: 1024 }),
    ).resolves.toEqual([]);
  });

  it('accepts a full body', async () => {
    await expect(
      invalidProperties({
        expenseAccountId: 1024,
        date: '2023-03-15',
        reason: 'Customer bankrupt',
      }),
    ).resolves.toEqual([]);
  });

  it('requires the expense account', async () => {
    await expect(invalidProperties({})).resolves.toEqual(['expenseAccountId']);
  });

  it('rejects an ISO-shaped date that is not a real day', async () => {
    await expect(
      invalidProperties({ expenseAccountId: 1024, date: '2023-02-30' }),
    ).resolves.toEqual(['date']);
  });

  it('accepts an ISO datetime with an offset', async () => {
    await expect(
      invalidProperties({
        expenseAccountId: 1024,
        date: '2023-03-15T23:30:00-05:00',
      }),
    ).resolves.toEqual([]);
  });

  it('rejects a date that is not a date', async () => {
    await expect(
      invalidProperties({ expenseAccountId: 1024, date: 'yesterday' }),
    ).resolves.toEqual(['date']);
  });
});
