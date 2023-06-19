import { Service, Inject } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { check, param } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import TransactionsLockingService from '@/services/TransactionsLocking/CommandTransactionsLockingService';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, AccountAction } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import QueryTransactionsLocking from '@/services/TransactionsLocking/QueryTransactionsLocking';

@Service()
export default class TransactionsLockingController extends BaseController {
  @Inject()
  private transactionsLockingService: TransactionsLockingService;

  @Inject()
  private queryTransactionsLocking: QueryTransactionsLocking;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.put(
      '/lock',
      CheckPolicies(AccountAction.TransactionsLocking, AbilitySubject.Account),
      [
        check('module')
          .exists()
          .isIn(['all', 'sales', 'purchases', 'financial']),
        check('lock_to_date').exists().isISO8601().toDate(),
        check('reason').exists().trim(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.commandTransactionsLocking),
      this.handleServiceErrors
    );
    router.put(
      '/cancel-lock',
      CheckPolicies(AccountAction.TransactionsLocking, AbilitySubject.Account),
      [check('module').exists(), check('reason').exists().trim()],
      this.validationResult,
      this.asyncMiddleware(this.cancelTransactionsLocking),
      this.handleServiceErrors
    );
    router.put(
      '/unlock-partial',
      CheckPolicies(AccountAction.TransactionsLocking, AbilitySubject.Account),
      [
        check('module').exists(),
        check('unlock_from_date').exists().isISO8601().toDate(),
        check('unlock_to_date').exists().isISO8601().toDate(),
        check('reason').exists().trim(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.unlockTransactionsLockingBetweenPeriod),
      this.handleServiceErrors
    );
    router.put(
      '/cancel-unlock-partial',
      CheckPolicies(AccountAction.TransactionsLocking, AbilitySubject.Account),
      [
        check('module').exists(),
        check('reason').optional({ nullable: true }).trim(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.cancelPartialUnlocking),
      this.handleServiceErrors
    );
    router.get(
      '/',
      this.validationResult,
      this.asyncMiddleware(this.getTransactionLockingMetaList),
      this.handleServiceErrors
    );
    router.get(
      '/:module',
      [param('module').exists()],
      this.validationResult,
      this.asyncMiddleware(this.getTransactionLockingMeta),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Retrieve accounts types list.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   * @return {Response}
   */
  private commandTransactionsLocking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { module, ...allTransactionsDTO } = this.matchedBodyData(req);

    try {
      const transactionMeta =
        await this.transactionsLockingService.commandTransactionsLocking(
          tenantId,
          module,
          allTransactionsDTO
        );
      return res.status(200).send({
        message: 'All transactions locking has been submit successfully.',
        data: transactionMeta,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Unlock transactions locking between the given periods.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private unlockTransactionsLockingBetweenPeriod = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { module, ...unlockDTO } = this.matchedBodyData(req);

    try {
      const transactionMeta =
        await this.transactionsLockingService.unlockTransactionsLockingPartially(
          tenantId,
          module,
          unlockDTO
        );
      return res.status(200).send({
        message:
          'Transactions locking has been unlocked partially successfully.',
        data: transactionMeta,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cancel full transactions locking of the given module.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private cancelTransactionsLocking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { module, ...cancelLockingDTO } = this.matchedBodyData(req);

    try {
      const data =
        await this.transactionsLockingService.cancelTransactionLocking(
          tenantId,
          module,
          cancelLockingDTO
        );
      return res.status(200).send({
        message: 'Transactions locking has been canceled successfully.',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cancel transaction partial unlocking.
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private cancelPartialUnlocking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { module } = this.matchedBodyData(req);

    try {
      const transactionMeta =
        await this.transactionsLockingService.cancelPartialTransactionsUnlock(
          tenantId,
          module
        );
      return res.status(200).send({
        message:
          'Partial transaction unlocking has been canceled successfully.',
        data: transactionMeta,
      });
    } catch (error) {
      next(error);
    }
  };

  private getTransactionLockingMeta = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { module } = req.params;
    const { tenantId } = req;

    try {
      const data =
        await this.queryTransactionsLocking.getTransactionsLockingModuleMeta(
          tenantId,
          module
        );
      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve transactions locking meta list.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getTransactionLockingMetaList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { module } = req.params;
    const { tenantId } = req;

    try {
      const data =
        await this.queryTransactionsLocking.getTransactionsLockingList(
          tenantId
        );

      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle the service errors.
   * @param {Error} error -
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private handleServiceErrors = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (error instanceof ServiceError) {
      if (error.errorType === 'TRANSACTION_LOCKING_ALL') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'TRANSACTION_LOCKING_ALL', code: 100 }],
        });
      }
      if (error.errorType === 'TRANSACTIONS_LOCKING_MODULE_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'TRANSACTIONS_LOCKING_MODULE_NOT_FOUND', code: 100 },
          ],
        });
      }
    }
    next(error);
  };
}
