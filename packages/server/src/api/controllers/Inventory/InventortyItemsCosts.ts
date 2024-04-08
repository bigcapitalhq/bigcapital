import { InventoryCostApplication } from '@/services/Inventory/InventoryCostApplication';
import { type NextFunction, type Request, type Response, Router } from 'express';
import { query } from 'express-validator';
import { Inject, Service } from 'typedi';
import BaseController from '../BaseController';

@Service()
export class InventoryItemsCostController extends BaseController {
  @Inject()
  private inventoryItemCost: InventoryCostApplication;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/items-cost',
      [
        query('date').exists().isISO8601().toDate(),

        query('items_ids').exists().isArray({ min: 1 }),
        query('items_ids.*').exists().isInt().toInt(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.getItemsCosts),
    );
    return router;
  }

  /**
   * Retrieves the given items costs.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public getItemsCosts = async (req: Request, res: Response, next: NextFunction) => {
    const { tenantId } = req;
    const itemsCostQueryDTO = this.matchedQueryData(req);

    try {
      const costs = await this.inventoryItemCost.getItemsInventoryValuationList(
        tenantId,
        itemsCostQueryDTO.itemsIds,
        itemsCostQueryDTO.date,
      );
      return res.status(200).send({ costs });
    } catch (error) {
      next(error);
    }
  };
}
