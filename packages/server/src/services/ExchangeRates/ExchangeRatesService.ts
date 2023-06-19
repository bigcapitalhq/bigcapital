import moment from 'moment';
import { difference } from 'lodash';
import { Service, Inject } from 'typedi';
import { ServiceError } from '@/exceptions';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import {
  IExchangeRateDTO,
  IExchangeRate,
  IExchangeRatesService,
  IExchangeRateEditDTO,
  IExchangeRateFilter,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';

const ERRORS = {
  NOT_FOUND_EXCHANGE_RATES: 'NOT_FOUND_EXCHANGE_RATES',
  EXCHANGE_RATE_PERIOD_EXISTS: 'EXCHANGE_RATE_PERIOD_EXISTS',
  EXCHANGE_RATE_NOT_FOUND: 'EXCHANGE_RATE_NOT_FOUND',
};

@Service()
export default class ExchangeRatesService implements IExchangeRatesService {
  @Inject('logger')
  logger: any;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Creates a new exchange rate.
   * @param {number} tenantId
   * @param {IExchangeRateDTO} exchangeRateDTO
   * @returns {Promise<IExchangeRate>}
   */
  public async newExchangeRate(
    tenantId: number,
    exchangeRateDTO: IExchangeRateDTO
  ): Promise<IExchangeRate> {
    const { ExchangeRate } = this.tenancy.models(tenantId);

    this.logger.info('[exchange_rates] trying to insert new exchange rate.', {
      tenantId,
      exchangeRateDTO,
    });
    await this.validateExchangeRatePeriodExistance(tenantId, exchangeRateDTO);

    const exchangeRate = await ExchangeRate.query().insertAndFetch({
      ...exchangeRateDTO,
      date: moment(exchangeRateDTO.date).format('YYYY-MM-DD'),
    });
    this.logger.info('[exchange_rates] inserted successfully.', {
      tenantId,
      exchangeRateDTO,
    });
    return exchangeRate;
  }

  /**
   * Edits the exchange rate details.
   * @param {number} tenantId - Tenant id.
   * @param {number} exchangeRateId - Exchange rate id.
   * @param {IExchangeRateEditDTO} editExRateDTO - Edit exchange rate DTO.
   */
  public async editExchangeRate(
    tenantId: number,
    exchangeRateId: number,
    editExRateDTO: IExchangeRateEditDTO
  ): Promise<void> {
    const { ExchangeRate } = this.tenancy.models(tenantId);

    this.logger.info('[exchange_rates] trying to edit exchange rate.', {
      tenantId,
      exchangeRateId,
      editExRateDTO,
    });
    await this.validateExchangeRateExistance(tenantId, exchangeRateId);

    await ExchangeRate.query()
      .where('id', exchangeRateId)
      .update({ ...editExRateDTO });
    this.logger.info('[exchange_rates] exchange rate edited successfully.', {
      tenantId,
      exchangeRateId,
      editExRateDTO,
    });
  }

  /**
   * Deletes the given exchange rate.
   * @param {number} tenantId - Tenant id.
   * @param {number} exchangeRateId - Exchange rate id.
   */
  public async deleteExchangeRate(
    tenantId: number,
    exchangeRateId: number
  ): Promise<void> {
    const { ExchangeRate } = this.tenancy.models(tenantId);
    await this.validateExchangeRateExistance(tenantId, exchangeRateId);

    await ExchangeRate.query().findById(exchangeRateId).delete();
  }

  /**
   * Listing exchange rates details.
   * @param {number} tenantId - Tenant id.
   * @param {IExchangeRateFilter} exchangeRateFilter - Exchange rates list filter.
   */
  public async listExchangeRates(
    tenantId: number,
    exchangeRateFilter: IExchangeRateFilter
  ): Promise<void> {
    const { ExchangeRate } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      ExchangeRate,
      exchangeRateFilter
    );
    // Retrieve exchange rates by the given query.
    const exchangeRates = await ExchangeRate.query()
      .onBuild((query) => {
        dynamicFilter.buildQuery()(query);
      })
      .pagination(exchangeRateFilter.page - 1, exchangeRateFilter.pageSize);

    return exchangeRates;
  }

  /**
   * Validates period of the exchange rate existance.
   * @param {number} tenantId - Tenant id.
   * @param {IExchangeRateDTO} exchangeRateDTO - Exchange rate DTO.
   * @return {Promise<void>}
   */
  private async validateExchangeRatePeriodExistance(
    tenantId: number,
    exchangeRateDTO: IExchangeRateDTO
  ): Promise<void> {
    const { ExchangeRate } = this.tenancy.models(tenantId);

    this.logger.info('[exchange_rates] trying to validate period existance.', {
      tenantId,
    });
    const foundExchangeRate = await ExchangeRate.query()
      .where('currency_code', exchangeRateDTO.currencyCode)
      .where('date', exchangeRateDTO.date);

    if (foundExchangeRate.length > 0) {
      this.logger.info('[exchange_rates] given exchange rate period exists.', {
        tenantId,
      });
      throw new ServiceError(ERRORS.EXCHANGE_RATE_PERIOD_EXISTS);
    }
  }

  /**
   * Validate the given exchange rate id existance.
   * @param {number} tenantId - Tenant id.
   * @param {number} exchangeRateId - Exchange rate id.
   * @returns {Promise<void>}
   */
  private async validateExchangeRateExistance(
    tenantId: number,
    exchangeRateId: number
  ) {
    const { ExchangeRate } = this.tenancy.models(tenantId);

    this.logger.info(
      '[exchange_rates] trying to validate exchange rate id existance.',
      { tenantId, exchangeRateId }
    );
    const foundExchangeRate = await ExchangeRate.query().findById(
      exchangeRateId
    );

    if (!foundExchangeRate) {
      this.logger.info('[exchange_rates] exchange rate not found.', {
        tenantId,
        exchangeRateId,
      });
      throw new ServiceError(ERRORS.EXCHANGE_RATE_NOT_FOUND);
    }
  }
}
