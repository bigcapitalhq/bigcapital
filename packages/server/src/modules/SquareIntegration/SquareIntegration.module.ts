import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SquareIntegrationController } from './SquareIntegration.controller';
import { SquareWebhookController } from './webhook/SquareWebhook.controller';
import { SquareIntegrationApplication } from './SquareIntegrationApplication.service';
import { HandleSquareOAuthCallback } from './commands/HandleSquareOAuthCallback.service';
import { RegisterSquareWebhookSubscription } from './commands/RegisterSquareWebhookSubscription.service';
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
import { TenancyModule } from '../Tenancy/Tenancy.module';

@Module({
  imports: [
    TenancyModule,
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
    SquareIntegrationApplication,
    HandleSquareOAuthCallback,
    RegisterSquareWebhookSubscription,
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
