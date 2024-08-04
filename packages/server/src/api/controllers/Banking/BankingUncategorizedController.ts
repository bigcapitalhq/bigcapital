import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
import { query } from 'express-validator';
import BaseController from '../BaseController';
import { GetAutofillCategorizeTransaction } from '@/services/Banking/RegonizeTranasctions/GetAutofillCategorizeTransaction';

@Service()
export class BankingUncategorizedController extends BaseController {
  @Inject()
  private getAutofillCategorizeTransactionService: GetAutofillCategorizeTransaction;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/autofill',
      [
        query('uncategorizedTransactionIds').isArray({ min: 1 }),
        query('uncategorizedTransactionIds.*').isNumeric().toInt(),
      ],
      this.validationResult,
      this.getAutofillCategorizeTransaction.bind(this)
    );
    return router;
  }

  /**
   * Retrieves the autofill values of the categorize form of the given
   * uncategorized transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | null>}
   */
  public async getAutofillCategorizeTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const uncategorizedTransactionIds = req.query.uncategorizedTransactionIds;

    try {
      const data =
        await this.getAutofillCategorizeTransactionService.getAutofillCategorizeTransaction(
          tenantId,
          uncategorizedTransactionIds
        );
      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  }
}
