import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { PassportModule } from '@nestjs/passport';
import { ClsModule, ClsService } from 'nestjs-cls';
import { AppController } from './App.controller';
import { AppService } from './App.service';
import { ItemsModule } from '../Items/Items.module';
import { config } from '../../common/config';
import { SystemDatabaseModule } from '../System/SystemDB/SystemDB.module';
import { SystemModelsModule } from '../System/SystemModels/SystemModels.module';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TenancyModelsModule } from '../Tenancy/TenancyModels/Tenancy.module';
import { LoggerMiddleware } from '@/middleware/logger.middleware';
import { ExcludeNullInterceptor } from '@/interceptors/ExcludeNull.interceptor';
import { UserIpInterceptor } from '@/interceptors/user-ip.interceptor';
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
import { FeaturesModule } from '../Features/Features.module';
import { InventoryCostModule } from '../InventoryCost/InventoryCost.module';
import { WarehousesTransfersModule } from '../WarehousesTransfers/WarehouseTransfers.module';
import { DashboardModule } from '../Dashboard/Dashboard.module';
import { PaymentLinksModule } from '../PaymentLinks/PaymentLinks.module';
import { RolesModule } from '../Roles/Roles.module';
import { SubscriptionModule } from '../Subscription/Subscription.module';
import { OrganizationModule } from '../Organization/Organization.module';
import { TenantDBManagerModule } from '../TenantDBManager/TenantDBManager.module';
import { PaymentServicesModule } from '../PaymentServices/PaymentServices.module';
import { AuthModule } from '../Auth/Auth.module';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { LoopsModule } from '../Loops/Loops.module';
import { AttachmentsModule } from '../Attachments/Attachment.module';
import { S3Module } from '../S3/S3.module';
import { ExportModule } from '../Export/Export.module';
import { ImportModule } from '../Import/Import.module';
import { CreditNotesApplyInvoiceModule } from '../CreditNotesApplyInvoice/CreditNotesApplyInvoice.module';
import { ResourceModule } from '../Resource/Resource.module';
import { ViewsModule } from '../Views/Views.module';
import { CurrenciesModule } from '../Currencies/Currencies.module';
import { MiscellaneousModule } from '../Miscellaneous/Miscellaneous.module';
import { UsersModule } from '../UsersModule/Users.module';
import { ContactsModule } from '../Contacts/Contacts.module';
import { BankingPlaidModule } from '../BankingPlaid/BankingPlaid.module';
import { BankingCategorizeModule } from '../BankingCategorize/BankingCategorize.module';
import { TenantModelsInitializeModule } from '../Tenancy/TenantModelsInitialize.module';
import { BillLandedCostsModule } from '../BillLandedCosts/BillLandedCosts.module';
import { SocketModule } from '../Socket/Socket.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppThrottleModule } from './AppThrottle.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'public'),
      serveRoot: '/public',
    }),
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
    AppThrottleModule,
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
        setup: (cls: ClsService, req: Request, res: Response) => {
          cls.set('organizationId', req.headers['organization-id']);
        },
        generateId: true,
        saveReq: true,
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get('redis.host') || 'localhost',
          port: configService.get('redis.port') || 6379,
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TenancyDatabaseModule,
    TenancyModelsModule,
    TenantModelsInitializeModule,
    AuthModule,
    TenancyModule,
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
    WarehousesTransfersModule,
    CustomersModule,
    VendorsModule,
    SaleInvoicesModule,
    SaleEstimatesModule,
    SaleReceiptsModule,
    BillsModule,
    BillLandedCostsModule,
    ManualJournalsModule,
    CreditNotesModule,
    VendorCreditsModule,
    VendorCreditApplyBillsModule,
    VendorCreditsRefundModule,
    CreditNoteRefundsModule,
    CreditNotesApplyInvoiceModule,
    BillPaymentsModule,
    PaymentsReceivedModule,
    LedgerModule,
    BankAccountsModule,
    BankRulesModule,
    BankingTransactionsExcludeModule,
    BankingTransactionsRegonizeModule,
    BankingTransactionsModule,
    BankingMatchingModule,
    BankingPlaidModule,
    BankingCategorizeModule,
    TransactionsLockingModule,
    SettingsModule,
    FeaturesModule,
    InventoryAdjustmentsModule,
    InventoryCostModule,
    PostHogModule,
    EventTrackerModule,
    FinancialStatementsModule,
    StripePaymentModule,
    DashboardModule,
    PaymentLinksModule,
    RolesModule,
    SubscriptionModule,
    OrganizationModule,
    TenantDBManagerModule,
    PaymentServicesModule,
    LoopsModule,
    AttachmentsModule,
    S3Module,
    ExportModule,
    ImportModule,
    ResourceModule,
    ViewsModule,
    CurrenciesModule,
    MiscellaneousModule,
    UsersModule,
    ContactsModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SerializeInterceptor,
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
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
