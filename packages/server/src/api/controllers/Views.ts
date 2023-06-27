import { Inject, Service } from 'typedi';
import { Router, Request, NextFunction, Response } from 'express';
import { check, param } from 'express-validator';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import ViewsService from '@/services/Views/ViewsService';
import BaseController from '@/api/controllers/BaseController';
import { IViewDTO, IViewEditDTO } from '@/interfaces';
import { ServiceError } from '@/exceptions';

@Service()
export default class ViewsController extends BaseController {
  @Inject()
  viewsService: ViewsService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/resource/:resource_model',
      [...this.viewsListSchemaValidation],
      this.validationResult,
      asyncMiddleware(this.listResourceViews.bind(this)),
      this.handlerServiceErrors
    );
    return router;
  }

  /**
   * Custom views list validation schema.
   */
  get viewsListSchemaValidation() {
    return [param('resource_model').exists().trim().escape()];
  }

  /**
   * List all views that associated with the given resource.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next  - Next function.
   */
  async listResourceViews(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { resource_model: resourceModel } = req.params;

    try {
      const views = await this.viewsService.listResourceViews(
        tenantId,
        resourceModel
      );
      return res.status(200).send({
        views: this.transformToResponse(views, ['name', 'columns.label'], req),
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
  handlerServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'VIEW_NAME_NOT_UNIQUE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VIEW_NAME_NOT_UNIQUE', code: 110 }],
        });
      }
      if (error.errorType === 'RESOURCE_MODEL_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'RESOURCE_MODEL_NOT_FOUND', code: 150 }],
        });
      }
      if (error.errorType === 'INVALID_LOGIC_EXPRESSION') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VIEW.ROLES.LOGIC.EXPRESSION.INVALID', code: 400 }],
        });
      }
      if (error.errorType === '') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100 }],
        });
      }
      if (error.errorType === '') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'COLUMNS_NOT_EXIST', code: 200 }],
        });
      }
      if (error.errorType === 'VIEW_NOT_FOUND') {
        return res.boom.notFound(null, {
          errors: [{ type: 'VIEW_NOT_FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'VIEW_PREDEFINED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PREDEFINED_VIEW', code: 200 }],
        });
      }
      if (error.errorType === 'RESOURCE_FIELDS_KEYS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'RESOURCE_FIELDS_KEYS_NOT_FOUND', code: 300 }],
        });
      }
      if (error.errorType === 'RESOURCE_COLUMNS_KEYS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'RESOURCE_COLUMNS_KEYS_NOT_FOUND', code: 310 }],
        });
      }
    }
    next(error);
  }
}
