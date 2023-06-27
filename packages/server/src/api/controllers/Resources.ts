import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';
import BaseController from './BaseController';
import { ServiceError } from '@/exceptions';
import ResourceService from '@/services/Resource/ResourceService';

@Service()
export default class ResourceController extends BaseController {
  @Inject()
  resourcesService: ResourceService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/:resource_model/meta',
      [
        param('resource_model').exists().trim().escape()
      ],
      this.asyncMiddleware(this.resourceMeta.bind(this)),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Retrieve resource model meta.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   * @returns {Response}
   */
  public resourceMeta = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    const { tenantId } = req;
    const { resource_model: resourceModel } = req.params;

    try {
      const resourceMeta = this.resourcesService.getResourceMeta(
        tenantId,
        resourceModel
      );
      return res.status(200).send({
        resource_meta: this.transformToResponse(
          resourceMeta,
        ),
      });
    } catch (error) {
      next(error);
    }
  };

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
      if (error.errorType === 'RESOURCE_MODEL_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'RESOURCE.MODEL.NOT.FOUND', code: 100 }],
        });
      }
    }
    next(error);
  }
}
