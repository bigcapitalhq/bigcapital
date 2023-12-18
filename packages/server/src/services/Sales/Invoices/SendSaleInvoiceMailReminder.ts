import { Inject, Service } from 'typedi';
import { SendInvoiceMailDTO } from '@/interfaces';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class SendInvoiceMailReminder {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject('agenda')
  private agenda: any;

  /**
   * Triggers the reminder mail of the given sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   */
  public async triggerMail(
    tenantId: number,
    saleInvoiceId: number,
    messageDTO: SendInvoiceMailDTO
  ) {
    const payload = {
      tenantId,
      saleInvoiceId,
      messageDTO,
    };
    await this.agenda.now('sale-invoice-reminder-mail-send', payload);
  }

  /**
   * Triggers the mail invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {SendInvoiceMailDTO} messageDTO
   * @returns {Promise<void>}
   */
  public async sendMail(
    tenantId: number,
    saleInvoiceId: number,
    messageDTO: SendInvoiceMailDTO
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('customer');

    const toEmail = messageDTO.to || saleInvoice.customer.email;
    const subject = messageDTO.subject || saleInvoice.invoiceNo;

    if (!toEmail) {
      return null;
    }
    const mail = new Mail()
      .setSubject(subject)
      .setView('mail/UserInvite.html')
      .setTo(toEmail)
      .setData({});

    await mail.send();
  }
}
