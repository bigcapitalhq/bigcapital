// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useGLEntriesTableColumns } from './utils';
import { DataTable, CurrencyTag, TableSkeletonRows } from '@/components';
import { TableStyle } from '@/constants';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

/**
 * Journal entries table.
 */
export function JournalEntriesTable({ transactions, ...restProps }) {
  const columns = useGLEntriesTableColumns();

  return (
    <DataTable
      columns={columns}
      data={transactions}
      styleName={TableStyle.Constrant}
      TableLoadingRenderer={TableSkeletonRows}
      {...restProps}
    />
  );
}

/**
 *
 * @returns {React.JSX}
 */
export function AmountDisplayedBaseCurrencyMessageJSX() {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  return (
    <Message>
      {intl.get('journal_entries.amount_displayed_base_currency')}
      <CurrencyTag>{baseCurrency}</CurrencyTag>
    </Message>
  );
}

export const AmountDisplayedBaseCurrencyMessage =
  AmountDisplayedBaseCurrencyMessageJSX;

const Message = styled.div`
  font-size: 10px;
  margin-bottom: 12px;
`;
