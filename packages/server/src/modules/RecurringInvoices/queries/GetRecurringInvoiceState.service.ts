import { Inject, Injectable } from '@nestjs/common';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { RecurringInvoiceStateResponseDto } from '../dtos/RecurringInvoiceState.dto';

@Injectable()
export class GetRecurringInvoiceState {
  constructor(
    @Inject(PdfTemplateModel.name)
    private pdfTemplateModel: TenantModelProxy<typeof PdfTemplateModel>,
  ) {}

  /**
   * Retrieves the create/edit recurring invoice state.
   */
  public async getRecurringInvoiceState(): Promise<RecurringInvoiceStateResponseDto> {
    const defaultPdfTemplate = await this.pdfTemplateModel()
      .query()
      .findOne({ resource: 'SaleInvoice' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
