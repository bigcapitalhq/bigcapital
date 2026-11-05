import { Inject, Injectable, Scope } from '@nestjs/common';
import { isEmpty, groupBy } from 'lodash';
import { Bill } from '@/modules/Bills/models/Bill';
import { BillPaymentEntry } from '@/modules/BillPayments/models/BillPaymentEntry';
import { VendorCreditAppliedBill } from '@/modules/VendorCreditsApplyBills/models/VendorCreditAppliedBill';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { APAgingSummaryQueryDto } from './APAgingSummaryQuery.dto';
import {
  AgingSettlementRow,
  getAgingDocumentsAsOf,
  IAgingDocument,
  toDateKey,
} from '../AgingSummary/AgingAsOf';

@Injectable({ scope: Scope.REQUEST })
export class APAgingSummaryRepository {
  @Inject(Vendor.name)
  private readonly vendorModel: TenantModelProxy<typeof Vendor>;

  @Inject(Bill.name)
  private readonly billModel: TenantModelProxy<typeof Bill>;

  @Inject(BillPaymentEntry.name)
  private readonly billPaymentEntryModel: TenantModelProxy<
    typeof BillPaymentEntry
  >;

  @Inject(VendorCreditAppliedBill.name)
  private readonly vendorCreditAppliedBillModel: TenantModelProxy<
    typeof VendorCreditAppliedBill
  >;

  @Inject(TenancyContext)
  private readonly tenancyContext: TenancyContext;

  /**
   * A/P aging filter.
   * @param {APAgingSummaryQueryDto} filter
   */
  filter: APAgingSummaryQueryDto;

  /**
   * Bills that are open and not yet due on the as-of date, by vendor id.
   * @param {Record<string, IAgingDocument[]>} dueBillsByVendorId
   */
  dueBillsByVendorId: Record<string, IAgingDocument[]>;

  /**
   * Bills that are open and overdue on the as-of date, by vendor id.
   * @param {Record<string, IAgingDocument[]>} overdueBillsByVendorId
   */
  overdueBillsByVendorId: Record<string, IAgingDocument[]>;

  /**
   * Vendors.
   * @param {Vendor[]} vendors
   */
  vendors: Vendor[];

  /**
   * Base currency.
   * @param {string} baseCurrency
   */
  baseCurrency: string;

  /**
   * Set the filter.
   * @param {APAgingSummaryQueryDto} filter
   */
  setFilter(filter: APAgingSummaryQueryDto) {
    this.filter = filter;
  }

  /**
   * Load the data.
   */
  async load() {
    await this.asyncBaseCurrency();
    await this.asyncVendors();
    await this.asyncAgingBills();
  }

  /**
   * Retrieve the base currency.
   * @returns {Promise<string>}
   */
  async asyncBaseCurrency() {
    const metadata = await this.tenancyContext.getTenantMetadata();

    this.baseCurrency = metadata.baseCurrency;
  }

  /**
   * Retrieve all vendors from the storage.
   */
  async asyncVendors() {
    // Retrieve all vendors from the storage.
    const vendors =
      this.filter.vendorsIds.length > 0
        ? await this.vendorModel().query().whereIn('id', this.filter.vendorsIds)
        : await this.vendorModel().query();

    this.vendors = vendors;
  }

  /**
   * Retrieve the bills open on the as-of date, split into due and overdue
   * ones. Only payments and vendor credits dated on or before the as-of date
   * reduce a bill's open amount.
   */
  async asyncAgingBills() {
    const asDate = toDateKey(this.filter.asDate);

    const bills = await this.billModel()
      .query()
      .modify('agingCandidatesAsOf', asDate)
      .onBuild((query) => {
        if (!isEmpty(this.filter.branchesIds)) {
          query.modify('filterByBranches', this.filter.branchesIds);
        }
        if (!isEmpty(this.filter.vendorsIds)) {
          query.whereIn('vendorId', this.filter.vendorsIds);
        }
      });
    const settlements = await this.getBillsSettlements(
      bills.map((bill) => bill.id),
    );
    const { current, overdue } = getAgingDocumentsAsOf(
      bills.map((bill) => ({
        id: bill.id,
        contactId: bill.vendorId,
        total: bill.total,
        exchangeRate: bill.exchangeRate,
        documentDate: bill.billDate,
        dueDate: bill.dueDate,
      })),
      settlements,
      asDate,
    );
    this.dueBillsByVendorId = groupBy(current, 'contactId');
    this.overdueBillsByVendorId = groupBy(overdue, 'contactId');
  }

  /**
   * Retrieves the payments and applied vendor credits of the given bills,
   * each dated on the payment date or the vendor credit date.
   * @param {number[]} billsIds
   * @returns {Promise<AgingSettlementRow[]>}
   */
  private async getBillsSettlements(
    billsIds: number[],
  ): Promise<AgingSettlementRow[]> {
    if (isEmpty(billsIds)) return [];

    const payments = await this.billPaymentEntryModel()
      .query()
      .join(
        'bills_payments',
        'bills_payments.id',
        'bills_payments_entries.bill_payment_id',
      )
      .whereIn('bills_payments_entries.bill_id', billsIds)
      .select(
        'bills_payments_entries.bill_id',
        'bills_payments_entries.payment_amount',
        'bills_payments.payment_date',
      );
    const credits = await this.vendorCreditAppliedBillModel()
      .query()
      .join(
        'vendor_credits',
        'vendor_credits.id',
        'vendor_credit_applied_bill.vendor_credit_id',
      )
      .whereIn('vendor_credit_applied_bill.bill_id', billsIds)
      .select(
        'vendor_credit_applied_bill.bill_id',
        'vendor_credit_applied_bill.amount',
        'vendor_credits.vendor_credit_date',
      );

    return [
      ...payments.map((payment: any) => ({
        documentId: payment.billId,
        amount: Number(payment.paymentAmount),
        date: payment.paymentDate,
      })),
      ...credits.map((credit: any) => ({
        documentId: credit.billId,
        amount: Number(credit.amount),
        date: credit.vendorCreditDate,
      })),
    ];
  }
}
