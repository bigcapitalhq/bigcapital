import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { raw } from 'objection';
import { uniq } from 'lodash';
import { Account } from '@/modules/Accounts/models/Account.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { GetBudgetPrefillQueryDto } from '../dtos/GetBudgetPrefillQuery.dto';
import { BudgetPrefillResponseDto } from '../dtos/BudgetResponse.dto';
import { ERRORS } from '../types/Budgets.types';

interface IBudgetActualRow {
  accountId: number;
  month: string;
  credit: number;
  debit: number;
}

@Injectable()
export class GetBudgetPrefill {
  constructor(
    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: TenantModelProxy<
      typeof AccountTransaction
    >,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) {}

  /**
   * Retrieves the budget entries prefilled from the actual amounts of the
   * given source year, aligned to the months of the target budget period.
   * @param {GetBudgetPrefillQueryDto} filterDTO
   * @returns {Promise<BudgetPrefillResponseDto>}
   */
  public getBudgetPrefill = async (
    filterDTO: GetBudgetPrefillQueryDto,
  ): Promise<BudgetPrefillResponseDto> => {
    const targetFromDate = moment(filterDTO.fromDate).startOf('month');
    const targetToDate = moment(filterDTO.toDate).endOf('month');

    if (targetToDate.isBefore(targetFromDate, 'month')) {
      throw new ServiceError(ERRORS.BUDGET_INVALID_DATE_RANGE);
    }

    const targetStartYear = targetFromDate.year();
    const sourceYear = filterDTO.sourceYear ?? targetStartYear - 1;
    const yearsShift = targetStartYear - sourceYear;

    if (yearsShift < 1) {
      throw new ServiceError(ERRORS.BUDGET_PREFILL_INVALID_SOURCE_YEAR);
    }

    // Align the source period to the target period by subtracting the same
    // number of years from each boundary.
    const sourceFromDate = targetFromDate
      .clone()
      .subtract(yearsShift, 'years')
      .startOf('month');
    const sourceToDate = targetToDate
      .clone()
      .subtract(yearsShift, 'years')
      .endOf('month');

    const actualRows = (await this.accountTransactionModel()
      .query()
      .select('accountId')
      .select(raw("DATE_FORMAT(date, '%Y-%m') AS month"))
      .sum('credit AS credit')
      .sum('debit AS debit')
      .where('date', '>=', sourceFromDate.format('YYYY-MM-DD'))
      .where('date', '<=', sourceToDate.format('YYYY-MM-DD'))
      .groupBy('accountId')
      .groupByRaw(
        "DATE_FORMAT(date, '%Y-%m')",
      )) as unknown as IBudgetActualRow[];

    if (actualRows.length === 0) {
      return {
        sourceYear,
        fromDate: targetFromDate.format('YYYY-MM-DD'),
        toDate: targetToDate.format('YYYY-MM-DD'),
        entries: [],
      };
    }

    const accountsIds = uniq(actualRows.map((row) => Number(row.accountId)));
    const accounts = await this.accountModel()
      .query()
      .whereIn('id', accountsIds);
    const accountsMap = new Map(
      accounts.map((account) => [account.id, account]),
    );

    // Aggregates the actual amounts indexed by account ID and target month.
    const amounts = new Map<string, number>();

    actualRows.forEach((row) => {
      const accountId = Number(row.accountId);
      const account = accountsMap.get(accountId);
      if (!account) {
        return;
      }
      const credit = Number(row.credit) || 0;
      const debit = Number(row.debit) || 0;
      const amount =
        account.accountNormal === 'credit' ? credit - debit : debit - credit;

      // Budgeted amounts cannot be negative; months with a net negative
      // actual are treated as zero and left empty.
      if (amount <= 0) {
        return;
      }
      const targetMonth = moment(row.month, 'YYYY-MM')
        .add(yearsShift, 'years')
        .format('YYYY-MM');
      const key = `${accountId}:${targetMonth}`;

      amounts.set(key, (amounts.get(key) ?? 0) + amount);
    });

    const entries = Array.from(amounts.entries())
      .map(([key, amount]) => {
        const [accountId, month] = key.split(':');

        return {
          accountId: Number(accountId),
          date: `${month}-01`,
          amount: Number(amount.toFixed(3)),
        };
      })
      .sort((a, b) =>
        a.date === b.date
          ? a.accountId - b.accountId
          : a.date.localeCompare(b.date),
      );

    return {
      sourceYear,
      fromDate: targetFromDate.format('YYYY-MM-DD'),
      toDate: targetToDate.format('YYYY-MM-DD'),
      entries,
    };
  };
}
