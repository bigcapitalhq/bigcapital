import { Router, Request, Response, NextFunction } from 'express';
import {
  param,
  query,
} from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseController from './BaseController';
import { Service } from 'typedi';
import ResourceFieldsKeys from 'data/ResourceFieldsKeys';

@Service()
export default class ResourceController extends BaseController{
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get('/:resource_model/fields',
      this.resourceModelParamSchema,
      asyncMiddleware(this.resourceFields.bind(this))
    );
    return router;
  }

  get resourceModelParamSchema() {
    return [
      param('resource_model').exists().trim().escape(),
    ];
  }

  /**
   * Retrieve resource fields of the given resource.
   */
  resourceFields(req: Request, res: Response, next: NextFunction) {
    const { resource_model: resourceModel } = req.params;

    try {

    } catch (error) {
      next(error);
    }
  }
};
