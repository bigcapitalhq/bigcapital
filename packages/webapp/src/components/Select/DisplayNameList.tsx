import { useFormikContext } from 'formik';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { FSelect } from '../Forms';

export type DisplayNameListItem = { label: string };
type DisplayNameFormat = {
  format: string;
  values: Array<string | undefined>;
  required: number[];
};

export interface DisplayNameListProps
  extends Omit<
    React.ComponentProps<typeof FSelect>,
    'items' | 'valueAccessor' | 'textAccessor' | 'labelAccessor'
  > {}

function useDisplayNameFormatOptions(
  salutation?: string,
  firstName?: string,
  lastName?: string,
  companyName?: string,
): DisplayNameListItem[] {
  return useMemo(() => {
    const formats: DisplayNameFormat[] = [
      {
        format: '{1} {2} {3}',
        values: [salutation, firstName, lastName],
        required: [1],
      },
      { format: '{1} {2}', values: [firstName, lastName], required: [] },
      { format: '{1}, {2}', values: [firstName, lastName], required: [1, 2] },
      { format: '{1}', values: [companyName], required: [1] },
    ];

    return formats
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
        return {
          label: label.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim(),
        };
      })
      .filter(({ label }) => Boolean(label));
  }, [salutation, firstName, lastName, companyName]);
}

export function DisplayNameList({ ...restProps }: DisplayNameListProps) {
  const {
    values: {
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      salutation,
    },
  } = useFormikContext<any>();

  const formatOptions = useDisplayNameFormatOptions(
    salutation,
    firstName,
    lastName,
    companyName,
  );

  return (
    <FSelect
      items={formatOptions}
      valueAccessor={'label'}
      textAccessor={'label'}
      labelAccessor={'_label'}
      placeholder={intl.get('select_display_name_as')}
      filterable={false}
      {...restProps}
    />
  );
}
