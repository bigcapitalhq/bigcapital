import knex from 'knex';
import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { TENANCY_DB_CONNECTION } from './TenancyDB.constants';
import { UnitOfWork } from './UnitOfWork.service';
import { knexSnakeCaseMappers } from 'objection';
import { ClsService } from 'nestjs-cls';

const connectionFactory = {
  provide: TENANCY_DB_CONNECTION,
  scope: Scope.REQUEST,
  useFactory: async (
    request: Request,
    configService: ConfigService,
    cls: ClsService,
  ) => {
    const organizationId = cls.get('organizationId');

    return knex({
      client: configService.get('tenantDatabase.client'),
      connection: {
        host: configService.get('tenantDatabase.host'),
        user: configService.get('tenantDatabase.user'),
        password: configService.get('tenantDatabase.password'),
        database: `bigcapital_tenant_${organizationId}`,
        charset: 'utf8',
      },
      migrations: {
        directory: configService.get('tenantDatabase.migrationDir'),
      },
      seeds: {
        directory: configService.get('tenantDatabase.seedsDir'),
      },
      pool: { min: 0, max: 7 },
      ...knexSnakeCaseMappers({ upperCase: true }),
    });
  },
  inject: [REQUEST, ConfigService, ClsService],
};

@Global()
@Module({
  providers: [connectionFactory, UnitOfWork],
  exports: [TENANCY_DB_CONNECTION, UnitOfWork],
})
export class TenancyDatabaseModule {}
