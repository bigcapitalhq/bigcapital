import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bill } from '@/modules/Bills/models/Bill';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { Plan } from '../models/Plan';
import { PlanSubscription } from '../models/PlanSubscription';
import { ERRORS } from '../types';

export type FreePlanLimitedResource = 'invoice' | 'bill';

export interface SubscriptionUsageResource {
  used: number;
  limit: number | null;
}

export interface SubscriptionUsage {
  plan: 'free' | 'paid';
  invoices: SubscriptionUsageResource;
  bills: SubscriptionUsageResource;
}

type SubscriptionWithPlan = PlanSubscription & { plan?: Plan };

@Injectable()
export class SubscriptionLimitsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,

    @Inject(Bill.name)
    private readonly billModel: TenantModelProxy<typeof Bill>,
  ) {}

  /**
   * Whether the current organization is on the Cloud free plan. Self-hosted
   * installations never have free-plan limits.
   */
  public async isFreePlan(): Promise<boolean> {
    if (this.configService.get<boolean>('cloud.hostedOnCloud') !== true) {
      return false;
    }
    return !(await this.hasPaidSubscription());
  }

  /**
   * The current free-plan usage and limits. Paid organizations report no limit.
   */
  public async getUsage(): Promise<SubscriptionUsage> {
    const [isFree, invoicesUsed, billsUsed] = await Promise.all([
      this.isFreePlan(),
      this.countInvoices(),
      this.countBills(),
    ]);
    return {
      plan: isFree ? 'free' : 'paid',
      invoices: {
        used: invoicesUsed,
        limit: isFree ? this.getInvoiceLimit() : null,
      },
      bills: {
        used: billsUsed,
        limit: isFree ? this.getBillLimit() : null,
      },
    };
  }

  /**
   * Throws when a free organization cannot create another sale invoice.
   */
  public async assertCanCreateInvoice(): Promise<void> {
    if (!(await this.isFreePlan())) return;

    const used = await this.countInvoices();
    this.assertWithinLimit('invoice', used, this.getInvoiceLimit());
  }

  /**
   * Throws when a free organization cannot create another bill.
   */
  public async assertCanCreateBill(): Promise<void> {
    if (!(await this.isFreePlan())) return;

    const used = await this.countBills();
    this.assertWithinLimit('bill', used, this.getBillLimit());
  }

  /**
   * Detects an active subscription linked to a paid plan.
   */
  private async hasPaidSubscription(): Promise<boolean> {
    const tenant = await this.tenancyContext.getTenant().catch(() => undefined);
    if (!tenant) return false;

    const subscription = (await this.planSubscriptionModel
      .query()
      .findOne({ tenantId: tenant.id, slug: 'main' })
      .withGraphFetched('plan')) as SubscriptionWithPlan | undefined;

    if (!subscription?.active()) return false;

    const hasBillingProvider = !!(
      subscription.stripeSubscriptionId || subscription.lemonSubscriptionId
    );
    const isPaidPlan = Number(subscription.plan?.price || 0) > 0;

    return hasBillingProvider || isPaidPlan;
  }

  /**
   * Counts the sale invoices that currently exist for the tenant.
   */
  private countInvoices(): Promise<number> {
    return this.saleInvoiceModel().query().resultSize();
  }

  /**
   * Counts the bills that currently exist for the tenant.
   */
  private countBills(): Promise<number> {
    return this.billModel().query().resultSize();
  }

  /**
   * Throws a typed limit error when the resource is at capacity.
   */
  private assertWithinLimit(
    resource: FreePlanLimitedResource,
    used: number,
    limit: number,
  ): void {
    if (used < limit) return;

    const label = resource === 'invoice' ? 'invoices' : 'bills';
    const message = `Your free plan allows up to ${limit} ${label}. Upgrade to Go to create more.`;

    throw new BadRequestException({
      statusCode: 400,
      message,
      errors: [
        {
          type: ERRORS.FREE_PLAN_LIMIT_REACHED,
          message,
          payload: { resource, used, limit },
        },
      ],
    });
  }

  /**
   * Maximum number of sale invoices on the free plan.
   */
  private getInvoiceLimit(): number {
    return this.configService.get<number>('cloud.freePlan.invoiceLimit') || 5;
  }

  /**
   * Maximum number of bills on the free plan.
   */
  private getBillLimit(): number {
    return this.configService.get<number>('cloud.freePlan.billLimit') || 5;
  }
}
