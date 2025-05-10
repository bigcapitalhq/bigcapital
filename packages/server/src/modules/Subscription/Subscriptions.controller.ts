import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Next,
  HttpCode,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SubscriptionApplication } from './SubscriptionApplication';

@Controller('subscription')
@ApiTags('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionApp: SubscriptionApplication) {}

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions for the current tenant' })
  @ApiResponse({
    status: 200,
    description: 'List of subscriptions retrieved successfully',
  })
  @HttpCode(200)
  async getSubscriptions() {
    const subscriptions = await this.subscriptionApp.getSubscriptions();

    return { subscriptions };
  }

  @Post('lemon/checkout_url')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get LemonSqueezy checkout URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        variantId: {
          type: 'string',
          description: 'The variant ID for the subscription plan',
        },
      },
      required: ['variantId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout URL retrieved successfully',
  })
  async getCheckoutUrl(@Body('variantId') variantId: number) {
    const checkout =
      await this.subscriptionApp.getLemonSqueezyCheckoutUri(variantId);

    return checkout;
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Cancel the current organization subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription canceled successfully',
  })
  async cancelSubscription(@Req() req: Request, @Next() next: NextFunction) {
    const tenantId = req.headers['organization-id'] as string;
    await this.subscriptionApp.cancelSubscription(tenantId);

    return {
      status: 200,
      message: 'The organization subscription has been canceled.',
    };
  }

  @Post('resume')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resume the current organization subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription resumed successfully',
  })
  async resumeSubscription(@Req() req: Request, @Next() next: NextFunction) {
    const tenantId = req.headers['organization-id'] as string;
    await this.subscriptionApp.resumeSubscription(tenantId);

    return {
      status: 200,
      message: 'The organization subscription has been resumed.',
    };
  }

  @Post('change')
  @ApiOperation({
    summary: 'Change the subscription plan of the current organization',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        variant_id: {
          type: 'number',
          description: 'The variant ID for the new subscription plan',
        },
      },
      required: ['variant_id'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription plan changed successfully',
  })
  async changeSubscriptionPlan(@Body('variant_id') variantId: number) {
    await this.subscriptionApp.changeSubscriptionPlan(variantId);

    return {
      message: 'The subscription plan has been changed.',
    };
  }
}
