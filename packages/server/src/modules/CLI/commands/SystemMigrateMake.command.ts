import { Command } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from './BaseCommand';

@Injectable()
@Command({
  name: 'system:migrate:make',
  description: 'Create a named migration file to the system database.',
  arguments: '<name>',
})
export class SystemMigrateMakeCommand extends BaseCommand {
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
      const sysKnex = this.initSystemKnex();
      const migrationName = await sysKnex.migrate.make(name);
      this.success(`Created Migration: ${migrationName}`);
    } catch (error) {
      this.exit(error);
    }
  }
}
