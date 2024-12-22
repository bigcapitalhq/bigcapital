import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SaleEstimatesApplication } from './SaleEstimates.application';
import {
  ISaleEstimateDTO,
  // ISalesEstimatesFilter,
  // SaleEstimateMailOptionsDTO,
} from './types/SaleEstimates.types';
import { SaleEstimate } from './models/SaleEstimate';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('sales/estimates')
@PublicRoute()
export class SaleEstimatesController {
  /**
   * @param {SaleEstimatesApplication} saleEstimatesApplication - Sale estimates application.
   */
  constructor(
    private readonly saleEstimatesApplication: SaleEstimatesApplication,
  ) {}

  @Post()
  public createSaleEstimate(
    @Body() estimateDTO: ISaleEstimateDTO,
  ): Promise<SaleEstimate> {
    return this.saleEstimatesApplication.createSaleEstimate(estimateDTO);
  }

  @Put(':id')
  public editSaleEstimate(
    @Param('id', ParseIntPipe) estimateId: number,
    @Body() estimateDTO: ISaleEstimateDTO,
  ): Promise<SaleEstimate> {
    return this.saleEstimatesApplication.editSaleEstimate(
      estimateId,
      estimateDTO,
    );
  }

  @Delete(':id')
  public deleteSaleEstimate(
    @Param('id', ParseIntPipe) estimateId: number,
  ): Promise<void> {
    return this.saleEstimatesApplication.deleteSaleEstimate(estimateId);
  }

  @Get(':id')
  public getSaleEstimate(@Param('id', ParseIntPipe) estimateId: number) {
    return this.saleEstimatesApplication.getSaleEstimate(estimateId);
  }

  // @Get()
  // public getSaleEstimates(@Query() filterDTO: ISalesEstimatesFilter) {
  //   return this.saleEstimatesApplication.getSaleEstimates(filterDTO);
  // }

  @Post(':id/deliver')
  public deliverSaleEstimate(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ): Promise<void> {
    return this.saleEstimatesApplication.deliverSaleEstimate(saleEstimateId);
  }

  @Post(':id/approve')
  public approveSaleEstimate(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ): Promise<void> {
    return this.saleEstimatesApplication.approveSaleEstimate(saleEstimateId);
  }

  @Post(':id/reject')
  public rejectSaleEstimate(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ): Promise<void> {
    return this.saleEstimatesApplication.rejectSaleEstimate(saleEstimateId);
  }

  @Post(':id/notify-sms')
  public notifySaleEstimateBySms(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ) {
    return this.saleEstimatesApplication.notifySaleEstimateBySms(
      saleEstimateId,
    );
  }

  @Get(':id/sms-details')
  public getSaleEstimateSmsDetails(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ) {
    return this.saleEstimatesApplication.getSaleEstimateSmsDetails(
      saleEstimateId,
    );
  }

  @Get(':id/pdf')
  public getSaleEstimatePdf(@Param('id', ParseIntPipe) saleEstimateId: number) {
    return this.saleEstimatesApplication.getSaleEstimatePdf(saleEstimateId);
  }

  // @Post(':id/mail')
  // public sendSaleEstimateMail(
  //   @Param('id', ParseIntPipe) saleEstimateId: number,
  //   @Body() mailOptions: SaleEstimateMailOptionsDTO,
  // ) {
  //   return this.saleEstimatesApplication.sendSaleEstimateMail(
  //     saleEstimateId,
  //     mailOptions,
  //   );
  // }

  @Get(':id/mail')
  public getSaleEstimateMail(
    @Param('id', ParseIntPipe) saleEstimateId: number,
  ) {
    return this.saleEstimatesApplication.getSaleEstimateMail(saleEstimateId);
  }

  @Get('state')
  public getSaleEstimateState() {
    return this.saleEstimatesApplication.getSaleEstimateState();
  }
}
