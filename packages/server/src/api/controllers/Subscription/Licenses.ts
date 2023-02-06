import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { check, oneOf, ValidationChain } from 'express-validator';
import basicAuth from 'express-basic-auth';
import config from '@/config';
import { License } from '@/system/models';
import { ServiceError } from '@/exceptions';
import BaseController from '@/api/controllers/BaseController';
import LicenseService from '@/services/Payment/License';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { ILicensesFilter, ISendLicenseDTO } from '@/interfaces';

@Service()
export default class LicensesController extends BaseController {
  @Inject()
  licenseService: LicenseService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use(
      basicAuth({
        users: {
          [config.licensesAuth.user]: config.licensesAuth.password,
        },
        challenge: true,
      })
    );
    router.post(
      '/generate',
      this.generateLicenseSchema,
      this.validationResult,
      asyncMiddleware(this.generateLicense.bind(this)),
      this.catchServiceErrors,
    );
    router.post(
      '/disable/:licenseId',
      this.validationResult,
      asyncMiddleware(this.disableLicense.bind(this)),
      this.catchServiceErrors,
    );
    router.post(
      '/send',
      this.sendLicenseSchemaValidation,
      this.validationResult,
      asyncMiddleware(this.sendLicense.bind(this)),
      this.catchServiceErrors,
    );
    router.delete(
      '/:licenseId',
      asyncMiddleware(this.deleteLicense.bind(this)),
      this.catchServiceErrors,
    );
    router.get('/', asyncMiddleware(this.listLicenses.bind(this)));
    return router;
  }

  /**
   * Generate license validation schema.
   */
  get generateLicenseSchema(): ValidationChain[] {
    return [
      check('loop').exists().isNumeric().toInt(),
      check('period').exists().isNumeric().toInt(),
      check('period_interval')
        .exists()
        .isIn(['month', 'months', 'year', 'years', 'day', 'days']),
      check('plan_slug').exists().trim().escape(),
    ];
  }

  /**
   * Specific license validation schema.
   */
  get specificLicenseSchema(): ValidationChain[] {
    return [
      oneOf(
        [check('license_id').exists().isNumeric().toInt()],
        [check('license_code').exists().isNumeric().toInt()]
      ),
    ];
  }

  /**
   * Send license validation schema.
   */
  get sendLicenseSchemaValidation(): ValidationChain[] {
    return [
      check('period').exists().isNumeric(),
      check('period_interval').exists().trim().escape(),
      check('plan_slug').exists().trim().escape(),
      oneOf([
        check('phone_number').exists().trim().escape(),
        check('email').exists().trim().escape(),
      ]),
    ];
  }

  /**
   * Generate licenses codes with given period in bulk.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async generateLicense(req: Request, res: Response, next: Function) {
    const { loop = 10, period, periodInterval, planSlug } = this.matchedBodyData(
      req
    );

    try {
      await this.licenseService.generateLicenses(
        loop,
        period,
        periodInterval,
        planSlug
      );
      return res.status(200).send({
        code: 100,
        type: 'LICENSEES.GENERATED.SUCCESSFULLY',
        message: 'The licenses have been generated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Disable the given license on the storage.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async disableLicense(req: Request, res: Response, next: Function) {
    const { licenseId } = req.params;

    try {
      await this.licenseService.disableLicense(licenseId);

      return res.status(200).send({ license_id: licenseId });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given license code on the storage.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async deleteLicense(req: Request, res: Response, next: Function) {
    const { licenseId } = req.params;

    try {
      await this.licenseService.deleteLicense(licenseId);

      return res.status(200).send({ license_id: licenseId });
    } catch (error) {
      next(error)
    }
  }

  /**
   * Send license code in the given period to the customer via email or phone number
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async sendLicense(req: Request, res: Response, next: Function) {
    const sendLicenseDTO: ISendLicenseDTO = this.matchedBodyData(req);

    try {
      await this.licenseService.sendLicenseToCustomer(sendLicenseDTO);

      return res.status(200).send({
        status: 100,
        code: 'LICENSE.CODE.SENT',
        message: 'The license has been sent to the given customer.',
      });
    } catch (error) {
      next(error);
    }
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
    const licenses = await License.query().onBuild((builder) => {
      builder.modify('filter', filter);
      builder.orderBy('createdAt', 'ASC');
    });
    return res.status(200).send({ licenses });
  }

  /**
   * Catches all service errors.
   */
  catchServiceErrors(error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'PLAN_NOT_FOUND') {
        return res.status(400).send({
          errors: [{
            type: 'PLAN.NOT.FOUND',
            code: 100,
            message: 'The given plan not found.',
        }],
        });
      }
      if (error.errorType === 'LICENSE_NOT_FOUND') {
        return res.status(400).send({
          errors: [{
            type: 'LICENSE_NOT_FOUND',
            code: 200,
            message: 'The given license id not found.'
          }],
        });
      }
      if (error.errorType === 'LICENSE_ALREADY_DISABLED') {
        return res.status(400).send({
          errors: [{
            type: 'LICENSE.ALREADY.DISABLED',
            code: 200, 
            message: 'License is already disabled.'
          }],
        });
      }
      if (error.errorType === 'NO_AVALIABLE_LICENSE_CODE') {
        return res.status(400).send({
          status: 110,
          message: 'There is no licenses availiable right now with the given period and plan.',
          code: 'NO.AVALIABLE.LICENSE.CODE',
        });
      }
    }
    next(error);
  }
}
