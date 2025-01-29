import { ModelObject } from 'objection';
import moment from 'moment';
import * as R from 'ramda';
import {
  ICashFlowStatementQuery,
  ICashFlowStatementDOO,
} from './Cashflow.types';
import CashFlowStatement from './CashFlow';
import { CashflowSheetMeta } from './CashflowSheetMeta';
import { Injectable } from '@nestjs/common';
import { CashFlowRepository } from './CashFlowRepository';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { Ledger } from '@/modules/Ledger/Ledger';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { I18nService } from 'nestjs-i18n';
import { getDefaultCashflowQuery } from './constants';

@Injectable()
export class CashFlowStatementService {
  /**
   * @param {CashFlowRepository} cashFlowRepo - Cash flow repository.
   * @param {CashflowSheetMeta} cashflowSheetMeta - Cashflow sheet meta.
   * @param {TenancyContext} tenancyContext - Tenancy context.
   */
  constructor(
    private readonly cashFlowRepo: CashFlowRepository,
    private readonly cashflowSheetMeta: CashflowSheetMeta,
    private readonly tenancyContext: TenancyContext,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves cash at beginning transactions.
   * @param {ICashFlowStatementQuery} filter - Cash flow statement query.
   * @returns {Promise<ModelObject<AccountTransaction>[]>}
   */
  private async cashAtBeginningTransactions(
    filter: ICashFlowStatementQuery,
  ): Promise<ModelObject<AccountTransaction>[]> {
    const appendPeriodsOperToChain = (trans) =>
      R.append(
        this.cashFlowRepo.cashAtBeginningPeriodTransactions(filter),
        trans,
      );

    const promisesChain = R.pipe(
      R.append(this.cashFlowRepo.cashAtBeginningTotalTransactions(filter)),
      R.when(
        R.always(R.equals(filter.displayColumnsType, 'date_periods')),
        appendPeriodsOperToChain,
      ),
    )([]);
    const promisesResults = await Promise.all(promisesChain);
    const transactions = R.flatten(promisesResults);

    return transactions;
  }

  /**
   * Retrieve the cash flow sheet statement.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<ICashFlowStatementDOO>}
   */
  public async cashFlow(
    query: ICashFlowStatementQuery,
  ): Promise<ICashFlowStatementDOO> {
    // Retrieve all accounts on the storage.
    const accounts = await this.cashFlowRepo.cashFlowAccounts();
    const tenant = await this.tenancyContext.getTenant();

    const filter = {
      ...getDefaultCashflowQuery(),
      ...query,
    };
    // Retrieve the accounts transactions.
    const transactions =
      await this.cashFlowRepo.getAccountsTransactions(filter);
    // Retrieve the net income transactions.
    const netIncome = await this.cashFlowRepo.getNetIncomeTransactions(filter);
    // Retrieve the cash at beginning transactions.
    const cashAtBeginningTransactions =
      await this.cashAtBeginningTransactions(filter);

    // Transformes the transactions to ledgers.
    const ledger = Ledger.fromTransactions(transactions);
    const cashLedger = Ledger.fromTransactions(cashAtBeginningTransactions);
    const netIncomeLedger = Ledger.fromTransactions(netIncome);

    // Cash flow statement.
    const cashFlowInstance = new CashFlowStatement(
      accounts,
      ledger,
      cashLedger,
      netIncomeLedger,
      filter,
      tenant.metadata.baseCurrency,
      this.i18n,
    );
    // Retrieve the cashflow sheet meta.
    const meta = await this.cashflowSheetMeta.meta(filter);

    return {
      data: cashFlowInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
