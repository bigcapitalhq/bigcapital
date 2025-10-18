import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { FSelect } from '../Forms';
import { useFormikContext } from 'formik';

export type DisplayNameListItem = { label: string };

export interface DisplayNameListProps
  extends Omit<
    React.ComponentProps<typeof FSelect>,
    'items' | 'valueAccessor' | 'textAccessor' | 'labelAccessor'
  > {}

export function DisplayNameList({ ...restProps }: DisplayNameListProps) {
  const {
    values: {
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      salutation,
    },
  } = useFormikContext<any>();

  const formats = useMemo(
    () => [
      {
        format: '{1} {2} {3}',
        values: [salutation, firstName, lastName],
        required: [1],
      },
      { format: '{1} {2}', values: [firstName, lastName], required: [] },
      { format: '{1}, {2}', values: [firstName, lastName], required: [1, 2] },
      { format: '{1}', values: [companyName], required: [1] },
    ],
    [firstName, lastName, companyName, salutation],
  );

  const formatOptions: DisplayNameListItem[] = useMemo(
    () =>
      formats
        .filter(
          (format) =>
            !format.values.some((value, index) => {
              return !value && format.required.indexOf(index + 1) !== -1;
            }),
        )
        .map((formatOption) => {
          const { format, values } = formatOption;
          let label = format;

          values.forEach((value, index) => {
            const replaceWith = value || '';
            label = label.replace(`{${index + 1}}`, replaceWith).trim();
          });
          return { label: label.replace(/\s+/g, ' ') };
        }),
    [formats],
  );

  return (
    <FSelect
      items={formatOptions}
      valueAccessor={'label'}
      textAccessor={'label'}
      placeholder={intl.get('select_display_name_as')}
      filterable={false}
      {...restProps}
    />
  );
}
