import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
} from '@nestjs/common';
import { SaleEstimatesApplication } from './SaleEstimates.application';
import {
  ISalesEstimatesFilter,
  SaleEstimateMailOptionsDTO,
} from './types/SaleEstimates.types';
import { SaleEstimate } from './models/SaleEstimate';
import { PublicRoute } from '../Auth/Jwt.guard';
import {
  CreateSaleEstimateDto,
  EditSaleEstimateDto,
} from './dtos/SaleEstimate.dto';

@Controller('sale-estimates')
@ApiTags('sale-estimates')
@PublicRoute()
export class SaleEstimatesController {
  /**
   * @param {SaleEstimatesApplication} saleEstimatesApplication - Sale estimates application.
   */
  constructor(
    private readonly saleEstimatesApplication: SaleEstimatesApplication,
  ) {}

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
  })
  public getSaleEstimateState() {
    return this.saleEstimatesApplication.getSaleEstimateState();
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the sale estimates.' })
  @ApiResponse({
    status: 200,
    description: 'Sale estimates retrieved successfully',
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

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Retrieves the sale estimate PDF.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public getSaleEstimatePdf(@Param('id', ParseIntPipe) saleEstimateId: number) {
    return this.saleEstimatesApplication.getSaleEstimatePdf(saleEstimateId);
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
  @ApiOperation({ summary: 'Retrieves the sale estimate mail details.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public getSaleEstimateMail(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ) {
    return this.saleEstimatesApplication.getSaleEstimateMail(saleEstimateId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the sale estimate details.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The sale estimate id',
  })
  public getSaleEstimate(@Param('id', ParseIntPipe) estimateId: number) {
    return this.saleEstimatesApplication.getSaleEstimate(estimateId);
  }
}
