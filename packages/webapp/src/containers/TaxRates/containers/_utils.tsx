// @ts-nocheck
import React from 'react';
import { Intent, Tag } from '@blueprintjs/core';
import { Align } from '@/constants';

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

/**
 * Retrieves the tax rates table columns.
 */
export const useTaxRatesTableColumns = () => {
  return [
    {
      Header: 'Name',
      accessor: 'name',
      width: 50,
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
      accessor: 'description',
      width: 110,
    },
    {
      Header: 'Status',
      accessor: statusAccessor,
      width: 30,
      align: Align.Right,
    },
  ];
};
