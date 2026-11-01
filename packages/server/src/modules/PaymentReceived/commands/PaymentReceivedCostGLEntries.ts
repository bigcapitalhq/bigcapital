import * as moment from 'moment';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { chain, groupBy, mapValues, sumBy, uniq } from 'lodash';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { InventoryCostLotTracker } from '@/modules/InventoryCost/models/InventoryCostLotTracker';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { Ledger } from '@/modules/Ledger/Ledger';
import { PaymentReceived } from '../models/PaymentReceived';
import {
  IInvoiceItemCost,
  PaymentReceivedCostCashGL,
} from './PaymentReceivedCostCashGL';

/**
 * Group of inventory cost lots that belong to the same invoice item and
 * cost account.
 */
interface IInvoiceItemCostGroup {
  invoiceId: number;
  itemCost: IInvoiceItemCost;
}

@Injectable()
export class PaymentReceivedCostGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,

    @Inject(PaymentReceived.name)
    private readonly paymentReceivedModel: TenantModelProxy<
      typeof PaymentReceived
    >,

    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTracker: TenantModelProxy<
      typeof InventoryCostLotTracker
    >,
  ) {}

  /**
   * Retrieves the aggregated item costs of the given sale invoices from
   * the inventory cost lots.
   * @param {number[]} invoicesIds - Sale invoices ids.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<Record<number, IInvoiceItemCost[]>>}
   */
  public getInvoicesItemCosts = async (
    invoicesIds: number[],
    trx?: Knex.Transaction,
  ): Promise<Record<number, IInvoiceItemCost[]>> => {
    if (invoicesIds.length === 0) {
      return {};
    }
    const inventoryCostLots = await this.inventoryCostLotTracker()
      .query(trx)
      .where('direction', 'OUT')
      .where('transaction_type', 'SaleInvoice')
      .whereIn('transaction_id', uniq(invoicesIds))
      .where('cost', '>', 0)
      .withGraphFetched('item')
      .withGraphFetched('itemEntry');

    return this.groupItemCostsByInvoice(
      this.getItemCostGroups(inventoryCostLots),
    );
  };

  /**
   * Retrieves the group key of the given inventory cost lot. The cost lots
   * that belong to the same invoice item and cost account are grouped.
   * @param {InventoryCostLotTracker} costLot - Inventory cost lot.
   * @returns {string}
   */
  private getCostLotGroupKey = (costLot: InventoryCostLotTracker): string => {
    const costAccountId = costLot.costAccountId || costLot.item.costAccountId;

    return `${costLot.transactionId}:${costLot.itemId}:${costAccountId}`;
  };

  /**
   * Merges the given inventory cost lots into a single invoice item cost.
   * @param {InventoryCostLotTracker[]} costLots - Inventory cost lots.
   * @returns {IInvoiceItemCostGroup}
   */
  private mergeCostLots = (
    costLots: InventoryCostLotTracker[],
  ): IInvoiceItemCostGroup => {
    const [firstCostLot] = costLots;
    const costAccountId =
      firstCostLot.costAccountId || firstCostLot.item.costAccountId;

    return {
      invoiceId: firstCostLot.transactionId,
      itemCost: {
        itemId: firstCostLot.itemId,
        cost: sumBy(costLots, 'cost'),
        costAccountId,
        inventoryAccountId: firstCostLot.item.inventoryAccountId,
        description: firstCostLot.itemEntry?.description || null,
      },
    };
  };

  /**
   * Groups the given inventory cost lots by invoice, item and cost account.
   * @param {InventoryCostLotTracker[]} costLots - Inventory cost lots.
   * @returns {IInvoiceItemCostGroup[]}
   */
  private getItemCostGroups = (
    costLots: InventoryCostLotTracker[],
  ): IInvoiceItemCostGroup[] => {
    return chain(costLots)
      .filter((costLot) => Boolean(costLot.item))
      .groupBy(this.getCostLotGroupKey)
      .map(this.mergeCostLots)
      .value();
  };

  /**
   * Groups the given invoice item costs by invoice id.
   * @param {IInvoiceItemCostGroup[]} itemCostGroups - Invoice item cost groups.
   * @returns {Record<number, IInvoiceItemCost[]>}
   */
  private groupItemCostsByInvoice = (
    itemCostGroups: IInvoiceItemCostGroup[],
  ): Record<number, IInvoiceItemCost[]> => {
    return mapValues(groupBy(itemCostGroups, 'invoiceId'), (groups) =>
      groups.map(({ itemCost }) => itemCost),
    );
  };

  /**
   * Retrieves the cash basis cost ledger of the given payment received.
   * @param {PaymentReceived} paymentReceive - Payment received.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<Ledger>}
   */
  public getPaymentCostLedger = async (
    paymentReceive: PaymentReceived,
    trx?: Knex.Transaction,
  ): Promise<Ledger> => {
    const invoicesIds = (paymentReceive.entries || [])
      .map((entry) => entry.invoiceId)
      .filter((invoiceId) => !!invoiceId);

    if (invoicesIds.length === 0) {
      return new Ledger([]);
    }
    const invoicesItemCosts = await this.getInvoicesItemCosts(invoicesIds, trx);
    return new PaymentReceivedCostCashGL(paymentReceive)
      .setInvoicesItemCosts(invoicesItemCosts)
      .getLedger();
  };

  /**
   * Writes the cash basis cost entries of the payments received from the
   * given starting date. Runs once the inventory cost lots are written,
   * since the cash basis cost entries mirror the invoice costs scaled by
   * the paid proportion of each invoice.
   * @param {Date} startingDate - Starting date.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public writePaymentsCostGLEntries = async (
    startingDate: Date,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Retrieves the payments received from the given starting date.
    const payments = await this.paymentReceivedModel()
      .query(trx)
      .where('payment_date', '>=', moment(startingDate).format('YYYY-MM-DD'))
      .withGraphFetched('entries.invoice');

    const invoicesIds = uniq(
      payments.flatMap((payment) =>
        (payment.entries || []).map((entry) => entry.invoiceId),
      ),
    );
    if (invoicesIds.length === 0) {
      return;
    }
    const invoicesItemCosts = await this.getInvoicesItemCosts(invoicesIds, trx);

    const entries = payments.flatMap((payment) =>
      new PaymentReceivedCostCashGL(payment)
        .setInvoicesItemCosts(invoicesItemCosts)
        .GLEntries(),
    );
    if (entries.length === 0) {
      return;
    }
    // Commit the ledger entries to the storage.
    await this.ledgerStorage.commit(new Ledger(entries), trx);
  };
}
