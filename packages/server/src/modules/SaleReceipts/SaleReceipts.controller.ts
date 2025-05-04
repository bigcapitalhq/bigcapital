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
import { SaleReceiptApplication } from './SaleReceiptApplication.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateSaleReceiptDto,
  EditSaleReceiptDto,
} from './dtos/SaleReceipt.dto';
import { ISalesReceiptsFilter } from './types/SaleReceipts.types';

@Controller('sale-receipts')
@ApiTags('sale-receipts')
export class SaleReceiptsController {
  constructor(private saleReceiptApplication: SaleReceiptApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale receipt.' })
  createSaleReceipt(@Body() saleReceiptDTO: CreateSaleReceiptDto) {
    return this.saleReceiptApplication.createSaleReceipt(saleReceiptDTO);
  }

  @Put(':id/mail')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send the sale receipt mail.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale receipt id',
  })
  sendSaleReceiptMail(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.getSaleReceiptMail(id);
  }

  @Get(':id/mail')
  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieves the sale receipt mail.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale receipt id',
  })
  getSaleReceiptMail(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.getSaleReceiptMail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given sale receipt.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale receipt id',
  })
  editSaleReceipt(
    @Param('id', ParseIntPipe) id: number,
    @Body() saleReceiptDTO: EditSaleReceiptDto,
  ) {
    return this.saleReceiptApplication.editSaleReceipt(id, saleReceiptDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the sale receipt details.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale receipt id',
  })
  getSaleReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.getSaleReceipt(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the sale receipts paginated list' })
  getSaleReceipts(@Query() filterDTO: Partial<ISalesReceiptsFilter>) {
    return this.saleReceiptApplication.getSaleReceipts(filterDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given sale receipt.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale receipt id',
  })
  deleteSaleReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.deleteSaleReceipt(id);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close the given sale receipt.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale receipt id',
  })
  closeSaleReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.closeSaleReceipt(id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Retrieves the sale receipt PDF.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale receipt id',
  })
  getSaleReceiptPdf(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.getSaleReceiptPdf(0, id);
  }

  @Get('state')
  @ApiOperation({ summary: 'Retrieves the sale receipt state.' })
  getSaleReceiptState() {
    return this.saleReceiptApplication.getSaleReceiptState();
  }
}
