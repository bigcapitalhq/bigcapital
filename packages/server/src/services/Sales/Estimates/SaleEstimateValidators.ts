import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ISaleEstimate } from '@/interfaces';
import { ERRORS } from './constants';
import { SaleEstimate } from '@/models';

@Service()
export class SaleEstimateValidators {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validates the given estimate existance.
   * @param {SaleEstimate | undefined | null} estimate -
   */
  public validateEstimateExistance(estimate: SaleEstimate | undefined | null) {
    if (!estimate) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_FOUND);
    }
  }

  /**
   * Validate the estimate number unique on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  public async validateEstimateNumberExistance(
    tenantId: number,
    estimateNumber: string,
    notEstimateId?: number
  ) {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const foundSaleEstimate = await SaleEstimate.query()
      .findOne('estimate_number', estimateNumber)
      .onBuild((builder) => {
        if (notEstimateId) {
          builder.whereNot('id', notEstimateId);
        }
      });
    if (foundSaleEstimate) {
      throw new ServiceError(
        ERRORS.SALE_ESTIMATE_NUMBER_EXISTANCE,
        'The given sale estimate is not unique.'
      );
    }
  }

  /**
   * Validates the given sale estimate not already converted to invoice.
   * @param {ISaleEstimate} saleEstimate -
   */
  public validateEstimateNotConverted(saleEstimate: ISaleEstimate) {
    if (saleEstimate.isConvertedToInvoice) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_CONVERTED_TO_INVOICE);
    }
  }

  /**
   * Validate the sale estimate number require.
   * @param {ISaleEstimate} saleInvoiceObj
   */
  public validateEstimateNoRequire(estimateNumber: string) {
    if (!estimateNumber) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NO_IS_REQUIRED);
    }
  }

  /**
   * Validate the given customer has no sales estimates.
   * @param {number} tenantId
   * @param {number} customerId - Customer id.
   */
  public async validateCustomerHasNoEstimates(
    tenantId: number,
    customerId: number
  ) {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const estimates = await SaleEstimate.query().where(
      'customer_id',
      customerId
    );
    if (estimates.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_SALES_ESTIMATES);
    }
  }
}
