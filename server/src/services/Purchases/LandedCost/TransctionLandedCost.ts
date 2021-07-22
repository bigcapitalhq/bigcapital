import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { IBill, IExpense, ILandedCostTransaction } from 'interfaces';
import { ServiceError } from 'exceptions';
import BillLandedCost from './BillLandedCost';
import ExpenseLandedCost from './ExpenseLandedCost';
import HasTenancyService from 'services/Tenancy/TenancyService';
import { ERRORS } from './constants';

@Service()
export default class TransactionLandedCost {
  @Inject()
  billLandedCost: BillLandedCost;

  @Inject()
  expenseLandedCost: ExpenseLandedCost;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve the cost transaction code model.
   * @param {number} tenantId - Tenant id.
   * @param {string} transactionType - Transaction type.
   * @returns
   */
  public getModel = (
    tenantId: number,
    transactionType: string
  ): IBill | IExpense => {
    const Models = this.tenancy.models(tenantId);
    const Model = Models[transactionType];

    if (!Model) {
      throw new ServiceError(ERRORS.COST_TYPE_UNDEFINED);
    }
    return Model;
  }

  /**
   * Mappes the given expense or bill transaction to landed cost transaction.
   * @param {string} transactionType - Transaction type.
   * @param {IBill|IExpense} transaction - Expense or bill transaction.
   * @returns {ILandedCostTransaction}
   */
  public transformToLandedCost = (
    transactionType: string,
    transaction: IBill | IExpense
  ): ILandedCostTransaction => {
    return R.compose(
      R.when(
        R.always(transactionType === 'Bill'),
        this.billLandedCost.transformToLandedCost,
      ),
      R.when(
        R.always(transactionType === 'Expense'),
        this.expenseLandedCost.transformToLandedCost,
      ),
    )(transaction);
  }
}
