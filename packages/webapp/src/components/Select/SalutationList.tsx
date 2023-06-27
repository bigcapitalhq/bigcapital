// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { ListSelect } from './ListSelect';

export function SalutationList({ ...restProps }) {
  const salutations = [
    intl.get('mr'),
    intl.get('mrs'),
    intl.get('ms'),
    intl.get('miss'),
    intl.get('dr'),
  ];
  const items = salutations.map((salutation) => ({
    key: salutation,
    label: salutation,
  }));

  return (
    <ListSelect
      items={items}
      selectedItemProp={'key'}
      textProp={'label'}
      defaultText={intl.get('salutation')}
      filterable={false}
      {...restProps}
    />
  );
}
