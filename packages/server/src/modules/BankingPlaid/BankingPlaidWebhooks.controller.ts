import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlaidWebhookDto } from './dtos/PlaidItem.dto';
import { PlaidApplication } from './PlaidApplication';
import { PublicRoute } from '../Auth/guards/jwt.guard';
import { SetupPlaidItemTenantService } from './command/SetupPlaidItemTenant.service';
import { PlaidWebhookVerificationService } from './PlaidWebhookVerification.service';

@Controller('banking/plaid')
@ApiTags('banking-plaid')
@PublicRoute()
export class BankingPlaidWebhooksController {
  private readonly logger = new Logger(BankingPlaidWebhooksController.name);

  constructor(
    private readonly plaidApplication: PlaidApplication,
    private readonly setupPlaidItemTenantService: SetupPlaidItemTenantService,
    private readonly verificationService: PlaidWebhookVerificationService,
  ) {}

  @Post('webhooks')
  @HttpCode(200)
  @ApiOperation({ summary: 'Listen to Plaid webhooks' })
  async webhooks(
    @Req() req: RawBodyRequest<Request>,
    @Headers('plaid-verification') verification: string,
    @Body() { itemId, webhookType, webhookCode }: PlaidWebhookDto,
  ) {
    try {
      await this.verificationService.verifyWebhook(req.rawBody, verification);
    } catch (err) {
      this.logger.warn(`Plaid webhook verification failed: ${err.message}`);
      throw new BadRequestException('Invalid Plaid webhook signature');
    }
    return this.setupPlaidItemTenantService.setupPlaidTenant(itemId, () =>
      this.plaidApplication.webhooks(itemId, webhookType, webhookCode),
    );
  }
}
