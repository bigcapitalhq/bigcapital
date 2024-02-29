import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import bluebird from 'bluebird';
import { entries, groupBy } from 'lodash';
import { CreateAccount } from '@/services/Accounts/CreateAccount';
import { PlaidAccount, PlaidTransaction } from '@/interfaces';
import {
  transformPlaidAccountToCreateAccount,
  transformPlaidTrxsToCashflowCreate,
} from './utils';
import NewCashflowTransactionService from '@/services/Cashflow/NewCashflowTransactionService';
import { DeleteCashflowTransaction } from '@/services/Cashflow/DeleteCashflowTransactionService';
import HasTenancyService from '@/services/Tenancy/TenancyService';

const CONCURRENCY_ASYNC = 10;

@Service()
export class PlaidSyncDb {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private createAccountService: CreateAccount;

  @Inject()
  private createCashflowTransactionService: NewCashflowTransactionService;

  @Inject()
  private deleteCashflowTransactionService: DeleteCashflowTransaction;

  /**
   * Syncs the plaid accounts to the system accounts.
   * @param {number} tenantId Tenant ID.
   * @param {PlaidAccount[]} plaidAccounts
   * @returns {Promise<void>}
   */
  public async syncBankAccounts(
    tenantId: number,
    plaidAccounts: PlaidAccount[]
  ): Promise<void> {
    const accountCreateDTOs = R.map(transformPlaidAccountToCreateAccount)(
      plaidAccounts
    );
    await bluebird.map(
      accountCreateDTOs,
      (createAccountDTO: any) =>
        this.createAccountService.createAccount(tenantId, createAccountDTO),
      { concurrency: CONCURRENCY_ASYNC }
    );
  }

  /**
   * Synsc the Plaid transactions to the system GL entries.
   * @param {number} tenantId - Tenant ID.
   * @param {number} plaidAccountId - Plaid account ID.
   * @param {PlaidTransaction[]} plaidTranasctions - Plaid transactions
   */
  public async syncAccountTranactions(
    tenantId: number,
    plaidAccountId: number,
    plaidTranasctions: PlaidTransaction[]
  ): Promise<void> {
    const { Account } = this.tenancy.models(tenantId);

    const cashflowAccount = await Account.query()
      .findOne({ plaidAccountId })
      .throwIfNotFound();

    const openingEquityBalance = await Account.query().findOne(
      'slug',
      'opening-balance-equity'
    );
    // Transformes the Plaid transactions to cashflow create DTOs.
    const transformTransaction = transformPlaidTrxsToCashflowCreate(
      cashflowAccount.id,
      openingEquityBalance.id
    );
    const accountsCashflowDTO = R.map(transformTransaction)(plaidTranasctions);

    // Creating account transaction queue.
    await bluebird.map(
      accountsCashflowDTO,
      (cashflowDTO) =>
        this.createCashflowTransactionService.newCashflowTransaction(
          tenantId,
          cashflowDTO
        ),
      { concurrency: CONCURRENCY_ASYNC }
    );
  }

  /**
   * Syncs the accounts transactions in paraller under controlled concurrency.
   * @param {number} tenantId
   * @param {PlaidTransaction[]} plaidTransactions
   */
  public async syncAccountsTransactions(
    tenantId: number,
    plaidAccountsTransactions: PlaidTransaction[]
  ): Promise<void> {
    const groupedTrnsxByAccountId = entries(
      groupBy(plaidAccountsTransactions, 'account_id')
    );
    await bluebird.map(
      groupedTrnsxByAccountId,
      ([plaidAccountId, plaidTransactions]: [number, PlaidTransaction[]]) => {
        return this.syncAccountTranactions(
          tenantId,
          plaidAccountId,
          plaidTransactions
        );
      },
      { concurrency: CONCURRENCY_ASYNC }
    );
  }

  /**
   * Syncs the removed Plaid transactions ids from the cashflow system transactions.
   * @param {string[]} plaidTransactionsIds - Plaid Transactions IDs.
   */
  public async syncRemoveTransactions(
    tenantId: number,
    plaidTransactionsIds: string[]
  ) {
    const { CashflowTransaction } = this.tenancy.models(tenantId);

    const cashflowTransactions = await CashflowTransaction.query().whereIn(
      'plaidTransactionId',
      plaidTransactionsIds
    );
    const cashflowTransactionsIds = cashflowTransactions.map(
      (trans) => trans.id
    );
    await bluebird.map(
      cashflowTransactionsIds,
      (transactionId: number) =>
        this.deleteCashflowTransactionService.deleteCashflowTransaction(
          tenantId,
          transactionId
        ),
      { concurrency: CONCURRENCY_ASYNC }
    );
  }

  /**
   * Syncs the Plaid item last transaction cursor.
   * @param {number} tenantId - Tenant ID.
   * @param {string} itemId - Plaid item ID.
   * @param {string} lastCursor - Last transaction cursor.
   */
  public async syncTransactionsCursor(
    tenantId: number,
    plaidItemId: string,
    lastCursor: string
  ) {
    const { PlaidItem } = this.tenancy.models(tenantId);

    await PlaidItem.query().findOne({ plaidItemId }).patch({ lastCursor });
  }
}
