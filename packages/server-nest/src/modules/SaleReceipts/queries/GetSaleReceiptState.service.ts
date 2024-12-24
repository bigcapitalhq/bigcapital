import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { Inject, Injectable } from '@nestjs/common';
import { ISaleReceiptState } from '../types/SaleReceipts.types';

@Injectable()
export class GetSaleReceiptState {
  constructor(
    @Inject(PdfTemplateModel.name)
    private pdfTemplateModel: typeof PdfTemplateModel,
  ) {}

  /**
   * Retrieves the sale receipt state.
   * @return {Promise<ISaleReceiptState>}
   */
  public async getSaleReceiptState(): Promise<ISaleReceiptState> {
    const defaultPdfTemplate = await this.pdfTemplateModel
      .query()
      .findOne({ resource: 'SaleReceipt' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
