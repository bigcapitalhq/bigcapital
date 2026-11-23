import { Intent, Tag, Classes } from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'classnames';
import { useMemo } from 'react';
import type { TaxRate } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';

const codeAccessor = (taxRate: TaxRate) => {
  return (
    <Tag minimal={true} round={false} intent={Intent.NONE} interactive={true}>
      {taxRate.code}
    </Tag>
  );
};

const statusAccessor = (taxRate: TaxRate) => {
  return taxRate.active ? (
    <Tag round={false} intent={Intent.SUCCESS}>
      Active
    </Tag>
  ) : (
    <Tag round={false} intent={Intent.NONE}>
      Inactive
    </Tag>
  );
};

const nameAccessor = (taxRate: TaxRate) => {
  return (
    <>
      <span>{taxRate.name}</span>
      {!!taxRate.isCompound && (
        <span className={clsx(Classes.TEXT_MUTED)}>(Compound tax)</span>
      )}
    </>
  );
};

const DescriptionAccessor = (taxRate: TaxRate) => {
  return (
    <span className={clsx(Classes.TEXT_MUTED)}>{taxRate.description}</span>
  );
};

const column = createColumnHelper<BP_TableFeatures, TaxRate>();

export function useTaxRatesTableColumns() {
  return useMemo(
    () =>
      column.columns([
        column.accessor('name', {
          id: 'name',
          header: 'Name',
          size: 200,
          cell: ({ row }) => nameAccessor(row.original),
        }),
        column.accessor('code', {
          id: 'code',
          header: 'Code',
          size: 120,
          cell: ({ row }) => codeAccessor(row.original),
        }),
        column.accessor('rate', {
          id: 'rate',
          header: 'Rate',
          size: 100,
          cell: ({ row }) => row.original.rateFormatted,
          meta: { bodyCellClassName: 'numeric-cell' },
        }),
        column.accessor('description', {
          id: 'description',
          header: 'Description',
          size: 240,
          cell: ({ row }) => DescriptionAccessor(row.original),
        }),
        column.accessor('active', {
          id: 'status',
          header: 'Status',
          size: 110,
          cell: ({ row }) => statusAccessor(row.original),
        }),
      ]),
    [],
  );
}
