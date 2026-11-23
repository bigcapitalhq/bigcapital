import {
  Controller,
  Headers,
  HttpCode,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PublicRoute } from '@/modules/Auth/guards/jwt.guard';
import { StripeBillingWebhooksService } from './StripeBillingWebhooks.service';

@Controller('/webhooks/stripe-billing')
@ApiTags('stripe')
@PublicRoute()
export class StripeBillingWebhooksController {
  constructor(
    private readonly stripeBillingWebhooks: StripeBillingWebhooksService,
  ) {}

  /**
   * Receives Stripe Billing webhook events.
   */
  @Post('/')
  @HttpCode(200)
  @ApiOperation({ summary: 'Listen to Stripe Billing webhooks' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody || req.body;
    await this.stripeBillingWebhooks.handle(rawBody, signature);

    return { received: true };
  }
}
