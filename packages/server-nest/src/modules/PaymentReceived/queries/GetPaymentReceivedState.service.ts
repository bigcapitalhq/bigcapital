import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { Inject, Injectable } from '@nestjs/common';
import { IPaymentReceivedState } from '../types/PaymentReceived.types';

@Injectable()
export class GetPaymentReceivedStateService {
  constructor(
    @Inject(PdfTemplateModel.name)
    private pdfTemplateModel: typeof PdfTemplateModel,
  ) {}

  /**
   * Retrieves the create/edit initial state of the payment received.
   * @returns {Promise<IPaymentReceivedState>} - A promise resolving to the payment received state.
   */
  public async getPaymentReceivedState(): Promise<IPaymentReceivedState> {
    const defaultPdfTemplate = await this.pdfTemplateModel
      .query()
      .findOne({ resource: 'PaymentReceive' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
