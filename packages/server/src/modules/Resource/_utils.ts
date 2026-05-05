import { camelCase, upperFirst } from 'lodash';
import * as pluralize from 'pluralize';

// Webapp resource names that don't match their model class names.
// Add new entries when you see a "Nest could not find X element" error
// at ResourceService.getResourceModel for a name the webapp sends.
const RESOURCE_NAME_ALIASES: Record<string, string> = {
  PaymentReceive: 'PaymentReceived',
};

export const resourceToModelName = (resourceName: string): string => {
  const normalized = upperFirst(camelCase(pluralize.singular(resourceName)));
  return RESOURCE_NAME_ALIASES[normalized] || normalized;
};
