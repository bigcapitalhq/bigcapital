import { StripePaymentService } from '@/services/StripePayment/StripePaymentService';
import { NextFunction, Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';
import config from '@/config';
import bodyParser from 'body-parser';
import { SaleInvoiceStripePaymentLink } from '@/services/StripePayment/SaleInvoiceStripePaymentLink';
import { CreatePaymentReceiveStripePayment } from '@/services/StripePayment/CreatePaymentReceivedStripePayment';

@Service()
export class StripeWebhooksController {
  @Inject()
  private stripePaymentService: StripePaymentService;

  @Inject()
  private createPaymentReceiveStripePayment: CreatePaymentReceiveStripePayment;

  router() {
    const router = Router();

    router.post(
      '/stripe',
      bodyParser.raw({ type: 'application/json' }),
      this.handleWebhook.bind(this)
    );
    return router;
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public async handleWebhook(req: Request, res: Response, next: NextFunction) {
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
          const { metadata } = event.data.object;
          const tenantId = parseInt(metadata.tenantId, 10);
          const saleInvoiceId = parseInt(metadata.saleInvoiceId, 10);

          // Get the amount from the event
          const amount = event.data.object.amount_total;

          // Convert from Stripe amount (cents) to normal amount (dollars)
          const amountInDollars = amount / 100;

          await this.createPaymentReceiveStripePayment.createPaymentReceived(
            tenantId,
            saleInvoiceId,
            amountInDollars
          );
          break;
        case 'payment_intent.payment_failed':
          // Handle failed payment intent
          console.log('PaymentIntent failed.');
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
