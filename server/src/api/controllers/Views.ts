import { Inject, Service } from 'typedi';
import { Router, Request, NextFunction, Response } from 'express';
import { check, param } from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import ViewsService from 'services/Views/ViewsService';
import BaseController from 'api/controllers/BaseController';
import { IViewDTO, IViewEditDTO } from 'interfaces';
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

    router.get('/resource/:resource_model', [
      ...this.viewsListSchemaValidation,
    ],
      this.validationResult,
      asyncMiddleware(this.listResourceViews.bind(this)),
      this.handlerServiceErrors,
    );
    router.post('/', [
      ...this.viewDTOSchemaValidation,
    ],
      this.validationResult,
      asyncMiddleware(this.createView.bind(this)),
      this.handlerServiceErrors
    );
    router.post('/:id', [
      ...this.viewParamSchemaValidation,
      ...this.viewEditDTOSchemaValidation,
    ],
      this.validationResult,
      asyncMiddleware(this.editView.bind(this)),
      this.handlerServiceErrors,
    );
    router.delete('/:id', [
      ...this.viewParamSchemaValidation
    ],
      this.validationResult,
      asyncMiddleware(this.deleteView.bind(this)),
      this.handlerServiceErrors,
    );
    router.get('/:id', [
      ...this.viewParamSchemaValidation
    ],
      this.validationResult,
      asyncMiddleware(this.getView.bind(this)),
      this.handlerServiceErrors,
    );
    return router;
  }

  /**
   * New view DTO schema validation.
   */
  get viewDTOSchemaValidation() {
    return [
      check('resource_model').exists().escape().trim(),
      check('name').exists().escape().trim(),
      check('logic_expression').exists().trim().escape(),

      check('roles').isArray({ min: 1 }),
      check('roles.*.field_key').exists().escape().trim(),
      check('roles.*.comparator').exists(),
      check('roles.*.value').exists(),
      check('roles.*.index').exists().isNumeric().toInt(),

      check('columns').exists().isArray({ min: 1 }),
      check('columns.*.field_key').exists().escape().trim(),
      check('columns.*.index').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Edit view DTO schema validation.
   */
  get viewEditDTOSchemaValidation() {
    return [
      check('name').exists().escape().trim(),
      check('logic_expression').exists().trim().escape(),

      check('roles').isArray({ min: 1 }),
      check('roles.*.field_key').exists().escape().trim(),
      check('roles.*.comparator').exists(),
      check('roles.*.value').exists(),
      check('roles.*.index').exists().isNumeric().toInt(),

      check('columns').exists().isArray({ min: 1 }),
      check('columns.*.field_key').exists().escape().trim(),
      check('columns.*.index').exists().isNumeric().toInt(),
    ];
  }

  get viewParamSchemaValidation() {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }

  get viewsListSchemaValidation() {
    return [
      param('resource_model').exists().trim().escape(),
    ]
  }

  /**
   * List all views that associated with the given resource.
   * @param {Request} req - 
   * @param {Response} res - 
   * @param {NextFunction} next  - 
   */
  async listResourceViews(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { resource_model: resourceModel } = req.params;

    try {
      const views = await this.viewsService.listResourceViews(tenantId, resourceModel);
      return res.status(200).send({ views });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve view details with assocaited roles and columns.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async getView(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: viewId } = req.params;

    try {
      const view = await this.viewsService.getView(tenantId, viewId);
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
  async createView(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const viewDTO: IViewDTO = this.matchedBodyData(req);

    try {
      const view = await this.viewsService.newView(tenantId, viewDTO);
      return res.status(200).send({
        id: view.id,
        message: 'The view has been created successfully.',
      });
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
  async editView(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: viewId } = req.params;
    const viewEditDTO: IViewEditDTO = this.matchedBodyData(req);

    try {
      await this.viewsService.editView(tenantId, viewId, viewEditDTO);
      return res.status(200).send({
        id: viewId,
        message: 'The given view has been edited succcessfully.',
      });
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
  async deleteView(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: viewId } = req.params;

    try {
      await this.viewsService.deleteView(tenantId, viewId);
      return res.status(200).send({
        id: viewId,
        message: 'The view has been deleted successfully.',
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
  handlerServiceErrors(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'VIEW_NAME_NOT_UNIQUE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VIEW_NAME_NOT_UNIQUE', code: 110 }],
        });
      }
      if (error.errorType === 'RESOURCE_MODEL_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'RESOURCE_MODEL_NOT_FOUND', code: 150, }],
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
        })
      }
      if (error.errorType === 'RESOURCE_COLUMNS_KEYS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'RESOURCE_COLUMNS_KEYS_NOT_FOUND', code: 310 }],
        })
      }
    }
    next(error);
  }
};
