import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { omit, sumBy } from 'lodash';
import { SaleEstimateValidators } from './SaleEstimateValidators.service';
import { formatDateFields } from '@/utils/format-date-fields';
import * as moment from 'moment';
import { SaleEstimateIncrement } from './SaleEstimateIncrement.service';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/modules/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { assocItemEntriesDefaultIndex } from '@/utils/associate-item-entries-index';
import { BrandingTemplateDTOTransformer } from '@/modules/PdfTemplate/BrandingTemplateDTOTransformer';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { SaleEstimate } from '../models/SaleEstimate';
import { Customer } from '@/modules/Customers/models/Customer';
import { ISaleEstimateDTO } from '../types/SaleEstimates.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CommandSaleEstimateDto } from '../dtos/SaleEstimate.dto';
import { ItemEntriesTaxTransactions } from '@/modules/TaxRates/ItemEntriesTaxTransactions.service';

@Injectable()
export class SaleEstimateDTOTransformer {
  constructor(
    @Inject(ItemEntry.name)
    private itemEntryModel: TenantModelProxy<typeof ItemEntry>,

    private readonly validators: SaleEstimateValidators,
    private readonly branchDTOTransform: BranchTransactionDTOTransformer,
    private readonly warehouseDTOTransform: WarehouseTransactionDTOTransform,
    private readonly estimateIncrement: SaleEstimateIncrement,
    private readonly brandingTemplatesTransformer: BrandingTemplateDTOTransformer,
    private readonly taxDTOTransformer: ItemEntriesTaxTransactions,
  ) {}

  /**
   * Transform create DTO object ot model object.
   * @param  {ISaleEstimateDTO} saleEstimateDTO - Sale estimate DTO.
   * @param {Customer} paymentCustomer - Payment customer.
   * @param {SaleEstimate} oldSaleEstimate - Old sale estimate.
   * @return {ISaleEstimate}
   */
  async transformDTOToModel(
    estimateDTO: CommandSaleEstimateDto,
    paymentCustomer: Customer,
    oldSaleEstimate?: SaleEstimate,
  ): Promise<SaleEstimate> {
    const amount = sumBy(estimateDTO.entries, (e) =>
      this.itemEntryModel().calcAmount(e),
    );
    // Retrieve the next invoice number.
    const autoNextNumber = await this.estimateIncrement.getNextEstimateNumber();

    // Retrieve the next estimate number.
    const estimateNumber =
      estimateDTO.estimateNumber ||
      oldSaleEstimate?.estimateNumber ||
      autoNextNumber;

    // Validate the sale estimate number require.
    this.validators.validateEstimateNoRequire(estimateNumber);

    const initialEntries = estimateDTO.entries.map((entry) => ({
      referenceType: 'SaleEstimate',
      isInclusiveTax: estimateDTO.isInclusiveTax,
      ...omit(entry, ['amount']),
    }));

    // Process taxes for entries - sequential to avoid composeAsync hanging
    const step1Entries =
      await this.taxDTOTransformer.assocTaxRateIdFromCodeToEntries(
        initialEntries,
      );
    const asyncEntries =
      await this.taxDTOTransformer.assocTaxRatesFromTaxIdsToEntries(
        step1Entries,
        estimateDTO.isInclusiveTax,
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
      // Associate default index to item entries.
      assocItemEntriesDefaultIndex,
    )(asyncEntries);

    const initialDTO = {
      amount,
      ...formatDateFields(
        omit(estimateDTO, ['delivered', 'entries', 'attachments']),
        ['estimateDate', 'expirationDate'],
      ),
      currencyCode: paymentCustomer.currencyCode,
      exchangeRate: estimateDTO.exchangeRate || 1,
      ...(estimateNumber ? { estimateNumber } : {}),
      entries,
      // Avoid rewrite the deliver date in edit mode when already published.
      ...(estimateDTO.delivered &&
        !oldSaleEstimate?.deliveredAt && {
          deliveredAt: moment().toMySqlDateTime(),
        }),
    };

    // Process DTO transformations sequentially to avoid composeAsync hanging
    const dtoStep1 =
      await this.brandingTemplatesTransformer.assocDefaultBrandingTemplate(
        'SaleEstimate',
      )(initialDTO);
    const dtoStep2 = await this.warehouseDTOTransform.transformDTO<SaleEstimate>(
      dtoStep1 as unknown as SaleEstimate,
    );
    const asyncDto = await this.branchDTOTransform.transformDTO<SaleEstimate>(
      dtoStep2 as unknown as SaleEstimate,
    );

    return R.compose(
      // Associates tax amount withheld to the model.
      this.taxDTOTransformer.assocTaxAmountWithheldFromEntries,
    )(asyncDto) as SaleEstimate;
  }

  /**
   * Retrieve estimate number to object model.
   * @param {ISaleEstimateDTO} saleEstimateDTO
   * @param {ISaleEstimate} oldSaleEstimate
   */
  public async transformEstimateNumberToModel(
    saleEstimateDTO: ISaleEstimateDTO,
    oldSaleEstimate?: SaleEstimate,
  ): Promise<string> {
    const autoNextNumber = await this.estimateIncrement.getNextEstimateNumber();

    if (saleEstimateDTO.estimateNumber) {
      return saleEstimateDTO.estimateNumber;
    }
    return oldSaleEstimate ? oldSaleEstimate.estimateNumber : autoNextNumber;
  }
}
