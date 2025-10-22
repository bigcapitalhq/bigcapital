import { Command } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from './BaseCommand';

@Injectable()
@Command({
  name: 'system:migrate:rollback',
  description: 'Rollback the last batch of system migrations.',
})
export class SystemMigrateRollbackCommand extends BaseCommand {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async run(): Promise<void> {
    try {
      const sysKnex = this.initSystemKnex();
      const [batchNo, _log] = await sysKnex.migrate.rollback();

      if (_log.length === 0) {
        this.success('Already at the base migration');
      }

      this.success(
        `Batch ${batchNo} rolled back: ${_log.length} migrations`
      );
    } catch (error) {
      this.exit(error);
    }
  }
}
