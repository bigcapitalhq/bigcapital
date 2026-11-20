import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../types';
import { UnmatchMatchedBankTransaction } from './UnmatchMatchedTransaction.service';

describe('UnmatchMatchedBankTransaction', () => {
  const trx = { id: 'trx' } as any;

  let calls: string[];
  let links: Array<{
    uncategorizedTransactionId: number;
    referenceType: string;
    referenceId: number;
  }>;
  let paymentsReceived: number[];
  let billPayments: number[];
  let eventPublisher: { emitAsync: jest.Mock };
  let deletePaymentReceivedService: { deletePaymentReceive: jest.Mock };
  let deleteBillPaymentService: { deleteBillPayment: jest.Mock };
  let service: UnmatchMatchedBankTransaction;

  const matchedBankTransactionModel = jest.fn(() => ({
    query: jest.fn(() => ({
      where: jest.fn((column: string, value: number) => {
        const selected = links.filter((link) => link[column] === value);
        return Object.assign(Promise.resolve(selected), {
          delete: jest.fn(async () => {
            links = links.filter((link) => link[column] !== value);
            calls.push('deleteLinks');
            return selected.length;
          }),
        });
      }),
      findOne: jest.fn(async (attrs: Record<string, any>) =>
        links.find((link) =>
          Object.keys(attrs).every((key) => link[key] === attrs[key]),
        ),
      ),
    })),
  }));

  const buildPaymentModel = (getIds: () => number[]) =>
    jest.fn(() => ({
      query: jest.fn(() => ({
        findById: jest.fn(async (id: number) =>
          getIds().includes(id) ? { id } : undefined,
        ),
      })),
    }));

  beforeEach(() => {
    calls = [];
    paymentsReceived = [];
    billPayments = [];

    const uow = {
      withTransaction: jest.fn((callback: (trx: any) => any) => callback(trx)),
    };
    eventPublisher = {
      emitAsync: jest.fn(async (eventName: string) => {
        calls.push(eventName);
      }),
    };
    deletePaymentReceivedService = {
      deletePaymentReceive: jest.fn(async (id: number) => {
        // Models a matched transaction delete guard: rejects while linked.
        if (
          links.some(
            (link) =>
              link.referenceType === 'PaymentReceive' &&
              link.referenceId === id,
          )
        ) {
          throw new ServiceError(ERRORS.CANNOT_DELETE_TRANSACTION_MATCHED);
        }
        calls.push('deletePaymentReceive');
      }),
    };
    deleteBillPaymentService = {
      deleteBillPayment: jest.fn(async () => {
        calls.push('deleteBillPayment');
      }),
    };
    service = new UnmatchMatchedBankTransaction(
      uow as any,
      eventPublisher as any,
      matchedBankTransactionModel as any,
      deletePaymentReceivedService as any,
      deleteBillPaymentService as any,
      buildPaymentModel(() => paymentsReceived) as any,
      buildPaymentModel(() => billPayments) as any,
    );
  });

  it('deletes the payment received created by matching an invoice', async () => {
    links = [
      {
        uncategorizedTransactionId: 1,
        referenceType: 'SaleInvoice',
        referenceId: 5,
      },
      {
        uncategorizedTransactionId: 1,
        referenceType: 'PaymentReceive',
        referenceId: 7,
      },
    ];
    paymentsReceived = [7];

    await service.unmatchMatchedTransaction(1);

    expect(links).toEqual([]);
    expect(
      deletePaymentReceivedService.deletePaymentReceive,
    ).toHaveBeenCalledWith(7, trx);
    expect(deleteBillPaymentService.deleteBillPayment).not.toHaveBeenCalled();
    expect(calls).toEqual([
      events.bankMatch.onUnmatching,
      'deleteLinks',
      'deletePaymentReceive',
      events.bankMatch.onUnmatched,
    ]);
  });

  it('deletes the bill payment created by matching a bill', async () => {
    links = [
      { uncategorizedTransactionId: 1, referenceType: 'Bill', referenceId: 5 },
      {
        uncategorizedTransactionId: 1,
        referenceType: 'BillPayment',
        referenceId: 9,
      },
    ];
    billPayments = [9];

    await service.unmatchMatchedTransaction(1);

    expect(links).toEqual([]);
    expect(deleteBillPaymentService.deleteBillPayment).toHaveBeenCalledWith(
      9,
      trx,
    );
    expect(
      deletePaymentReceivedService.deletePaymentReceive,
    ).not.toHaveBeenCalled();
    expect(calls).toEqual([
      events.bankMatch.onUnmatching,
      'deleteLinks',
      'deleteBillPayment',
      events.bankMatch.onUnmatched,
    ]);
  });

  it.each(['Expense', 'ManualJournal', 'CashflowTransaction'])(
    'only removes the links of a matched %s',
    async (referenceType) => {
      links = [
        { uncategorizedTransactionId: 1, referenceType, referenceId: 3 },
      ];

      await service.unmatchMatchedTransaction(1);

      expect(links).toEqual([]);
      expect(
        deletePaymentReceivedService.deletePaymentReceive,
      ).not.toHaveBeenCalled();
      expect(deleteBillPaymentService.deleteBillPayment).not.toHaveBeenCalled();
      expect(calls).toEqual([
        events.bankMatch.onUnmatching,
        'deleteLinks',
        events.bankMatch.onUnmatched,
      ]);
    },
  );

  it('skips the payment that no longer exists', async () => {
    links = [
      { uncategorizedTransactionId: 1, referenceType: 'Bill', referenceId: 5 },
      {
        uncategorizedTransactionId: 1,
        referenceType: 'BillPayment',
        referenceId: 9,
      },
    ];
    billPayments = [];

    await service.unmatchMatchedTransaction(1);

    expect(links).toEqual([]);
    expect(deleteBillPaymentService.deleteBillPayment).not.toHaveBeenCalled();
    expect(eventPublisher.emitAsync).toHaveBeenCalledWith(
      events.bankMatch.onUnmatched,
      expect.objectContaining({ uncategorizedTransactionId: 1, trx }),
    );
  });

  it('keeps the payment while another bank transaction is linked to it', async () => {
    links = [
      {
        uncategorizedTransactionId: 1,
        referenceType: 'SaleInvoice',
        referenceId: 5,
      },
      {
        uncategorizedTransactionId: 1,
        referenceType: 'PaymentReceive',
        referenceId: 7,
      },
      {
        uncategorizedTransactionId: 2,
        referenceType: 'SaleInvoice',
        referenceId: 5,
      },
      {
        uncategorizedTransactionId: 2,
        referenceType: 'PaymentReceive',
        referenceId: 7,
      },
    ];
    paymentsReceived = [7];

    await service.unmatchMatchedTransaction(1);

    expect(links).toEqual([
      {
        uncategorizedTransactionId: 2,
        referenceType: 'SaleInvoice',
        referenceId: 5,
      },
      {
        uncategorizedTransactionId: 2,
        referenceType: 'PaymentReceive',
        referenceId: 7,
      },
    ]);
    expect(
      deletePaymentReceivedService.deletePaymentReceive,
    ).not.toHaveBeenCalled();

    // Unmatching the last linked bank transaction deletes the payment.
    await service.unmatchMatchedTransaction(2);

    expect(links).toEqual([]);
    expect(
      deletePaymentReceivedService.deletePaymentReceive,
    ).toHaveBeenCalledWith(7, trx);
  });

  it('rejects and skips the unmatched event when the payment delete fails', async () => {
    // For example the transactions locking guard refuses a payment in a locked period.
    links = [
      {
        uncategorizedTransactionId: 1,
        referenceType: 'SaleInvoice',
        referenceId: 5,
      },
      {
        uncategorizedTransactionId: 1,
        referenceType: 'PaymentReceive',
        referenceId: 7,
      },
    ];
    paymentsReceived = [7];
    const rawError = new ServiceError('TRANSACTIONS_DATE_LOCKED');
    deletePaymentReceivedService.deletePaymentReceive.mockRejectedValue(
      rawError,
    );

    await expect(service.unmatchMatchedTransaction(1)).rejects.toBe(rawError);

    expect(eventPublisher.emitAsync).not.toHaveBeenCalledWith(
      events.bankMatch.onUnmatched,
      expect.anything(),
    );
  });
});
