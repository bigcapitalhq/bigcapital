import { SetMetadata } from '@nestjs/common';
import { SubscriptionFeature } from '../SubscriptionFeatures';

export const REQUIRED_SUBSCRIPTION_FEATURE_KEY =
  'REQUIRED_SUBSCRIPTION_FEATURE';

export interface RequireSubscriptionFeatureOptions {
  /**
   * Allow access while the organization is on a trial.
   * @default true
   */
  allowTrial?: boolean;

  /**
   * Allow access on self-hosted installations.
   * @default true
   */
  allowSelfHosted?: boolean;

  /**
   * Only enforce the feature check on mutating HTTP methods.
   * @default false
   */
  writeOnly?: boolean;

  /**
   * Only enforce the check on these HTTP methods.
   */
  methods?: string[];

  /**
   * Allow access while the subscription is inactive.
   * @default false
   */
  allowInactive?: boolean;

  /**
   * Additional plan slugs or family slugs that always grant access.
   */
  allowPlans?: string[];

  /**
   * Whether the Go plan grants access to every feature.
   * @default true
   */
  allowGoPlan?: boolean;

  /**
   * Overrides the default feature-not-available error type.
   */
  errorType?: string;

  /**
   * Overrides the default feature-not-available message.
   */
  errorMessage?: string;
}

export interface RequiredSubscriptionFeatureMetadata {
  feature: SubscriptionFeature | string;
  options: RequireSubscriptionFeatureOptions;
}

/**
 * Protects a controller or endpoint with a subscription feature check.
 *
 * The guard is registered globally, so handlers only need this metadata.
 * The Go plan is allowed to access every feature.
 *
 * @example
 * ```ts
 * @RequireSubscriptionFeature(SubscriptionFeature.SaleInvoices)
 * @Controller('sale-invoices')
 * export class SaleInvoicesController {}
 * ```
 *
 * @example
 * ```ts
 * @RequireSubscriptionFeature(SubscriptionFeature.Branches, {
 *   writeOnly: true,
 *   allowTrial: true,
 * })
 * @Post()
 * createBranch() {}
 * ```
 */
export const RequireSubscriptionFeature = (
  feature: SubscriptionFeature | string,
  options: RequireSubscriptionFeatureOptions = {},
) => SetMetadata(REQUIRED_SUBSCRIPTION_FEATURE_KEY, { feature, options });
