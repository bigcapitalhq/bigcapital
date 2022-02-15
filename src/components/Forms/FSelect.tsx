// @ts-nocheck
import React from 'react';
import {
  Select as BPSelect,
  SelectProps as BPSelectProps,
} from '@blueprintjs/select';
import { Field, FieldProps, FieldConfig, isFunction } from 'formik';
import { get } from 'lodash';

interface SelectProps
  extends Omit<FieldConfig, 'children' | 'as' | 'component'>,
    BPSelectProps<any> {
  valueAccessor: string;
  labelAccessor: string;
  input: () => JSX.Element;
}

interface FieldToSelectProps
  extends Omit<BPSelectProps<any>, 'onItemSelect'>,
    FieldProps {
  onItemSelect?: (item: any, event?: React.SyntheticEvent<HTMLElement>) => void;
  valueAccessor: string;
  labelAccessor: string;
  input: (props: { activeItem: any; label: any }) => JSX.Element;
  children: JSX.Element;
}

const getAccessor = (accessor: any, activeItem: any) => {
  return isFunction(accessor)
    ? accessor(activeItem)
    : get(activeItem, accessor);
};

/**
 * Transform field props to select props.
 * @param   {FieldToSelectProps}
 * @returns {BPSelectProps<any> }
 */
function transformSelectToFieldProps({
  field: { onBlur: onFieldBlur, ...field },
  form: { touched, errors, ...form },
  meta,
  input,
  valueAccessor,
  labelAccessor,
  ...props
}: FieldToSelectProps): BPSelectProps<any> {
  const activeItem = props.items.find(
    (item) => getAccessor(valueAccessor, item) === field.value
  );
  const children = input
    ? input({
        activeItem,
        label: getAccessor(labelAccessor, activeItem),
      })
    : props.children;

  return {
    onItemSelect: (item) => {
      const value = getAccessor(valueAccessor, item);
      form.setFieldValue(field.name, value);
    },
    activeItem,
    ...props,
    children,
  };
}

/**
 *
 * @param   {FieldToSelectProps}
 * @returns {JSX.Element}
 */
function FieldToSelect({ ...props }: FieldToSelectProps): JSX.Element {
  return <BPSelect {...transformSelectToFieldProps(props)} />;
}

/**
 * Select binded with formik.
 * @param   {JSX.Element}
 * @returns {SelectProps}
 */
export function FSelect({ ...props }: SelectProps): JSX.Element {
  return <Field {...props} component={FieldToSelect} />;
}