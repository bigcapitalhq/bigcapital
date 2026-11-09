import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { BaseLandedCostService } from '../BaseLandedCost.service';
import { BillLandedCost } from '../models/BillLandedCost';
import { Bill } from '@/modules/Bills/models/Bill';
import { BillLandedCostEntry } from '../models/BillLandedCostEntry';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class LandedCostGLEntriesService extends BaseLandedCostService {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,

    @Inject(BillLandedCost.name)
    protected readonly billLandedCostModel: TenantModelProxy<
      typeof BillLandedCost
    >,
  ) {
    super();
  }

  /**
   * Retrieves the landed cost GL common entry.
   */
  private getLandedCostGLCommonEntry(
    bill: Bill,
    allocatedLandedCost: BillLandedCost,
  ) {
    return {
      date: moment(bill.billDate).format('YYYY-MM-DD'),
      currencyCode: allocatedLandedCost.currencyCode,
      exchangeRate: allocatedLandedCost.exchangeRate,

      transactionType: 'LandedCost',
      transactionId: allocatedLandedCost.id,
      transactionNumber: bill.billNumber,

      referenceNumber: bill.referenceNo,

      branchId: bill.branchId,
      projectId: bill.projectId,

      credit: 0,
      debit: 0,
    };
  }

  /**
   * Retrieves the landed cost GL inventory entry for an allocated item.
   */
  private getLandedCostGLInventoryEntry(
    bill: Bill,
    allocatedLandedCost: BillLandedCost,
    allocatedEntry: BillLandedCostEntry,
    index: number,
  ): ILedgerEntry {
    const commonEntry = this.getLandedCostGLCommonEntry(
      bill,
      allocatedLandedCost,
    );
    const itemEntry = (
      allocatedEntry as BillLandedCostEntry & {
        itemEntry?: {
          item?: { type?: string; inventoryAccountId?: number };
          costAccountId?: number;
          itemId?: number;
        };
      }
    ).itemEntry;
    const item = itemEntry?.item;
    const isInventory = item && ['inventory'].indexOf(item.type) !== -1;
    const accountId = isInventory
      ? item?.inventoryAccountId
      : itemEntry?.costAccountId;

    if (!accountId) {
      throw new Error(
        `Cannot determine GL account for landed cost allocate entry (entryId: ${allocatedEntry.entryId})`,
      );
    }

    const localAmount =
      allocatedEntry.cost * (allocatedLandedCost.exchangeRate || 1);

    return {
      ...commonEntry,
      debit: localAmount,
      accountId,
      index: index + 1,
      indexGroup: 10,
      itemId: itemEntry?.itemId,
      accountNormal: AccountNormal.DEBIT,
    };
  }

  /**
   * Retrieves the landed cost GL cost entry (credit to cost account).
   */
  private getLandedCostGLCostEntry(
    bill: Bill,
    allocatedLandedCost: BillLandedCost,
  ): ILedgerEntry {
    const commonEntry = this.getLandedCostGLCommonEntry(
      bill,
      allocatedLandedCost,
    );

    return {
      ...commonEntry,
      credit: allocatedLandedCost.localAmount,
      accountId: allocatedLandedCost.costAccountId,
      index: 1,
      indexGroup: 20,
      accountNormal: AccountNormal.CREDIT,
    };
  }

  /**
   * Composes the landed cost GL entries.
   */
  public getLandedCostGLEntries(
    allocatedLandedCost: BillLandedCost,
    bill: Bill,
  ): ILedgerEntry[] {
    const inventoryEntries = allocatedLandedCost.allocateEntries.map(
      (allocatedEntry, index) =>
        this.getLandedCostGLInventoryEntry(
          bill,
          allocatedLandedCost,
          allocatedEntry,
          index,
        ),
    );
    const costEntry = this.getLandedCostGLCostEntry(bill, allocatedLandedCost);

    return [...inventoryEntries, costEntry];
  }

  /**
   * Retrieves the landed cost GL ledger.
   */
  public getLandedCostLedger(
    allocatedLandedCost: BillLandedCost,
    bill: Bill,
  ): Ledger {
    const entries = this.getLandedCostGLEntries(allocatedLandedCost, bill);
    return new Ledger(entries);
  }

  /**
   * Generates and writes GL entries of the given landed cost.
   */
  public createLandedCostGLEntries = async (
    billLandedCostId: number,
    trx?: Knex.Transaction,
  ) => {
    const allocatedLandedCost = await this.billLandedCostModel()
      .query(trx)
      .findById(billLandedCostId)
      .withGraphFetched('bill')
      .withGraphFetched('allocateEntries.itemEntry.item');

    if (!allocatedLandedCost?.bill) {
      throw new Error('BillLandedCost or associated Bill not found');
    }

    const ledger = this.getLandedCostLedger(
      allocatedLandedCost,
      allocatedLandedCost.bill,
    );
    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Reverts GL entries of the given allocated landed cost transaction.
   */
  public revertLandedCostGLEntries = async (
    landedCostId: number,
    trx?: Knex.Transaction,
  ) => {
    await this.ledgerStorage.deleteByReference(landedCostId, 'LandedCost', trx);
  };
}
