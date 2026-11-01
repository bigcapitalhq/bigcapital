import { Classes } from '@blueprintjs/core';
import React from 'react';
import { FSelect } from '../Forms';
import { getConditionTypeCompatators } from './utils';
import type { IDynamicFilterCompatatorFieldProps } from './interfaces';

type FSelectProps = React.ComponentProps<typeof FSelect>;

export default function DynamicFilterCompatatorField({
  dataType,
  ...restProps
}: IDynamicFilterCompatatorFieldProps & Omit<FSelectProps, 'dataType'>) {
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
