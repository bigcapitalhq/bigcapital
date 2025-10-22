import { Command } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from './BaseCommand';

@Injectable()
@Command({
  name: 'tenants:migrate:make',
  description: 'Create a named migration file to the tenants database.',
  arguments: '<name>',
})
export class TenantsMigrateMakeCommand extends BaseCommand {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async run(passedParams: string[]): Promise<void> {
    const [name] = passedParams;

    if (!name) {
      this.exit('Migration name is required');
      return;
    }

    try {
      const tenantKnex = this.initTenantKnex();
      const migrationName = await tenantKnex.migrate.make(name);
      this.success(`Created Migration: ${migrationName}`);
    } catch (error) {
      this.exit(error);
    }
  }
}
