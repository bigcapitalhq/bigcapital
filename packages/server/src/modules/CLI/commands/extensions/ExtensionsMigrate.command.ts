import { Command, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from '../BaseCommand';
import {
  getCatalogExtension,
  migrateCompiledExtension,
} from './extension-cli.helpers';

interface ExtensionsMigrateOptions {
  id?: string;
  tenant_id?: string;
}

@Injectable()
@Command({
  name: 'extensions:migrate',
  description: 'Run the tenant migrations for one extension.',
})
export class ExtensionsMigrateCommand extends BaseCommand {
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
    options: ExtensionsMigrateOptions,
  ): Promise<void> {
    try {
      if (!options.id || !options.tenant_id) {
        this.exit('Both --id and --tenant_id are required.');
      }

      const systemKnex = this.initSystemKnex();
      const catalog = await getCatalogExtension(systemKnex, options.id);

      if (!catalog) {
        this.exit(`Extension "${options.id}" is not installed.`);
      }

      const tenantKnex = this.initTenantKnex(options.tenant_id);
      const result = await migrateCompiledExtension(
        systemKnex,
        tenantKnex,
        options.id,
        options.tenant_id,
      );

      if (result.skipped) {
        this.log('No extension migrations to run.');
      } else {
        this.log(
          `Applied ${result.applied.length} migration(s) in batch ${result.batch}.`,
        );
      }

      await tenantKnex.destroy();
      this.success(
        `Extension "${options.id}" migrations are up to date for organization "${options.tenant_id}".`,
      );
    } catch (error) {
      this.exit(error);
    }
  }
}
