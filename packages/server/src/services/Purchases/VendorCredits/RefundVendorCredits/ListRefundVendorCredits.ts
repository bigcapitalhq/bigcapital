import { IRefundVendorCreditPOJO } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import RefundVendorCredit from './RefundVendorCredit';
import { RefundVendorCreditTransformer } from './RefundVendorCreditTransformer';

@Service()
export default class ListVendorCreditRefunds extends RefundVendorCredit {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the credit note graph.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<IRefundCreditNotePOJO[]>}
   */
  public getVendorCreditRefunds = async (
    tenantId: number,
    vendorCreditId: number
  ): Promise<IRefundVendorCreditPOJO[]> => {
    const { RefundVendorCredit } = this.tenancy.models(tenantId);

    // Retrieve refund transactions associated to the given vendor credit.
    const refundVendorTransactions = await RefundVendorCredit.query()
      .where('vendorCreditId', vendorCreditId)
      .withGraphFetched('vendorCredit')
      .withGraphFetched('depositAccount');

    // Transforms refund vendor credit models to POJO objects.
    return this.transformer.transform(
      tenantId,
      refundVendorTransactions,
      new RefundVendorCreditTransformer()
    );
  };
}
