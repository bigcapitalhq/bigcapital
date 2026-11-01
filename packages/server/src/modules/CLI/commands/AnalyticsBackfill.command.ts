import { Command, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from './BaseCommand';
import { LedgerAnalyticsSyncService } from '@/modules/Analytics/services/LedgerAnalyticsSync.service';
import { ClickHouseSchemaService } from '@/modules/Analytics/services/ClickHouseSchema.service';

interface AnalyticsBackfillOptions {
  organization?: string;
}

@Injectable()
@Command({
  name: 'analytics:backfill',
  description:
    'Backfill the ClickHouse analytics store with the ledger data of all the initialized tenant databases (or a specific organization with --organization).',
})
export class AnalyticsBackfillCommand extends BaseCommand {
  constructor(
    configService: ConfigService,
    private readonly ledgerAnalyticsSync: LedgerAnalyticsSyncService,
    private readonly clickHouseSchema: ClickHouseSchemaService,
  ) {
    super(configService);
  }

  @Option({
    flags: '-o, --organization <organizationId>',
    description: 'Rebuild the data of a specific organization only.',
  })
  parseOrganization(val: string): string {
    return val;
  }

  async run(
    _passedParams: string[],
    options: AnalyticsBackfillOptions,
  ): Promise<void> {
    try {
      if (!this.clickHouseSchema.isEnabled()) {
        this.exit('ClickHouse is not enabled. Set CLICKHOUSE_ENABLED=true.');
      }

      await this.clickHouseSchema.ensureDatabase();
      await this.clickHouseSchema.ensureTables();

      if (options.organization) {
        this.log(`Rebuilding the organization ${options.organization}...`);
        await this.ledgerAnalyticsSync.rebuildOrganization(
          options.organization,
        );
        this.success(
          `Organization ${options.organization} has been backfilled successfully.`,
        );
      }
      const sysKnex = this.initSystemKnex();
      const tenants = await this.getAllInitializedTenants(sysKnex);
      await sysKnex.destroy();

      this.log(`Backfilling ${tenants.length} organizations...`);

      let failures = 0;
      for (const tenant of tenants) {
        this.log(`Rebuilding the organization ${tenant.organizationId}...`);
        try {
          await this.ledgerAnalyticsSync.rebuildOrganization(
            tenant.organizationId,
          );
        } catch (error) {
          failures += 1;
          this.log(
            `Failed to rebuild the organization ${tenant.organizationId}: ${error.message}`,
          );
        }
      }
      if (failures > 0) {
        this.exit(
          `${failures} of ${tenants.length} organizations have failed to backfill.`,
        );
      }
      this.success(
        `${tenants.length} organizations have been backfilled successfully.`,
      );
    } catch (error) {
      this.exit(error);
    }
  }
}
