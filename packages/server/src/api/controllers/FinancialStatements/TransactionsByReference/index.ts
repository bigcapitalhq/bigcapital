import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import TransactionsByReferenceService from '@/services/FinancialStatements/TransactionsByReference';
import { ITransactionsByReferenceTransaction } from '@/interfaces';
@Service()
export default class TransactionsByReferenceController extends BaseController {
  @Inject()
  private transactionsByReferenceService: TransactionsByReferenceService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.validationSchema,
      this.validationResult,
      this.asyncMiddleware(this.transactionsByReference.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  get validationSchema(): ValidationChain[] {
    return [
      query('reference_id').exists().isInt(),
      query('reference_type').exists().isString(),

      query('number_format.precision')
        .optional()
        .isInt({ min: 0, max: 5 })
        .toInt(),
      query('number_format.divide_on_1000').optional().isBoolean().toBoolean(),
      query('number_format.negative_format')
        .optional()
        .isIn(['parentheses', 'mines'])
        .trim()
        .escape(),
    ];
  }

  /**
   * Retrieve transactions by the given reference type and id.
   * @param {Request} req - Request object.
   * @param {Response} res - Response.
   * @param {NextFunction} next
   * @returns
   */
  public async transactionsByReference(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    try {
      const data =
        await this.transactionsByReferenceService.getTransactionsByReference(
          tenantId,
          filter
        );

      return res
        .status(200)
        .send(this.transformToJsonResponse(data.transactions));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Transformes the given report transaction to json response.
   * @param transactions
   * @returns
   */
  private transformToJsonResponse(
    transactions: ITransactionsByReferenceTransaction[]
  ) {
    return {
      transactions: this.transformToResponse(transactions),
    };
  }
}
