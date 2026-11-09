import { useFormikContext } from 'formik';
import React, { useRef } from 'react';
import intl from 'react-intl-universal';
import { FSelect } from '../Forms';
import {
  resolveDisplayName,
  resolveDisplayNameOptions,
  DisplayNameSource,
} from './displayNameUtils';

export type DisplayNameListItem = { label: string };
type DisplayNameOption = DisplayNameListItem & { format: string };

export interface DisplayNameListProps
  extends Omit<
    React.ComponentProps<typeof FSelect>,
    'items' | 'valueAccessor' | 'textAccessor' | 'labelAccessor'
  > {}

export function DisplayNameList({
  onItemChange,
  ...restProps
}: DisplayNameListProps) {
  const { values, setFieldValue } = useFormikContext<any>();

  const source: DisplayNameSource = {
    salutation: values.salutation,
    firstName: values.firstName,
    lastName: values.lastName,
    companyName: values.companyName,
  };
  const formatOptions = resolveDisplayNameOptions(source);

  return (
    <FSelect
      items={formatOptions}
      valueAccessor={'label'}
      textAccessor={'label'}
      labelAccessor={'_label'}
      placeholder={intl.get('select_display_name_as')}
      filterable={false}
      onItemChange={(item: DisplayNameOption) => {
        setFieldValue('displayNameFormat', item.format);
        onItemChange?.(item);
      }}
      {...restProps}
    />
  );
}

/**
 * Recomputes the display name from the selected format whenever any of the
 * contact name fields change, so the selection is never lost. Attach the
 * returned handlers to the source fields' onChange events.
 */
export function useDisplayNameSynchronizer() {
  const { values, setFieldValue } = useFormikContext<any>();

  // Holds the latest form values so that handlers retained by FastField (which
  // bail out of re-rendering when their own field is unchanged) still read the
  // current display-name format and contact name fields at event time.
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const syncDisplayName = (overrides: Partial<DisplayNameSource>) => {
    const { displayNameFormat } = valuesRef.current;
    if (!displayNameFormat) return;

    const source: DisplayNameSource = {
      salutation: valuesRef.current.salutation,
      firstName: valuesRef.current.firstName,
      lastName: valuesRef.current.lastName,
      companyName: valuesRef.current.companyName,
      ...overrides,
    };
    const label = resolveDisplayName(displayNameFormat, source);
    if (label) {
      setFieldValue('displayName', label);
    }
  };

  const createFieldOnChange =
    (fieldName: keyof DisplayNameSource) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFieldValue(fieldName, value);
      syncDisplayName({ [fieldName]: value });
    };

  return { syncDisplayName, createFieldOnChange };
}
