import config from '@/config';

export const isStripePaymentConfigured = () => {
  return (
    config.stripePayment.secretKey &&
    config.stripePayment.publishableKey &&
    config.stripePayment.webhooksSecret
  );
};
