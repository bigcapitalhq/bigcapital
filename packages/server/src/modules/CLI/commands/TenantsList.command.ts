import { Command, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from './BaseCommand';

interface TenantsListOptions {
  all?: boolean;
}

@Injectable()
@Command({
  name: 'tenants:list',
  description: 'Retrieve a list of all system tenants databases.',
})
export class TenantsListCommand extends BaseCommand {
  constructor(configService: ConfigService) {
    super(configService);
  }

  @Option({
    flags: '-a, --all',
    description: 'All tenants even if not initialized.',
  })
  parseAll(val: string): boolean {
    return true;
  }

  async run(passedParams: string[], options: TenantsListOptions): Promise<void> {
    try {
      const sysKnex = this.initSystemKnex();
      const tenants = options.all
        ? await this.getAllSystemTenants(sysKnex)
        : await this.getAllInitializedTenants(sysKnex);

      tenants.forEach((tenant: any) => {
        const dbName = `${this.configService.get('tenantDatabase.dbNamePrefix')}${tenant.organizationId}`;
        console.log(
          `ID: ${tenant.id} | Organization ID: ${tenant.organizationId} | DB Name: ${dbName}`
        );
      });

      this.success('---');
    } catch (error) {
      this.exit(error);
    }
  }
}
