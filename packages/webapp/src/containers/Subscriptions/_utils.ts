// @ts-nocheck
export const getSubscriptionStatusText = (subscription) => {
  if (subscription.status === 'on_trial') {
    return subscription.onTrial
      ? `Trials ends in ${subscription.trialEndsAtFormatted}`
      : `Trial ended ${subscription.trialEndsAtFormatted}`;
  } else if (subscription.status === 'active') {
    return subscription.endsAtFormatted
      ? `Renews in ${subscription.endsAtFormatted}`
      : 'Lifetime subscription';
  } else if (subscription.status === 'canceled') {
    return subscription.ended
      ? `Expires ${subscription.endsAtFormatted}`
      : `Expired ${subscription.endsAtFormatted}`;
  }
  return '';
};
