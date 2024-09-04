import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { castArray, isEmpty } from 'lodash';
import UncategorizedCashflowTransaction from '@/models/UncategorizedCashflowTransaction';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { transformToMapBy } from '@/utils';
import { PromisePool } from '@supercharge/promise-pool';
import { BankRule } from '@/models/BankRule';
import { bankRulesMatchTransaction } from './_utils';
import { RecognizeTransactionsCriteria } from './_types';

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
   * @param {number|Array<number>} ruleId - The target rule id/ids.
   * @param {RecognizeTransactionsCriteria}
   * @param {Knex.Transaction} trx -
   */
  public async recognizeTransactions(
    tenantId: number,
    ruleId?: number | Array<number>,
    transactionsCriteria?: RecognizeTransactionsCriteria,
    trx?: Knex.Transaction
  ) {
    const { UncategorizedCashflowTransaction, BankRule } =
      this.tenancy.models(tenantId);

    const uncategorizedTranasctions =
      await UncategorizedCashflowTransaction.query(trx).onBuild((query) => {
        query.modify('notRecognized');
        query.modify('notCategorized');

        // Filter the transactions based on the given criteria.
        if (transactionsCriteria?.batch) {
          query.where('batch', transactionsCriteria.batch);
        }
        if (transactionsCriteria?.accountId) {
          query.where('accountId', transactionsCriteria.accountId);
        }
      });

    const bankRules = await BankRule.query(trx).onBuild((q) => {
      const rulesIds = !isEmpty(ruleId) ? castArray(ruleId) : [];

      if (rulesIds?.length > 0) {
        q.whereIn('id', rulesIds);
      }
      q.withGraphFetched('conditions');
    });

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
