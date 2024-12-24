import { Injectable } from '@nestjs/common';
import { SaleReceiptTransformer } from './SaleReceiptTransformer';
import { SaleReceiptValidators } from '../commands/SaleReceiptValidators.service';
import { SaleReceipt } from '../models/SaleReceipt';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';

@Injectable()
export class GetSaleReceipt {
  constructor(
    private readonly saleReceiptModel: typeof SaleReceipt,
    private readonly transformer: TransformerInjectable,
    private readonly validators: SaleReceiptValidators,
  ) {}

  /**
   * Retrieve sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @return {ISaleReceipt}
   */
  public async getSaleReceipt(saleReceiptId: number) {
    const saleReceipt = await this.saleReceiptModel
      .query()
      .findById(saleReceiptId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('depositAccount')
      .withGraphFetched('branch')
      .withGraphFetched('attachments')
      .throwIfNotFound()

    return this.transformer.transform(
      saleReceipt,
      new SaleReceiptTransformer()
    );
  }
}
