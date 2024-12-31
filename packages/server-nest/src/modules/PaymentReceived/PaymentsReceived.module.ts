import { Module } from '@nestjs/common';
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
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { TemplateInjectableModule } from '../TemplateInjectable/TemplateInjectable.module';
import { PaymentReceivedBrandingTemplate } from './queries/PaymentReceivedBrandingTemplate.service';
import { PaymentReceivedIncrement } from './commands/PaymentReceivedIncrement.service';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import { PaymentReceivedAutoIncrementSubscriber } from './subscribers/PaymentReceivedAutoIncrementSubscriber';
import { PaymentReceivedGLEntriesSubscriber } from './subscribers/PaymentReceivedGLEntriesSubscriber';
import { PaymentReceivedGLEntries } from './commands/PaymentReceivedGLEntries';
import { PaymentReceivedSyncInvoicesSubscriber } from './subscribers/PaymentReceivedSyncInvoices';
import { PaymentReceivedInvoiceSync } from './commands/PaymentReceivedInvoiceSync.service';

@Module({
  controllers: [PaymentReceivesController],
  providers: [
    PaymentReceivesApplication,
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
    TenancyContext,
    PaymentReceivedInvoiceSync,
    PaymentReceivedAutoIncrementSubscriber,
    PaymentReceivedGLEntriesSubscriber,
    PaymentReceivedSyncInvoicesSubscriber,
  ],
  exports: [PaymentReceivesApplication],
  imports: [
    ChromiumlyTenancyModule,
    TemplateInjectableModule,
    BranchesModule,
    WarehousesModule,
    PdfTemplatesModule,
    AutoIncrementOrdersModule,
  ],
})
export class PaymentsReceivedModule {}
