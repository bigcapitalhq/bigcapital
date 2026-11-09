import { defaultTo } from 'lodash';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { AccountNormal } from '@/interfaces/Account';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { PaymentReceived } from '../models/PaymentReceived';
import { PaymentReceivedEntry } from '../models/PaymentReceivedEntry';
import { increment } from '@/utils/increment';

/**
 * Aggregated cost of a single invoice item retrieved from the inventory
 * cost lots of the sale invoice.
 */
export interface IInvoiceItemCost {
  itemId: number;
  cost: number;
  costAccountId: number;
  inventoryAccountId: number;
  description?: string | null;
}

/**
 * Records the cash basis cost (COGS) journal entries of the payment received.
 * The cash basis recognizes the cost of goods sold of the associated
 * invoice(s) once the payment is received instead of the invoice date.
 *
 * The entries mirror the cost composition of the invoice (the cost of goods
 * sold accounts and the inventory accounts) scaled by the paid proportion
 * of the invoice.
 */
export class PaymentReceivedCostCashGL {
  private readonly paymentReceived: PaymentReceived;
  private invoicesItemCosts: Record<number, IInvoiceItemCost[]> = {};

  /**
   * Constructor method.
   * @param {PaymentReceived} paymentReceived - Payment received.
   */
  constructor(paymentReceived: PaymentReceived) {
    this.paymentReceived = paymentReceived;
  }

  /**
   * Sets the aggregated item costs of the associated invoices.
   * @param {Record<number, IInvoiceItemCost[]>} invoicesItemCosts
   * @returns {PaymentReceivedCostCashGL}
   */
  setInvoicesItemCosts(invoicesItemCosts: Record<number, IInvoiceItemCost[]>) {
    this.invoicesItemCosts = invoicesItemCosts ?? {};
    return this;
  }

  /**
   * Retrieves the common journal entry of the cash basis cost entries.
   */
  private get costEntriesCommonEntry() {
    return {
      credit: 0,
      debit: 0,

      currencyCode: this.paymentReceived.currencyCode,
      exchangeRate: this.paymentReceived.exchangeRate,

      transactionId: this.paymentReceived.id,
      transactionType: 'PaymentReceive',

      transactionNumber: this.paymentReceived.paymentReceiveNo,
      referenceNumber: this.paymentReceived.referenceNo,

      date: this.paymentReceived.paymentDate,
      userId: this.paymentReceived.userId,
      createdAt: this.paymentReceived.createdAt,

      branchId: this.paymentReceived.branchId,

      indexGroup: 60,
      basis: AccountingBasis.Cash,
      costable: true,
    };
  }

  /**
   * Retrieves the paid amount of the given payment entry in local currency.
   * @param {PaymentReceivedEntry} entry - Payment received entry.
   * @returns {number}
   */
  private getPaymentEntryLocalAmount = (
    entry: PaymentReceivedEntry,
  ): number => {
    return (
      entry.paymentAmount * defaultTo(this.paymentReceived.exchangeRate, 1)
    );
  };

  /**
   * Retrieves the paid proportion of the associated invoice.
   * The paid amount in local currency over the invoice total in local
   * currency keeps the cash basis cost entries aligned with the cash basis
   * income entries for partial payments.
   * @param {PaymentReceivedEntry} entry - Payment received entry.
   * @returns {number}
   */
  private getPaymentEntryRatio = (entry: PaymentReceivedEntry): number => {
    const invoiceTotalLocal = defaultTo(entry.invoice?.totalLocal, 0);
    const paidLocalAmount = this.getPaymentEntryLocalAmount(entry);

    if (invoiceTotalLocal <= 0) {
      return 0;
    }
    return paidLocalAmount / invoiceTotalLocal;
  };

  /**
   * Retrieves the cash basis cost entries of the given payment entry
   * (invoice allocation).
   * -----
   * - Cost of goods sold -> Debit -> YYYY
   *    - Inventory assets -> Credit -> YYYY
   * -----
   * @param {PaymentReceivedEntry} entry - Payment received entry.
   * @returns {ILedgerEntry[]}
   */
  private getPaymentEntryCostEntries = (
    entry: PaymentReceivedEntry,
  ): ILedgerEntry[] => {
    const invoice = entry.invoice;
    const itemCosts = this.invoicesItemCosts[entry.invoiceId] || [];
    const ratio = this.getPaymentEntryRatio(entry);

    if (!invoice || ratio <= 0 || itemCosts.length === 0) {
      return [];
    }
    const commonEntry = this.costEntriesCommonEntry;
    const getIndexIncrement = increment(0);

    return itemCosts.flatMap((itemCost) => {
      const cost = itemCost.cost * ratio;

      // XXX Debit - Cost account.
      const costEntry = {
        ...commonEntry,
        debit: cost,
        accountId: itemCost.costAccountId,
        accountNormal: AccountNormal.DEBIT,
        itemId: itemCost.itemId,
        note: itemCost.description || null,
        index: getIndexIncrement(),
      };
      // XXX Credit - Inventory account.
      const inventoryEntry = {
        ...commonEntry,
        credit: cost,
        accountId: itemCost.inventoryAccountId,
        accountNormal: AccountNormal.DEBIT,
        itemId: itemCost.itemId,
        note: itemCost.description || null,
        index: getIndexIncrement(),
      };
      return [costEntry, inventoryEntry];
    });
  };

  /**
   * Retrieves the payment received cash basis cost GL entries.
   * @returns {ILedgerEntry[]}
   */
  public GLEntries(): ILedgerEntry[] {
    return (this.paymentReceived.entries || []).flatMap(
      this.getPaymentEntryCostEntries,
    );
  }

  /**
   * Retrieves the payment received cash basis cost ledger.
   * @returns {Ledger}
   */
  public getLedger = (): Ledger => {
    return new Ledger(this.GLEntries());
  };
}
