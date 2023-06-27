// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import * as R from 'ramda';

import { DataTable, CurrencyTag, TableSkeletonRows } from '@/components';
import { TableStyle } from '@/constants';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import { useGLEntriesTableColumns } from './utils';

/**
 * Journal entries table.
 */
export default function JournalEntriesTable({ transactions, ...restProps }) {
  const columns = useGLEntriesTableColumns();

  return (
    <DataTable
      columns={columns}
      data={transactions}
      styleName={TableStyle.Constraint}
      TableLoadingRenderer={TableSkeletonRows}
      {...restProps}
    />
  );
}

/**
 *
 * @returns {React.JSX}
 */
export function AmountDisplayedBaseCurrencyMessageJSX({
  organization: { base_currency: baseCurrency },
}) {
  return (
    <Message>
      {intl.get('journal_entries.amount_displayed_base_currency')}
      <CurrencyTag>{baseCurrency}</CurrencyTag>
    </Message>
  );
}

export const AmountDisplayedBaseCurrencyMessage = R.compose(
  withCurrentOrganization(),
)(AmountDisplayedBaseCurrencyMessageJSX);

const Message = styled.div`
  font-size: 10px;
  margin-bottom: 12px;
`;
