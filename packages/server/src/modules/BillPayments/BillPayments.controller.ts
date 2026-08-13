import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BillPaymentsApplication } from './BillPaymentsApplication.service';
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
  CreateBillPaymentDto,
  EditBillPaymentDto,
} from './dtos/BillPayment.dto';
import { GetBillPaymentsFilterDto } from './dtos/GetBillPaymentsFilter.dto';
import { BillPaymentsPages } from './commands/BillPaymentsPages.service';
import { BillPaymentResponseDto } from './dtos/BillPaymentResponse.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { IPaymentMadeAction } from './types/BillPayments.types';
import { BillPaymentPageEntryDto } from './dtos/BillPaymentPageEntry.dto';
import { BillPaymentEditPageResponseDto } from './dtos/BillPaymentEditPageResponse.dto';

@Controller('bill-payments')
@ApiTags('Bill Payments')
@ApiExtraModels(BillPaymentResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiExtraModels(BillPaymentPageEntryDto)
@ApiExtraModels(BillPaymentEditPageResponseDto)
@ApiExtraModels(ValidateBulkDeleteResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class BillPaymentsController {
  constructor(
    private billPaymentsApplication: BillPaymentsApplication,
    private billPaymentsPagesService: BillPaymentsPages,
  ) {}

  @Post()
  @RequirePermission(IPaymentMadeAction.Create, AbilitySubject.PaymentMade)
  @ApiOperation({ summary: 'Create a new bill payment.' })
  public createBillPayment(@Body() billPaymentDTO: CreateBillPaymentDto) {
    return this.billPaymentsApplication.createBillPayment(billPaymentDTO);
  }

  @Post('validate-bulk-delete')
  @RequirePermission(IPaymentMadeAction.Delete, AbilitySubject.PaymentMade)
  @ApiOperation({
    summary:
      'Validates which bill payments can be deleted and returns the results.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed with counts and IDs of deletable and non-deletable bill payments.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  public validateBulkDeleteBillPayments(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.billPaymentsApplication.validateBulkDeleteBillPayments(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @RequirePermission(IPaymentMadeAction.Delete, AbilitySubject.PaymentMade)
  @ApiOperation({ summary: 'Deletes multiple bill payments.' })
  @ApiResponse({
    status: 200,
    description: 'Bill payments deleted successfully.',
  })
  public bulkDeleteBillPayments(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.billPaymentsApplication.bulkDeleteBillPayments(
      bulkDeleteDto.ids,
      { skipUndeletable: bulkDeleteDto.skipUndeletable ?? false },
    );
  }

  @Delete(':billPaymentId')
  @RequirePermission(IPaymentMadeAction.Delete, AbilitySubject.PaymentMade)
  @ApiOperation({ summary: 'Delete the given bill payment.' })
  @ApiParam({
    name: 'billPaymentId',
    required: true,
    type: Number,
    description: 'The bill payment id',
  })
  public deleteBillPayment(@Param('billPaymentId') billPaymentId: string) {
    return this.billPaymentsApplication.deleteBillPayment(
      Number(billPaymentId),
    );
  }

  @Put(':billPaymentId')
  @RequirePermission(IPaymentMadeAction.Edit, AbilitySubject.PaymentMade)
  @ApiOperation({ summary: 'Edit the given bill payment.' })
  @ApiParam({
    name: 'billPaymentId',
    required: true,
    type: Number,
    description: 'The bill payment id',
  })
  public editBillPayment(
    @Param('billPaymentId') billPaymentId: string,
    @Body() billPaymentDTO: EditBillPaymentDto,
  ) {
    return this.billPaymentsApplication.editBillPayment(
      Number(billPaymentId),
      billPaymentDTO,
    );
  }

  @Get('/new-page/entries')
  @RequirePermission(IPaymentMadeAction.View, AbilitySubject.PaymentMade)
  @ApiOperation({
    summary:
      'Retrieves the payable entries of the new page once vendor be selected.',
  })
  @ApiQuery({
    name: 'vendorId',
    required: true,
    type: Number,
    description: 'The vendor id',
  })
  @ApiResponse({
    status: 200,
    description: 'List of payable bill entries for the new payment page.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(BillPaymentPageEntryDto) },
    },
  })
  async getBillPaymentNewPageEntries(@Query('vendorId') vendorId: number) {
    const entries =
      await this.billPaymentsPagesService.getNewPageEntries(vendorId);

    return entries;
  }

  @Get(':billPaymentId/bills')
  @RequirePermission(IPaymentMadeAction.View, AbilitySubject.PaymentMade)
  @ApiOperation({ summary: 'Retrieves the bills of the given bill payment.' })
  @ApiParam({
    name: 'billPaymentId',
    required: true,
    type: Number,
    description: 'The bill payment id',
  })
  public getPaymentBills(@Param('billPaymentId') billPaymentId: string) {
    return this.billPaymentsApplication.getPaymentBills(Number(billPaymentId));
  }

  @Get('/:billPaymentId/edit-page')
  @RequirePermission(IPaymentMadeAction.View, AbilitySubject.PaymentMade)
  @ApiOperation({
    summary: 'Retrieves the edit page of the given bill payment.',
  })
  @ApiParam({
    name: 'billPaymentId',
    required: true,
    type: Number,
    description: 'The bill payment id',
  })
  @ApiResponse({
    status: 200,
    description: 'The bill payment edit page data.',
    schema: { $ref: getSchemaPath(BillPaymentEditPageResponseDto) },
  })
  public async getBillPaymentEditPage(
    @Param('billPaymentId') billPaymentId: number,
  ) {
    const billPaymentsWithEditEntries =
      await this.billPaymentsPagesService.getBillPaymentEditPage(billPaymentId);

    return billPaymentsWithEditEntries;
  }

  @Get(':billPaymentId')
  @RequirePermission(IPaymentMadeAction.View, AbilitySubject.PaymentMade)
  @ApiOperation({ summary: 'Retrieves the bill payment details.' })
  @ApiResponse({
    status: 200,
    description: 'The bill payment details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(BillPaymentResponseDto),
    },
  })
  @ApiParam({
    name: 'billPaymentId',
    required: true,
    type: Number,
    description: 'The bill payment id',
  })
  public getBillPayment(@Param('billPaymentId') billPaymentId: string) {
    return this.billPaymentsApplication.getBillPayment(Number(billPaymentId));
  }

  @Get()
  @RequirePermission(IPaymentMadeAction.View, AbilitySubject.PaymentMade)
  @ApiOperation({ summary: 'Retrieves the bill payments list.' })
  @ApiResponse({
    status: 200,
    description: 'The bill payments have been successfully retrieved.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(BillPaymentResponseDto) },
            },
          },
        },
      ],
    },
  })
  @ApiParam({
    name: 'filterDTO',
    required: true,
    type: GetBillPaymentsFilterDto,
    description: 'The bill payments filter dto',
  })
  public getBillPayments(@Query() filterDTO: GetBillPaymentsFilterDto) {
    return this.billPaymentsApplication.getBillPayments(filterDTO);
  }
}
