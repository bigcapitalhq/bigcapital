import { Inject, Service } from 'typedi';
import { body, param } from 'express-validator';
import { NextFunction, Request, Response, Router } from 'express';
import BaseController from '@/api/controllers/BaseController';
import { MatchBankTransactionsApplication } from '@/services/Banking/Matching/MatchBankTransactionsApplication';

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
      '/unmatch/:transactionId',
      [param('transactionId').exists()],
      this.validationResult,
      this.unmatchMatchedBankTransaction.bind(this)
    );
    router.post(
      '/match',
      [
        body('uncategorizedTransactions').exists().isArray({ min: 1 }),
        body('uncategorizedTransactions.*').isNumeric().toInt(),

        body('matchedTransactions').isArray({ min: 1 }),
        body('matchedTransactions.*.reference_type').exists(),
        body('matchedTransactions.*.reference_id').isNumeric().toInt(),
      ],
      this.validationResult,
      this.matchBankTransaction.bind(this)
    );
    return router;
  }

  /**
   * Matches the given bank transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|null>}
   */
  private async matchBankTransaction(
    req: Request<{ transactionId: number }>,
    res: Response,
    next: NextFunction
  ): Promise<Response | null> {
    const { tenantId } = req;
    const bodyData = this.matchedBodyData(req);

    const uncategorizedTransactions = bodyData?.uncategorizedTransactions;
    const matchedTransactions = bodyData?.matchedTransactions;

    try {
      await this.bankTransactionsMatchingApp.matchTransaction(
        tenantId,
        uncategorizedTransactions,
        matchedTransactions
      );
      return res.status(200).send({
        ids: uncategorizedTransactions,
        message: 'The bank transaction has been matched.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unmatches the matched bank transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|null>}
   */
  private async unmatchMatchedBankTransaction(
    req: Request<{ transactionId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { transactionId } = req.params;

    try {
      await this.bankTransactionsMatchingApp.unmatchMatchedTransaction(
        tenantId,
        transactionId
      );
      return res.status(200).send({
        id: transactionId,
        message: 'The bank matched transaction has been unmatched.',
      });
    } catch (error) {
      next(error);
    }
  }
}
