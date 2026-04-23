import { Module } from '@nestjs/common';
import { SquareIntegrationController } from './SquareIntegration.controller';
import { SquareWebhookController } from './webhook/SquareWebhook.controller';
import { SquareIntegrationApplication } from './SquareIntegrationApplication.service';
import { HandleSquareOAuthCallback } from './commands/HandleSquareOAuthCallback.service';
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

@Module({
  controllers: [SquareIntegrationController, SquareWebhookController],
  providers: [
    SquareIntegrationApplication,
    HandleSquareOAuthCallback,
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
