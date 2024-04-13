import { Inject, Service } from 'typedi';
import { NextFunction, Router, Request, Response } from 'express';
import { check } from 'express-validator';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import PaymentMethodController from '@/api/controllers/Subscription/PaymentMethod';
import {
  NotAllowedChangeSubscriptionPlan,
  NoPaymentModelWithPricedPlan,
  PaymentAmountInvalidWithPlan,
  PaymentInputInvalid,
  VoucherCodeRequired,
} from '@/exceptions';
import { ILicensePaymentModel } from '@/interfaces';
import instance from 'tsyringe/dist/typings/dependency-container';

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
      this.handleErrors,
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
   * Handle the subscription payment via license code.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async paymentViaLicense(req: Request, res: Response, next: Function) {
    const { planSlug, licenseCode } = this.matchedBodyData(req);
    const { tenant } = req;

    try {
      const licenseModel: ILicensePaymentModel = { licenseCode };

      await this.subscriptionService.subscriptionViaLicense(
        tenant.id,
        planSlug,
        licenseModel
      );

      return res.status(200).send({
        type: 'success',
        code: 'PAYMENT.SUCCESSFULLY.MADE',
        message: 'Payment via license has been made successfully.',
      });
    } catch (exception) {
      next(exception);
    }
  }

  /**
   * Handle service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private handleErrors(
    exception: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const errorReasons = [];

    if (exception instanceof VoucherCodeRequired) {
      errorReasons.push({
        type: 'VOUCHER_CODE_REQUIRED',
        code: 100,
      });
    }
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
