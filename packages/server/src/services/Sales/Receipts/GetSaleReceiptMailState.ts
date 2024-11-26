import { Inject, Service } from 'typedi';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { SaleReceiptMailNotification } from './SaleReceiptMailNotification';
import { GetSaleReceiptMailStateTransformer } from './GetSaleReceiptMailStateTransformer';

@Service()
export class GetSaleReceiptMailState {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private receiptMail: SaleReceiptMailNotification;

  /**
   * Retrieves the sale receipt mail state of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   */
  public async getMailState(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const saleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .throwIfNotFound();

    const mailOptions = await this.receiptMail.getMailOptions(
      tenantId,
      saleReceiptId
    );
    return this.transformer.transform(
      tenantId,
      saleReceipt,
      new GetSaleReceiptMailStateTransformer(),
      {
        mailOptions,
      }
    );
  }
}
