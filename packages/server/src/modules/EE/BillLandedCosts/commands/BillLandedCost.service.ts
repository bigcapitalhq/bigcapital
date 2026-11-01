import { isEmpty } from 'lodash';
import {
  ILandedCostTransactionEntry,
  ILandedCostTransaction,
} from '../types/BillLandedCosts.types';
import { Injectable } from '@nestjs/common';
import { Bill } from '@/modules/Bills/models/Bill';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { Item } from '@/modules/Items/models/Item';
import { ModelObject } from 'objection';

@Injectable()
export class BillLandedCost {
  /**
   * Retrieve the landed cost transaction from the given bill transaction.
   * @param {IBill} bill - Bill transaction.
   * @returns {ILandedCostTransaction} - Landed cost transaction.
   */
  public transformToLandedCost = (
    bill: ModelObject<Bill>,
  ): ILandedCostTransaction => {
    const name = bill.billNumber || bill.referenceNo;

    return {
      id: bill.id,
      name,
      allocatedCostAmount: bill.allocatedCostAmount,
      amount: bill.landedCostAmount,
      unallocatedCostAmount: bill.unallocatedCostAmount,
      transactionType: 'Bill',
      currencyCode: bill.currencyCode,
      exchangeRate: bill.exchangeRate,

      ...(!isEmpty(bill.entries) && {
        entries: bill.entries.map(this.transformToLandedCostEntry),
      }),
    };
  };

  /**
   * Transformes bill entry to landed cost entry.
   * @param {IBill} bill - Bill model.
   * @param {IItemEntry} billEntry - Bill entry.
   * @return {ILandedCostTransactionEntry}
   */
  public transformToLandedCostEntry(
    billEntry: ItemEntry & { item: Item },
  ): ILandedCostTransactionEntry {
    return {
      id: billEntry.id,
      name: billEntry.item.name,
      code: billEntry.item.code,
      amount: billEntry.amount,

      unallocatedCostAmount: billEntry.unallocatedCostAmount,
      allocatedCostAmount: billEntry.allocatedCostAmount,
      description: billEntry.description,
      costAccountId: billEntry.costAccountId || billEntry.item.costAccountId,
    };
  }
}
