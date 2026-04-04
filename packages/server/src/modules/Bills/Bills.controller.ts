import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  Get,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { BillsApplication } from './Bills.application';
import { CreateBillDto, EditBillDto } from './dtos/Bill.dto';
import { GetBillsQueryDto } from './dtos/GetBillsQuery.dto';
import { BillResponseDto } from './dtos/BillResponse.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { BillAction } from './Bills.types';

@Controller('bills')
@ApiTags('Bills')
@ApiExtraModels(BillResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiCommonHeaders()
@ApiExtraModels(ValidateBulkDeleteResponseDto)
@UseGuards(AuthorizationGuard, PermissionGuard)
export class BillsController {
  constructor(private billsApplication: BillsApplication) {}

  @Post('validate-bulk-delete')
  @RequirePermission(BillAction.Delete, AbilitySubject.Bill)
  @ApiOperation({
    summary: 'Validate which bills can be deleted and return the results.',
  })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'Validation completed with counts and IDs of deletable and non-deletable bills.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  validateBulkDeleteBills(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.billsApplication.validateBulkDeleteBills(bulkDeleteDto.ids);
  }

  @Post('bulk-delete')
  @RequirePermission(BillAction.Delete, AbilitySubject.Bill)
  @ApiOperation({ summary: 'Deletes multiple bills.' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Bills deleted successfully',
  })
  bulkDeleteBills(@Body() bulkDeleteDto: BulkDeleteDto): Promise<void> {
    return this.billsApplication.bulkDeleteBills(bulkDeleteDto.ids, {
      skipUndeletable: bulkDeleteDto.skipUndeletable ?? false,
    });
  }

  @Post()
  @RequirePermission(BillAction.Create, AbilitySubject.Bill)
  @ApiOperation({ summary: 'Create a new bill.' })
  createBill(@Body() billDTO: CreateBillDto) {
    return this.billsApplication.createBill(billDTO);
  }

  @Put(':id')
  @RequirePermission(BillAction.Edit, AbilitySubject.Bill)
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
  @RequirePermission(BillAction.Delete, AbilitySubject.Bill)
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
  @RequirePermission(BillAction.View, AbilitySubject.Bill)
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
  getBills(@Query() filterDTO: GetBillsQueryDto) {
    return this.billsApplication.getBills(filterDTO);
  }

  @Get(':id/payment-transactions')
  @RequirePermission(BillAction.View, AbilitySubject.Bill)
  @ApiOperation({
    summary: 'Retrieve the specific bill associated payment transactions.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The bill id',
  })
  @ApiResponse({
    status: 200,
    description: 'List of payment transactions for the bill.',
  })
  getBillPaymentTransactions(@Param('id') billId: number) {
    return this.billsApplication.getBillPaymentTransactions(billId);
  }

  @Get(':id')
  @RequirePermission(BillAction.View, AbilitySubject.Bill)
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

  @Patch(':id/open')
  @RequirePermission(BillAction.Edit, AbilitySubject.Bill)
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
  @RequirePermission(BillAction.View, AbilitySubject.Bill)
  @ApiOperation({ summary: 'Retrieves the due bills.' })
  @ApiQuery({
    name: 'vendor_id',
    required: false,
    type: Number,
    description: 'Filter due bills by vendor ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of due bills (optionally filtered by vendor).',
  })
  getDueBills(@Query('vendor_id') vendorId?: number) {
    return this.billsApplication.getDueBills(vendorId);
  }
}
