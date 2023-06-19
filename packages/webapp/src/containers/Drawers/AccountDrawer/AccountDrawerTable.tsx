// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { Card, DataTable, If } from '@/components';
import { AccountDrawerTableOptionsProvider } from './AccountDrawerTableOptionsProvider';
import { AccountDrawerTableHeader } from './AccountDrawerTableHeader';

import { useAccountReadEntriesColumns } from './utils';
import { useAppIntlContext } from '@/components/AppIntlProvider';
import { useAccountDrawerContext } from './AccountDrawerProvider';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';

/**
 * account drawer table.
 */
function AccountDrawerTable({ closeDrawer }) {
  const { accounts, drawerName } = useAccountDrawerContext();

  // Handle view more link click.
  const handleLinkClick = () => {
    closeDrawer(drawerName);
  };
  // Application intl context.
  const { isRTL } = useAppIntlContext();

  return (
    <Card>
      <AccountDrawerTableOptionsProvider>
        <AccountDrawerTableHeader />
        <AccountDrawerDataTable />

        <If condition={accounts.length > 0}>
          <TableFooter>
            <Link
              to={`/financial-reports/general-ledger`}
              onClick={handleLinkClick}
            >
              {isRTL ? '→' : '←'} {intl.get('view_more_transactions')}
            </Link>
          </TableFooter>
        </If>
      </AccountDrawerTableOptionsProvider>
    </Card>
  );
}

function AccountDrawerDataTable() {
  const { account, accounts } = useAccountDrawerContext();

  // Account read-only entries table columns.
  const columns = useAccountReadEntriesColumns();

  return (
    <DataTable
      columns={columns}
      data={accounts}
      payload={{ account }}
      styleName={TableStyle.Constraint}
    />
  );
}

export default compose(withDrawerActions)(AccountDrawerTable);

const TableFooter = styled.div`
  padding: 6px 14px;
  display: block;
  border-top: 1px solid #d2dde2;
  border-bottom: 1px solid #d2dde2;
  font-size: 12px;
`;
