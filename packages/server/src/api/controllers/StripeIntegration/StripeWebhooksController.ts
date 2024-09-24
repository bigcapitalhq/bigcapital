import { NextFunction, Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';
import bodyParser from 'body-parser';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { StripeWebhookEventPayload } from '@/interfaces/StripePayment';
import { StripePaymentService } from '@/services/StripePayment/StripePaymentService';
import events from '@/subscribers/events';
import config from '@/config';

@Service()
export class StripeWebhooksController {
  @Inject()
  private stripePaymentService: StripePaymentService;

  @Inject()
  private eventPublisher: EventPublisher;

  public router() {
    const router = Router();

    router.post(
      '/stripe',
      bodyParser.raw({ type: 'application/json' }),
      this.handleWebhook.bind(this)
    );
    return router;
  }

  /**
   * Handles incoming Stripe webhook events.
   * Verifies the webhook signature, processes the event based on its type,
   * and triggers appropriate actions or events in the system.
   *
   * @param {Request} req - The Express request object containing the webhook payload.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  private async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      let event = req.body;
      const sig = req.headers['stripe-signature'];

      // Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try {
        event = this.stripePaymentService.stripe.webhooks.constructEvent(
          req.rawBody,
          sig,
          config.stripePayment.webhooksSecret
        );
      } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      // Handle the event based on its type
      switch (event.type) {
        case 'checkout.session.completed':
          // Triggers `onStripeCheckoutSessionCompleted` event.
          this.eventPublisher.emitAsync(
            events.stripeWebhooks.onCheckoutSessionCompleted,
            {
              event,
            } as StripeWebhookEventPayload
          );
          break;
        case 'account.updated':
          this.eventPublisher.emitAsync(
            events.stripeWebhooks.onAccountUpdated,
            {
              event,
            } as StripeWebhookEventPayload
          );
          break;
        // Add more cases as needed
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  }
}
