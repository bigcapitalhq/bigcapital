import { Inject, Service } from 'typedi';
import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import asyncMiddleware from "@/http/middleware/asyncMiddleware";
import JWTAuth from '@/http/middleware/jwtAuth';
import TenancyMiddleware from '@/http/middleware/TenancyMiddleware';
import SubscriptionMiddleware from '@/http/middleware/SubscriptionMiddleware';
import AttachCurrentTenantUser from '@/http/middleware/AttachCurrentTenantUser';
import OrganizationService from '@/services/Organization';
import { ServiceError } from '@/exceptions';
import BaseController from '@/http/controllers/BaseController';

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
      '/build', [
        check('organization_id').exists().trim().escape(),
      ],
      this.validationResult,
      asyncMiddleware(this.build.bind(this))
    );
    return router;
  }

  /**
   * Builds tenant database and seed initial data.
   * @param {Request} req - Express request.
   * @param {Response} res - Express response.
   * @param {NextFunction} next 
   */
  async build(req: Request, res: Response, next: Function) {
    const buildOTD = this.matchedBodyData(req);
  
    try {
      await this.organizationService.build(buildOTD.organizationId);

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
        if (error.errorType === 'tenant_initialized') {
          return res.status(400).send({
            errors: [{ type: 'TENANT.DATABASE.ALREADY.BUILT', code: 200 }],
          });
        }
      }
      next(error);
    }
  }
}