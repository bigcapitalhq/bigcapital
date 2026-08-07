import React from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAccountDrawerContext } from './AccountDrawerProvider';
import { AccountDrawerTableHeader } from './AccountDrawerTableHeader';
import { AccountDrawerTableOptionsProvider } from './AccountDrawerTableOptionsProvider';
import { useAccountReadEntriesColumns } from './utils';
import { Card, DataTable, If } from '@/components';
import { useAppIntlContext } from '@/components/AppIntlProvider';
import { TableStyle } from '@/constants';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

/**
 * account drawer table.
 */
function AccountDrawerTableInner({ closeDrawer }: WithDrawerActionsProps) {
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

        <If condition={(accounts?.length ?? 0) > 0}>
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
      data={accounts ?? []}
      payload={{ account }}
      styleName={TableStyle.Constrant}
    />
  );
}

export const AccountDrawerTable = compose(withDrawerActions)(
  AccountDrawerTableInner,
);

const TableFooter = styled.div`
  --x-border-color: #d2dde2;

  .bp4-dark & {
    --x-border-color: var(--color-dark-gray5);
  }
  padding: 6px 14px;
  display: block;
  border-top: 1px solid var(--x-border-color);
  border-bottom: 1px solid var(--x-border-color);
  font-size: 12px;
`;
