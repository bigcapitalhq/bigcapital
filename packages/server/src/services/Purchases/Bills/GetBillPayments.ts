import { Service, Inject } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';
import { BillPaymentTransactionTransformer } from '../BillPayments/BillPaymentTransactionTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

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

    return this.transformer.transform(
      tenantId,
      billsEntries,
      new BillPaymentTransactionTransformer()
    );
  };
}
