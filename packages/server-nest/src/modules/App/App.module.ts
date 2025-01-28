import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { join } from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClsModule } from 'nestjs-cls';
import { AppController } from './App.controller';
import { AppService } from './App.service';
import { ItemsModule } from '../Items/items.module';
import { config } from '../../common/config';
import { SystemDatabaseModule } from '../System/SystemDB/SystemDB.module';
import { SystemModelsModule } from '../System/SystemModels/SystemModels.module';
import { JwtStrategy } from '../Auth/Jwt.strategy';
import { jwtConstants } from '../Auth/Auth.constants';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TenancyModelsModule } from '../Tenancy/TenancyModels/Tenancy.module';
import { LoggerMiddleware } from '@/middleware/logger.middleware';
import { ExcludeNullInterceptor } from '@/interceptors/ExcludeNull.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from '../Auth/Jwt.guard';
import { UserIpInterceptor } from '@/interceptors/user-ip.interceptor';
import { TenancyGlobalMiddleware } from '../Tenancy/TenancyGlobal.middleware';
import { TransformerModule } from '../Transformer/Transformer.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { ExpensesModule } from '../Expenses/Expenses.module';
import { ItemCategoryModule } from '../ItemCategories/ItemCategory.module';
import { TaxRatesModule } from '../TaxRates/TaxRate.module';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { SerializeInterceptor } from '@/common/interceptors/serialize.interceptor';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { CustomersModule } from '../Customers/Customers.module';
import { VendorsModule } from '../Vendors/Vendors.module';
import { SaleEstimatesModule } from '../SaleEstimates/SaleEstimates.module';
import { BillsModule } from '../Bills/Bills.module';
import { SaleInvoicesModule } from '../SaleInvoices/SaleInvoices.module';
import { SaleReceiptsModule } from '../SaleReceipts/SaleReceipts.module';
import { ManualJournalsModule } from '../ManualJournals/ManualJournals.module';
import { CreditNotesModule } from '../CreditNotes/CreditNotes.module';
import { VendorCreditsModule } from '../VendorCredit/VendorCredits.module';
import { VendorCreditApplyBillsModule } from '../VendorCreditsApplyBills/VendorCreditApplyBills.module';
import { VendorCreditsRefundModule } from '../VendorCreditsRefund/VendorCreditsRefund.module';
import { CreditNoteRefundsModule } from '../CreditNoteRefunds/CreditNoteRefunds.module';
import { BillPaymentsModule } from '../BillPayments/BillPayments.module';
import { PaymentsReceivedModule } from '../PaymentReceived/PaymentsReceived.module';
import { LedgerModule } from '../Ledger/Ledger.module';
import { BankRulesModule } from '../BankRules/BankRules.module';
import { BankAccountsModule } from '../BankingAccounts/BankAccounts.module';
import { BankingTransactionsExcludeModule } from '../BankingTransactionsExclude/BankingTransactionsExclude.module';
import { BankingTransactionsRegonizeModule } from '../BankingTranasctionsRegonize/BankingTransactionsRegonize.module';
import { BankingMatchingModule } from '../BankingMatching/BankingMatching.module';
import { BankingTransactionsModule } from '../BankingTransactions/BankingTransactions.module';
import { TransactionsLockingModule } from '../TransactionsLocking/TransactionsLocking.module';
import { SettingsModule } from '../Settings/Settings.module';
import { InventoryAdjustmentsModule } from '../InventoryAdjutments/InventoryAdjustments.module';
import { PostHogModule } from '../EventsTracker/postHog.module';
import { EventTrackerModule } from '../EventsTracker/EventTracker.module';
import { MailModule } from '../Mail/Mail.module';
import { FinancialStatementsModule } from '../FinancialStatements/FinancialStatements.module';
import { StripePaymentModule } from '../StripePayment/StripePayment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: config,
      isGlobal: true,
    }),
    SystemDatabaseModule,
    SystemModelsModule,
    EventEmitterModule.forRoot(),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/../../i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        new QueryResolver(),
        new HeaderResolver(),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
    }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('QUEUE_HOST'),
          port: configService.get('QUEUE_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req: Request, res: Response) => {
          cls.set('organizationId', req.headers['organization-id']);
          cls.set('userId', 1);
        },
      },
    }),
    TenancyDatabaseModule,
    TenancyModelsModule,
    ChromiumlyTenancyModule,
    TransformerModule,
    MailModule,
    ItemsModule,
    ItemCategoryModule,
    AccountsModule,
    ExpensesModule,
    TaxRatesModule,
    PdfTemplatesModule,
    BranchesModule,
    WarehousesModule,
    CustomersModule,
    VendorsModule,
    SaleInvoicesModule,
    SaleEstimatesModule,
    SaleReceiptsModule,
    BillsModule,
    ManualJournalsModule,
    CreditNotesModule,
    VendorCreditsModule,
    VendorCreditApplyBillsModule,
    VendorCreditsRefundModule,
    CreditNoteRefundsModule,
    BillPaymentsModule,
    PaymentsReceivedModule,
    LedgerModule,
    BankAccountsModule,
    BankRulesModule,
    BankingTransactionsModule,
    BankingTransactionsExcludeModule,
    BankingTransactionsRegonizeModule,
    BankingMatchingModule,
    TransactionsLockingModule,
    SettingsModule,
    InventoryAdjustmentsModule,
    PostHogModule,
    EventTrackerModule,
    FinancialStatementsModule,
    StripePaymentModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SerializeInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserIpInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExcludeNullInterceptor,
    },
    AppService,
    JwtStrategy,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(TenancyGlobalMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
