import {
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { StripePaymentService } from './StripePaymentService';
import { events } from '@/common/events/events';
import {
  StripeCheckoutSessionCompletedEventPayload,
  StripeWebhookEventPayload,
} from './StripePayment.types';
import { PublicRoute } from '../Auth/guards/jwt.guard';

@Controller('/webhooks/stripe')
@ApiTags('stripe')
@PublicRoute()
export class StripePaymentWebhooksController {
  constructor(
    private readonly stripePaymentService: StripePaymentService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Handles incoming Stripe webhook events.
   * Verifies the webhook signature, processes the event based on its type,
   * and triggers appropriate actions or events in the system.
   * @param {Request} req - The Express request object containing the webhook payload.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>}
   */
  @Post('/')
  @HttpCode(200)
  @ApiOperation({ summary: 'Listen to Stripe webhooks' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      const rawBody = req.rawBody || req.body;
      const webhooksSecret = this.configService.get(
        'stripePayment.webhooksSecret',
      );
      if (!webhooksSecret) {
        throw new HttpException(
          'Stripe webhook secret is not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!signature) {
        throw new HttpException(
          'Stripe signature header is missing',
          HttpStatus.BAD_REQUEST,
        );
      }
      let event;

      // Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try {
        event = this.stripePaymentService.stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhooksSecret,
        );
      } catch (err) {
        throw new HttpException(
          `Webhook Error: ${err.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      // Handle the event based on its type
      switch (event.type) {
        case 'checkout.session.completed':
          // Triggers `onStripeCheckoutSessionCompleted` event.
          await this.eventEmitter.emitAsync(
            events.stripeWebhooks.onCheckoutSessionCompleted,
            {
              event,
            } as StripeCheckoutSessionCompletedEventPayload,
          );
          break;
        case 'account.updated':
          // Triggers `onStripeAccountUpdated` event.
          await this.eventEmitter.emitAsync(
            events.stripeWebhooks.onAccountUpdated,
            {
              event,
            } as StripeWebhookEventPayload,
          );
          break;

        // Add more cases as needed
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      return { received: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
