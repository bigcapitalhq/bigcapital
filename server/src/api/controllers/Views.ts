import { Inject, Service } from 'typedi';
import { Router, Request, NextFunction, Response } from 'express';
import {
  check,
  query,
  param,
  oneOf,
  validationResult,
} from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import {
  validateViewRoles,
} from 'lib/ViewRolesBuilder';
import ViewsService from 'services/Views/ViewsService';
import BaseController from './BaseController';
import { IViewDTO } from 'interfaces';
import { ServiceError } from 'exceptions';

@Service()
export default class ViewsController extends BaseController{
  @Inject()
  viewsService: ViewsService;
  
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get('/', [
      ...this.viewDTOSchemaValidation,
    ],
      asyncMiddleware(this.listViews)
    );
    router.post('/', [
      ...this.viewDTOSchemaValidation,
    ],
      asyncMiddleware(this.createView)
    );

    router.post('/:view_id', [
      ...this.viewDTOSchemaValidation,
    ],
      asyncMiddleware(this.editView)
    );

    router.delete('/:view_id', [
      ...this.viewParamSchemaValidation
    ],
      asyncMiddleware(this.deleteView));

    router.get('/:view_id', [
      ...this.viewParamSchemaValidation
    ]
      asyncMiddleware(this.getView)
    );

    router.get('/:view_id/resource', [
      ...this.viewParamSchemaValidation
    ],
      asyncMiddleware(this.getViewResource)
    );

    return router;
  }

  get viewDTOSchemaValidation() {
    return [
      check('resource_name').exists().escape().trim(),
      check('name').exists().escape().trim(),
      check('logic_expression').exists().trim().escape(),
      check('roles').isArray({ min: 1 }),
      check('roles.*.field_key').exists().escape().trim(),
      check('roles.*.comparator').exists(),
      check('roles.*.value').exists(),
      check('roles.*.index').exists().isNumeric().toInt(),
      check('columns').exists().isArray({ min: 1 }),
      check('columns.*.key').exists().escape().trim(),
      check('columns.*.index').exists().isNumeric().toInt(),
    ];
  }

  get viewParamSchemaValidation() {
    return [
      
    ]
  }

  

  /**
   * List all views that associated with the given resource.
   * @param {Request} req - 
   * @param {Response} res - 
   * @param {NextFunction} next  - 
   */
  listViews(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = req.query;

    try {
      const views = this.viewsService.listViews(tenantId, filter);
      return res.status(200).send({ views });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  getView(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    try {
      const view = this.viewsService.getView(tenantId, viewId);
      return res.status(200).send({ view });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new view.
   * @param {Request} req - 
   * @param {Response} res - 
   * @param {NextFunction} next  - 
   */
  createView(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const viewDTO: IViewDTO = this.matchedBodyData(req);

    try {
      await this.viewsService.newView(tenantId, viewDTO);
      return res.status(200).send({ id: 1 });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edits views metadata.
   * @param {Request} req - 
   * @param {Response} res - 
   * @param {NextFunction} next  - 
   */
  editView(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: viewId } = req.params;
    const { body: viewEditDTO } = req;

    try {
      await this.viewsService.editView(tenantId, viewId, viewEditDTO);
      return res.status(200).send({ id: viewId });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given view.
   * @param {Request} req - 
   * @param {Response} res - 
   * @param {NextFunction} next  - 
   */
  deleteView(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: viewId } = req.params;

    try {
      await this.viewsService.deleteView(tenantId, viewId);
      return res.status(200).send();
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
  handlerServiceErrors(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
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
    }
  }
};
