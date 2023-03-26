import { Router, Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import ItemTransactionsService from '@/services/Items/ItemTransactionsService';
import BaseController from '../BaseController';

@Service()
export default class ItemTransactionsController extends BaseController {
  @Inject()
  itemTransactionsService: ItemTransactionsService;

  router() {
    const router = Router();

    router.get(
      '/:id/transactions/invoices',
      this.asyncMiddleware(this.getItemInvoicesTransactions)
    );
    router.get(
      '/:id/transactions/bills',
      this.asyncMiddleware(this.getItemBillTransactions)
    );
    router.get(
      '/:id/transactions/estimates',
      this.asyncMiddleware(this.getItemEstimateTransactions)
    );
    router.get(
      '/:id/transactions/receipts',
      this.asyncMiddleware(this.getItemReceiptTransactions)
    );
    return router;
  }

  /**
   * Retrieve item associated invoices transactions.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next - Next function.
   */
  public getItemInvoicesTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: invoiceId } = req.params;

    try {
      const transactions =
        await this.itemTransactionsService.getItemInvoicesTransactions(
          tenantId,
          invoiceId
        );

      return res.status(200).send({ data: transactions });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve item associated bills transactions.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next - Next function.
   */
  public getItemBillTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: billId } = req.params;

    try {
      const transactions =
        await this.itemTransactionsService.getItemBillTransactions(
          tenantId,
          billId
        );
      return res.status(200).send({ data: transactions });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve item associated estimates transactions.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next - Next function.
   */
  public getItemEstimateTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: estimateId } = req.params;

    try {
      const transactions =
        await this.itemTransactionsService.getItemEstimateTransactions(
          tenantId,
          estimateId
        );
      return res.status(200).send({ data: transactions });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public getItemReceiptTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: receiptId } = req.params;

    try {
      const transactions =
        await this.itemTransactionsService.getItemReceiptTransactions(
          tenantId,
          receiptId
        );
      return res.status(200).send({ data: transactions });
    } catch (error) {
      next(error);
    }
  };
}
