import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query, ValidationChain } from 'express-validator';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from './BaseController';
import CurrenciesService from '@/services/Currencies/CurrenciesService';
import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';

@Service()
export default class CurrenciesController extends BaseController {
  @Inject()
  currenciesService: CurrenciesService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      [...this.listSchema],
      this.validationResult,
      asyncMiddleware(this.all.bind(this))
    );
    router.post(
      '/',
      [...this.currencyDTOSchemaValidation],
      this.validationResult,
      asyncMiddleware(this.newCurrency.bind(this)),
      this.handlerServiceError
    );
    router.post(
      '/:id',
      [...this.currencyIdParamSchema, ...this.currencyEditDTOSchemaValidation],
      this.validationResult,
      asyncMiddleware(this.editCurrency.bind(this)),
      this.handlerServiceError
    );
    router.delete(
      '/:currency_code',
      [...this.currencyParamSchema],
      this.validationResult,
      asyncMiddleware(this.deleteCurrency.bind(this)),
      this.handlerServiceError
    );
    return router;
  }

  get currencyDTOSchemaValidation(): ValidationChain[] {
    return [
      check('currency_name').exists().trim(),
      check('currency_code').exists().trim(),
      check('currency_sign').exists().trim(),
    ];
  }

  get currencyEditDTOSchemaValidation(): ValidationChain[] {
    return [
      check('currency_name').exists().trim(),
      check('currency_sign').exists().trim(),
    ];
  }

  get currencyIdParamSchema(): ValidationChain[] {
    return [param('id').exists().isNumeric().toInt()];
  }

  get currencyParamSchema(): ValidationChain[] {
    return [param('currency_code').exists().trim().escape()];
  }

  get listSchema(): ValidationChain[] {
    return [
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve all registered currency details.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async all(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    try {
      const currencies = await this.currenciesService.listCurrencies(tenantId);

      return res.status(200).send({
        currencies: this.transformToResponse(currencies),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new currency on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async newCurrency(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const currencyDTO = this.matchedBodyData(req);

    try {
      await this.currenciesService.newCurrency(tenantId, currencyDTO);

      return res.status(200).send({
        currency_code: currencyDTO.currencyCode,
        message: 'The currency has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edits details of the given currency.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async deleteCurrency(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const { currency_code: currencyCode } = req.params;

    try {
      await this.currenciesService.deleteCurrency(tenantId, currencyCode);
      return res.status(200).send({
        currency_code: currencyCode,
        message: 'The currency has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the currency.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async editCurrency(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const { id: currencyId } = req.params;
    const editCurrencyDTO = this.matchedBodyData(req);

    try {
      const currency = await this.currenciesService.editCurrency(
        tenantId,
        currencyId,
        editCurrencyDTO
      );
      return res.status(200).send({
        currency_code: currency.currencyCode,
        message: 'The currency has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles currencies service error.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  handlerServiceError(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'currency_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CURRENCY_NOT_FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'currency_code_exists') {
        return res.boom.badRequest(null, {
          errors: [{
            type: 'CURRENCY_CODE_EXISTS',
            message: 'The given currency code is already exists.',
            code: 200,
           }],
        });
      }
      if (error.errorType === 'CANNOT_DELETE_BASE_CURRENCY') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'CANNOT_DELETE_BASE_CURRENCY',
              code: 300,
              message: 'Cannot delete the base currency.',
            },
          ],
        });
      }
    }
    next(error);
  }
}
