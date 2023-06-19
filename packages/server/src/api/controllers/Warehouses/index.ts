import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import { Request, Response, Router, NextFunction } from 'express';
import { check, param } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import { WarehousesApplication } from '@/services/Warehouses/WarehousesApplication';
import { Features, ICreateWarehouseDTO, IEditWarehouseDTO } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import { FeatureActivationGuard } from '@/api/middleware/FeatureActivationGuard';

@Service()
export class WarehousesController extends BaseController {
  @Inject()
  private warehouseApplication: WarehousesApplication;

  /**
   *
   * @returns
   */
  router() {
    const router = Router();

    router.post(
      '/activate',
      [],
      this.validationResult,
      this.asyncMiddleware(this.activateWarehouses),
      this.handlerServiceErrors
    );
    router.post(
      '/',
      FeatureActivationGuard(Features.WAREHOUSES),
      [
        check('name').exists(),
        check('code').optional({ nullable: true }),

        check('address').optional({ nullable: true }),
        check('city').optional({ nullable: true }),
        check('country').optional({ nullable: true }),

        check('phone_number').optional({ nullable: true }),
        check('email').optional({ nullable: true }).isEmail(),
        check('website').optional({ nullable: true }).isURL(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.createWarehouse),
      this.handlerServiceErrors
    );
    router.post(
      '/:id',
      FeatureActivationGuard(Features.WAREHOUSES),
      [
        check('id').exists().isInt().toInt(),
        check('name').exists(),
        check('code').optional({ nullable: true }),

        check('address').optional({ nullable: true }),
        check('city').optional({ nullable: true }),
        check('country').optional({ nullable: true }),

        check('phone_number').optional({ nullable: true }),
        check('email').optional({ nullable: true }).isEmail(),
        check('website').optional({ nullable: true }).isURL(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.editWarehouse),
      this.handlerServiceErrors
    );
    router.post(
      '/:id/mark-primary',
      FeatureActivationGuard(Features.WAREHOUSES),
      [check('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.markPrimaryWarehouse)
    );
    router.delete(
      '/:id',
      FeatureActivationGuard(Features.WAREHOUSES),
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.deleteWarehouse),
      this.handlerServiceErrors
    );
    router.get(
      '/:id',
      FeatureActivationGuard(Features.WAREHOUSES),
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getWarehouse),
      this.handlerServiceErrors
    );
    router.get(
      '/',
      FeatureActivationGuard(Features.WAREHOUSES),
      [],
      this.validationResult,
      this.asyncMiddleware(this.getWarehouses),
      this.handlerServiceErrors
    );
    return router;
  }

  /**
   * Creates a new warehouse.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public createWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const createWarehouseDTO: ICreateWarehouseDTO = this.matchedBodyData(req);

    try {
      const warehouse = await this.warehouseApplication.createWarehouse(
        tenantId,
        createWarehouseDTO
      );
      return res.status(200).send({
        id: warehouse.id,
        message: 'The warehouse has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes the given warehouse.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public editWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: warehouseId } = req.params;
    const editWarehouseDTO: IEditWarehouseDTO = this.matchedBodyData(req);

    try {
      const warehouse = await this.warehouseApplication.editWarehouse(
        tenantId,
        warehouseId,
        editWarehouseDTO
      );

      return res.status(200).send({
        id: warehouse.id,
        message: 'The warehouse has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public deleteWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: warehouseId } = req.params;

    try {
      await this.warehouseApplication.deleteWarehouse(tenantId, warehouseId);

      return res.status(200).send({
        message: 'The warehouse has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * Retrieves specific warehouse.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public getWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: warehouseId } = req.params;

    try {
      const warehouse = await this.warehouseApplication.getWarehouse(
        tenantId,
        warehouseId
      );
      return res.status(200).send({ warehouse });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves warehouses list.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public getWarehouses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;

    try {
      const warehouses = await this.warehouseApplication.getWarehouses(
        tenantId
      );
      return res.status(200).send({ warehouses });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Activates multi-warehouses feature.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public activateWarehouses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;

    try {
      await this.warehouseApplication.activateWarehouses(tenantId);

      return res.status(200).send({
        message: 'The multi-warehouses has been activated successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Marks the given warehouse as primary.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public markPrimaryWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: warehouseId } = req.params;

    try {
      const warehouse = await this.warehouseApplication.markWarehousePrimary(
        tenantId,
        warehouseId
      );
      return res.status(200).send({
        id: warehouse.id,
        message: 'The given warehouse has been marked as primary.',
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
      if (error.errorType === 'WAREHOUSE_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'WAREHOUSE_NOT_FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'MULTI_WAREHOUSES_ALREADY_ACTIVATED') {
        return res.status(400).send({
          errors: [{ type: 'MULTI_WAREHOUSES_ALREADY_ACTIVATED', code: 200 }],
        });
      }
      if (error.errorType === 'COULD_NOT_DELETE_ONLY_WAERHOUSE') {
        return res.status(400).send({
          errors: [{ type: 'COULD_NOT_DELETE_ONLY_WAERHOUSE', code: 300 }],
        });
      }
      if (error.errorType === 'WAREHOUSE_CODE_NOT_UNIQUE') {
        return res.status(400).send({
          errors: [{ type: 'WAREHOUSE_CODE_NOT_UNIQUE', code: 400 }],
        });
      }
      if (error.errorType === 'WAREHOUSE_HAS_ASSOCIATED_TRANSACTIONS') {
        return res.status(400).send({
          errors: [
            { type: 'WAREHOUSE_HAS_ASSOCIATED_TRANSACTIONS', code: 500 },
          ],
        });
      }
    }
    next(error);
  }
}
