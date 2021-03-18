import { Router, Request, Response, NextFunction } from 'express';
import { check, ValidationChain } from 'express-validator';
import BaseController from './BaseController';
import SetupService from 'services/Setup/SetupService';
import { Inject, Service } from 'typedi';
import { IOrganizationSetupDTO } from 'interfaces';
import { ServiceError } from 'exceptions';
// Middlewares
import JWTAuth from 'api/middleware/jwtAuth';
import AttachCurrentTenantUser from 'api/middleware/AttachCurrentTenantUser';
import SubscriptionMiddleware from 'api/middleware/SubscriptionMiddleware';
import TenancyMiddleware from 'api/middleware/TenancyMiddleware';
import EnsureTenantIsInitialized from 'api/middleware/EnsureTenantIsInitialized';
import SettingsMiddleware from 'api/middleware/SettingsMiddleware';

@Service()
export default class SetupController extends BaseController {
  @Inject()
  setupService: SetupService;

  router() {
    const router = Router('/setup');

    router.use(JWTAuth);
    router.use(AttachCurrentTenantUser);
    router.use(TenancyMiddleware);
    router.use(SubscriptionMiddleware('main'));
    router.use(EnsureTenantIsInitialized);
    router.use(SettingsMiddleware);
    router.post(
      '/organization',
      this.organizationSetupSchema,
      this.validationResult,
      this.asyncMiddleware(this.organizationSetup.bind(this)),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Organization setup schema.
   */
  private get organizationSetupSchema(): ValidationChain[] {
    return [
      check('organization_name').exists().trim(),
      check('base_currency').exists(),
      check('time_zone').exists(),
      check('fiscal_year').exists(),
      check('industry').optional(),
    ];
  }

  /**
   * Organization setup.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  async organizationSetup(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const setupDTO: IOrganizationSetupDTO = this.matchedBodyData(req);

    try {
      await this.setupService.organizationSetup(tenantId, setupDTO);

      return res.status(200).send({
        message: 'The setup settings set successfully.',
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
  handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'TENANT_IS_ALREADY_SETUPED') {
        return res.status(400).send({
          errors: [{ type: 'TENANT_IS_ALREADY_SETUPED', code: 1000 }],
        });
      }
      if (error.errorType === 'BASE_CURRENCY_INVALID') {
        return res.status(400).send({
          errors: [{ type: 'BASE_CURRENCY_INVALID', code: 110 }],
        });
      }
    }
    next(error);
  }
}
