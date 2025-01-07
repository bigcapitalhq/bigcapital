import { Knex } from 'knex';
import { Inject } from '@nestjs/common';
import { TenantRepository } from '@/common/repository/TenantRepository';
import { TENANCY_DB_CONNECTION } from '@/modules/Tenancy/TenancyDB/TenancyDB.constants';
import { Setting } from '../models/Setting';

export class SettingRepository extends TenantRepository {
  constructor(
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: Knex,
  ) {
    super();
  }

  /**
   * Gets the repository's model.
   */
  get model(): typeof Setting {
    return Setting.bindKnex(this.tenantKnex);
  }
}
