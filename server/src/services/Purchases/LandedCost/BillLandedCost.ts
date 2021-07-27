import { Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  IBill,
  IItem,
  ILandedCostTransactionEntry,
  ILandedCostTransaction,
  IItemEntry,
} from 'interfaces';

@Service()
export default class BillLandedCost {
  /**
   * Retrieve the landed cost transaction from the given bill transaction.
   * @param {IBill} bill - Bill transaction.
   * @returns {ILandedCostTransaction} - Landed cost transaction.
   */
  public transformToLandedCost = (bill: IBill): ILandedCostTransaction => {
    const number = bill.billNumber || bill.referenceNo;
    const name = [
      number,
      bill.currencyCode + ' ' + bill.unallocatedCostAmount,
    ].join(' - ');

    return {
      id: bill.id,
      name,
      allocatedCostAmount: bill.allocatedCostAmount,
      amount: bill.landedCostAmount,
      unallocatedCostAmount: bill.unallocatedCostAmount,
      transactionType: 'Bill',

      ...(!isEmpty(bill.entries)) && {
        entries: bill.entries.map(this.transformToLandedCostEntry),
      },
    };
  };

  /**
   * Transformes bill entry to landed cost entry.
   * @param {IItemEntry} billEntry - Bill entry.
   * @return {ILandedCostTransactionEntry}
   */
  public transformToLandedCostEntry(
    billEntry: IItemEntry & { item: IItem }
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
