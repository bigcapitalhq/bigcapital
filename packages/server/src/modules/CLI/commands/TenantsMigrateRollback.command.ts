import { Command, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromisePool } from '@supercharge/promise-pool';
import { BaseCommand } from './BaseCommand';

interface TenantsMigrateRollbackOptions {
  tenant_id?: string;
}

@Injectable()
@Command({
  name: 'tenants:migrate:rollback',
  description: 'Rollback the last batch of tenants migrations.',
})
export class TenantsMigrateRollbackCommand extends BaseCommand {
  private readonly MIGRATION_CONCURRENCY = 10;

  constructor(configService: ConfigService) {
    super(configService);
  }

  @Option({
    flags: '-t, --tenant_id [tenant_id]',
    description: 'Which organization id do you migrate.',
  })
  parseTenantId(val: string): string {
    return val;
  }

  async run(passedParams: string[], options: TenantsMigrateRollbackOptions): Promise<void> {
    try {
      const sysKnex = this.initSystemKnex();
      const tenants = await this.getAllInitializedTenants(sysKnex);
      const tenantsOrgsIds = tenants.map((tenant: any) => tenant.organizationId);

      if (options.tenant_id && tenantsOrgsIds.indexOf(options.tenant_id) === -1) {
        this.exit(`The given tenant id ${options.tenant_id} does not exist.`);
      }

      const migrateTenant = async (organizationId: string) => {
        try {
          const tenantKnex = this.initTenantKnex(organizationId);
          const [batchNo, _log] = await tenantKnex.migrate.rollback();
          const tenantDb = `${this.configService.get('tenantDatabase.dbNamePrefix')}${organizationId}`;

          if (_log.length === 0) {
            this.log('Already at the base migration');
          }

          this.log(
            `Tenant: ${tenantDb} > Batch ${batchNo} rolled back: ${_log.length} migrations`
          );
          this.log('---------------');
        } catch (error) {
          this.exit(error);
        }
      };

      if (!options.tenant_id) {
        await PromisePool.withConcurrency(this.MIGRATION_CONCURRENCY)
          .for(tenants)
          .process((tenant: any) => {
            return migrateTenant(tenant.organizationId);
          });
        this.success('All tenants are rollbacked.');
      } else {
        await migrateTenant(options.tenant_id);
      }
    } catch (error) {
      this.exit(error);
    }
  }
}
