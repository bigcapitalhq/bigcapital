import { Command, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from '../BaseCommand';

interface ExtensionsListOptions {
  tenant_id?: string;
}

@Injectable()
@Command({
  name: 'extensions:list',
  description:
    'List installed extensions and their per-tenant enablement status.',
})
export class ExtensionsListCommand extends BaseCommand {
  constructor(configService: ConfigService) {
    super(configService);
  }

  @Option({
    flags: '-t, --tenant_id [tenant_id]',
    description: 'Only show the status for one organization id.',
  })
  parseTenantId(val: string): string {
    return val;
  }

  async run(
    _passedParams: string[],
    options: ExtensionsListOptions,
  ): Promise<void> {
    try {
      const systemKnex = this.initSystemKnex();
      const extensions = await systemKnex('extensions').orderBy('name');
      const tenantRecords = options.tenant_id
        ? await systemKnex('extension_tenants').where({
            organizationId: options.tenant_id,
          })
        : await systemKnex('extension_tenants');

      const byExtension = new Map<string, any[]>();

      tenantRecords.forEach((record: any) => {
        const current = byExtension.get(record.extensionId) ?? [];
        current.push(record);
        byExtension.set(record.extensionId, current);
      });

      if (extensions.length === 0) {
        this.log('No extensions are installed.');
        this.success('---');
      }

      extensions.forEach((extension: any) => {
        const records = byExtension.get(extension.extensionId) ?? [];

        this.log(
          `${extension.extensionId}@${extension.version} | trust: ${extension.trust} | status: ${extension.status}`,
        );

        if (records.length === 0) {
          this.log('  tenants: (none)');
          return;
        }

        records.forEach((record: any) => {
          this.log(
            `  tenant: ${record.organizationId} | status: ${record.status} | version: ${record.version}${
              record.lastError ? ` | error: ${record.lastError}` : ''
            }`,
          );
        });
      });

      this.success('---');
    } catch (error) {
      this.exit(error);
    }
  }
}
