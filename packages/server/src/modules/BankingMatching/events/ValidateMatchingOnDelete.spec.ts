import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { DeleteBillPayment } from '@/modules/BillPayments/commands/DeleteBillPayment.service';
import { DeleteExpense } from '@/modules/Expenses/commands/DeleteExpense.service';
import { MatchedBankTransaction } from '../models/MatchedBankTransaction';
import { ValidateTransactionMatched } from '../commands/ValidateTransactionsMatched.service';
import { ERRORS } from '../types';
import { ValidateMatchingOnCashflowDeleteSubscriber } from './ValidateMatchingOnCashflowDelete';
import { ValidateMatchingOnExpenseDeleteSubscriber } from './ValidateMatchingOnExpenseDelete';
import { ValidateMatchingOnManualJournalDeleteSubscriber } from './ValidateMatchingOnManualJournalDelete';
import { ValidateMatchingOnPaymentMadeDeleteSubscriber } from './ValidateMatchingOnPaymentMadeDelete';
import { ValidateMatchingOnPaymentReceivedDeleteSubscriber } from './ValidateMatchingOnPaymentReceivedDelete';

/**
 * Each deleting event, the payload key of the deleted transaction and the
 * reference type the matching services store in `matched_bank_transactions`.
 */
const cases = [
  {
    name: 'a payment received',
    event: events.paymentReceive.onDeleting,
    payloadKey: 'oldPaymentReceive',
    referenceType: 'PaymentReceive',
  },
  {
    name: 'a payment made',
    event: events.billPayment.onDeleting,
    payloadKey: 'oldBillPayment',
    referenceType: 'BillPayment',
  },
  {
    name: 'an expense',
    event: events.expenses.onDeleting,
    payloadKey: 'oldExpense',
    referenceType: 'Expense',
  },
  {
    name: 'a manual journal',
    event: events.manualJournals.onDeleting,
    payloadKey: 'oldManualJournal',
    referenceType: 'ManualJournal',
  },
  {
    name: 'a cashflow transaction',
    event: events.cashflow.onTransactionDeleting,
    payloadKey: 'oldCashflowTransaction',
    referenceType: 'CashflowTransaction',
  },
];

describe('ValidateMatchingOn*Delete subscribers', () => {
  const trx = { id: 'trx' } as any;
  const matchedId = 7;
  const unmatchedId = 8;

  let moduleRef: TestingModule;
  let eventEmitter: EventEmitter2;
  let query: jest.Mock;

  beforeEach(async () => {
    // Bank transaction links as written by the matching services.
    const matchedLinks = cases.map((c) => ({
      referenceType: c.referenceType,
      referenceId: matchedId,
      uncategorizedTransactionId: 1,
    }));
    query = jest.fn(() => ({
      findOne: jest.fn(async ({ referenceType, referenceId }) =>
        matchedLinks.find(
          (link) =>
            link.referenceType === referenceType &&
            link.referenceId === referenceId,
        ),
      ),
    }));

    moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        ValidateTransactionMatched,
        {
          provide: MatchedBankTransaction.name,
          useValue: () => ({ query }),
        },
        ValidateMatchingOnCashflowDeleteSubscriber,
        ValidateMatchingOnExpenseDeleteSubscriber,
        ValidateMatchingOnManualJournalDeleteSubscriber,
        ValidateMatchingOnPaymentMadeDeleteSubscriber,
        ValidateMatchingOnPaymentReceivedDeleteSubscriber,
      ],
    }).compile();

    await moduleRef.init();
    eventEmitter = moduleRef.get(EventEmitter2);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it.each(cases)(
    'rejects deleting $name matched with a bank transaction',
    async ({ event, payloadKey }) => {
      const deleting = eventEmitter.emitAsync(event, {
        [payloadKey]: { id: matchedId },
        trx,
      });

      await expect(deleting).rejects.toBeInstanceOf(ServiceError);
      await expect(deleting).rejects.toMatchObject({
        errorType: ERRORS.CANNOT_DELETE_TRANSACTION_MATCHED,
      });
      expect(query).toHaveBeenCalledWith(trx);
    },
  );

  it.each(cases)(
    'allows deleting $name that is not matched',
    async ({ event, payloadKey }) => {
      await expect(
        eventEmitter.emitAsync(event, {
          [payloadKey]: { id: unmatchedId },
          trx,
        }),
      ).resolves.toBeDefined();
      expect(query).toHaveBeenCalledWith(trx);
    },
  );

  describe('DeleteBillPayment', () => {
    const buildService = () => {
      const deleteQuery = jest.fn().mockResolvedValue(1);
      const where = jest.fn(() => ({ delete: deleteQuery }));
      const billPaymentModel = () => ({
        query: jest.fn(() => ({
          withGraphFetched: jest.fn(() => ({
            findById: jest.fn((id: number) => ({
              throwIfNotFound: jest.fn().mockResolvedValue({ id, entries: [] }),
            })),
          })),
          where,
        })),
      });
      const billPaymentEntryModel = () => ({
        query: jest.fn(() => ({ where })),
      });
      const uow = { withTransaction: jest.fn((work) => work(trx)) };

      const service = new DeleteBillPayment(
        eventEmitter,
        uow as any,
        billPaymentModel as any,
        billPaymentEntryModel as any,
      );
      return { service, deleteQuery };
    };

    it('does not delete a bill payment matched with a bank transaction', async () => {
      const { service, deleteQuery } = buildService();

      await expect(service.deleteBillPayment(matchedId)).rejects.toMatchObject({
        errorType: ERRORS.CANNOT_DELETE_TRANSACTION_MATCHED,
      });
      expect(deleteQuery).not.toHaveBeenCalled();
    });

    it('deletes a bill payment that is not matched', async () => {
      const { service, deleteQuery } = buildService();

      await service.deleteBillPayment(unmatchedId);

      expect(deleteQuery).toHaveBeenCalledTimes(2);
    });
  });

  describe('DeleteExpense', () => {
    const buildService = () => {
      const deleteQuery = jest.fn().mockResolvedValue(1);
      const expenseModel = () => ({
        query: jest.fn(() => ({
          findById: jest.fn((id: number) => ({
            forUpdate: jest.fn(() => ({
              withGraphFetched: jest.fn(() => ({
                throwIfNotFound: jest
                  .fn()
                  .mockResolvedValue({ id, categories: [] }),
              })),
            })),
            delete: deleteQuery,
          })),
        })),
      });
      const expenseCategoryModel = () => ({
        query: jest.fn(() => ({
          where: jest.fn(() => ({ delete: deleteQuery })),
        })),
      });
      const validator = {
        validateNoAssociatedLandedCost: jest.fn().mockResolvedValue(undefined),
      };
      const uow = { withTransaction: jest.fn((work) => work(trx)) };

      const service = new DeleteExpense(
        eventEmitter,
        uow as any,
        validator as any,
        expenseModel as any,
        expenseCategoryModel as any,
      );
      return { service, deleteQuery };
    };

    it('does not delete an expense matched with a bank transaction', async () => {
      const { service, deleteQuery } = buildService();

      await expect(service.deleteExpense(matchedId)).rejects.toMatchObject({
        errorType: ERRORS.CANNOT_DELETE_TRANSACTION_MATCHED,
      });
      expect(deleteQuery).not.toHaveBeenCalled();
    });

    it('deletes an expense that is not matched', async () => {
      const { service, deleteQuery } = buildService();

      await service.deleteExpense(unmatchedId);

      expect(deleteQuery).toHaveBeenCalledTimes(2);
    });
  });
});
