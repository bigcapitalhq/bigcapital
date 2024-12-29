import { Inject, Injectable } from '@nestjs/common';
import { VendorCreditTransformer } from './VendorCreditTransformer';
import { ERRORS } from '../constants';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { VendorCredit } from '../models/VendorCredit';
import { ServiceError } from '@/modules/Items/ServiceError';
import { Knex } from 'knex';

@Injectable()
export default class GetVendorCreditService {
  constructor(
    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: typeof VendorCredit,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieve the given vendor credit.
   * @param {number} vendorCreditId - Vendor credit id.
   */
  public async getVendorCredit(
    vendorCreditId: number,
    trx?: Knex.Transaction,
  ) {
    // Retrieve the vendor credit model graph.
    const vendorCredit = await this.vendorCreditModel
      .query()
      .findById(vendorCreditId)
      .withGraphFetched('entries.item')
      .withGraphFetched('vendor')
      .withGraphFetched('branch') 
      .withGraphFetched('attachments');

    if (!vendorCredit) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_NOT_FOUND);
    }
    return this.transformer.transform(
      vendorCredit,
      new VendorCreditTransformer()
    );
  }
}
