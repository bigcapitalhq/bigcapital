import { Module } from '@nestjs/common';

import { PaymentReceivesController } from './PaymentsReceived.controller';
import { PaymentReceivesApplication } from './PaymentReceived.application';
import { CreatePaymentReceivedService } from './commands/CreatePaymentReceived.serivce';
import { DeletePaymentReceivedService } from './commands/DeletePaymentReceived.service';
import { EditPaymentReceivedService } from './commands/EditPaymentReceived.service';
import { GetPaymentReceivedStateService } from './queries/GetPaymentReceivedState.service';
import { GetPaymentReceivedService } from './queries/GetPaymentReceived.service';
import { GetPaymentReceivedInvoices } from './queries/GetPaymentReceivedInvoices.service';
import GetPaymentReceivedPdf from './queries/GetPaymentReceivedPdf.service';
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
    GetPaymentReceivedPdf,
    PaymentReceivedValidators,
    PaymentReceiveDTOTransformer,
    PaymentReceivedBrandingTemplate,
    PaymentReceivedIncrement,
    TenancyContext,
  ],
  exports: [PaymentReceivesApplication],
  imports: [
    ChromiumlyTenancyModule,
    TemplateInjectableModule,
    BranchesModule,
    WarehousesModule,
    PdfTemplatesModule,
    AutoIncrementOrdersModule
  ],
})
export class PaymentsReceivedModule {}
