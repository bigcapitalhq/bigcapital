import { Injectable } from '@nestjs/common';
import { RefundVendorCreditTransformer } from '../commands/RefundVendorCreditTransformer';
import { RefundVendorCredit, RefundVendorCredit as RefundVendorCreditModel } from '../../models/RefundVendorCredit';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';

@Injectable()
export class GetRefundVendorCreditService {
  /**
   * @param {TransformerInjectable} transformer - Transformer injectable service.
   * @param {typeof RefundVendorCreditModel} refundVendorCreditModel - Refund vendor credit model.
   */
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly refundVendorCreditModel: typeof RefundVendorCreditModel,
  ) {
  }

  /**
   * Retrieve refund vendor credit transaction.
   * @param {number} refundId
   * @returns {Promise<IRefundVendorCredit>}
   */
  public getRefundCreditTransaction = async (
    refundId: number,
  ): Promise<RefundVendorCredit> => {
    await this.refundVendorCreditModel
      .query()
      .findById(refundId)
      .throwIfNotFound();

    // Retrieve refund transactions associated to the given vendor credit.
    const refundVendorTransactions = await this.refundVendorCreditModel
      .query()
      .findById(refundId)
      .withGraphFetched('vendorCredit')
      .withGraphFetched('depositAccount');

    // Transforms refund vendor credit models to POJO objects.
    return this.transformer.transform(
      refundVendorTransactions,
      new RefundVendorCreditTransformer(),
    );
  };
}
