import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { difference } from 'lodash';
import { ServiceError } from '@/exceptions';
import HasTenancyService from '../Tenancy/TenancyService';
import { IItemEntryDTO, ITaxRate } from '@/interfaces';
import { ERRORS } from './constants';

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
   * Validates the given tax rate active.
   * @param {ITaxRate} taxRate
   */
  public validateTaxRateNotActive(taxRate: ITaxRate) {
    if (taxRate.active) {
      throw new ServiceError(ERRORS.TAX_RATE_ALREADY_ACTIVE);
    }
  }

  /**
   * Validates the given tax rate inactive.
   * @param {ITaxRate} taxRate
   */
  public validateTaxRateNotInactive(taxRate: ITaxRate) {
    if (!taxRate.active) {
      throw new ServiceError(ERRORS.TAX_RATE_ALREADY_INACTIVE);
    }
  }

  /**
   * Validates the tax code uniquiness.
   * @param {number} tenantId
   * @param {string} taxCode
   * @param {Knex.Transaction} trx -
   */
  public async validateTaxCodeUnique(
    tenantId: number,
    taxCode: string,
    trx?: Knex.Transaction
  ) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const foundTaxCode = await TaxRate.query(trx).findOne({ code: taxCode });

    if (foundTaxCode) {
      throw new ServiceError(ERRORS.TAX_CODE_NOT_UNIQUE);
    }
  }

  /**
   * Validates the tax codes of the given item entries DTO.
   * @param {number} tenantId
   * @param {IItemEntryDTO[]} itemEntriesDTO
   * @throws {ServiceError}
   */
  public async validateItemEntriesTaxCode(
    tenantId: number,
    itemEntriesDTO: IItemEntryDTO[]
  ) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const filteredTaxEntries = itemEntriesDTO.filter((e) => e.taxCode);
    const taxCodes = filteredTaxEntries.map((e) => e.taxCode);

    // Can't validate if there is no tax codes.
    if (taxCodes.length === 0) return;

    const foundTaxCodes = await TaxRate.query().whereIn('code', taxCodes);
    const foundCodes = foundTaxCodes.map((tax) => tax.code);

    const notFoundTaxCodes = difference(taxCodes, foundCodes);

    if (notFoundTaxCodes.length > 0) {
      throw new ServiceError(ERRORS.ITEM_ENTRY_TAX_RATE_CODE_NOT_FOUND);
    }
  }

  /**
   * Validates the tax rate id of the given item entries DTO.
   * @param {number} tenantId
   * @param {IItemEntryDTO[]} itemEntriesDTO
   * @throws {ServiceError}
   */
  public async validateItemEntriesTaxCodeId(
    tenantId: number,
    itemEntriesDTO: IItemEntryDTO[]
  ) {
    const filteredTaxEntries = itemEntriesDTO.filter((e) => e.taxRateId);
    const taxRatesIds = filteredTaxEntries.map((e) => e.taxRateId);

    // Can't validate if there is no tax codes.
    if (taxRatesIds.length === 0) return;

    const { TaxRate } = this.tenancy.models(tenantId);
    const foundTaxCodes = await TaxRate.query().whereIn('id', taxRatesIds);
    const foundTaxRatesIds = foundTaxCodes.map((tax) => tax.id);

    const notFoundTaxCodes = difference(taxRatesIds, foundTaxRatesIds);

    if (notFoundTaxCodes.length > 0) {
      throw new ServiceError(ERRORS.ITEM_ENTRY_TAX_RATE_ID_NOT_FOUND);
    }
  }
}
