import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { check, query, param } from 'express-validator';
import { ServiceError } from '@/exceptions';
import BaseController from '../BaseController';
import InventoryAdjustmentService from '@/services/Inventory/InventoryAdjustmentService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { AbilitySubject, InventoryAdjustmentAction } from '@/interfaces';
import CheckPolicies from '../../middleware/CheckPolicies';

@Service()
export default class InventoryAdjustmentsController extends BaseController {
  @Inject()
  inventoryAdjustmentService: InventoryAdjustmentService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/:id/publish',
      CheckPolicies(
        InventoryAdjustmentAction.EDIT,
        AbilitySubject.InventoryAdjustment
      ),
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.publishInventoryAdjustment.bind(this)),
      this.handleServiceErrors
    );
    router.delete(
      '/:id',
      CheckPolicies(
        InventoryAdjustmentAction.DELETE,
        AbilitySubject.InventoryAdjustment
      ),
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.deleteInventoryAdjustment.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/quick',
      CheckPolicies(
        InventoryAdjustmentAction.CREATE,
        AbilitySubject.InventoryAdjustment
      ),
      this.validateQuickAdjustment,
      this.validationResult,
      this.asyncMiddleware(this.createQuickInventoryAdjustment.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id',
      CheckPolicies(
        InventoryAdjustmentAction.VIEW,
        AbilitySubject.InventoryAdjustment
      ),
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getInventoryAdjustment.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/',
      CheckPolicies(
        InventoryAdjustmentAction.VIEW,
        AbilitySubject.InventoryAdjustment
      ),
      [...this.validateListQuerySchema],
      this.validationResult,
      this.asyncMiddleware(this.getInventoryAdjustments.bind(this)),
      this.dynamicListService.handlerErrorsToResponse,
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Validate list query schema
   */
  get validateListQuerySchema() {
    return [
      query('column_sort_by').optional().trim().escape(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),

      query('stringified_filter_roles').optional().isJSON(),
    ];
  }

  /**
   * Quick inventory adjustment validation schema.
   */
  get validateQuickAdjustment() {
    return [
      check('date').exists().isISO8601(),
      check('type')
        .exists()
        .isIn(['increment', 'decrement', 'value_adjustment']),
      check('reference_no').exists(),
      check('adjustment_account_id').exists().isInt().toInt(),
      check('reason').exists().isString().exists(),
      check('description').optional().isString(),
      check('item_id').exists().isInt().toInt(),
      check('quantity')
        .if(check('type').exists().isIn(['increment', 'decrement']))
        .exists()
        .isInt()
        .toInt(),
      check('cost')
        .if(check('type').exists().isIn(['increment']))
        .exists()
        .isFloat()
        .toInt(),
      check('publish').default(false).isBoolean().toBoolean(),

      check('warehouse_id').optional({ nullable: true }).isNumeric().toInt(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),
    ];
  }

  /**
   * Creates a quick inventory adjustment.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async createQuickInventoryAdjustment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId, user } = req;
    const quickInventoryAdjustment = this.matchedBodyData(req);

    try {
      const inventoryAdjustment =
        await this.inventoryAdjustmentService.createQuickAdjustment(
          tenantId,
          quickInventoryAdjustment,
          user
        );

      return res.status(200).send({
        id: inventoryAdjustment.id,
        message: 'The inventory adjustment has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given inventory adjustment transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async deleteInventoryAdjustment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { id: adjustmentId } = req.params;

    try {
      await this.inventoryAdjustmentService.deleteInventoryAdjustment(
        tenantId,
        adjustmentId
      );
      return res.status(200).send({
        id: adjustmentId,
        message: 'The inventory adjustment has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish the given inventory adjustment transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async publishInventoryAdjustment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { id: adjustmentId } = req.params;

    try {
      await this.inventoryAdjustmentService.publishInventoryAdjustment(
        tenantId,
        adjustmentId
      );
      return res.status(200).send({
        id: adjustmentId,
        message: 'The inventory adjustment has been published successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the specific inventory adjustment transaction of  the given id.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async getInventoryAdjustment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { id: adjustmentId } = req.params;

    try {
      const inventoryAdjustment =
        await this.inventoryAdjustmentService.getInventoryAdjustment(
          tenantId,
          adjustmentId
        );

      return res.status(200).send({
        data: this.transformToResponse(inventoryAdjustment),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the inventory adjustments paginated list.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async getInventoryAdjustments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = {
      page: 1,
      pageSize: 12,
      columnSortBy: 'created_at',
      sortOrder: 'desc',
      filterRoles: [],
      ...this.matchedQueryData(req),
    };

    try {
      const { pagination, inventoryAdjustments } =
        await this.inventoryAdjustmentService.getInventoryAdjustments(
          tenantId,
          filter
        );

      return res.status(200).send({
        inventory_adjustments: inventoryAdjustments,
        pagination: this.transformToResponse(pagination),
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
  private handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'INVENTORY_ADJUSTMENT_NOT_FOUND') {
        return res.status(400).send({
          errors: [
            {
              type: 'INVENTORY_ADJUSTMENT.NOT.FOUND',
              code: 100,
              message: 'The inventory adjustment not found.',
            },
          ],
        });
      }
      if (error.errorType === 'NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'ITEM.NOT.FOUND', code: 140 }],
        });
      }
      if (error.errorType === 'account_not_found') {
        return res.boom.notFound('The given account not found.', {
          errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'ITEM_SHOULD_BE_INVENTORY_TYPE') {
        return res.boom.badRequest(
          'You could not make adjustment on item has no inventory type.',
          { errors: [{ type: 'ITEM_SHOULD_BE_INVENTORY_TYPE', code: 300 }] }
        );
      }
      if (error.errorType === 'INVENTORY_ADJUSTMENT_ALREADY_PUBLISHED') {
        return res.boom.badRequest('', {
          errors: [
            { type: 'INVENTORY_ADJUSTMENT_ALREADY_PUBLISHED', code: 400 },
          ],
        });
      }
      if (error.errorType === 'TRANSACTIONS_DATE_LOCKED') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'TRANSACTIONS_DATE_LOCKED',
              code: 4900,
              data: { ...error.payload },
            },
          ],
        });
      }
    }
    next(error);
  }
}
