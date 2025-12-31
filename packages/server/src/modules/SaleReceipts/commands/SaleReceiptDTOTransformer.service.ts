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
import { Customer } from '@/modules/Customers/models/Customer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import {
  CreateSaleReceiptDto,
  EditSaleReceiptDto,
} from '../dtos/SaleReceipt.dto';
import { ItemEntriesTaxTransactions } from '@/modules/TaxRates/ItemEntriesTaxTransactions.service';

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
   * @param {ItemEntriesTaxTransactions} taxDTOTransformer - Tax DTO transformer.
   */
  constructor(
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly branchDTOTransform: BranchTransactionDTOTransformer,
    private readonly warehouseDTOTransform: WarehouseTransactionDTOTransform,
    private readonly validators: SaleReceiptValidators,
    private readonly receiptIncrement: SaleReceiptIncrement,
    private readonly brandingTemplatesTransformer: BrandingTemplateDTOTransformer,
    private readonly taxDTOTransformer: ItemEntriesTaxTransactions,

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
    saleReceiptDTO: CreateSaleReceiptDto | EditSaleReceiptDto,
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
      referenceType: 'SaleReceipt',
      isInclusiveTax: saleReceiptDTO.isInclusiveTax,
      ...omit(entry, ['amount']),
    }));

    // Process entries sequentially to avoid async compose issues
    const step1 = await this.itemsEntriesService.setItemsEntriesDefaultAccounts(initialEntries);
    const step2 = await this.taxDTOTransformer.assocTaxRateIdFromCodeToEntries(step1);
    const asyncEntries = await this.taxDTOTransformer.assocTaxRatesFromTaxIdsToEntries(
      step2,
      saleReceiptDTO.isInclusiveTax,
    );

    const entries = R.compose(
      // Transform taxRateIds to nested taxes relations for graph insert.
      R.map((entry: any) => {
        if (entry.taxRateIds && entry.taxRateIds.length > 0) {
          const taxes =
            entry.calculatedTaxes?.map((tax: any, index: number) => ({
              taxRateId: tax.taxRateId,
              taxRate: tax.taxRate,
              taxAmount: tax.taxAmount || 0,
              taxableAmount: tax.taxableAmount || 0,
              order: index,
            })) || [];

          return {
            ...R.omit(['taxRateIds', 'calculatedTaxes', 'totalTaxAmount'], entry),
            taxes,
          };
        }
        return R.omit(['taxRateIds', 'calculatedTaxes', 'totalTaxAmount'], entry);
      }),
      // Remove tax code from entries.
      R.map(R.omit(['taxCode'])),
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
    const asyncDto = await composeAsync(
      this.branchDTOTransform.transformDTO<SaleReceipt>,
      this.warehouseDTOTransform.transformDTO<SaleReceipt>,

      // Assigns the default branding template id to the invoice DTO.
      this.brandingTemplatesTransformer.assocDefaultBrandingTemplate(
        'SaleReceipt',
      ),
    )(initialDTO);

    return R.compose(
      // Associates tax amount withheld to the model.
      this.taxDTOTransformer.assocTaxAmountWithheldFromEntries,
    )(asyncDto) as SaleReceipt;
  }
}
