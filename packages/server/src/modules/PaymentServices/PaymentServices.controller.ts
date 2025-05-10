import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentServicesApplication } from './PaymentServicesApplication';
import { EditPaymentMethodDTO } from './types';

@ApiTags('PaymentServices')
@Controller('payment-services')
export class PaymentServicesController {
  constructor(
    private readonly paymentServicesApp: PaymentServicesApplication,
  ) {}

  @Get('/')
  async getPaymentServicesSpecificInvoice() {
    const paymentServices =
      await this.paymentServicesApp.getPaymentServicesForInvoice();

    return { paymentServices };
  }

  @Get('/state')
  async getPaymentMethodsState() {
    const paymentMethodsState =
      await this.paymentServicesApp.getPaymentMethodsState();

    return { data: paymentMethodsState };
  }

  @Get('/:paymentServiceId')
  async getPaymentService(@Param('paymentServiceId') paymentServiceId: number) {
    const paymentService =
      await this.paymentServicesApp.getPaymentService(paymentServiceId);

    return { data: paymentService };
  }

  @Post('/:paymentMethodId')
  @HttpCode(200)
  async updatePaymentMethod(
    @Param('paymentMethodId') paymentMethodId: number,
    @Body() updatePaymentMethodDTO: EditPaymentMethodDTO,
  ) {
    await this.paymentServicesApp.editPaymentMethod(
      paymentMethodId,
      updatePaymentMethodDTO,
    );
    return {
      id: paymentMethodId,
      message: 'The given payment method has been updated.',
    };
  }

  @Delete('/:paymentMethodId')
  @HttpCode(200)
  async deletePaymentMethod(@Param('paymentMethodId') paymentMethodId: number) {
    await this.paymentServicesApp.deletePaymentMethod(paymentMethodId);

    return {
      id: paymentMethodId,
      message: 'The payment method has been deleted.',
    };
  }
}
