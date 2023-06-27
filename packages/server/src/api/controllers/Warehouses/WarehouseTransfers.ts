import { Service, Inject } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { query, check, param } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import { WarehouseTransferApplication } from '@/services/Warehouses/WarehousesTransfers/WarehouseTransferApplication';
import {
  Features,
  ICreateWarehouseTransferDTO,
  IEditWarehouseTransferDTO,
} from '@/interfaces';
import { ServiceError } from '@/exceptions';
import { FeatureActivationGuard } from '@/api/middleware/FeatureActivationGuard';

@Service()
export class WarehousesTransfers extends BaseController {
  @Inject()
  private warehouseTransferApplication: WarehouseTransferApplication;

  /**
   *
   */
  router() {
    const router = Router();

    router.post(
      '/',
      FeatureActivationGuard(Features.WAREHOUSES),
      [
        check('from_warehouse_id').exists().isInt().toInt(),
        check('to_warehouse_id').exists().isInt().toInt(),

        check('date').exists().isISO8601(),
        check('transaction_number').optional(),

        check('transfer_initiated').default(false).isBoolean().toBoolean(),
        check('transfer_delivered').default(false).isBoolean().toBoolean(),

        check('entries').exists().isArray({ min: 1 }),
        check('entries.*.index').exists(),
        check('entries.*.item_id').exists(),
        check('entries.*.description').optional(),
        check('entries.*.quantity').exists().isInt().toInt(),
        check('entries.*.cost').optional().isDecimal().toFloat(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.createWarehouseTransfer),
      this.handlerServiceErrors
    );
    router.post(
      '/:id',
      FeatureActivationGuard(Features.WAREHOUSES),
      [
        param('id').exists().isInt().toInt(),

        check('from_warehouse_id').exists().isInt().toInt(),
        check('to_warehouse_id').exists().isInt().toInt(),

        check('date').exists().isISO8601(),
        check('transaction_number').optional(),

        check('transfer_initiated').default(false).isBoolean().toBoolean(),
        check('transfer_delivered').default(false).isBoolean().toBoolean(),

        check('entries').exists().isArray({ min: 1 }),
        check('entries.*.id').optional().isInt().toInt(),
        check('entries.*.index').exists(),
        check('entries.*.item_id').exists().isInt().toInt(),
        check('entries.*.description').optional(),
        check('entries.*.quantity').exists().isInt({ min: 1 }).toInt(),
        check('entries.*.cost').optional().isDecimal().toFloat(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.editWarehouseTransfer),
      this.handlerServiceErrors
    );
    router.put(
      '/:id/initiate',
      FeatureActivationGuard(Features.WAREHOUSES),
      [param('id').exists().isInt().toInt()],
      this.asyncMiddleware(this.initiateTransfer),
      this.handlerServiceErrors
    );
    router.put(
      '/:id/transferred',
      FeatureActivationGuard(Features.WAREHOUSES),
      [param('id').exists().isInt().toInt()],
      this.asyncMiddleware(this.deliverTransfer),
      this.handlerServiceErrors
    );
    router.get(
      '/',
      FeatureActivationGuard(Features.WAREHOUSES),
      [
        query('view_slug').optional({ nullable: true }).isString().trim(),

        query('stringified_filter_roles').optional().isJSON(),
        query('column_sort_by').optional(),
        query('sort_order').optional().isIn(['desc', 'asc']),

        query('page').optional().isNumeric().toInt(),
        query('page_size').optional().isNumeric().toInt(),

        query('search_keyword').optional({ nullable: true }).isString().trim(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.getWarehousesTransfers),
      this.handlerServiceErrors
    );
    router.get(
      '/:id',
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getWarehouseTransfer),
      this.handlerServiceErrors
    );
    router.delete(
      '/:id',
      FeatureActivationGuard(Features.WAREHOUSES),
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.deleteWarehouseTransfer),
      this.handlerServiceErrors
    );
    return router;
  }

  /**
   * Creates a new warehouse transfer transaction.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  private createWarehouseTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const createWarehouseTransfer: ICreateWarehouseTransferDTO =
      this.matchedBodyData(req);

    try {
      const warehouse =
        await this.warehouseTransferApplication.createWarehouseTransfer(
          tenantId,
          createWarehouseTransfer
        );
      return res.status(200).send({
        id: warehouse.id,
        message:
          'The warehouse transfer transaction has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Edits warehouse transfer transaction.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  private editWarehouseTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: warehouseTransferId } = req.params;
    const editWarehouseTransferDTO: IEditWarehouseTransferDTO =
      this.matchedBodyData(req);

    try {
      const warehouseTransfer =
        await this.warehouseTransferApplication.editWarehouseTransfer(
          tenantId,
          warehouseTransferId,
          editWarehouseTransferDTO
        );
      return res.status(200).send({
        id: warehouseTransfer.id,
        message:
          'The warehouse transfer transaction has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes the given warehouse transfer transaction.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  private deleteWarehouseTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: warehouseTransferId } = req.params;

    try {
      await this.warehouseTransferApplication.deleteWarehouseTransfer(
        tenantId,
        warehouseTransferId
      );
      return res.status(200).send({
        message:
          'The warehouse transfer transaction has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves warehouse transfer transaction details.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  private getWarehouseTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: warehouseTransferId } = req.params;

    try {
      const warehouseTransfer =
        await this.warehouseTransferApplication.getWarehouseTransfer(
          tenantId,
          warehouseTransferId
        );
      return res.status(200).send({ data: warehouseTransfer });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves specific warehouse transfer transaction.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  private getWarehousesTransfers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const filterDTO = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };
    try {
      const { warehousesTransfers, pagination, filter } =
        await this.warehouseTransferApplication.getWarehousesTransfers(
          tenantId,
          filterDTO
        );

      return res.status(200).send({
        data: warehousesTransfers,
        pagination,
        filter,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Initiates the warehouse transfer.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  private initiateTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: warehouseTransferId } = req.params;

    try {
      await this.warehouseTransferApplication.initiateWarehouseTransfer(
        tenantId,
        warehouseTransferId
      );
      return res.status(200).send({
        id: warehouseTransferId,
        message: 'The given warehouse transfer has been initialized.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * marks the given warehouse transfer as transferred.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  private deliverTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: warehouseTransferId } = req.params;

    try {
      await this.warehouseTransferApplication.transferredWarehouseTransfer(
        tenantId,
        warehouseTransferId
      );
      return res.status(200).send({
        id: warehouseTransferId,
        message: 'The given warehouse transfer has been delivered.',
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
  private handlerServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'WAREHOUSES_TRANSFER_SHOULD_NOT_BE_SAME') {
        return res.status(400).send({
          errors: [
            { type: 'WAREHOUSES_TRANSFER_SHOULD_NOT_BE_SAME', code: 100 },
          ],
        });
      }
      if (error.errorType === 'FROM_WAREHOUSE_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'FROM_WAREHOUSE_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'TO_WAREHOUSE_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'TO_WAREHOUSE_NOT_FOUND', code: 300 }],
        });
      }
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'ITEMS_NOT_FOUND', code: 400 }],
        });
      }
      if (error.errorType === 'WAREHOUSE_TRANSFER_ITEMS_SHOULD_BE_INVENTORY') {
        return res.status(400).send({
          errors: [
            { type: 'WAREHOUSE_TRANSFER_ITEMS_SHOULD_BE_INVENTORY', code: 500 },
          ],
        });
      }
      if (error.errorType === 'WAREHOUSE_TRANSFER_ALREADY_TRANSFERRED') {
        return res.status(400).send({
          errors: [
            { type: 'WAREHOUSE_TRANSFER_ALREADY_TRANSFERRED', code: 600 },
          ],
        });
      }
      if (error.errorType === 'WAREHOUSE_TRANSFER_ALREADY_INITIATED') {
        return res.status(400).send({
          errors: [{ type: 'WAREHOUSE_TRANSFER_ALREADY_INITIATED', code: 700 }],
        });
      }
      if (error.errorType === 'WAREHOUSE_TRANSFER_NOT_INITIATED') {
        return res.status(400).send({
          errors: [{ type: 'WAREHOUSE_TRANSFER_NOT_INITIATED', code: 800 }],
        });
      }
    }
    next(error);
  }
}
