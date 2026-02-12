// @ts-nocheck
import React from 'react';
import { Intent, Tag, Classes } from '@blueprintjs/core';
import { Align } from '@/constants';
import clsx from 'classnames';

const codeAccessor = (taxRate) => {
  return (
    <Tag minimal={true} round={false} intent={Intent.NONE} interactive={true}>
      {taxRate.code}
    </Tag>
  );
};

const statusAccessor = (taxRate) => {
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

const nameAccessor = (taxRate) => {
  return (
    <>
      <span>{taxRate.name}</span>
      {!!taxRate.is_compound && (
        <span className={clsx(Classes.TEXT_MUTED)}>(Compound tax)</span>
      )}
    </>
  );
};

const DescriptionAccessor = (taxRate) => {
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
      accessor: 'rate_formatted',
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

