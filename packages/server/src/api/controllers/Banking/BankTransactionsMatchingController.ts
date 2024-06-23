import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
import BaseController from '@/api/controllers/BaseController';
import { MatchBankTransactionsApplication } from '@/services/Banking/Matching/MatchBankTransactionsApplication';
import { body, param } from 'express-validator';
import {
  GetMatchedTransactionsFilter,
  IMatchTransactionDTO,
} from '@/services/Banking/Matching/types';

@Service()
export class BankTransactionsMatchingController extends BaseController {
  @Inject()
  private bankTransactionsMatchingApp: MatchBankTransactionsApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.post(
      '/:transactionId',
      [
        param('transactionId').exists(),
        body('matchedTransactions').isArray({ min: 1 }),
        body('matchedTransactions.*.reference_type').exists(),
        body('matchedTransactions.*.reference_id').isNumeric().toInt(),
      ],
      this.validationResult,
      this.matchBankTransaction.bind(this)
    );
    router.post(
      '/unmatch/:transactionId',
      [param('transactionId').exists()],
      this.validationResult,
      this.unmatchMatchedBankTransaction.bind(this)
    );
    router.get('/', this.getMatchedTransactions.bind(this));

    return router;
  }

  /**
   * Matches the given bank transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  private async matchBankTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { transactionId } = req.params;
    const matchTransactionDTO = this.matchedBodyData(
      req
    ) as IMatchTransactionDTO;

    try {
      await this.bankTransactionsMatchingApp.matchTransaction(
        tenantId,
        transactionId,
        matchTransactionDTO
      );
      return res.status(200).send({
        message: 'The bank transaction has been matched.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  private async unmatchMatchedBankTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const transactionId = req.params?.transactionId;

    try {
      await this.bankTransactionsMatchingApp.unmatchMatchedTransaction(
        tenantId,
        transactionId
      );

      return res.status(200).send({
        message: 'The bank matched transaction has been unmatched.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the matched transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async getMatchedTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req) as GetMatchedTransactionsFilter;

    console.log('test');

    try {
      const matchedTransactions =
        await this.bankTransactionsMatchingApp.getMatchedTransactions(
          tenantId,
          filter
        );

      return res.status(200).send({ data: matchedTransactions });
    } catch (error) {
      next(error);
    }
  }
}
