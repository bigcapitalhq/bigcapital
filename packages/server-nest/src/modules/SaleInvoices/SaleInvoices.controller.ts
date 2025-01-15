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
  ISalesInvoicesFilter,
  SaleInvoiceMailState,
  SendInvoiceMailDTO,
} from './SaleInvoice.types';
import { SaleInvoiceApplication } from './SaleInvoices.application';
import { PublicRoute } from '../Auth/Jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('sale-invoices')
@ApiTags('sale-invoices')
@PublicRoute()
export class SaleInvoicesController {
  constructor(private saleInvoiceApplication: SaleInvoiceApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale invoice.' })
  @ApiResponse({
    status: 201,
    description: 'Sale invoice created successfully',
  })
  createSaleInvoice(@Body() saleInvoiceDTO: ISaleInvoiceCreateDTO) {
    return this.saleInvoiceApplication.createSaleInvoice(saleInvoiceDTO);
  }

  @Put(':id/mail')
  @ApiOperation({ summary: 'Send the sale invoice mail.' })
  @ApiResponse({
    status: 200,
    description: 'Sale invoice mail sent successfully',
  })
  sendSaleInvoiceMail(
    @Param('id', ParseIntPipe) id: number,
    @Body() messageDTO: SendInvoiceMailDTO,
  ) {
    return this.saleInvoiceApplication.sendSaleInvoiceMail(id, messageDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given sale invoice.' })
  @ApiResponse({
    status: 200,
    description: 'Sale invoice edited successfully',
  })
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

  @Get()
  @ApiOperation({ summary: 'Retrieves the sale invoices.' })
  getSaleInvoices(@Query() filterDTO: ISalesInvoicesFilter) {
    return this.saleInvoiceApplication.getSaleInvoices(filterDTO);
  }

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

  @Get(':id/mail-state')
  @ApiOperation({ summary: 'Retrieves the sale invoice mail state.' })
  @ApiResponse({
    status: 200,
    description: 'Sale invoice mail state retrieved successfully',
  })
  getSaleInvoiceMailState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SaleInvoiceMailState> {
    return this.saleInvoiceApplication.getSaleInvoiceMailState(id);
  }
}
