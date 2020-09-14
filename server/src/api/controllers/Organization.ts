import { Inject, Service } from 'typedi';
import { Router, Request, Response } from 'express';
import asyncMiddleware from "api/middleware/asyncMiddleware";
import JWTAuth from 'api/middleware/jwtAuth';
import TenancyMiddleware from 'api/middleware/TenancyMiddleware';
import SubscriptionMiddleware from 'api/middleware/SubscriptionMiddleware';
import AttachCurrentTenantUser from 'api/middleware/AttachCurrentTenantUser';
import OrganizationService from 'services/Organization';
import { ServiceError } from 'exceptions';
import BaseController from 'api/controllers/BaseController';

@Service()
export default class OrganizationController extends BaseController{
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
    router.use(SubscriptionMiddleware('main'));

    router.post(
      '/build',
      asyncMiddleware(this.build.bind(this))
    );
    router.post(
      '/seed',
      asyncMiddleware(this.seed.bind(this)),
    );
    return router;
  }

  /**
   * Builds tenant database and migrate database schema.
   * @param {Request} req - Express request.
   * @param {Response} res - Express response.
   * @param {NextFunction} next 
   */
  async build(req: Request, res: Response, next: Function) {
    const { organizationId } = req.tenant;
  
    try {
      await this.organizationService.build(organizationId);

      return res.status(200).send({
        type: 'success',
        code: 'ORGANIZATION.DATABASE.INITIALIZED',
        message: 'The organization database has been initialized.'
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.errorType === 'tenant_not_found') {
          return res.status(400).send({
            errors: [{ type: 'TENANT.NOT.FOUND', code: 100 }],
          });
        }
        if (error.errorType === 'tenant_already_initialized') {
          return res.status(400).send({
            errors: [{ type: 'TENANT.DATABASE.ALREADY.BUILT', code: 200 }],
          });
        }
      }
      console.log(error);
      next(error);
    }
  }

  /**
   * Seeds initial data to tenant database.
   * @param req 
   * @param res 
   * @param next 
   */
  async seed(req: Request, res: Response, next: Function) {
    const { organizationId } = req.tenant;

    try {
      await this.organizationService.seed(organizationId);

      return res.status(200).send({
        type: 'success',
        code: 'ORGANIZATION.DATABASE.SEED',
        message: 'The organization database has been seeded.'
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.errorType === 'tenant_not_found') {
          return res.status(400).send({
            errors: [{ type: 'TENANT.NOT.FOUND', code: 100 }],
          });
        }
        if (error.errorType === 'tenant_seeded') {
          return res.status(400).send({
            errors: [{ type: 'TENANT.DATABASE.ALREADY.SEEDED', code: 200 }],
          });
        }
        if (error.errorType === 'tenant_db_not_built') {
          return res.status(400).send({
            errors: [{ type: 'TENANT.DATABASE.NOT.BUILT', code: 300 }],
          });
        }
      }
      next(error);
    }
  }
}