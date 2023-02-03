import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class ProjectBillableBill {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Increase the invoiced amount of the given bill.
   * @param {number} tenantId - Tenant id.
   * @param {number} billId - Bill id.
   * @param {number} invoicedAmount - Invoiced amount.
   */
  public increaseInvoicedBill = async (
    tenantId: number,
    billId: number,
    invoicedAmount: number
  ) => {
    const { Bill } = this.tenancy.models(tenantId);

    await Bill.query()
      .findById(billId)
      .increment('projectInvoicedAmount', invoicedAmount);
  };

  /**
   * Decrease the invoiced amount of the given bill.
   * @param {number} tenantId
   * @param {number} billId - Bill id.
   * @param {number} invoiceHours - Invoiced amount.
   * @returns {}
   */
  public decreaseInvoicedBill = async (
    tenantId: number,
    billId: number,
    invoiceHours: number
  ) => {
    const { Bill } = this.tenancy.models(tenantId);

    await Bill.query()
      .findById(billId)
      .decrement('projectInvoicedAmount', invoiceHours);
  };
}
