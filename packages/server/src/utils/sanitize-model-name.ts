import { camelCase, upperFirst } from 'lodash';

export const sanitizeModelName = (modelName: string) => {
  return upperFirst(camelCase(modelName));
}