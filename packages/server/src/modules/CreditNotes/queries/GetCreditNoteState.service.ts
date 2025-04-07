import { Inject, Injectable } from '@nestjs/common';
import { ICreditNoteState } from '../types/CreditNotes.types';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetCreditNoteState {
  constructor(
    @Inject(PdfTemplateModel.name)
    private pdfTemplateModel: TenantModelProxy<typeof PdfTemplateModel>,
  ) {}

  /**
   * Retrieves the create/edit initial state of the payment received.
   * @return {Promise<ICreditNoteState>}
   */
  public async getCreditNoteState(): Promise<ICreditNoteState> {
    const defaultPdfTemplate = await this.pdfTemplateModel()
      .query()
      .findOne({ resource: 'CreditNote' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
