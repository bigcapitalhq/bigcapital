import { Service } from 'typedi';
import { SendInvoiceMailDTO } from '@/interfaces';


@Service()
export class SendSaleInvoiceMail {
  public sendSaleInvoiceMail(
    tenantId: number,
    saleInvoiceId: number,
    messageDTO: SendInvoiceMailDTO
  ) {}
}
