import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ServiceError } from '@/modules/Items/ServiceError';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { BankTransaction } from '@/modules/BankingTransactions/models/BankTransaction';
import { Account } from '@/modules/Accounts/models/Account.model';
import { CommandBankTransactionValidator } from '@/modules/BankingTransactions/commands/CommandCasflowValidator.service';
import { BankTransactionGLEntriesService } from '@/modules/BankingTransactions/commands/BankTransactionGLEntries';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditCategorizeBankTransactionDto } from '../dtos/EditCategorizeBankTransaction.dto';
import { transformCashflowTransactionType } from '@/modules/BankingTransactions/utils';
import { CASHFLOW_TRANSACTION_TYPE } from '@/modules/BankingTransactions/constants';

@Injectable()
export class EditCategorizeBankTransaction {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly commandValidators: CommandBankTransactionValidator,
    private readonly glEntries: BankTransactionGLEntriesService,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,

    @Inject(BankTransaction.name)
    private readonly bankTransactionModel: TenantModelProxy<
      typeof BankTransaction
    >,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) {}

  /**
   * Edits the categorization of a previously categorized bank transaction.
   * Only creditAccountId and description can be changed.
   */
  public async editCategorization(
    uncategorizedTransactionId: number,
    editDTO: EditCategorizeBankTransactionDto,
  ) {
    // Find the uncategorized transaction.
    const uncategorizedTransaction =
      await this.uncategorizedBankTransactionModel()
        .query()
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    // Must be categorized to edit.
    if (!uncategorizedTransaction.categorizeRefId) {
      throw new ServiceError('TRANSACTION_NOT_CATEGORIZED');
    }

    // Find the linked cashflow transaction.
    const cashflowTransaction = await this.bankTransactionModel()
      .query()
      .findById(uncategorizedTransaction.categorizeRefId)
      .throwIfNotFound();

    // If creditAccountId is changing, validate the new account.
    if (
      editDTO.creditAccountId &&
      editDTO.creditAccountId !== cashflowTransaction.creditAccountId
    ) {
      const creditAccount = await this.accountModel()
        .query()
        .findById(editDTO.creditAccountId)
        .throwIfNotFound();

      const transactionType = transformCashflowTransactionType(
        cashflowTransaction.transactionType,
      );
      this.commandValidators.validateCreditAccountWithCashflowType(
        creditAccount,
        transactionType as CASHFLOW_TRANSACTION_TYPE,
      );
    }

    // Build the patch — only include provided fields.
    const patch: Record<string, any> = {};
    if (editDTO.creditAccountId !== undefined) {
      patch.creditAccountId = editDTO.creditAccountId;
    }
    if (editDTO.description !== undefined) {
      patch.description = editDTO.description;
    }

    if (Object.keys(patch).length === 0) {
      return cashflowTransaction;
    }

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Patch the cashflow transaction.
      await this.bankTransactionModel()
        .query(trx)
        .findById(cashflowTransaction.id)
        .patch(patch);

      // If creditAccountId changed, rewrite the journal entries.
      if (editDTO.creditAccountId !== undefined) {
        await this.glEntries.revertJournalEntries(
          cashflowTransaction.id,
          trx,
        );
        await this.glEntries.writeJournalEntries(
          cashflowTransaction.id,
          trx,
        );
      }

      return this.bankTransactionModel()
        .query(trx)
        .findById(cashflowTransaction.id);
    });
  }
}
