import { Inject, Injectable } from '@nestjs/common';
import { Plan } from '../models/Plan';
import { formatNumber } from '@/utils/format-number';

export interface SubscriptionPlanPrice {
  slug: string;
  interval: string;
  intervalCount: number;
  amount: number;
  amountFormatted: string;
  priceLabel: string;
}

export interface SubscriptionPlanGroup {
  slug: string;
  name: string;
  description: string;
  features: unknown[];
  featured: boolean;
  prices: SubscriptionPlanPrice[];
}

@Injectable()
export class GetPlansService {
  constructor(
    @Inject(Plan.name)
    private readonly planModel: typeof Plan,
  ) {}

  /**
   * Retrieves the Cloud plan catalog grouped by family.
   */
  public async getPlans(): Promise<SubscriptionPlanGroup[]> {
    const plans = await this.planModel
      .query()
      .where('active', true)
      .where('price', '>', 0)
      .whereNotNull('familySlug')
      .orderBy([
        { column: 'index', order: 'asc' },
        { column: 'id', order: 'asc' },
      ]);

    const groups = new Map<string, SubscriptionPlanGroup>();

    for (const plan of plans) {
      const familySlug = plan.familySlug || plan.slug;
      const group = groups.get(familySlug) || {
        slug: familySlug,
        name: plan.name,
        description: plan.desc || '',
        features: this.parseFeatures(plan.features),
        featured: !!plan.isFeatured,
        prices: [],
      };

      group.prices.push({
        slug: plan.slug,
        interval: plan.invoiceInterval || 'month',
        intervalCount: Number(plan.invoicePeriod) || 1,
        amount: Number(plan.price),
        amountFormatted: formatNumber(plan.price, {
          currencyCode: plan.currency,
          money: true,
          precision: 0,
        }),
        priceLabel: plan.invoiceInterval === 'year' ? 'Per year' : 'Per month',
      });

      groups.set(familySlug, group);
    }

    return Array.from(groups.values());
  }

  /**
   * Parses the JSON features column.
   */
  private parseFeatures(features: unknown): unknown[] {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}
