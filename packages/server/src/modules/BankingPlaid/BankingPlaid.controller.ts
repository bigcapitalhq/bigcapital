import { Body, Controller, Post } from '@nestjs/common';
import { PlaidApplication } from './PlaidApplication';
import { PlaidItemDto } from './dtos/PlaidItem.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('banking/plaid')
@ApiTags('Banking Plaid')
export class BankingPlaidController {
  constructor(private readonly plaidApplication: PlaidApplication) {}

  @Post('link-token')
  @ApiOperation({ summary: 'Get Plaid link token' })
  getLinkToken() {
    return this.plaidApplication.getLinkToken();
  }

  @Post('exchange-token')
  @ApiOperation({ summary: 'Exchange Plaid access token' })
  exchangeToken(@Body() itemDTO: PlaidItemDto) {
    return this.plaidApplication.exchangeToken(itemDTO);
  }
}
