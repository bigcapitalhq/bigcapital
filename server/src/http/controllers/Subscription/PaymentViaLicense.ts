import { Inject, Service } from 'typedi';
import { Router, Request, Response } from 'express';
import { check, param, query, ValidationSchema } from 'express-validator';
import { License, Plan } from '@/system/models';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import PaymentMethodController from '@/http/controllers/Subscription/PaymentMethod';
import {
  NotAllowedChangeSubscriptionPlan
} from '@/exceptions';

@Service()
export default class PaymentViaLicenseController extends PaymentMethodController { 
  @Inject('logger')
  logger: any;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/payment',
      this.paymentViaLicenseSchema,
      validateMiddleware,
      asyncMiddleware(this.validateLicenseCodeExistance.bind(this)),
      asyncMiddleware(this.validatePlanSlugExistance.bind(this)),
      asyncMiddleware(this.validateLicenseAndPlan.bind(this)),
      asyncMiddleware(this.paymentViaLicense.bind(this)),
    );
    return router;
  }

  /**
   * Payment via license validation schema.
   */
  get paymentViaLicenseSchema() {
    return [
      check('plan_slug').exists().trim().escape(),
      check('license_code').exists().trim().escape(),
    ];
  }

  /**
   * Validate the given license code exists on the storage.
   * @async
   * @param {Request} req 
   * @param {Response} res 
   */
  async validateLicenseCodeExistance(req: Request, res: Response, next: Function) {
    const { licenseCode } = this.matchedBodyData(req);
    this.logger.info('[license_payment] trying to validate license code.', { licenseCode });

    const foundLicense = await License.query()
      .modify('filterActiveLicense')
      .where('license_code', licenseCode)
      .first();

    if (!foundLicense) {
      return res.status(400).send({
        errors: [{ type: 'LICENSE.CODE.IS.INVALID', code: 120 }],
      });
    }
    next();
  }

  /**
   * Validate the license period and plan period.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateLicenseAndPlan(req: Request, res: Response, next: Function) {
    const { planSlug, licenseCode } = this.matchedBodyData(req);
    this.logger.info('[license_payment] trying to validate license with the plan.', { licenseCode });

    const license = await License.query().findOne('license_code', licenseCode);
    const plan = await Plan.query().findOne('slug', planSlug);

    if (license.planId !== plan.id) {
      return res.status(400).send({
        errors: [{ type: 'LICENSE.NOT.FOR.GIVEN.PLAN' }],
      });
    }
    next();
  }

  /**
   * Handle the subscription payment via license code.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async paymentViaLicense(req: Request, res: Response, next: Function) {
    const { planSlug, licenseCode } = this.matchedBodyData(req);
    const { tenant } = req;

    try {
      await this.subscriptionService
        .subscriptionViaLicense(tenant.id, planSlug, licenseCode);

      return res.status(200).send({
        type: 'success',
        code: 'PAYMENT.SUCCESSFULLY.MADE',
        message: 'Payment via license has been made successfully.',
      });
    } catch (exception) {
      const errorReasons = [];

      if (exception.name === 'NotAllowedChangeSubscriptionPlan') {
        errorReasons.push({
          type: 'NOT.ALLOWED.RENEW.SUBSCRIPTION.WHILE.ACTIVE',
          code: 120,
        });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      next(exception);
    }
  }
}