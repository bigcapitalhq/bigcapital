import { forwardRef, Module } from '@nestjs/common';
import { CreateStripeAccountLinkService } from './CreateStripeAccountLink';
import { CreateStripeAccountService } from './CreateStripeAccountService';
import { StripePaymentApplication } from './StripePaymentApplication';
import { ExchangeStripeOAuthTokenService } from './ExchangeStripeOauthToken';
import { SeedStripeAccountsOnOAuthGrantedSubscriber } from './subscribers/SeedStripeAccounts';
import { StripeWebhooksSubscriber } from './subscribers/StripeWebhooksSubscriber';
import { StripeIntegrationController } from './StripePayment.controller';
import { StripePaymentWebhooksController } from './StripePaymentWebhooks.controller';
import { StripePaymentService } from './StripePaymentService';
import { GetStripeAuthorizationLinkService } from './GetStripeAuthorizationLink';
import { AccountsModule } from '../Accounts/Accounts.module';
import { CreatePaymentReceiveStripePayment } from './CreatePaymentReceivedStripePayment';
import { SaleInvoicesModule } from '../SaleInvoices/SaleInvoices.module';
import { PaymentsReceivedModule } from '../PaymentReceived/PaymentsReceived.module';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Module({
  imports: [
    AccountsModule,
    PaymentsReceivedModule,
    forwardRef(() => SaleInvoicesModule),
  ],
  providers: [
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
  controllers: [StripeIntegrationController, StripePaymentWebhooksController],
})
export class StripePaymentModule { }
