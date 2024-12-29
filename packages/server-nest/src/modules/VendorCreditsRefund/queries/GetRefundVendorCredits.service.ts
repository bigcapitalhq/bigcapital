import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { RefundVendorCreditTransformer } from '../commands/RefundVendorCreditTransformer';
import { Injectable } from '@nestjs/common';
import { RefundVendorCredit } from '../../models/RefundVendorCredit';
import { IRefundVendorCreditPOJO } from '../../types/VendorCredit.types';

@Injectable()
export class GetRefundVendorCreditsService {
  /**
   * @param {TransformerInjectable} transformer - Transformer injectable service.
   * @param {typeof RefundVendorCredit} refundVendorCreditModel - Refund vendor credit model.
   */
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly refundVendorCreditModel: typeof RefundVendorCredit,
  ) {}

  /**
   * Retrieve the refund vendor credit graph.
   * @param {number} vendorCreditId - Vendor credit id.
   * @returns {Promise<IRefundVendorCreditPOJO[]>}
   */
  public getVendorCreditRefunds = async (
    vendorCreditId: number,
  ): Promise<IRefundVendorCreditPOJO[]> => {
    // Retrieve refund transactions associated to the given vendor credit.
    const refundVendorTransactions = await this.refundVendorCreditModel
      .query()
      .where('vendorCreditId', vendorCreditId)
      .withGraphFetched('vendorCredit')
      .withGraphFetched('depositAccount');

    // Transformes refund vendor credit models to POJO objects.
    return this.transformer.transform(
      refundVendorTransactions,
      new RefundVendorCreditTransformer(),
    );
  };
}
