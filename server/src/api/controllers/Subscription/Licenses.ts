import { Service, Inject } from 'typedi';
import { Router, Request, Response } from 'express'
import { check, oneOf, ValidationChain } from 'express-validator';
import basicAuth from 'express-basic-auth';
import config from 'config';
import { License, Plan } from 'system/models';
import BaseController from 'api/controllers/BaseController';
import LicenseService from 'services/Payment/License';
import validateMiddleware from 'api/middleware/validateMiddleware';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import { ILicensesFilter } from 'interfaces';

@Service()
export default class LicensesController extends BaseController {
  @Inject()
  licenseService: LicenseService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use(basicAuth({
      users: {
        [config.licensesAuth.user]: config.licensesAuth.password,
      },
      challenge: true,
    }));

    router.post(
      '/generate',
      this.generateLicenseSchema,
      validateMiddleware,
      asyncMiddleware(this.validatePlanExistance.bind(this)),
      asyncMiddleware(this.generateLicense.bind(this)),
    );
    router.post(
      '/disable/:licenseId',
      validateMiddleware,
      asyncMiddleware(this.validateLicenseExistance.bind(this)),
      asyncMiddleware(this.validateNotDisabledLicense.bind(this)),
      asyncMiddleware(this.disableLicense.bind(this)),
    );
    router.post(
      '/send',
      this.sendLicenseSchemaValidation,
      validateMiddleware,
      asyncMiddleware(this.sendLicense.bind(this)),
    );
    router.delete(
      '/:licenseId',
      asyncMiddleware(this.validateLicenseExistance.bind(this)),
      asyncMiddleware(this.deleteLicense.bind(this)),
    );
    router.get(
      '/',
      asyncMiddleware(this.listLicenses.bind(this)),
    );
    return router;
  }

  /**
   * Generate license validation schema.
   */
  get generateLicenseSchema(): ValidationChain[] {
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
   * Specific license validation schema.
   */
  get specificLicenseSchema(): ValidationChain[] {
    return [
      oneOf([
        check('license_id').exists().isNumeric().toInt(),
      ], [
        check('license_code').exists().isNumeric().toInt(),
      ])
    ]
  }

  /**
   * Send license validation schema.
   */
  get sendLicenseSchemaValidation(): ValidationChain[] {
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
   * Valdiate the license existance on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function}
   */
  async validateLicenseExistance(req: Request, res: Response, next: Function) {
    const body = this.matchedBodyData(req);

    const licenseId = body.licenseId || req.params.licenseId;
    const foundLicense = await License.query().findById(licenseId);

    if (!foundLicense) {
      return res.status(400).send({
        errors: [{ type: 'LICENSE.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validates whether the license id is disabled.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateNotDisabledLicense(req: Request, res: Response, next: Function) {
    const licenseId = req.params.licenseId || req.query.licenseId;
    const foundLicense = await License.query().findById(licenseId);

    if (foundLicense.disabled) {
      return res.status(400).send({
        errors: [{ type: 'LICENSE.ALREADY.DISABLED', code: 200 }],
      });
    }
    next();
  }

  /**
   * Generate licenses codes with given period in bulk.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async generateLicense(req: Request, res: Response, next: Function) {
    const { loop = 10, period, periodInterval, planId } = this.matchedBodyData(req);

    try {
      await this.licenseService.generateLicenses(
        loop, period, periodInterval, planId,
      );
      return res.status(200).send({
        code: 100,
        type: 'LICENSEES.GENERATED.SUCCESSFULLY',
        message: 'The licenses have been generated successfully.'
      });
    } catch (error) {
      console.log(error);
      next(error);
    }    
  }

  /**
   * Disable the given license on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async disableLicense(req: Request, res: Response) {
    const { licenseId } = req.params;

    await this.licenseService.disableLicense(licenseId);

    return res.status(200).send({ license_id: licenseId });
  }

  /**
   * Deletes the given license code on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async deleteLicense(req: Request, res: Response) {
    const { licenseId } = req.params;

    await this.licenseService.deleteLicense(licenseId);

    return res.status(200).send({ license_id: licenseId });
  }

  /**
   * Send license code in the given period to the customer via email or phone number
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async sendLicense(req: Request, res: Response) {
    const { phoneNumber, email, period, periodInterval, planId } = this.matchedBodyData(req);
 
    const license = await License.query()
      .modify('filterActiveLicense')
      .where('license_period', period)
      .where('period_interval', periodInterval)
      .where('plan_id', planId)
      .first();

    if (!license) {
      return res.status(400).send({
        status: 110,
        message: 'There is no licenses availiable right now with the given period and plan.',
        code: 'NO.AVALIABLE.LICENSE.CODE',
      });
    }
    await this.licenseService.sendLicenseToCustomer(
      license.licenseCode, phoneNumber, email,
    );
    return res.status(200).send({
      status: 100,
      code: 'LICENSE.CODE.SENT',
      message: 'The license has been sent to the given customer.',
    });
  }

  /**
   * Listing licenses.
   * @param {Request} req 
   * @param {Response} res 
   */
  async listLicenses(req: Request, res: Response) {
    const filter: ILicensesFilter = {
      disabled: false,
      used: false,
      sent: false,
      active: false,
      ...req.query,
    };
    const licenses = await License.query()
      .onBuild((builder) => {
        builder.modify('filter', filter);
        builder.orderBy('createdAt', 'ASC');
      });
    return res.status(200).send({ licenses });
  }
}