import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { ERRORS } from '../types';

const STRIPE_API_VERSION = '2024-06-20' as Stripe.LatestApiVersion;

@Injectable()
export class StripeBillingService {
  private readonly logger = new Logger(StripeBillingService.name);
  private client: Stripe | null = null;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Whether the current deployment is Bigcapital Cloud.
   */
  public get isCloud(): boolean {
    return this.configService.get<boolean>('cloud.hostedOnCloud') === true;
  }

  /**
   * Throws when billing is requested on a self-hosted installation.
   */
  public assertBillingAvailable(): void {
    if (!this.isCloud) {
      throw new ServiceError(
        ERRORS.BILLING_NOT_AVAILABLE,
        'Billing is only available on Bigcapital Cloud.',
      );
    }
  }

  /**
   * Lazily initialized Stripe client. Keeping this lazy avoids creating a
   * client on self-hosted installations that never configure billing.
   */
  public get stripe(): Stripe {
    this.assertBillingAvailable();

    if (!this.client) {
      const secretKey = this.configService.get<string>(
        'stripeBilling.secretKey',
      );
      if (!secretKey) {
        throw new ServiceError(
          ERRORS.STRIPE_BILLING_NOT_CONFIGURED,
          'Stripe billing is not configured. Set STRIPE_BILLING_SECRET_KEY.',
        );
      }
      this.client = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
    }
    return this.client;
  }

  /**
   * Retrieves the tenant's Stripe customer, creating it when needed.
   */
  public async getOrCreateCustomer(
    tenant: TenantModel,
    user: SystemUser,
  ): Promise<Stripe.Customer> {
    this.assertBillingAvailable();
    const stripe = this.stripe;

    if (tenant.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(
          tenant.stripeCustomerId,
        );
        if (!(customer as Stripe.DeletedCustomer).deleted) {
          return customer as Stripe.Customer;
        }
      } catch (error) {
        this.logger.warn(
          `Unable to retrieve Stripe customer ${tenant.stripeCustomerId}: ${
            (error as Error).message
          }`,
        );
      }
    }

    const customer = await stripe.customers.create(
      {
        email: user.email,
        name:
          tenant.metadata?.name ||
          [user.firstName, user.lastName].filter(Boolean).join(' ') ||
          user.email,
        metadata: {
          tenantId: String(tenant.id),
          organizationId: tenant.organizationId,
        },
      },
      { idempotencyKey: `bigcapital-customer-${tenant.id}` },
    );

    await tenant.$query().patch({ stripeCustomerId: customer.id } as never);

    return customer;
  }

  /**
   * Creates a Stripe Customer Portal session.
   */
  public async createPortalSession(
    customerId: string,
  ): Promise<Stripe.BillingPortal.Session> {
    this.assertBillingAvailable();

    const baseUrl =
      this.configService.get<string>('app.baseUrl') || 'http://localhost:4000';
    const returnUrl = `${baseUrl}/preferences/billing`;
    const configuration = this.configService.get<string>(
      'stripeBilling.portalConfigurationId',
    );

    return this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      ...(configuration ? { configuration } : {}),
    });
  }
}
