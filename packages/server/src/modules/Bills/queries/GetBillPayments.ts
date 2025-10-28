import { Inject, Injectable } from '@nestjs/common';
import { BillPaymentEntry } from '@/modules/BillPayments/models/BillPaymentEntry';
import { BillPaymentTransactionTransformer } from '@/modules/BillPayments/queries/BillPaymentTransactionTransformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetBillPaymentTransactionsService {
  constructor(
    @Inject(BillPaymentEntry.name)
    private billPaymentEntryModel: TenantModelProxy<typeof BillPaymentEntry>,
    private transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieve the specific bill associated payment transactions.
   * @param {number} billId - Bill id.
   */
  public getBillPaymentTransactions = async (billId: number) => {
    const billsEntries = await this.billPaymentEntryModel()
      .query()
      .where('billId', billId)
      .withGraphJoined('payment.paymentAccount')
      .withGraphJoined('bill')
      .orderBy('payment:paymentDate', 'ASC');

    return this.transformer.transform(
      billsEntries,
      new BillPaymentTransactionTransformer(),
    );
  };
}
