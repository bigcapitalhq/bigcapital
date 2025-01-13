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
import {
  ISaleInvoiceCreateDTO,
  ISaleInvoiceEditDTO,
  ISaleInvoiceWriteoffDTO,
  InvoiceNotificationType,
} from './SaleInvoice.types';
import { SaleInvoiceApplication } from './SaleInvoices.application';
import { PublicRoute } from '../Auth/Jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('sale-invoices')
@ApiTags('sale-invoices')
@PublicRoute()
export class SaleInvoicesController {
  constructor(private saleInvoiceApplication: SaleInvoiceApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale invoice.' })
  createSaleInvoice(@Body() saleInvoiceDTO: ISaleInvoiceCreateDTO) {
    return this.saleInvoiceApplication.createSaleInvoice(saleInvoiceDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given sale invoice.' })
  editSaleInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() saleInvoiceDTO: ISaleInvoiceEditDTO,
  ) {
    return this.saleInvoiceApplication.editSaleInvoice(id, saleInvoiceDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given sale invoice.' })
  deleteSaleInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.deleteSaleInvoice(id);
  }

  // @Get()
  // getSaleInvoices(@Query() filterDTO: ISalesInvoicesFilter) {
  // return this.saleInvoiceApplication.getSaleInvoices(filterDTO);
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the sale invoice details.' })
  getSaleInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.getSaleInvoice(id);
  }

  @Get(':id/state')
  @ApiOperation({ summary: 'Retrieves the sale invoice state.' })
  getSaleInvoiceState() {
    return this.saleInvoiceApplication.getSaleInvoiceState();
  }

  @Post(':id/deliver')
  @ApiOperation({ summary: 'Deliver the given sale invoice.' })
  @HttpCode(200)
  deliverSaleInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.deliverSaleInvoice(id);
  }

  @Get('receivable/:customerId?')
  getReceivableSaleInvoices(@Param('customerId') customerId?: number) {
    return this.saleInvoiceApplication.getReceivableSaleInvoices(customerId);
  }

  @Post(':id/writeoff')
  @ApiOperation({ summary: 'Write off the given sale invoice.' })
  @HttpCode(200)
  writeOff(
    @Param('id', ParseIntPipe) id: number,
    @Body() writeoffDTO: ISaleInvoiceWriteoffDTO,
  ) {
    return this.saleInvoiceApplication.writeOff(id, writeoffDTO);
  }

  @Post(':id/cancel-writeoff')
  @ApiOperation({ summary: 'Cancel the written off sale invoice.' })
  @HttpCode(200)
  cancelWrittenoff(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.cancelWrittenoff(id);
  }

  @Get(':id/payments')
  @ApiOperation({ summary: 'Retrieves the sale invoice payments.' })
  getInvoicePayments(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.getInvoicePayments(id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Retrieves the sale invoice PDF.' })
  saleInvoicePdf(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.saleInvoicePdf(id);
  }

  @Get(':id/html')
  @ApiOperation({ summary: 'Retrieves the sale invoice HTML.' })
  saleInvoiceHtml(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.saleInvoiceHtml(id);
  }

  @Post(':id/notify-sms')
  @ApiOperation({ summary: 'Notify the sale invoice by SMS.' })
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
  @ApiOperation({ summary: 'Retrieves the sale invoice mail reminder.' })
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
