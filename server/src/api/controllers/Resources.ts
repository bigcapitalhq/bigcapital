import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import {
  param,
  query,
} from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseController from './BaseController';
import { ServiceError } from 'exceptions';
import ResourceService from 'services/Resource/ResourceService';

@Service()
export default class ResourceController extends BaseController{
  @Inject()
  resourcesService: ResourceService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/:resource_model/fields', [
        ...this.resourceModelParamSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.resourceFields.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:resource_model/data', [
        ...this.resourceModelParamSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.resourceData.bind(this)),
      this.handleServiceErrors,
    )
    return router;
  }

  get resourceModelParamSchema() {
    return [
      param('resource_model').exists().trim().escape(),
    ];
  }

  /**
   * Retrieve resource fields of the given resource.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  resourceFields(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { resource_model: resourceModel } = req.params;

    try {
      const resourceFields = this.resourcesService.getResourceFields(tenantId, resourceModel);

      return res.status(200).send({
        resource_fields: this.transfromToResponse(resourceFields),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve resource data of the give resource based on the given query.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async resourceData(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { resource_model: resourceModel } = req.params;
    const filter = req.query;

    try {
      const resourceData = await this.resourcesService.getResourceData(tenantId, resourceModel, filter);

      return res.status(200).send({
        resource_data: this.transfromToResponse(resourceData),
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
  handleServiceErrors(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'RESOURCE_MODEL_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'RESOURCE.MODEL.NOT.FOUND', code: 100 }],
        });
      }
    }
    next(error);
  }
};
