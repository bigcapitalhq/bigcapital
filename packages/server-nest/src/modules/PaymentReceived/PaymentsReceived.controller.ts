import {
  Body,
  Controller,
  Delete,
  Get,
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
} from './types/PaymentReceived.types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('payments-received')
@PublicRoute()
export class PaymentReceivesController {
  constructor(private paymentReceivesApplication: PaymentReceivesApplication) {}

  @Post()
  public createPaymentReceived(
    @Body() paymentReceiveDTO: IPaymentReceivedCreateDTO,
  ) {
    return this.paymentReceivesApplication.createPaymentReceived(
      paymentReceiveDTO,
    );
  }

  @Put(':id')
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
  public deletePaymentReceive(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.deletePaymentReceive(
      paymentReceiveId,
    );
  }

  @Get()
  public getPaymentsReceived(@Query() filterDTO: IPaymentsReceivedFilter) {
    return this.paymentReceivesApplication.getPaymentsReceived(filterDTO);
  }

  @Get('state')
  public getPaymentReceivedState() {
    return this.paymentReceivesApplication.getPaymentReceivedState();
  }

  @Get(':id/invoices')
  public getPaymentReceiveInvoices(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.getPaymentReceiveInvoices(
      paymentReceiveId,
    );
  }

  @Get(':id')
  public getPaymentReceive(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.getPaymentReceive(paymentReceiveId);
  }

  @Get(':id/pdf')
  public getPaymentReceivePdf(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.getPaymentReceivePdf(
      1,
      paymentReceiveId,
    );
  }
}
