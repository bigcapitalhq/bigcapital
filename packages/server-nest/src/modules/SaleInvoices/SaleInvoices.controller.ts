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
  ISaleInvoiceWriteoffDTO,
  ISalesInvoicesFilter,
  SaleInvoiceMailState,
  SendInvoiceMailDTO,
} from './SaleInvoice.types';
import { SaleInvoiceApplication } from './SaleInvoices.application';
import { PublicRoute } from '../Auth/Jwt.guard';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateSaleInvoiceDto,
  EditSaleInvoiceDto,
} from './dtos/SaleInvoice.dto';

@Controller('sale-invoices')
@ApiTags('sale-invoices')
@ApiHeader({
  name: 'organization-id',
  description: 'The organization id',
  required: true,
})
@ApiHeader({
  name: 'x-access-token',
  description: 'The authentication token',
  required: true,
})
@PublicRoute()
export class SaleInvoicesController {
  constructor(private saleInvoiceApplication: SaleInvoiceApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale invoice.' })
  @ApiResponse({
    status: 201,
    description: 'Sale invoice created successfully',
  })
  createSaleInvoice(@Body() saleInvoiceDTO: CreateSaleInvoiceDto) {
    return this.saleInvoiceApplication.createSaleInvoice(saleInvoiceDTO);
  }

  @Put(':id/mail')
  @ApiOperation({ summary: 'Send the sale invoice mail.' })
  @ApiResponse({
    status: 200,
    description: 'Sale invoice mail sent successfully',
  })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
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
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  editSaleInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() saleInvoiceDTO: EditSaleInvoiceDto,
  ) {
    return this.saleInvoiceApplication.editSaleInvoice(id, saleInvoiceDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given sale invoice.' })
  @ApiResponse({
    status: 200,
    description: 'The sale invoice has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  deleteSaleInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.deleteSaleInvoice(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the sale invoices.' })
  @ApiResponse({
    status: 200,
    description: 'The sale invoices have been successfully retrieved.',
  })
  getSaleInvoices(@Query() filterDTO: ISalesInvoicesFilter) {
    return this.saleInvoiceApplication.getSaleInvoices(filterDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the sale invoice details.' })
  @ApiResponse({
    status: 200,
    description: 'The sale invoice details have been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  getSaleInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.getSaleInvoice(id);
  }

  @Get(':id/state')
  @ApiOperation({ summary: 'Retrieves the sale invoice state.' })
  @ApiResponse({
    status: 200,
    description: 'The sale invoice state has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  getSaleInvoiceState() {
    return this.saleInvoiceApplication.getSaleInvoiceState();
  }

  @Put(':id/deliver')
  @ApiOperation({ summary: 'Deliver the given sale invoice.' })
  @ApiResponse({
    status: 200,
    description: 'The sale invoice has been successfully marked asdelivered.',
  })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  @HttpCode(200)
  deliverSaleInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.deliverSaleInvoice(id);
  }

  @Get('receivable/:customerId?')
  @ApiOperation({ summary: 'Retrieves the receivable sale invoices.' })
  @ApiResponse({
    status: 200,
    description:
      'The receivable sale invoices have been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'The customer not found.' })
  @ApiParam({
    name: 'customerId',
    required: false,
    type: Number,
    description: 'The customer id',
  })
  getReceivableSaleInvoices(@Param('customerId') customerId?: number) {
    return this.saleInvoiceApplication.getReceivableSaleInvoices(customerId);
  }

  @Post(':id/writeoff')
  @ApiOperation({ summary: 'Write off the given sale invoice.' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The sale invoice has been successfully written off.',
  })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  writeOff(
    @Param('id', ParseIntPipe) id: number,
    @Body() writeoffDTO: ISaleInvoiceWriteoffDTO,
  ) {
    return this.saleInvoiceApplication.writeOff(id, writeoffDTO);
  }

  @Post(':id/cancel-writeoff')
  @ApiOperation({ summary: 'Cancel the written off sale invoice.' })
  @ApiResponse({
    status: 200,
    description:
      'The sale invoice has been successfully marked as not written off.',
  })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  @HttpCode(200)
  cancelWrittenoff(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.cancelWrittenoff(id);
  }

  @Get(':id/payments')
  @ApiOperation({ summary: 'Retrieves the sale invoice payments.' })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  getInvoicePayments(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.getInvoicePayments(id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Retrieves the sale invoice PDF.' })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  saleInvoicePdf(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.saleInvoicePdf(id);
  }

  @Get(':id/html')
  @ApiOperation({ summary: 'Retrieves the sale invoice HTML.' })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  saleInvoiceHtml(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.saleInvoiceHtml(id);
  }

  @Get(':id/mail-state')
  @ApiOperation({ summary: 'Retrieves the sale invoice mail state.' })
  @ApiResponse({
    status: 200,
    description: 'Sale invoice mail state retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  getSaleInvoiceMailState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SaleInvoiceMailState> {
    return this.saleInvoiceApplication.getSaleInvoiceMailState(id);
  }
}
