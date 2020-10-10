import { Inject, Service } from 'typedi';
import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import PaymentMethodController from 'api/controllers/Subscription/PaymentMethod';
import {
  NotAllowedChangeSubscriptionPlan,
  NoPaymentModelWithPricedPlan,
  PaymentAmountInvalidWithPlan,
  PaymentInputInvalid,
} from 'exceptions';
import { ILicensePaymentModel } from 'interfaces';

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
      this.validationResult,
      asyncMiddleware(this.validatePlanSlugExistance.bind(this)),
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
      check('license_code').optional().trim().escape(),
    ];
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
      const licenseModel: ILicensePaymentModel|null = licenseCode
        ? { licenseCode } : null;

      await this.subscriptionService
        .subscriptionViaLicense(tenant.id, planSlug, licenseModel);

      return res.status(200).send({
        type: 'success',
        code: 'PAYMENT.SUCCESSFULLY.MADE',
        message: 'Payment via license has been made successfully.',
      });
    } catch (exception) {
      const errorReasons = [];

      if (exception instanceof NoPaymentModelWithPricedPlan) {
        errorReasons.push({
          type: 'NO_PAYMENT_WITH_PRICED_PLAN',
          code: 140,
        });
      }
      if (exception instanceof NotAllowedChangeSubscriptionPlan) {
        errorReasons.push({
          type: 'NOT.ALLOWED.RENEW.SUBSCRIPTION.WHILE.ACTIVE',
          code: 120,
        });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      if (exception instanceof PaymentInputInvalid) {
        return res.status(400).send({
          errors: [{ type: 'LICENSE.CODE.IS.INVALID', code: 120 }],
        });
      }
      if (exception instanceof PaymentAmountInvalidWithPlan) {
        return res.status(400).send({
          errors: [{ type: 'LICENSE.NOT.FOR.GIVEN.PLAN' }],
        });
      }
      next(exception);
    }
  }
}