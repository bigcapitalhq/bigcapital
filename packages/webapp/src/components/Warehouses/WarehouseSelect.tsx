import React from 'react';
import { FSelect } from '../Forms';
import type { Warehouse } from '@bigcapital/sdk-ts';

type FSelectProps = React.ComponentProps<typeof FSelect>;

interface WarehouseSelectProps extends Omit<FSelectProps, 'items'> {
  warehouses?: Warehouse[];
}

export function WarehouseSelect({
  warehouses = [],
  ...rest
}: WarehouseSelectProps): React.ReactElement {
  return (
    <FSelect<Warehouse>
      valueAccessor={'id'}
      labelAccessor={'code'}
      textAccessor={'name'}
      popoverProps={{ minimal: true, usePortal: true, inline: false }}
      {...rest}
      items={warehouses}
    />
  );
}
