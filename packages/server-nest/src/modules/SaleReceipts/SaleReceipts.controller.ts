import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ISaleReceiptDTO } from './types/SaleReceipts.types';
import { SaleReceiptApplication } from './SaleReceiptApplication.service';
import { PublicRoute } from '../Auth/Jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('sale-receipts')
@ApiTags('sale-receipts')
@PublicRoute()
export class SaleReceiptsController {
  constructor(private saleReceiptApplication: SaleReceiptApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale receipt.' })
  createSaleReceipt(@Body() saleReceiptDTO: ISaleReceiptDTO) {
    return this.saleReceiptApplication.createSaleReceipt(saleReceiptDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given sale receipt.' })
  editSaleReceipt(
    @Param('id', ParseIntPipe) id: number,
    @Body() saleReceiptDTO: ISaleReceiptDTO,
  ) {
    return this.saleReceiptApplication.editSaleReceipt(id, saleReceiptDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the sale receipt details.' })
  getSaleReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.getSaleReceipt(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given sale receipt.' })
  deleteSaleReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.deleteSaleReceipt(id);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close the given sale receipt.' })
  closeSaleReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.closeSaleReceipt(id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Retrieves the sale receipt PDF.' })
  getSaleReceiptPdf(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.getSaleReceiptPdf(0, id);
  }

  @Get('state')
  @ApiOperation({ summary: 'Retrieves the sale receipt state.' })
  getSaleReceiptState() {
    return this.saleReceiptApplication.getSaleReceiptState();
  }
}
