import { Knex } from 'knex';
import { difference } from 'lodash';
// import { IItemEntryDTO } from '@/modules/Items/';
import { ERRORS } from '../constants';
import { TaxRateModel } from '../models/TaxRate.model';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { IItemEntryDTO } from '@/modules/TransactionItemEntry/ItemEntry.types';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';

@Injectable()
export class CommandTaxRatesValidators {
  /**
   * @param {TenantModelProxy<typeof TaxRateModel>} taxRateModel - The tax rate model.
   */
  constructor(
    @Inject(TaxRateModel.name)
    private readonly taxRateModel: TenantModelProxy<typeof TaxRateModel>,
  ) {}

  /**
   * Validates the tax rate existance.
   * @param {TaxRate | undefined | null} taxRate
   */
  public validateTaxRateExistance(taxRate: TaxRateModel | undefined | null) {
    if (!taxRate) {
      throw new ServiceError(ERRORS.TAX_RATE_NOT_FOUND);
    }
  }

  /**
   * Validates the given tax rate active.
   * @param {TaxRateModel} taxRate
   */
  public validateTaxRateNotActive(taxRate: TaxRateModel) {
    if (taxRate.active) {
      throw new ServiceError(ERRORS.TAX_RATE_ALREADY_ACTIVE);
    }
  }

  /**
   * Validates the given tax rate inactive.
   * @param {TaxRateModel} taxRate
   */
  public validateTaxRateNotInactive(taxRate: TaxRateModel) {
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
  public async validateTaxCodeUnique(taxCode: string, trx?: Knex.Transaction) {
    const foundTaxCode = await this.taxRateModel()
      .query(trx)
      .findOne({ code: taxCode });

    if (foundTaxCode) {
      throw new ServiceError(ERRORS.TAX_CODE_NOT_UNIQUE);
    }
  }

  /**
   * Validates the tax codes of the given item entries DTO.
   * @param {IItemEntryDTO[]} itemEntriesDTO
   * @throws {ServiceError}
   */
  public async validateItemEntriesTaxCode(itemEntriesDTO: ItemEntryDto[]) {
    const filteredTaxEntries = itemEntriesDTO.filter((e) => e.taxCode);
    const taxCodes = filteredTaxEntries.map((e) => e.taxCode);

    // Can't validate if there is no tax codes.
    if (taxCodes.length === 0) return;

    const foundTaxCodes = await this.taxRateModel()
      .query()
      .whereIn('code', taxCodes);
    const foundCodes = foundTaxCodes.map((tax) => tax.code);

    const notFoundTaxCodes = difference(taxCodes, foundCodes);

    if (notFoundTaxCodes.length > 0) {
      throw new ServiceError(ERRORS.ITEM_ENTRY_TAX_RATE_CODE_NOT_FOUND);
    }
  }

  /**
   * Validates the tax rate id of the given item entries DTO.
   * @param {ItemEntryDto[]} itemEntriesDTO
   * @throws {ServiceError}
   */
  public async validateItemEntriesTaxCodeId(itemEntriesDTO: ItemEntryDto[]) {
    const filteredTaxEntries = itemEntriesDTO.filter((e) => e.taxRateId);
    const taxRatesIds = filteredTaxEntries.map((e) => e.taxRateId);

    // Can't validate if there is no tax codes.
    if (taxRatesIds.length === 0) return;

    const foundTaxCodes = await this.taxRateModel()
      .query()
      .whereIn('id', taxRatesIds);
    const foundTaxRatesIds = foundTaxCodes.map((tax) => tax.id);

    const notFoundTaxCodes = difference(taxRatesIds, foundTaxRatesIds);

    if (notFoundTaxCodes.length > 0) {
      throw new ServiceError(ERRORS.ITEM_ENTRY_TAX_RATE_ID_NOT_FOUND);
    }
  }
}
