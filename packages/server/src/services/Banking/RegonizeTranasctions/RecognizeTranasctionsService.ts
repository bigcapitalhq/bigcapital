import { Knex } from 'knex';
import UncategorizedCashflowTransaction from '@/models/UncategorizedCashflowTransaction';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { transformToMapBy } from '@/utils';
import { Inject, Service } from 'typedi';
import { PromisePool } from '@supercharge/promise-pool';
import { BankRule } from '@/models/BankRule';
import { bankRulesMatchTransaction } from './_utils';

@Service()
export class RecognizeTranasctionsService {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Marks the uncategorized transaction as recognized from the given bank rule.
   * @param {number} tenantId -
   * @param {BankRule} bankRule -
   * @param {UncategorizedCashflowTransaction} transaction -
   * @param {Knex.Transaction} trx -
   */
  private markBankRuleAsRecognized = async (
    tenantId: number,
    bankRule: BankRule,
    transaction: UncategorizedCashflowTransaction,
    trx?: Knex.Transaction
  ) => {
    const { RecognizedBankTransaction, UncategorizedCashflowTransaction } =
      this.tenancy.models(tenantId);

    const recognizedTransaction = await RecognizedBankTransaction.query(
      trx
    ).insert({
      bankRuleId: bankRule.id,
      uncategorizedTransactionId: transaction.id,
      assignedCategory: bankRule.assignCategory,
      assignedAccountId: bankRule.assignAccountId,
      assignedPayee: bankRule.assignPayee,
      assignedMemo: bankRule.assignMemo,
    });
    await UncategorizedCashflowTransaction.query(trx)
      .findById(transaction.id)
      .patch({
        recognizedTransactionId: recognizedTransaction.id,
      });
  };

  /**
   * Regonized the uncategorized transactions.
   * @param {number} tenantId -
   * @param {Knex.Transaction} trx -
   */
  public async recognizeTransactions(
    tenantId: number,
    batch: string = '',
    trx?: Knex.Transaction
  ) {
    const { UncategorizedCashflowTransaction, BankRule } =
      this.tenancy.models(tenantId);

    const uncategorizedTranasctions =
      await UncategorizedCashflowTransaction.query().onBuild((query) => {
        query.where('recognized_transaction_id', null);
        query.where('categorized', false);

        if (batch) query.where('batch', batch);
      });
    const bankRules = await BankRule.query().withGraphFetched('conditions');
    const bankRulesByAccountId = transformToMapBy(
      bankRules,
      'applyIfAccountId'
    );
    // Try to recognize the transaction.
    const regonizeTransaction = async (
      transaction: UncategorizedCashflowTransaction
    ) => {
      const allAccountsBankRules = bankRulesByAccountId.get(`null`);
      const accountBankRules = bankRulesByAccountId.get(
        `${transaction.accountId}`
      );
      const recognizedBankRule = bankRulesMatchTransaction(
        transaction,
        accountBankRules
      );
      if (recognizedBankRule) {
        await this.markBankRuleAsRecognized(
          tenantId,
          recognizedBankRule,
          transaction,
          trx
        );
      }
    };
    const result = await PromisePool.withConcurrency(MIGRATION_CONCURRENCY)
      .for(uncategorizedTranasctions)
      .process((transaction: UncategorizedCashflowTransaction, index, pool) => {
        return regonizeTransaction(transaction);
      });
  }

  /**
   *
   * @param {number} uncategorizedTransaction
   */
  public async regonizeTransaction(
    uncategorizedTransaction: UncategorizedCashflowTransaction
  ) {}
}

const MIGRATION_CONCURRENCY = 10;
