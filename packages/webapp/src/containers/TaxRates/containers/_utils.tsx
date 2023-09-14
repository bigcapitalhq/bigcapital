// @ts-nocheck
import React from 'react';
import { Button, Intent, Tag, Icon } from '@blueprintjs/core';
import { Align } from '@/constants';
import { FormatDateCell } from '@/components';

const codeAccessor = (taxRate) => {
  return (
    <Tag minimal={true} round={false} intent={Intent.NONE} interactive={true}>
      {taxRate.code}
    </Tag>
  );
};

const statusAccessor = (taxRate) => {
  return (
    <Tag round={false} intent={Intent.SUCCESS}>
      Active
    </Tag>
  );
};

export const useTaxRatesTableColumns = () => {
  return [
    {
      Header: 'Name',
      accessor: 'name',
      width: 40,
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
      accessor: () => <span>Specital tax for certain goods and services.</span>,
      width: 120,
    },
    {
      Header: 'Status',
      accessor: statusAccessor,
      width: 30,
      align: Align.Right,
    },
  ];
};
