import { Inject, Service } from 'typedi';
import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { pick } from 'lodash';
import { IOptionDTO, IOptionsDTO } from '@/interfaces';
import BaseController from '@/api/controllers/BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { AbilitySubject, PreferencesAction } from '@/interfaces';
import SettingsService from '@/services/Settings/SettingsService';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { TaxRatesApplication } from '@/services/TaxRates/TaxRatesApplication';

@Service()
export class TaxRatesController extends BaseController {
  @Inject()
  private taxRatesApplication: TaxRatesApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.post(
      '/',
      this.taxRateValidationSchema,
      this.validationResult,
      asyncMiddleware(this.createTaxRate.bind(this))
    );
    router.post(
      '/:tax_rate_id',
      this.taxRateValidationSchema,
      this.validationResult,
      asyncMiddleware(this.editTaxRate.bind(this))
    );
    router.delete(
      '/:tax_rate_id',
      this.taxRateValidationSchema,
      this.validationResult,
      asyncMiddleware(this.deleteTaxRate.bind(this))
    );
    router.get(
      '/:tax_rate_id',
      this.taxRateValidationSchema,
      this.validationResult,
      asyncMiddleware(this.getTaxRate.bind(this))
    );
    router.get(
      '/',
      this.taxRateValidationSchema,
      this.validationResult,
      asyncMiddleware(this.getTaxRates.bind(this))
    );
    return router;
  }

  /**
   * Save settings validation schema.
   */
  private get taxRateValidationSchema() {
    return [
      body('rate').exists().isNumeric().toFloat(),
      body('is_non_recoverable').exists().isBoolean().default(false),
    ];
  }

  /**
   *
   * @param {Request} req -
   * @param {Response} res -
   */
  public async createTaxRate(req: Request, res: Response, next) {
    const taxRate = await this.taxRatesApplication.createTaxRate()
  }

  /**
   *
   * @param {Request} req -
   * @param {Response} res -
   */
  public async editTaxRate(req: Request, res: Response, next) {
    const taxRate = await this.taxRatesApplication.editTaxRate();

  }

  /**
   *
   * @param {Request} req -
   * @param {Response} res -
   */
  public async deleteTaxRate(req: Request, res: Response, next) {
    await this.taxRatesApplication.deleteTaxRate();
  }

  /**
   *
   * @param {Request} req -
   * @param {Response} res -
   */
  public async getTaxRate(req: Request, res: Response, next) {}

  /**
   *
   * @param {Request} req -
   * @param {Response} res -
   */
  public async getTaxRates(req: Request, res: Response, next) {}
}
