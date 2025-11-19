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
  Body,
  Controller,
  Delete,
  Get,
  DefaultValuePipe,
  Headers,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { SaleEstimatesApplication } from './SaleEstimates.application';
import {
  ISalesEstimatesFilter,
  SaleEstimateMailOptionsDTO,
} from './types/SaleEstimates.types';
import { SaleEstimate } from './models/SaleEstimate';
import {
  CreateSaleEstimateDto,
  EditSaleEstimateDto,
} from './dtos/SaleEstimate.dto';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';
import { SaleEstimateResponseDto } from './dtos/SaleEstimateResponse.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { SaleEstiamteStateResponseDto } from './dtos/SaleEstimateStateResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';

@Controller('sale-estimates')
@ApiTags('Sale Estimates')
@ApiExtraModels(SaleEstimateResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiExtraModels(SaleEstiamteStateResponseDto)
@ApiCommonHeaders()
@ApiExtraModels(ValidateBulkDeleteResponseDto)
export class SaleEstimatesController {
  @Post('validate-bulk-delete')
  @ApiOperation({
    summary:
      'Validates which sale estimates can be deleted and returns the results.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed with counts and IDs of deletable and non-deletable sale estimates.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  public validateBulkDeleteSaleEstimates(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.saleEstimatesApplication.validateBulkDeleteSaleEstimates(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Deletes multiple sale estimates.' })
  @ApiQuery({
    name: 'skip_undeletable',
    required: false,
    type: Boolean,
    description:
      'When true, undeletable estimates will be skipped and only deletable ones will be removed.',
  })
  @ApiResponse({
    status: 200,
    description: 'Sale estimates deleted successfully',
  })
  public bulkDeleteSaleEstimates(
    @Body() bulkDeleteDto: BulkDeleteDto,
    @Query('skip_undeletable', new DefaultValuePipe(false), ParseBoolPipe)
    skipUndeletable: boolean,
  ): Promise<void> {
    return this.saleEstimatesApplication.bulkDeleteSaleEstimates(
      bulkDeleteDto.ids,
      { skipUndeletable },
    );
  }

  /**
   * @param {SaleEstimatesApplication} saleEstimatesApplication - Sale estimates application.
   */
  constructor(
    private readonly saleEstimatesApplication: SaleEstimatesApplication,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new sale estimate.' })
  @ApiResponse({
    status: 200,
    description: 'Sale estimate created successfully',
  })
  public createSaleEstimate(
    @Body() estimateDTO: CreateSaleEstimateDto,
  ): Promise<SaleEstimate> {
    return this.saleEstimatesApplication.createSaleEstimate(estimateDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given sale estimate.' })
  @ApiResponse({
    status: 200,
    description: 'Sale estimate edited successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Sale estimate not found',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public editSaleEstimate(
    @Param('id', ParseIntPipe) estimateId: number,
    @Body() estimateDTO: EditSaleEstimateDto,
  ): Promise<SaleEstimate> {
    return this.saleEstimatesApplication.editSaleEstimate(
      estimateId,
      estimateDTO,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given sale estimate.' })
  @ApiResponse({
    status: 200,
    description: 'Sale estimate deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Sale estimate not found',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public deleteSaleEstimate(
    @Param('id', ParseIntPipe) estimateId: number,
  ): Promise<void> {
    return this.saleEstimatesApplication.deleteSaleEstimate(estimateId);
  }

  @Get('state')
  @ApiOperation({ summary: 'Retrieves the sale estimate state.' })
  @ApiResponse({
    status: 200,
    description: 'Sale estimate state retrieved successfully',
    schema: {
      $ref: getSchemaPath(SaleEstiamteStateResponseDto),
    },
  })
  public getSaleEstimateState() {
    return this.saleEstimatesApplication.getSaleEstimateState();
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the sale estimates.' })
  @ApiResponse({
    status: 200,
    description: 'Sale estimates retrieved successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(SaleEstimateResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(SaleEstimateResponseDto) },
            },
          },
        },
      ],
    },
  })
  public getSaleEstimates(@Query() filterDTO: ISalesEstimatesFilter) {
    return this.saleEstimatesApplication.getSaleEstimates(filterDTO);
  }

  @Post(':id/deliver')
  @ApiOperation({ summary: 'Deliver the given sale estimate.' })
  @ApiResponse({
    status: 200,
    description: 'Sale estimate delivered successfully',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public deliverSaleEstimate(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ): Promise<void> {
    return this.saleEstimatesApplication.deliverSaleEstimate(saleEstimateId);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve the given sale estimate.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public approveSaleEstimate(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ): Promise<void> {
    return this.saleEstimatesApplication.approveSaleEstimate(saleEstimateId);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject the given sale estimate.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public rejectSaleEstimate(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ): Promise<void> {
    return this.saleEstimatesApplication.rejectSaleEstimate(saleEstimateId);
  }

  @Post(':id/notify-sms')
  @ApiOperation({ summary: 'Notify the given sale estimate by SMS.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public notifySaleEstimateBySms(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ) {
    return this.saleEstimatesApplication.notifySaleEstimateBySms(
      saleEstimateId,
    );
  }

  @Get(':id/sms-details')
  @ApiOperation({ summary: 'Retrieves the sale estimate SMS details.' })
  public getSaleEstimateSmsDetails(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ) {
    return this.saleEstimatesApplication.getSaleEstimateSmsDetails(
      saleEstimateId,
    );
  }

  @Post(':id/mail')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send the given sale estimate by mail.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public sendSaleEstimateMail(
    @Param('id', ParseIntPipe) saleEstimateId: number,
    @Body() mailOptions: SaleEstimateMailOptionsDTO,
  ) {
    return this.saleEstimatesApplication.sendSaleEstimateMail(
      saleEstimateId,
      mailOptions,
    );
  }

  @Get(':id/mail')
  @ApiOperation({ summary: 'Retrieves the sale estimate mail state.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public getSaleEstimateMail(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ) {
    return this.saleEstimatesApplication.getSaleEstimateMailState(
      saleEstimateId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieves the sale estimate details.',
  })
  @ApiResponse({
    status: 200,
    description: 'The sale estimate details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(SaleEstimateResponseDto),
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public async getSaleEstimate(
    @Param('id', ParseIntPipe) estimateId: number,
    @Headers('accept') acceptHeader: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent =
        await this.saleEstimatesApplication.getSaleEstimatePdf(estimateId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else if (acceptHeader.includes(AcceptType.ApplicationTextHtml)) {
      const htmlContent =
        await this.saleEstimatesApplication.getSaleEstimateHtml(estimateId);

      return { htmlContent };
    } else {
      return this.saleEstimatesApplication.getSaleEstimate(estimateId);
    }
  }
}
