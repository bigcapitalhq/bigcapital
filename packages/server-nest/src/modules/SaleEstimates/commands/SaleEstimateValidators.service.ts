import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../constants';
import { SaleEstimate } from '../models/SaleEstimate';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class SaleEstimateValidators {
  constructor(
    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: typeof SaleEstimate,
  ) {}

  /**
   * Validates the given estimate existance.
   * @param {SaleEstimate | undefined | null} estimate - The sale estimate.
   */
  public validateEstimateExistance(estimate: SaleEstimate | undefined | null) {
    if (!estimate) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_FOUND);
    }
  }

  /**
   * Validate the estimate number unique on the storage.
   * @param {string} estimateNumber - The estimate number.
   * @param {number} notEstimateId - The estimate id to exclude from the search.
   */
  public async validateEstimateNumberExistance(
    estimateNumber: string,
    notEstimateId?: number,
  ) {
    const foundSaleEstimate = await this.saleEstimateModel
      .query()
      .findOne('estimate_number', estimateNumber)
      .onBuild((builder) => {
        if (notEstimateId) {
          builder.whereNot('id', notEstimateId);
        }
      });
    if (foundSaleEstimate) {
      throw new ServiceError(
        ERRORS.SALE_ESTIMATE_NUMBER_EXISTANCE,
        'The given sale estimate is not unique.',
      );
    }
  }

  /**
   * Validates the given sale estimate not already converted to invoice.
   * @param {SaleEstimate} saleEstimate -
   */
  public validateEstimateNotConverted(saleEstimate: SaleEstimate) {
    if (saleEstimate.isConvertedToInvoice) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_CONVERTED_TO_INVOICE);
    }
  }

  /**
   * Validate the sale estimate number require.
   * @param {string} estimateNumber
   */
  public validateEstimateNoRequire(estimateNumber: string) {
    if (!estimateNumber) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NO_IS_REQUIRED);
    }
  }

  /**
   * Validate the given customer has no sales estimates.
   * @param {number} customerId - The customer id.
   */
  public async validateCustomerHasNoEstimates(customerId: number) {
    const estimates = await this.saleEstimateModel
      .query()
      .where('customer_id', customerId);

    if (estimates.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_SALES_ESTIMATES);
    }
  }
}
