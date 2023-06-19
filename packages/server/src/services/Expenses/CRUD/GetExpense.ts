import { IExpense } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';
import { ExpenseTransformer } from './ExpenseTransformer';

@Service()
export class GetExpense {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve expense details.
   * @param {number} tenantId
   * @param {number} expenseId
   * @return {Promise<IExpense>}
   */
  public async getExpense(
    tenantId: number,
    expenseId: number
  ): Promise<IExpense> {
    const { Expense } = this.tenancy.models(tenantId);

    const expense = await Expense.query()
      .findById(expenseId)
      .withGraphFetched('categories.expenseAccount')
      .withGraphFetched('paymentAccount')
      .withGraphFetched('branch')
      .throwIfNotFound();

    // Transforms expense model to POJO.
    return this.transformer.transform(
      tenantId,
      expense,
      new ExpenseTransformer()
    );
  }
}
