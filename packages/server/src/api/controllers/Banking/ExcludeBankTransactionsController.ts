import { Inject, Service } from 'typedi';
import { body, param, query } from 'express-validator';
import { NextFunction, Request, Response, Router } from 'express';
import BaseController from '../BaseController';
import { ExcludeBankTransactionsApplication } from '@/services/Banking/Exclude/ExcludeBankTransactionsApplication';
import { map, parseInt, trim } from 'lodash';

@Service()
export class ExcludeBankTransactionsController extends BaseController {
  @Inject()
  private excludeBankTransactionApp: ExcludeBankTransactionsApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.put(
      '/transactions/exclude',
      [body('ids').exists()],
      this.validationResult,
      this.excludeBulkBankTransactions.bind(this)
    );
    router.put(
      '/transactions/unexclude',
      [body('ids').exists()],
      this.validationResult,
      this.unexcludeBulkBankTransactins.bind(this)
    );
    router.put(
      '/transactions/:transactionId/exclude',
      [param('transactionId').exists().toInt()],
      this.validationResult,
      this.excludeBankTransaction.bind(this)
    );
    router.put(
      '/transactions/:transactionId/unexclude',
      [param('transactionId').exists()],
      this.validationResult,
      this.unexcludeBankTransaction.bind(this)
    );
    router.get(
      '/excluded',
      [
        query('account_id').optional().isNumeric().toInt(),
        query('page').optional().isNumeric().toInt(),
        query('page_size').optional().isNumeric().toInt(),
        query('min_date').optional({ nullable: true }).isISO8601().toDate(),
        query('max_date').optional({ nullable: true }).isISO8601().toDate(),
        query('min_amount').optional({ nullable: true }).isFloat().toFloat(),
        query('max_amount').optional({ nullable: true }).isFloat().toFloat(),
      ],
      this.validationResult,
      this.getExcludedBankTransactions.bind(this)
    );
    return router;
  }

  /**
   * Marks a bank transaction as excluded.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  private async excludeBankTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const { transactionId } = req.params;

    try {
      await this.excludeBankTransactionApp.excludeBankTransaction(
        tenantId,
        transactionId
      );
      return res.status(200).send({
        message: 'The bank transaction has been excluded.',
        id: transactionId,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marks a bank transaction as not excluded.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|void>}
   */
  private async unexcludeBankTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const { transactionId } = req.params;

    try {
      await this.excludeBankTransactionApp.unexcludeBankTransaction(
        tenantId,
        transactionId
      );
      return res.status(200).send({
        message: 'The bank transaction has been unexcluded.',
        id: transactionId,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Exclude bank transactions in bulk.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async excludeBulkBankTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { ids } = this.matchedBodyData(req);

    try {
      await this.excludeBankTransactionApp.excludeBankTransactions(
        tenantId,
        ids
      );
      return res.status(200).send({
        message: 'The given bank transactions have been excluded',
        ids,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unexclude the given bank transactions in bulk.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | null>}
   */
  private async unexcludeBulkBankTransactins(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | null> {
    const { tenantId } = req;
    const { ids } = this.matchedBodyData(req);

    try {
      await this.excludeBankTransactionApp.unexcludeBankTransactions(
        tenantId,
        ids
      );
      return res.status(200).send({
        message: 'The given bank transactions have been excluded',
        ids,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the excluded uncategorized bank transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|null>}
   */
  private async getExcludedBankTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    try {
      const data =
        await this.excludeBankTransactionApp.getExcludedBankTransactions(
          tenantId,
          filter
        );
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
}
