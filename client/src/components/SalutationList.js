import React from 'react';
import { formatMessage } from 'services/intl';

import { ListSelect } from 'components';

export default function SalutationList({ ...restProps }) {
  const saluations = [
    formatMessage({ id: 'mr' }),
    formatMessage({ id: 'mrs' }),
    formatMessage({ id: 'ms' }),
    formatMessage({ id: 'miss' }),
    formatMessage({ id: 'dr' }),
  ];
  const items = saluations.map((saluation) => ({
    key: saluation,
    label: saluation,
  }));

  return (
    <ListSelect
      items={items}
      selectedItemProp={'key'}
      textProp={'label'}
      defaultText={formatMessage({ id: 'salutation' })}
      filterable={false}
      {...restProps}
    />
  );
}
