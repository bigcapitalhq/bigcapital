import { Inject, Service } from 'typedi';
import {
  ICurrencyEditDTO,
  ICurrencyDTO,
  ICurrenciesService,
  ICurrency,
} from '@/interfaces';
import { ServiceError } from '@/exceptions';
import TenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { CurrencyTransformer } from './CurrencyTransformer';

const ERRORS = {
  CURRENCY_NOT_FOUND: 'currency_not_found',
  CURRENCY_CODE_EXISTS: 'currency_code_exists',
  BASE_CURRENCY_INVALID: 'BASE_CURRENCY_INVALID',
  CANNOT_DELETE_BASE_CURRENCY: 'CANNOT_DELETE_BASE_CURRENCY',
};

@Service()
export default class CurrenciesService implements ICurrenciesService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve currency by given currency code or throw not found error.
   * @param {number} tenantId
   * @param {string} currencyCode
   * @param {number} currencyId
   */
  private async validateCurrencyCodeUniqueness(
    tenantId: number,
    currencyCode: string,
    currencyId?: number
  ) {
    const { Currency } = this.tenancy.models(tenantId);

    const foundCurrency = await Currency.query().onBuild((query) => {
      query.findOne('currency_code', currencyCode);

      if (currencyId) {
        query.whereNot('id', currencyId);
      }
    });
    if (foundCurrency) {
      throw new ServiceError(ERRORS.CURRENCY_CODE_EXISTS);
    }
  }

  /**
   * Retrieve currency by the given currency code or throw service error.
   * @param {number} tenantId
   * @param {string} currencyCode
   */
  private async getCurrencyByCodeOrThrowError(
    tenantId: number,
    currencyCode: string
  ) {
    const { Currency } = this.tenancy.models(tenantId);

    const foundCurrency = await Currency.query().findOne(
      'currency_code',
      currencyCode
    );

    if (!foundCurrency) {
      throw new ServiceError(ERRORS.CURRENCY_NOT_FOUND);
    }
    return foundCurrency;
  }

  /**
   * Retrieve currency by given id or throw not found error.
   * @param {number} tenantId
   * @param {number} currencyId
   */
  private async getCurrencyIdOrThrowError(
    tenantId: number,
    currencyId: number
  ) {
    const { Currency } = this.tenancy.models(tenantId);

    const foundCurrency = await Currency.query().findOne('id', currencyId);

    if (!foundCurrency) {
      throw new ServiceError(ERRORS.CURRENCY_NOT_FOUND);
    }
    return foundCurrency;
  }

  /**
   * Creates a new currency.
   * @param {number} tenantId
   * @param {ICurrencyDTO} currencyDTO
   */
  public async newCurrency(tenantId: number, currencyDTO: ICurrencyDTO) {
    const { Currency } = this.tenancy.models(tenantId);

    // Validate currency code uniqueness.
    await this.validateCurrencyCodeUniqueness(
      tenantId,
      currencyDTO.currencyCode
    );

    await Currency.query().insert({ ...currencyDTO });
  }

  /**
   * Edit details of the given currency.
   * @param {number} tenantId
   * @param {number} currencyId
   * @param {ICurrencyDTO} currencyDTO
   */
  public async editCurrency(
    tenantId: number,
    currencyId: number,
    currencyDTO: ICurrencyEditDTO
  ): Promise<ICurrency> {
    const { Currency } = this.tenancy.models(tenantId);

    await this.getCurrencyIdOrThrowError(tenantId, currencyId);

    const currency = await Currency.query().patchAndFetchById(currencyId, {
      ...currencyDTO,
    });
    return currency;
  }

  /**
   * Validate cannot delete base currency.
   * @param {number} tenantId
   * @param {string} currencyCode
   */
  private async validateCannotDeleteBaseCurrency(
    tenantId: number,
    currencyCode: string
  ) {
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    if (tenant.metadata.baseCurrency === currencyCode) {
      throw new ServiceError(ERRORS.CANNOT_DELETE_BASE_CURRENCY);
    }
  }

  /**
   * Delete the given currency code.
   * @param {number} tenantId
   * @param {string} currencyCode
   * @return {Promise<void>}
   */
  public async deleteCurrency(
    tenantId: number,
    currencyCode: string
  ): Promise<void> {
    const { Currency } = this.tenancy.models(tenantId);

    await this.getCurrencyByCodeOrThrowError(tenantId, currencyCode);

    // Validate currency code not equals base currency.
    await this.validateCannotDeleteBaseCurrency(tenantId, currencyCode);

    await Currency.query().where('currency_code', currencyCode).delete();
  }

  /**
   * Listing currencies.
   * @param {number} tenantId
   * @return {Promise<ICurrency[]>}
   */
  public async listCurrencies(tenantId: number): Promise<ICurrency[]> {
    const { Currency } = this.tenancy.models(tenantId);

    const currencies = await Currency.query().onBuild((query) => {
      query.orderBy('createdAt', 'ASC');
    });
    return this.transformer.transform(
      tenantId,
      currencies,
      new CurrencyTransformer()
    );
  }
}
