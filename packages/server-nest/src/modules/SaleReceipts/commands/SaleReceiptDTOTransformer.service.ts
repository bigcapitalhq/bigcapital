import { Inject, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { sumBy, omit } from 'lodash';
import * as composeAsync from 'async/compose';
import * as moment from 'moment';
import { SaleReceiptIncrement } from './SaleReceiptIncrement.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/modules/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { SaleReceiptValidators } from './SaleReceiptValidators.service';
import { BrandingTemplateDTOTransformer } from '@/modules/PdfTemplate/BrandingTemplateDTOTransformer';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { formatDateFields } from '@/utils/format-date-fields';
import { assocItemEntriesDefaultIndex } from '@/utils/associate-item-entries-index';
import { SaleReceipt } from '../models/SaleReceipt';
import { ISaleReceiptDTO } from '../types/SaleReceipts.types';
import { Customer } from '@/modules/Customers/models/Customer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class SaleReceiptDTOTransformer {
  /**
   * @param {ItemsEntriesService} itemsEntriesService - Items entries service.
   * @param {BranchTransactionDTOTransformer} branchDTOTransform - Branch transaction DTO transformer.
   * @param {WarehouseTransactionDTOTransform} warehouseDTOTransform - Warehouse transaction DTO transformer.
   * @param {SaleReceiptValidators} validators - Sale receipt validators.
   * @param {SaleReceiptIncrement} receiptIncrement - Sale receipt increment.
   * @param {BrandingTemplateDTOTransformer} brandingTemplatesTransformer - Branding template DTO transformer.
   * @param {typeof ItemEntry} itemEntryModel - Item entry model.
   */
  constructor(
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly branchDTOTransform: BranchTransactionDTOTransformer,
    private readonly warehouseDTOTransform: WarehouseTransactionDTOTransform,
    private readonly validators: SaleReceiptValidators,
    private readonly receiptIncrement: SaleReceiptIncrement,
    private readonly brandingTemplatesTransformer: BrandingTemplateDTOTransformer,

    @Inject(ItemEntry.name)
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,
  ) {}

  /**
   * Transform create DTO object to model object.
   * @param {ISaleReceiptDTO} saleReceiptDTO -
   * @param {ISaleReceipt} oldSaleReceipt -
   * @returns {ISaleReceipt}
   */
  async transformDTOToModel(
    saleReceiptDTO: ISaleReceiptDTO,
    paymentCustomer: Customer,
    oldSaleReceipt?: SaleReceipt,
  ): Promise<SaleReceipt> {
    const amount = sumBy(saleReceiptDTO.entries, (e) =>
      this.itemEntryModel().calcAmount(e),
    );
    // Retrieve the next invoice number.
    const autoNextNumber = await this.receiptIncrement.getNextReceiptNumber();

    // Retrieve the receipt number.
    const receiptNumber =
      saleReceiptDTO.receiptNumber ||
      oldSaleReceipt?.receiptNumber ||
      autoNextNumber;

    // Validate receipt number require.
    this.validators.validateReceiptNoRequire(receiptNumber);

    const initialEntries = saleReceiptDTO.entries.map((entry) => ({
      reference_type: 'SaleReceipt',
      ...entry,
    }));
    const asyncEntries = await composeAsync(
      // Sets default cost and sell account to receipt items entries.
      this.itemsEntriesService.setItemsEntriesDefaultAccounts,
    )(initialEntries);

    const entries = R.compose(
      // Associate the default index for each item entry.
      assocItemEntriesDefaultIndex,
    )(asyncEntries);

    const initialDTO = {
      amount,
      ...formatDateFields(
        omit(saleReceiptDTO, ['closed', 'entries', 'attachments']),
        ['receiptDate'],
      ),
      currencyCode: paymentCustomer.currencyCode,
      exchangeRate: saleReceiptDTO.exchangeRate || 1,
      receiptNumber,
      // Avoid rewrite the deliver date in edit mode when already published.
      ...(saleReceiptDTO.closed &&
        !oldSaleReceipt?.closedAt && {
          closedAt: moment().toMySqlDateTime(),
        }),
      entries,
    };
    const initialAsyncDTO = await composeAsync(
      // Assigns the default branding template id to the invoice DTO.
      this.brandingTemplatesTransformer.assocDefaultBrandingTemplate(
        'SaleReceipt',
      ),
    )(initialDTO);

    return R.compose(
      this.branchDTOTransform.transformDTO<SaleReceipt>,
      this.warehouseDTOTransform.transformDTO<SaleReceipt>,
    )(initialAsyncDTO) as SaleReceipt;
  }
}
