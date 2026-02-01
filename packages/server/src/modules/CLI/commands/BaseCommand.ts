import { CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';

@Injectable()
export abstract class BaseCommand extends CommandRunner {
  constructor(protected readonly configService: ConfigService) {
    super();
  }

  protected initSystemKnex(): any {
    return Knex({
      client: this.configService.get('systemDatabase.client'),
      connection: {
        host: this.configService.get('systemDatabase.host'),
        user: this.configService.get('systemDatabase.user'),
        password: this.configService.get('systemDatabase.password'),
        database: this.configService.get('systemDatabase.databaseName'),
        charset: 'utf8',
      },
      migrations: {
        directory: this.configService.get('systemDatabase.migrationDir'),
        loadExtensions: ['.js'],
      },
      seeds: {
        directory: this.configService.get('systemDatabase.seedsDir'),
      },
      pool: { min: 0, max: 7 },
      ...knexSnakeCaseMappers({ upperCase: true }),
    });
  }

  protected initTenantKnex(organizationId: string = ''): any {
    return Knex({
      client: this.configService.get('tenantDatabase.client'),
      connection: {
        host: this.configService.get('tenantDatabase.host'),
        user: this.configService.get('tenantDatabase.user'),
        password: this.configService.get('tenantDatabase.password'),
        database: `${this.configService.get('tenantDatabase.dbNamePrefix')}${organizationId}`,
        charset: 'utf8',
      },
      migrations: {
        directory: this.configService.get('tenantDatabase.migrationsDir') || './src/database/migrations',
        loadExtensions: ['.js'],
      },
      seeds: {
        directory: this.configService.get('tenantDatabase.seedsDir') || './src/database/seeds/core',
      },
      pool: {
        min: 0,
        max: 5,
      },
      ...knexSnakeCaseMappers({ upperCase: true }),
    });
  }

  protected getAllSystemTenants(knex: any) {
    return knex('tenants');
  }

  protected getAllInitializedTenants(knex: any) {
    return knex('tenants').whereNotNull('initializedAt');
  }

  protected exit(text: any): never {
    if (text instanceof Error) {
      console.error(`Error: ${text.message}\n${text.stack}`);
    } else {
      console.error(`Error: ${text}`);
    }
    process.exit(1);
  }

  protected success(text: string): never {
    console.log(text);
    process.exit(0);
  }

  protected log(text: string): void {
    console.log(text);
  }
}
