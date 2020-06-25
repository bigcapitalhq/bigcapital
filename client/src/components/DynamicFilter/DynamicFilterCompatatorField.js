import React, { useMemo } from 'react';
import { HTMLSelect, Classes } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { getConditionTypeCompatators } from './DynamicFilterCompatators';

export default function DynamicFilterCompatatorField({
  dataType,
  ...restProps
}) {
  const { formatMessage } = useIntl();

  const options = useMemo(
    () => getConditionTypeCompatators(dataType).map(comp => ({
      value: comp.value, label: formatMessage({ id: comp.label_id }),
    })),
    [dataType]
  );

  return (
    <HTMLSelect
      options={options}
      className={Classes.FILL}
      {...{ ...restProps }}
    />
  );
}
