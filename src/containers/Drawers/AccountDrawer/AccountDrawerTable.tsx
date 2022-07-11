import React from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { compose } from '@/utils';
import { TableStyle } from '@/common';
import { Card, DataTable, If } from '@/components';
import { useAccountReadEntriesColumns } from './utils';
import { useAppIntlContext } from '@/components/AppIntlProvider';
import { useAccountDrawerContext } from './AccountDrawerProvider';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';

/**
 * account drawer table.
 */
function AccountDrawerTable({ closeDrawer }) {
  const { account, accounts, drawerName } = useAccountDrawerContext();

  // Account read-only entries table columns.
  const columns = useAccountReadEntriesColumns();

  // Handle view more link click.
  const handleLinkClick = () => {
    closeDrawer(drawerName);
  };
  // Application intl context.
  const { isRTL } = useAppIntlContext();

  return (
    <Card>
      <DataTable
        columns={columns}
        data={accounts}
        payload={{ account }}
        styleName={TableStyle.Constrant}
      />

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
    </Card>
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
