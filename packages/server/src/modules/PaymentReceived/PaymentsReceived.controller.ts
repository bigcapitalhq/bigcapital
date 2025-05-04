import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaymentReceivesApplication } from './PaymentReceived.application';
import {
  IPaymentReceivedCreateDTO,
  IPaymentReceivedEditDTO,
  IPaymentsReceivedFilter,
  PaymentReceiveMailOptsDTO,
} from './types/PaymentReceived.types';

@Controller('payments-received')
@ApiTags('payments-received')
export class PaymentReceivesController {
  constructor(private paymentReceivesApplication: PaymentReceivesApplication) {}

  @Post(':id/mail')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The payment receive mail has been successfully sent.',
  })
  public sendPaymentReceiveMail(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
    @Body() messageOpts: PaymentReceiveMailOptsDTO,
  ) {
    return this.paymentReceivesApplication.notifyPaymentByMail(
      paymentReceiveId,
      messageOpts,
    );
  }

  @Get(':id/mail')
  @ApiResponse({
    status: 200,
    description:
      'The payment receive mail options have been successfully retrieved.',
  })
  public getPaymentReceiveMailOptions(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.getPaymentMailOptions(
      paymentReceiveId,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new payment received.' })
  public createPaymentReceived(
    @Body() paymentReceiveDTO: IPaymentReceivedCreateDTO,
  ) {
    return this.paymentReceivesApplication.createPaymentReceived(
      paymentReceiveDTO,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given payment received.' })
  public editPaymentReceive(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
    @Body() paymentReceiveDTO: IPaymentReceivedEditDTO,
  ) {
    return this.paymentReceivesApplication.editPaymentReceive(
      paymentReceiveId,
      paymentReceiveDTO,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given payment received.' })
  public deletePaymentReceive(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.deletePaymentReceive(
      paymentReceiveId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the payment received list.' })
  public getPaymentsReceived(@Query() filterDTO: Partial<IPaymentsReceivedFilter>) {
    return this.paymentReceivesApplication.getPaymentsReceived(filterDTO);
  }

  @Get('state')
  @ApiOperation({ summary: 'Retrieves the payment received state.' })
  @ApiResponse({
    status: 200,
    description: 'The payment received state has been successfully retrieved.',
  })
  public getPaymentReceivedState() {
    return this.paymentReceivesApplication.getPaymentReceivedState();
  }

  @Get(':id/invoices')
  @ApiOperation({ summary: 'Retrieves the payment received invoices.' })
  @ApiResponse({
    status: 200,
    description:
      'The payment received invoices have been successfully retrieved.',
  })
  public getPaymentReceiveInvoices(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.getPaymentReceiveInvoices(
      paymentReceiveId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the payment received details.' })
  @ApiResponse({
    status: 200,
    description:
      'The payment received details have been successfully retrieved.',
  })
  public getPaymentReceive(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.getPaymentReceive(paymentReceiveId);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Retrieves the payment received pdf.' })
  @ApiResponse({
    status: 200,
    description: 'The payment received pdf has been successfully retrieved.',
  })
  public getPaymentReceivePdf(
    @Param('id', ParseIntPipe) paymentReceivedId: number,
  ) {
    return this.paymentReceivesApplication.getPaymentReceivePdf(
      paymentReceivedId,
    );
  }
}
