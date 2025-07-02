import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { CurrenciesApplication } from './CurrenciesApplication.service';
import { CreateCurrencyDto } from './dtos/CreateCurrency.dto';
import { EditCurrencyDto } from './dtos/EditCurrency.dto';
import { CurrencyResponseDto } from './dtos/CurrencyResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@ApiTags('Currencies')
@Controller('/currencies')
@ApiExtraModels(CurrencyResponseDto)
@ApiCommonHeaders()
export class CurrenciesController {
  constructor(private readonly currenciesApp: CurrenciesApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new currency' })
  @ApiBody({ type: CreateCurrencyDto })
  @ApiCreatedResponse({
    description: 'The currency has been successfully created.',
    schema: {
      $ref: getSchemaPath(CurrencyResponseDto),
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  create(@Body() dto: CreateCurrencyDto) {
    return this.currenciesApp.createCurrency(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit an existing currency' })
  @ApiParam({ name: 'id', type: Number, description: 'Currency ID' })
  @ApiBody({ type: EditCurrencyDto })
  @ApiOkResponse({
    description: 'The currency has been successfully updated.',
    schema: {
      $ref: getSchemaPath(CurrencyResponseDto),
    },
  })
  @ApiNotFoundResponse({ description: 'Currency not found.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  edit(@Param('id') id: number, @Body() dto: EditCurrencyDto) {
    return this.currenciesApp.editCurrency(id, dto);
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Delete a currency by code' })
  @ApiParam({ name: 'code', type: String, description: 'Currency code' })
  @ApiOkResponse({ description: 'The currency has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Currency not found.' })
  delete(@Param('code') code: string) {
    return this.currenciesApp.deleteCurrency(code);
  }

  @Get()
  @ApiOperation({ summary: 'Get all currencies' })
  @ApiOkResponse({
    description: 'List of all currencies.',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(CurrencyResponseDto),
      },
    },
  })
  findAll() {
    return this.currenciesApp.getCurrencies();
  }

  @Get(':currencyCode')
  @ApiOperation({ summary: 'Get a currency by code' })
  @ApiParam({
    name: 'currencyCode',
    type: String,
    description: 'Currency code',
  })
  @ApiOkResponse({
    description: 'The currency details.',
    schema: {
      $ref: getSchemaPath(CurrencyResponseDto),
    },
  })
  @ApiNotFoundResponse({ description: 'Currency not found.' })
  findOne(@Param('currencyCode') currencyCode: string) {
    return this.currenciesApp.getCurrency(currencyCode);
  }
}
