import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { omit, sumBy } from 'lodash';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ICustomer, ISaleEstimate, ISaleEstimateDTO } from '@/interfaces';
import { SaleEstimateValidators } from './SaleEstimateValidators';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { formatDateFields } from '@/utils';

@Service()
export class SaleEstimateDTOTransformer {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validators: SaleEstimateValidators;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  /**
   * Transform create DTO object ot model object.
   * @param  {number} tenantId
   * @param  {ISaleEstimateDTO} saleEstimateDTO - Sale estimate DTO.
   * @return {ISaleEstimate}
   */
  async transformDTOToModel(
    tenantId: number,
    estimateDTO: ISaleEstimateDTO,
    paymentCustomer: ICustomer,
    oldSaleEstimate?: ISaleEstimate
  ): Promise<ISaleEstimate> {
    const { ItemEntry, Contact } = this.tenancy.models(tenantId);

    const amount = sumBy(estimateDTO.entries, (e) => ItemEntry.calcAmount(e));

    // Retreive the next invoice number.
    const autoNextNumber = this.getNextEstimateNumber(tenantId);

    // Retreive the next estimate number.
    const estimateNumber =
      estimateDTO.estimateNumber ||
      oldSaleEstimate?.estimateNumber ||
      autoNextNumber;

    // Validate the sale estimate number require.
    this.validators.validateEstimateNoRequire(estimateNumber);

    const initialDTO = {
      amount,
      ...formatDateFields(omit(estimateDTO, ['delivered', 'entries']), [
        'estimateDate',
        'expirationDate',
      ]),
      currencyCode: paymentCustomer.currencyCode,
      exchangeRate: estimateDTO.exchangeRate || 1,
      ...(estimateNumber ? { estimateNumber } : {}),
      entries: estimateDTO.entries.map((entry) => ({
        reference_type: 'SaleEstimate',
        ...entry,
      })),
      // Avoid rewrite the deliver date in edit mode when already published.
      ...(estimateDTO.delivered &&
        !oldSaleEstimate?.deliveredAt && {
          deliveredAt: moment().toMySqlDateTime(),
        }),
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<ISaleEstimate>(tenantId),
      this.warehouseDTOTransform.transformDTO<ISaleEstimate>(tenantId)
    )(initialDTO);
  }
}
