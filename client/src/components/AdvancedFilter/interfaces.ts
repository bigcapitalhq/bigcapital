import { ArrayHelpers } from 'formik';

export type IResourceFieldType = 'text' | 'number' | 'enumeration' | 'boolean';

export interface IResourceField {
  name: string;
  key: string;
  fieldType: IResourceFieldType;
}

export interface IAdvancedFilterDropdown {
  fields: IResourceField[];
  defaultFieldKey: string;
  defaultComparator?: string;
  defaultValue?: string;
}

export interface IAdvancedFilterDropdownFooter {
  onClick?: Function;
}

export interface IFilterFieldsField {
  fields: IResourceField[];
}

export interface IFilterRole {
  fieldKey: string;
  comparator: string;
  condition: string;
  value: string;
}

export interface IAdvancedFilterContextProps {
  initialCondition: IFilterRole;
  fields: IResourceField[];
  fieldsByKey: { [fieldKey: string]: IResourceField };
}

export interface IFilterConditionContextProps {
  conditionIndex: number;
}

export interface IAdvancedFilterProviderProps {
  initialCondition: IFilterRole;
  fields: IResourceField[];
  children: JSX.Element | JSX.Element[];
}

export interface IFilterConditionProviderProps {
  conditionIndex: number;
  children: JSX.Element | JSX.Element[];
}

export interface IFilterDropdownFormikValues {
  conditions: IFilterRole[];
}

export type IAdvancedFilterDropdownConditionsProps = ArrayHelpers;

export interface IAdvancedFilterDropdownCondition {
  conditionIndex: number;
  onRemoveClick: Function;
}

export interface IFilterOption {
  key: string;
  label: string;
}

export interface IAdvancedFilterValueField {
  fieldType: string;
  key: string;
  label: string;
  options?: IFilterOption[];
  onChange: Function;
}

export enum IFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  ENUMERATION = 'enumeration',
  BOOLEAN = 'boolean',
}
