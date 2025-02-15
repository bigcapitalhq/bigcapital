import knex from 'knex';
import { Global, Module } from '@nestjs/common';
import { knexSnakeCaseMappers } from 'objection';
import { ClsModule, ClsService } from 'nestjs-cls';
import { ConfigService } from '@nestjs/config';
import { TENANCY_DB_CONNECTION } from './TenancyDB.constants';
import { UnitOfWork } from './UnitOfWork.service';

export const TenancyDatabaseProxyProvider = ClsModule.forFeatureAsync({
  provide: TENANCY_DB_CONNECTION,
  global: true,
  strict: true,
  inject: [ConfigService, ClsService],
  useFactory: async (configService: ConfigService, cls: ClsService) => () => {
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
  type: 'function',
});

@Global()
@Module({
  imports: [TenancyDatabaseProxyProvider],
  providers: [UnitOfWork],
  exports: [UnitOfWork],
})
export class TenancyDatabaseModule {}
