// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { ListSelect } from './ListSelect';

export function DisplayNameList({
  salutation,
  firstName,
  lastName,
  company,
  ...restProps
}) {
  const formats = [
    {
      format: '{1} {2} {3}',
      values: [salutation, firstName, lastName],
      required: [1],
    },
    { format: '{1} {2}', values: [firstName, lastName], required: [] },
    { format: '{1}, {2}', values: [firstName, lastName], required: [1, 2] },
    { format: '{1}', values: [company], required: [1] },
  ];

  const formatOptions = formats
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
    });

  return (
    <ListSelect
      items={formatOptions}
      selectedItemProp={'label'}
      textProp={'label'}
      defaultText={intl.get('select_display_name_as')}
      filterable={false}
      {...restProps}
    />
  );
}
