import { Command, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from '../BaseCommand';
import {
  getCompiledExtensions,
  migrateCompiledExtension,
} from './extension-cli.helpers';

interface ExtensionsMigrateAllOptions {
  tenant_id?: string;
}

@Injectable()
@Command({
  name: 'extensions:migrate:all',
  description:
    'Run extension tenant migrations for all organizations (or one tenant).',
})
export class ExtensionsMigrateAllCommand extends BaseCommand {
  constructor(configService: ConfigService) {
    super(configService);
  }

  @Option({
    flags: '-t, --tenant_id [tenant_id]',
    description: 'Only migrate the given organization id.',
  })
  parseTenantId(val: string): string {
    return val;
  }

  async run(
    _passedParams: string[],
    options: ExtensionsMigrateAllOptions,
  ): Promise<void> {
    try {
      const systemKnex = this.initSystemKnex();
      const tenants = await this.getAllInitializedTenants(systemKnex);
      const organizationIds = tenants
        .map((tenant: any) => tenant.organizationId)
        .filter(
          (organizationId: string) =>
            !options.tenant_id || organizationId === options.tenant_id,
        );

      if (options.tenant_id && !organizationIds.includes(options.tenant_id)) {
        this.exit(`The given tenant id ${options.tenant_id} does not exist.`);
      }

      const compiled = getCompiledExtensions().filter(
        (extension) => extension.hasMigrations,
      );
      const failures: string[] = [];
      let migrated = 0;

      for (const organizationId of organizationIds) {
        const tenantKnex = this.initTenantKnex(organizationId);
        const records = await systemKnex('extension_tenants')
          .where({ organizationId })
          .whereIn(
            'extensionId',
            compiled.map((extension) => extension.id),
          );

        try {
          for (const record of records) {
            try {
              const result = await migrateCompiledExtension(
                systemKnex,
                tenantKnex,
                record.extensionId,
                organizationId,
              );

              migrated += 1;
              this.log(
                `${organizationId} | ${record.extensionId} | ${
                  result.skipped
                    ? 'no migrations'
                    : `${result.applied.length} migration(s)`
                }`,
              );
            } catch (error) {
              failures.push(
                `${organizationId}/${record.extensionId}: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              );
            }
          }
        } finally {
          await tenantKnex.destroy();
        }
      }

      if (failures.length > 0) {
        failures.forEach((failure) => this.log(`FAILED ${failure}`));
        this.exit(`${failures.length} extension migration(s) failed.`);
      }

      this.success(
        `Extension migrations are up to date (${migrated} tenant extension(s) processed).`,
      );
    } catch (error) {
      this.exit(error);
    }
  }
}
