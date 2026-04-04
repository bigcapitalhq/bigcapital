import {
  Controller,
  Get,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ExchangeRateApplication } from './ExchangeRates.application';
import { ExchangeRateLatestQueryDto } from './dtos/ExchangeRateLatestQuery.dto';
import { ExchangeRateLatestResponseDto } from './dtos/ExchangeRateLatestResponse.dto';

interface RequestWithTenantId extends Request {
  tenantId: number;
}

@Controller('exchange-rates')
@ApiTags('Exchange Rates')
export class ExchangeRatesController {
  constructor(private readonly exchangeRateApp: ExchangeRateApplication) {}

  @Get('/latest')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiOperation({ summary: 'Get the latest exchange rate' })
  @ApiQuery({
    name: 'from_currency',
    description: 'Source currency code (ISO 4217)',
    required: false,
    type: String,
    example: 'USD',
  })
  @ApiQuery({
    name: 'to_currency',
    description: 'Target currency code (ISO 4217)',
    required: false,
    type: String,
    example: 'EUR',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved exchange rate',
    type: ExchangeRateLatestResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid currency code or service error',
  })
  async getLatestExchangeRate(
    @Query() query: ExchangeRateLatestQueryDto,
    @Req() req: RequestWithTenantId,
  ): Promise<ExchangeRateLatestResponseDto> {
    const tenantId = req.tenantId;

    const exchangeRate = await this.exchangeRateApp.latest(tenantId, {
      fromCurrency: query.from_currency,
      toCurrency: query.to_currency,
    });
    return exchangeRate;
  }
}
