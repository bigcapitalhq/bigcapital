import { Inject, Service } from 'typedi';
import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { TaxRatesApplication } from '@/services/TaxRates/TaxRatesApplication';
import CheckAbilities from '@/api/middleware/CheckPolicies';
import { ServiceError } from '@/exceptions';
import { ERRORS } from '@/services/TaxRates/constants';
import { AbilitySubject, TaxRateAction } from '@/interfaces';

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
      CheckAbilities(TaxRateAction.CREATE, AbilitySubject.TaxRate),
      this.taxRateValidationSchema,
      this.validationResult,
      asyncMiddleware(this.createTaxRate.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id',
      CheckAbilities(TaxRateAction.EDIT, AbilitySubject.TaxRate),
      [param('id').exists().toInt(), ...this.taxRateValidationSchema],
      this.validationResult,
      asyncMiddleware(this.editTaxRate.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/active',
      CheckAbilities(TaxRateAction.EDIT, AbilitySubject.TaxRate),
      [param('id').exists().toInt()],
      this.validationResult,
      asyncMiddleware(this.activateTaxRate.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/inactive',
      CheckAbilities(TaxRateAction.EDIT, AbilitySubject.TaxRate),
      [param('id').exists().toInt()],
      this.validationResult,
      asyncMiddleware(this.inactivateTaxRate.bind(this)),
      this.handleServiceErrors
    );
    router.delete(
      '/:id',
      CheckAbilities(TaxRateAction.DELETE, AbilitySubject.TaxRate),
      [param('id').exists().toInt()],
      this.validationResult,
      asyncMiddleware(this.deleteTaxRate.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id',
      CheckAbilities(TaxRateAction.VIEW, AbilitySubject.TaxRate),
      [param('id').exists().toInt()],
      this.validationResult,
      asyncMiddleware(this.getTaxRate.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/',
      CheckAbilities(TaxRateAction.VIEW, AbilitySubject.TaxRate),
      this.validationResult,
      asyncMiddleware(this.getTaxRates.bind(this)),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Tax rate validation schema.
   */
  private get taxRateValidationSchema() {
    return [
      body('name').exists(),
      body('code').exists().isString(),
      body('rate').exists().isNumeric().toFloat(),
      body('description').optional().trim().isString(),
      body('is_non_recoverable').optional().isBoolean().default(false),
      body('is_compound').optional().isBoolean().default(false),
      body('active').optional().isBoolean().default(false),
    ];
  }

  /**
   * Creates a new tax rate.
   * @param {Request} req -
   * @param {Response} res -
   */
  public async createTaxRate(req: Request, res: Response, next) {
    const { tenantId } = req;
    const createTaxRateDTO = this.matchedBodyData(req);

    try {
      const taxRate = await this.taxRatesApplication.createTaxRate(
        tenantId,
        createTaxRateDTO
      );
      return res.status(200).send({
        data: taxRate,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edits the given tax rate.
   * @param {Request} req -
   * @param {Response} res -
   */
  public async editTaxRate(req: Request, res: Response, next) {
    const { tenantId } = req;
    const editTaxRateDTO = this.matchedBodyData(req);
    const { id: taxRateId } = req.params;

    try {
      const taxRate = await this.taxRatesApplication.editTaxRate(
        tenantId,
        taxRateId,
        editTaxRateDTO
      );
      return res.status(200).send({
        data: taxRate,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given tax rate.
   * @param {Request} req -
   * @param {Response} res -
   */
  public async deleteTaxRate(req: Request, res: Response, next) {
    const { tenantId } = req;
    const { id: taxRateId } = req.params;

    try {
      await this.taxRatesApplication.deleteTaxRate(tenantId, taxRateId);

      return res.status(200).send({
        code: 200,
        message: 'The tax rate has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the given tax rate.
   * @param {Request} req -
   * @param {Response} res -
   */
  public async getTaxRate(req: Request, res: Response, next) {
    const { tenantId } = req;
    const { id: taxRateId } = req.params;

    try {
      const taxRate = await this.taxRatesApplication.getTaxRate(
        tenantId,
        taxRateId
      );
      return res.status(200).send({ data: taxRate });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the tax rates list.
   * @param {Request} req -
   * @param {Response} res -
   */
  public async getTaxRates(req: Request, res: Response, next) {
    const { tenantId } = req;

    try {
      const taxRates = await this.taxRatesApplication.getTaxRates(tenantId);

      return res.status(200).send({ data: taxRates });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Inactivates the given tax rate.
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async inactivateTaxRate(req: Request, res: Response, next) {
    const { tenantId } = req;
    const { id: taxRateId } = req.params;

    try {
      await this.taxRatesApplication.inactivateTaxRate(tenantId, taxRateId);

      return res.status(200).send({
        id: taxRateId,
        message: 'The given tax rate has been inactivated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Inactivates the given tax rate.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  public async activateTaxRate(req: Request, res: Response, next) {
    const { tenantId } = req;
    const { id: taxRateId } = req.params;

    try {
      await this.taxRatesApplication.activateTaxRate(tenantId, taxRateId);

      return res.status(200).send({
        id: taxRateId,
        message: 'The given tax rate has been activated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private handleServiceErrors(error: Error, req: Request, res: Response, next) {
    if (error instanceof ServiceError) {
      if (error.errorType === ERRORS.TAX_CODE_NOT_UNIQUE) {
        return res.boom.badRequest(null, {
          errors: [{ type: ERRORS.TAX_CODE_NOT_UNIQUE, code: 100 }],
        });
      }
      if (error.errorType === ERRORS.TAX_RATE_NOT_FOUND) {
        return res.boom.badRequest(null, {
          errors: [{ type: ERRORS.TAX_RATE_NOT_FOUND, code: 200 }],
        });
      }
      if (error.errorType === ERRORS.TAX_RATE_ALREADY_INACTIVE) {
        return res.boom.badRequest(null, {
          errors: [{ type: ERRORS.TAX_RATE_ALREADY_INACTIVE, code: 300 }],
        });
      }
      if (error.errorType === ERRORS.TAX_RATE_ALREADY_ACTIVE) {
        return res.boom.badRequest(null, {
          errors: [{ type: ERRORS.TAX_RATE_ALREADY_ACTIVE, code: 400 }],
        });
      }
    }
    next(error);
  }
}
