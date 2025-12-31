import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Inject, Injectable } from '@nestjs/common';
import { SaleReceiptMailNotification } from '../commands/SaleReceiptMailNotification';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SaleReceipt } from '../models/SaleReceipt';
import { GetSaleReceiptMailStateTransformer } from './GetSaleReceiptMailState.transformer';

@Injectable()
export class GetSaleReceiptMailStateService {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly receiptMail: SaleReceiptMailNotification,

    @Inject(SaleReceipt.name)
    private readonly saleReceiptModel: TenantModelProxy<typeof SaleReceipt>
  ) {}

  /**
   * Retrieves the sale receipt mail state of the given sale receipt.
   * @param {number} saleReceiptId
   */
  public async getMailState(saleReceiptId: number) {
    const saleReceipt = await this.saleReceiptModel().query()
      .findById(saleReceiptId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('taxes.taxRate')
      .throwIfNotFound();

    const mailOptions = await this.receiptMail.getMailOptions(saleReceiptId);

    return this.transformer.transform(
      saleReceipt,
      new GetSaleReceiptMailStateTransformer(),
      { mailOptions },
    );
  }
}
