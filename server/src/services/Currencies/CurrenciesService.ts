import { Inject, Container, Service } from 'typedi';
import {
  ICurrencyEditDTO,
  ICurrencyDTO,
  ICurrenciesService,
  ICurrency,
} from 'interfaces';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import { ServiceError } from 'exceptions';
import TenancyService from 'services/Tenancy/TenancyService';

const ERRORS = {
  CURRENCY_NOT_FOUND: 'currency_not_found',
  CURRENCY_CODE_EXISTS: 'currency_code_exists',
};

@Service()
export default class CurrenciesService implements ICurrenciesService {
  @Inject('logger')
  logger: any;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject()
  tenancy: TenancyService;

  /**
   * Retrieve currency by given currency code or throw not found error.
   * @param {number} tenantId
   * @param {string} currencyCode
   * @param {number} currencyId
   */
  private async validateCurrencyCodeUniquiness(
    tenantId: number,
    currencyCode: string,
    currencyId?: number
  ) {
    const { Currency } = this.tenancy.models(tenantId);

    this.logger.info(
      '[currencies] trying to validate currency code existance.',
      { tenantId, currencyCode }
    );
    const foundCurrency = await Currency.query().onBuild((query) => {
      query.findOne('currency_code', currencyCode);

      if (currencyId) {
        query.whereNot('id', currencyId);
      }
    });
    if (foundCurrency) {
      this.logger.info('[currencies] the currency code already exists.', {
        tenantId,
        currencyCode,
      });
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

    this.logger.info(
      '[currencies] trying to validate currency code existance.',
      { tenantId, currencyCode }
    );
    const foundCurrency = await Currency.query().findOne(
      'currency_code',
      currencyCode
    );

    if (!foundCurrency) {
      this.logger.info('[currencies] the given currency code not exists.', {
        tenantId,
        currencyCode,
      });
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

    this.logger.info(
      '[currencies] trying to validate currency by id existance.',
      { tenantId, currencyId }
    );
    const foundCurrency = await Currency.query().findOne('id', currencyId);

    if (!foundCurrency) {
      this.logger.info('[currencies] the currency code not found.', {
        tenantId,
        currencyId,
      });
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
    this.logger.info('[currencies] try to insert new currency.', {
      tenantId,
      currencyDTO,
    });

    await this.validateCurrencyCodeUniquiness(
      tenantId,
      currencyDTO.currencyCode
    );

    await Currency.query().insert({ ...currencyDTO });
    this.logger.info('[currencies] the currency inserted successfully.', {
      tenantId,
      currencyDTO,
    });
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

    this.logger.info('[currencies] try to edit currency.', {
      tenantId,
      currencyId,
      currencyDTO,
    });
    await this.getCurrencyIdOrThrowError(tenantId, currencyId);

    const currency = await Currency.query().patchAndFetchById(currencyId, {
      ...currencyDTO,
    });
    this.logger.info('[currencies] the currency edited successfully.', {
      tenantId,
      currencyDTO,
    });

    return currency;
  }

  /**
   * Delete the given currency code.
   * @param {number} tenantId
   * @param {string} currencyCode
   * @return {Promise<}
   */
  public async deleteCurrency(
    tenantId: number,
    currencyCode: string
  ): Promise<void> {
    const { Currency } = this.tenancy.models(tenantId);
    this.logger.info('[currencies] trying to delete the given currency.', {
      tenantId,
      currencyCode,
    });

    await this.getCurrencyByCodeOrThrowError(tenantId, currencyCode);

    await Currency.query().where('currency_code', currencyCode).delete();
    this.logger.info('[currencies] the currency deleted successfully.', {
      tenantId,
      currencyCode,
    });
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
    return currencies;
  }
}
