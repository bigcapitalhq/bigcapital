import { Module } from '@nestjs/common';
import { DeletePaymentMethodService } from './commands/DeletePaymentMethodService';
import { EditPaymentMethodService } from './commands/EditPaymentMethodService';
import { GetPaymentMethodService } from './queries/GetPaymentService';
import { GetPaymentServicesSpecificInvoice } from './queries/GetPaymentServicesSpecificInvoice';
import { GetPaymentMethodsStateService } from './queries/GetPaymentMethodsState';
import { PaymentServicesApplication } from './PaymentServicesApplication';
import { PaymentServicesController } from './PaymentServices.controller';

@Module({
  providers: [
    DeletePaymentMethodService,
    EditPaymentMethodService,
    GetPaymentMethodService,
    GetPaymentMethodsStateService,
    GetPaymentServicesSpecificInvoice,
    PaymentServicesApplication,
  ],
  controllers: [PaymentServicesController],
})
export class PaymentServicesModule {}
