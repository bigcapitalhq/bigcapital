import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { omit, sumBy } from 'lodash';
import * as composeAsync from 'async/compose';
// import { ICustomer, ISaleEstimate, ISaleEstimateDTO } from '../types/SaleEstimates.types';
import { SaleEstimateValidators } from './SaleEstimateValidators.service';
// import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
// import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
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
// import { assocItemEntriesDefaultIndex } from '@/services/Items/utils';
// import { BrandingTemplateDTOTransformer } from '@/services/PdfTemplate/BrandingTemplateDTOTransformer';

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
  ) {}

  /**
   * Transform create DTO object ot model object.
   * @param  {ISaleEstimateDTO} saleEstimateDTO - Sale estimate DTO.
   * @param {Customer} paymentCustomer - Payment customer.
   * @param {SaleEstimate} oldSaleEstimate - Old sale estimate.
   * @return {ISaleEstimate}
   */
  async transformDTOToModel(
    estimateDTO: ISaleEstimateDTO,
    paymentCustomer: Customer,
    oldSaleEstimate?: SaleEstimate,
  ): Promise<SaleEstimate> {
    const amount = sumBy(estimateDTO.entries, (e) =>
      this.itemEntryModel().calcAmount(e),
    );
    // Retrieve the next invoice number.
    const autoNextNumber = this.estimateIncrement.getNextEstimateNumber();

    // Retrieve the next estimate number.
    const estimateNumber =
      estimateDTO.estimateNumber ||
      oldSaleEstimate?.estimateNumber ||
      autoNextNumber;

    // Validate the sale estimate number require.
    this.validators.validateEstimateNoRequire(estimateNumber);

    const entries = R.compose(
      // Associate the reference type to item entries.
      R.map((entry) => R.assoc('reference_type', 'SaleEstimate', entry)),

      // Associate default index to item entries.
      assocItemEntriesDefaultIndex,
    )(estimateDTO.entries);

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
    const initialAsyncDTO = await composeAsync(
      // Assigns the default branding template id to the invoice DTO.
      this.brandingTemplatesTransformer.assocDefaultBrandingTemplate(
        'SaleEstimate',
      ),
    )(initialDTO);

    return R.compose(
      this.branchDTOTransform.transformDTO<SaleEstimate>,
      this.warehouseDTOTransform.transformDTO<SaleEstimate>,
    )(initialAsyncDTO);
  }

  /**
   * Retrieve estimate number to object model.
   * @param {ISaleEstimateDTO} saleEstimateDTO
   * @param {ISaleEstimate} oldSaleEstimate
   */
  public transformEstimateNumberToModel(
    saleEstimateDTO: ISaleEstimateDTO,
    oldSaleEstimate?: SaleEstimate,
  ): string {
    const autoNextNumber = this.estimateIncrement.getNextEstimateNumber();

    if (saleEstimateDTO.estimateNumber) {
      return saleEstimateDTO.estimateNumber;
    }
    return oldSaleEstimate ? oldSaleEstimate.estimateNumber : autoNextNumber;
  }
}
