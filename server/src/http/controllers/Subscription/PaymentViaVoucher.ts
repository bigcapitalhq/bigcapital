import { Inject, Service } from 'typedi';
import { Router, Request, Response } from 'express';
import { check, param, query, ValidationSchema } from 'express-validator';
import { Voucher, Plan } from '@/system/models';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import PaymentMethodController from '@/http/controllers/Subscription/PaymentMethod';
import {
  NotAllowedChangeSubscriptionPlan
} from '@/exceptions';

@Service()
export default class PaymentViaVoucherController extends PaymentMethodController { 
  @Inject('logger')
  logger: any;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/payment',
      this.paymentViaVoucherSchema,
      validateMiddleware,
      asyncMiddleware(this.validateVoucherCodeExistance.bind(this)),
      asyncMiddleware(this.validatePlanSlugExistance.bind(this)),
      asyncMiddleware(this.validateVoucherAndPlan.bind(this)),
      asyncMiddleware(this.paymentViaVoucher.bind(this)),
    );
    return router;
  }

  /**
   * Payment via voucher validation schema.
   */
  get paymentViaVoucherSchema() {
    return [
      check('plan_slug').exists().trim().escape(),
      check('voucher_code').exists().trim().escape(),
    ];
  }

  /**
   * Validate the given voucher code exists on the storage.
   * @async
   * @param {Request} req 
   * @param {Response} res 
   */
  async validateVoucherCodeExistance(req: Request, res: Response, next: Function) {
    const { voucherCode } = this.matchedBodyData(req);
    this.logger.info('[voucher_payment] trying to validate voucher code.', { voucherCode });

    const foundVoucher = await Voucher.query()
      .modify('filterActiveVoucher')
      .where('voucher_code', voucherCode)
      .first();

    if (!foundVoucher) {
      return res.status(400).send({
        errors: [{ type: 'VOUCHER.CODE.IS.INVALID', code: 120 }],
      });
    }
    next();
  }

  /**
   * Validate the voucher period and plan period.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateVoucherAndPlan(req: Request, res: Response, next: Function) {
    const { planSlug, voucherCode } = this.matchedBodyData(req);
    this.logger.info('[voucher_payment] trying to validate voucher with the plan.', { voucherCode });

    const voucher = await Voucher.query().findOne('voucher_code', voucherCode);
    const plan = await Plan.query().findOne('slug', planSlug);

    if (voucher.planId !== plan.id) {
      return res.status(400).send({
        errors: [{ type: 'VOUCHER.NOT.FOR.GIVEN.PLAN' }],
      });
    }
    next();
  }

  /**
   * Handle the subscription payment via voucher code.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async paymentViaVoucher(req: Request, res: Response, next: Function) {
    const { planSlug, voucherCode } = this.matchedBodyData(req);
    const { tenant } = req;

    try {
      await this.subscriptionService
        .subscriptionViaVoucher(tenant.id, planSlug, voucherCode);

      return res.status(200).send({
        type: 'success',
        code: 'PAYMENT.SUCCESSFULLY.MADE',
        message: 'Payment via voucher has been made successfully.',
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