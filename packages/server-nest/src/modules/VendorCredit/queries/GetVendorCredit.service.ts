import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { VendorCreditTransformer } from './VendorCreditTransformer';
import { ERRORS } from '../constants';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { VendorCredit } from '../models/VendorCredit';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class GetVendorCreditService {
  /**
   * @param {typeof VendorCredit} vendorCreditModel - Vendor credit model.
   * @param {TransformerInjectable} transformer - Transformer service.
   */
  constructor(
    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: typeof VendorCredit,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieves the given vendor credit.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public async getVendorCredit(vendorCreditId: number, trx?: Knex.Transaction) {
    // Retrieve the vendor credit model graph.
    const vendorCredit = await this.vendorCreditModel
      .query(trx)
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
      new VendorCreditTransformer(),
    );
  }
}
