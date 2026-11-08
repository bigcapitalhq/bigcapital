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
  UseGuards,
} from '@nestjs/common';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { SaleInvoiceResponseDto } from '@/modules/SaleInvoices/dtos/SaleInvoiceResponse.dto';
import { RecurringInvoicesApplication } from './RecurringInvoices.application';
import {
  CreateRecurringInvoiceDto,
  EditRecurringInvoiceDto,
} from './dtos/RecurringInvoice.dto';
import { GetRecurringInvoicesQueryDto } from './dtos/GetRecurringInvoicesQuery.dto';
import { GetRecurringInvoiceInvoicesQueryDto } from './dtos/GetRecurringInvoiceInvoicesQuery.dto';
import { RecurringInvoiceResponseDto } from './dtos/RecurringInvoiceResponse.dto';
import { RecurringInvoiceStateResponseDto } from './dtos/RecurringInvoiceState.dto';
import { RecurringInvoiceAction } from './RecurringInvoice.types';

@Controller('recurring-invoices')
@ApiTags('Recurring Invoices')
@ApiCommonHeaders()
@ApiExtraModels(RecurringInvoiceResponseDto)
@ApiExtraModels(RecurringInvoiceStateResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiExtraModels(SaleInvoiceResponseDto)
@UseGuards(AuthorizationGuard, PermissionGuard)
export class RecurringInvoicesController {
  constructor(
    private readonly recurringInvoicesApplication: RecurringInvoicesApplication,
  ) {}

  @Post()
  @RequirePermission(
    RecurringInvoiceAction.Create,
    AbilitySubject.RecurringInvoice,
  )
  @ApiOperation({ summary: 'Creates a new recurring invoice profile.' })
  @ApiBody({ type: CreateRecurringInvoiceDto })
  @ApiResponse({
    status: 201,
    description: 'The recurring invoice has been created.',
    type: RecurringInvoiceResponseDto,
  })
  createRecurringInvoice(
    @Body() recurringInvoiceDTO: CreateRecurringInvoiceDto,
  ) {
    return this.recurringInvoicesApplication.createRecurringInvoice(
      recurringInvoiceDTO,
    );
  }

  @Get()
  @RequirePermission(
    RecurringInvoiceAction.View,
    AbilitySubject.RecurringInvoice,
  )
  @ApiOperation({ summary: 'Retrieves recurring invoice profiles.' })
  @ApiResponse({
    status: 200,
    description: 'The recurring invoices have been retrieved.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(RecurringInvoiceResponseDto) },
            },
          },
        },
      ],
    },
  })
  getRecurringInvoices(@Query() filterDTO: GetRecurringInvoicesQueryDto) {
    return this.recurringInvoicesApplication.getRecurringInvoices(filterDTO);
  }

  @Get('state')
  @RequirePermission(
    RecurringInvoiceAction.View,
    AbilitySubject.RecurringInvoice,
  )
  @ApiOperation({ summary: 'Retrieves the recurring invoice form state.' })
  @ApiResponse({
    status: 200,
    description: 'The recurring invoice state has been retrieved.',
    type: RecurringInvoiceStateResponseDto,
  })
  getRecurringInvoiceState() {
    return this.recurringInvoicesApplication.getRecurringInvoiceState();
  }

  @Get(':id')
  @RequirePermission(
    RecurringInvoiceAction.View,
    AbilitySubject.RecurringInvoice,
  )
  @ApiOperation({ summary: 'Retrieves the given recurring invoice.' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The recurring invoice has been retrieved.',
    type: RecurringInvoiceResponseDto,
  })
  getRecurringInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.recurringInvoicesApplication.getRecurringInvoice(id);
  }

  @Put(':id')
  @RequirePermission(
    RecurringInvoiceAction.Edit,
    AbilitySubject.RecurringInvoice,
  )
  @ApiOperation({ summary: 'Edits the given recurring invoice.' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiBody({ type: EditRecurringInvoiceDto })
  @ApiResponse({
    status: 200,
    description: 'The recurring invoice has been updated.',
    type: RecurringInvoiceResponseDto,
  })
  editRecurringInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() recurringInvoiceDTO: EditRecurringInvoiceDto,
  ) {
    return this.recurringInvoicesApplication.editRecurringInvoice(
      id,
      recurringInvoiceDTO,
    );
  }

  @Delete(':id')
  @RequirePermission(
    RecurringInvoiceAction.Delete,
    AbilitySubject.RecurringInvoice,
  )
  @ApiOperation({ summary: 'Deletes the given recurring invoice.' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The recurring invoice has been deleted.',
  })
  deleteRecurringInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.recurringInvoicesApplication.deleteRecurringInvoice(id);
  }

  @Post(':id/pause')
  @RequirePermission(
    RecurringInvoiceAction.Edit,
    AbilitySubject.RecurringInvoice,
  )
  @ApiOperation({ summary: 'Pauses the given recurring invoice.' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The recurring invoice has been paused.',
    type: RecurringInvoiceResponseDto,
  })
  @HttpCode(200)
  pauseRecurringInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.recurringInvoicesApplication.pauseRecurringInvoice(id);
  }

  @Post(':id/resume')
  @RequirePermission(
    RecurringInvoiceAction.Edit,
    AbilitySubject.RecurringInvoice,
  )
  @ApiOperation({ summary: 'Resumes the given recurring invoice.' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The recurring invoice has been resumed.',
    type: RecurringInvoiceResponseDto,
  })
  @HttpCode(200)
  resumeRecurringInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.recurringInvoicesApplication.resumeRecurringInvoice(id);
  }

  @Post(':id/generate')
  @RequirePermission(
    RecurringInvoiceAction.Edit,
    AbilitySubject.RecurringInvoice,
  )
  @ApiOperation({
    summary: 'Generates an extra invoice immediately without rescheduling.',
  })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The invoice has been generated.',
    type: SaleInvoiceResponseDto,
  })
  @HttpCode(200)
  generateRecurringInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.recurringInvoicesApplication.generateNow(id);
  }

  @Get(':id/invoices')
  @RequirePermission(
    RecurringInvoiceAction.View,
    AbilitySubject.RecurringInvoice,
  )
  @ApiOperation({
    summary: 'Retrieves the invoices generated by the recurring profile.',
  })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The generated invoices have been retrieved.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(SaleInvoiceResponseDto) },
            },
          },
        },
      ],
    },
  })
  getRecurringInvoiceInvoices(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetRecurringInvoiceInvoicesQueryDto,
  ) {
    return this.recurringInvoicesApplication.getRecurringInvoiceInvoices(
      id,
      query,
    );
  }
}
