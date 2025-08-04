// @ts-nocheck
import React from 'react';
import { Classes } from '@blueprintjs/core';
import { FSelect } from '../Forms';
import { getConditionTypeCompatators } from './utils';

export default function DynamicFilterCompatatorField({
  dataType,
  ...restProps
}) {
  const options = getConditionTypeCompatators(dataType);

  return (
    <FSelect
      textAccessor={'label'}
      valueAccessor={'value'}
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
