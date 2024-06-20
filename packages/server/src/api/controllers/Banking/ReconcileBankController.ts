import { body } from 'express-validator';
import BaseController from '../BaseController';
import { Router } from 'express';
import { Service } from 'typedi';

@Service()
export class BankReconcileController extends BaseController {
  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.post(
      '/',
      [
        body('amount').exists(),
        body('date').exists(),
        body('fromAccountId').exists(),
        body('toAccountId').exists(),
        body('reference').optional({ nullable: true }),
      ],
      this.validationResult,
      this.createBankReconcileTransaction.bind(this)
    );
    return router;
  }

  createBankReconcileTransaction() {}
}
