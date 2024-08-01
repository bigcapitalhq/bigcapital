import { Transformer } from '@/lib/Transformer/Transformer';

export class GetSubscriptionsTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'canceledAtFormatted',
      'endsAtFormatted',
      'trialStartsAtFormatted',
      'trialEndsAtFormatted',
      'statusFormatted',
      'planName',
      'planSlug',
      'planPrice',
      'planPriceCurrency',
      'planPriceFormatted',
      'planPeriod',
      'lemonUrls',
    ];
  };

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['id', 'plan'];
  };

  /**
   * Retrieves the canceled at formatted.
   * @param subscription
   * @returns {string}
   */
  public canceledAtFormatted = (subscription) => {
    return subscription.canceledAt
      ? this.formatDate(subscription.canceledAt)
      : null;
  };

  /**
   * Retrieves the ends at date formatted.
   * @param subscription
   * @returns {string}
   */
  public endsAtFormatted = (subscription) => {
    return subscription.cancelsAt
      ? this.formatDate(subscription.endsAt)
      : null;
  };

  /**
   * Retrieves the trial starts at formatted date.
   * @returns {string}
   */
  public trialStartsAtFormatted = (subscription) => {
    return subscription.trialStartsAt
      ? this.formatDate(subscription.trialStartsAt)
      : null;
  };

  /**
   * Retrieves the trial ends at formatted date.
   * @returns {string}
   */
  public trialEndsAtFormatted = (subscription) => {
    return subscription.trialEndsAt
      ? this.formatDate(subscription.trialEndsAt)
      : null;
  };

  /**
   * Retrieves the Lemon subscription metadata.
   * @param subscription
   * @returns
   */
  public lemonSubscription = (subscription) => {
    return (
      this.options.lemonSubscriptions[subscription.lemonSubscriptionId] || null
    );
  };

  /**
   * Retrieves the formatted subscription status.
   * @param subscription
   * @returns {string}
   */
  public statusFormatted = (subscription) => {
    const pairs = {
      canceled: 'Canceled',
      active: 'Active',
      inactive: 'Inactive',
      expired: 'Expired',
      on_trial: 'On Trial',
    };
    return pairs[subscription.status] || '';
  };

  /**
   * Retrieves the subscription plan name.
   * @param subscription
   * @returns {string}
   */
  public planName(subscription) {
    return subscription.plan?.name;
  }

  /**
   * Retrieves the subscription plan slug.
   * @param subscription
   * @returns {string}
   */
  public planSlug(subscription) {
    return subscription.plan?.slug;
  }

  /**
   * Retrieves the subscription plan price.
   * @param subscription 
   * @returns {number}
   */
  public planPrice(subscription) {
    return subscription.plan?.price;
  }

  /**
   * Retrieves the subscription plan price currency.
   * @param subscription 
   * @returns {string}
   */
  public planPriceCurrency(subscription) {
    return subscription.plan?.currency;
  }

  /**
   * Retrieves the subscription plan formatted price.
   * @param subscription 
   * @returns {string}
   */
  public planPriceFormatted(subscription) {
    return this.formatMoney(subscription.plan?.price, {
      currencyCode: subscription.plan?.currency,
      precision: 0
    });
  }

  /**
   * Retrieves the subscription plan period.
   * @param subscription 
   * @returns {string}
   */
  public planPeriod(subscription) {
    return subscription?.plan?.period;
  }

  /**
   * Retrieve the subscription Lemon Urls.
   * @param subscription
   * @returns
   */
  public lemonUrls = (subscription) => {
    const lemonSusbcription = this.lemonSubscription(subscription);
    return lemonSusbcription?.data?.attributes?.urls;
  };
}
