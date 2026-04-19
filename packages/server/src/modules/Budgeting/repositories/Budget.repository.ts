import { Knex } from 'knex';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { TenantRepository } from '@/common/repository/TenantRepository';
import { TENANCY_DB_CONNECTION } from '@/modules/Tenancy/TenancyDB/TenancyDB.constants';
import { Budget } from '../models/Budget.model';

@Injectable({ scope: Scope.REQUEST })
export class BudgetRepository extends TenantRepository {
  constructor(
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantDBKnex: () => Knex,
  ) {
    super();
  }

  get model(): typeof Budget {
    return Budget.bindKnex(this.tenantDBKnex());
  }

  public async findByIdWithEntries(budgetId: number) {
    return this.model
      .query()
      .findById(budgetId)
      .withGraphFetched('entries.account');
  }

  public async findById(budgetId: number) {
    return this.model.query().findById(budgetId);
  }

  public async deleteByIds(budgetIds: number[]) {
    await this.model.query().whereIn('id', budgetIds).delete();
  }

  public async findActiveByIds(budgetIds: number[]) {
    return this.model
      .query()
      .whereIn('id', budgetIds)
      .where('status', 'active');
  }
}
