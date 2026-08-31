import { Response } from 'express';
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
  UseGuards,
} from '@nestjs/common';
import {
  ISaleInvoiceWriteoffDTO,
  SaleInvoiceMailState,
  SendInvoiceMailDTO,
} from './SaleInvoice.types';
import { SaleInvoiceApplication } from './SaleInvoices.application';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  CreateSaleInvoiceDto,
  EditSaleInvoiceDto,
} from './dtos/SaleInvoice.dto';
import { GetSaleInvoicesQueryDto } from './dtos/GetSaleInvoicesQuery.dto';
import { AcceptType } from '@/constants/accept-type';
import { SaleInvoiceResponseDto } from './dtos/SaleInvoiceResponse.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { SaleInvoiceStateResponseDto } from './dtos/SaleInvoiceState.dto';
import { GenerateSaleInvoiceSharableLinkResponseDto } from './dtos/GenerateSaleInvoiceSharableLinkResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { SaleInvoiceAction } from './SaleInvoice.types';
import { InvoicePaymentTransactionDto } from './dtos/InvoicePaymentTransactionResponse.dto';
import { SaleInvoiceHtmlContentResponseDto } from './dtos/SaleInvoiceHtmlResponse.dto';
import { SmsNotificationDetailsResponseDto } from '@/common/dtos/SmsNotificationDetailsResponse.dto';
import { NotifySaleInvoiceBySmsDto } from './dtos/NotifySaleInvoiceBySms.dto';

@Controller('sale-invoices')
@ApiTags('Sale Invoices')
@ApiExtraModels(SaleInvoiceResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiExtraModels(SaleInvoiceStateResponseDto)
@ApiExtraModels(GenerateSaleInvoiceSharableLinkResponseDto)
@ApiCommonHeaders()
@ApiExtraModels(ValidateBulkDeleteResponseDto)
@ApiExtraModels(InvoicePaymentTransactionDto)
@ApiExtraModels(SaleInvoiceHtmlContentResponseDto)
@ApiExtraModels(SmsNotificationDetailsResponseDto)
@UseGuards(AuthorizationGuard, PermissionGuard)
export class SaleInvoicesController {
  constructor(private saleInvoiceApplication: SaleInvoiceApplication) {}

  @Post('validate-bulk-delete')
  @RequirePermission(SaleInvoiceAction.Delete, AbilitySubject.SaleInvoice)
  @ApiOperation({
    summary:
      'Validates which sale invoices can be deleted and returns the results.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed with counts and IDs of deletable and non-deletable sale invoices.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  validateBulkDeleteSaleInvoices(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.saleInvoiceApplication.validateBulkDeleteSaleInvoices(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @RequirePermission(SaleInvoiceAction.Delete, AbilitySubject.SaleInvoice)
  @ApiOperation({ summary: 'Deletes multiple sale invoices.' })
  @ApiResponse({
    status: 200,
    description: 'Sale invoices deleted successfully',
  })
  bulkDeleteSaleInvoices(@Body() bulkDeleteDto: BulkDeleteDto): Promise<void> {
    return this.saleInvoiceApplication.bulkDeleteSaleInvoices(
      bulkDeleteDto.ids,
      { skipUndeletable: bulkDeleteDto.skipUndeletable ?? false },
    );
  }

  @Post()
  @RequirePermission(SaleInvoiceAction.Create, AbilitySubject.SaleInvoice)
  @ApiOperation({ summary: 'Create a new sale invoice.' })
  @ApiResponse({
    status: 201,
    description: 'Sale invoice created successfully',
  })
  createSaleInvoice(@Body() saleInvoiceDTO: CreateSaleInvoiceDto) {
    return this.saleInvoiceApplication.createSaleInvoice(saleInvoiceDTO);
  }

  @Post(':id/mail')
  @HttpCode(200)
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
  @RequirePermission(SaleInvoiceAction.Edit, AbilitySubject.SaleInvoice)
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
  @RequirePermission(SaleInvoiceAction.Delete, AbilitySubject.SaleInvoice)
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

  @Get('receivable')
  @RequirePermission(SaleInvoiceAction.View, AbilitySubject.SaleInvoice)
  @ApiOperation({ summary: 'Retrieves the receivable sale invoices.' })
  @ApiResponse({
    status: 200,
    description:
      'The receivable sale invoices have been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'The customer not found.' })
  @ApiQuery({
    name: 'customerId',
    required: false,
    type: Number,
    description: 'The customer id',
  })
  getReceivableSaleInvoices(@Query('customerId') customerId?: number) {
    return this.saleInvoiceApplication.getReceivableSaleInvoices(customerId);
  }

  @Get('state')
  @RequirePermission(SaleInvoiceAction.View, AbilitySubject.SaleInvoice)
  @ApiOperation({ summary: 'Retrieves the sale invoice state.' })
  @ApiResponse({
    status: 200,
    description: 'The sale invoice state has been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(SaleInvoiceStateResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  getSaleInvoiceState() {
    return this.saleInvoiceApplication.getSaleInvoiceState();
  }

  @Get(':id')
  @RequirePermission(SaleInvoiceAction.View, AbilitySubject.SaleInvoice)
  @ApiOperation({ summary: 'Retrieves the sale invoice details.' })
  @ApiResponse({
    status: 200,
    description: 'The sale invoice details have been successfully retrieved.',
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(SaleInvoiceResponseDto) },
      },
      'application/json+html': {
        schema: { $ref: getSchemaPath(SaleInvoiceHtmlContentResponseDto) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'The sale invoice not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  async getSaleInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Headers('accept') acceptHeader: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (acceptHeader?.includes(AcceptType.ApplicationPdf)) {
      const [pdfContent, filename] =
        await this.saleInvoiceApplication.saleInvoicePdf(id);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
      });
      res.send(pdfContent);
    } else if (acceptHeader?.includes(AcceptType.ApplicationTextHtml)) {
      const htmlContent = await this.saleInvoiceApplication.saleInvoiceHtml(id);
      return { htmlContent };
    } else {
      return this.saleInvoiceApplication.getSaleInvoice(id);
    }
  }

  @Get()
  @RequirePermission(SaleInvoiceAction.View, AbilitySubject.SaleInvoice)
  @ApiOperation({ summary: 'Retrieves the sale invoices.' })
  @ApiResponse({
    status: 200,
    description: 'The sale invoices have been successfully retrieved.',
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
  getSaleInvoices(@Query() filterDTO: GetSaleInvoicesQueryDto) {
    return this.saleInvoiceApplication.getSaleInvoices(filterDTO);
  }

  @Put(':id/deliver')
  @RequirePermission(SaleInvoiceAction.Edit, AbilitySubject.SaleInvoice)
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

  @Post(':id/writeoff')
  @RequirePermission(SaleInvoiceAction.Writeoff, AbilitySubject.SaleInvoice)
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
  @RequirePermission(SaleInvoiceAction.Writeoff, AbilitySubject.SaleInvoice)
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
  @RequirePermission(SaleInvoiceAction.View, AbilitySubject.SaleInvoice)
  @ApiOperation({ summary: 'Retrieves the sale invoice payments.' })
  @ApiResponse({
    status: 200,
    description: 'List of payment transactions for the invoice.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(InvoicePaymentTransactionDto) },
    },
  })
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

  @Get(':id/html')
  @RequirePermission(SaleInvoiceAction.View, AbilitySubject.SaleInvoice)
  @ApiOperation({ summary: 'Retrieves the sale invoice HTML.' })
  @ApiResponse({
    status: 200,
    description:
      'The sale invoice HTML content has been successfully retrieved.',
    schema: { type: 'string', example: '<html>...</html>' },
  })
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

  @Get(':id/mail')
  @RequirePermission(SaleInvoiceAction.View, AbilitySubject.SaleInvoice)
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

  @Post(':id/notify-by-sms')
  @RequirePermission(SaleInvoiceAction.NotifyBySms, AbilitySubject.SaleInvoice)
  @HttpCode(200)
  @ApiOperation({ summary: 'Notify the given sale invoice by SMS.' })
  @ApiBody({
    description: 'The sale invoice SMS notification options.',
    type: NotifySaleInvoiceBySmsDto,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'The sale invoice has been notified by SMS.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  notifySaleInvoiceBySms(
    @Param('id', ParseIntPipe) id: number,
    @Body() smsOptions: NotifySaleInvoiceBySmsDto,
  ) {
    return this.saleInvoiceApplication.notifySaleInvoiceBySms(id, {
      notification_key: smsOptions?.notification_key,
    });
  }

  @Get(':id/sms-details')
  @RequirePermission(SaleInvoiceAction.View, AbilitySubject.SaleInvoice)
  @ApiOperation({ summary: 'Retrieves the sale invoice SMS details.' })
  @ApiResponse({
    status: 200,
    description: 'The sale invoice SMS details have been retrieved.',
    schema: { $ref: getSchemaPath(SmsNotificationDetailsResponseDto) },
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  getSaleInvoiceSmsDetails(
    @Param('id', ParseIntPipe) id: number,
    @Query('notification_key') notificationKey?: string,
  ) {
    return this.saleInvoiceApplication.getSaleInvoiceSmsDetails(id, {
      notification_key: notificationKey,
    });
  }

  @Post(':id/generate-link')
  @RequirePermission(SaleInvoiceAction.Edit, AbilitySubject.SaleInvoice)
  @ApiOperation({
    summary: 'Generate sharable sale invoice link (private or public)',
  })
  @ApiResponse({
    status: 201,
    description: 'The link has been generated successfully.',
    schema: {
      $ref: getSchemaPath(GenerateSaleInvoiceSharableLinkResponseDto),
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale invoice id',
  })
  generateSaleInvoiceSharableLink(@Param('id', ParseIntPipe) id: number) {
    return this.saleInvoiceApplication.generateSaleInvoiceSharableLink(id);
  }
}
