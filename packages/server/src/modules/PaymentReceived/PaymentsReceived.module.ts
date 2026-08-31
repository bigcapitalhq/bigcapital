import { Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';
import { PaymentReceivesController } from './PaymentsReceived.controller';
import { PaymentReceivesApplication } from './PaymentReceived.application';
import { CreatePaymentReceivedService } from './commands/CreatePaymentReceived.serivce';
import { DeletePaymentReceivedService } from './commands/DeletePaymentReceived.service';
import { EditPaymentReceivedService } from './commands/EditPaymentReceived.service';
import { GetPaymentReceivedStateService } from './queries/GetPaymentReceivedState.service';
import { GetPaymentReceivedService } from './queries/GetPaymentReceived.service';
import { GetPaymentReceivedInvoices } from './queries/GetPaymentReceivedInvoices.service';
import { GetPaymentReceivedPdfService } from './queries/GetPaymentReceivedPdf.service';
import { PaymentReceivedValidators } from './commands/PaymentReceivedValidators.service';
import { PaymentReceiveDTOTransformer } from './commands/PaymentReceivedDTOTransformer';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { TemplateInjectableModule } from '../TemplateInjectable/TemplateInjectable.module';
import { PaymentReceivedBrandingTemplate } from './queries/PaymentReceivedBrandingTemplate.service';
import { PaymentReceivedIncrement } from './commands/PaymentReceivedIncrement.service';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import { PaymentReceivedAutoIncrementSubscriber } from './subscribers/PaymentReceivedAutoIncrementSubscriber';
import { PaymentReceivedSmsNotificationSubscriber } from './subscribers/PaymentReceivedSmsNotificationSubscriber';
import { PaymentReceivedGLEntriesSubscriber } from './subscribers/PaymentReceivedGLEntriesSubscriber';
import { PaymentReceivedGLEntries } from './commands/PaymentReceivedGLEntries';
import { PaymentReceivedSyncInvoicesSubscriber } from './subscribers/PaymentReceivedSyncInvoices';
import { PaymentReceivedInvoiceSync } from './commands/PaymentReceivedInvoiceSync.service';
import { LedgerModule } from '../Ledger/Ledger.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { SendPaymentReceiveMailNotification } from './commands/PaymentReceivedMailNotification';
import { GetPaymentsReceivedService } from './queries/GetPaymentsReceived.service';
import { MailNotificationModule } from '../MailNotification/MailNotification.module';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { MailModule } from '../Mail/Mail.module';
import { SMSModule } from '../SMS/SMS.module';
import { SendPaymentReceivedMailProcessor } from './processors/PaymentReceivedMailNotification.processor';
import { PaymentReceivedSmsNotification } from './PaymentReceivedSmsNotification';
import { SEND_PAYMENT_RECEIVED_MAIL_QUEUE } from './constants';
import { SMS_QUEUE } from '../SMS/SMS.constants';
import { PaymentsReceivedExportable } from './commands/PaymentsReceivedExportable';
import { PaymentsReceivedImportable } from './commands/PaymentsReceivedImportable';
import { PaymentsReceivedPagesService } from './queries/PaymentsReceivedPages.service';
import { GetPaymentReceivedMailTemplate } from './queries/GetPaymentReceivedMailTemplate.service';
import { GetPaymentReceivedMailState } from './queries/GetPaymentReceivedMailState.service';
import { BulkDeletePaymentReceivedService } from './BulkDeletePaymentReceived.service';
import { ValidateBulkDeletePaymentReceivedService } from './ValidateBulkDeletePaymentReceived.service';

@Module({
  controllers: [PaymentReceivesController],
  providers: [
    PaymentReceivesApplication,
    PaymentReceivedSmsNotification,
    CreatePaymentReceivedService,
    DeletePaymentReceivedService,
    EditPaymentReceivedService,
    GetPaymentReceivedStateService,
    GetPaymentReceivedService,
    GetPaymentReceivedInvoices,
    GetPaymentReceivedPdfService,
    PaymentReceivedValidators,
    PaymentReceiveDTOTransformer,
    PaymentReceivedBrandingTemplate,
    PaymentReceivedIncrement,
    PaymentReceivedGLEntries,
    PaymentReceivedInvoiceSync,
    PaymentReceivedAutoIncrementSubscriber,
    PaymentReceivedSmsNotificationSubscriber,
    PaymentReceivedGLEntriesSubscriber,
    PaymentReceivedSyncInvoicesSubscriber,
    GetPaymentsReceivedService,
    SendPaymentReceiveMailNotification,
    SendPaymentReceivedMailProcessor,
    PaymentsReceivedExportable,
    PaymentsReceivedImportable,
    PaymentsReceivedPagesService,
    GetPaymentReceivedMailTemplate,
    GetPaymentReceivedMailState,
    BulkDeletePaymentReceivedService,
    ValidateBulkDeletePaymentReceivedService,
  ],
  exports: [
    PaymentReceivesApplication,
    CreatePaymentReceivedService,
    PaymentReceivedGLEntries,
    PaymentsReceivedExportable,
    PaymentsReceivedImportable,
    PaymentReceivedValidators,
  ],
  imports: [
    TenancyModule,
    ChromiumlyTenancyModule,
    TemplateInjectableModule,
    BranchesModule,
    WarehousesModule,
    PdfTemplatesModule,
    AutoIncrementOrdersModule,
    LedgerModule,
    AccountsModule,
    MailNotificationModule,
    DynamicListModule,
    MailModule,
    SMSModule,
    BullModule.registerQueue({ name: SMS_QUEUE }),
    BullModule.registerQueue({ name: SEND_PAYMENT_RECEIVED_MAIL_QUEUE }),
    BullBoardModule.forFeature({
      name: SEND_PAYMENT_RECEIVED_MAIL_QUEUE,
      adapter: BullMQAdapter,
    }),
  ],
})
export class PaymentsReceivedModule {}
