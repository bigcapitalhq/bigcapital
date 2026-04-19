import { difference } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateBudgetDto, EditBudgetDto } from '../dtos/CreateBudget.dto';
import { ERRORS } from '../constants';
import { Budget } from '../models/Budget.model';

@Injectable()
export class BudgetValidators {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  public validateStartDateBeforeEndDate(dto: CreateBudgetDto | EditBudgetDto) {
    if (new Date(dto.startDate) >= new Date(dto.endDate)) {
      throw new ServiceError(ERRORS.START_DATE_AFTER_END_DATE);
    }
  }

  public async validateEntriesAccountsExist(
    dto: CreateBudgetDto | EditBudgetDto,
  ) {
    const accountsIds = dto.entries.map((e) => e.accountId);
    const accounts = await this.accountModel()
      .query()
      .whereIn('id', accountsIds);

    const storedAccountsIds = accounts.map((a) => a.id);
    const missingIds = difference(accountsIds, storedAccountsIds);

    if (missingIds.length > 0) {
      throw new ServiceError(ERRORS.ENTRIES_ACCOUNTS_NOT_FOUND);
    }
  }

  public validateNotActive(budget: Budget) {
    if (budget.isActive) {
      throw new ServiceError(ERRORS.BUDGET_ACTIVE_CANNOT_EDIT);
    }
  }

  public validateNotClosed(budget: Budget) {
    if (budget.isClosed) {
      throw new ServiceError(ERRORS.BUDGET_CLOSED_CANNOT_EDIT);
    }
  }

  public validateCanDelete(budget: Budget) {
    if (budget.isActive) {
      throw new ServiceError(ERRORS.BUDGET_ACTIVE_CANNOT_DELETE);
    }
    if (budget.isClosed) {
      throw new ServiceError(ERRORS.BUDGET_CLOSED_CANNOT_DELETE);
    }
  }

  public validateCanActivate(budget: Budget) {
    if (budget.isActive) {
      throw new ServiceError(ERRORS.BUDGET_ALREADY_ACTIVE);
    }
    if (budget.isClosed) {
      throw new ServiceError(ERRORS.BUDGET_DRAFT_ONLY_ACTIVATE);
    }
  }

  public validateCanClose(budget: Budget) {
    if (budget.isClosed) {
      throw new ServiceError(ERRORS.BUDGET_ALREADY_CLOSED);
    }
    if (budget.isDraft) {
      throw new ServiceError(ERRORS.BUDGET_ACTIVE_ONLY_CLOSE);
    }
  }
}
