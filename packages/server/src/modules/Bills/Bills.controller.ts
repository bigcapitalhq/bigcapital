import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { BillsApplication } from './Bills.application';
import { IBillsFilter } from './Bills.types';
import { CreateBillDto, EditBillDto } from './dtos/Bill.dto';
import { BillResponseDto } from './dtos/BillResponse.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('bills')
@ApiTags('Bills')
@ApiExtraModels(BillResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiCommonHeaders()
export class BillsController {
  constructor(private billsApplication: BillsApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bill.' })
  createBill(@Body() billDTO: CreateBillDto) {
    return this.billsApplication.createBill(billDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given bill.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The bill id',
  })
  editBill(@Param('id') billId: number, @Body() billDTO: EditBillDto) {
    return this.billsApplication.editBill(billId, billDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given bill.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The bill id',
  })
  deleteBill(@Param('id') billId: number) {
    return this.billsApplication.deleteBill(billId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the bills.' })
  @ApiResponse({
    status: 200,
    description: 'The bill details has been retrieved successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(BillResponseDto) },
            },
          },
        },
      ],
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The bill id',
  })
  getBills(@Query() filterDTO: Partial<IBillsFilter>) {
    return this.billsApplication.getBills(filterDTO);
  }

  @Get(':id/payment-transactions')
  @ApiOperation({
    summary: 'Retrieve the specific bill associated payment transactions.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The bill id',
  })
  getBillPaymentTransactions(@Param('id') billId: number) {
    return this.billsApplication.getBillPaymentTransactions(billId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the bill details.' })
  @ApiResponse({
    status: 200,
    description: 'The bill details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(BillResponseDto),
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The bill id',
  })
  getBill(@Param('id') billId: number) {
    return this.billsApplication.getBill(billId);
  }

  @Post(':id/open')
  @ApiOperation({ summary: 'Open the given bill.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The bill id',
  })
  openBill(@Param('id') billId: number) {
    return this.billsApplication.openBill(billId);
  }

  @Get('due')
  @ApiOperation({ summary: 'Retrieves the due bills.' })
  getDueBills(@Body('vendorId') vendorId?: number) {
    return this.billsApplication.getDueBills(vendorId);
  }
}
