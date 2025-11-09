import React from 'react';
import intl from 'react-intl-universal';
import { FSelect } from '../Forms';

export type SalutationItem = { key: string; label: string };

export interface SalutationListProps
  extends Omit<
    React.ComponentProps<typeof FSelect>,
    'items' | 'valueAccessor' | 'textAccessor' | 'labelAccessor'
  > {}

export function SalutationList({ ...restProps }: SalutationListProps) {
  const saluations = [
    intl.get('mr'),
    intl.get('mrs'),
    intl.get('ms'),
    intl.get('miss'),
    intl.get('dr'),
  ];
  const items: SalutationItem[] = saluations.map((saluation) => ({
    key: saluation,
    label: saluation,
  }));

  return (
    <FSelect
      items={items}
      valueAccessor={'key'}
      textAccessor={'label'}
      placeholder={intl.get('salutation')}
      filterable={false}
      {...restProps}
    />
  );
}
