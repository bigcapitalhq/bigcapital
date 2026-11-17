import { Command } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { BaseCommand } from './BaseCommand';
import { ensureStripeProductAndPrice } from '@/modules/Subscription/stripe/plan-sync.util';

const STRIPE_API_VERSION = '2024-06-20' as Stripe.LatestApiVersion;

@Injectable()
@Command({
  name: 'stripe:sync-plans',
  description:
    'Provision Stripe products and prices for the Bigcapital Cloud plan catalog.',
})
export class StripeSyncPlansCommand extends BaseCommand {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async run(): Promise<void> {
    const secretKey = this.configService.get<string>('stripeBilling.secretKey');

    if (!secretKey) {
      this.exit(
        'Stripe billing secret key is not configured. Set STRIPE_BILLING_SECRET_KEY.',
      );
    }

    const stripe = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
    const knex = this.initSystemKnex();

    const plans = await knex('subscription_plans')
      .where('active', true)
      .where('price', '>', 0)
      .whereNotNull('family_slug')
      .orderBy('id');

    let synced = 0;
    for (const plan of plans) {
      try {
        const { productId, priceId } = await ensureStripeProductAndPrice(
          stripe,
          plan,
        );
        await knex('subscription_plans').where('id', plan.id).update({
          stripe_product_id: productId,
          stripe_price_id: priceId,
        });
        this.log(`Synced ${plan.slug} -> ${productId} / ${priceId}`);
        synced++;
      } catch (error) {
        this.exit(
          `Failed to sync plan ${plan.slug}: ${(error as Error).message}`,
        );
      }
    }

    this.success(`Synced ${synced} subscription plans with Stripe.`);
  }
}
