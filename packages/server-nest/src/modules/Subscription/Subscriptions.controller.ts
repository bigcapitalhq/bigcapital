import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Next,
  UseGuards,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SubscriptionApplication } from './SubscriptionApplication';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { Subscription } from './Subscription';
import { LemonSqueezy } from './LemonSqueezy';

@Controller('subscription')
@ApiTags('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionService: Subscription,
    private readonly lemonSqueezyService: LemonSqueezy,
    private readonly subscriptionApp: SubscriptionApplication,
  ) {}

  /**
   * Retrieve all subscriptions of the authenticated user's tenant.
   */
  @Get()
  @ApiOperation({ summary: 'Get all subscriptions for the current tenant' })
  @ApiResponse({
    status: 200,
    description: 'List of subscriptions retrieved successfully',
  })
  async getSubscriptions(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const tenantId = req.headers['organization-id'] as string;
    const subscriptions =
      await this.subscriptionService.getSubscriptions(tenantId);

    return res.status(200).send({ subscriptions });
  }

  /**
   * Retrieves the LemonSqueezy checkout url.
   */
  @Post('lemon/checkout_url')
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
  async getCheckoutUrl(
    @Body('variantId') variantId: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const user = req.user;
    const checkout = await this.lemonSqueezyService.getCheckout(
      variantId,
      user,
    );
    return res.status(200).send(checkout);
  }

  /**
   * Cancels the subscription of the current organization.
   */
  @Post('cancel')
  @ApiOperation({ summary: 'Cancel the current organization subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription canceled successfully',
  })
  async cancelSubscription(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const tenantId = req.headers['organization-id'] as string;
    await this.subscriptionApp.cancelSubscription(tenantId);

    return res.status(200).send({
      status: 200,
      message: 'The organization subscription has been canceled.',
    });
  }

  /**
   * Resumes the subscription of the current organization.
   */
  @Post('resume')
  @ApiOperation({ summary: 'Resume the current organization subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription resumed successfully',
  })
  async resumeSubscription(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const tenantId = req.headers['organization-id'] as string;
    await this.subscriptionApp.resumeSubscription(tenantId);

    return res.status(200).send({
      status: 200,
      message: 'The organization subscription has been resumed.',
    });
  }

  /**
   * Changes the main subscription plan of the current organization.
   */
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
  async changeSubscriptionPlan(
    @Body('variant_id') variantId: number,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const tenantId = req.headers['organization-id'] as string;
    await this.subscriptionApp.changeSubscriptionPlan(tenantId, variantId);

    return res.status(200).send({
      message: 'The subscription plan has been changed.',
    });
  }
}
