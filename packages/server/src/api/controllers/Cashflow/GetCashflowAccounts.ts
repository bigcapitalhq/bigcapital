import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { param, query } from 'express-validator';
import GetCashflowAccountsService from '@/services/Cashflow/GetCashflowAccountsService';
import BaseController from '../BaseController';
import GetCashflowTransactionsService from '@/services/Cashflow/GetCashflowTransactionsService';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, CashflowAction } from '@/interfaces';

@Service()
export default class GetCashflowAccounts extends BaseController {
  @Inject()
  getCashflowAccountsService: GetCashflowAccountsService;

  @Inject()
  getCashflowTransactionsService: GetCashflowTransactionsService;

  /**
   * Controller router.
   */
  public router() {
    const router = Router();

    router.get(
      '/accounts',
      CheckPolicies(CashflowAction.View, AbilitySubject.Cashflow),
      [
        query('stringified_filter_roles').optional().isJSON(),

        query('column_sort_by').optional(),
        query('sort_order').optional().isIn(['desc', 'asc']),

        query('inactive_mode').optional().isBoolean().toBoolean(),
        query('search_keyword').optional({ nullable: true }).isString().trim(),
      ],
      this.asyncMiddleware(this.getCashflowAccounts),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Retrieve the cashflow accounts.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getCashflowAccounts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    // Filter query.
    const filter = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      inactiveMode: false,
      ...this.matchedQueryData(req),
    };

    try {
      const cashflowAccounts =
        await this.getCashflowAccountsService.getCashflowAccounts(
          tenantId,
          filter
        );

      return res.status(200).send({
        cashflow_accounts: this.transformToResponse(cashflowAccounts),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Catches the service errors.
   * @param {Error} error - Error.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   * @param {NextFunction} next -
   */
  private catchServiceErrors(
    error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
    }
    next(error);
  }
}
