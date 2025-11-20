import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteAccount } from './DeleteAccount.service';
import { ModelHasRelationsError } from '@/common/exceptions/ModelHasRelations.exception';

@Injectable()
export class ValidateBulkDeleteAccountsService {
  constructor(
    private readonly deleteAccountService: DeleteAccount,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) {}

  /**
   * Validates which accounts from the provided IDs can be deleted.
   * Uses the actual deleteAccount service to validate, ensuring the same validation logic.
   * Uses a transaction that is always rolled back to ensure no database changes.
   * @param {number[]} accountIds - Array of account IDs to validate
   * @returns {Promise<{deletableCount: number, nonDeletableCount: number, deletableIds: number[], nonDeletableIds: number[]}>}
   */
  public async validateBulkDeleteAccounts(accountIds: number[]): Promise<{
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

      for (const accountId of accountIds) {
        try {
          await this.deleteAccountService.deleteAccount(accountId, trx);
          deletableIds.push(accountId);
        } catch (error) {
          if (error instanceof ModelHasRelationsError) {
            nonDeletableIds.push(accountId);
          } else {
            nonDeletableIds.push(accountId);
          }
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

