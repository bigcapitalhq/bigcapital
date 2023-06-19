// @ts-nocheck
import { ArrayHelpers } from 'formik';
import { IPopoverProps } from '@blueprintjs/core';

export type IResourceFieldType = 'text' | 'number' | 'enumeration' | 'boolean';

export interface IResourceField {
  name: string;
  key: string;
  fieldType: IResourceFieldType;
}

export interface IAdvancedFilterDropdown {
  fields: IResourceField[];
  conditions?: IFilterRole[];
  defaultFieldKey: string;
  defaultComparator?: string;
  defaultValue?: string;
  defaultCondition?: string;
  onFilterChange?: (filterRoles: IFilterRole[]) => void;
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
  value?: string;
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

export interface IConditionTypeOption {
  value: string;
  label: string;
}

export interface IConditionOption {
  label: string;
  value: string;
  text?: string;
}

export interface IAdvancedFilterPopover {
  popoverProps?: IPopoverProps;
  advancedFilterProps: IAdvancedFilterDropdown;
  children: JSX.Element | JSX.Element[];
}


export interface IDynamicFilterComparatorFieldProps {
  dataType: string;
}
