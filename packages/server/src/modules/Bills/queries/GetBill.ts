import { Inject, Injectable } from '@nestjs/common';
import { BillsValidators } from '../commands/BillsValidators.service';
import { BillTransformer } from './Bill.transformer';
import { Bill } from '../models/Bill';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetBill {
  constructor(
    @Inject(Bill.name) private billModel: TenantModelProxy<typeof Bill>,

    private transformer: TransformerInjectable,
    private validators: BillsValidators,
  ) {}

  /**
   * Retrieve the given bill details with associated items entries.
   * @param {Integer} billId - Specific bill.
   * @returns {Promise<IBill>}
   */
  public async getBill(billId: number): Promise<Bill> {
    const bill = await this.billModel()
      .query()
      .findById(billId)
      .withGraphFetched('vendor')
      .withGraphFetched('entries.[item, taxes]')
      .withGraphFetched('branch')
      .withGraphFetched('taxes.taxRate')
      .withGraphFetched('attachments');

    // Validates the bill existence.
    this.validators.validateBillExistance(bill);

    return this.transformer.transform(bill, new BillTransformer());
  }
}
