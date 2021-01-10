import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { check, param } from 'express-validator';
import { ServiceError } from 'exceptions';
import BaseController from '../BaseController';
import InventoryAdjustmentService from 'services/Inventory/InventoryAdjustmentService';

@Service()
export default class InventoryAdjustmentsController extends BaseController {
  @Inject()
  inventoryAdjustmentService: InventoryAdjustmentService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.delete(
      '/:id',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.deleteInventoryAdjustment.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/quick',
      this.validatateQuickAdjustment,
      this.validationResult,
      this.asyncMiddleware(this.createQuickInventoryAdjustment.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/',
      this.asyncMiddleware(this.getInventoryAdjustments.bind(this)),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Quick inventory adjustment validation schema.
   */
  get validatateQuickAdjustment() {
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
    console.log(quickInventoryAdjustment);

    try {
      const inventoryAdjustment = await this.inventoryAdjustmentService.createQuickAdjustment(
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
        message: 'The inventory adjustment has been deleted successfully.',
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
      ...this.matchedQueryData(req),
    };

    try {
      const {
        pagination,
        inventoryAdjustments,
      } = await this.inventoryAdjustmentService.getInventoryAdjustments(
        tenantId,
        filter
      );

      return res.status(200).send({
        inventoy_adjustments: inventoryAdjustments,
        pagination: this.transfromToResponse(pagination),
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
  handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'INVENTORY_ADJUSTMENT_NOT_FOUND') {
        return res.status(400).send({
          errors: [{
            type: 'INVENTORY_ADJUSTMENT.NOT.FOUND',
            code: 100,
            message: 'The inventory adjustment not found.'
          }],
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
    }
    next(error);
  }
}
