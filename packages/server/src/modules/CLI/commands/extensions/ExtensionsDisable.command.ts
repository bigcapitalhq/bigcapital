import { Command, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from '../BaseCommand';

interface ExtensionsDisableOptions {
  id?: string;
  tenant_id?: string;
}

@Injectable()
@Command({
  name: 'extensions:disable',
  description:
    'Disable an extension for an organization without deleting its data.',
})
export class ExtensionsDisableCommand extends BaseCommand {
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
    options: ExtensionsDisableOptions,
  ): Promise<void> {
    try {
      if (!options.id || !options.tenant_id) {
        this.exit('Both --id and --tenant_id are required.');
      }

      const systemKnex = this.initSystemKnex();
      const existing = await systemKnex('extension_tenants')
        .where({
          extensionId: options.id,
          organizationId: options.tenant_id,
        })
        .first();

      if (!existing) {
        this.exit(
          `Extension "${options.id}" is not configured for organization "${options.tenant_id}".`,
        );
      }

      const now = new Date();

      await systemKnex('extension_tenants')
        .where({
          extensionId: options.id,
          organizationId: options.tenant_id,
        })
        .update({
          status: 'disabled',
          disabledAt: now,
          updatedAt: now,
        });

      this.success(
        `Extension "${options.id}" is disabled for organization "${options.tenant_id}".`,
      );
    } catch (error) {
      this.exit(error);
    }
  }
}
