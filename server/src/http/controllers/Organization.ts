import { Inject, Service } from 'typedi';
import { Router, Request, Response } from 'express';
import { check, matchedData } from 'express-validator';
import { mapKeys, camelCase } from 'lodash';
import asyncMiddleware from "@/http/middleware/asyncMiddleware";
import validateMiddleware from '@/http/middleware/validateMiddleware';
import OrganizationService from '@/services/Organization';
import { ServiceError } from '@/exceptions';

@Service()
export default class OrganizationController {
  @Inject()
  organizationService: OrganizationService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/build', [
        check('organization_id').exists().trim().escape(),
      ],
      validateMiddleware,
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
    const buildOTD = mapKeys(matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
    }), (v, k) => camelCase(k)); 
  
    try {
      await this.organizationService.build(buildOTD.organizationId);

      return res.status(200).send({
        type: 'ORGANIZATION.DATABASE.INITIALIZED',
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