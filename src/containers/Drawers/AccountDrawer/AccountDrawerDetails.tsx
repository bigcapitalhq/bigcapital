// @ts-nocheck
import React from 'react';

import { Card } from '@/components';

import AccountDrawerActionBar from './AccountDrawerActionBar';
import AccountDrawerHeader from './AccountDrawerHeader';
import AccountDrawerTable from './AccountDrawerTable';

/**
 * Account view details.
 */
export default function AccountDrawerDetails() {
  return (
    <div className={'account-drawer'}>
      <AccountDrawerActionBar />

      <Card className={'card-header'}>
        <AccountDrawerHeader />
      </Card>
      <AccountDrawerTable />
    </div>
  );
}
