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

@Controller('sale-receipts')
@PublicRoute()
export class SaleReceiptsController {
  constructor(private saleReceiptApplication: SaleReceiptApplication) {}

  @Post()
  createSaleReceipt(@Body() saleReceiptDTO: ISaleReceiptDTO) {
    return this.saleReceiptApplication.createSaleReceipt(saleReceiptDTO);
  }

  @Put(':id')
  editSaleReceipt(
    @Param('id', ParseIntPipe) id: number,
    @Body() saleReceiptDTO: ISaleReceiptDTO,
  ) {
    return this.saleReceiptApplication.editSaleReceipt(id, saleReceiptDTO);
  }

  @Get(':id')
  getSaleReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.getSaleReceipt(id);
  }

  @Delete(':id')
  deleteSaleReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.deleteSaleReceipt(id);
  }

  @Post(':id/close')
  closeSaleReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.closeSaleReceipt(id);
  }

  @Get(':id/pdf')
  getSaleReceiptPdf(@Param('id', ParseIntPipe) id: number) {
    return this.saleReceiptApplication.getSaleReceiptPdf(0, id);
  }

  @Get('state')
  getSaleReceiptState() {
    return this.saleReceiptApplication.getSaleReceiptState();
  }
}
