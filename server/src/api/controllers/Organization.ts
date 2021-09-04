import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { check, ValidationChain } from 'express-validator';

import asyncMiddleware from 'api/middleware/asyncMiddleware';
import JWTAuth from 'api/middleware/jwtAuth';
import TenancyMiddleware from 'api/middleware/TenancyMiddleware';
import SubscriptionMiddleware from 'api/middleware/SubscriptionMiddleware';
import AttachCurrentTenantUser from 'api/middleware/AttachCurrentTenantUser';
import OrganizationService from 'services/Organization';
import { ServiceError } from 'exceptions';
import BaseController from 'api/controllers/BaseController';

const DATE_FORMATS = ['MM/DD/YYYY', 'M/D/YYYY'];
const BASE_CURRENCY = ['USD', 'LYD'];
@Service()
export default class OrganizationController extends BaseController {
  @Inject()
  organizationService: OrganizationService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    // Should before build tenant database the user be authorized and
    // most important than that, should be subscribed to any plan.
    router.use(JWTAuth);
    router.use(AttachCurrentTenantUser);
    router.use(TenancyMiddleware);

    router.use('/build', SubscriptionMiddleware('main'));
    router.post(
      '/build',
      this.buildValidationSchema,
      this.validationResult,
      asyncMiddleware(this.build.bind(this)),
      this.handleServiceErrors.bind(this)
    );
    router.put(
      '/',
      this.asyncMiddleware(this.updateOrganization.bind(this)),
      this.handleServiceErrors.bind(this)
    );
    router.get(
      '/',
      asyncMiddleware(this.currentOrganization.bind(this)),
      this.handleServiceErrors.bind(this)
    );
    return router;
  }

  /**
   * Organization setup schema.
   */
  private get buildValidationSchema(): ValidationChain[] {
    return [
      check('organization_name').exists().trim(),
      check('base_currency').exists().isIn(BASE_CURRENCY),
      check('timezone').exists(),
      check('fiscal_year').exists().isISO8601(),
      check('industry').optional().isString(),
      check('date_format').optional().isIn(DATE_FORMATS),
    ];
  }

  /**
   * Builds tenant database and migrate database schema.
   * @param {Request} req - Express request.
   * @param {Response} res - Express response.
   * @param {NextFunction} next
   */
  private async build(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const buildDTO = this.matchedBodyData(req);

    try {
      const result = await this.organizationService.buildRunJob(
        tenantId,
        buildDTO
      );

      return res.status(200).send({
        type: 'success',
        code: 'ORGANIZATION.DATABASE.INITIALIZED',
        message: 'The organization database has been initialized.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the current organization of the associated authenticated user.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async currentOrganization(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;

    try {
      const organization = await this.organizationService.currentOrganization(
        tenantId
      );
      return res.status(200).send({ organization });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the organization information.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   * @returns 
   */
  private async updateOrganization(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const tenantDTO = this.matchedBodyData(req);

    try {
      const organization = await this.organizationService.updateOrganization(
        tenantId,
        tenantDTO
      );
      return res.status(200).send(
        this.transfromToResponse({
          tenantId,
          message: 'Organization information has been updated successfully.',
        })
      );
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
  private handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'tenant_not_found') {
        return res.status(400).send({
          errors: [{ type: 'TENANT.NOT.FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'TENANT_ALREADY_BUILT') {
        return res.status(400).send({
          errors: [{ type: 'TENANT_ALREADY_BUILT', code: 200 }],
        });
      }
      if (error.errorType === 'TENANT_IS_BUILDING') {
        return res.status(400).send({
          errors: [{ type: 'TENANT_IS_BUILDING', code: 300 }],
        });
      }
    }
    next(error);
  }
}
