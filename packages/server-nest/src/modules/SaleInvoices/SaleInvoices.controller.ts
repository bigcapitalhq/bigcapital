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
import {
  ISaleInvoiceCreateDTO,
  ISaleInvoiceEditDTO,
  ISaleInvoiceWriteoffDTO,
  InvoiceNotificationType,
} from './SaleInvoice.types';
import { SaleInvoiceApplication } from './SaleInvoices.application';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('sale-invoices')
@PublicRoute()
export class SaleInvoicesController {
  constructor(private saleInvoiceApplication: SaleInvoiceApplication) {}

  @Post()
  createSaleInvoice(@Body() saleInvoiceDTO: ISaleInvoiceCreateDTO) {
    return this.saleInvoiceApplication.createSaleInvoice(saleInvoiceDTO);
  }

  @Put(':id')
  editSaleInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() saleInvoiceDTO: ISaleInvoiceEditDTO,
  ) {
    return this.saleInvoiceApplication.editSaleInvoice(id, saleInvoiceDTO);
  }

  @Delete(':id')
  deleteSaleInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.deleteSaleInvoice(id);
  }

  // @Get()
  // getSaleInvoices(@Query() filterDTO: ISalesInvoicesFilter) {
  // return this.saleInvoiceApplication.getSaleInvoices(filterDTO);
  // }

  @Get(':id')
  getSaleInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.getSaleInvoice(id);
  }

  @Get(':id/state')
  getSaleInvoiceState() {
    return this.saleInvoiceApplication.getSaleInvoiceState();
  }

  @Post(':id/deliver')
  deliverSaleInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.deliverSaleInvoice(id);
  }

  @Get('receivable/:customerId?')
  getReceivableSaleInvoices(@Param('customerId') customerId?: number) {
    return this.saleInvoiceApplication.getReceivableSaleInvoices(customerId);
  }

  @Post(':id/writeoff')
  writeOff(
    @Param('id', ParseIntPipe) id: number,
    @Body() writeoffDTO: ISaleInvoiceWriteoffDTO,
  ) {
    return this.saleInvoiceApplication.writeOff(id, writeoffDTO);
  }

  @Post(':id/cancel-writeoff')
  cancelWrittenoff(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.cancelWrittenoff(id);
  }

  @Get(':id/payments')
  getInvoicePayments(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.getInvoicePayments(id);
  }

  @Get(':id/pdf')
  saleInvoicePdf(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.saleInvoicePdf(id);
  }

  @Get(':id/html')
  saleInvoiceHtml(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.saleInvoiceHtml(id);
  }

  @Post(':id/notify-sms')
  notifySaleInvoiceBySms(
    @Param('id', ParseIntPipe) id: number,
    @Body('type') notificationType: InvoiceNotificationType,
  ) {
    // return this.saleInvoiceApplication.notifySaleInvoiceBySms(
    //   id,
    //   notificationType,
    // );
  }

  // @Post(':id/sms-details')
  // getSaleInvoiceSmsDetails(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() smsDetailsDTO: ISaleInvoiceSmsDetailsDTO,
  // ) {
  //   // return this.saleInvoiceApplication.getSaleInvoiceSmsDetails(
  //   //   id,
  //   //   smsDetailsDTO,
  //   // );
  // }

  @Get(':id/mail-reminder')
  getSaleInvoiceMailReminder(@Param('id', ParseIntPipe) id: number) {
    // return this.saleInvoiceApplication.getSaleInvoiceMailReminder(tenantId, id);
  }

  // @Post(':id/mail-reminder')
  // sendSaleInvoiceMailReminder(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() messageDTO: SendInvoiceMailDTO,
  // ) {
  //   // return this.saleInvoiceApplication.sendSaleInvoiceMailReminder(
  //   //   id,
  //   //   messageDTO,
  //   // );
  // }

  // @Post(':id/mail')
  // sendSaleInvoiceMail(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() messageDTO: SendInvoiceMailDTO,
  // ) {
  //   // return this.saleInvoiceApplication.sendSaleInvoiceMail(id, messageDTO);
  // }

  // @Get(':id/mail-state')
  // getSaleInvoiceMailState(
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<SaleInvoiceMailState> {
  //   // return this.saleInvoiceApplication.getSaleInvoiceMailState(id);
  // }
}
