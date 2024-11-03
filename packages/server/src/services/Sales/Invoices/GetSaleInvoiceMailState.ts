import { SaleInvoiceMailOptions, SaleInvoiceMailState } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject } from 'typedi';
import { SendSaleInvoiceMailCommon } from './SendInvoiceInvoiceMailCommon';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetSaleInvoiceMailStateTransformer } from './GetSaleInvoiceMailStateTransformer';

export class GetSaleInvoiceMailState {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private invoiceMail: SendSaleInvoiceMailCommon;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the invoice mail state of the given sale invoice.
   * Invoice mail state includes the mail options, branding attributes and the invoice details.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @returns {Promise<SaleInvoiceMailState>}
   */
  async getInvoiceMailState(
    tenantId: number,
    saleInvoiceId: number
  ): Promise<SaleInvoiceMailState> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('customer')
      .withGraphFetched('entries.item')
      .withGraphFetched('pdfTemplate')
      .throwIfNotFound();

    const mailOptions = await this.invoiceMail.getInvoiceMailOptions(
      tenantId,
      saleInvoiceId
    );
    // Transforms the sale invoice mail state.
    const transformed = await this.transformer.transform(
      tenantId,
      saleInvoice,
      new GetSaleInvoiceMailStateTransformer(),
      {
        mailOptions,
      }
    );
    return transformed;
  }
}
