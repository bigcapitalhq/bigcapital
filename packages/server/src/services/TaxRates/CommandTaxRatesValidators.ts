import { ServiceError } from '@/exceptions';
import TaxRate from '@/models/TaxRate';
import { Service } from 'typedi';

@Service()
export class CommandTaxRatesValidators {
  /**
   * 
   * @param {} taxRate 
   */
  public validateTaxRateExistance(taxRate: TaxRate | undefined | null) {
    if (!taxRate) {
      throw new ServiceError(ERRORS.TAX_RATE_NOT_FOUND);
    }
  }
}
