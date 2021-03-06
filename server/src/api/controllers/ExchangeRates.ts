import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseController from './BaseController';
import { ServiceError } from 'exceptions';
import ExchangeRatesService from 'services/ExchangeRates/ExchangeRatesService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';

@Service()
export default class ExchangeRatesController extends BaseController {
  @Inject()
  exchangeRatesService: ExchangeRatesService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Constructor method.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      [...this.exchangeRatesListSchema],
      this.validationResult,
      asyncMiddleware(this.exchangeRates.bind(this)),
      this.dynamicListService.handlerErrorsToResponse,
      this.handleServiceError,
    );
    router.post(
      '/',
      [...this.exchangeRateDTOSchema],
      this.validationResult,
      asyncMiddleware(this.addExchangeRate.bind(this)),
      this.handleServiceError
    );
    router.post(
      '/:id',
      [...this.exchangeRateEditDTOSchema, ...this.exchangeRateIdSchema],
      this.validationResult,
      asyncMiddleware(this.editExchangeRate.bind(this)),
      this.handleServiceError
    );
    router.delete(
      '/bulk',
      [...this.exchangeRatesIdsSchema],
      this.validationResult,
      asyncMiddleware(this.bulkDeleteExchangeRates.bind(this)),
      this.handleServiceError
    );
    router.delete(
      '/:id',
      [...this.exchangeRateIdSchema],
      this.validationResult,
      asyncMiddleware(this.deleteExchangeRate.bind(this)),
      this.handleServiceError
    );
    return router;
  }

  get exchangeRatesListSchema() {
    return [
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
    ];
  }

  get exchangeRateDTOSchema() {
    return [
      check('exchange_rate').exists().isNumeric().toFloat(),
      check('currency_code').exists().trim().escape(),
      check('date').exists().isISO8601(),
    ];
  }

  get exchangeRateEditDTOSchema() {
    return [check('exchange_rate').exists().isNumeric().toFloat()];
  }

  get exchangeRateIdSchema() {
    return [param('id').isNumeric().toInt()];
  }

  get exchangeRatesIdsSchema() {
    return [
      query('ids').isArray({ min: 2 }),
      query('ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve exchange rates.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async exchangeRates(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      page: 1,
      pageSize: 100,
      filterRoles: [],
      columnSortBy: 'created_at',
      sortOrder: 'asc',
      ...this.matchedQueryData(req),
    };
    if (filter.stringifiedFilterRoles) {
      filter.filterRoles = JSON.parse(filter.stringifiedFilterRoles);
    }
    try {
      const exchangeRates = await this.exchangeRatesService.listExchangeRates(
        tenantId,
        filter
      );
      return res.status(200).send({ exchange_rates: exchangeRates });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Adds a new exchange rate on the given date.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async addExchangeRate(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const exchangeRateDTO = this.matchedBodyData(req);

    try {
      const exchangeRate = await this.exchangeRatesService.newExchangeRate(
        tenantId,
        exchangeRateDTO
      );
      return res.status(200).send({ id: exchangeRate.id });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit the given exchange rate.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async editExchangeRate(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: exchangeRateId } = req.params;
    const exchangeRateDTO = this.matchedBodyData(req);

    try {
      const exchangeRate = await this.exchangeRatesService.editExchangeRate(
        tenantId,
        exchangeRateId,
        exchangeRateDTO
      );

      return res.status(200).send({
        id: exchangeRateId,
        message: 'The exchange rate has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete the given exchange rate from the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async deleteExchangeRate(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: exchangeRateId } = req.params;

    try {
      await this.exchangeRatesService.deleteExchangeRate(
        tenantId,
        exchangeRateId
      );
      return res.status(200).send({ id: exchangeRateId });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given exchange rates in bulk.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async bulkDeleteExchangeRates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { ids: exchangeRateIds } = req.query;

    try {
      await this.exchangeRatesService.deleteBulkExchangeRates(
        tenantId,
        exchangeRateIds
      );
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  handleServiceError(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'EXCHANGE_RATE_NOT_FOUND') {
        return res.status(404).send({
          errors: [{ type: 'EXCHANGE.RATE.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'NOT_FOUND_EXCHANGE_RATES') {
        return res.status(400).send({
          errors: [{ type: 'EXCHANGE.RATES.IS.NOT.FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'EXCHANGE_RATE_PERIOD_EXISTS') {
        return res.status(400).send({
          errors: [{ type: 'EXCHANGE.RATE.PERIOD.EXISTS', code: 300 }],
        });
      }
    }
    next(error);
  }
}
