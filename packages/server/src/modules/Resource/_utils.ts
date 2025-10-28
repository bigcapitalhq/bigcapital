import { camelCase, upperFirst } from 'lodash';
import * as pluralize from 'pluralize';

export const resourceToModelName = (resourceName: string): string => {
  return upperFirst(camelCase(pluralize.singular(resourceName)));
};
