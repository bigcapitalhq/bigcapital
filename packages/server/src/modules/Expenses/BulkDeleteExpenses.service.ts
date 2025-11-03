import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteExpense } from './commands/DeleteExpense.service';

@Injectable()
export class BulkDeleteExpensesService {
  constructor(private readonly deleteExpenseService: DeleteExpense) {}

  async bulkDeleteExpenses(
    expenseIds: number | Array<number>,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const expensesIds = uniq(castArray(expenseIds));

    const results = await PromisePool.withConcurrency(1)
      .for(expensesIds)
      .process(async (expenseId: number) => {
        await this.deleteExpenseService.deleteExpense(expenseId);
      });

    if (results.errors && results.errors.length > 0) {
      throw results.errors[0].raw;
    }
  }
}

