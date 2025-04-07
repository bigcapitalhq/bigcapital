import { Inject, Injectable } from '@nestjs/common';
import { ExpenseTransfromer } from './Expense.transformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Expense } from '../models/Expense.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetExpenseService {
  constructor(
    private readonly transformerService: TransformerInjectable,

    @Inject(Expense.name)
    private readonly expenseModel: TenantModelProxy<typeof Expense>,
  ) {}

  /**
   * Retrieve expense details.
   * @param {number} expenseId
   * @return {Promise<IExpense>}
   */
  public async getExpense(expenseId: number): Promise<Expense> {
    const expense = await this.expenseModel()
      .query()
      .findById(expenseId)
      .withGraphFetched('categories.expenseAccount')
      .withGraphFetched('paymentAccount')
      .withGraphFetched('branch')
      .withGraphFetched('attachments')
      .throwIfNotFound();

    return this.transformerService.transform(expense, new ExpenseTransfromer());
  }
}
