import { Inject, Injectable } from '@nestjs/common';
import { SaleReceiptTransformer } from './SaleReceiptTransformer';
import { SaleReceiptValidators } from '../commands/SaleReceiptValidators.service';
import { SaleReceipt } from '../models/SaleReceipt';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { GetResourceCustomFieldsService } from '@/modules/CustomFields/queries/GetResourceCustomFields.service';

@Injectable()
export class GetSaleReceipt {
  constructor(
    @Inject(SaleReceipt.name)
    private readonly saleReceiptModel: TenantModelProxy<typeof SaleReceipt>,
    private readonly transformer: TransformerInjectable,
    private readonly getResourceCustomFieldsService: GetResourceCustomFieldsService,
  ) {}

  /**
   * Retrieve sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @return {ISaleReceipt}
   */
  public async getSaleReceipt(saleReceiptId: number) {
    const saleReceipt = await this.saleReceiptModel()
      .query()
      .findById(saleReceiptId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('depositAccount')
      .withGraphFetched('branch')
      .withGraphFetched('attachments')
      .throwIfNotFound();

    // Load custom field values.
    const customFields = await this.getResourceCustomFieldsService.getResourceCustomFields(
      'SaleReceipt',
      saleReceiptId,
    );

    const transformed = await this.transformer.transform(
      saleReceipt,
      new SaleReceiptTransformer(),
      { customFields },
    );

    return transformed;
  }
}
