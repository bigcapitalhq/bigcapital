import { Router, Request, Response } from 'express'
import { check, oneOf, ValidationChain } from 'express-validator';
import { Service, Inject } from 'typedi';
import { Voucher, Plan } from '@/system/models';
import BaseController from '@/http/controllers/BaseController';
import VoucherService from '@/services/Payment/Voucher';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import { IVouchersFilter } from '@/interfaces';

@Service()
export default class VouchersController extends BaseController {
  @Inject()
  voucherService: VoucherService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/generate',
      this.generateVoucherSchema,
      validateMiddleware,
      asyncMiddleware(this.validatePlanExistance.bind(this)),
      asyncMiddleware(this.generateVoucher.bind(this)),
    );
    router.post(
      '/disable/:voucherId',
      validateMiddleware,
      asyncMiddleware(this.validateVoucherExistance.bind(this)),
      asyncMiddleware(this.validateNotDisabledVoucher.bind(this)),
      asyncMiddleware(this.disableVoucher.bind(this)),
    );
    router.post(
      '/send',
      this.sendVoucherSchemaValidation,
      validateMiddleware,
      asyncMiddleware(this.sendVoucher.bind(this)),
    );
    router.delete(
      '/:voucherId',
      asyncMiddleware(this.validateVoucherExistance.bind(this)),
      asyncMiddleware(this.deleteVoucher.bind(this)),
    );
    router.get(
      '/',
      asyncMiddleware(this.listVouchers.bind(this)),
    );
    return router;
  }

  /**
   * Generate voucher validation schema.
   */
  get generateVoucherSchema(): ValidationChain[] {
    return [
      check('loop').exists().isNumeric().toInt(),
      check('period').exists().isNumeric().toInt(),
      check('period_interval').exists().isIn([
        'month', 'months', 'year', 'years', 'day', 'days'
      ]),
      check('plan_id').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Specific voucher validation schema.
   */
  get specificVoucherSchema(): ValidationChain[] {
    return [
      oneOf([
        check('voucher_id').exists().isNumeric().toInt(),
      ], [
        check('voucher_code').exists().isNumeric().toInt(),
      ])
    ]
  }

  /**
   * Send voucher validation schema.
   */
  get sendVoucherSchemaValidation(): ValidationChain[] {
    return [
      check('period').exists().isNumeric(),
      check('period_interval').exists().trim().escape(),
      check('plan_id').exists().isNumeric().toInt(),
      oneOf([
        check('phone_number').exists().trim().escape(),
        check('email').exists().trim().escape(),
      ]),
    ];
  }

  /**
   * Validate the plan existance on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validatePlanExistance(req: Request, res: Response, next: Function) {
    const body = this.matchedBodyData(req);
    const planId: number = body.planId || req.params.planId;
    const foundPlan = await Plan.query().findById(planId);

    if (!foundPlan) {
      return res.status(400).send({
        erorrs: [{ type: 'PLAN.NOT.FOUND', code: 100 }],
      });
    }
    next();
  }

  /**
   * Valdiate the voucher existance on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function}
   */
  async validateVoucherExistance(req: Request, res: Response, next: Function) {
    const body = this.matchedBodyData(req);

    const voucherId = body.voucherId || req.params.voucherId;
    const foundVoucher = await Voucher.query().findById(voucherId);

    if (!foundVoucher) {
      return res.status(400).send({
        errors: [{ type: 'VOUCHER.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validates whether the voucher id is disabled.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateNotDisabledVoucher(req: Request, res: Response, next: Function) {
    const voucherId = req.params.voucherId || req.query.voucherId;
    const foundVoucher = await Voucher.query().findById(voucherId);

    if (foundVoucher.disabled) {
      return res.status(400).send({
        errors: [{ type: 'VOUCHER.ALREADY.DISABLED', code: 200 }],
      });
    }
    next();
  }

  /**
   * Generate vouchers codes with given period in bulk.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async generateVoucher(req: Request, res: Response, next: Function) {
    const { loop = 10, period, periodInterval, planId } = this.matchedBodyData(req);

    try {
      await this.voucherService.generateVouchers(
        loop, period, periodInterval, planId,
      );
      return res.status(200).send({
        code: 100,
        message: 'The vouchers have been generated successfully.'
      });
    } catch (error) {
      console.log(error);
      next(error);
    }    
  }

  /**
   * Disable the given voucher on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async disableVoucher(req: Request, res: Response) {
    const { voucherId } = req.params;

    await this.voucherService.disableVoucher(voucherId);

    return res.status(200).send({ voucher_id: voucherId });
  }

  /**
   * Deletes the given voucher code on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async deleteVoucher(req: Request, res: Response) {
    const { voucherId } = req.params;

    await this.voucherService.deleteVoucher(voucherId);

    return res.status(200).send({ voucher_id: voucherId });
  }

  /**
   * Send voucher code in the given period to the customer via email or phone number
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async sendVoucher(req: Request, res: Response) {
    const { phoneNumber, email, period, periodInterval, planId } = this.matchedBodyData(req);
 
    const voucher = await Voucher.query()
      .modify('filterActiveVoucher')
      .where('voucher_period', period)
      .where('period_interval', periodInterval)
      .where('plan_id', planId)
      .first();

    if (!voucher) {
      return res.status(400).send({
        status: 110,
        message: 'There is no vouchers availiable right now with the given period and plan.',
        code: 'NO.AVALIABLE.VOUCHER.CODE',
      });
    }
    await this.voucherService.sendVoucherToCustomer(
      voucher.voucherCode, phoneNumber, email,
    );
    return res.status(200).send({
      status: 100,
      code: 'VOUCHER.CODE.SENT',
      message: 'The voucher has been sent to the given customer.',
    });
  }

  /**
   * Listing vouchers.
   * @param {Request} req 
   * @param {Response} res 
   */
  async listVouchers(req: Request, res: Response) {
    const filter: IVouchersFilter = {
      disabled: false,
      used: false,
      sent: false,
      active: false,
      ...req.query,
    };
    const vouchers = await Voucher.query()
      .onBuild((builder) => {
        builder.modify('filter', filter);
        builder.orderBy('createdAt', 'ASC');
      });
    return res.status(200).send({ vouchers });
  }
}