import { ERRORS } from '../constants';
import { PaymentReceivedValidators } from './PaymentReceivedValidators.service';

const buildQuery = (result: unknown[]) => {
  const resultPromise = Promise.resolve(result);
  const chain: any = {
    whereIn: jest.fn(() => chain),
    forUpdate: jest.fn(() => chain),
    then: resultPromise.then.bind(resultPromise),
    catch: resultPromise.catch.bind(resultPromise),
  };
  return chain;
};

const createService = (invoices: Array<Record<string, unknown>>) => {
  const saleInvoiceModel = jest.fn(() => ({
    query: jest.fn(() => buildQuery(invoices)),
  }));
  return new PaymentReceivedValidators(
    jest.fn() as any,
    jest.fn() as any,
    saleInvoiceModel as any,
    jest.fn() as any,
  );
};

describe('PaymentReceivedValidators', () => {
  describe('validateInvoicesPaymentsAmount', () => {
    it('accepts payment amounts within the invoice due amounts', async () => {
      const service = createService([
        { id: 1, dueAmount: 100 },
        { id: 2, dueAmount: 50 },
      ]);

      await expect(
        service.validateInvoicesPaymentsAmount([
          { invoiceId: 1, paymentAmount: 100 },
          { invoiceId: 2, paymentAmount: 50 },
        ] as any),
      ).resolves.toBeUndefined();
    });

    it('rejects a payment amount bigger than the invoice due amount', async () => {
      const service = createService([{ id: 1, dueAmount: 100 }]);

      await expect(
        service.validateInvoicesPaymentsAmount([
          { invoiceId: 1, paymentAmount: 101 },
        ] as any),
      ).rejects.toMatchObject({ errorType: ERRORS.INVALID_PAYMENT_AMOUNT });
    });

    it('adds back the old payment amount of the same invoice on edit', async () => {
      // Invoice is fully paid by the payment being edited.
      const service = createService([{ id: 1, dueAmount: 0 }]);

      await expect(
        service.validateInvoicesPaymentsAmount(
          [{ invoiceId: 1, paymentAmount: 100 }] as any,
          [{ invoiceId: 1, paymentAmount: 100 }] as any,
        ),
      ).resolves.toBeUndefined();
    });

    it('does not add back old payment amounts of other invoices on edit', async () => {
      // Both invoices are fully paid by the payment being edited.
      const service = createService([
        { id: 1, dueAmount: 0 },
        { id: 2, dueAmount: 0 },
      ]);

      await expect(
        service.validateInvoicesPaymentsAmount(
          [
            { invoiceId: 1, paymentAmount: 300 },
            { invoiceId: 2, paymentAmount: 200 },
          ] as any,
          [
            { invoiceId: 1, paymentAmount: 100 },
            { invoiceId: 2, paymentAmount: 200 },
          ] as any,
        ),
      ).rejects.toMatchObject({ errorType: ERRORS.INVALID_PAYMENT_AMOUNT });
    });
  });
});
