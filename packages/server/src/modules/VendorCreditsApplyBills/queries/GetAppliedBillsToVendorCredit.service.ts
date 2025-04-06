import { Inject, Injectable } from '@nestjs/common';
import { VendorCreditAppliedBillTransformer } from './VendorCreditAppliedBillTransformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { VendorCreditAppliedBill } from '@/modules/VendorCreditsApplyBills/models/VendorCreditAppliedBill';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetAppliedBillsToVendorCreditService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(VendorCreditAppliedBill.name)
    private readonly vendorCreditAppliedBillModel: TenantModelProxy<
      typeof VendorCreditAppliedBill
    >,

    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: TenantModelProxy<typeof VendorCredit>,
  ) {}

  /**
   * Get applied bills to vendor credit.
   * @param {number} vendorCreditId
   * @returns
   */
  public getAppliedBills = async (vendorCreditId: number) => {
    const vendorCredit = await this.vendorCreditModel()
      .query()
      .findById(vendorCreditId)
      .throwIfNotFound();

    const appliedToBills = await this.vendorCreditAppliedBillModel()
      .query()
      .where('vendorCreditId', vendorCreditId)
      .withGraphFetched('bill')
      .withGraphFetched('vendorCredit');

    // Transforms the models to POJO.
    return this.transformer.transform(
      appliedToBills,
      new VendorCreditAppliedBillTransformer(),
    );
  };
}
