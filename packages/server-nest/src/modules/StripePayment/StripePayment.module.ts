import { Module } from '@nestjs/common';
import { CreateStripeAccountLinkService } from './CreateStripeAccountLink';
import { CreateStripeAccountService } from './CreateStripeAccountService';
import { StripePaymentApplication } from './StripePaymentApplication';
import { ExchangeStripeOAuthTokenService } from './ExchangeStripeOauthToken';
import { PaymentIntegration } from './models/PaymentIntegration.model';
import { SeedStripeAccountsOnOAuthGrantedSubscriber } from './subscribers/SeedStripeAccounts';
import { StripeWebhooksSubscriber } from './subscribers/StripeWebhooksSubscriber';
import { StripeIntegrationController } from './StripePayment.controller';
import { StripePaymentService } from './StripePaymentService';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { GetStripeAuthorizationLinkService } from './GetStripeAuthorizationLink';
import { AccountsModule } from '../Accounts/Accounts.module';
import { CreatePaymentReceiveStripePayment } from './CreatePaymentReceivedStripePayment';
import { SaleInvoicesModule } from '../SaleInvoices/SaleInvoices.module';
import { PaymentsReceivedModule } from '../PaymentReceived/PaymentsReceived.module';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

const models = [InjectSystemModel(PaymentIntegration)];

@Module({
  imports: [AccountsModule, SaleInvoicesModule, PaymentsReceivedModule],
  providers: [
    ...models,
    StripePaymentService,
    GetStripeAuthorizationLinkService,
    CreateStripeAccountLinkService,
    CreateStripeAccountService,
    StripePaymentApplication,
    ExchangeStripeOAuthTokenService,
    CreatePaymentReceiveStripePayment,
    SeedStripeAccountsOnOAuthGrantedSubscriber,
    StripeWebhooksSubscriber,
    TenancyContext,
  ],
  exports: [StripePaymentService, GetStripeAuthorizationLinkService],
  controllers: [StripeIntegrationController],
})
export class StripePaymentModule {}
