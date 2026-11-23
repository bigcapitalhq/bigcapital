import { SetMetadata } from '@nestjs/common';

export const SKIP_SUBSCRIPTION_CHECK_KEY = 'SKIP_SUBSCRIPTION_CHECK';

/**
 * Exempts a controller or endpoint from subscription access checks.
 *
 * Used by billing, onboarding, and invitation routes that must keep working
 * while an organization is read-only.
 */
export const SkipSubscriptionCheck = () =>
  SetMetadata(SKIP_SUBSCRIPTION_CHECK_KEY, true);
