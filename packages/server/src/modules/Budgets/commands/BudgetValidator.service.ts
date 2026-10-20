import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { uniq, uniqBy } from 'lodash';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateBudgetDto, EditBudgetDto } from '../dtos/Budget.dto';
import { ERRORS } from '../types/Budgets.types';

@Injectable()
export class BudgetValidator {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) {}

  /**
   * Validates the budget date range.
   * @param {CreateBudgetDto | EditBudgetDto} budgetDTO
   * @throws {ServiceError}
   */
  public validateDateRange = (budgetDTO: CreateBudgetDto | EditBudgetDto) => {
    const fromDate = moment(budgetDTO.fromDate).startOf('month');
    const toDate = moment(budgetDTO.toDate).endOf('month');

    if (toDate.isBefore(fromDate, 'month')) {
      throw new ServiceError(ERRORS.BUDGET_INVALID_DATE_RANGE);
    }
  };

  /**
   * Validates the budget entries dates and uniqueness.
   * @param {CreateBudgetDto | EditBudgetDto} budgetDTO
   * @throws {ServiceError}
   */
  public validateEntries = (budgetDTO: CreateBudgetDto | EditBudgetDto) => {
    const fromDate = moment(budgetDTO.fromDate).startOf('month');
    const toDate = moment(budgetDTO.toDate).endOf('month');

    // Validates the entries dates to be within the budget date range.
    budgetDTO.entries.forEach((entry) => {
      const entryDate = moment(entry.date).startOf('month');

      if (
        entryDate.isBefore(fromDate, 'month') ||
        entryDate.isAfter(toDate, 'month')
      ) {
        throw new ServiceError(ERRORS.BUDGET_ENTRY_DATE_OUT_OF_RANGE);
      }
    });

    // Validates the entries uniqueness by account and month.
    const uniqueEntries = uniqBy(
      budgetDTO.entries,
      (entry) => `${entry.accountId}-${moment(entry.date).format('YYYY-MM')}`,
    );
    if (uniqueEntries.length !== budgetDTO.entries.length) {
      throw new ServiceError(ERRORS.BUDGET_ENTRY_DUPLICATE_DATE);
    }
  };

  /**
   * Validates the budget entries accounts existence.
   * @param {CreateBudgetDto | EditBudgetDto} budgetDTO
   * @throws {ServiceError}
   */
  public validateAccountsExistance = async (
    budgetDTO: CreateBudgetDto | EditBudgetDto,
  ) => {
    const accountsIds = uniq(budgetDTO.entries.map((entry) => entry.accountId));
    if (accountsIds.length === 0) {
      return;
    }
    const accounts = await this.accountModel()
      .query()
      .whereIn('id', accountsIds);
    const accountsIdsFound = accounts.map((account) => account.id);
    const missedAccountsIds = accountsIds.filter(
      (accountId) => !accountsIdsFound.includes(accountId),
    );
    if (missedAccountsIds.length > 0) {
      throw new ServiceError(ERRORS.BUDGET_ENTRIES_ACCOUNT_NOT_FOUND, null, {
        accountsIds: missedAccountsIds,
      });
    }
  };
}
