import { Inject, Injectable } from '@nestjs/common';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SaleInvoiceStateResponseDto } from '../dtos/SaleInvoiceState.dto';

@Injectable()
export class GetSaleInvoiceState {
  constructor(
    @Inject(PdfTemplateModel.name)
    private pdfTemplateModel: TenantModelProxy<typeof PdfTemplateModel>,
  ) {}

  /**
   * Retrieves the create/edit invoice state.
   * @returns {Promise<SaleInvoiceStateResponseDto>}
   */
  public async getSaleInvoiceState(): Promise<SaleInvoiceStateResponseDto> {
    const defaultPdfTemplate = await this.pdfTemplateModel()
      .query()
      .findOne({ resource: 'SaleInvoice' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
