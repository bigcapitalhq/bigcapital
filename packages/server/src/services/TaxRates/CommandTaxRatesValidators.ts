import { ServiceError } from '@/exceptions';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { IItemEntryDTO, ITaxRate } from '@/interfaces';
import { ERRORS } from './constants';
import { difference } from 'lodash';

@Service()
export class CommandTaxRatesValidators {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validates the tax rate existance.
   * @param {TaxRate | undefined | null} taxRate
   */
  public validateTaxRateExistance(taxRate: ITaxRate | undefined | null) {
    if (!taxRate) {
      throw new ServiceError(ERRORS.TAX_RATE_NOT_FOUND);
    }
  }

  /**
   * Validates the tax code uniquiness.
   * @param {number} tenantId
   * @param {string} taxCode
   */
  public async validateTaxCodeUnique(tenantId: number, taxCode: string) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const foundTaxCode = await TaxRate.query().findOne({ code: taxCode });

    if (foundTaxCode) {
      throw new ServiceError(ERRORS.TAX_CODE_NOT_UNIQUE);
    }
  }

  /**
   * Validates the tax codes of the given item entries DTO.
   * @param {number} tenantId
   * @param {IItemEntryDTO[]} itemEntriesDTO
   */
  public async validateItemEntriesTaxCode(
    tenantId: number,
    itemEntriesDTO: IItemEntryDTO[]
  ) {
    const { TaxRate } = this.tenancy.models(tenantId);
    const filteredTaxEntries = itemEntriesDTO.filter((e) => e.taxCode);
    const taxCodes = filteredTaxEntries.map((e) => e.taxCode);

    const foundTaxCodes = await TaxRate.query().whereIn('code', taxCodes);
    const foundCodes = foundTaxCodes.map((tax) => tax.code);

    const notFoundTaxCodes = difference(taxCodes, foundCodes);

    if (notFoundTaxCodes.length > 0) {
      throw new ServiceError(ERRORS.ITEM_ENTRY_TAX_RATE_CODE_NOT_FOUND);
    }
  }
}
