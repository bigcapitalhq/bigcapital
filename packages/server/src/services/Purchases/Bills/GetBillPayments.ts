import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import TenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { BillPaymentTransactionTransformer } from '../BillPayments/BillPaymentTransactionTransformer';

@Service()
export class GetBillPayments {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the specific bill associated payment transactions.
   * @param {number} tenantId
   * @param {number} billId
   * @returns {}
   */
  public getBillPayments = async (tenantId: number, billId: number) => {
    const { BillPaymentEntry } = this.tenancy.models(tenantId);

    const billsEntries = await BillPaymentEntry.query()
      .where('billId', billId)
      .withGraphJoined('payment.paymentAccount')
      .withGraphJoined('bill')
      .orderBy('payment:paymentDate', 'ASC');

    return this.transformer.transform(tenantId, billsEntries, new BillPaymentTransactionTransformer());
  };
}
