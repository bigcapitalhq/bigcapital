import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SaleEstimate } from '../models/SaleEstimate';
import { SendSaleEstimateMail } from '../commands/SendSaleEstimateMail';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetSaleEstimateMailStateTransformer } from './GetSaleEstimateMailState.transformer';

@Injectable()
export class GetSaleEstimateMailStateService {
  constructor(
    private readonly estimateMail: SendSaleEstimateMail,
    private readonly transformer: TransformerInjectable,

    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: TenantModelProxy<typeof SaleEstimate>
  ) {}

  /**
   * Retrieves the estimate mail state of the given sale estimate.
   * Estimate mail state includes the mail options, branding attributes and the estimate details.
   * @param {number} saleEstimateId
   * @returns {Promise<SaleEstimateMailState>}
   */
  async getEstimateMailState(
    saleEstimateId: number
  ) {
    const saleEstimate = await this.saleEstimateModel().query()
      .findById(saleEstimateId)
      .withGraphFetched('customer')
      .withGraphFetched('entries.item')
      .withGraphFetched('pdfTemplate')
      .withGraphFetched('taxes.taxRate')
      .throwIfNotFound();

    const mailOptions = await this.estimateMail.getMailOptions(
      saleEstimateId
    );
    const transformed = await this.transformer.transform(
      saleEstimate,
      new GetSaleEstimateMailStateTransformer(),
      {
        mailOptions,
      }
    );
    return transformed;
  }
}