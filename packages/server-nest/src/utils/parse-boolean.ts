import { isEmpty } from 'lodash';

const booleanValuesRepresentingTrue: string[] = ['true', '1'];
const booleanValuesRepresentingFalse: string[] = ['false', '0'];

const normalizeValue = (value: any): string =>
  value?.toString().trim().toLowerCase();

const booleanValues: string[] = [
  ...booleanValuesRepresentingTrue,
  ...booleanValuesRepresentingFalse,
].map((value) => normalizeValue(value));

export const parseBoolean = <T>(value: any, defaultValue: T): T | boolean => {
  if (typeof value === 'boolean') {
    return value; // Retrun early we have nothing to parse.
  }
  const normalizedValue = normalizeValue(value);
  if (isEmpty(value) || booleanValues.indexOf(normalizedValue) === -1) {
    return defaultValue;
  }
  return booleanValuesRepresentingTrue.indexOf(normalizedValue) !== -1;
};
