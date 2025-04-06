// @ts-nocheck
import * as R from 'ramda';
import { FinancialDatePeriods } from '../../common/FinancialDatePeriods';
import { ModelObject } from 'objection';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ILedger } from '@/modules/Ledger/types/Ledger.types';
import { ACCOUNT_PARENT_TYPE } from '@/constants/accounts';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';

export const BalanceSheetRepositoryNetIncome = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends R.pipe(FinancialDatePeriods)(Base) {
    // -----------------------
    // # Net Income
    // -----------------------
    public incomeAccounts: ModelObject<Account>[];
    public incomeAccountsIds: number[];

    public expenseAccounts: ModelObject<Account>[];
    public expenseAccountsIds: number[];

    public incomePeriodsAccountsLedger: ILedger;
    public incomePeriodsOpeningAccountsLedger: ILedger;
    public expensesPeriodsAccountsLedger: ILedger;
    public expensesOpeningAccountLedger: ILedger;

    public incomePPAccountsLedger: ILedger;
    public expensePPAccountsLedger: ILedger;

    public incomePPPeriodsAccountsLedger: ILedger;
    public incomePPPeriodsOpeningAccountLedger: ILedger;
    public expensePPPeriodsAccountsLedger: ILedger;
    public expensePPPeriodsOpeningAccountLedger: ILedger;

    public incomePYTotalAccountsLedger: ILedger;
    public expensePYTotalAccountsLedger: ILedger;

    public incomePYPeriodsAccountsLedger: ILedger;
    public incomePYPeriodsOpeningAccountLedger: ILedger;
    public expensePYPeriodsAccountsLedger: ILedger;
    public expensePYPeriodsOpeningAccountLedger: ILedger;

    /**
     * Async initialize.
     * @returns {Promise<void>}
     */
    public asyncInitializeNetIncome = async () => {
      await this.initAccounts();
      await this.initAccountsTotalLedger();

      // Net Income
      this.initIncomeAccounts();
      this.initExpenseAccounts();

      this.initIncomeTotalLedger();
      this.initExpensesTotalLedger();

      // Date periods
      if (this.query.isDatePeriodsColumnsType()) {
        this.initNetIncomeDatePeriods();
      }
      // Previous Year (PY).
      if (this.query.isPreviousYearActive()) {
        this.initNetIncomePreviousYear();
      }
      // Previous Period (PP).
      if (this.query.isPreviousPeriodActive()) {
        this.initNetIncomePreviousPeriod();
      }
      // Previous Year (PY) / Date Periods.
      if (
        this.query.isPreviousYearActive() &&
        this.query.isDatePeriodsColumnsType()
      ) {
        this.initNetIncomePeriodsPreviewYear();
      }
      // Previous Period (PP) / Date Periods.
      if (
        this.query.isPreviousPeriodActive() &&
        this.query.isDatePeriodsColumnsType()
      ) {
        this.initNetIncomePeriodsPreviousPeriod();
      }
    };

    // ----------------------------
    // # Net Income
    // ----------------------------
    /**
     * Initialize income accounts.
     */
    public initIncomeAccounts = () => {
      const incomeAccounts = this.accountsByParentType.get(
        ACCOUNT_PARENT_TYPE.INCOME,
      );
      const incomeAccountsIds = incomeAccounts.map((a) => a.id);

      this.incomeAccounts = incomeAccounts;
      this.incomeAccountsIds = incomeAccountsIds;
    };

    /**
     * Initialize expense accounts.
     */
    public initExpenseAccounts = () => {
      const expensesAccounts = this.accountsByParentType.get(
        ACCOUNT_PARENT_TYPE.EXPENSE,
      );
      const expensesAccountsIds = expensesAccounts.map((a) => a.id);

      this.expenseAccounts = expensesAccounts;
      this.expenseAccountsIds = expensesAccountsIds;
    };

    /**
     * Initialize the income total ledger.
     */
    public initIncomeTotalLedger = (): void => {
      // Inject to the repository.
      this.incomeLedger = this.totalAccountsLedger.whereAccountsIds(
        this.incomeAccountsIds,
      );
    };

    /**
     * Initialize the expenses total ledger.
     */
    public initExpensesTotalLedger = (): void => {
      this.expensesLedger = this.totalAccountsLedger.whereAccountsIds(
        this.expenseAccountsIds,
      );
    };

    // ----------------------------
    // # Net Income - Date Periods
    // ----------------------------
    /**
     * Initialize the net income date periods.
     */
    public initNetIncomeDatePeriods = () => {
      this.incomePeriodsAccountsLedger =
        this.periodsAccountsLedger.whereAccountsIds(this.incomeAccountsIds);

      this.incomePeriodsOpeningAccountsLedger =
        this.periodsOpeningAccountLedger.whereAccountsIds(
          this.incomeAccountsIds,
        );

      this.expensesPeriodsAccountsLedger =
        this.periodsAccountsLedger.whereAccountsIds(this.expenseAccountsIds);

      this.expensesOpeningAccountLedger =
        this.periodsOpeningAccountLedger.whereAccountsIds(
          this.expenseAccountsIds,
        );
    };

    // ----------------------------
    // # Net Income - Previous Period
    // ----------------------------
    /**
     * Initialize the total net income PP.
     */
    public initNetIncomePreviousPeriod = () => {
      this.incomePPAccountsLedger = this.PPTotalAccountsLedger.whereAccountsIds(
        this.incomeAccountsIds,
      );
      this.expensePPAccountsLedger =
        this.PPTotalAccountsLedger.whereAccountsIds(this.expenseAccountsIds);
    };

    /**
     * Initialize the net income periods of previous period.
     */
    public initNetIncomePeriodsPreviousPeriod = () => {
      this.incomePPPeriodsAccountsLedger =
        this.PPPeriodsAccountsLedger.whereAccountsIds(this.incomeAccountsIds);

      this.incomePPPeriodsOpeningAccountLedger =
        this.PPPeriodsOpeningAccountLedger.whereAccountsIds(
          this.incomeAccountsIds,
        );

      this.expensePPPeriodsAccountsLedger =
        this.PPPeriodsAccountsLedger.whereAccountsIds(this.expenseAccountsIds);

      this.expensePPPeriodsOpeningAccountLedger =
        this.PPPeriodsOpeningAccountLedger.whereAccountsIds(
          this.expenseAccountsIds,
        );
    };

    // ----------------------------
    // # Net Income - Previous Year
    // ----------------------------
    /**
     * Initialize the net income PY total.
     */
    public initNetIncomePreviousYear = () => {
      this.incomePYTotalAccountsLedger =
        this.PYTotalAccountsLedger.whereAccountsIds(this.incomeAccountsIds);

      this.expensePYTotalAccountsLedger =
        this.PYTotalAccountsLedger.whereAccountsIds(this.expenseAccountsIds);
    };

    /**
     * Initialize the net income PY periods.
     */
    public initNetIncomePeriodsPreviewYear = () => {
      this.incomePYPeriodsAccountsLedger =
        this.PYPeriodsAccountsLedger.whereAccountsIds(this.incomeAccountsIds);

      this.incomePYPeriodsOpeningAccountLedger =
        this.PYPeriodsOpeningAccountLedger.whereAccountsIds(
          this.incomeAccountsIds,
        );

      this.expensePYPeriodsAccountsLedger =
        this.PYPeriodsAccountsLedger.whereAccountsIds(this.expenseAccountsIds);

      this.expensePYPeriodsOpeningAccountLedger =
        this.PYPeriodsOpeningAccountLedger.whereAccountsIds(
          this.expenseAccountsIds,
        );
    };
  };
