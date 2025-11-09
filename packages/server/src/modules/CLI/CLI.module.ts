import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '../../common/config';
import { CommandRunnerModule } from 'nest-commander';
import { SystemMigrateLatestCommand } from './commands/SystemMigrateLatest.command';
import { SystemMigrateRollbackCommand } from './commands/SystemMigrateRollback.command';
import { SystemMigrateMakeCommand } from './commands/SystemMigrateMake.command';
import { TenantsMigrateLatestCommand } from './commands/TenantsMigrateLatest.command';
import { TenantsMigrateRollbackCommand } from './commands/TenantsMigrateRollback.command';
import { TenantsMigrateMakeCommand } from './commands/TenantsMigrateMake.command';
import { TenantsListCommand } from './commands/TenantsList.command';
import { SystemSeedLatestCommand } from './commands/SystemSeedLatest.command';
import { TenantsSeedLatestCommand } from './commands/TenantsSeedLatest.command';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
    }),
    CommandRunnerModule,
  ],
  providers: [
    SystemMigrateLatestCommand,
    SystemMigrateRollbackCommand,
    SystemMigrateMakeCommand,
    TenantsMigrateLatestCommand,
    TenantsMigrateRollbackCommand,
    TenantsMigrateMakeCommand,
    TenantsListCommand,
    SystemSeedLatestCommand,
    TenantsSeedLatestCommand,
  ],
})
export class CLIModule { }
