import Knex from 'knex';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SystemKnexConnection,
  SystemKnexConnectionConfigure,
} from './SystemDB.constants';
import { knexSnakeCaseMappers } from 'objection';

const providers = [
  {
    provide: SystemKnexConnectionConfigure,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      client: configService.get('systemDatabase.client'),
      connection: {
        host: configService.get('systemDatabase.host'),
        user: configService.get('systemDatabase.user'),
        password: configService.get('systemDatabase.password'),
        database: configService.get('systemDatabase.databaseName'),
        charset: 'utf8',
      },
      migrations: {
        directory: configService.get('systemDatabase.migrationDir'),
        loadExtensions: ['.js'],
      },
      seeds: {
        directory: configService.get('systemDatabase.seedsDir'),
      },
      pool: { min: 0, max: 7 },
      ...knexSnakeCaseMappers({ upperCase: true }),
    }),
  },
  {
    provide: SystemKnexConnection,
    inject: [SystemKnexConnectionConfigure],
    useFactory: (knexConfig) => {
      return Knex(knexConfig);
    },
  },
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class SystemDatabaseModule {}
