import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetSaleInvoiceMailStateTransformer } from './GetSaleInvoiceMailState.transformer';
import { SendSaleInvoiceMailCommon } from '../commands/SendInvoiceInvoiceMailCommon.service';
import { SaleInvoice } from '../models/SaleInvoice';
import { SaleInvoiceMailState } from '../SaleInvoice.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetSaleInvoiceMailState {
  constructor(
    private transformer: TransformerInjectable,
    private invoiceMail: SendSaleInvoiceMailCommon,

    @Inject(SaleInvoice.name)
    private saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
  ) {}

  /**
   * Retrieves the invoice mail state of the given sale invoice.
   * Invoice mail state includes the mail options, branding attributes and the invoice details.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @returns {Promise<SaleInvoiceMailState>}
   */
  public async getInvoiceMailState(
    saleInvoiceId: number,
  ): Promise<SaleInvoiceMailState> {
    const saleInvoice = await this.saleInvoiceModel()
      .query()
      .findById(saleInvoiceId)
      .withGraphFetched('customer')
      .withGraphFetched('entries.item')
      .withGraphFetched('entries.taxes')
      .withGraphFetched('taxes.taxRate')
      .withGraphFetched('pdfTemplate')
      .throwIfNotFound();

    const mailOptions =
      await this.invoiceMail.getInvoiceMailOptions(saleInvoiceId);

    // Transforms the sale invoice mail state.
    const transformed = await this.transformer.transform(
      saleInvoice,
      new GetSaleInvoiceMailStateTransformer(),
      {
        mailOptions,
      },
    );
    return transformed;
  }
}
