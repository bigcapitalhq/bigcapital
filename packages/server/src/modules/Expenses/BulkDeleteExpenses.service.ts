import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteExpense } from './commands/DeleteExpense.service';

@Injectable()
export class BulkDeleteExpensesService {
  constructor(private readonly deleteExpenseService: DeleteExpense) { }

  async bulkDeleteExpenses(
    expenseIds: number | Array<number>,
    options?: { skipUndeletable?: boolean },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const expensesIds = uniq(castArray(expenseIds));

    const results = await PromisePool.withConcurrency(1)
      .for(expensesIds)
      .process(async (expenseId: number) => {
        try {
          await this.deleteExpenseService.deleteExpense(expenseId);
        } catch (error) {
          if (!skipUndeletable) {
            throw error;
          }
        }
      });

    if (!skipUndeletable && results.errors && results.errors.length > 0) {
      throw results.errors[0].raw;
    }
  }
}

