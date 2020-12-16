import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import asyncMiddleware from "api/middleware/asyncMiddleware";
import JWTAuth from 'api/middleware/jwtAuth';
import TenancyMiddleware from 'api/middleware/TenancyMiddleware';
import SubscriptionMiddleware from 'api/middleware/SubscriptionMiddleware';
import AttachCurrentTenantUser from 'api/middleware/AttachCurrentTenantUser';
import OrganizationService from 'services/Organization';
import { ServiceError } from 'exceptions';
import BaseController from 'api/controllers/BaseController';
import EnsureConfiguredMiddleware from 'api/middleware/EnsureConfiguredMiddleware';
import SettingsMiddleware from 'api/middleware/SettingsMiddleware';

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
    
    // Should to seed organization tenant be configured.
    router.use('/seed', SubscriptionMiddleware('main'));
    router.use('/seed', SettingsMiddleware);
    router.use('/seed', EnsureConfiguredMiddleware);

    router.use('/build', SubscriptionMiddleware('main'));

    router.post(
      '/build',
      asyncMiddleware(this.build.bind(this))
    );
    router.post(
      '/seed',
      asyncMiddleware(this.seed.bind(this)),
    );
    router.get(
      '/all',
      asyncMiddleware(this.allOrganizations.bind(this)),
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
    const { user } = req;
  
    try {
      await this.organizationService.build(organizationId, user);

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
      next(error);
    }
  }

  /**
   * Seeds initial data to tenant database.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
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

  /**
   * Listing all organizations that assocaited to the authorized user.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async allOrganizations(req: Request, res: Response, next: NextFunction) {
    const { user } = req;

    try {
      const organizations = await this.organizationService.listOrganizations(user);
      return res.status(200).send({ organizations });
    } catch (error) {
      next(error);
    }
  }
}