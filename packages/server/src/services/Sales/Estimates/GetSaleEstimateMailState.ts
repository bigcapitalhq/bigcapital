import { Inject, Service } from 'typedi';
import { SendSaleEstimateMail } from './SendSaleEstimateMail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetSaleEstimateMailStateTransformer } from './GetSaleEstimateMailStateTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetSaleEstimateMailState {
  @Inject()
  private estimateMail: SendSaleEstimateMail;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the estimate mail state of the given sale estimate.
   * Estimate mail state includes the mail options, branding attributes and the estimate details.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<SaleEstimateMailState>}
   */
  async getEstimateMailState(
    tenantId: number,
    saleEstimateId: number
  ): Promise<SaleEstimateMailState> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const saleEstimate = await SaleEstimate.query()
      .findById(saleEstimateId)
      .withGraphFetched('customer')
      .withGraphFetched('entries.item')
      .withGraphFetched('pdfTemplate')
      .throwIfNotFound();

    const mailOptions = await this.estimateMail.getMailOptions(
      tenantId,
      saleEstimateId
    );
    const transformed = await this.transformer.transform(
      tenantId,
      saleEstimate,
      new GetSaleEstimateMailStateTransformer(),
      {
        mailOptions,
      }
    );
    return transformed;
  }
}
