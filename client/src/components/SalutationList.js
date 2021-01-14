import React from 'react';
import {
  ListSelect,
} from 'components';

export default function SalutationList({
  ...restProps
}) {
  const saluations = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.'];
  const items = saluations.map((saluation) => ({ key: saluation, label: saluation }));

  return (
    <ListSelect
      items={items}
      selectedItemProp={'key'}
      textProp={'label'}
      defaultText={'Salutation'}
      filterable={false}
      {...restProps}
    />
  );
}
