import { Inject, Injectable } from '@nestjs/common';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { ISaleInvocieState } from '../SaleInvoice.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetSaleInvoiceState {
  constructor(
    @Inject(PdfTemplateModel.name)
    private pdfTemplateModel: TenantModelProxy<typeof PdfTemplateModel>,
  ) {}

  /**
   * Retrieves the create/edit invoice state.
   * @return {Promise<ISaleInvoice>}
   */
  public async getSaleInvoiceState(): Promise<ISaleInvocieState> {
    const defaultPdfTemplate = await this.pdfTemplateModel()
      .query()
      .findOne({ resource: 'SaleInvoice' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
