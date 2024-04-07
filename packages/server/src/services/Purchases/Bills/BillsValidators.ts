import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ERRORS } from './constants';
import { IItemEntryDTO } from '@/interfaces';
import { transformToMap } from '@/utils';
import { Bill } from '@/models';

@Service()
export class BillsValidators {
  @Inject()
  private tenancy: HasTenancyService;

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
    paidAmount: number
  ) {
    if (billAmount < paidAmount) {
      throw new ServiceError(ERRORS.BILL_AMOUNT_SMALLER_THAN_PAID_AMOUNT);
    }
  }

  /**
   * Validates the bill number existance.
   */
  public async validateBillNumberExists(
    tenantId: number,
    billNumber: string,
    notBillId?: number
  ) {
    const { Bill } = this.tenancy.models(tenantId);
    const foundBills = await Bill.query()
      .where('bill_number', billNumber)
      .onBuild((builder) => {
        if (notBillId) {
          builder.whereNot('id', notBillId);
        }
      });

    if (foundBills.length > 0) {
      throw new ServiceError(
        ERRORS.BILL_NUMBER_EXISTS,
        'The bill number is not unique.'
      );
    }
  }

  /**
   * Validate the bill has no payment entries.
   * @param {number} tenantId - Tenant id.
   * @param {number} billId - Bill id.
   */
  public async validateBillHasNoEntries(tenantId, billId: number) {
    const { BillPaymentEntry } = this.tenancy.models(tenantId);

    // Retireve the bill associate payment made entries.
    const entries = await BillPaymentEntry.query().where('bill_id', billId);

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
   * @param {number} tenantId
   * @param {number} billId
   */
  public async validateBillHasNoLandedCost(tenantId: number, billId: number) {
    const { BillLandedCost } = this.tenancy.models(tenantId);

    const billLandedCosts = await BillLandedCost.query().where(
      'billId',
      billId
    );
    if (billLandedCosts.length > 0) {
      throw new ServiceError(ERRORS.BILL_HAS_ASSOCIATED_LANDED_COSTS);
    }
  }

  /**
   * Validate transaction entries that have landed cost type should not be
   * inventory items.
   * @param {number} tenantId -
   * @param {IItemEntryDTO[]} newEntriesDTO -
   */
  public async validateCostEntriesShouldBeInventoryItems(
    tenantId: number,
    newEntriesDTO: IItemEntryDTO[]
  ) {
    const { Item } = this.tenancy.models(tenantId);

    const entriesItemsIds = newEntriesDTO.map((e) => e.itemId);
    const entriesItems = await Item.query().whereIn('id', entriesItemsIds);

    const entriesItemsById = transformToMap(entriesItems, 'id');

    // Filter the landed cost entries that not associated with inventory item.
    const nonInventoryHasCost = newEntriesDTO.filter((entry) => {
      const item = entriesItemsById.get(entry.itemId);

      return entry.landedCost && item.type !== 'inventory';
    });
    if (nonInventoryHasCost.length > 0) {
      throw new ServiceError(
        ERRORS.LANDED_COST_ENTRIES_SHOULD_BE_INVENTORY_ITEMS
      );
    }
  }

  /**
   *
   * @param {number} tenantId
   * @param {number} billId
   */
  public validateBillHasNoAppliedToCredit = async (
    tenantId: number,
    billId: number
  ) => {
    const { VendorCreditAppliedBill } = this.tenancy.models(tenantId);

    const appliedTransactions = await VendorCreditAppliedBill.query().where(
      'billId',
      billId
    );
    if (appliedTransactions.length > 0) {
      throw new ServiceError(ERRORS.BILL_HAS_APPLIED_TO_VENDOR_CREDIT);
    }
  };

  /**
   * Validate the given vendor has no associated bills transactions.
   * @param {number} tenantId
   * @param {number} vendorId - Vendor id.
   */
  public async validateVendorHasNoBills(tenantId: number, vendorId: number) {
    const { Bill } = this.tenancy.models(tenantId);

    const bills = await Bill.query().where('vendor_id', vendorId);

    if (bills.length > 0) {
      throw new ServiceError(ERRORS.VENDOR_HAS_BILLS);
    }
  }
}
