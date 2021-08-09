import intl from 'react-intl-universal';
import { IResourceField, IFilterRole } from './interfaces';
import { uniqueMultiProps, checkRequiredProperties } from 'utils';

interface IConditionOption {
  label: string;
  value: string;
}

// Conditions options.
export const getConditionalsOptions = (): IConditionOption[] => [
  { value: 'and', label: intl.get('and') },
  { value: 'or', label: intl.get('or') },
];

interface IConditionTypeOption {
  value: string;
  label: string;
}

export const getBooleanCompatators = (): IConditionTypeOption[] => [
  { value: 'is', label: 'is' },
  { value: 'is_not', label: 'is_not' },
];

export const getTextCompatators = (): IConditionTypeOption[] => [
  { value: 'contain', label: 'contain' },
  { value: 'not_contain', label: 'not_contain' },
  { value: 'equals', label: 'equals' },
  { value: 'not_equal', label: 'not_equals' },
];

export const getDateCompatators = (): IConditionTypeOption[] => [
  { value: 'in', label: 'in' },
  { value: 'after', label: 'after' },
  { value: 'before', label: 'before' },
];

export const getOptionsCompatators = (): IConditionTypeOption[] => [
  { value: 'is', label: 'is' },
  { value: 'is_not', label: 'is_not' },
];

export const getNumberCampatators = (): IConditionTypeOption[] => [
  { value: 'equals', label: 'equals' },
  { value: 'not_equal', label: 'not_equal' },
  { value: 'bigger_than', label: 'bigger_than' },
  { value: 'bigger_or_equals', label: 'bigger_or_equals' },
  { value: 'smaller_than', label: 'smaller_than' },
  { value: 'smaller_or_equals', label: 'smaller_or_equals' },
];

export const getConditionTypeCompatators = (
  dataType: string,
): IConditionTypeOption[] => {
  return [
    ...(dataType === 'options'
      ? [...getOptionsCompatators()]
      : dataType === 'date'
      ? [...getDateCompatators()]
      : dataType === 'boolean'
      ? [...getBooleanCompatators()]
      : dataType === 'number'
      ? [...getNumberCampatators()]
      : [...getTextCompatators()]),
  ];
};

export const getConditionDefaultCompatator = (
  dataType: string,
): IConditionTypeOption => {
  const compatators = getConditionTypeCompatators(dataType);
  return compatators[0];
};

export const transformFieldsToOptions = (fields: IResourceField[]) =>
  fields.map((field) => ({
    value: field.key,
    label: field.name,
  }));

/**
 * Filtered conditions that don't contain atleast on required fields or
 * fileds keys that not exists.
 * @param {IFilterRole[]} conditions
 * @returns
 */
export const filterConditionRoles = (
  conditions: IFilterRole[],
): IFilterRole[] => {
  const requiredProps = ['fieldKey', 'condition', 'comparator', 'value'];

  const filteredConditions = conditions.filter(
    (condition: IFilterRole) =>
      !checkRequiredProperties(condition, requiredProps),
  );
  return uniqueMultiProps(filteredConditions, requiredProps);
};
