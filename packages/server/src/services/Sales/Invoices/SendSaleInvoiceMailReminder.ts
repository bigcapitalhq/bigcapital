import { Service } from 'typedi';

@Service()
export class SendInvoiceMailReminder {
  /**
   *
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   */
  public sendInvoiceMailReminder(tenantId: number, saleInvoiceId: number) {}
}
