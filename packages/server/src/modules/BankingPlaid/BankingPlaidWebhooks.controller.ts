import { Body, Controller, Post } from '@nestjs/common';
import { PlaidWebhookDto } from './dtos/PlaidItem.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlaidApplication } from './PlaidApplication';
import { PublicRoute } from '../Auth/guards/jwt.guard';
import { SetupPlaidItemTenantService } from './command/SetupPlaidItemTenant.service';

@Controller('banking/plaid')
@ApiTags('banking-plaid')
@PublicRoute()
export class BankingPlaidWebhooksController {
  constructor(
    private readonly plaidApplication: PlaidApplication,
    private readonly setupPlaidItemTenantService: SetupPlaidItemTenantService,
  ) {}

  @Post('webhooks')
  @ApiOperation({ summary: 'Listen to Plaid webhooks' })
  webhooks(@Body() { itemId, webhookType, webhookCode }: PlaidWebhookDto) {
    return this.setupPlaidItemTenantService.setupPlaidTenant(
      itemId,
      () => {
        return this.plaidApplication.webhooks(
          itemId,
          webhookType,
          webhookCode,
        );
      },
    );
  }
}
