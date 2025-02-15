import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../Bills.constants';
import { Bill } from '../models/Bill';
import { ServiceError } from '@/modules/Items/ServiceError';
import { IItemEntryDTO } from '@/modules/TransactionItemEntry/ItemEntry.types';
import { Item } from '@/modules/Items/models/Item';
import { BillPaymentEntry } from '@/modules/BillPayments/models/BillPaymentEntry';
import { BillLandedCost } from '@/modules/BillLandedCosts/models/BillLandedCost';
import { VendorCreditAppliedBill } from '@/modules/VendorCreditsApplyBills/models/VendorCreditAppliedBill';
import { transformToMap } from '@/utils/transform-to-key';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class BillsValidators {
  constructor(
    @Inject(Bill.name) private billModel: TenantModelProxy<typeof Bill>,

    @Inject(BillPaymentEntry.name)
    private billPaymentEntryModel: TenantModelProxy<typeof BillPaymentEntry>,

    @Inject(BillLandedCost.name)
    private billLandedCostModel: TenantModelProxy<typeof BillLandedCost>,

    @Inject(VendorCreditAppliedBill.name)
    private vendorCreditAppliedBillModel: TenantModelProxy<
      typeof VendorCreditAppliedBill
    >,

    @Inject(Item.name) private itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   * Validates the bill existance.
   * @param {Bill | undefined | null} bill
   */
  public validateBillExistance(bill: Bill | undefined | null) {
    if (!bill) {
      throw new ServiceError(ERRORS.BILL_NOT_FOUND);
    }
  }

  /**
   * Validates the bill amount is bigger than paid amount.
   * @param {number} billAmount
   * @param {number} paidAmount
   */
  public validateBillAmountBiggerPaidAmount(
    billAmount: number,
    paidAmount: number,
  ) {
    if (billAmount < paidAmount) {
      throw new ServiceError(ERRORS.BILL_AMOUNT_SMALLER_THAN_PAID_AMOUNT);
    }
  }

  /**
   * Validates the bill number existance.
   */
  public async validateBillNumberExists(
    billNumber: string,
    notBillId?: number,
  ) {
    const foundBills = await this.billModel()
      .query()
      .where('bill_number', billNumber)
      .onBuild((builder) => {
        if (notBillId) {
          builder.whereNot('id', notBillId);
        }
      });

    if (foundBills.length > 0) {
      throw new ServiceError(
        ERRORS.BILL_NUMBER_EXISTS,
        'The bill number is not unique.',
      );
    }
  }

  /**
   * Validate the bill has no payment entries.
   * @param {number} billId - Bill id.
   */
  public async validateBillHasNoEntries(billId: number) {
    // Retrieve the bill associate payment made entries.
    const entries = await this.billPaymentEntryModel()
      .query()
      .where('bill_id', billId);

    if (entries.length > 0) {
      throw new ServiceError(ERRORS.BILL_HAS_ASSOCIATED_PAYMENT_ENTRIES);
    }
    return entries;
  }

  /**
   * Validate the bill number require.
   * @param {string} billNo -
   */
  public validateBillNoRequire(billNo: string) {
    if (!billNo) {
      throw new ServiceError(ERRORS.BILL_NO_IS_REQUIRED);
    }
  }

  /**
   * Validate bill transaction has no associated allocated landed cost transactions.
   * @param {number} billId
   */
  public async validateBillHasNoLandedCost(billId: number) {
    const billLandedCosts = await this.billLandedCostModel()
      .query()
      .where('billId', billId);

    if (billLandedCosts.length > 0) {
      throw new ServiceError(ERRORS.BILL_HAS_ASSOCIATED_LANDED_COSTS);
    }
  }

  /**
   * Validate transaction entries that have landed cost type should not be
   * inventory items.
   * @param {IItemEntryDTO[]} newEntriesDTO -
   */
  public async validateCostEntriesShouldBeInventoryItems(
    newEntriesDTO: IItemEntryDTO[],
  ) {
    const entriesItemsIds = newEntriesDTO.map((e) => e.itemId);
    const entriesItems = await this.itemModel()
      .query()
      .whereIn('id', entriesItemsIds);

    const entriesItemsById = transformToMap(entriesItems, 'id');

    // Filter the landed cost entries that not associated with inventory item.
    const nonInventoryHasCost = newEntriesDTO.filter((entry) => {
      const item = entriesItemsById.get(entry.itemId);

      return entry.landedCost && item.type !== 'inventory';
    });
    if (nonInventoryHasCost.length > 0) {
      throw new ServiceError(
        ERRORS.LANDED_COST_ENTRIES_SHOULD_BE_INVENTORY_ITEMS,
      );
    }
  }

  /**
   *
   * @param {number} billId
   */
  public validateBillHasNoAppliedToCredit = async (billId: number) => {
    const appliedTransactions = await this.vendorCreditAppliedBillModel()
      .query()
      .where('billId', billId);

    if (appliedTransactions.length > 0) {
      throw new ServiceError(ERRORS.BILL_HAS_APPLIED_TO_VENDOR_CREDIT);
    }
  };

  /**
   * Validate the given vendor has no associated bills transactions.
   * @param {number} vendorId - Vendor id.
   */
  public async validateVendorHasNoBills(vendorId: number) {
    const bills = await this.billModel().query().where('vendor_id', vendorId);

    if (bills.length > 0) {
      throw new ServiceError(ERRORS.VENDOR_HAS_BILLS);
    }
  }
}
