import * as moment from 'moment';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { defaultTo, groupBy, uniq } from 'lodash';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { InventoryCostLotTracker } from '@/modules/InventoryCost/models/InventoryCostLotTracker';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { Ledger } from '@/modules/Ledger/Ledger';
import { AccountNormal } from '@/interfaces/Account';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { increment } from '@/utils/increment';
import { PaymentReceived } from '../models/PaymentReceived';
import { PaymentReceivedEntry } from '../models/PaymentReceivedEntry';

/**
 * Records the cash basis inventory cost (COGS) journal entries of the payments
 * received. The cash basis recognizes the inventory cost of the sold items
 * once the payment is received instead of the invoice creation date.
 *
 * The entries are recorded in a separate journal (payment referenced) and
 * scaled by the paid proportion of the associated invoice.
 */
@Injectable()
export class PaymentReceivedCostGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,

    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTracker: TenantModelProxy<
      typeof InventoryCostLotTracker
    >,

    @Inject(PaymentReceived.name)
    private readonly paymentReceivedModel: TenantModelProxy<
      typeof PaymentReceived
    >,
  ) {}

  /**
   * Writes the cash basis inventory cost GL entries of the given payment.
   * @param {number} paymentReceiveId - Payment received id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public writePaymentCostGLEntries = async (
    paymentReceiveId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const paymentReceived = await this.paymentReceivedModel()
      .query(trx)
      .findById(paymentReceiveId)
      .withGraphFetched('entries.invoice');

    const ledger = await this.getPaymentCostLedger(paymentReceived, trx);

    if (!ledger.isEmpty()) {
      await this.ledgerStorage.commit(ledger, trx);
    }
  };

  /**
   * Re-writes the cash basis inventory cost GL entries of the payments
   * received on/after the given date. Called once the inventory costs have
   * been recalculated since the cost lots revert deletes the entries of
   * the payments within the same date range.
   * @param {Date} startingDate - Starting date.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public writePaymentsCostGLEntriesSince = async (
    startingDate: Date | string,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const payments = await this.paymentReceivedModel()
      .query(trx)
      .where(
        'paymentDate',
        '>=',
        moment(startingDate).startOf('day').format('YYYY-MM-DD'),
      )
      .withGraphFetched('entries.invoice');

    if (payments.length === 0) {
      return;
    }
    const ledger = await this.getPaymentsCostLedger(payments, trx);

    if (!ledger.isEmpty()) {
      await this.ledgerStorage.commit(ledger, trx);
    }
  };

  /**
   * Retrieves the cash basis inventory cost ledger of the given payment.
   * @param {PaymentReceived} paymentReceived - Payment received.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<Ledger>}
   */
  public getPaymentCostLedger = async (
    paymentReceived: PaymentReceived,
    trx?: Knex.Transaction,
  ): Promise<Ledger> => {
    return this.getPaymentsCostLedger([paymentReceived], trx);
  };

  /**
   * Retrieves the cash basis inventory cost ledger of the given payments.
   * @param {PaymentReceived[]} payments - Payments received.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<Ledger>}
   */
  private getPaymentsCostLedger = async (
    payments: PaymentReceived[],
    trx?: Knex.Transaction,
  ): Promise<Ledger> => {
    const invoiceIds = uniq(
      payments
        .map((payment) =>
          (payment.entries || []).map((entry) => entry.invoiceId),
        )
        .flat(),
    );
    if (invoiceIds.length === 0) {
      return new Ledger([]);
    }
    // Retrieves the cost lots of the payments associated invoices.
    const costLots = await this.inventoryCostLotTracker()
      .query(trx)
      .where('direction', 'OUT')
      .where('transaction_type', 'SaleInvoice')
      .whereIn('transactionId', invoiceIds)
      .where('cost', '>', 0)
      .withGraphFetched('item')
      .withGraphFetched('itemEntry');

    const costLotsByInvoiceId = groupBy(costLots, 'transactionId');

    const entries = payments
      .map((payment) =>
        (payment.entries || [])
          .map((entry) =>
            this.getPaymentEntryCostGLEntries(
              payment,
              entry,
              costLotsByInvoiceId[entry.invoiceId] || [],
            ),
          )
          .flat(),
      )
      .flat();

    return new Ledger(entries);
  };

  /**
   * Retrieves the cash basis inventory cost GL entries of the given payment
   * entry (invoice allocation) pro-rated to the paid amount.
   * @param {PaymentReceived} payment - Payment received.
   * @param {PaymentReceivedEntry} entry - Payment received entry.
   * @param {InventoryCostLotTracker[]} costLots - Invoice cost lots.
   * @returns {ILedgerEntry[]}
   */
  private getPaymentEntryCostGLEntries = (
    payment: PaymentReceived,
    entry: PaymentReceivedEntry,
    costLots: InventoryCostLotTracker[],
  ): ILedgerEntry[] => {
    const ratio = this.getPaymentEntryRatio(payment, entry);

    if (ratio <= 0) {
      return [];
    }
    const getIndexIncrement = increment(0);
    const commonEntry = this.getPaymentCostGLCommonEntry(payment);

    return costLots
      .map((costLot) => {
        const costAccountId =
          costLot.costAccountId || costLot.item?.costAccountId;
        const description = costLot.itemEntry?.description || null;
        const cost = costLot.cost * ratio;

        // XXX Debit - Cost account.
        const costEntry: ILedgerEntry = {
          ...commonEntry,
          debit: cost,
          accountId: costAccountId,
          accountNormal: AccountNormal.DEBIT,
          itemId: costLot.itemId,
          note: description,
          index: getIndexIncrement(),
        };
        // XXX Credit - Inventory account.
        const inventoryEntry: ILedgerEntry = {
          ...commonEntry,
          credit: cost,
          accountId: costLot.item?.inventoryAccountId,
          accountNormal: AccountNormal.DEBIT,
          itemId: costLot.itemId,
          note: description,
          index: getIndexIncrement(),
        };
        return [costEntry, inventoryEntry];
      })
      .flat();
  };

  /**
   * Retrieves the common journal entry of the cash basis cost entries.
   * @param {PaymentReceived} payment - Payment received.
   */
  private getPaymentCostGLCommonEntry = (payment: PaymentReceived) => {
    return {
      currencyCode: payment.currencyCode,
      exchangeRate: payment.exchangeRate,

      transactionType: 'PaymentReceive',
      transactionId: payment.id,

      transactionNumber: payment.paymentReceiveNo,
      referenceNumber: payment.referenceNo,

      date: payment.paymentDate,
      userId: payment.userId,
      createdAt: payment.createdAt,

      branchId: payment.branchId,

      indexGroup: 60,
      costable: true,
      basis: 'cash' as const,

      debit: 0,
      credit: 0,
    };
  };

  /**
   * Retrieves the paid proportion of the associated invoice.
   * @param {PaymentReceived} payment - Payment received.
   * @param {PaymentReceivedEntry} entry - Payment received entry.
   * @returns {number}
   */
  private getPaymentEntryRatio = (
    payment: PaymentReceived,
    entry: PaymentReceivedEntry,
  ): number => {
    const invoiceTotalLocal = defaultTo(entry.invoice?.totalLocal, 0);
    const paidLocalAmount =
      entry.paymentAmount * defaultTo(payment.exchangeRate, 1);

    if (invoiceTotalLocal <= 0) {
      return 0;
    }
    return paidLocalAmount / invoiceTotalLocal;
  };
}
