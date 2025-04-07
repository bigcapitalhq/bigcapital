import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

export const PLAID_CLIENT = 'PLAID_CLIENT';

@Module({
  providers: [
    {
      provide: PLAID_CLIENT,
      useFactory: (configService: ConfigService) => {
        const configuration = new Configuration({
          basePath: PlaidEnvironments[configService.get('plaid.env')],
          baseOptions: {
            headers: {
              'PLAID-CLIENT-ID': configService.get('plaid.clientId'),
              'PLAID-SECRET': configService.get('plaid.secret'),
              'Plaid-Version': '2020-09-14',
            },
          },
        });
        return new PlaidApi(configuration);
      },
      inject: [ConfigService],
    },
  ],
  exports: [PLAID_CLIENT],
})
export class PlaidModule {}
