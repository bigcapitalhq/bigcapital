import { Command, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from '../BaseCommand';
import {
  ensureTenantRecord,
  getCatalogExtension,
  getCompiledExtension,
  migrateCompiledExtension,
} from './extension-cli.helpers';

interface ExtensionsEnableOptions {
  id?: string;
  tenant_id?: string;
}

@Injectable()
@Command({
  name: 'extensions:enable',
  description:
    'Run an extension tenant migration and enable it for an organization.',
})
export class ExtensionsEnableCommand extends BaseCommand {
  constructor(configService: ConfigService) {
    super(configService);
  }

  @Option({
    flags: '-i, --id <id>',
    description: 'The extension id.',
  })
  parseId(val: string): string {
    return val;
  }

  @Option({
    flags: '-t, --tenant_id <tenant_id>',
    description: 'The organization id.',
  })
  parseTenantId(val: string): string {
    return val;
  }

  async run(
    _passedParams: string[],
    options: ExtensionsEnableOptions,
  ): Promise<void> {
    try {
      if (!options.id || !options.tenant_id) {
        this.exit('Both --id and --tenant_id are required.');
      }

      const systemKnex = this.initSystemKnex();
      const catalog = await getCatalogExtension(systemKnex, options.id);

      if (!catalog) {
        this.exit(
          `Extension "${options.id}" is not installed. Run the server once to sync the catalog.`,
        );
      }

      const compiled = getCompiledExtension(options.id);

      if (!compiled) {
        this.exit(
          `Extension "${options.id}" is not compiled into this deployment.`,
        );
      }

      await ensureTenantRecord(
        systemKnex,
        options.id,
        options.tenant_id,
        compiled.version,
      );

      const tenantKnex = this.initTenantKnex(options.tenant_id);
      const migration = await migrateCompiledExtension(
        systemKnex,
        tenantKnex,
        options.id,
        options.tenant_id,
      );
      const now = new Date();

      await systemKnex('extension_tenants')
        .where({
          extensionId: options.id,
          organizationId: options.tenant_id,
        })
        .update({
          status: 'enabled',
          version: compiled.version,
          enabledAt: now,
          disabledAt: null,
          lastError: null,
          updatedAt: now,
        });

      if (migration.skipped) {
        this.log('No extension migrations to run.');
      } else {
        this.log(
          `Applied ${migration.applied.length} migration(s) in batch ${migration.batch}.`,
        );
      }

      await tenantKnex.destroy();
      this.success(
        `Extension "${options.id}" is enabled for organization "${options.tenant_id}".`,
      );
    } catch (error) {
      this.exit(error);
    }
  }
}
