import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteExpense } from './commands/DeleteExpense.service';

@Injectable()
export class ValidateBulkDeleteExpensesService {
  constructor(
    private readonly deleteExpenseService: DeleteExpense,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) { }

  public async validateBulkDeleteExpenses(expenseIds: number[]): Promise<{
    deletableCount: number;
    nonDeletableCount: number;
    deletableIds: number[];
    nonDeletableIds: number[];
  }> {
    const trx = await this.tenantKnex().transaction({
      isolationLevel: 'read uncommitted',
    });

    try {
      const deletableIds: number[] = [];
      const nonDeletableIds: number[] = [];

      for (const expenseId of expenseIds) {
        try {
          await this.deleteExpenseService.deleteExpense(expenseId, trx);
          deletableIds.push(expenseId);
        } catch (error) {
          nonDeletableIds.push(expenseId);
        }
      }

      await trx.rollback();

      return {
        deletableCount: deletableIds.length,
        nonDeletableCount: nonDeletableIds.length,
        deletableIds,
        nonDeletableIds,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

