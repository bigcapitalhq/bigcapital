// @ts-nocheck
import React from 'react';
import { Classes } from '@blueprintjs/core';
import { ListSelect } from '../Select';
import { getConditionTypeComparators } from './utils';

export default function DynamicFilterComparatorField({
  dataType,
  ...restProps
}) {
  const options = getConditionTypeComparators(dataType);

  return (
    <ListSelect
      textProp={'label'}
      selectedItemProp={'value'}
      items={options}
      className={Classes.FILL}
      filterable={false}
      popoverProps={{
        inline: true,
        minimal: true,
        captureDismiss: true,
      }}
      {...restProps}
    />
  );
}
