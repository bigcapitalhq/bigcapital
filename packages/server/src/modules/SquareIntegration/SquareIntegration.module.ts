import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SquareIntegrationController } from './SquareIntegration.controller';
import { SquareWebhookController } from './webhook/SquareWebhook.controller';
import { SquareIntegrationApplication } from './SquareIntegrationApplication.service';
import { HandleSquareOAuthCallback } from './commands/HandleSquareOAuthCallback.service';
import { EnsureSquareApplicationWebhook } from './commands/EnsureSquareApplicationWebhook.service';
import { EnsureSquareSystemItems } from './commands/EnsureSquareSystemItems.service';
import { UpsertSquareMerchantIndex } from './commands/UpsertSquareMerchantIndex.service';
import { SquareDocumentLinks } from './commands/SquareDocumentLinks.service';
import { ResolveBigcapitalCustomer } from './commands/ResolveBigcapitalCustomer.service';
import { HandleSquarePayment } from './commands/HandleSquarePayment.service';
import { UpdateSquareConnectionSettings } from './commands/UpdateSquareConnectionSettings.service';
import { DisconnectSquareConnection } from './commands/DisconnectSquareConnection.service';
import { UpsertSquareItemMapping } from './commands/UpsertSquareItemMapping.service';
import { GetSquareConnections } from './queries/GetSquareConnections.service';
import { GetSquareCatalogItems } from './queries/GetSquareCatalogItems.service';
import { GetSquareLocations } from './queries/GetSquareLocations.service';
import { GetSquareEventLog } from './queries/GetSquareEventLog.service';
import { SquareApiClient } from './utils/SquareApiClient.service';
import { TokenEncryption } from './utils/TokenEncryption.service';
import { VerifySquareSignature } from './utils/VerifySquareSignature.service';
import { SquareEventRouter } from './webhook/SquareEventRouter.service';
import { SquareApplicationWebhook } from './models/SquareApplicationWebhook.model';
import { SquareMerchantIndex } from './models/SquareMerchantIndex.model';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { ItemsModule } from '../Items/Items.module';
import { CustomersModule } from '../Customers/Customers.module';
import { SaleReceiptsModule } from '../SaleReceipts/SaleReceipts.module';
import { ManualJournalsModule } from '../ManualJournals/ManualJournals.module';

const systemModels = [
  InjectSystemModel(SquareApplicationWebhook),
  InjectSystemModel(SquareMerchantIndex),
];

@Module({
  imports: [
    TenancyModule,
    // Phase-2 handlers reach into these modules to create real
    // accounting documents (auto-created system Item, auto-created
    // Customers, SaleReceipts for payments, ManualJournals for tip
    // splits / payouts). Each of those modules now exports its
    // create-service.
    ItemsModule,
    CustomersModule,
    SaleReceiptsModule,
    ManualJournalsModule,
    // Re-register JwtModule with the same algorithm/secret as AuthModule so
    // we can sign + verify the short-lived OAuth `state` token. AuthModule
    // does not re-export JwtModule, so we configure it locally rather than
    // importing AuthModule (which would pull in the full auth graph).
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { algorithm: 'HS384' },
        verifyOptions: { algorithms: ['HS384'] },
      }),
    }),
  ],
  controllers: [SquareIntegrationController, SquareWebhookController],
  providers: [
    ...systemModels,
    SquareIntegrationApplication,
    HandleSquareOAuthCallback,
    EnsureSquareApplicationWebhook,
    EnsureSquareSystemItems,
    UpsertSquareMerchantIndex,
    SquareDocumentLinks,
    ResolveBigcapitalCustomer,
    HandleSquarePayment,
    UpdateSquareConnectionSettings,
    DisconnectSquareConnection,
    UpsertSquareItemMapping,
    GetSquareConnections,
    GetSquareCatalogItems,
    GetSquareLocations,
    GetSquareEventLog,
    SquareApiClient,
    TokenEncryption,
    VerifySquareSignature,
    SquareEventRouter,
  ],
  exports: [SquareIntegrationApplication, SquareApiClient, TokenEncryption],
})
export class SquareIntegrationModule {}
