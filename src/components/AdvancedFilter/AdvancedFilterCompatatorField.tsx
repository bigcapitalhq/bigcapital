// @ts-nocheck
import React from 'react';
import { Classes } from '@blueprintjs/core';
import { ListSelect } from '../Select';
import { getConditionTypeCompatators } from './utils';

export default function DynamicFilterCompatatorField({
  dataType,
  ...restProps
}) {
  const options = getConditionTypeCompatators(dataType);

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
