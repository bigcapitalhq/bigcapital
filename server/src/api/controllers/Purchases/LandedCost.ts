import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import { ServiceError } from 'exceptions';
import AllocateLandedCostService from 'services/Purchases/LandedCost';
import LandedCostListing from 'services/Purchases/LandedCost/LandedCostListing';
import BaseController from '../BaseController';
import { ResultSetDependencies } from 'mathjs';

@Service()
export default class BillAllocateLandedCost extends BaseController {
  @Inject()
  allocateLandedCost: AllocateLandedCostService;

  @Inject()
  landedCostListing: LandedCostListing;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.post(
      '/bills/:billId/allocate',
      [
        check('transaction_id').exists().isInt(),
        check('transaction_type').exists().isIn(['Expense', 'Bill']),
        check('transaction_entry_id').exists().isInt(),

        check('allocation_method').exists().isIn(['value', 'quantity']),
        check('description').optional({ nullable: true }),

        check('items').isArray({ min: 1 }),
        check('items.*.entry_id').isInt(),
        check('items.*.cost').isDecimal(),
      ],
      this.validationResult,
      this.calculateLandedCost.bind(this),
      this.handleServiceErrors
    );
    router.delete(
      '/:allocatedLandedCostId',
      [param('allocatedLandedCostId').exists().isInt()],
      this.validationResult,
      this.deleteAllocatedLandedCost.bind(this),
      this.handleServiceErrors
    );
    router.get(
      '/transactions',
      [query('transaction_type').exists().isIn(['Expense', 'Bill'])],
      this.validationResult,
      this.getLandedCostTransactions.bind(this),
      this.handleServiceErrors
    );
    router.get(
      '/bills/:billId/transactions',
      [param('billId').exists()],
      this.validationResult,
      this.getBillLandedCostTransactions.bind(this),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Retrieve the landed cost transactions of the given query.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async getLandedCostTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const query = this.matchedQueryData(req);

    try {
      const transactions =
        await this.landedCostListing.getLandedCostTransactions(tenantId, query);
      return res.status(200).send({ transactions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Allocate landed cost.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response}
   */
  public async calculateLandedCost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { billId: purchaseInvoiceId } = req.params;
    const landedCostDTO = this.matchedBodyData(req);

    try {
      const { billLandedCost } =
        await this.allocateLandedCost.allocateLandedCost(
          tenantId,
          landedCostDTO,
          purchaseInvoiceId
        );

      return res.status(200).send({
        id: billLandedCost.id,
        message: 'The items cost are located successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the allocated landed cost.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response}
   */
  public async deleteAllocatedLandedCost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const { tenantId } = req;
    const { allocatedLandedCostId } = req.params;

    try {
      await this.allocateLandedCost.deleteAllocatedLandedCost(
        tenantId,
        allocatedLandedCostId
      );

      return res.status(200).send({
        id: allocatedLandedCostId,
        message: 'The allocated landed cost are delete successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the list unlocated landed costs.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async listLandedCosts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const query = this.matchedQueryData(req);
    const { tenantId } = req;

    try {
      const transactions =
        await this.landedCostListing.getLandedCostTransactions(tenantId, query);
      return res.status(200).send({ transactions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the bill landed cost transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async getBillLandedCostTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const { tenantId } = req;
    const { billId } = req.params;

    try {
      const transactions =
        await this.landedCostListing.getBillLandedCostTransactions(
          tenantId,
          billId
        );

      return res.status(200).send({
        billId,
        transactions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle service errors.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @param {Error} error
   */
  public handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'BILL_NOT_FOUND') {
        return res.status(400).send({
          errors: [
            {
              type: 'BILL_NOT_FOUND',
              code: 400,
              message: 'The give bill id not found.',
            },
          ],
        });
      }
      if (error.errorType === 'LANDED_COST_TRANSACTION_NOT_FOUND') {
        return res.status(400).send({
          errors: [
            {
              type: 'LANDED_COST_TRANSACTION_NOT_FOUND',
              code: 200,
              message: 'The given landed cost transaction id not found.',
            },
          ],
        });
      }
      if (error.errorType === 'LANDED_COST_ENTRY_NOT_FOUND') {
        return res.status(400).send({
          errors: [
            {
              type: 'LANDED_COST_ENTRY_NOT_FOUND',
              code: 300,
              message: 'The given landed cost tranasction entry id not found.',
            },
          ],
        });
      }
      if (error.errorType === 'COST_AMOUNT_BIGGER_THAN_UNALLOCATED_AMOUNT') {
        return res.status(400).send({
          errors: [
            { type: 'COST_AMOUNT_BIGGER_THAN_UNALLOCATED_AMOUNT', code: 300 },
          ],
        });
      }
      if (error.errorType === 'LANDED_COST_ITEMS_IDS_NOT_FOUND') {
        return res.status(400).send({
          errors: [
            {
              type: 'LANDED_COST_ITEMS_IDS_NOT_FOUND',
              code: 200,
              message: 'The given entries ids of purchase invoice not found.',
            },
          ],
        });
      }
      if (error.errorType === 'BILL_LANDED_COST_NOT_FOUND') {
        return res.status(400).send({
          errors: [
            {
              type: 'BILL_LANDED_COST_NOT_FOUND',
              code: 200,
              message: 'The given bill located landed cost not found.',
            },
          ],
        });
      }
      if (error.errorType === 'COST_TRASNACTION_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'COST_TRASNACTION_NOT_FOUND', code: 500 }],
        });
      }
    }
    next(error);
  }
}
