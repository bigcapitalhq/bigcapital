import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
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
} from '@nestjs/common';
import { PaymentReceivesApplication } from './PaymentReceived.application';
import {
  IPaymentsReceivedFilter,
  PaymentReceiveMailOptsDTO,
} from './types/PaymentReceived.types';
import {
  CreatePaymentReceivedDto,
  EditPaymentReceivedDto,
} from './dtos/PaymentReceived.dto';
import { AcceptType } from '@/constants/accept-type';
import { PaymentReceivedResponseDto } from './dtos/PaymentReceivedResponse.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { PaymentReceivedStateResponseDto } from './dtos/PaymentReceivedStateResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';

@Controller('payments-received')
@ApiTags('Payments Received')
@ApiExtraModels(PaymentReceivedResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiExtraModels(PaymentReceivedStateResponseDto)
@ApiExtraModels(ValidateBulkDeleteResponseDto)
@ApiCommonHeaders()
export class PaymentReceivesController {
  constructor(private paymentReceivesApplication: PaymentReceivesApplication) { }

  @Post(':id/mail')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The payment receive mail has been successfully sent.',
  })
  public sendPaymentReceiveMail(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
    @Body() messageOpts: PaymentReceiveMailOptsDTO,
  ) {
    return this.paymentReceivesApplication.notifyPaymentByMail(
      paymentReceiveId,
      messageOpts,
    );
  }

  @Get(':id/edit-page')
  @ApiResponse({
    status: 200,
    description:
      'The payment received edit page has been successfully retrieved.',
  })
  public getPaymentReceiveEditPage(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.getPaymentReceivedEditPage(
      paymentReceiveId,
    );
  }

  @Get(':id/mail')
  @ApiResponse({
    status: 200,
    description:
      'The payment receive mail options have been successfully retrieved.',
  })
  public getPaymentReceiveMailOptions(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.getPaymentMailOptions(
      paymentReceiveId,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new payment received.' })
  public createPaymentReceived(
    @Body() paymentReceiveDTO: CreatePaymentReceivedDto,
  ) {
    return this.paymentReceivesApplication.createPaymentReceived(
      paymentReceiveDTO,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given payment received.' })
  public editPaymentReceive(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
    @Body() paymentReceiveDTO: EditPaymentReceivedDto,
  ) {
    return this.paymentReceivesApplication.editPaymentReceive(
      paymentReceiveId,
      paymentReceiveDTO,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given payment received.' })
  public deletePaymentReceive(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.deletePaymentReceive(
      paymentReceiveId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the payment received list.' })
  @ApiResponse({
    status: 200,
    description: 'The payment received has been retrieved successfully.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(PaymentReceivedResponseDto) },
            },
          },
        },
      ],
    },
  })
  public getPaymentsReceived(
    @Query() filterDTO: Partial<IPaymentsReceivedFilter>,
  ) {
    return this.paymentReceivesApplication.getPaymentsReceived(filterDTO);
  }

  @Post('validate-bulk-delete')
  @ApiOperation({
    summary:
      'Validates which payments received can be deleted and returns the results.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed with counts and IDs of deletable and non-deletable payments received.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  public validateBulkDeletePaymentsReceived(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.paymentReceivesApplication.validateBulkDeletePaymentReceives(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Deletes multiple payments received.' })
  @ApiResponse({
    status: 200,
    description: 'Payments received deleted successfully.',
  })
  public bulkDeletePaymentsReceived(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.paymentReceivesApplication.bulkDeletePaymentReceives(
      bulkDeleteDto.ids,
    );
  }

  @Get('state')
  @ApiOperation({ summary: 'Retrieves the payment received state.' })
  @ApiResponse({
    status: 200,
    description: 'The payment received state has been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(PaymentReceivedStateResponseDto),
    },
  })
  public getPaymentReceivedState() {
    return this.paymentReceivesApplication.getPaymentReceivedState();
  }

  @Get(':id/invoices')
  @ApiOperation({ summary: 'Retrieves the payment received invoices.' })
  @ApiResponse({
    status: 200,
    description:
      'The payment received invoices have been successfully retrieved.',
  })
  public getPaymentReceiveInvoices(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
  ) {
    return this.paymentReceivesApplication.getPaymentReceiveInvoices(
      paymentReceiveId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the payment received details.' })
  @ApiResponse({
    status: 200,
    description:
      'The payment received details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(PaymentReceivedResponseDto),
    },
  })
  public async getPaymentReceive(
    @Param('id', ParseIntPipe) paymentReceiveId: number,
    @Headers('accept') acceptHeader: string,
  ) {
    if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      return this.paymentReceivesApplication.getPaymentReceivePdf(
        paymentReceiveId,
      );
    } else if (acceptHeader.includes(AcceptType.ApplicationTextHtml)) {
      const htmlContent =
        await this.paymentReceivesApplication.getPaymentReceivedHtml(
          paymentReceiveId,
        );
      return { htmlContent };
    } else {
      return this.paymentReceivesApplication.getPaymentReceive(
        paymentReceiveId,
      );
    }
  }
}
