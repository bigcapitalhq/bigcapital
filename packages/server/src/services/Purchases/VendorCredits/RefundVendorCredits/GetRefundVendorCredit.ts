import { IRefundVendorCredit } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import RefundVendorCredit from './RefundVendorCredit';
import { RefundVendorCreditTransformer } from './RefundVendorCreditTransformer';

@Service()
export default class GetRefundVendorCredit extends RefundVendorCredit {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve refund vendor credit transaction.
   * @param {number} tenantId
   * @param {number} refundId
   * @returns {Promise<IRefundVendorCredit>}
   */
  public getRefundCreditTransaction = async (tenantId: number, refundId: number): Promise<IRefundVendorCredit> => {
    const { RefundVendorCredit } = this.tenancy.models(tenantId);

    await this.getRefundVendorCreditOrThrowError(tenantId, refundId);

    // Retrieve refund transactions associated to the given vendor credit.
    const refundVendorTransactions = await RefundVendorCredit.query()
      .findById(refundId)
      .withGraphFetched('vendorCredit')
      .withGraphFetched('depositAccount');

    // Transformes refund vendor credit models to POJO objects.
    return this.transformer.transform(tenantId, refundVendorTransactions, new RefundVendorCreditTransformer());
  };
}
