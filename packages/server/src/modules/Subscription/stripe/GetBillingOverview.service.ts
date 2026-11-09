import { Inject, Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import type Stripe from 'stripe';
import { formatNumber } from '@/utils/format-number';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { StripeBillingService } from './StripeBillingService';

export interface BillingOverviewInvoice {
  id: string;
  number: string | null;
  status: string | null;
  amount: number;
  amountFormatted: string;
  currency: string;
  createdAt: string;
  createdAtFormatted: string;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
}

export interface BillingOverview {
  customer: { email: string | null; name: string | null } | null;
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  upcomingInvoice: {
    amountDue: number;
    amountDueFormatted: string;
    currency: string;
    date: string;
    dateFormatted: string;
  } | null;
  invoices: BillingOverviewInvoice[];
}

@Injectable()
export class GetBillingOverviewService {
  private readonly logger = new Logger(GetBillingOverviewService.name);

  constructor(
    private readonly stripeBilling: StripeBillingService,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Retrieves payment method, upcoming invoice, and invoice history for the
   * current organization.
   */
  public async execute(): Promise<BillingOverview> {
    this.stripeBilling.assertBillingAvailable();

    const tenant = await this.tenancyContext.getTenant();
    const empty = {
      customer: null,
      paymentMethod: null,
      upcomingInvoice: null,
      invoices: [],
    } as BillingOverview;

    if (!tenant.stripeCustomerId) return empty;

    const subscription = await this.planSubscriptionModel
      .query()
      .findOne({ tenantId: tenant.id, slug: 'main' });

    const customer = await this.retrieveCustomer(tenant.stripeCustomerId);
    if (!customer) return empty;

    const paymentMethod = await this.resolvePaymentMethod(
      customer,
      subscription,
    );
    const invoices = await this.listInvoices(customer.id);
    const upcomingInvoice = await this.retrieveUpcomingInvoice(
      customer.id,
      subscription,
    );

    return {
      customer: {
        email: customer.email || null,
        name: customer.name || null,
      },
      paymentMethod,
      upcomingInvoice,
      invoices,
    };
  }

  private async retrieveCustomer(
    customerId: string,
  ): Promise<Stripe.Customer | null> {
    try {
      const customer = await this.stripeBilling.stripe.customers.retrieve(
        customerId,
        { expand: ['invoice_settings.default_payment_method'] },
      );
      if ((customer as Stripe.DeletedCustomer).deleted) return null;
      return customer as Stripe.Customer;
    } catch (error) {
      this.logger.warn(
        `Unable to retrieve Stripe customer ${customerId}: ${
          (error as Error).message
        }`,
      );
      return null;
    }
  }

  private async resolvePaymentMethod(
    customer: Stripe.Customer,
    subscription: PlanSubscription | undefined,
  ): Promise<BillingOverview['paymentMethod']> {
    let paymentMethod =
      (customer.invoice_settings
        ?.default_payment_method as Stripe.PaymentMethod) || null;

    if (!paymentMethod && subscription?.stripeSubscriptionId) {
      try {
        const stripeSubscription =
          await this.stripeBilling.stripe.subscriptions.retrieve(
            subscription.stripeSubscriptionId,
            { expand: ['default_payment_method'] },
          );
        paymentMethod =
          (stripeSubscription.default_payment_method as Stripe.PaymentMethod) ||
          null;
      } catch (error) {
        this.logger.warn(
          `Unable to retrieve the Stripe subscription payment method: ${
            (error as Error).message
          }`,
        );
      }
    }

    if (!paymentMethod?.card) return null;

    return {
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,
    };
  }

  private async listInvoices(
    customerId: string,
  ): Promise<BillingOverviewInvoice[]> {
    try {
      const invoices = await this.stripeBilling.stripe.invoices.list({
        customer: customerId,
        limit: 10,
      });

      return invoices.data.map((invoice) => ({
        id: invoice.id,
        number: invoice.number || null,
        status: invoice.status || null,
        amount: invoice.total,
        amountFormatted: this.formatCents(invoice.total, invoice.currency),
        currency: invoice.currency.toUpperCase(),
        createdAt: moment.unix(invoice.created).toISOString(),
        createdAtFormatted: moment.unix(invoice.created).format('MMM D, YYYY'),
        hostedInvoiceUrl: invoice.hosted_invoice_url || null,
        invoicePdf: invoice.invoice_pdf || null,
      }));
    } catch (error) {
      this.logger.warn(
        `Unable to list Stripe invoices for ${customerId}: ${
          (error as Error).message
        }`,
      );
      return [];
    }
  }

  private async retrieveUpcomingInvoice(
    customerId: string,
    subscription: PlanSubscription | undefined,
  ): Promise<BillingOverview['upcomingInvoice']> {
    try {
      const upcoming =
        await this.stripeBilling.stripe.invoices.retrieveUpcoming({
          customer: customerId,
          ...(subscription?.stripeSubscriptionId
            ? { subscription: subscription.stripeSubscriptionId }
            : {}),
        });

      const timestamp =
        upcoming.next_payment_attempt || upcoming.period_end || null;

      return {
        amountDue: upcoming.amount_due,
        amountDueFormatted: this.formatCents(
          upcoming.amount_due,
          upcoming.currency,
        ),
        currency: upcoming.currency.toUpperCase(),
        date: timestamp ? moment.unix(timestamp).toISOString() : '',
        dateFormatted: timestamp
          ? moment.unix(timestamp).format('MMM D, YYYY')
          : '',
      };
    } catch {
      return null;
    }
  }

  private formatCents(amount: number, currency: string): string {
    return formatNumber(amount / 100, {
      currencyCode: currency.toUpperCase(),
      money: true,
      precision: 2,
    });
  }
}
