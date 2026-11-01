import { IPopoverProps } from '@blueprintjs/core';
import { ArrayHelpers, FormikContextType } from 'formik';

export type IResourceFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'enumeration'
  | 'boolean';

export interface IResourceField {
  name: string;
  key: string;
  fieldType: IResourceFieldType;
  options?: IFilterOption[];
}

export interface IFilterRole {
  fieldKey: string;
  comparator: string;
  condition: string;
  value: string;
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
  onClick?: () => void;
}

export interface IFilterFieldsField {
  fields: IResourceField[];
}

export interface IAdvancedFilterContextProps {
  initialCondition: IFilterRole;
  fields: IResourceField[];
  fieldsByKey: { [fieldKey: string]: IResourceField };
  getFieldMetaByKey: (key: string) => IResourceField | undefined;
}

export interface IFilterConditionContextProps {
  conditionIndex: number;
  fieldMeta?: IResourceField;
  getConditionValue: (field: keyof IFilterRole) => unknown;
  getConditionFieldPath: (field: keyof IFilterRole) => string;
  setConditionValue: (field: keyof IFilterRole, value: unknown) => void;
}

export interface IAdvancedFilterProviderProps {
  initialCondition: IFilterRole;
  fields: IResourceField[];
  children: React.ReactNode;
}

export interface IFilterConditionProviderProps {
  conditionIndex: number;
  children: React.ReactNode;
}

export interface IFilterDropdownFormikValues {
  conditions: IFilterRole[];
}

export type IAdvancedFilterDropdownConditionsProps = ArrayHelpers & {
  form: FormikContextType<IFilterDropdownFormikValues>;
};

export interface IAdvancedFilterDropdownCondition {
  conditionIndex: number;
  onRemoveClick?: (index: number) => void;
}

export interface IFilterOption {
  key: string;
  label: string;
}

export interface IAdvancedFilterValueField {
  fieldType: IResourceFieldType;
  value?: string | boolean;
  label?: string;
  options?: IFilterOption[];
  onChange?: (value: string | boolean) => void;
  isFocus?: boolean;
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
  children?: React.ReactNode;
}

export interface IDynamicFilterCompatatorFieldProps {
  dataType: IResourceFieldType;
}
