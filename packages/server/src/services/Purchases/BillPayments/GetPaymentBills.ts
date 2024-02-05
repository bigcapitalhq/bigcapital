import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { BillPaymentValidators } from './BillPaymentValidators';

@Service()
export class GetPaymentBills {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validators: BillPaymentValidators;

  /**
   * Retrieve payment made associated bills.
   * @param {number} tenantId -
   * @param {number} billPaymentId -
   */
  public async getPaymentBills(tenantId: number, billPaymentId: number) {
    const { Bill, BillPayment } = this.tenancy.models(tenantId);

    const billPayment = await BillPayment.query()
      .findById(billPaymentId)
      .throwIfNotFound();

    const paymentBillsIds = billPayment.entries.map((entry) => entry.id);

    const bills = await Bill.query().whereIn('id', paymentBillsIds);

    return bills;
  }
}
