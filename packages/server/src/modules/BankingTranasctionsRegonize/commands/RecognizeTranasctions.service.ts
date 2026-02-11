import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { castArray, isEmpty } from 'lodash';
import { PromisePool } from '@supercharge/promise-pool';
import { bankRulesMatchTransaction } from '../_utils';
import { RecognizeTransactionsCriteria } from '../_types';
import { BankRule } from '@/modules/BankRules/models/BankRule';
import { RecognizedBankTransaction } from '../models/RecognizedBankTransaction';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { transformToMapBy } from '@/utils/transform-to-map-by';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class RecognizeTranasctionsService {
  constructor(
    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedCashflowTransactionModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,

    @Inject(RecognizedBankTransaction.name)
    private readonly recognizedBankTransactionModel: TenantModelProxy<
      typeof RecognizedBankTransaction
    >,

    @Inject(BankRule.name)
    private readonly bankRuleModel: TenantModelProxy<typeof BankRule>,
  ) {}

  /**
   * Marks the uncategorized transaction as recognized from the given bank rule.
   * @param {BankRule} bankRule -
   * @param {UncategorizedCashflowTransaction} transaction -
   * @param {Knex.Transaction} trx -
   */
  private async markBankRuleAsRecognized(
    bankRule: BankRule,
    transaction: UncategorizedBankTransaction,
    trx?: Knex.Transaction,
  ) {
    const recognizedTransaction = await this.recognizedBankTransactionModel()
      .query(trx)
      .insert({
        bankRuleId: bankRule.id,
        uncategorizedTransactionId: transaction.id,
        assignedCategory: bankRule.assignCategory,
        assignedAccountId: bankRule.assignAccountId,
        assignedPayee: bankRule.assignPayee,
        assignedMemo: bankRule.assignMemo,
      });

    await this.uncategorizedCashflowTransactionModel()
      .query(trx)
      .findById(transaction.id)
      .patch({
        recognizedTransactionId: recognizedTransaction.id,
      });
  }

  /**
   * Recognized the uncategorized transactions.
   * @param {number|Array<number>} ruleId - The target rule id/ids.
   * @param {RecognizeTransactionsCriteria}
   * @param {Knex.Transaction} trx -
   */
  public async recognizeTransactions(
    ruleId?: number | Array<number>,
    transactionsCriteria?: RecognizeTransactionsCriteria,
    trx?: Knex.Transaction,
  ) {
    const uncategorizedTranasctions =
      await this.uncategorizedCashflowTransactionModel()
        .query(trx)
        .onBuild((query) => {
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

    const bankRules = await this.bankRuleModel()
      .query(trx)
      .onBuild((q) => {
        const rulesIds = !isEmpty(ruleId) ? castArray(ruleId) : [];

        if (rulesIds?.length > 0) {
          q.whereIn('id', rulesIds);
        }
        q.withGraphFetched('conditions');

        // Order by the 'order' field to ensure higher priority rules (lower order values)
        // are matched first.
        q.orderBy('order', 'asc');
      });

    const bankRulesByAccountId = transformToMapBy(
      bankRules,
      'applyIfAccountId',
    );
    // Try to recognize the transaction.
    const regonizeTransaction = async (
      transaction: UncategorizedBankTransaction,
    ) => {
      const allAccountsBankRules = bankRulesByAccountId.get(`null`);
      const accountBankRules = bankRulesByAccountId.get(
        `${transaction.accountId}`,
      );
      const recognizedBankRule = bankRulesMatchTransaction(
        transaction,
        accountBankRules,
      );
      if (recognizedBankRule) {
        await this.markBankRuleAsRecognized(
          recognizedBankRule,
          transaction,
          trx,
        );
      }
    };
    const result = await PromisePool.withConcurrency(MIGRATION_CONCURRENCY)
      .for(uncategorizedTranasctions)
      .process((transaction: UncategorizedBankTransaction, index, pool) => {
        return regonizeTransaction(transaction);
      });
  }

  /**
   *
   * @param {number} uncategorizedTransaction
   */
  public async regonizeTransaction(
    uncategorizedTransaction: UncategorizedBankTransaction,
  ) {}
}

const MIGRATION_CONCURRENCY = 10;
