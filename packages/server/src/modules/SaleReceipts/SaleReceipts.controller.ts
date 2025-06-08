import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { SaleReceiptApplication } from './SaleReceiptApplication.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateSaleReceiptDto,
  EditSaleReceiptDto,
} from './dtos/SaleReceipt.dto';
import { ISalesReceiptsFilter } from './types/SaleReceipts.types';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';

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

  @Get('state')
  @ApiOperation({ summary: 'Retrieves the sale receipt state.' })
  getSaleReceiptState() {
    return this.saleReceiptApplication.getSaleReceiptState();
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
  @ApiResponse({
    status: 200,
    description: 'The sale receipt details have been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'The sale receipt not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale receipt id',
  })
  async getSaleReceipt(
    @Param('id', ParseIntPipe) id: number,
    @Headers('accept') acceptHeader: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent =
        await this.saleReceiptApplication.getSaleReceiptPdf(id);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else if (acceptHeader.includes(AcceptType.ApplicationTextHtml)) {
      const htmlContent =
        await this.saleReceiptApplication.getSaleReceiptHtml(id);

      return { htmlContent };
    } else {
      return this.saleReceiptApplication.getSaleReceipt(id);
    }
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
}
