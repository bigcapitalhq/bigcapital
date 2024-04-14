import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

/**
 * Ensures that required environment variables are set and sets up the Lemon
 * Squeezy JS SDK. Throws an error if any environment variables are missing or
 * if there's an error setting up the SDK.
 */
export function configureLemonSqueezy() {
  const requiredVars = [
    'LEMONSQUEEZY_API_KEY',
    'LEMONSQUEEZY_STORE_ID',
    'LEMONSQUEEZY_WEBHOOK_SECRET',
  ];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required LEMONSQUEEZY env variables: ${missingVars.join(
        ', '
      )}. Please, set them in your .env file.`
    );
  }
  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      // eslint-disable-next-line no-console -- allow logging
      console.error(error);
      throw new Error(`Lemon Squeezy API error: ${error.message}`);
    },
  });
}
/**
 * Check if the value is an object.
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Typeguard to check if the object has a 'meta' property
 * and that the 'meta' property has the correct shape.
 */
export function webhookHasMeta(obj: unknown): obj is {
  meta: {
    event_name: string;
    custom_data: {
      user_id: string;
    };
  };
} {
  if (
    isObject(obj) &&
    isObject(obj.meta) &&
    typeof obj.meta.event_name === 'string' &&
    isObject(obj.meta.custom_data) &&
    typeof obj.meta.custom_data.user_id === 'string'
  ) {
    return true;
  }
  return false;
}

/**
 * Typeguard to check if the object has a 'data' property and the correct shape.
 *
 * @param obj - The object to check.
 * @returns True if the object has a 'data' property.
 */
export function webhookHasData(obj: unknown): obj is {
  data: {
    attributes: Record<string, unknown> & {
      first_subscription_item: {
        id: number;
        price_id: number;
        is_usage_based: boolean;
      };
    };
    id: string;
  };
} {
  return (
    isObject(obj) &&
    'data' in obj &&
    isObject(obj.data) &&
    'attributes' in obj.data
  );
}

export function createHmacSignature(secretKey, body) {
  return require('crypto')
    .createHmac('sha256', secretKey)
    .update(body)
    .digest('hex');
}

export function compareSignatures(signature, comparison_signature) {
  const source = Buffer.from(signature, 'utf8');
  const comparison = Buffer.from(comparison_signature, 'utf8');
  return require('crypto').timingSafeEqual(source, comparison);
}
