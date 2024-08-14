import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IPaymentReceivedEntryDTO } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { entriesAmountDiff } from '@/utils';

@Service()
export class PaymentReceivedInvoiceSync {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Saves difference changing between old and new invoice payment amount.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {Array} paymentReceiveEntries
   * @param {Array} newPaymentReceiveEntries
   * @return {Promise<void>}
   */
  public async saveChangeInvoicePaymentAmount(
    tenantId: number,
    newPaymentReceiveEntries: IPaymentReceivedEntryDTO[],
    oldPaymentReceiveEntries?: IPaymentReceivedEntryDTO[],
    trx?: Knex.Transaction
  ): Promise<void> {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const opers: Promise<void>[] = [];

    const diffEntries = entriesAmountDiff(
      newPaymentReceiveEntries,
      oldPaymentReceiveEntries,
      'paymentAmount',
      'invoiceId'
    );
    diffEntries.forEach((diffEntry: any) => {
      if (diffEntry.paymentAmount === 0) {
        return;
      }
      const oper = SaleInvoice.changePaymentAmount(
        diffEntry.invoiceId,
        diffEntry.paymentAmount,
        trx
      );
      opers.push(oper);
    });
    await Promise.all([...opers]);
  }
}
