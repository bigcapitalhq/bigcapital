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
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  CreateSaleReceiptDto,
  EditSaleReceiptDto,
} from './dtos/SaleReceipt.dto';
import { ISalesReceiptsFilter } from './types/SaleReceipts.types';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';
import { SaleReceiptResponseDto } from './dtos/SaleReceiptResponse.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { SaleReceiptStateResponseDto } from './dtos/SaleReceiptState.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';

@Controller('sale-receipts')
@ApiTags('Sale Receipts')
@ApiExtraModels(SaleReceiptResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiExtraModels(SaleReceiptStateResponseDto)
@ApiCommonHeaders()
@ApiExtraModels(ValidateBulkDeleteResponseDto)
export class SaleReceiptsController {
  constructor(private saleReceiptApplication: SaleReceiptApplication) { }

  @Post('validate-bulk-delete')
  @ApiOperation({
    summary:
      'Validates which sale receipts can be deleted and returns the results.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed with counts and IDs of deletable and non-deletable sale receipts.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  validateBulkDeleteSaleReceipts(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.saleReceiptApplication.validateBulkDeleteSaleReceipts(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Deletes multiple sale receipts.' })
  @ApiResponse({
    status: 200,
    description: 'Sale receipts deleted successfully',
  })
  bulkDeleteSaleReceipts(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<void> {
    return this.saleReceiptApplication.bulkDeleteSaleReceipts(
      bulkDeleteDto.ids,
      { skipUndeletable: bulkDeleteDto.skipUndeletable ?? false },
    );
  }

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
  @ApiResponse({
    status: 200,
    description: 'The sale receipt has been retrieved.',
    schema: {
      $ref: getSchemaPath(SaleReceiptStateResponseDto),
    },
  })
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
    schema: {
      $ref: getSchemaPath(SaleReceiptResponseDto),
    },
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
  @ApiResponse({
    status: 200,
    description: '',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(SaleReceiptResponseDto) },
            },
          },
        },
      ],
    },
  })
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
