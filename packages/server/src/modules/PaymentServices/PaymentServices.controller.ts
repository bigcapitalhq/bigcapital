import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { PaymentServicesApplication } from './PaymentServicesApplication';
import {
  EditPaymentMethodDTO,
  GetPaymentMethodsStateDto,
  PaymentIntegrationDto,
  PaymentMethodMutationResponseDto,
} from './types';

@ApiTags('Payment Services')
@ApiExtraModels(GetPaymentMethodsStateDto)
@ApiExtraModels(PaymentMethodMutationResponseDto)
@ApiExtraModels(PaymentIntegrationDto)
@ApiCommonHeaders()
@Controller('payment-services')
export class PaymentServicesController {
  constructor(
    private readonly paymentServicesApp: PaymentServicesApplication,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Retrieves the payment services for the invoice.' })
  @ApiResponse({
    status: 200,
    description: 'Payment services have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(PaymentIntegrationDto) },
    },
  })
  async getPaymentServicesSpecificInvoice() {
    return this.paymentServicesApp.getPaymentServicesForInvoice();
  }

  @Get('/state')
  @ApiOperation({
    summary: 'Retrieves the payment methods state (Stripe, etc.).',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment methods state has been successfully retrieved.',
    schema: { $ref: getSchemaPath(GetPaymentMethodsStateDto) },
  })
  async getPaymentMethodsState() {
    return this.paymentServicesApp.getPaymentMethodsState();
  }

  @Get('/:paymentServiceId')
  @ApiOperation({ summary: 'Retrieves a specific payment service details.' })
  @ApiParam({
    name: 'paymentServiceId',
    type: Number,
    description: 'Payment service id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment service details have been successfully retrieved.',
    schema: { $ref: getSchemaPath(PaymentIntegrationDto) },
  })
  async getPaymentService(@Param('paymentServiceId') paymentServiceId: number) {
    return this.paymentServicesApp.getPaymentService(paymentServiceId);
  }

  @Post('/:paymentMethodId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Updates the given payment method.' })
  @ApiParam({
    name: 'paymentMethodId',
    type: Number,
    description: 'Payment method id.',
  })
  @ApiBody({
    type: EditPaymentMethodDTO,
    description: 'Payment method update payload.',
  })
  @ApiResponse({
    status: 200,
    description: 'The payment method has been successfully updated.',
    schema: { $ref: getSchemaPath(PaymentMethodMutationResponseDto) },
  })
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
  @ApiOperation({ summary: 'Deletes the given payment method.' })
  @ApiParam({
    name: 'paymentMethodId',
    type: Number,
    description: 'Payment method id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The payment method has been successfully deleted.',
    schema: { $ref: getSchemaPath(PaymentMethodMutationResponseDto) },
  })
  async deletePaymentMethod(@Param('paymentMethodId') paymentMethodId: number) {
    await this.paymentServicesApp.deletePaymentMethod(paymentMethodId);

    return {
      id: paymentMethodId,
      message: 'The payment method has been deleted.',
    };
  }
}
