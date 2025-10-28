import { Command } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from './BaseCommand';

@Injectable()
@Command({
  name: 'system:migrate:latest',
  description: 'Migrate latest migration of the system database.',
})
export class SystemMigrateLatestCommand extends BaseCommand {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async run(): Promise<void> {
    try {
      const sysKnex = this.initSystemKnex();
      const [batchNo, log] = await sysKnex.migrate.latest();

      if (log.length === 0) {
        this.success('Already up to date');
      }

      this.success(
        `Batch ${batchNo} run: ${log.length} migrations`
      );
    } catch (error) {
      this.exit(error);
    }
  }
}
