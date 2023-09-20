// @ts-nocheck
import React from 'react';
import { Intent, Tag } from '@blueprintjs/core';
import { Align } from '@/constants';
import styled from 'styled-components';

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
      {!!taxRate.is_compound && <CompoundText>(Compound tax)</CompoundText>}
    </>
  );
};

const DescriptionAccessor = (taxRate) => {
  return <DescriptionText>{taxRate.description}</DescriptionText>;
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

const CompoundText = styled('span')`
  color: #738091;
  margin-left: 5px;
`;

const DescriptionText = styled('span')`
  color: #5f6b7c;
`;
