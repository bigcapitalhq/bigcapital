import { Intent, Tag, Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import type { TaxRate } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';

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

/**
 * Retrieves the tax rates table columns.
 */
export const useTaxRatesTableColumns = () => {
  return [
    {
      Header: 'Name',
      accessor: nameAccessor,
      width: 60,
    },
    {
      Header: 'Code',
      accessor: codeAccessor,
      width: 40,
    },
    {
      Header: 'Rate',
      accessor: 'rateFormatted',
      align: Align.Right,
      width: 30,
    },
    {
      Header: 'Description',
      accessor: DescriptionAccessor,
      width: 100,
    },
    {
      Header: 'Status',
      accessor: statusAccessor,
      width: 30,
      align: Align.Right,
    },
  ];
};
